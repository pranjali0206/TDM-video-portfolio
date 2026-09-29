import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import { images } from "./content";
import { SectionLabel, VideoSlot } from "./primitives";

/**
 * Pinned showreel: a small 16:9 frame opens to full-bleed as you scroll
 * while "Show" and "reel" slide apart around it.
 */
export function Showreel() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          const { desktop, motion } = context.conditions ?? {};
          if (!motion) return;
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "+=170%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
              },
            })
            .fromTo(
              "[data-reel-frame]",
              {
                clipPath: desktop
                  ? "inset(29% 32% 29% 32% round 28px)"
                  : "inset(36% 7% 36% 7% round 18px)",
              },
              { clipPath: "inset(0% 0% 0% 0% round 0px)" },
              0,
            )
            .fromTo("[data-reel-media]", { scale: 1.4 }, { scale: 1 }, 0)
            .fromTo(
              "[data-reel-word='left']",
              { xPercent: 0, yPercent: 0 },
              desktop ? { xPercent: -70, opacity: 0 } : { yPercent: -140, opacity: 0 },
              0,
            )
            .fromTo(
              "[data-reel-word='right']",
              { xPercent: 0, yPercent: 0 },
              desktop ? { xPercent: 70, opacity: 0 } : { yPercent: 140, opacity: 0 },
              0,
            )
            .to("[data-reel-meta]", { opacity: 0 }, 0.5);
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="reel"
      className="relative h-[100svh] overflow-hidden bg-ivory text-ink"
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[34svh] px-5 md:flex-row md:justify-between md:gap-0 md:px-10"
        style={{ fontStretch: "125%" }}
      >
        <span
          data-reel-word="left"
          className="font-display text-[15vw] uppercase leading-none md:text-[9vw]"
        >
          Show
        </span>
        <span
          data-reel-word="right"
          className="font-display text-[15vw] uppercase leading-none text-outline [--stroke:var(--deep-teal)] md:text-[9vw]"
        >
          reel
        </span>
      </div>

      <div
        data-reel-meta
        className="absolute inset-x-6 top-28 z-20 flex items-start justify-between md:inset-x-14"
      >
        <SectionLabel>Showreel 2026</SectionLabel>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50 sm:block">
          Scroll to expand
        </span>
      </div>

      <div data-reel-frame className="absolute inset-0 z-10 will-change-[clip-path]">
        <div data-reel-media className="absolute inset-0">
          <VideoSlot
            title="TDM Groups — Showreel 2026"
            label="Reel 01"
            cursorLabel="Play reel"
            poster={images.events}
            size="lg"
            className="absolute inset-0 rounded-none ring-0"
          />
        </div>
      </div>
    </section>
  );
}
