import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { companyStats as stats, formatStat as format } from "./company-stats";
import { SectionLabel } from "./primitives";

/** "Growth you can count.": the company figures, counting up as they arrive (About page). */
export function GrowthNumbers() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Numbers count up from zero as the row arrives.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el, index) => {
        const stat = stats[index]!;
        const counter = { value: 0 };
        el.textContent = format(stat, 0);
        gsap.to(counter, {
          value: stat.value,
          duration: 2,
          ease: "power3.out",
          delay: index * 0.12,
          scrollTrigger: { trigger: "[data-stats]", start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = format(stat, counter.value);
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="numbers"
      className="relative overflow-hidden px-6 py-16 text-ink md:px-14 md:py-20 lg:px-20"
    >
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <div>
            <SectionLabel>Impact in numbers</SectionLabel>
            <h2
              data-split
              className="text-teal-gradient mt-6 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em]"
              style={{ fontStretch: "108%" }}
            >
              Growth you can <span className="font-extrabold text-glow">count.</span>
            </h2>
          </div>
          <p
            data-fade
            className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg"
          >
            Over a decade of turning attention into enquiries, enquiries into sales — and brands
            into names people remember.
          </p>
        </div>

        <dl
          data-stats
          className="mt-14 grid grid-cols-2 border-t border-ink/15 md:mt-20 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                "border-b border-ink/15 py-8 pr-4 md:py-10 lg:border-b-0 lg:px-8 lg:first:pl-0 " +
                (index % 2 === 1 ? "pl-4 " : "") +
                (index > 0 ? "lg:border-l" : "") +
                (index % 2 === 1 ? " border-l lg:border-l" : "")
              }
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd
                data-count
                className="whitespace-nowrap font-display text-[clamp(2.3rem,4.4vw,4.4rem)] font-bold leading-none tracking-[-0.04em]"
              >
                {format(stat, stat.value)}
              </dd>
              <dd className="mt-3 max-w-[14rem] text-sm font-medium leading-snug text-ink/65 md:text-base">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
