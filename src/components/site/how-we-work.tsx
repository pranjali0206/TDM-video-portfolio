import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { useExperience } from "./experience";
import { Artboard } from "./how-we-work/artboard";
import { growthSteps, loopStrip, type GrowthStep, type GrowthStepId } from "./how-we-work/data";
import { GrowthMotionContext } from "./how-we-work/motion";
import { StepAutomate } from "./how-we-work/step-automate";
import { StepClose } from "./how-we-work/step-close";
import { StepConvince } from "./how-we-work/step-convince";
import { StepCreate } from "./how-we-work/step-create";
import { StepReach } from "./how-we-work/step-reach";

const STEP_COUNT = growthSteps.length;
const AUTOPLAY_MS = 8000;
/** Desktop scroll distance per step while the engine is pinned, in viewport heights. */
const SCROLL_PER_STEP = 0.8;

const SECTION_BACKGROUND = [
  "radial-gradient(45% 55% at 100% 0%, rgba(79,208,204,.35) 0%, rgba(79,208,204,0) 70%)",
  "radial-gradient(40% 50% at 0% 100%, rgba(215,233,138,.45) 0%, rgba(215,233,138,0) 70%)",
  "radial-gradient(30% 40% at 100% 100%, rgba(232,105,58,.16) 0%, rgba(232,105,58,0) 70%)",
  "var(--hero-base)",
].join(", ");

export type HowWeWorkProps = {
  /**
   * Desktop only. "autoplay" (default) lets the section scroll past like any other
   * and cycles the steps every 8s while it is on screen; "scroll" pins the engine
   * and scrubs one step per 80vh of scroll.
   */
  mode?: "scroll" | "autoplay";
  /** A live Meta Ads campaign video for step 02. The "Watch a live campaign" pill hides without it. */
  reachVideoUrl?: string | undefined;
};

type Layout = "desktop" | "tablet" | "mobile";

/** Breakpoint and motion preference, known only after mount (null on the server). */
function useEnvironment() {
  const [env, setEnv] = useState<{ layout: Layout; reduced: boolean } | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnv({
        layout: desktop.matches ? "desktop" : tablet.matches ? "tablet" : "mobile",
        reduced: reduced.matches,
      });
    update();
    const queries = [desktop, tablet, reduced];
    queries.forEach((query) => query.addEventListener("change", update));
    return () => queries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  return env;
}

/** True while `ref` is within `rootMargin` of the viewport. */
function useInView(ref: RefObject<Element | null>, rootMargin = "0px", threshold = 0) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);
  return inView;
}

/** Advances `step` every 8s while `enabled`; `restart` changes reset the clock. */
function useAutoplay(
  enabled: boolean,
  step: number,
  restart: unknown,
  setStep: (update: (step: number) => number) => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(
      () => setStep((current) => (current + 1) % STEP_COUNT),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [enabled, step, restart, setStep]);
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

/** The active step's visual on its 760px artboard; remounts (and replays) per step. */
function StepVisual({
  id,
  reachVideoUrl,
}: {
  id: GrowthStepId;
  reachVideoUrl?: string | undefined;
}) {
  switch (id) {
    case "create":
      return (
        <Artboard>
          <div className="h-[500px] w-[760px]">
            <StepCreate />
          </div>
        </Artboard>
      );
    case "reach":
      return (
        <Artboard height={490}>
          <StepReach videoUrl={reachVideoUrl} />
        </Artboard>
      );
    case "convince":
      return (
        <Artboard>
          <StepConvince />
        </Artboard>
      );
    case "close":
      return (
        <Artboard>
          <StepClose />
        </Artboard>
      );
    case "automate":
      return (
        <Artboard>
          <StepAutomate />
        </Artboard>
      );
  }
}

function StepNumber({ step, active }: { step: GrowthStep; active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-medium",
        !active && "border border-outline text-hero-muted",
      )}
      style={active ? { background: step.color, color: step.ink } : undefined}
    >
      {step.num}
    </span>
  );
}

function Stage({
  step,
  reachVideoUrl,
  className,
}: {
  step: number;
  reachVideoUrl?: string | undefined;
  className?: string;
}) {
  const current = growthSteps[step] ?? growthSteps[0]!;
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-1 items-center overflow-hidden rounded-[32px] border border-white/95 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_30px_80px_rgba(15,122,120,0.12)]",
        className,
      )}
    >
      <p className="sr-only" aria-live="polite">
        Step {current.num}: {current.title}
      </p>
      <div key={current.id} className="tdm-swap w-full">
        <StepVisual id={current.id} reachVideoUrl={reachVideoUrl} />
      </div>
    </div>
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal focus-visible:ring-offset-2 focus-visible:ring-offset-hero-base";

// ─── Desktop (≥1024px): pinned rail + stage, scrubbed by scroll ──────────────

function DesktopEngine({
  mode,
  reduced,
  onScreen,
  reachVideoUrl,
}: {
  mode: "scroll" | "autoplay";
  reduced: boolean;
  onScreen: boolean;
  reachVideoUrl?: string | undefined;
}) {
  const { scrollTo } = useExperience();
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const withinRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [step, setStep] = useState(0);
  const [restart, setRestart] = useState(0);

  const pinned = mode === "scroll" && !reduced;
  const autoplay = mode === "autoplay" && !reduced;
  useAutoplay(autoplay && onScreen, step, restart, setStep);

  // gsap.context() via useGSAP: the pin is reverted on unmount or mode change.
  useGSAP(
    () => {
      const row = rowRef.current;
      if (!pinned || !row) return;
      const navSpace = () =>
        document.querySelector<HTMLElement>("header.fixed")?.offsetHeight ?? 90;
      triggerRef.current = ScrollTrigger.create({
        trigger: row,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Centred in the viewport when it fits, otherwise just clear of the nav.
        start: () =>
          `top ${Math.max(navSpace() + 16, (window.innerHeight - row.offsetHeight) / 2)}px`,
        end: () => `+=${window.innerHeight * SCROLL_PER_STEP * STEP_COUNT}`,
        onUpdate: (self) => {
          const position = self.progress * STEP_COUNT;
          const index = Math.min(STEP_COUNT - 1, Math.floor(position));
          withinRef.current = Math.min(1, position - index);
          if (fillRef.current) fillRef.current.style.width = `${withinRef.current * 100}%`;
          setStep(index);
        },
      });
      // This pin mounts after the page's other triggers; put them back in page
      // order so everything below accounts for the pin's scroll distance.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        triggerRef.current = null;
      };
    },
    { dependencies: [pinned], scope: wrapRef, revertOnUpdate: true },
  );

  const pick = (index: number) => {
    const trigger = triggerRef.current;
    if (pinned && trigger) {
      scrollTo(trigger.start + ((trigger.end - trigger.start) * index) / STEP_COUNT + 1);
      return;
    }
    setStep(index);
    setRestart((count) => count + 1);
  };

  return (
    // A stable wrapper React owns: the pin re-parents the row inside it.
    <div ref={wrapRef}>
      <div ref={rowRef} className="flex gap-10">
        <ol aria-label="Process steps" className="flex w-[380px] shrink-0 flex-col gap-2">
          {growthSteps.map((item, index) => {
            const active = index === step;
            return (
              <li key={item.id}>
                {active ? (
                  <button
                    type="button"
                    aria-current="step"
                    onClick={() => pick(index)}
                    className={cn(
                      "flex w-full flex-col gap-2.5 rounded-[22px] border border-white/95 bg-white px-[22px] py-5 text-left text-hero-ink shadow-[0_14px_36px_rgba(15,42,44,0.1)]",
                      focusRing,
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <StepNumber step={item} active />
                      <span className="font-hero text-[26px] font-semibold leading-tight tracking-[-0.02em]">
                        {item.title}
                      </span>
                    </span>
                    <span className="text-[15px] leading-[1.55] text-hero-muted">{item.desc}</span>
                    <span className="block h-[3px] overflow-hidden rounded-full bg-track">
                      {pinned ? (
                        <span
                          ref={(el) => {
                            fillRef.current = el;
                            if (el) el.style.width = `${withinRef.current * 100}%`;
                          }}
                          className="block h-full bg-hero-teal"
                        />
                      ) : (
                        <span
                          key={`${step}-${restart}-${onScreen}`}
                          className="block h-full bg-hero-teal"
                          style={
                            autoplay
                              ? { animation: `tdmFill ${AUTOPLAY_MS / 1000}s linear both` }
                              : { width: "100%" }
                          }
                        />
                      )}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => pick(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[22px] border border-transparent bg-white/35 px-[22px] py-4 text-left text-hero-ink transition-colors hover:bg-white/70",
                      focusRing,
                    )}
                  >
                    <StepNumber step={item} active={false} />
                    <span className="flex flex-col gap-0.5">
                      <span className="font-hero text-[22px] font-semibold leading-tight tracking-[-0.02em] text-hero-muted">
                        {item.title}
                      </span>
                      <span className="text-[13px] text-hero-soft">{item.short}</span>
                    </span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>

        <Stage step={step} reachVideoUrl={reachVideoUrl} className="min-h-[560px] p-7" />
      </div>
    </div>
  );
}

// ─── Tablet (768–1023px): step pills above the stage, autoplay in view ───────

function TabletEngine({
  reduced,
  onScreen,
  reachVideoUrl,
}: {
  reduced: boolean;
  onScreen: boolean;
  reachVideoUrl?: string | undefined;
}) {
  const [step, setStep] = useState(0);
  const [restart, setRestart] = useState(0);
  useAutoplay(!reduced && onScreen, step, restart, setStep);
  const current = growthSteps[step] ?? growthSteps[0]!;

  return (
    <div className="flex flex-col gap-5">
      <ol
        aria-label="Process steps"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none]"
      >
        {growthSteps.map((item, index) => {
          const active = index === step;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => {
                  setStep(index);
                  setRestart((count) => count + 1);
                }}
                className={cn(
                  "inline-flex min-h-12 items-center gap-2.5 whitespace-nowrap rounded-full border py-1.5 pl-1.5 pr-5 text-hero-ink transition-colors",
                  active
                    ? "border-white/95 bg-white shadow-[0_10px_26px_rgba(15,42,44,0.1)]"
                    : "border-transparent bg-white/35 hover:bg-white/70",
                  focusRing,
                )}
              >
                <StepNumber step={item} active={active} />
                <span
                  className={cn(
                    "font-hero text-lg font-semibold tracking-[-0.02em]",
                    !active && "text-hero-muted",
                  )}
                >
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="max-w-2xl text-[15px] leading-[1.55] text-hero-muted">{current.desc}</p>
      <Stage step={step} reachVideoUrl={reachVideoUrl} className="p-5" />
    </div>
  );
}

// ─── Mobile (<768px): five stacked cards, each visual starts in view ─────────

function MobileVisual({
  id,
  reduced,
  reachVideoUrl,
}: {
  id: GrowthStepId;
  reduced: boolean;
  reachVideoUrl?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, "0px", 0.3);
  const [seen, setSeen] = useState(reduced);
  useEffect(() => {
    if (visible) setSeen(true);
  }, [visible]);
  const motion = useMemo(() => ({ onScreen: visible, reduced }), [visible, reduced]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/95 bg-white/55 p-2">
      <GrowthMotionContext.Provider value={motion}>
        {seen ? (
          <StepVisual id={id} reachVideoUrl={reachVideoUrl} />
        ) : (
          // Holds the scaled height until the card scrolls into view.
          <Artboard height={id === "reach" ? 490 : 500} />
        )}
      </GrowthMotionContext.Provider>
    </div>
  );
}

function MobileCards({
  reduced,
  reachVideoUrl,
}: {
  reduced: boolean;
  reachVideoUrl?: string | undefined;
}) {
  return (
    <ol aria-label="Process steps" className="flex flex-col gap-4">
      {growthSteps.map((item) => (
        // The whole card opens the step's service page: the title's link
        // stretches over the card, and the footer row says where it goes.
        <li
          key={item.id}
          className="group/card relative flex flex-col gap-3 rounded-[22px] border border-white/95 bg-white/80 p-4 shadow-[0_14px_36px_rgba(15,42,44,0.1)] transition-transform duration-200 has-[a:active]:scale-[0.985] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-hero-teal"
        >
          <div className="flex items-center gap-3">
            <StepNumber step={item} active />
            <h3 className="font-hero text-2xl font-semibold leading-tight tracking-[-0.02em] [font-stretch:normal]">
              <Link
                to={item.service.to}
                aria-label={`${item.title}: explore ${item.service.label}`}
                className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-[22px]"
              >
                {item.title}
              </Link>
            </h3>
          </div>
          <p className="text-[15px] leading-[1.55] text-hero-muted">{item.desc}</p>
          <MobileVisual id={item.id} reduced={reduced} reachVideoUrl={reachVideoUrl} />
          <span
            aria-hidden="true"
            className="mt-1 flex min-h-12 items-center justify-between rounded-full bg-hero-ink py-1.5 pl-5 pr-1.5 text-[15px] font-bold text-white"
          >
            Explore {item.service.label}
            <span className="grid size-9 place-items-center rounded-full bg-teal text-hero-ink">
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

function LoopStrip() {
  const flow = loopStrip.map((item) => item.label).join(", then ");
  return (
    <div
      role="img"
      aria-label={`The loop: ${flow}`}
      className="flex flex-wrap items-center gap-2 rounded-[22px] border border-white/95 bg-white/70 px-2.5 py-2 text-[13px] font-semibold shadow-[0_6px_20px_rgba(15,42,44,0.06)] sm:rounded-full"
    >
      {loopStrip.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span className="text-[#8aa3a2]">→</span>}
          <span
            className="rounded-full px-3 py-1.5"
            style={{ background: item.bg, color: item.fg }}
          >
            {item.label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * How We Work — The Growth Engine. Five steps (Create → Reach → Convince →
 * Close → Automate), each with its own animated visual. Desktop pins the
 * rail and stage and scrubs the steps with scroll; tablet autoplays; mobile
 * stacks the steps as cards.
 */
export function HowWeWork({ mode = "autoplay", reachVideoUrl }: HowWeWorkProps): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const env = useEnvironment();
  const onScreen = useInView(sectionRef, "100px 0px");
  const reduced = env?.reduced ?? false;
  const motion = useMemo(() => ({ onScreen, reduced }), [onScreen, reduced]);
  const { scrollTo } = useExperience();

  return (
    <section
      ref={sectionRef}
      id="how-we-work"
      aria-labelledby="how-we-work-title"
      data-hww-offscreen={onScreen ? undefined : ""}
      className="hww relative isolate py-16 font-ui text-hero-ink"
    >
      {/* Fades out at both edges so it melts into Services and Formats. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,transparent_0,#000_120px,#000_calc(100%-120px),transparent_100%)]"
        style={{ background: SECTION_BACKGROUND }}
      />

      <div className="mx-auto flex max-w-[1320px] flex-col gap-10 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <span className="font-hero text-lg font-bold uppercase tracking-[0.08em]">
              How we work
            </span>
            <h2
              id="how-we-work-title"
              className="m-0 font-hero text-[40px] font-semibold leading-[1.06] tracking-[-0.03em] [font-stretch:normal] md:text-[52px]"
            >
              The Growth <em className="font-medium italic text-hero-teal">Engine.</em>
            </h2>
            <p className="text-base leading-[1.55] text-hero-muted md:text-lg">
              Five steps, one system. Every step feeds the next, from the first scroll-stopping
              video to the deal closed in your CRM.
            </p>
          </div>
          <LoopStrip />
        </div>

        <GrowthMotionContext.Provider value={motion}>
          {env === null ? (
            <div className="min-h-[560px]" />
          ) : env.layout === "desktop" ? (
            <DesktopEngine
              mode={mode}
              reduced={reduced}
              onScreen={onScreen}
              reachVideoUrl={reachVideoUrl}
            />
          ) : env.layout === "tablet" ? (
            <TabletEngine reduced={reduced} onScreen={onScreen} reachVideoUrl={reachVideoUrl} />
          ) : (
            <MobileCards reduced={reduced} reachVideoUrl={reachVideoUrl} />
          )}
        </GrowthMotionContext.Provider>

        <div className="flex flex-col gap-4 rounded-[22px] bg-hero-ink px-[22px] py-[18px] text-white md:flex-row md:flex-wrap md:items-center md:justify-between">
          <p className="text-[17px] font-semibold">
            One team runs the whole engine — so nothing leaks between the ad and the sale.
          </p>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollTo("#contact");
            }}
            className={cn(
              focusRing,
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal px-[22px] text-[15px] font-bold text-hero-ink no-underline transition-colors hover:bg-aqua focus-visible:ring-offset-hero-ink",
            )}
          >
            Start a project
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </section>
  );
}
