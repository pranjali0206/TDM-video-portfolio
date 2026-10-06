import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { companyStats as stats, formatStat as format } from "./company-stats";
import { SectionLabel } from "./primitives";
import { VIDEO_BASE } from "./reels";

const quote = {
  text: "In a field full of brown cows, nobody stops to look. Be the purple one.",
  author: "The TDM way",
};

// The TDM Effect explainer animation (R2 folder "animated video").
const animation = {
  src: `${VIDEO_BASE}/animated%20video/tdm-animation-01.mp4`,
  poster: `${VIDEO_BASE}/animated%20video/tdm-animation-01.jpg`,
};

/**
 * Impact: the numbers, one quote we live by, and the TDM Effect animation
 * tucked into the corner — its white backdrop multiplied into the section
 * colour so the character appears to stand on the page itself.
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

      // The quote lights up word by word as it scrolls through.
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-quote]",
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="impact"
      className="relative overflow-hidden bg-ivory px-6 py-24 text-ink md:px-14 md:py-32 lg:px-20"
    >
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <div>
            <SectionLabel>Impact in numbers</SectionLabel>
            <h2
              data-split
              className="mt-6 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em]"
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

        <div className="relative mt-20 grid items-end gap-10 md:mt-28 lg:grid-cols-[1fr_auto] lg:gap-6">
          <figure data-quote className="relative max-w-5xl">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-[0.55em] select-none font-serif text-[clamp(7rem,14vw,12rem)] leading-none text-accent/60 md:-left-6"
            >
              &ldquo;
            </span>
            <blockquote className="relative font-serif text-[clamp(2rem,4.6vw,4.4rem)] italic leading-[1.06] tracking-[-0.01em]">
              <p>
                {quote.text.split(" ").map((word, index) => (
                  <span key={index} data-word className="inline-block whitespace-pre">
                    {word}{" "}
                  </span>
                ))}
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-deep-teal">
              <span className="h-px w-10 bg-current opacity-60" />
              {quote.author}
            </figcaption>
          </figure>

          {/* The TDM Effect: small, in the corner, blended into the page. */}
          <figure
            data-fade
            className="mix-blend-multiply relative w-[min(100%,24rem)] justify-self-end lg:w-[22rem] xl:w-[26rem]"
          >
            <video
              src={animation.src}
              poster={animation.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="The TDM Effect animation"
              className="aspect-video w-full object-cover brightness-[1.08] contrast-[1.06] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_62%,transparent_100%)]"
            />
            <figcaption className="-mt-2 text-right text-sm font-medium text-ink/70">
              <span className="font-bold text-ink">The TDM Effect.</span> Ideas in. Brands out.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
