import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { companyStats as stats, formatStat as format } from "./company-stats";
import { SectionLabel } from "./primitives";
import { VIDEO_BASE } from "./reels";

// The TDM Effect explainer animation (R2 folder "animated video").
const animation = {
  src: `${VIDEO_BASE}/animated%20video/tdm-animation-01.mp4`,
  poster: `${VIDEO_BASE}/animated%20video/tdm-animation-01.jpg`,
};

/**
 * Impact: the numbers, then the way into the TDM Mindset page beside the TDM
 * Effect animation — its white backdrop multiplied into the section colour so
 * the character appears to stand on the page itself.
 */
export function Impact() {
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
      id="impact"
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
              Growth you can{" "}
              <span
                className="font-serif font-normal italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                count.
              </span>
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

        {/* The way into the TDM Mindset page on the left, the TDM Effect
            animation beside it filling the right. Stacked on phones. */}
        <div className="relative mt-20 grid items-center gap-10 md:mt-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-fade className="flex max-w-xl flex-col items-start text-left">
            <p className="font-display text-[clamp(1.9rem,4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              We take on challenges to create a{" "}
              <span className="font-serif font-normal italic text-deep-teal">whole new genre</span>{" "}
              of game.
            </p>
            <Link
              to="/tdm-mindset"
              className="group mt-8 inline-flex h-16 items-center gap-5 rounded-full bg-ink pl-8 pr-2.5 font-display text-lg font-bold uppercase tracking-[0.06em] text-ivory shadow-[0_20px_44px_-20px_rgba(0,40,40,0.7)] transition-colors hover:bg-deep-teal md:h-[4.5rem] md:text-xl"
            >
              <span>
                <span className="hidden sm:inline">Explore the </span>TDM mindset
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45 md:size-12">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>

          {/* The TDM Effect, blended into the page (its white backdrop multiplies
              away) and enlarged so the character fills the right-hand column;
              the soft mask lets the scaled edges fade into the page. */}
          <figure data-fade className="mix-blend-multiply relative w-full">
            <video
              src={animation.src}
              poster={animation.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="The TDM Effect animation"
              className="aspect-video w-full scale-[1.2] object-cover brightness-[1.08] contrast-[1.06] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_62%,transparent_100%)] lg:scale-[1.4]"
            />
            <figcaption className="mt-4 text-center text-sm font-medium text-ink/70 lg:mt-12">
              <span className="font-bold text-ink">The TDM Effect.</span> Ideas in. Brands out.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
