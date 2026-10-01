import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tdmLogo from "@/assets/tdm-logo.webp";
import { finePointer, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { problemSolutions } from "./content";
import { tones, type Tone } from "./tones";

const COUNT = problemSolutions.length;
const TAU = Math.PI * 2;
const FRONT = Math.PI / 2; // straight down the screen = nearest the viewer
const STEP = TAU / COUNT;
const MERIDIANS = 7;
const SATELLITES = 3;
const ADVANCE_MS = 4600;

// One colour per service, in content order:
// MediaHouse, Ads, Websites, CRM, ERP, Automations, AI Agents.
const serviceTones: Tone[] = ["coral", "lime", "teal", "ink", "blush", "deep", "mint"];
export const toneOf = (index: number) => tones[serviceTones[index % serviceTones.length]!];
// Marker colour under the service name (dark tones would vanish under ink text).
export const markOf = (index: number) => {
  const tone = serviceTones[index % serviceTones.length];
  return tone === "ink" || tone === "deep" ? "var(--accent)" : toneOf(index).bg;
};

/** Initial (pre-JS) spot on the ring, as percentages, so SSR isn't a heap. */
const fallbackSpot = (index: number) => {
  const theta = FRONT + index * STEP;
  // Rounded so server and browser print identical strings (float noise breaks hydration).
  return {
    left: `${(50 + Math.cos(theta) * 38).toFixed(2)}%`,
    top: `${(50 + Math.sin(theta) * 15).toFixed(2)}%`,
  };
};

// ─── The globe ───────────────────────────────────────────────────────────────

function Globe({
  globeRef,
  meridianRefs,
}: {
  globeRef: React.RefObject<HTMLDivElement | null>;
  meridianRefs: React.RefObject<(SVGEllipseElement | null)[]>;
}) {
  const latitudes = [-60, -30, 0, 30, 60];
  return (
    <div
      ref={globeRef}
      className="absolute left-1/2 top-1/2 z-10 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 sm:w-[36%]"
    >
      {/* Signal rings broadcasting outward. */}
      <span className="ring-pulse absolute inset-0 rounded-full border-2 border-accent" />
      <span className="ring-pulse absolute inset-0 rounded-full border-2 border-accent [animation-delay:-1.8s]" />

      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(circle at 36% 30%, #fff 0%, #fff 28%, color-mix(in oklab, var(--accent) 38%, white) 60%, color-mix(in oklab, var(--accent) 85%, var(--deep-teal)) 100%)",
          boxShadow:
            "0 50px 90px -40px rgba(0, 70, 70, 0.55), inset -18px -26px 60px rgba(0, 90, 90, 0.22), 0 0 0 12px color-mix(in oklab, var(--accent) 14%, transparent)",
        }}
      >
        {/* Wireframe: static latitudes, meridians spun from the animation loop. */}
        <svg viewBox="-100 -100 200 200" aria-hidden="true" className="absolute inset-0 size-full">
          <g fill="none" stroke="var(--deep-teal)" strokeOpacity="0.22" strokeWidth="0.8">
            {latitudes.map((lat) => {
              const r = 96 * Math.cos((lat * Math.PI) / 180);
              return (
                <ellipse
                  key={lat}
                  cx="0"
                  cy={96 * Math.sin((lat * Math.PI) / 180)}
                  rx={r}
                  ry={r * 0.22}
                />
              );
            })}
            {Array.from({ length: MERIDIANS }, (_, k) => (
              <ellipse
                key={k}
                ref={(el) => {
                  meridianRefs.current[k] = el;
                }}
                cx="0"
                cy="0"
                rx={96 * Math.abs(Math.sin((k * Math.PI) / MERIDIANS))}
                ry="96"
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="absolute size-[62%] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 30%, transparent 70%)",
            }}
          />
          <img
            src={tdmLogo}
            alt="TDM Groups"
            className="relative w-[52%] drop-shadow-[0_6px_10px_rgba(0,60,60,0.25)]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── The orbit stage ─────────────────────────────────────────────────────────

/**
 * A tilted ring of seven service "planets" around the TDM globe. Positions
 * are driven from GSAP's ticker: nodes in front of the globe draw larger and
 * above it, nodes behind it smaller and underneath. Changing `active` swings
 * the ring so that service comes to the front, and a beam links it home.
 */
function ServiceOrbit({ active }: { active: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const outerRingRef = useRef<SVGEllipseElement>(null);
  const frontArcRef = useRef<SVGPathElement>(null);
  const beamRef = useRef<SVGLineElement>(null);
  const beamDotRef = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const satelliteRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const meridianRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const activeRef = useRef(active);
  const motion = useRef({
    angle: FRONT,
    time: 0,
    width: 0,
    height: 0,
    globeRadius: 0,
    nodeHalf: Array.from({ length: COUNT }, () => 0),
    spread: Array.from({ length: COUNT }, () => ({ v: 1 })),
  });

  useEffect(() => {
    activeRef.current = active;
    const m = motion.current;
    const target = FRONT - active * STEP;
    // Shortest way round, so the ring never spins the long way.
    const diff = ((((target - m.angle) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
    gsap.to(m, {
      angle: m.angle + diff,
      duration: prefersReducedMotion() ? 0 : 1.4,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [active]);

  useGSAP(
    (context) => {
      const stage = stageRef.current;
      const globe = globeRef.current;
      if (!stage || !globe) return;
      const reduced = prefersReducedMotion();
      const m = motion.current;

      nodeRefs.current.forEach((node) => {
        if (!node) return;
        node.style.left = "0px";
        node.style.top = "0px";
      });

      const geometry = () => {
        const compact = m.width < 520;
        // Phones: a rounder ring and room at the edges for the small labelled pills;
        // the ring always clears the globe so front pills don't sit on the logo.
        const rx = m.width / 2 - (compact ? 64 : 96);
        const ry = Math.max(rx * (compact ? 0.56 : 0.34), m.globeRadius + (compact ? 22 : 0));
        return { cx: m.width / 2, cy: m.height / 2, rx, ry };
      };

      const measure = () => {
        const rect = stage.getBoundingClientRect();
        m.width = rect.width;
        m.height = rect.height;
        m.globeRadius = globe.offsetWidth / 2;
        nodeRefs.current.forEach((node, i) => {
          m.nodeHalf[i] = node ? node.offsetWidth / 2 : 0;
        });
        const { cx, cy, rx, ry } = geometry();
        for (const [el, scale] of [
          [ringRef.current, 1],
          [outerRingRef.current, 1.16],
        ] as const) {
          el?.setAttribute("cx", String(cx));
          el?.setAttribute("cy", String(cy));
          el?.setAttribute("rx", String(rx * scale));
          el?.setAttribute("ry", String(ry * scale * 1.12));
        }
        // Lower half of the ring passes in front of the globe.
        frontArcRef.current?.setAttribute(
          "d",
          `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`,
        );
      };
      const resize = new ResizeObserver(measure);
      resize.observe(stage);
      measure();
      // Pill widths change once the web fonts arrive.
      void document.fonts?.ready.then(measure);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
      });
      io.observe(stage);

      const render = () => {
        const { cx, cy, rx, ry } = geometry();
        let beamTarget: { x: number; y: number; depth: number } | null = null;

        nodeRefs.current.forEach((node, i) => {
          if (!node) return;
          const theta = m.angle + i * STEP;
          const spread = m.spread[i]?.v ?? 1;
          const depth = (Math.sin(theta) + 1) / 2; // 0 = behind the globe, 1 = in front
          const bob = reduced ? 0 : Math.sin(m.time * 1.6 + i * 1.3) * 5;
          const scale = (0.7 + 0.38 * depth) * (0.35 + 0.65 * spread);
          // Keep the whole pill (label included) inside the stage on narrow screens.
          const half = (m.nodeHalf[i] ?? 0) * scale + 6;
          const x = Math.min(
            Math.max(cx + Math.cos(theta) * rx * spread, half),
            Math.max(half, m.width - half),
          );
          const y = cy + Math.sin(theta) * ry * spread + bob;
          node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
          node.style.zIndex = depth > 0.5 ? "20" : "5";
          node.style.opacity = String((0.42 + 0.58 * depth) * Math.min(1, spread * 1.4));
          if (i === activeRef.current) beamTarget = { x, y, depth };
        });

        const beam = beamRef.current;
        const dot = beamDotRef.current;
        if (beam && dot && beamTarget) {
          const { x, y, depth } = beamTarget as { x: number; y: number; depth: number };
          const dx = x - cx;
          const dy = y - cy;
          const length = Math.hypot(dx, dy) || 1;
          const sx = cx + (dx / length) * m.globeRadius * 0.96;
          const sy = cy + (dy / length) * m.globeRadius * 0.96;
          beam.setAttribute("x1", String(sx));
          beam.setAttribute("y1", String(sy));
          beam.setAttribute("x2", String(x));
          beam.setAttribute("y2", String(y));
          dot.setAttribute("cx", String(sx));
          dot.setAttribute("cy", String(sy));
          const show = String(Math.min(1, Math.max(0, (depth - 0.6) * 3)) * (m.spread[0]?.v ?? 1));
          beam.style.opacity = show;
          dot.style.opacity = show;
        }

        satelliteRefs.current.forEach((sat, k) => {
          if (!sat) return;
          const theta = -m.time * 0.32 + (k * TAU) / SATELLITES;
          const depth = (Math.sin(theta) + 1) / 2;
          const x = cx + Math.cos(theta) * rx * 1.16;
          const y = cy + Math.sin(theta) * ry * 1.3;
          sat.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.6 + 0.5 * depth})`;
          sat.style.zIndex = depth > 0.5 ? "18" : "2";
        });

        meridianRefs.current.forEach((el, k) => {
          el?.setAttribute(
            "rx",
            String(96 * Math.abs(Math.sin((k * Math.PI) / MERIDIANS + m.time * 0.35))),
          );
        });
      };

      const tick = (_time: number, deltaTime: number) => {
        if (!visible || m.width === 0) return;
        if (!reduced) m.time += Math.min(deltaTime, 50) / 1000;
        render();
      };
      gsap.ticker.add(tick);
      render();

      const cleanups: (() => void)[] = [
        () => gsap.ticker.remove(tick),
        () => resize.disconnect(),
        () => io.disconnect(),
      ];

      if (!reduced) {
        // Entrance: the rings draw themselves, the globe pops, services burst outward.
        const rings = [ringRef.current, outerRingRef.current, frontArcRef.current];
        m.spread.forEach((s) => (s.v = 0));
        gsap.set(rings, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(globe, { scale: 0.45, opacity: 0, rotation: -25 });
        ScrollTrigger.create({
          trigger: stage,
          start: "top 78%",
          once: true,
          onEnter: () =>
            context.add(() => {
              gsap.to(globe, {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1.4,
                ease: "back.out(1.6)",
              });
              gsap.to(rings, {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: "expo.inOut",
                stagger: 0.12,
              });
              gsap.to(m.spread, {
                v: 1,
                duration: 1.5,
                ease: "back.out(1.3)",
                stagger: 0.08,
                delay: 0.35,
              });
            }),
        });

        // The whole scene leans gently toward the pointer.
        if (finePointer() && tiltRef.current) {
          const tiltX = gsap.quickTo(tiltRef.current, "rotationX", {
            duration: 0.9,
            ease: "power3",
          });
          const tiltY = gsap.quickTo(tiltRef.current, "rotationY", {
            duration: 0.9,
            ease: "power3",
          });
          const move = (event: PointerEvent) => {
            const rect = stage.getBoundingClientRect();
            tiltY(((event.clientX - rect.left) / rect.width - 0.5) * 12);
            tiltX(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
          };
          const leave = () => {
            tiltX(0);
            tiltY(0);
          };
          stage.addEventListener("pointermove", move);
          stage.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerleave", leave);
          });
        }
      }

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: stageRef },
  );

  return (
    <div ref={stageRef} className="relative [perspective:1400px]">
      <div
        ref={tiltRef}
        className="relative mx-auto aspect-[0.92] w-full max-w-[780px] sm:aspect-[1.4]"
      >
        {/* Soft teal halo behind everything. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[8%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 26%, transparent), transparent 62%)",
          }}
        />

        {/* Back of the ring + a dotted outer ring (behind the globe). */}
        <svg aria-hidden="true" className="absolute inset-0 z-0 size-full overflow-visible">
          <ellipse
            ref={outerRingRef}
            pathLength={1}
            fill="none"
            stroke="var(--deep-teal)"
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeDasharray="0.004 0.012"
          />
          <ellipse
            ref={ringRef}
            pathLength={1}
            fill="none"
            stroke="var(--deep-teal)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        </svg>

        <Globe globeRef={globeRef} meridianRefs={meridianRefs} />

        {/* Front half of the ring and the beam, drawn over the globe. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] size-full overflow-visible"
        >
          <path
            ref={frontArcRef}
            pathLength={1}
            fill="none"
            stroke="var(--deep-teal)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <line
            ref={beamRef}
            stroke="var(--glow)"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
          <circle ref={beamDotRef} r="4.5" fill="var(--glow)" style={{ opacity: 0 }} />
        </svg>

        {Array.from({ length: SATELLITES }, (_, k) => (
          <span
            key={k}
            aria-hidden="true"
            ref={(el) => {
              satelliteRefs.current[k] = el;
            }}
            className="absolute left-0 top-0 size-3 rounded-full shadow-[0_4px_10px_-2px_rgba(0,60,60,0.5)]"
            style={{ background: ["var(--glow)", "var(--teal)", "var(--accent)"][k] }}
          />
        ))}

        {problemSolutions.map((service, index) => {
          const colors = toneOf(index);
          const Icon = service.icon;
          const isActive = index === active;
          return (
            // Each bubble opens its service's section on the Services page.
            <Link
              key={service.service}
              ref={(el) => {
                nodeRefs.current[index] = el;
              }}
              to="/services"
              hash={service.slug}
              tabIndex={-1}
              aria-hidden="true"
              data-cursor="view"
              data-cursor-label="Open"
              className={cn(
                "group absolute flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-1 pr-2.5 font-semibold sm:gap-2 shadow-[0_14px_30px_-14px_rgba(0,50,50,0.6)] ring-1 ring-ink/10 transition-[box-shadow] duration-500 will-change-transform sm:py-1.5 sm:pl-1.5 sm:pr-4",
                isActive &&
                  "ring-2 ring-white sm:ring-4 shadow-[0_18px_40px_-10px_rgba(0,50,50,0.55)]",
              )}
              style={{
                background: colors.bg,
                color: colors.fg,
                transform: "translate(-50%, -50%)",
                ...fallbackSpot(index),
              }}
            >
              <span className="grid size-6 place-items-center sm:size-9 rounded-full bg-white/90 text-ink group-hover:animate-[wiggle_0.7s_ease-in-out]">
                <Icon className="size-3 sm:size-4" strokeWidth={1.9} />
              </span>
              <span className="text-[11px] leading-none sm:text-sm">{service.service}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail + legend ─────────────────────────────────────────────────────────

/**
 * The services block: the orbiting globe, plus the selected service's name,
 * question and bold answer. It advances on its own until someone picks one.
 */
export function ServiceUniverse() {
  const detailRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setTimeout(() => setActive((current) => (current + 1) % COUNT), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, auto, paused]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-detail-line]",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "expo.out" },
      );
    },
    { dependencies: [active], scope: detailRef },
  );

  const choose = (index: number) => {
    setActive(index);
    setAuto(false);
  };

  const service = problemSolutions[active] ?? problemSolutions[0]!;
  const colors = toneOf(active);
  const Icon = service.icon;

  return (
    <div className="relative mx-auto mt-14 grid max-w-[1500px] grid-cols-[minmax(0,1fr)] items-center gap-6 md:mt-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-4">
      <div
        className="-mx-6 min-w-0 md:mx-0 lg:order-2"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <ServiceOrbit active={active} />
      </div>

      <div
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className="min-w-0 lg:order-1"
      >
        <div
          ref={detailRef}
          aria-live={auto ? "off" : "polite"}
          className="min-h-[24rem] md:min-h-[22rem]"
        >
          <p
            data-detail-line
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal"
          >
            <span className="size-2 rounded-full" style={{ background: markOf(active) }} />
            In orbit · {String(active + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </p>
          <div data-detail-line className="mt-6 flex items-center gap-3 sm:gap-4">
            <span
              className="grid size-12 shrink-0 -rotate-6 place-items-center rounded-2xl shadow-[0_14px_30px_-14px_rgba(0,50,50,0.6)] sm:size-16"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <Icon className="size-6 sm:size-7" strokeWidth={1.8} />
            </span>
            <h3 className="min-w-0 break-words text-[clamp(2rem,9.5vw,3rem)] leading-[0.95] md:text-6xl">
              <span className="relative isolate">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-0.08em] bottom-[0.04em] -z-10 h-[0.3em] -rotate-1 rounded-sm"
                  style={{ background: markOf(active) }}
                />
                {service.service}
              </span>
            </h3>
          </div>
          <p
            data-detail-line
            className="mt-6 inline-flex max-w-md items-start gap-2 rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-base font-medium"
          >
            <span aria-hidden="true" className="mt-0.5 font-mono text-[10px] font-bold text-ink">
              Q
            </span>
            {service.question}
          </p>
          <blockquote
            data-detail-line
            className="mt-7 max-w-xl font-display text-[clamp(1.5rem,6.8vw,1.875rem)] font-extrabold leading-[1.1] md:text-[2.5rem]"
            style={{ fontStretch: "100%" }}
          >
            <span className="text-glow">“</span>
            {service.answer}
            <span className="text-glow">”</span>
          </blockquote>
          <Link
            data-detail-line
            to="/services"
            hash={service.slug}
            className="group mt-7 inline-flex items-center gap-2 font-semibold text-deep-teal"
          >
            <span className="border-b border-current">Explore {service.service}</span>
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>

        <div role="group" aria-label="Choose a service" className="mt-8 flex flex-wrap gap-2">
          {problemSolutions.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.service}
                type="button"
                aria-pressed={isActive}
                onClick={() => choose(index)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
                  isActive
                    ? "border-ink bg-ink text-ivory"
                    : "border-ink/15 text-ink hover:border-ink hover:text-ink",
                )}
              >
                <span className="size-2 rounded-full" style={{ background: markOf(index) }} />
                {item.service}
              </button>
            );
          })}
        </div>

        <div className="mt-6 h-1 max-w-sm overflow-hidden rounded-full bg-ink/10">
          {auto && (
            <span
              key={active}
              className={cn(
                "block h-full origin-left animate-[grow-x_4.6s_linear_forwards] rounded-full bg-deep-teal",
                paused && "[animation-play-state:paused]",
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
