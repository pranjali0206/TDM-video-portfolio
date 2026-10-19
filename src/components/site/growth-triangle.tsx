import { HandCoins, Megaphone, Users, type LucideIcon } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

// ─── Geometry (SVG units) ────────────────────────────────────────────────────
// An equilateral triangle centred on a 540 × 520 stage: Marketing on top,
// Leads bottom left, Sales bottom right.

const VIEW_W = 540;
const VIEW_H = 520;
const SIDE = 380;

const TOP: Point = { x: VIEW_W / 2, y: 104 };
const LEFT: Point = { x: TOP.x - SIDE / 2, y: TOP.y + (SIDE * Math.sqrt(3)) / 2 };
const RIGHT: Point = { x: TOP.x + SIDE / 2, y: LEFT.y };
const CENTRE: Point = { x: TOP.x, y: (TOP.y + LEFT.y + RIGHT.y) / 3 };

const NODE_R = 38; // the dark disc
const PLATE_R = 48; // the white plate around it
const EDGE_GAP = PLATE_R + 8; // edges stop this far from a node's centre
const LANE = 9; // the Marketing ⇄ Sales lanes sit this far either side of that edge
const LABEL_GAP = 16; // edge words sit this far off their line (clear of the comet's glow)
const HEAD = 11; // arrowhead arm length
const HEAD_SPREAD = Math.tan((36 * Math.PI) / 180);

const round = (n: number) => Math.round(n * 100) / 100;
const add = (p: Point, v: Point, k = 1): Point => ({ x: p.x + v.x * k, y: p.y + v.y * k });
const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const direction = (from: Point, to: Point): Point => {
  const length = distance(from, to);
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
};
const pathOf = (...points: Point[]) =>
  points.map((p, i) => `${i ? "L" : "M"}${round(p.x)} ${round(p.y)}`).join(" ");

/** The unit normal of a triangle edge that points away from the centre. */
function outward(a: Point, b: Point): Point {
  const d = direction(a, b);
  const normal = { x: -d.y, y: d.x };
  const away = (a.x + b.x) / 2 - CENTRE.x;
  const down = (a.y + b.y) / 2 - CENTRE.y;
  return away * normal.x + down * normal.y >= 0 ? normal : { x: -normal.x, y: -normal.y };
}

const LEFT_OUT = outward(TOP, LEFT);
const FACE = `${pathOf(TOP, LEFT, RIGHT)} Z`;

// Soft colour on the face: each corner breathes its own light theme colour
// inwards (aqua from Marketing, lime from Leads, teal from Sales), clearing
// to white around the ∞.
const WASHES = [
  { key: "top", at: TOP, token: "--aqua", opacity: 0.55 },
  { key: "left", at: LEFT, token: "--teal", opacity: 0.42 },
  { key: "right", at: RIGHT, token: "--hero-teal-2", opacity: 0.3 },
];
const BASE_OUT = outward(LEFT, RIGHT);
const RIGHT_OUT = outward(TOP, RIGHT);

/** A line between two nodes (optionally shifted sideways) and its open arrowhead. */
function arrow(from: Point, to: Point, shift = 0) {
  const d = direction(from, to);
  const side = { x: -d.y, y: d.x };
  const trim = Math.sqrt(EDGE_GAP ** 2 - shift ** 2);
  const start = add(add(from, RIGHT_OUT, shift), d, trim);
  const tip = add(add(to, RIGHT_OUT, shift), d, -trim);
  const back = add(tip, d, -HEAD);
  return {
    line: pathOf(start, tip),
    head: pathOf(add(back, side, HEAD * HEAD_SPREAD), tip, add(back, side, -HEAD * HEAD_SPREAD)),
  };
}

const EDGES = {
  brings: arrow(TOP, LEFT),
  convert: arrow(LEFT, RIGHT),
  // Two lanes between Marketing and Sales: down the inside, back up the outside.
  sells: arrow(TOP, RIGHT, -LANE),
  returns: arrow(RIGHT, TOP, LANE),
};

// Each word runs along its edge, reading left to right, glyphs facing outwards.
const LABEL_PATHS = {
  brings: pathOf(add(LEFT, LEFT_OUT, LABEL_GAP), add(TOP, LEFT_OUT, LABEL_GAP)),
  convert: pathOf(add(LEFT, BASE_OUT, LABEL_GAP), add(RIGHT, BASE_OUT, LABEL_GAP)),
  returns: pathOf(add(TOP, RIGHT_OUT, LANE + LABEL_GAP), add(RIGHT, RIGHT_OUT, LANE + LABEL_GAP)),
};

// The growth loop the comet rides: Marketing → Leads → Sales, then back up
// the outside lane to Marketing. The short hops in and out of that lane are
// hidden under the Sales and Marketing nodes.
const LOOP_POINTS = [TOP, LEFT, RIGHT, add(RIGHT, RIGHT_OUT, LANE), add(TOP, RIGHT_OUT, LANE), TOP];
const LOOP = pathOf(...LOOP_POINTS);
const legs = LOOP_POINTS.slice(1).map((point, i) => distance(LOOP_POINTS[i] ?? point, point));
const loopLength = legs.reduce((sum, leg) => sum + leg, 0);
/** Where the comet sits at each node, as a fraction of the loop. */
const STOPS = [0, legs[0]! / loopLength, (legs[0]! + legs[1]!) / loopLength, 1];

/**
 * A lemniscate (∞) through the triangle's centre, as a smooth closed spline:
 * `width` across, its lobes `height` tall.
 */
function infinityPath(centre: Point, width: number, height: number, samples = 64) {
  const a = width / 2;
  // A plain lemniscate's lobes are 0.707a tall; stretch them to `height`.
  const k = height / (a * Math.SQRT1_2);
  const points = Array.from({ length: samples }, (_, i) => {
    const t = (i / samples) * Math.PI * 2;
    const s = 1 + Math.sin(t) ** 2;
    return {
      x: centre.x + (a * Math.cos(t)) / s,
      y: centre.y + (k * a * Math.sin(t) * Math.cos(t)) / s,
    };
  });
  const at = (i: number) => points[(i + samples) % samples]!;
  let d = `M${round(at(0).x)} ${round(at(0).y)}`;
  for (let i = 0; i < samples; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d +=
      `C${round(p1.x + (p2.x - p0.x) / 6)} ${round(p1.y + (p2.y - p0.y) / 6)} ` +
      `${round(p2.x - (p3.x - p1.x) / 6)} ${round(p2.y - (p3.y - p1.y) / 6)} ` +
      `${round(p2.x)} ${round(p2.y)}`;
  }
  return `${d}Z`;
}

const INFINITY_CENTRE: Point = { x: CENTRE.x, y: CENTRE.y - 11 };
const INFINITY_W = 132;
const INFINITY = infinityPath(INFINITY_CENTRE, INFINITY_W, 60);

// ─── Timing (seconds) ────────────────────────────────────────────────────────
// The entrance is CSS, so it plays from the first paint: Marketing appears and
// each edge draws towards the node it feeds. The comet loop starts after it.

const ENTER = {
  top: 0.2,
  brings: 0.4,
  left: 0.95,
  convert: 1.0,
  right: 1.55,
  lanes: 1.6,
  infinity: 1.3,
  caption: 2.2,
};
const DRAW = 0.7;
const COMET_DELAY = 2.6;
const LEG = 2.2; // seconds the comet takes per edge

const delay = (seconds: number, duration?: number) =>
  ({ "--d": `${seconds}s`, ...(duration ? { "--dur": `${duration}s` } : {}) }) as CSSProperties;

// Comet layers, widest glow first. Each one stretches with the comet's speed:
// `min` at rest in a node, `min + max` at full speed mid-edge.
const COMET = [
  { min: 0.01, max: 0.1, className: "stroke-interactive opacity-70", width: 10, glow: true },
  { min: 0.004, max: 0.13, className: "stroke-aqua opacity-70", width: 4 },
  { min: 0.004, max: 0.05, className: "stroke-aqua", width: 4.5 },
  { min: 0.002, max: 0, className: "stroke-white", width: 6.5 },
];

const NODES: {
  id: string;
  label: string;
  at: Point;
  Icon: LucideIcon;
  enter: number;
  labelY: number;
}[] = [
  {
    id: "top",
    label: "Marketing",
    at: TOP,
    Icon: Megaphone,
    enter: ENTER.top,
    labelY: TOP.y - PLATE_R - 16,
  },
  {
    id: "left",
    label: "Leads",
    at: LEFT,
    Icon: Users,
    enter: ENTER.left,
    labelY: LEFT.y + PLATE_R + 34,
  },
  {
    id: "right",
    label: "Sales",
    at: RIGHT,
    Icon: HandCoins,
    enter: ENTER.right,
    labelY: RIGHT.y + PLATE_R + 34,
  },
];

// Label sizes are set on screen pixels: --tri-k (SVG units per CSS pixel) is
// kept up to date from the drawn width, so words stay the same size whatever
// size the triangle is.
const EDGE_LABEL =
  "fill-hero-teal font-display font-bold tracking-[0.16em] [font-stretch:normal] text-[length:calc(var(--tri-k,1.3)*12.5px)]";

const ID = "growth-tri";

/**
 * The home hero's growth loop: Marketing brings Leads, Leads convert into
 * Sales, and Sales return profit and growth to Marketing — round and round,
 * with an ∞ at its heart. Edges draw in on load; then a comet of light rides
 * the loop and each node pulses as it arrives.
 */
export function GrowthTriangle() {
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const fit = () =>
      svg.style.setProperty("--tri-k", String(VIEW_W / Math.max(svg.clientWidth, 1)));
    const observer = new ResizeObserver(fit);
    observer.observe(svg);
    fit();
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        const layers = gsap.utils.toArray<SVGPathElement>("[data-comet-layer]");
        const ease = gsap.parseEase("power2.inOut");
        const comet = { t: 0 };

        // t runs 0 → 3, one unit per edge. The head eases from node to node;
        // the trail is longest mid-edge, where the comet is fastest.
        const draw = () => {
          const leg = Math.min(Math.floor(comet.t), 2);
          const u = comet.t - leg;
          const from = STOPS[leg] ?? 0;
          const head = from + ((STOPS[leg + 1] ?? 1) - from) * ease(u);
          const stretch = Math.sin(Math.PI * u);
          for (const layer of layers) {
            const length = Number(layer.dataset["min"]) + Number(layer.dataset["max"]) * stretch;
            layer.style.strokeDasharray = `${length} ${1 - length}`;
            layer.style.strokeDashoffset = `${length - head}`;
          }
        };

        const pulse = (node: string) =>
          gsap
            .timeline()
            .fromTo(
              `[data-ring="${node}"]`,
              { scale: 1, opacity: 0.9 },
              {
                scale: 1.75,
                opacity: 0,
                duration: 1.4,
                ease: "expo.out",
                transformOrigin: "50% 50%",
                immediateRender: false,
              },
            )
            .fromTo(
              `[data-core="${node}"]`,
              { scale: 1 },
              {
                scale: 1.08,
                duration: 0.22,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
                transformOrigin: "50% 50%",
                immediateRender: false,
              },
              0,
            );

        const loop = gsap.timeline({ repeat: -1, delay: COMET_DELAY });
        loop
          .set("[data-comet]", { opacity: 1 }, 0)
          .to(comet, { t: 3, duration: LEG * 3, ease: "none", onUpdate: draw }, 0)
          .add(pulse("top"), 0)
          .add(pulse("left"), LEG)
          .add(pulse("right"), LEG * 2);
        draw();

        // Only run while the hero is on screen.
        const io = new IntersectionObserver(([entry]) => loop.paused(!entry?.isIntersecting));
        if (root) io.observe(root);
        return () => io.disconnect();
      });
    },
    { scope: rootRef },
  );

  return (
    <figure
      ref={rootRef}
      className="flex w-full max-w-[400px] flex-col md:max-w-[440px] lg:w-[clamp(340px,50svh,400px)] lg:max-w-none"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-labelledby={`${ID}-title ${ID}-desc`}
        className="block h-auto w-full overflow-visible"
      >
        <title id={`${ID}-title`}>The TDM growth loop</title>
        <desc id={`${ID}-desc`}>
          Marketing brings leads, leads convert into sales, and sales return profit and growth to
          marketing: one loop that never stops.
        </desc>

        <defs>
          <linearGradient
            id={`${ID}-edge`}
            gradientUnits="userSpaceOnUse"
            x1={LEFT.x}
            y1={TOP.y}
            x2={RIGHT.x}
            y2={RIGHT.y}
          >
            <stop offset="0" style={{ stopColor: "var(--night)" }} />
            <stop offset="1" style={{ stopColor: "var(--deep-teal)" }} />
          </linearGradient>
          <linearGradient id={`${ID}-core`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--hero-teal)" }} />
            <stop offset="0.55" style={{ stopColor: "var(--deep-teal)" }} />
            <stop offset="1" style={{ stopColor: "var(--night)" }} />
          </linearGradient>
          <linearGradient
            id={`${ID}-infinity`}
            gradientUnits="userSpaceOnUse"
            x1={INFINITY_CENTRE.x - INFINITY_W / 2}
            y1={INFINITY_CENTRE.y}
            x2={INFINITY_CENTRE.x + INFINITY_W / 2}
            y2={INFINITY_CENTRE.y}
          >
            <stop offset="0" style={{ stopColor: "var(--night)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--deep-teal)" }} />
            <stop offset="1" style={{ stopColor: "var(--hero-teal-2)" }} />
          </linearGradient>
          <filter id={`${ID}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={`${ID}-lift`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="9"
              style={{ floodColor: "var(--hero-ink)", floodOpacity: 0.16 }}
            />
          </filter>
          <clipPath id={`${ID}-face`}>
            <path d={FACE} />
          </clipPath>
          {WASHES.map(({ key, at, token, opacity }) => (
            <radialGradient
              key={key}
              id={`${ID}-wash-${key}`}
              gradientUnits="userSpaceOnUse"
              cx={at.x}
              cy={at.y}
              r={SIDE * 0.85}
            >
              <stop offset="0" style={{ stopColor: `var(${token})`, stopOpacity: opacity }} />
              <stop offset="1" style={{ stopColor: `var(${token})`, stopOpacity: 0 }} />
            </radialGradient>
          ))}
          <radialGradient
            id={`${ID}-wash-core`}
            gradientUnits="userSpaceOnUse"
            cx={CENTRE.x}
            cy={INFINITY_CENTRE.y + 14}
            r={120}
          >
            <stop offset="0" stopColor="white" stopOpacity="0.95" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {Object.entries(LABEL_PATHS).map(([key, d]) => (
            <path key={key} id={`${ID}-label-${key}`} d={d} />
          ))}
        </defs>

        {/* The shaded face: a soft, light card over the clouds */}
        <g clipPath={`url(#${ID}-face)`} className="tri-fade" style={delay(ENTER.brings)}>
          <path d={FACE} className="fill-white" />
          {WASHES.map(({ key }) => (
            <path key={key} d={FACE} fill={`url(#${ID}-wash-${key})`} />
          ))}
          <circle
            cx={CENTRE.x}
            cy={INFINITY_CENTRE.y + 14}
            r={120}
            fill={`url(#${ID}-wash-core)`}
          />
        </g>

        {/* Edges and their arrowheads */}
        <g
          fill="none"
          stroke={`url(#${ID}-edge)`}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {(
            [
              [EDGES.brings, ENTER.brings],
              [EDGES.convert, ENTER.convert],
              [EDGES.sells, ENTER.lanes],
              [EDGES.returns, ENTER.lanes],
            ] as const
          ).map(([edge, start]) => (
            <g key={edge.line}>
              <path d={edge.line} pathLength={1} className="tri-draw" style={delay(start)} />
              <path d={edge.head} className="tri-fade" style={delay(start + DRAW - 0.1)} />
            </g>
          ))}
        </g>

        {/* Edge words */}
        <text
          textAnchor="middle"
          className={cn(EDGE_LABEL, "tri-fade")}
          style={delay(ENTER.brings + 0.5)}
        >
          <textPath href={`#${ID}-label-brings`} startOffset="50%">
            BRINGS
          </textPath>
        </text>
        <text
          dy="0.72em"
          textAnchor="middle"
          className={cn(EDGE_LABEL, "tri-fade")}
          style={delay(ENTER.convert + 0.5)}
        >
          <textPath href={`#${ID}-label-convert`} startOffset="50%">
            CONVERT
          </textPath>
        </text>
        <text
          textAnchor="middle"
          className={cn(EDGE_LABEL, "tri-fade")}
          style={delay(ENTER.lanes + 0.5)}
        >
          <textPath href={`#${ID}-label-returns`} startOffset="50%">
            PROFIT &amp; GROWTH
          </textPath>
        </text>

        {/* ∞ at the heart of the loop, with a light that runs round it */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={INFINITY}
            pathLength={1}
            stroke={`url(#${ID}-infinity)`}
            strokeWidth={9}
            className="tri-draw"
            style={delay(ENTER.infinity, 1.4)}
          />
          <path
            d={INFINITY}
            pathLength={1}
            strokeWidth={12}
            filter={`url(#${ID}-glow)`}
            className="tri-light stroke-interactive"
            style={delay(ENTER.infinity + 1.6)}
          />
          <path
            d={INFINITY}
            pathLength={1}
            strokeWidth={3.5}
            className="tri-light stroke-aqua"
            style={delay(ENTER.infinity + 1.6)}
          />
        </g>
        <text
          x={CENTRE.x}
          y={INFINITY_CENTRE.y + 62}
          textAnchor="middle"
          className="tri-fade fill-hero-muted font-mono text-[length:calc(var(--tri-k,1.3)*11.5px)] uppercase tracking-[0.18em]"
          style={delay(ENTER.caption)}
        >
          Infinite mindset
        </text>

        {/* The comet: hidden until the loop starts */}
        <g data-comet fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0}>
          {COMET.map((layer) => (
            <path
              key={layer.className}
              data-comet-layer
              data-min={layer.min}
              data-max={layer.max}
              d={LOOP}
              pathLength={1}
              strokeWidth={layer.width}
              filter={layer.glow ? `url(#${ID}-glow)` : undefined}
              className={layer.className}
            />
          ))}
        </g>

        {/* Nodes */}
        {NODES.map(({ id, label, at, Icon, enter, labelY }) => (
          <g key={id}>
            <g className="tri-pop" style={delay(enter)}>
              <circle
                cx={at.x}
                cy={at.y}
                r={PLATE_R}
                filter={`url(#${ID}-lift)`}
                className="fill-white stroke-outline"
                strokeWidth={1}
              />
              <circle
                data-ring={id}
                cx={at.x}
                cy={at.y}
                r={PLATE_R}
                fill="none"
                strokeWidth={2}
                opacity={0}
                className="stroke-interactive"
              />
              <g data-core={id}>
                <circle cx={at.x} cy={at.y} r={NODE_R} fill={`url(#${ID}-core)`} />
                <circle
                  cx={at.x}
                  cy={at.y}
                  r={NODE_R - 1.5}
                  fill="none"
                  strokeWidth={1}
                  className="stroke-white/20"
                />
                <Icon
                  x={at.x - 15}
                  y={at.y - 15}
                  size={30}
                  strokeWidth={1.75}
                  className="text-white"
                  aria-hidden="true"
                />
              </g>
            </g>
            <text
              x={at.x}
              y={labelY}
              textAnchor="middle"
              className="tri-fade fill-hero-ink font-display text-[length:calc(var(--tri-k,1.3)*20px)] font-extrabold tracking-[-0.01em] [font-stretch:normal]"
              style={delay(enter + 0.1)}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>

      {/* Flush left with the Leads plate (its left edge sits 6% in). */}
      <figcaption className="hero-fade mt-6 pl-[6%] [--d:2.2s]">
        <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-hero-muted md:text-xs">
          This is TDM Groups
        </span>
        <span className="mt-2 block text-balance font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-hero-ink [font-stretch:normal] md:text-2xl">
          A single platform for an{" "}
          <span className="text-hero-gradient">infinite growth journey.</span>
        </span>
      </figcaption>
    </figure>
  );
}
