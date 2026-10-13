import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { ServicePills } from "./service-pills";

// The hero statement, one line per row, in bold Fraunces (loaded in
// __root.tsx) filled with the teal gradient.
const headline = ["4x your business with", "Digital Marketing"];

/**
 * Hero layout rules (nothing is placed by eye):
 *  - Everything sits on one centre line: headline, the services as colour
 *    pills, the intro and the two buttons.
 *  - Plain, pure white ground.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          defaults: { ease: "none" },
        })
        .to("[data-hero-title]", { yPercent: -12, opacity: 0.4 }, 0)
        .to("[data-hero-bottom]", { yPercent: 40, opacity: 0 }, 0);
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-[max(100svh,680px)] overflow-hidden bg-white text-ink"
    >
      <div className="relative z-10 flex min-h-[max(100svh,680px)] flex-col items-center justify-center px-5 pb-14 pt-28 text-center md:px-[2vw] md:pb-16 md:pt-28">
        {/* Each line rises out of its own mask; the sheen sweeps both together. */}
        <h1
          data-hero-title
          className="w-full font-hero text-[clamp(2.5rem,11vw,9rem)] font-black leading-[0.98] tracking-[-0.025em] [font-variation-settings:'SOFT'_100] md:text-[min(7.4vw,15svh)]"
        >
          {headline.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.1em]">
              <span
                className="hero-rise block text-balance"
                style={{ ["--d" as string]: `${0.1 + index * 0.12}s` }}
              >
                <span className="text-teal-gradient teal-sheen px-[0.08em] [--d:1.6s]">{line}</span>
              </span>
            </span>
          ))}
        </h1>

        {/* All the services, right above the promise they add up to. */}
        <div data-hero-bottom className="mt-8 w-full md:mt-10">
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
