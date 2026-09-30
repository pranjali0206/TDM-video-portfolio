import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { readTokenColor } from "@/lib/color";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { formats } from "./content";
import { createRingScene } from "./formats-ring-scene";
import { SectionLabel } from "./primitives";

// Twice round the six formats makes a denser, more cinematic curved wall.
const PANELS = [...formats, ...formats];
const STEP = (Math.PI * 2) / PANELS.length;

// Browser-only: the SSR flag is static, so the server bundle drops three.js entirely.
const loadThree = import.meta.env.SSR ? null : () => import("three");

/**
 * "One idea. Infinite momentum." — the six formats on a WebGL ring. The page
 * scrolls past normally; the arrow buttons (or a sideways drag) turn the
 * ring. three.js is only fetched once the section is close to the viewport.
 */
export function FormatsRing() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const turn = useRef(0);
  const drag = useRef(0);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"webgl" | "fallback">("webgl");

  // Each press moves the ring one panel; the scene eases toward the new angle.
  const move = (steps: 1 | -1) => {
    turn.current += steps * STEP;
  };

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-format-title]",
        { yPercent: 105 },
        { yPercent: 0, duration: 0.9, ease: "expo.out" },
      );
      gsap.fromTo(
        "[data-format-tag]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "expo.out" },
      );
    },
    { scope: rootRef, dependencies: [active] },
  );

  // Load three.js lazily and mount the scene.
  useEffect(() => {
    const stage = stageRef.current;
    if (mode !== "webgl" || !stage) return;
    if (prefersReducedMotion()) {
      setMode("fallback");
      return;
    }

    let dispose: (() => void) | null = null;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !loadThree) return;
        observer.disconnect();
        loadThree()
          .then((THREE) => {
            if (cancelled) return;
            dispose = createRingScene(THREE, stage, {
              images: PANELS.map((format) => format.image),
              base: readTokenColor("--secondary"),
              getTarget: () => turn.current + drag.current,
              onActive: (index) => setActive(index % formats.length),
            });
          })
          .catch((error: unknown) => {
            console.warn("Formats ring fell back to static layout", error);
            if (!cancelled) setMode("fallback");
          });
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(stage);

    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
    };
  }, [mode]);

  // Drag to spin (horizontal only — vertical gestures keep scrolling the page).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let startX = 0;
    let startDrag = 0;
    let dragging = false;

    const down = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      startDrag = drag.current;
    };
    const move = (event: PointerEvent) => {
      if (dragging) drag.current = startDrag + (startX - event.clientX) * 0.006;
    };
    const up = () => {
      dragging = false;
    };

    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [mode]);

  const current = formats[active] ?? formats[0]!;

  return (
    <section
      ref={rootRef}
      id="formats"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-secondary text-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[58%] size-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 55%)",
        }}
      />

      {mode === "webgl" ? (
        <div
          ref={stageRef}
          data-cursor="drag"
          data-cursor-label="Drag"
          aria-hidden="true"
          className="absolute inset-0 touch-pan-y select-none"
        />
      ) : (
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:px-14">
          {formats.map((format) => (
            <figure
              key={format.title}
              className="aspect-[4/5] w-[62vw] shrink-0 snap-center overflow-hidden rounded-3xl md:w-[24vw]"
            >
              <img
                src={format.image}
                alt={format.title}
                loading="lazy"
                className="size-full object-cover"
              />
            </figure>
          ))}
        </div>
      )}

      <ul className="sr-only">
        {formats.map((format) => (
          <li key={format.title}>
            {format.title} — {format.tag}
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-x-6 top-24 flex flex-col items-center text-center md:top-28">
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

      <div className="pointer-events-none absolute inset-x-6 bottom-8 flex items-end justify-between gap-6 md:inset-x-14 md:bottom-24">
        <div aria-hidden="true">
          <div className="overflow-hidden">
            <p
              data-format-title
              className="font-display text-[13vw] uppercase leading-[0.92] md:text-[min(6vw,9svh)]"
              style={{ fontStretch: "118%" }}
            >
              {current.title}
            </p>
          </div>
          <p data-format-tag className="mt-2 font-serif text-2xl italic text-deep-teal md:text-3xl">
            {current.tag}
          </p>
        </div>
        <div className="shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
          <p>
            <span
              className="font-display text-4xl text-ink md:text-5xl"
              style={{ fontStretch: "118%" }}
            >
              0{active + 1}
            </span>{" "}
            / 0{formats.length}
          </p>
          <div className="ml-auto mt-3 h-px w-28 bg-ink/15 md:w-40">
            <span
              className="block h-full origin-left bg-glow transition-transform duration-700 ease-out"
              style={{ transform: `scaleX(${(active + 1) / formats.length})` }}
            />
          </div>
          {mode === "webgl" && (
            <div className="pointer-events-auto mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous format"
                className="grid size-12 place-items-center rounded-full border border-ink/25 bg-white/60 text-ink backdrop-blur-md transition-colors hover:border-ink hover:bg-ink hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:size-14"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next format"
                className="grid size-12 place-items-center rounded-full bg-ink text-accent transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:size-14"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          )}
          <p className="mt-3 hidden md:block">Tap the arrows or drag</p>
        </div>
      </div>
    </section>
  );
}
