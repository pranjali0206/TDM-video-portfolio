import { Star } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { reviews } from "./content";
import { SectionLabel } from "./primitives";
import { tones, type Tone } from "./tones";

type Review = (typeof reviews)[number];

const rows: { items: Review[]; tones: Tone[]; direction: 1 | -1 }[] = [
  { items: reviews.slice(0, 4), tones: ["coral", "ink", "lime", "deep"], direction: -1 },
  { items: reviews.slice(4), tones: ["teal", "blush", "paper"], direction: 1 },
];

// Enough copies that a row never runs out, even on very wide screens.
const COPIES = 4;
const SPEED_PX_PER_SECOND = 45;

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Phones get one swipeable row of every review, in marquee order and colours.
const mobileCards = rows.flatMap((row) =>
  row.items.map((review, i) => ({ review, tone: row.tones[i % row.tones.length] ?? "paper" })),
);

function ReviewCard({
  review,
  tone,
  duplicate = false,
  className,
}: {
  review: Review;
  tone: Tone;
  duplicate?: boolean;
  className?: string;
}) {
  const colors = tones[tone];
  return (
    <article
      aria-hidden={duplicate ? true : undefined}
      className={cn(
        "flex w-[19rem] shrink-0 flex-col rounded-[1.75rem] p-6 shadow-[0_30px_60px_-35px_rgba(0,40,40,0.55)] transition-[translate,rotate] duration-500 ease-out md:w-[26rem] md:p-8 md:hover:-translate-y-2 md:hover:-rotate-1",
        duplicate && "motion-reduce:hidden",
        className,
      )}
      style={{ background: colors.bg, color: colors.fg }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          {review.service}
        </span>
        <span
          role="img"
          aria-label="Rated 5 out of 5"
          className="flex gap-0.5"
          style={{ color: colors.pop }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-4 fill-current" strokeWidth={0} />
          ))}
        </span>
      </div>

      <blockquote className="mt-6 flex gap-3">
        <span aria-hidden="true" className="font-serif text-5xl leading-[0.75] opacity-50">
          “
        </span>
        <p className="text-base font-medium leading-relaxed md:text-lg">{review.quote}</p>
      </blockquote>

      <div className="mt-auto pt-8">
        <footer
          className="flex items-center gap-3 border-t pt-5"
          style={{ borderColor: "color-mix(in oklab, currentColor 18%, transparent)" }}
        >
          <span
            className="grid size-11 shrink-0 place-items-center rounded-full font-mono text-xs font-bold"
            style={{ background: "color-mix(in oklab, currentColor 14%, transparent)" }}
          >
            {initialsOf(review.name)}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{review.name}</p>
            <p className="truncate text-sm opacity-70">
              {review.role}, {review.company}
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}

/**
 * "Straight from the fanbase": two rows of colourful review cards gliding in
 * opposite directions. Hovering a row eases it to a stop so it can be read.
 */
export function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cleanups: (() => void)[] = [];

      // The gliding rows only exist from tablet up; phones swipe instead.
      const mm = gsap.matchMedia();
      cleanups.push(() => mm.revert());
      mm.add("(min-width: 768px)", () => {
        const rowCleanups: (() => void)[] = [];
        gsap.utils.toArray<HTMLElement>("[data-review-row]").forEach((row) => {
          const track = row.querySelector<HTMLElement>("[data-review-track]");
          if (!track) return;
          const leftward = row.dataset["direction"] !== "1";
          const loop = gsap.fromTo(
            track,
            { xPercent: leftward ? 0 : -50 },
            {
              xPercent: leftward ? -50 : 0,
              duration: track.scrollWidth / 2 / SPEED_PX_PER_SECOND,
              ease: "none",
              repeat: -1,
            },
          );

          // Only spend frames while the row is on screen.
          ScrollTrigger.create({
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          });

          const ease = (timeScale: number) =>
            gsap.to(loop, { timeScale, duration: 0.6, ease: "power2.out", overwrite: true });
          const stop = () => ease(0);
          const go = () => ease(1);
          row.addEventListener("pointerenter", stop);
          row.addEventListener("pointerleave", go);
          rowCleanups.push(() => {
            row.removeEventListener("pointerenter", stop);
            row.removeEventListener("pointerleave", go);
          });
        });
        return () => rowCleanups.forEach((cleanup) => cleanup());
      });

      const headline = { trigger: "[data-reviews-head]", start: "top 80%" };
      gsap.from("[data-marker]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.3,
        delay: 0.3,
        ease: "expo.inOut",
        scrollTrigger: headline,
      });
      gsap.from("[data-sticky-note]", {
        rotate: -22,
        scale: 0.6,
        opacity: 0,
        duration: 1.1,
        ease: "back.out(1.8)",
        scrollTrigger: headline,
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="reviews"
      className="relative overflow-hidden py-28 text-ink md:py-40"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--accent) 32%, var(--ivory)) 0%, color-mix(in oklab, var(--accent) 14%, var(--ivory)) 100%)",
      }}
    >
      {/* Soft white clouds drifting across a teal sky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb left-[4%] top-[10%] h-36 w-[28rem] bg-white/80" />
        <div className="orb right-[6%] top-[30%] h-32 w-[24rem] bg-white/70 [animation-delay:-7s]" />
        <div className="orb bottom-[8%] left-[30%] h-40 w-[34rem] bg-white/60 [animation-delay:-13s]" />
      </div>

      <div data-reviews-head className="relative flex flex-col items-center px-6 text-center">
        <SectionLabel>Reviews</SectionLabel>
        <p
          data-sticky-note
          className="mt-8 inline-block -rotate-3 bg-teal px-4 py-2.5 font-serif text-xl italic text-ink shadow-[0_18px_30px_-18px_rgba(0,40,40,0.6)] sm:px-5 sm:py-3 sm:text-2xl"
        >
          Straight from the fanbase
        </p>
        <h2 className="mt-8 max-w-5xl text-balance text-[clamp(1.9rem,8.4vw,2.25rem)] leading-[1.02] md:text-6xl lg:text-7xl">
          The internet’s favorite kind of flex —{" "}
          <span className="relative isolate inline-block">
            <span
              data-marker
              aria-hidden="true"
              className="absolute inset-x-[-0.1em] bottom-[0.06em] -z-10 h-[0.38em] -rotate-1 rounded-sm bg-teal"
            />
            <span
              className="font-serif font-normal italic tracking-normal"
              style={{ fontStretch: "100%" }}
            >
              other people’s words
            </span>
          </span>
        </h2>
      </div>

      {/* Phones: one row to swipe through, each card snapping into place. */}
      <div className="relative mt-12 md:hidden">
        <ul
          aria-label="Client reviews"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {mobileCards.map(({ review, tone }) => (
            <li key={review.name} className="flex shrink-0 snap-start">
              <ReviewCard
                review={review}
                tone={tone}
                className="w-[min(84vw,20rem)] p-5 [&_blockquote_p]:text-[15px]"
              />
            </li>
          ))}
        </ul>
        <p
          aria-hidden="true"
          className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50"
        >
          Swipe for more →
        </p>
      </div>

      <div className="relative mt-16 hidden space-y-6 md:mt-20 md:block">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            data-review-row
            data-direction={row.direction}
            className="flex overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] motion-reduce:overflow-x-auto"
          >
            <div data-review-track className="flex shrink-0 gap-6 pr-6 will-change-transform">
              {Array.from({ length: COPIES }, (_, copy) =>
                row.items.map((review, i) => (
                  <ReviewCard
                    key={`${copy}-${review.name}`}
                    review={review}
                    tone={row.tones[i % row.tones.length] ?? "paper"}
                    duplicate={copy > 0}
                  />
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
