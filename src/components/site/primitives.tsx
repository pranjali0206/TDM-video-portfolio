import { Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { finePointer, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { toTimecode } from "./content";

// Keep in sync with the `reveal-failsafe` delay in styles.css.
const REVEAL_FAILSAFE_DELAY_MS = 1800;

/**
 * Fades its children up when scrolled into view, `delay` ms after entering.
 * CSS keeps [data-reveal] hidden from the very first paint (no flash before
 * hydration) and fades it in by itself if JavaScript never arrives.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (context) => {
      const el = ref.current;
      if (!el) return;
      const shownByFailsafe = el
        .getAnimations()
        .some((animation) => Number(animation.currentTime ?? 0) >= REVEAL_FAILSAFE_DELAY_MS);
      el.style.animation = "none";
      if (shownByFailsafe || prefersReducedMotion()) return;

      gsap.set(el, { opacity: 0, y: 36 });
      // Arm on the next frame, once the router has settled this page's scroll
      // position — otherwise blocks "passed" at the old position fire early.
      const frame = requestAnimationFrame(() =>
        context.add(() => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () =>
              context.add(() =>
                gsap.to(el, {
                  opacity: 1,
                  y: 0,
                  duration: 1.1,
                  ease: "expo.out",
                  delay: delay / 1000,
                  clearProps: "transform",
                }),
              ),
          });
        }),
      );
      return () => cancelAnimationFrame(frame);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}

/** Pulls its child toward the pointer, then springs back on leave. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.35)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.35)" });

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/** A running 24fps timecode, updated off the React render path. */
export function LiveTimecode({ className, offset = 0 }: { className?: string; offset?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      if (ref.current) {
        ref.current.textContent = toTimecode(offset + ((performance.now() - start) / 1000) * 24);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [offset]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {toTimecode(offset)}
    </span>
  );
}

/** Text that rolls up to a duplicate on hover of the nearest `group` parent. */
export function RollText({ children, className }: { children: ReactNode; className?: string }) {
  const ease = "ease-[cubic-bezier(0.7,0,0.2,1)]";
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <span
        className={cn(
          "block transition-transform duration-500 group-hover:-translate-y-full",
          ease,
        )}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0",
          ease,
        )}
      >
        {children}
      </span>
    </span>
  );
}

/** Camera-viewfinder corner brackets. */
export function Corners({ className, size = "size-4" }: { className?: string; size?: string }) {
  const base = cn("absolute border-current", size);
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-3 text-ink/35", className)}
    >
      <span data-corner className={cn(base, "left-0 top-0 border-l border-t")} />
      <span data-corner className={cn(base, "right-0 top-0 border-r border-t")} />
      <span data-corner className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span data-corner className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

/** Mono "— Capabilities" style section marker. */
/**
 * A thick highlighter stroke that sweeps in behind the text — line by line,
 * following line breaks — the first time it scrolls into view. Remount it
 * (change its `key`) to replay the sweep.
 */
export function Marker({
  children,
  color,
  className,
}: {
  children: ReactNode;
  color: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={cn(
        "box-decoration-clone bg-no-repeat px-[0.08em] transition-[background-size] delay-200 duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundPosition: "0 92%",
        backgroundSize: on ? "100% 0.48em" : "0% 0.48em",
      }}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      data-fade
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal",
        className,
      )}
    >
      <span className="h-px w-8 bg-current opacity-60" />
      <span>{children}</span>
    </p>
  );
}

type VideoSlotProps = {
  title: string;
  /** Drop a real video URL in (e.g. "/videos/plot-walkthrough.mp4") to replace the placeholder. */
  src?: string | undefined;
  poster?: string;
  label?: string;
  cursorLabel?: string;
  className?: string;
  size?: "sm" | "lg";
  /** Blinks the label dot, like a camera that's recording. */
  live?: boolean;
};

/**
 * Video slot. Renders the looping video when `src` is set; until then it shows
 * an honest placeholder — the poster photo if given, otherwise a soft animated
 * teal/coral "signal" — so no fake footage ships.
 */
export function VideoSlot({
  title,
  src,
  poster,
  label = "Clip",
  cursorLabel = "Play",
  className,
  size = "sm",
  live = false,
}: VideoSlotProps) {
  const onPhoto = Boolean(src || poster);

  return (
    <figure
      // A playing video needs no "Play" cursor; the placeholder keeps it.
      data-cursor={src ? undefined : "play"}
      data-cursor-label={src ? undefined : cursorLabel}
      className={cn(
        "group @container relative isolate overflow-hidden rounded-2xl ring-1 ring-ink/10",
        onPhoto ? "bg-ink text-ivory" : "bg-white/80 text-ink",
        className,
      )}
    >
      {src ? (
        <video
          // React doesn't render `muted` into the server HTML, so browsers can
          // refuse to autoplay; mute and start it explicitly once mounted.
          ref={(video) => {
            if (!video) return;
            video.muted = true;
            void video.play().catch(() => {});
          }}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
      ) : poster ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="video-signal absolute inset-0" />
      )}

      {onPhoto && (
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/30" />
      )}
      <Corners
        className={cn(
          size === "lg" ? "inset-5 md:inset-8" : "inset-3",
          onPhoto ? "text-ivory/60" : "text-ink/30",
        )}
        size={size === "lg" ? "size-6" : "size-3"}
      />

      <div
        className={cn(
          "absolute inset-x-0 top-0 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]",
          onPhoto ? "text-ivory" : "text-ink",
          size === "lg" ? "p-7 md:p-12" : "p-5",
        )}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className={cn("size-1.5 rounded-full bg-glow", live && "rec-blink")} />
          {label}
        </span>
        {!src && <span className="hidden @min-[15rem]:inline">Placeholder</span>}
      </div>

      {/* Play button only on placeholders; real videos just play. */}
      {!src && (
        <span
          className={cn(
            "absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition duration-500 group-hover:scale-110 group-hover:bg-glow group-hover:text-ink",
            onPhoto
              ? "border border-ivory/40 bg-ivory/15 text-ivory backdrop-blur-md"
              : "bg-accent text-ink shadow-[0_12px_30px_-10px_var(--accent)]",
            size === "lg" ? "size-20 md:size-28" : "size-12 md:size-14",
          )}
        >
          <Play
            className={cn(
              "translate-x-[6%]",
              size === "lg" ? "size-7 md:size-9" : "size-4 md:size-5",
            )}
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
      )}

      <figcaption
        className={cn(
          "absolute inset-x-0 bottom-0 font-semibold",
          size === "lg"
            ? "p-7 pb-9 text-xl md:p-12 md:pb-28 md:text-3xl"
            : "p-5 text-sm md:text-base",
        )}
      >
        {title}
      </figcaption>
    </figure>
  );
}
