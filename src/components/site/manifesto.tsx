import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { stats } from "./content";
import { SectionLabel } from "./primitives";

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset["count"]);
        const decimals = Number(el.dataset["decimals"] ?? 0);
        const counter = { value: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(counter, {
          value: target,
          duration: 2.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = counter.value.toFixed(decimals);
          },
        });
      });

      gsap.from("[data-stat-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.6,
        ease: "expo.inOut",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="studio"
      className="relative bg-ivory px-6 py-28 text-ink md:px-14 md:py-44 lg:px-20"
    >
      <SectionLabel>Who we are</SectionLabel>

      <div className="mt-10 grid gap-16 md:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <p data-fade className="font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal">
            Creative instinct. Commercial discipline.
          </p>
          <h2 data-split className="mt-6 text-4xl leading-[0.95] md:text-6xl">
            Creative decisions, backed by results.
          </h2>
          <p data-fade className="mt-7 max-w-md text-lg leading-relaxed font-medium text-ink">
            Pretty is not a strategy. We build the message that matters, test the work in the real
            world, and make every next move sharper.
          </p>
          <blockquote
            data-fade
            className="mt-10 max-w-md border-l border-glow pl-6 font-serif text-3xl italic leading-tight text-glow"
          >
            “If it does not grow the business, it does not count as a result.”
          </blockquote>
        </div>

        <div data-stats className="grid grid-cols-2 gap-x-6 gap-y-14 md:gap-x-10">
          {stats.map((stat) => (
            <div key={stat.label} className="relative pt-6">
              <span data-stat-rule className="absolute inset-x-0 top-0 h-px bg-ink/15" />
              <p
                className="font-display text-6xl leading-none tabular-nums md:text-8xl"
                style={{ fontStretch: "110%" }}
              >
                <span data-count={stat.value} data-decimals={stat.decimals}>
                  {stat.value.toFixed(stat.decimals)}
                </span>
                <span className="text-glow">{stat.suffix}</span>
              </p>
              <p className="mt-4 text-base font-medium text-ink">{stat.label}</p>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                Reference benchmark
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
