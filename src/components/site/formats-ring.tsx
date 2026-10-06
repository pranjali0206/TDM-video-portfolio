import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

import { SectionLabel } from "./primitives";
import { ringReels, reelUrls } from "./reels";

const COUNT = ringReels.length;
const STEP = 360 / COUNT;
// Degrees per second the ring turns on its own.
const DRIFT = 9;

/**
 * "One idea. Infinite momentum." — real MediaHouse reels on a turning 3D ring
 * (CSS 3D, plain <video>, so the clips play straight from the video host).
 * It turns on its own, can be dragged or stepped with the arrows, and only
 * the reels facing the viewer play.
 */
export function FormatsRing() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const motion = useRef({ angle: 0, nudge: 0, dragging: false, hover: false });

  const step = (direction: 1 | -1) => {
    const m = motion.current;
    gsap.to(m, { nudge: m.nudge - direction * STEP, duration: 0.9, ease: "power3.out" });
  };

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    const reduced = prefersReducedMotion();
    const m = motion.current;

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (!visible) videoRefs.current.forEach((video) => video?.pause());
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(stage);

    const render = () => {
      const turn = m.angle + m.nudge;
      ring.style.transform = `translateZ(calc(var(--radius) * -1)) rotateY(${turn}deg)`;
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        // 1 = facing the viewer, -1 = facing away.
        const facing = Math.cos(((index * STEP + turn) * Math.PI) / 180);
        panel.style.opacity = String(Math.max(0, 0.25 + 0.75 * facing));
        const video = videoRefs.current[index];
        if (!video || reduced) return;
        if (visible && facing > 0.35) {
          if (video.paused) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      if (!reduced && !m.dragging) {
        m.angle -= DRIFT * (m.hover ? 0.3 : 1) * (Math.min(deltaTime, 50) / 1000);
      }
      render();
    };
    gsap.ticker.add(tick);
    render();

    // Drag sideways to spin; vertical swipes keep scrolling the page.
    let startX = 0;
    let startAngle = 0;
    let pointer: number | null = null;
    let moved = false;
    const down = (event: PointerEvent) => {
      pointer = event.pointerId;
      startX = event.clientX;
      startAngle = m.angle;
      moved = false;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        m.dragging = true;
        stage.setPointerCapture(event.pointerId);
      }
      if (moved) m.angle = startAngle + dx * 0.25;
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      pointer = null;
      m.dragging = false;
    };
    // A drag that ends on a reel shouldn't also open it.
    const swallowClick = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };
    const enter = () => (m.hover = true);
    const leave = () => (m.hover = false);
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("click", swallowClick, true);
    stage.addEventListener("pointerenter", enter);
    stage.addEventListener("pointerleave", leave);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("click", swallowClick, true);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section
      id="formats"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-secondary py-24 text-ink md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] size-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 55%)",
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <SectionLabel>Formats</SectionLabel>
        <h2 className="mt-5 text-4xl leading-[0.95] md:text-6xl">
          One idea.{" "}
          <span
            className="font-serif font-normal italic tracking-normal text-glow"
            style={{ fontStretch: "100%" }}
          >
            Infinite
          </span>{" "}
          momentum.
        </h2>
      </div>

      {/* The ring */}
      <div
        ref={stageRef}
        data-cursor="drag"
        data-cursor-label="Drag"
        className="relative my-auto flex cursor-grab touch-pan-y select-none items-center justify-center py-10 [--panel:clamp(11rem,min(22vw,42svh),22rem)] [--radius:calc(var(--panel)*2.05)] [perspective:1800px] active:cursor-grabbing md:py-14"
      >
        <div
          className="relative h-[calc(var(--panel)*1.25)] w-[var(--panel)] [transform-style:preserve-3d]"
          style={{ transform: "rotateX(-6deg)" }}
        >
          <div ref={ringRef} className="absolute inset-0 [transform-style:preserve-3d]">
            {ringReels.map((reel, index) => {
              const urls = reelUrls(reel.industry, reel.slug);
              return (
                <div
                  key={reel.slug}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{ transform: `rotateY(${index * STEP}deg) translateZ(var(--radius))` }}
                >
                  <Link
                    to="/media-house"
                    search={{ tab: reel.industry }}
                    hash="reels"
                    draggable={false}
                    aria-label={reel.title}
                    className="block size-full overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_40px_80px_-35px_rgba(0,40,40,0.65)] ring-1 ring-ink/10"
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={urls.preview}
                      poster={urls.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="pointer-events-none size-full object-cover"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls: arrows either side of the one call to action. */}
      <div className="relative flex items-center justify-center gap-3 px-6">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous reels"
          className="grid size-12 place-items-center rounded-full border border-ink/25 bg-white/60 text-ink backdrop-blur-md transition-colors hover:border-ink hover:bg-ink hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:size-14"
        >
          <ArrowLeft className="size-5" />
        </button>
        <Link
          to="/media-house"
          hash="reels"
          className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pl-7 pr-2 text-base font-semibold text-ivory transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:h-14"
        >
          View more
          <span className="grid size-9 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45 md:size-10">
            <ArrowUpRight className="size-5" />
          </span>
        </Link>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next reels"
          className="grid size-12 place-items-center rounded-full bg-ink text-accent transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:size-14"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
