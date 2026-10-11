import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { DOT_MATRIX_HEIGHT, DotMatrixText, type DotWord } from "./dot-matrix-text";
import { HeroShader, type HeroShaderState } from "./hero-shader";
import { ServicePills } from "./service-pills";

// The hero statement, drawn as a dot matrix in Fraunces Black (loaded in
// __root.tsx): roman words, one italic word for rhythm, "mean" in coral.
const headline: DotWord[][] = [
  [{ text: "make" }, { text: "attention", italic: true }],
  [{ text: "mean", em: true }, { text: "something." }],
];

/**
 * Hero layout rules (nothing is placed by eye):
 *  - Everything sits on one centre line: headline, the services as colour
 *    pills, the intro and the two buttons.
 *  - Two centred rows at every size: "make attention" / "mean something.".
 *  - Everything scales from one variable, --fs, so proportions hold at any size.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const shaderState = useRef<HeroShaderState>({ intro: 0, scroll: 0 });

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (prefersReducedMotion()) {
        shaderState.current.intro = 1;
        return;
      }

      gsap.to(shaderState.current, { intro: 1, duration: 2.4, ease: "power2.out" });

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          defaults: { ease: "none" },
        })
        .to("[data-hero-dots]", { yPercent: -12, opacity: 0.4 }, 0)
        .to("[data-hero-bottom]", { yPercent: 40, opacity: 0 }, 0)
        .to(shaderState.current, { scroll: 1 }, 0);
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-[max(100svh,680px)] overflow-hidden bg-ivory text-ink"
    >
      <HeroShader stateRef={shaderState} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/30 via-transparent to-ivory/60" />

      <div className="relative z-10 flex min-h-[max(100svh,680px)] flex-col items-center justify-center px-5 pb-14 pt-24 text-center md:px-[2vw] md:pb-16 md:pt-24">
        {/*
          --fs is the one number to tune: the dot matrix takes its font size
          from this box's height (DOT_MATRIX_HEIGHT × --fs) and shrinks to fit
          the width.
        */}
        <h1 className="w-full">
          <span className="sr-only">Make attention mean something.</span>
          <DotMatrixText
            data-hero-dots
            lines={headline}
            className="w-full [--fs:14vw] md:[--fs:min(14vw,22svh)]"
            style={{ height: `calc(var(--fs) * ${DOT_MATRIX_HEIGHT})` }}
          />
        </h1>

        {/* All the services, right above the promise they add up to. */}
        <div data-hero-bottom className="mt-6 w-full md:mt-8">
          <ServicePills />
        </div>

        {/* Archivo (font-display), bold: the promise, in quotes, reads as a statement. */}
        <p
          data-hero-bottom
          className="hero-fade mx-auto mt-4 max-w-[46rem] text-balance font-display text-[1.15rem] font-bold leading-[1.3] tracking-[-0.01em] text-ink [--d:0.8s] md:mt-5 md:text-[clamp(1.2rem,1.55vw,1.6rem)]"
        >
          <span className="text-deep-teal">“</span>Every business has a different problem. We find
          the insight, build the strategy, create the campaign, and engineer the systems that{" "}
          <span className="text-deep-teal">turn growth into reality.”</span>
        </p>

        <div
          data-hero-bottom
          className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3 [--d:0.95s] md:mt-10"
        >
          <Link
            to="/contact"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-jet px-8 text-base font-semibold text-ivory transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
          >
            Start a project
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
          <Link
            to="/media-house"
            className="inline-flex h-14 items-center rounded-full border border-ink/15 bg-white px-8 text-base font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
          >
            See our work
          </Link>
        </div>
      </div>
    </section>
  );
}
