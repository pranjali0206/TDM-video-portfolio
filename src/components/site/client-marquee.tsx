import { Asterisk } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { clients } from "./content";

// Each track repeats its names this many times so a row never runs dry on
// wide screens; the loop slides exactly one copy's width.
const COPIES = 4;

type Row = {
  names: string[];
  /** 1 = drifts right, -1 = drifts left. */
  direction: 1 | -1;
  /** Seconds to slide one full copy of the row. */
  duration: number;
};

// One shared look for every name, whichever row it rides in.
const nameText =
  "font-display text-[clamp(1.6rem,3.1vw,3.3rem)] font-extrabold tracking-[-0.01em] text-ink";

// Split the list across three rows that glide in alternating directions,
// each at a slightly different pace so they never move in lockstep.
const third = Math.ceil(clients.length / 3);
const rows: Row[] = [
  { names: clients.slice(0, third), direction: -1, duration: 38 },
  { names: clients.slice(third, third * 2), direction: 1, duration: 34 },
  { names: clients.slice(third * 2), direction: -1, duration: 42 },
];

/**
 * Three stacked strips of client names, all in the same bold type, gliding
 * in alternating directions. Scrolling nudges their speed and flips them.
 */
export function ClientMarquee() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const loops = gsap.utils.toArray<HTMLElement>("[data-marquee-track]").map((track) => {
        const direction = Number(track.dataset["direction"]);
        const loop = gsap.fromTo(
          track,
          { xPercent: direction === 1 ? -100 / COPIES : 0 },
          {
            xPercent: direction === 1 ? 0 : -100 / COPIES,
            duration: Number(track.dataset["duration"]),
            ease: "none",
            repeat: -1,
          },
        );
        // Park far into the repeat so reversing never runs out of timeline.
        loop.totalTime(loop.duration() * 500);
        return loop;
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 3, 1 + Math.abs(self.getVelocity()) / 600);
          loops.forEach((loop) => {
            gsap.to(loop, { timeScale: self.direction * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.25 });
          });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Clients"
      className="relative overflow-hidden bg-accent py-12 md:py-16"
    >
      <div className="mb-8 flex items-center justify-center gap-4 px-6 md:mb-10">
        <span aria-hidden="true" className="h-px w-10 bg-ink/40 md:w-16" />
        <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-ink md:text-xs">
          Trusted by brands that build, launch &amp; sell
        </p>
        <span aria-hidden="true" className="h-px w-10 bg-ink/40 md:w-16" />
      </div>

      <ul className="sr-only">
        {clients.map((client) => (
          <li key={client}>{client}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="flex flex-col gap-3 md:gap-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
          >
            <div
              data-marquee-track
              data-direction={row.direction}
              data-duration={row.duration}
              className="flex shrink-0 items-center py-1 will-change-transform"
              style={
                // Before JS runs, rightward rows start where their loop begins.
                row.direction === 1 ? { transform: `translateX(-${100 / COPIES}%)` } : undefined
              }
            >
              {Array.from({ length: COPIES }, (_, copy) =>
                row.names.map((name) => (
                  <span
                    key={`${copy}-${name}`}
                    className={cn("flex items-center leading-[1.15]", nameText)}
                  >
                    <span className="px-[0.7em]">{name}</span>
                    <Asterisk className="size-[0.55em] shrink-0 text-glow" strokeWidth={2.5} />
                  </span>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
