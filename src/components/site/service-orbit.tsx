import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { finePointer, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { problemSolutions } from "./content";
import { servicePath } from "./service-links";
import { tones, type Tone } from "./tones";

const COUNT = problemSolutions.length;
// The ring carries the building blocks (modules) of the service in focus.
const NODES = 6;
const TAU = Math.PI * 2;
const FRONT = Math.PI / 2; // straight down the screen = nearest the viewer
const STEP = TAU / NODES;
const MERIDIANS = 7;
// Each service holds the stage this long, then the next one takes over.
const ADVANCE_MS = 7000;
// The ring turns non-stop, one module past the front every 2.6s.
const DRIFT = STEP / 2.6; // radians per second
// Speed while hovered.
const SLOW = 0.2;
// After someone picks a service, it stays in focus this long.
const HOLD_MS = 12000;

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
  coreRef,
  service,
}: {
  globeRef: React.RefObject<HTMLDivElement | null>;
  meridianRefs: React.RefObject<(SVGEllipseElement | null)[]>;
  coreRef: React.RefObject<HTMLDivElement | null>;
  service: number;
}) {
  const latitudes = [-60, -30, 0, 30, 60];
  const { service: name, icon: Icon } = problemSolutions[service] ?? problemSolutions[0]!;
  const colors = toneOf(service);
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
        {/* The core: the service in focus, its modules circling it. Sized in
            container units so it scales with the globe. */}
        <div aria-hidden="true" className="@container absolute inset-0 grid place-items-center">
          <span
            className="absolute size-[62%] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 30%, transparent 70%)",
            }}
          />
          <div ref={coreRef} className="relative flex flex-col items-center gap-[5cqw]">
            <span
              className="grid size-[34cqw] place-items-center rounded-full shadow-[0_14px_28px_-12px_rgba(0,50,50,0.6)] ring-[1.6cqw] ring-white"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <Icon className="size-[15cqw]" strokeWidth={1.8} />
            </span>
            <span className="font-display text-[10cqw] font-extrabold leading-none tracking-[-0.02em] text-ink [font-stretch:normal]">
              {name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── The orbit stage ─────────────────────────────────────────────────────────

/**
 * A tilted ring around the globe carrying the six modules of the service in
 * focus (CRM: Lead Capture, Contacts, Deal Pipeline…), with the service itself
 * at the core. Positions are driven from GSAP's ticker: nodes in front of the
 * globe draw larger and above it, nodes behind it smaller and underneath, and
 * a beam links the front module home. When `service` changes, the modules fall
 * into the globe and the next service's modules burst back out.
 */
function ServiceOrbit({ service, slow }: { service: number; slow: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const frontArcRef = useRef<SVGPathElement>(null);
  const beamRef = useRef<SVGLineElement>(null);
  const beamDotRef = useRef<SVGCircleElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const meridianRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const measureRef = useRef<() => void>(() => {});
  // The service whose modules are on the ring; it trails `service` by one
  // collapse while the ring swaps over.
  const [shown, setShown] = useState(service);
  const shownRef = useRef(shown);
  const targetRef = useRef(service);
  const swappingRef = useRef(false);
  const motion = useRef({
    angle: FRONT,
    drift: 0,
    speed: 1,
    front: -1,
    dragging: false,
    time: 0,
    width: 0,
    height: 0,
    globeRadius: 0,
    nodeHalf: Array.from({ length: NODES }, () => 0),
    spread: Array.from({ length: NODES }, () => ({ v: 1 })),
  });

  // Burst the ring's modules out of the globe and bring the core back.
  const expand = () => {
    const m = motion.current;
    const reduced = prefersReducedMotion();
    measureRef.current();
    gsap.killTweensOf(m.spread);
    gsap.to(m.spread, {
      v: 1,
      duration: reduced ? 0 : 1.1,
      ease: "back.out(1.4)",
      stagger: reduced ? 0 : 0.06,
    });
    gsap.to(coreRef.current, {
      scale: 1,
      opacity: 1,
      duration: reduced ? 0 : 0.7,
      ease: "back.out(1.8)",
    });
  };

  // A new service: pull the current modules into the globe, then swap.
  useEffect(() => {
    targetRef.current = service;
    if (service === shownRef.current) {
      // Picked the shown service again mid-swap: bring its modules back out.
      // (Never on mount, so the scroll-in entrance still plays.)
      if (swappingRef.current) {
        swappingRef.current = false;
        expand();
      }
      return;
    }
    const m = motion.current;
    const reduced = prefersReducedMotion();
    swappingRef.current = true;
    gsap.killTweensOf(m.spread);
    const swap = gsap.timeline({ onComplete: () => setShown(targetRef.current) });
    swap.to(m.spread, {
      v: 0,
      duration: reduced ? 0 : 0.45,
      ease: "power3.in",
      stagger: reduced ? 0 : 0.03,
    });
    swap.to(
      coreRef.current,
      { scale: 0.5, opacity: 0, duration: reduced ? 0 : 0.3, ease: "power2.in" },
      reduced ? 0 : 0.2,
    );
    return () => {
      swap.kill();
    };
  }, [service]);

  // The new modules are in the DOM (still collapsed): measure them, burst out.
  useEffect(() => {
    if (shown === shownRef.current) return;
    shownRef.current = shown;
    swappingRef.current = false;
    expand();
  }, [shown]);

  useEffect(() => {
    gsap.to(motion.current, {
      speed: slow ? SLOW : 1,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [slow]);

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
        const ring = ringRef.current;
        ring?.setAttribute("cx", String(cx));
        ring?.setAttribute("cy", String(cy));
        ring?.setAttribute("rx", String(rx));
        ring?.setAttribute("ry", String(ry * 1.12));
        // Lower half of the ring passes in front of the globe.
        frontArcRef.current?.setAttribute(
          "d",
          `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`,
        );
      };
      measureRef.current = measure;
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
        // The module nearest the viewer gets the beam and a white ring.
        const front = ((Math.round((FRONT - m.angle - m.drift) / STEP) % NODES) + NODES) % NODES;
        if (front !== m.front) {
          m.front = front;
          nodeRefs.current.forEach((node, i) => node?.toggleAttribute("data-front", i === front));
        }

        nodeRefs.current.forEach((node, i) => {
          if (!node) return;
          const theta = m.angle + m.drift + i * STEP;
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
          if (i === front) beamTarget = { x, y, depth };
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

        meridianRefs.current.forEach((el, k) => {
          el?.setAttribute(
            "rx",
            String(96 * Math.abs(Math.sin((k * Math.PI) / MERIDIANS + m.time * 0.35))),
          );
        });
      };

      const tick = (_time: number, deltaTime: number) => {
        if (!visible || m.width === 0) return;
        if (!reduced) {
          const dt = Math.min(deltaTime, 50) / 1000;
          m.time += dt;
          if (!m.dragging) m.drift -= DRIFT * m.speed * dt;
        }
        render();
      };
      gsap.ticker.add(tick);
      render();

      const cleanups: (() => void)[] = [
        () => gsap.ticker.remove(tick),
        () => resize.disconnect(),
        () => io.disconnect(),
      ];

      // Spin the ring by hand: drag sideways with a mouse or a finger, let go
      // and it glides on with the flick's momentum, then carries on turning.
      {
        let startX = 0;
        let lastX = 0;
        let lastTime = 0;
        let velocity = 0; // radians per second
        let moved = false;
        let pointerId: number | null = null;
        const perPixel = () => Math.PI / Math.max(m.width, 1);

        const down = (event: PointerEvent) => {
          if (event.button !== 0) return;
          pointerId = event.pointerId;
          startX = lastX = event.clientX;
          lastTime = performance.now();
          velocity = 0;
          moved = false;
        };
        const move = (event: PointerEvent) => {
          if (event.pointerId !== pointerId) return;
          const dx = event.clientX - lastX;
          if (!moved && Math.abs(event.clientX - startX) > 6) {
            moved = true;
            m.dragging = true;
            gsap.killTweensOf(m, "angle");
            stage.setPointerCapture(event.pointerId);
          }
          if (!moved) return;
          const now = performance.now();
          const step = dx * perPixel();
          m.angle += step;
          velocity = step / Math.max((now - lastTime) / 1000, 0.008);
          lastX = event.clientX;
          lastTime = now;
        };
        const up = (event: PointerEvent) => {
          if (event.pointerId !== pointerId) return;
          pointerId = null;
          if (!moved) return;
          m.dragging = false;
          // A stale flick (the finger rested before lifting) carries no momentum.
          if (performance.now() - lastTime > 120) velocity = 0;
          const glide = Math.max(-Math.PI, Math.min(Math.PI, velocity * 0.35));
          if (!reduced && glide !== 0) {
            gsap.to(m, {
              angle: m.angle + glide,
              duration: 1.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };
        // A drag that ends over a service pill shouldn't also open it.
        const swallowClick = (event: MouseEvent) => {
          if (!moved) return;
          event.preventDefault();
          event.stopPropagation();
          moved = false;
        };

        stage.addEventListener("pointerdown", down);
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerup", up);
        stage.addEventListener("pointercancel", up);
        stage.addEventListener("click", swallowClick, true);
        // Stop the browser's own link/image drag from hijacking the gesture.
        const noNativeDrag = (event: DragEvent) => event.preventDefault();
        stage.addEventListener("dragstart", noNativeDrag);
        cleanups.push(() => {
          stage.removeEventListener("dragstart", noNativeDrag);
          stage.removeEventListener("pointerdown", down);
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerup", up);
          stage.removeEventListener("pointercancel", up);
          stage.removeEventListener("click", swallowClick, true);
        });
      }

      if (!reduced) {
        // Entrance: the rings draw themselves, the globe pops, services burst outward.
        const rings = [ringRef.current, frontArcRef.current];
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

  const orbiting = problemSolutions[shown] ?? problemSolutions[0]!;
  const colors = toneOf(shown);

  return (
    <div
      ref={stageRef}
      className="relative cursor-grab touch-pan-y select-none [perspective:1400px] active:cursor-grabbing"
    >
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

        {/* Back of the ring (behind the globe), in dark teal. */}
        <svg aria-hidden="true" className="absolute inset-0 z-0 size-full overflow-visible">
          <ellipse
            ref={ringRef}
            pathLength={1}
            fill="none"
            stroke="var(--night)"
            strokeOpacity="0.55"
            strokeWidth="1.75"
          />
        </svg>

        <Globe globeRef={globeRef} meridianRefs={meridianRefs} coreRef={coreRef} service={shown} />

        {/* Front half of the ring and the beam, drawn over the globe. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] size-full overflow-visible"
        >
          <path
            ref={frontArcRef}
            pathLength={1}
            fill="none"
            stroke="var(--night)"
            strokeOpacity="0.8"
            strokeWidth="1.75"
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

        {orbiting.modules.map((module, index) => {
          const ModuleIcon = module.icon;
          return (
            // Each module opens its service's page. Slots are keyed by position
            // so the ring keeps its nodes while the labels swap.
            <Link
              key={index}
              ref={(el) => {
                nodeRefs.current[index] = el;
              }}
              to={servicePath(orbiting.slug)}
              tabIndex={-1}
              aria-hidden="true"
              data-cursor="view"
              data-cursor-label="Open"
              className="group absolute flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-1 pr-2.5 font-semibold shadow-[0_14px_30px_-14px_rgba(0,50,50,0.6)] ring-1 ring-ink/10 transition-[box-shadow] duration-500 will-change-transform data-[front]:shadow-[0_18px_40px_-10px_rgba(0,50,50,0.55)] data-[front]:ring-2 data-[front]:ring-white sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-4 sm:data-[front]:ring-4"
              style={{
                background: colors.bg,
                color: colors.fg,
                transform: "translate(-50%, -50%)",
                ...fallbackSpot(index),
              }}
            >
              <span className="grid size-6 place-items-center rounded-full bg-white/90 text-ink group-hover:animate-[wiggle_0.7s_ease-in-out] sm:size-9">
                <ModuleIcon className="size-3 sm:size-4" strokeWidth={1.9} />
              </span>
              <span className="text-[11px] leading-none sm:text-sm">{module.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail + legend ─────────────────────────────────────────────────────────

/**
 * The services block: the selected service's name, question and bold answer,
 * beside the globe with that service's modules in orbit. It moves on to the
 * next service each time the progress bar fills (paused on hover and off
 * screen), until someone picks one.
 */
export function ServiceUniverse() {
  const rootRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) setAuto(false);
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      threshold: 0.25,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // After someone picks a service, hold it at the front a while, then go back
  // to following the rotation.
  useEffect(() => {
    if (auto || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setAuto(true), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [auto, active]);

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
    <div
      ref={rootRef}
      className="relative mx-auto mt-14 grid max-w-[1500px] grid-cols-[minmax(0,1fr)] items-center gap-6 md:mt-20 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-4"
    >
      <div
        className="-mx-6 min-w-0 md:mx-0 lg:order-2"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <ServiceOrbit service={active} slow={paused} />
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
              className="grid size-12 shrink-0 place-items-center rounded-2xl shadow-[0_14px_30px_-14px_rgba(0,50,50,0.6)] sm:size-16"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <Icon className="size-6 sm:size-7" strokeWidth={1.8} />
            </span>
            {/* The service name as a straight colour label. */}
            <h3 className="min-w-0 break-words text-[clamp(2rem,9.5vw,3rem)] leading-[0.95] md:text-6xl">
              <span
                className="inline-block rounded-xl px-[0.22em] pb-[0.12em] pt-[0.06em] shadow-[0_16px_30px_-16px_rgba(0,40,40,0.55)]"
                style={{ background: colors.bg, color: colors.fg }}
              >
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
            className="mt-7 max-w-xl font-display text-[clamp(1.5rem,6.8vw,1.875rem)] font-extrabold leading-[1.1] text-ink md:text-[2.5rem]"
          >
            <span className="text-glow">“</span>
            {service.answer}
            <span className="text-glow">”</span>
          </blockquote>
          <p className="sr-only">
            Includes {service.modules.map((module) => module.label).join(", ")}.
          </p>
          <Link
            data-detail-line
            to={servicePath(service.slug)}
            className="group mt-8 inline-flex h-14 items-center gap-4 rounded-full bg-ink pl-7 pr-2 font-display text-base font-bold uppercase tracking-[0.06em] text-ivory shadow-[0_20px_44px_-20px_rgba(0,40,40,0.7)] transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:h-16 md:text-lg"
          >
            Explore {service.service}
            <span className="grid size-10 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45 md:size-12">
              <ArrowUpRight className="size-5" />
            </span>
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
              onAnimationEnd={() => setActive((index) => (index + 1) % COUNT)}
              className={cn(
                "block h-full origin-left animate-[grow-x_linear_forwards] rounded-full bg-deep-teal",
                (paused || !inView) && "[animation-play-state:paused]",
              )}
              style={{ animationDuration: `${ADVANCE_MS}ms` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
