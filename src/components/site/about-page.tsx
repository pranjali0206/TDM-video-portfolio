import { Play, Star } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { AboutIntro } from "./about-intro";
import { aboutCapabilities, industries, problemSolutions, testimonials } from "./content";
import { Corners, Reveal, VideoSlot } from "./primitives";

// ─── Kit ─────────────────────────────────────────────────────────────────────

type Tone = "light" | "teal" | "lime";

const toneClasses: Record<Tone, string> = {
  light: "bg-white",
  teal: "bg-accent",
  lime: "bg-teal",
};

/** Bento card with a file-name label, like a layer in an edit or design tool. */
function Card({
  label,
  hoverLabel,
  tone = "light",
  className,
  children,
}: {
  label: string;
  hoverLabel?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "group/card relative flex h-full flex-col rounded-[1.75rem] p-6 text-ink shadow-[0_30px_70px_-45px_rgba(0,40,40,0.45)] ring-1 ring-ink/10 md:p-8",
        toneClasses[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-[2px] border border-current" />
          {label}
        </span>
        {hoverLabel && (
          <span className="flex items-center gap-1.5 transition-opacity duration-300 group-hover/card:opacity-0">
            <span className="size-1.5 animate-pulse rounded-full bg-glow" />
            {hoverLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * On hover (or keyboard focus inside), a selection frame snaps around the
 * card — outline, corner handles, a name tag and an optional size badge.
 */
function HoverFrame({
  label,
  dimensions,
  className,
  children,
}: {
  label: string;
  dimensions?: string;
  className?: string;
  children: ReactNode;
}) {
  const handle = "absolute size-2.5 border border-deep-teal bg-white";
  const tag =
    "absolute whitespace-nowrap rounded-[4px] bg-deep-teal px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white";
  return (
    <div
      className={cn("group/frame relative h-full hover:z-20 has-[:focus-visible]:z-20", className)}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 opacity-0 transition-all duration-300 ease-out group-has-[:focus-visible]/frame:-inset-3 group-has-[:focus-visible]/frame:opacity-100 group-hover/frame:-inset-3 group-hover/frame:opacity-100"
      >
        <span className="absolute inset-0 border border-deep-teal" />
        <span className={cn(handle, "-left-[5px] -top-[5px]")} />
        <span className={cn(handle, "-right-[5px] -top-[5px]")} />
        <span className={cn(handle, "-bottom-[5px] -left-[5px]")} />
        <span className={cn(handle, "-bottom-[5px] -right-[5px]")} />
        <span className={cn(tag, "bottom-full left-0 mb-2")}>{label}</span>
        {dimensions && (
          <span className={cn(tag, "left-1/2 top-full mt-2 -translate-x-1/2 tracking-normal")}>
            {dimensions}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusDot() {
  return (
    <span className="relative flex size-2.5">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-deep-teal" />
    </span>
  );
}

/** Progress pips for the rotating cards. */
function Dots({
  count,
  active,
  className,
  activeClass = "bg-deep-teal",
  idleClass = "bg-ink/15",
}: {
  count: number;
  active: number;
  className?: string;
  activeClass?: string;
  idleClass?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-500",
            i === active ? cn("w-6", activeClass) : cn("w-1.5", idleClass),
          )}
        />
      ))}
    </div>
  );
}

// ─── Rotating cards ──────────────────────────────────────────────────────────

const QUESTION_HOLD_MS = 1800;
const ANSWER_HOLD_MS = 4000;
const FADE_GAP_MS = 500;

/**
 * "Same question in your mind?" — a question fades in, then its answer
 * (mapped to a service), then both fade out and the next pair takes over.
 */
function ProblemSolutionCard() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"question" | "answer" | "hidden">("question");

  useEffect(() => {
    const advance = () => {
      if (phase === "question") setPhase("answer");
      else if (phase === "answer") setPhase("hidden");
      else {
        setIndex((current) => (current + 1) % problemSolutions.length);
        setPhase("question");
      }
    };
    const hold =
      phase === "question" ? QUESTION_HOLD_MS : phase === "answer" ? ANSWER_HOLD_MS : FADE_GAP_MS;
    const timeout = window.setTimeout(advance, hold);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const current = problemSolutions[index] ?? problemSolutions[0]!;
  const Icon = current.icon;

  return (
    <Card label="faq" tone="teal">
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
        Same question in your mind?
      </p>

      <ul className="sr-only">
        {problemSolutions.map((pair) => (
          <li key={pair.service}>
            {pair.question} {pair.answer}
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-5 flex min-h-[150px] flex-col justify-center gap-4">
        <div
          className={cn(
            "flex items-start gap-3 transition-all duration-500 ease-out",
            phase === "hidden" ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ink/40 font-mono text-[10px] font-bold">
            Q
          </span>
          <p className="text-xl font-semibold leading-snug">{current.question}</p>
        </div>
        <div
          className={cn(
            "flex items-start gap-3 transition-all duration-500 ease-out",
            phase === "answer" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink text-accent">
            <Icon className="size-3.5" />
          </span>
          <p className="text-base leading-relaxed text-ink/80">
            {current.answer} <span className="font-semibold text-ink">— {current.service}</span>
          </p>
        </div>
      </div>

      <Dots
        count={problemSolutions.length}
        active={index}
        activeClass="bg-ink"
        idleClass="bg-ink/25"
        className="mt-auto border-t border-ink/15 pt-4"
      />
    </Card>
  );
}

const INDUSTRY_INTERVAL_MS = 3000;
const INDUSTRY_ITEM_HEIGHT = 128;

/** Slot-machine list of industries: slides up every few seconds, looping seamlessly. */
function IndustryRotator() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // A copy of the first item at the end lets the strip slide straight into it,
  // then snap back to 0 invisibly.
  const items = [...industries, industries[0]!];

  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => current + 1), INDUSTRY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (index === industries.length) {
      const timeout = window.setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 500);
      return () => window.clearTimeout(timeout);
    }
    if (!animate) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setAnimate(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    return undefined;
  }, [index, animate]);

  return (
    <div className="mt-5 rounded-2xl bg-white/70 p-5 ring-1 ring-ink/10">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-deep-teal">
        Industries we serve
      </span>

      <ul className="sr-only">
        {industries.map((industry) => (
          <li key={industry.name}>
            {industry.name}: {industry.detail}
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="relative mt-2 overflow-hidden"
        style={{ height: INDUSTRY_ITEM_HEIGHT }}
      >
        <div
          style={{
            transform: `translateY(-${index * INDUSTRY_ITEM_HEIGHT}px)`,
            transition: animate ? "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        >
          {items.map((industry, i) => (
            <div
              key={`${industry.name}-${i}`}
              className="flex flex-col justify-center"
              style={{ height: INDUSTRY_ITEM_HEIGHT }}
            >
              <p
                className="font-display text-xl font-extrabold leading-[1.1] sm:text-2xl"
                style={{ fontStretch: "105%" }}
              >
                {industry.name}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-deep-teal">
                {industry.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Dots
        count={industries.length}
        active={index % industries.length}
        activeClass="bg-ink"
        idleClass="bg-ink/20"
        className="mt-4"
      />
    </div>
  );
}

const TESTIMONIAL_INTERVAL_MS = 5000;

function TestimonialCard() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeOut = window.setTimeout(() => setVisible(false), TESTIMONIAL_INTERVAL_MS - 400);
    const next = window.setTimeout(() => {
      setIndex((current) => (current + 1) % testimonials.length);
      setVisible(true);
    }, TESTIMONIAL_INTERVAL_MS);
    return () => {
      window.clearTimeout(fadeOut);
      window.clearTimeout(next);
    };
  }, [index]);

  const current = testimonials[index] ?? testimonials[0]!;

  return (
    <Card label="review_04">
      <div
        className="mt-5 flex items-center gap-0.5 text-glow"
        role="img"
        aria-label="Rated 5 out of 5"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className="size-4 fill-current" />
        ))}
      </div>

      <ul className="sr-only">
        {testimonials.map((testimonial) => (
          <li key={testimonial.name}>
            “{testimonial.quote}” — {testimonial.name}, {testimonial.role}
          </li>
        ))}
      </ul>
      <figure
        aria-hidden="true"
        className={cn(
          "transition-all duration-[400ms] ease-out",
          visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <blockquote className="mt-4 font-serif text-2xl italic leading-snug md:text-[1.75rem]">
          “{current.quote}”
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
          <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[10px] font-bold text-accent">
            {current.initials}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
            {current.name} · {current.role}
          </span>
        </figcaption>
      </figure>

      <Dots count={testimonials.length} active={index} className="mt-auto pt-6" />
    </Card>
  );
}

// ─── Static cards ────────────────────────────────────────────────────────────

function StatementCard() {
  return (
    <Card label="statement.txt">
      <span
        aria-hidden="true"
        className="mt-5 block h-12 font-serif text-8xl leading-none text-glow"
      >
        “
      </span>
      <h2 className="mt-1 text-3xl leading-[1.04] md:text-5xl" style={{ fontStretch: "105%" }}>
        We make people stop and ask,{" "}
        <span
          className="font-serif font-normal italic tracking-normal text-deep-teal"
          style={{ fontStretch: "100%" }}
        >
          who made that?
        </span>
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
        We’re a digital marketing and technology partner that treats every project like it’s
        going in the portfolio — because it is.{" "}
        <strong className="font-semibold text-ink">No vanity metrics</strong>, no endless decks, no
        guesswork. Just{" "}
        <strong className="font-semibold text-ink">data-driven strategy, shipped fast</strong> —
        campaigns, websites and systems that keep your business growing.
      </p>
      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
          <span>TDM Groups, since 2019</span>
          <span className="flex items-center gap-2">
            <StatusDot />
            <span className="text-ink">Your growth partner</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

function CapabilitiesCard() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Card label="capabilities" hoverLabel="hover me" className="group/caps">
      <div className="mt-7 flex flex-wrap gap-2.5">
        {aboutCapabilities.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive((current) => (current === id ? null : id))}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(0,40,40,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
                isActive
                  ? "border-ink bg-accent text-ink"
                  : "border-ink/10 bg-secondary text-ink hover:border-deep-teal hover:bg-accent/20 hover:text-deep-teal",
              )}
            >
              {isActive && (
                <>
                  <span className="pointer-events-none absolute -left-1 -top-1 size-2 border border-ink bg-white" />
                  <span className="pointer-events-none absolute -right-1 -top-1 size-2 border border-ink bg-white" />
                  <span className="pointer-events-none absolute -bottom-1 -left-1 size-2 border border-ink bg-white" />
                  <span className="pointer-events-none absolute -bottom-1 -right-1 size-2 border border-ink bg-white" />
                </>
              )}
              <Icon
                className={cn(
                  "size-4 transition-colors duration-200",
                  isActive
                    ? "animate-pulse text-ink [animation-duration:3.5s]"
                    : "text-deep-teal group-hover/caps:animate-pulse group-hover/caps:text-glow group-hover/caps:[animation-duration:700ms]",
                )}
              />
              {label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function IndustriesCard() {
  return (
    <Card label="hero.frame" tone="lime">
      <IndustryRotator />
      <div className="mt-auto flex items-center justify-between pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
        <span>Designed live</span>
        <span className="rounded-full bg-white/60 px-2.5 py-1 tracking-normal text-ink/70">
          360 × 240
        </span>
      </div>
    </Card>
  );
}

function BuildingCard() {
  return (
    <Card label="stack">
      <p className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-deep-teal">
        <Play className="size-3 fill-current" />
        Currently building
      </p>
      <h3 className="mt-3 text-2xl leading-[1.05] md:text-3xl" style={{ fontStretch: "105%" }}>
        Agents That Work Around the Clock
      </h3>
      <div className="mt-auto pt-5">
        {/* Drop the build preview into public/videos/ and pass
            src="/videos/currently-building.mp4" to play it here. */}
        <VideoSlot title="Live build preview" label="Live build" live className="h-56 w-full" />
      </div>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function AboutHeader() {
  return (
    <header
      id="whats-up"
      className="relative overflow-hidden px-6 pb-16 pt-24 text-center md:pb-20 md:pt-32"
    >
      {/* Drifting colour orbs — teal, lime and coral light behind the title. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-[6%] top-[12%] size-[26rem] bg-accent/45" />
        <div className="orb -right-[4%] top-0 size-[22rem] bg-teal/60 [animation-delay:-6s]" />
        <div className="orb left-[42%] top-[38%] size-[18rem] bg-glow/25 [animation-delay:-12s]" />
      </div>

      {/* Corner frame, as on the home page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-0 top-6 md:inset-x-8 md:top-10"
      >
        <Corners className="inset-0 text-ink/35" size="size-5 md:size-8" />
      </div>

      <div className="relative">
        <Reveal>
          <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal">
            <span className="h-px w-8 bg-current" />A little about us
            <span className="h-px w-8 bg-current" />
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-6 text-[19vw] uppercase leading-[0.85] md:text-[12vw]"
            style={{ fontStretch: "118%" }}
          >
            What’s{" "}
            <span
              className="font-serif font-normal normal-case italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              up
            </span>
          </h2>
        </Reveal>
      </div>
    </header>
  );
}

export function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutHeader />

      <section
        id="about"
        aria-label="About TDM Groups"
        className="relative px-4 pb-32 md:px-10 lg:px-14"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal delay={80} className="lg:col-span-3">
              <HoverFrame label="studio">
                <StatementCard />
              </HoverFrame>
            </Reveal>

            <div className="flex flex-col gap-8 lg:col-span-2">
              <Reveal delay={160}>
                <HoverFrame label="faq">
                  <ProblemSolutionCard />
                </HoverFrame>
              </Reveal>
              <Reveal delay={240}>
                <HoverFrame label="capabilities">
                  <CapabilitiesCard />
                </HoverFrame>
              </Reveal>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={300}>
              <HoverFrame label="craft" dimensions="360 × 240">
                <IndustriesCard />
              </HoverFrame>
            </Reveal>
            <Reveal delay={360}>
              <HoverFrame label="now-playing">
                <BuildingCard />
              </HoverFrame>
            </Reveal>
            <Reveal delay={420} className="md:col-span-2 lg:col-span-1">
              <HoverFrame label="review">
                <TestimonialCard />
              </HoverFrame>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
