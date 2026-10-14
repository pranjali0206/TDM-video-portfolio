import { Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { heroReels, reelUrls } from "./reels";

const COUNT = heroReels.length;
// Seconds each line-up holds before the fan moves one place to the right.
const HOLD = 3.2;
// Seconds each move takes.
const MOVE = 1.1;

const SIDE_SHADOW = "0 18px 40px rgba(15,42,44,0.18)";
const CENTRE_SHADOW = "0 28px 60px rgba(15,42,44,0.28)";

type Slot = {
  name: "left" | "centre" | "right" | "out" | "parked";
  zIndex: number;
  vars: {
    left: number;
    top: number;
    width: number;
    height: number;
    rotation: number;
    borderRadius: number;
    opacity: number;
    boxShadow: string;
  };
};

const side = { width: 196, height: 348, borderRadius: 20, opacity: 1, boxShadow: SIDE_SHADOW };
const offstage = {
  top: 150,
  width: 176,
  height: 312,
  borderRadius: 18,
  opacity: 0,
  boxShadow: SIDE_SHADOW,
};

/**
 * Where a card sits in the 440 × 620 stage. Cards travel left → centre →
 * right → out, then wait off-stage on the left until it's their turn again.
 * The centre card is 272 × 484 inside a 4px white frame (280 × 492 outside).
 */
const SLOTS: Slot[] = [
  { name: "left", zIndex: 1, vars: { ...side, left: 18, top: 128, rotation: -7 } },
  {
    name: "centre",
    zIndex: 3,
    vars: {
      left: 108,
      top: 40,
      width: 280,
      height: 492,
      rotation: 0,
      borderRadius: 24,
      opacity: 1,
      boxShadow: CENTRE_SHADOW,
    },
  },
  { name: "right", zIndex: 2, vars: { ...side, left: 238, top: 118, rotation: 6 } },
  { name: "out", zIndex: 0, vars: { ...offstage, left: 300, rotation: 12 } },
];
const PARKED: Slot = { name: "parked", zIndex: 0, vars: { ...offstage, left: -40, rotation: -12 } };

/** Slots 0–3 are on stage (or leaving it); the rest wait on the left. */
const slotAt = (index: number) => SLOTS[index] ?? PARKED;
const slotIndex = (card: number, step: number) => (card + step) % COUNT;
const onStage = (index: number) => index < 3;

const slotStyle = ({ zIndex, vars: { rotation, ...rest } }: Slot): CSSProperties => ({
  ...rest,
  zIndex,
  transform: `rotate(${rotation}deg)`,
});

/**
 * The hero's MediaHouse showcase: from `md` up, a fan of three playing reels
 * that keeps moving one place to the right; on phones, a strip of reels
 * gliding left to right.
 */
export function HeroReels() {
  return (
    <>
      <ReelFan />
      <ReelStrip />
    </>
  );
}

function ReelFan() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = cardRefs.current;
    const videos = videoRefs.current;
    const reduced = prefersReducedMotion();
    let step = 0;
    let inView = false;
    let hovering = false;
    let timer: gsap.core.Tween | null = null;

    // Only the cards on stage play, and only while the hero is on screen.
    const syncPlayback = () => {
      videos.forEach((video, card) => {
        if (!video) return;
        if (!reduced && inView && onStage(slotIndex(card, step))) {
          if (video.paused) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    const advance = () => {
      step += 1;
      cards.forEach((card, index) => {
        if (!card) return;
        const to = slotIndex(index, step);
        const slot = slotAt(to);
        card.dataset["slot"] = slot.name;
        card.setAttribute("aria-hidden", String(!onStage(to)));
        const frame = card.querySelector("[data-frame]");
        if (to === 0) {
          // In from the wings: start the clip so it's already moving on arrival.
          const video = videos[index];
          if (video) video.preload = "auto";
        }
        if (slot === PARKED) {
          gsap.set(card, { ...slot.vars, zIndex: slot.zIndex });
          gsap.set(frame, { opacity: 0 });
          return;
        }
        gsap.to(card, { ...slot.vars, duration: MOVE, ease: "power3.inOut" });
        // Swap depth halfway, as the cards pass each other.
        gsap.set(card, { zIndex: slot.zIndex, delay: MOVE / 2 });
        gsap.to(frame, {
          opacity: slot.name === "centre" ? 1 : 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
      });
      syncPlayback();
      schedule();
    };

    const schedule = () => {
      timer?.kill();
      timer = !reduced && inView && !hovering ? gsap.delayedCall(HOLD, advance) : null;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        syncPlayback();
        schedule();
      },
      { threshold: 0.15 },
    );
    io.observe(root);

    // Hovering holds the line-up still so a reel can be watched.
    const onEnter = () => {
      hovering = true;
      schedule();
    };
    const onLeave = () => {
      hovering = false;
      schedule();
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      io.disconnect();
      timer?.kill();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(cards);
      videos.forEach((video) => video?.pause());
    };
  }, []);

  return (
    // Scale the fixed 440 × 620 stage to the column: 85% when stacked under
    // the copy (md), smaller beside it on 1024–1279px screens, full size from xl.
    <section
      aria-label="Recent MediaHouse work"
      className="relative mx-auto hidden h-[calc(620px*var(--s))] w-[calc(440px*var(--s))] shrink-0 [--s:0.85] md:block lg:mx-0 lg:[--s:0.62] min-[1152px]:[--s:0.78] xl:[--s:1]"
    >
      <div data-hero-showcase className="size-full">
        <div
          ref={rootRef}
          className="absolute left-0 top-0 h-[620px] w-[440px] origin-top-left [transform:scale(var(--s))]"
        >
          {/* Frosted panel behind the fan. */}
          <div
            aria-hidden="true"
            className="absolute bottom-9 left-12 right-0 top-9 rounded-[36px] border border-white/85 bg-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_30px_80px_rgba(15,122,120,0.12)] backdrop-blur-[18px]"
          />

          {heroReels.map((reel, index) => {
            const urls = reelUrls(reel.industry, reel.slug);
            const slot = slotAt(slotIndex(index, 0));
            return (
              <div
                key={reel.slug}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                data-slot={slot.name}
                aria-hidden={!onStage(index)}
                className="group/card absolute overflow-hidden bg-hero-ink will-change-transform"
                style={slotStyle(slot)}
              >
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  src={urls.preview}
                  poster={urls.poster}
                  muted
                  loop
                  playsInline
                  preload={slot.name === "centre" ? "metadata" : "none"}
                  aria-label={reel.alt}
                  className="size-full object-cover"
                />
                {/* The centre card's 4px white frame fades in as it arrives. */}
                <span
                  data-frame
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] border-4 border-white"
                  style={{ opacity: slot.name === "centre" ? 1 : 0 }}
                />
                <span className="absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-hero-ink/82 px-2.5 py-1.5 text-xs font-semibold text-white group-data-[slot=centre]/card:bottom-[18px] group-data-[slot=centre]/card:left-[18px] group-data-[slot=centre]/card:px-3 group-data-[slot=centre]/card:py-[7px] group-data-[slot=centre]/card:text-[13px]">
                  {reel.caption}
                </span>
              </div>
            );
          })}

          <Link
            to="/media-house"
            hash="reels"
            aria-label="Watch MediaHouse reels"
            className="absolute left-[216px] top-[254px] z-[4] grid size-16 place-items-center rounded-full bg-white/92 text-hero-ink shadow-[0_10px_28px_rgba(15,42,44,0.18)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal"
          >
            <PlayIcon className="ml-0.5 size-[22px]" />
          </Link>

          <div className="absolute right-[22px] top-[18px] z-[5] flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-hero-ink shadow-[0_10px_28px_rgba(15,42,44,0.14)]">
            <span aria-hidden="true" className="size-2 rounded-full bg-glow" />
            MediaHouse reels
          </div>

          <div className="absolute bottom-[18px] left-0 z-[5] flex w-[300px] items-start gap-3.5 rounded-[18px] bg-white px-[18px] py-4 text-hero-ink shadow-[0_16px_40px_rgba(15,42,44,0.18)]">
            <span className="grid size-10 flex-none place-items-center rounded-xl bg-hero-ink text-aqua">
              <Bot aria-hidden="true" className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[15px] font-bold">New enquiry from Meta ad</span>
              <span className="font-mono text-xs text-hero-muted">→ CRM → WhatsApp reply sent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Phones: the reels glide left to right in an endless strip, three to a
 * screen. The list is drawn twice so the loop is seamless; only the reels on
 * screen play.
 */
function ReelStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const video = target as HTMLVideoElement;
          if (isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { root: strip, threshold: 0.1 },
    );
    strip.querySelectorAll("video").forEach((video) => io.observe(video));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Recent MediaHouse work" className="-mx-5 md:hidden">
      <div data-hero-showcase ref={stripRef} className="overflow-hidden">
        <div className="marquee flex w-max [--marquee-duration:36s] [animation-direction:reverse]">
          {[0, 1].map((copy) =>
            heroReels.map((reel) => {
              const urls = reelUrls(reel.industry, reel.slug);
              return (
                <div
                  key={`${copy}-${reel.slug}`}
                  aria-hidden={copy === 1 || undefined}
                  className="w-[calc((100vw-24px)/3)] shrink-0 pr-2"
                >
                  <div className="relative h-40 overflow-hidden rounded-2xl bg-hero-ink shadow-[0_10px_24px_rgba(15,42,44,0.16)]">
                    <video
                      src={urls.preview}
                      poster={urls.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label={copy === 0 ? reel.alt : undefined}
                      className="size-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 max-w-[calc(100%-16px)] truncate rounded-full bg-hero-ink/82 px-2 py-1 text-[11px] font-semibold text-white">
                      {reel.caption.split(" · ")[0]}
                    </span>
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn(className)}>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
