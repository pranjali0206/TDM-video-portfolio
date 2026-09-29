import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { expertise, problemSolutions } from "./content";
import { SectionLabel } from "./primitives";
import { ServiceUniverse } from "./service-orbit";
import { tones, type Tone } from "./tones";

// ─── Expertise picker ────────────────────────────────────────────────────────

const pillTones: Tone[] = ["teal", "lime", "coral", "blush", "deep", "mint"];
const EXPERTISE_INTERVAL_MS = 5000;

/**
 * The twelve disciplines behind the seven services: sticker pills on one side,
 * a big quote panel on the other that takes on the selected pill's colour.
 * It flips through on its own until someone picks one.
 */
function ExpertisePicker() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % expertise.length),
      EXPERTISE_INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, auto, paused]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-panel-line]",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "expo.out" },
      );
    },
    { dependencies: [active], scope: panelRef },
  );

  const current = expertise[active] ?? expertise[0]!;
  const colors = tones[pillTones[active % pillTones.length]!];
  const Icon = current.icon;

  return (
    <div className="mx-auto mt-24 grid max-w-[1500px] items-center gap-10 md:mt-36 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <p
          data-fade
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal"
        >
          <Star className="size-3.5 fill-current" strokeWidth={0} />
          The skills behind the work
        </p>
        <h3 data-split className="mt-5 text-4xl leading-[0.95] md:text-6xl">
          We have expertise in
        </h3>
        <p data-fade className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
          We offer cutting-edge digital marketing services worldwide, empowering your brand to grow
          in the competitive market.
        </p>
        <p
          data-fade
          className="mt-5 max-w-sm font-serif text-2xl italic leading-tight text-deep-teal"
        >
          Great films deserve an audience. We make sure they find one.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          {expertise.map(({ title, icon: PillIcon }, index) => {
            const isActive = index === active;
            const pill = tones[pillTones[index % pillTones.length]!];
            return (
              <button
                key={title}
                type="button"
                aria-pressed={isActive}
                aria-controls="expertise-panel"
                onClick={() => {
                  setActive(index);
                  setAuto(false);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
                  index % 2 ? "rotate-2" : "-rotate-2",
                  isActive
                    ? "rotate-0 scale-110 border-ink shadow-[4px_4px_0_var(--ink)]"
                    : "border-transparent",
                )}
                style={{ background: pill.bg, color: pill.fg }}
              >
                <PillIcon className="size-4" strokeWidth={1.8} />
                {title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="expertise-panel"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] p-8 shadow-[0_40px_90px_-45px_rgba(0,40,40,0.6)] transition-colors duration-700 md:min-h-[24rem] md:p-12"
        style={{ background: colors.bg, color: colors.fg }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-4 select-none font-serif text-[24rem] leading-none opacity-10"
        >
          ”
        </span>

        <div ref={panelRef} className="relative">
          <p data-panel-line className="font-mono text-xs uppercase tracking-[0.22em] opacity-70">
            {String(active + 1).padStart(2, "0")} / {expertise.length} — Our expertise
          </p>
          <div data-panel-line className="mt-6 flex items-center gap-4">
            <span className="grid size-14 shrink-0 rotate-6 place-items-center rounded-2xl bg-white/85 text-ink">
              <Icon className="size-6" strokeWidth={1.8} />
            </span>
            <h4
              className="font-display text-3xl font-extrabold leading-[1] md:text-5xl"
              style={{ fontStretch: "105%" }}
            >
              {current.title}
            </h4>
          </div>
          <p
            data-panel-line
            className="mt-7 text-lg font-semibold leading-snug md:text-xl md:leading-snug"
          >
            “{current.description}”
          </p>
        </div>

        {auto && (
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-current/10">
            <span
              key={active}
              className={cn(
                "block h-full origin-left animate-[grow-x_5s_linear_forwards] bg-current opacity-60",
                paused && "[animation-play-state:paused]",
              )}
            />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

/** Services: the service orbit around the TDM globe and the expertise picker. */
export function Services() {
  return (
    <section
      id="services"
      className="relative z-10 -mt-12 overflow-hidden rounded-t-[2.5rem] bg-card px-6 py-28 text-ink shadow-[0_-30px_80px_-50px_rgba(0,40,40,0.5)] md:-mt-16 md:rounded-t-[4rem] md:px-14 md:py-40 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-24 top-40 size-[26rem] bg-accent/25" />
        <div className="orb -right-24 top-[45%] size-[24rem] bg-teal/35 [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] py-6 text-center">
        <div className="flex flex-col items-center">
          <SectionLabel>Services</SectionLabel>
          <h2 data-split className="mt-8 text-5xl leading-[0.92] md:text-7xl lg:text-8xl">
            Every craft.
            <br />
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              Built
            </span>{" "}
            to perform.
          </h2>
          <p data-fade className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
            Film, edit, design, performance marketing and AI automation — deep expertise across
            every discipline, working as one system to turn attention into measurable growth.
          </p>
        </div>
      </div>

      <ServiceUniverse />

      <div className="relative">
        <ExpertisePicker />
      </div>
    </section>
  );
}
