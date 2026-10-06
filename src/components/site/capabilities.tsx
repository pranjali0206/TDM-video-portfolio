import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef, type PointerEvent } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { categories } from "./content";
import { VideoSlot } from "./primitives";
import { WorkScene } from "./work-scenes";

// One joyful tone per card: teal, lime, coral, mint, light teal.
const cardTones = [
  "var(--accent)",
  "var(--teal)",
  "color-mix(in oklab, var(--glow) 60%, var(--ivory))",
  "var(--secondary)",
  "color-mix(in oklab, var(--accent) 45%, var(--ivory))",
];

const trackSpotlight = (event: PointerEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
};

/**
 * Capability cards that stick and stack on desktop: as the next card
 * slides up, the one beneath sinks back and dims. On small screens they
 * simply flow, since a sticky card taller than the viewport would hide its
 * own bottom half.
 */
export function Capabilities() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-cap-card]");

      cards.forEach((card) => {
        gsap.from(card.querySelectorAll("[data-cap-reveal]"), {
          y: 50,
          opacity: 0,
          duration: 1.3,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 72%", once: true },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        cards.forEach((card, index) => {
          const next = cards[index + 1];
          if (!next) return;
          const scrollTrigger = { trigger: next, start: "top bottom", end: "top 15%", scrub: true };
          gsap.to(card.querySelector("[data-cap-inner]"), {
            scale: 0.9,
            ease: "none",
            scrollTrigger,
          });
          gsap.to(card.querySelector("[data-cap-shade]"), {
            opacity: 0.18,
            ease: "none",
            scrollTrigger,
          });
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="work"
      className="relative bg-ivory px-4 pb-24 pt-16 text-ink md:px-10 md:pb-40 md:pt-24"
    >
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 lg:gap-0">
        {categories.map(
          ({ title, eyebrow, description, icon: Icon, tags, scene, video, href, hash }, index) => (
            <div
              key={title}
              data-cap-card
              className="lg:sticky lg:h-[calc(100svh-var(--cap-top))] lg:pb-20"
              style={{
                ["--cap-top" as string]: `${6.5 + index * 1.4}rem`,
                top: `${6.5 + index * 1.4}rem`,
              }}
            >
              <article
                data-cap-inner
                onPointerMove={trackSpotlight}
                className="spotlight relative h-full origin-top overflow-hidden rounded-[1.75rem] border border-ink/10 p-6 shadow-[0_30px_80px_-40px_rgba(0,40,40,0.45)] md:rounded-[2.25rem] md:p-10 lg:p-12"
                style={{
                  background: `linear-gradient(155deg, color-mix(in oklab, ${cardTones[index % cardTones.length]} 70%, white) 0%, ${cardTones[index % cardTones.length]} 60%)`,
                }}
              >
                <div
                  data-cap-shade
                  className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0"
                />
                <div className="relative z-10 grid h-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                  <div className="flex flex-col">
                    <div
                      data-cap-reveal
                      className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-ink"
                    >
                      <span className="flex items-center gap-3 text-ink">
                        <Icon className="size-5" strokeWidth={1.5} />
                        {eyebrow}
                      </span>
                      <span>
                        0{index + 1} / 0{categories.length}
                      </span>
                    </div>
                    <span
                      data-cap-reveal
                      className="mt-6 font-display text-[26vw] leading-[0.8] text-outline lg:mt-8 lg:text-[clamp(6rem,11vh,9.5rem)]"
                      style={{ fontStretch: "125%" }}
                    >
                      0{index + 1}
                    </span>
                    <h3
                      data-cap-reveal
                      className="mt-6 text-3xl leading-[0.95] md:text-5xl lg:text-[clamp(2rem,5.4vh,3.25rem)]"
                    >
                      {title}
                    </h3>
                    <p
                      data-cap-reveal
                      className="mt-5 max-w-md text-base leading-relaxed font-medium text-ink md:text-lg"
                    >
                      {description}
                    </p>
                    <ul data-cap-reveal className="mt-8 flex flex-wrap gap-2 lg:mt-auto lg:pt-8">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-ink/20 bg-white/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div data-cap-reveal className="mt-8">
                      <Link
                        to={href}
                        {...(hash ? { hash } : {})}
                        className="group inline-flex h-13 items-center gap-4 rounded-full bg-ink pl-6 pr-1.5 text-base font-semibold text-ivory transition-colors hover:bg-night-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
                      >
                        Know more
                        <span className="grid size-10 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight className="size-5" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* One bright looping showreel per card. */}
                  <div
                    data-cap-reveal
                    className="aspect-[4/3] min-h-0 sm:aspect-video lg:aspect-auto lg:h-full"
                  >
                    {video ? (
                      <VideoSlot
                        title={title}
                        src={video}
                        label="Showreel"
                        cursorLabel="Watch"
                        className="size-full"
                      />
                    ) : (
                      <WorkScene kind={scene} />
                    )}
                  </div>
                </div>
              </article>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
