import { useEffect, useRef, type CSSProperties } from "react";

import { readTokenColor } from "@/lib/color";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** One word of the headline; `em` words get the accent colourway. */
export type DotWord = { text: string; italic?: boolean; em?: boolean };

type Dot = {
  /** Home position, in device pixels (the top-left corner of its grid cell). */
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/** The wrapper's height in font sizes: two rows plus ascender and descender room. */
export const DOT_MATRIX_HEIGHT = 2.05;
// Baseline-to-baseline distance, the first baseline's drop from the block top,
// and the gap between words, all as fractions of the font size.
const LINE = 0.88;
const FIRST_BASELINE = 0.76;
const WORD_GAP = 0.22;
// A hairline stroke round every letter (a touch of extra bold on top of
// Black), skipped on small headlines where it would close the counters.
const EMBOLDEN = 0.012;
const EMBOLDEN_MIN_SIZE = 90;
// Font sizes per grid cell: smaller means a finer matrix.
const CELLS = 36;
// A dot this close to home and this slow is snapped exactly onto its cell.
const SNAP_DISTANCE = 0.6;
const SNAP_SPEED = 0.08;
const SPRING = 0.075;
const DAMPING = 0.8;
const PUSH = 5.5;

/** A palette token as an rgb() string, optionally mixed toward black by `darken` (0–1). */
const rgb = (token: string, darken = 0) => {
  const [r, g, b] = readTokenColor(token).map((channel) =>
    Math.round(channel * 255 * (1 - darken)),
  );
  return `rgb(${r} ${g} ${b})`;
};

// Black weights so every stroke is several dots wide and the letters read clearly.
const fontFor = (word: DotWord, size: number) =>
  `${word.italic ? "italic 800" : "900"} ${size}px Fraunces, Georgia, serif`;

/**
 * A headline drawn as a matrix of square dots, after the "impossible to
 * ignore" reference:
 *  - The text is painted off-screen and sampled on a grid snapped to whole
 *    device pixels, so every dot is the same size with the same 1px-ish gap.
 *    A cell becomes a dot when most of it is inside a letter (four
 *    sub-samples), which keeps edges clean.
 *  - The letters are Fraunces Black (plus a hairline stroke on big sizes),
 *    so the matrix reads bold and dark while the counters stay open.
 *  - Dots take one of two colours from thin wavy zebra stripes (about a fifth
 *    of the dots). Plain words are black with dark-teal stripes; accent words
 *    are a deepened coral with black stripes, so teal and coral answer each
 *    other on a dark headline.
 *  - Each dot is on a spring back to its home; the pointer pushes dots out of
 *    a circle that closes again behind it. Homes sit on whole pixels and a
 *    settling dot is snapped exactly onto its cell, so the matrix always comes
 *    to rest as a perfect grid (never a pixel off depending on which side a
 *    dot arrived from).
 *
 * The wrapper's height sets the size: font size = height / DOT_MATRIX_HEIGHT,
 * shrunk further if a row would overflow the width.
 */
export function DotMatrixText({
  lines,
  className,
  style,
  ...rest
}: { lines: DotWord[][]; className?: string; style?: CSSProperties } & Record<
  `data-${string}`,
  unknown
>) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    // [plain base, plain stripe, accent base, accent stripe]
    // Teal stripes and coral are both deepened a little, so the whole headline reads dark.
    const colors = [rgb("--jet"), rgb("--deep-teal", 0.35), rgb("--glow", 0.12), rgb("--jet")];
    const still = prefersReducedMotion();
    // Dots grouped by colour: `groups[c]` holds every dot drawn in colors[c].
    let groups: Dot[][] = [];
    let size = 3;
    let radius = 120;
    let push = PUSH;
    let dpr = 1;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let dirty = true;

    const build = (scatter: boolean) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // Fit: font size from the wrapper's height, shrunk if a row is too wide.
      const measure = document.createElement("canvas").getContext("2d")!;
      let fs = height / DOT_MATRIX_HEIGHT;
      const rowWidth = (row: DotWord[], at: number) =>
        row.reduce((sum, word, i) => {
          measure.font = fontFor(word, at);
          return sum + measure.measureText(word.text).width + (i ? at * WORD_GAP : 0);
        }, 0);
      const widest = Math.max(...lines.map((row) => rowWidth(row, fs)));
      if (widest > width * 0.98) fs *= (width * 0.98) / widest;

      // The grid, in whole device pixels.
      // At least 4px, so a 1px gap never thins the dots out.
      const step = Math.max(4, Math.round((fs * dpr) / CELLS));
      const gap = Math.max(1, Math.round(step * 0.2));
      size = step - gap;
      radius = Math.max(60, fs * 0.85) * dpr;
      push = PUSH * dpr;

      // Paint the text off-screen at device resolution: blue for plain words,
      // red for accent words.
      const paper = document.createElement("canvas");
      paper.width = canvas.width;
      paper.height = canvas.height;
      const p = paper.getContext("2d", { willReadFrequently: true })!;
      p.scale(dpr, dpr);
      p.lineJoin = "round";
      p.lineWidth = fs >= EMBOLDEN_MIN_SIZE ? fs * EMBOLDEN : 0;
      const top = (height - fs * (FIRST_BASELINE + LINE) - fs * 0.29) / 2;
      lines.forEach((row, r) => {
        let x = (width - rowWidth(row, fs)) / 2;
        const baseline = top + fs * (FIRST_BASELINE + LINE * r);
        for (const word of row) {
          p.font = fontFor(word, fs);
          p.fillStyle = p.strokeStyle = word.em ? "#f00" : "#00f";
          p.fillText(word.text, x, baseline);
          if (p.lineWidth) p.strokeText(word.text, x, baseline);
          x += p.measureText(word.text).width + fs * WORD_GAP;
        }
      });

      const { data } = p.getImageData(0, 0, paper.width, paper.height);
      const at = (x: number, y: number) => (Math.floor(y) * paper.width + Math.floor(x)) * 4;
      const next: Dot[][] = colors.map(() => []);
      const cols = Math.floor(paper.width / step);
      const rows = Math.floor(paper.height / step);
      const q = step / 4;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x0 = col * step;
          const y0 = row * step;
          // Four sub-samples per cell; a dot needs at least two of them inked.
          let hits = 0;
          let red = 0;
          let blue = 0;
          for (const [sx, sy] of [
            [q, q],
            [3 * q, q],
            [q, 3 * q],
            [3 * q, 3 * q],
          ] as const) {
            const i = at(x0 + sx, y0 + sy);
            if ((data[i + 3] ?? 0) < 128) continue;
            hits++;
            red += data[i] ?? 0;
            blue += data[i + 2] ?? 0;
          }
          if (hits < 2) continue;
          const em = red > blue;
          // Thin wavy zebra stripes, leaning slightly, like the reference.
          const wave = Math.sin(col * 1.2 + row * 0.32 + Math.sin(row * 0.21) * 2.2);
          // About a fifth of dots are stripes, so the dark base colour leads.
          const c = (em ? 2 : 0) + (wave > 0.8 ? 1 : 0);
          // Whole-pixel home: the dot fills the cell, the gap runs right and below.
          const hx = x0;
          const hy = y0;
          next[c]!.push({
            hx,
            hy,
            x: scatter ? hx + (Math.random() - 0.5) * canvas.width * 0.5 : hx,
            y: scatter ? hy + (Math.random() - 0.5) * canvas.height * 3 : hy,
            vx: 0,
            vy: 0,
          });
        }
      }
      groups = next;
      dirty = true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      groups.forEach((group, c) => {
        ctx.fillStyle = colors[c]!;
        for (const dot of group) ctx.fillRect(Math.round(dot.x), Math.round(dot.y), size, size);
      });
    };

    // Moves every dot one frame; returns whether anything changed on screen
    // (a dot moved, or snapped home this frame, so the snap gets drawn too).
    const tick = () => {
      const r2 = radius * radius;
      let changed = false;
      for (const group of groups) {
        for (const dot of group) {
          const resting = dot.vx === 0 && dot.vy === 0 && dot.x === dot.hx && dot.y === dot.hy;
          if (resting && !pointer.active) continue;
          dot.vx += (dot.hx - dot.x) * SPRING;
          dot.vy += (dot.hy - dot.y) * SPRING;
          if (pointer.active) {
            const dx = dot.x - pointer.x;
            const dy = dot.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const force = ((radius - d) / radius) * push;
              dot.vx += (dx / d) * force;
              dot.vy += (dy / d) * force;
            }
          }
          dot.vx *= DAMPING;
          dot.vy *= DAMPING;
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (
            Math.abs(dot.hx - dot.x) < SNAP_DISTANCE &&
            Math.abs(dot.hy - dot.y) < SNAP_DISTANCE &&
            Math.abs(dot.vx) < SNAP_SPEED &&
            Math.abs(dot.vy) < SNAP_SPEED
          ) {
            if (!resting) changed = true;
            dot.x = dot.hx;
            dot.y = dot.hy;
            dot.vx = 0;
            dot.vy = 0;
          } else changed = true;
        }
      }
      return changed;
    };

    let frame = 0;
    let visible = true;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      // Skip the redraw once every dot has settled and the pointer is away.
      if (tick() || pointer.active || dirty) draw();
      dirty = false;
    };

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      build(!still);
      if (still) draw();
      else loop();
    };
    // Wait for Fraunces (both styles) so the dots trace the real letterforms.
    void Promise.all([
      document.fonts?.load("900 100px Fraunces"),
      document.fonts?.load("italic 800 100px Fraunces"),
    ])
      .catch(() => {})
      .then(start);

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) * dpr;
      pointer.y = (event.clientY - rect.top) * dpr;
      pointer.active =
        pointer.x > -radius &&
        pointer.y > -radius &&
        pointer.x < canvas.width + radius &&
        pointer.y < canvas.height + radius;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!groups.length) return;
      if (Math.abs(wrap.clientWidth - width) < 1 && Math.abs(wrap.clientHeight - height) < 1)
        return;
      build(false);
      draw();
    });
    resizeObserver.observe(wrap);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersection.observe(wrap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [lines]);

  return (
    // A span, so it can sit inside the page's <h1>.
    <span ref={wrapRef} {...rest} className={cn("relative block", className)} style={style}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
    </span>
  );
}
