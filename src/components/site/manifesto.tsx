import { useRef } from "react";

import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";

import { images, stats } from "./content";
import { SectionLabel } from "./primitives";

function Chip({ src }: { src: string }) {
  return (
    <span
      data-chip
      className="mx-[0.12em] inline-block h-[0.78em] w-[1.6em] overflow-hidden rounded-full align-[-0.08em] shadow-[0_10px_24px_-10px_rgba(0,40,40,0.5)] ring-4 ring-white"
    >
      <img src={src} alt="" loading="lazy" className="size-full object-cover" />
    </span>
  );
}

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const paragraph = root.querySelector<HTMLElement>("[data-manifesto]");
      if (paragraph) {
        const split = SplitText.create(paragraph, { type: "words", aria: "auto" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: paragraph, start: "top 78%", end: "bottom 50%", scrub: true },
          },
        );
        gsap.from("[data-chip]", {
          scale: 0,
          rotate: -14,
          duration: 1.3,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: { trigger: paragraph, start: "top 70%" },
        });
      }

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

      <p
        data-manifesto
        className="mt-10 flex flex-col gap-3 font-display text-[clamp(2.1rem,4.6vw,5.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance sm:gap-4 md:mt-14 md:gap-6"
        style={{ fontStretch: "104%" }}
      >
        <span className="block text-deep-teal">
          Attention <Chip src={images.social} /> is where we begin.
        </span>
        <span className="block">
          Growth <Chip src={images.ecommerce} /> is what we{" "}
          <em className="font-serif font-normal italic tracking-normal text-glow">deliver.</em>
        </span>
        <span className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.42em] font-semibold leading-tight tracking-[-0.01em] md:mt-10 md:gap-x-7">
          <span aria-hidden className="h-px w-12 bg-glow md:w-20" />
          <span>
            That’s <span className="text-deep-teal">TDM Groups.</span>
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-ink md:text-xs">
            Marketing · Technology · Growth
          </span>
        </span>
      </p>

      <div className="mt-28 grid gap-16 md:mt-40 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
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
