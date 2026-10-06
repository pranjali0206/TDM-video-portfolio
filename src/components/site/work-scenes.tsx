import {
  BarChart3,
  Bell,
  Bot,
  Check,
  FileText,
  Heart,
  Lock,
  Megaphone,
  MessageCircle,
  MousePointer2,
  Play,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react";
import { useRef, type ComponentProps, type ReactNode } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * Looping, code-drawn "showreels" for the Work cards — crisp at any size,
 * themed from the palette, and only animating while on screen. Every element
 * is laid out in its final position, so reduced-motion users see a still.
 */

export type SceneKind = "media" | "web" | "automation" | "ads";

type Build = (tl: gsap.core.Timeline, q: (selector: string) => Element[]) => void;

function Stage({
  build,
  children,
  className,
}: {
  build: Build;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
      build(tl, q);
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "@container/stage relative isolate grid size-full place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 [container-type:size]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklab, var(--ink) 14%, transparent) 1px, transparent 1px), linear-gradient(160deg, white 20%, color-mix(in oklab, var(--secondary) 70%, white))",
        backgroundSize: "18px 18px, 100% 100%",
      }}
    >
      {/* A fixed 4:3 canvas, as large as fits, so every layout keeps its
          proportions whatever shape the card or hero gives it. */}
      <div className="@container relative aspect-[4/3]" style={{ width: "min(100cqw, 133.33cqh)" }}>
        {children}
      </div>
    </div>
  );
}

/** Small floating glass card used across scenes. */
function Glass({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={cn(
        "absolute rounded-[1.6cqw] border border-ink/10 bg-white/90 shadow-[0_20px_50px_-25px_rgba(0,40,40,0.45)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

const label = "font-mono uppercase tracking-[0.18em] text-[max(8px,1.5cqw)]";

/* ------------------------------------------------------------------ */
/* 01 — MediaHouse: a reel plays while the brand kit and feed assemble */
/* ------------------------------------------------------------------ */

const reelFrames = [
  "linear-gradient(160deg, var(--accent), var(--deep-teal))",
  "linear-gradient(160deg, var(--glow), color-mix(in oklab, var(--glow) 40%, var(--ivory)))",
  "linear-gradient(160deg, var(--teal), var(--accent))",
];
const feedTiles = [
  "var(--accent)",
  "var(--teal)",
  "var(--glow)",
  "var(--night-soft)",
  "color-mix(in oklab, var(--glow) 45%, var(--ivory))",
  "var(--deep-teal)",
  "var(--teal)",
  "color-mix(in oklab, var(--accent) 50%, var(--ivory))",
  "var(--accent)",
];

const buildMedia: Build = (tl, q) => {
  tl.from(q("[data-m=phone]"), { y: 40, autoAlpha: 0, duration: 0.9 })
    .from(q("[data-m=kit]"), { x: -30, autoAlpha: 0, duration: 0.7 }, "-=0.5")
    .from(
      q("[data-m=swatch]"),
      { scale: 0, stagger: 0.08, duration: 0.5, ease: "back.out(2)" },
      "-=0.3",
    )
    .from(q("[data-m=feed]"), { x: 30, autoAlpha: 0, duration: 0.6 }, "-=0.5")
    .from(
      q("[data-m=tile]"),
      { scale: 0, autoAlpha: 0, stagger: 0.06, duration: 0.5, ease: "back.out(1.8)" },
      "-=0.4",
    );

  // The reel: frames swap while story bars fill, hearts float up.
  const frames = q("[data-m=frame]");
  const bars = q("[data-m=bar]");
  frames.forEach((frame, index) => {
    const at = 0.6 + index * 1.6;
    tl.fromTo(
      frame,
      { autoAlpha: 0, scale: 1.12 },
      { autoAlpha: 1, scale: 1, duration: 0.6 },
      at,
    ).fromTo(bars[index]!, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "none" }, at);
  });
  tl.fromTo(
    q("[data-m=heart]"),
    { y: 0, autoAlpha: 0, scale: 0.6 },
    { y: "-=180%", autoAlpha: 1, scale: 1, stagger: 0.35, duration: 1.4, ease: "power1.out" },
    1.2,
  )
    .to(q("[data-m=heart]"), { autoAlpha: 0, stagger: 0.35, duration: 0.4 }, 2.2)
    .to(q("[data-m=all]"), { autoAlpha: 0, duration: 0.5 }, "+=0.8");
};

function MediaScene() {
  return (
    <Stage build={buildMedia}>
      <div data-m="all" className="absolute inset-0">
        <div className="absolute left-[4%] top-[5%] flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-ivory">
          <span className="rec-blink size-2 rounded-full bg-glow" />
          <span className={label}>Rec</span>
        </div>

        {/* Brand kit */}
        <Glass data-m="kit" className="left-[5%] top-[24%] w-[27%] p-[2cqw]">
          <div>
            <div className="flex items-center gap-[1.4cqw]">
              <span className="grid size-[5.5cqw] place-items-center rounded-[1.2cqw] bg-ink font-display text-[3cqw] font-black text-accent">
                T
              </span>
              <span className={cn(label, "whitespace-nowrap text-ink/60")}>Brand kit</span>
            </div>
            <p className="mt-[2cqw] font-display text-[6cqw] font-black leading-none text-ink">
              Aa
            </p>
            <p className="font-serif text-[2.6cqw] italic text-deep-teal">Bold &amp; memorable</p>
            <div className="mt-[2cqw] flex gap-[1cqw]">
              {["var(--accent)", "var(--teal)", "var(--glow)", "var(--ink)"].map((color) => (
                <span
                  key={color}
                  data-m="swatch"
                  className="size-[3.6cqw] rounded-full ring-2 ring-white"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </Glass>

        {/* Phone playing a reel */}
        <div
          data-m="phone"
          className="absolute left-1/2 top-[7%] h-[86%] -translate-x-1/2 rounded-[3cqw] bg-ink p-[0.8cqw] shadow-[0_40px_80px_-30px_rgba(0,40,40,0.6)]"
          style={{ aspectRatio: "9 / 18" }}
        >
          <div className="relative size-full overflow-hidden rounded-[2.4cqw] bg-night">
            {reelFrames.map((frame, index) => (
              <div
                key={frame}
                data-m="frame"
                className="absolute inset-0"
                style={{ background: frame, opacity: index === 0 ? 1 : 0 }}
              >
                <div className="absolute inset-x-[12%] bottom-[18%] space-y-[0.8cqw]">
                  <div className="h-[1.2cqw] w-3/4 rounded-full bg-white/90" />
                  <div className="h-[1.2cqw] w-1/2 rounded-full bg-white/60" />
                </div>
                <Play className="absolute left-1/2 top-[42%] size-[6cqw] -translate-x-1/2 -translate-y-1/2 fill-white/90 text-white/90" />
              </div>
            ))}
            <div className="absolute inset-x-[6%] top-[3%] flex gap-[0.6cqw]">
              {reelFrames.map((frame) => (
                <span
                  key={frame}
                  className="h-[0.5cqw] flex-1 overflow-hidden rounded-full bg-white/35"
                >
                  <span data-m="bar" className="block h-full origin-left bg-white" />
                </span>
              ))}
            </div>
            <div className="absolute bottom-[6%] right-[8%] flex flex-col items-center gap-[1cqw]">
              {[0, 1, 2].map((index) => (
                <Heart
                  key={index}
                  data-m="heart"
                  className="size-[3cqw] fill-glow text-glow opacity-0"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feed grid */}
        <Glass data-m="feed" className="right-[5%] top-[18%] w-[27%] p-[1.6cqw]">
          <p className={cn(label, "mb-[1.4cqw] text-ink/60")}>Your feed</p>
          <div className="grid grid-cols-3 gap-[0.8cqw]">
            {feedTiles.map((tile, index) => (
              <span
                key={index}
                data-m="tile"
                className="aspect-square rounded-[0.8cqw]"
                style={{ background: tile }}
              />
            ))}
          </div>
        </Glass>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Websites: a page builds itself, gets clicked, books an enquiry */
/* ------------------------------------------------------------------ */

const buildWeb: Build = (tl, q) => {
  const score = q("[data-w=score-num]")[0];
  const counter = { value: 0 };
  tl.from(q("[data-w=window]"), { y: 40, autoAlpha: 0, scale: 0.96, duration: 0.9 })
    .from(
      q("[data-w=bar]"),
      { scaleX: 0, transformOrigin: "left", stagger: 0.12, duration: 0.6 },
      "-=0.4",
    )
    .from(q("[data-w=img]"), { autoAlpha: 0, scale: 0.85, duration: 0.8 }, "<")
    .from(q("[data-w=btn]"), { autoAlpha: 0, y: 12, duration: 0.5 }, "-=0.4")
    .from(q("[data-w=feature]"), { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.5 }, "-=0.2")
    .from(q("[data-w=score]"), { autoAlpha: 0, x: 30, duration: 0.6 }, "-=0.2")
    .fromTo(
      q("[data-w=ring]"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0.02, duration: 1.4, ease: "power2.out" },
      "<",
    )
    .fromTo(
      counter,
      { value: 0 },
      {
        value: 98,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (score) score.textContent = String(Math.round(counter.value));
        },
      },
      "<",
    )
    .from(
      q("[data-w=cursor]"),
      { xPercent: 700, yPercent: 400, autoAlpha: 0, duration: 1.1, ease: "power3.inOut" },
      "-=0.8",
    )
    .to(q("[data-w=btn]"), {
      scale: 0.9,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    })
    .fromTo(
      q("[data-w=ripple]"),
      { scale: 0, autoAlpha: 0.7 },
      { scale: 3, autoAlpha: 0, duration: 0.7, ease: "power2.out" },
      "<",
    )
    .from(
      q("[data-w=toast]"),
      { x: 40, autoAlpha: 0, duration: 0.6, ease: "back.out(1.6)" },
      "-=0.3",
    )
    .to(q("[data-w=all]"), { autoAlpha: 0, duration: 0.5 }, "+=2.2");
};

function WebScene() {
  return (
    <Stage build={buildWeb}>
      <div data-w="all" className="absolute inset-0">
        {/* Browser */}
        <Glass data-w="window" className="left-[6%] top-[10%] w-[68%] overflow-hidden">
          <div>
            <div className="flex items-center gap-[1.4cqw] border-b border-ink/10 px-[2cqw] py-[1.4cqw]">
              <span className="flex gap-[0.7cqw]">
                <span className="size-[1.3cqw] rounded-full bg-glow" />
                <span className="size-[1.3cqw] rounded-full bg-teal" />
                <span className="size-[1.3cqw] rounded-full bg-accent" />
              </span>
              <span className="flex flex-1 items-center gap-[0.8cqw] rounded-full bg-secondary px-[1.6cqw] py-[0.6cqw] text-[max(8px,1.6cqw)] font-medium text-ink/70">
                <Lock className="size-[1.6cqw]" />
                yourbrand.com
              </span>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr] gap-[2.4cqw] p-[2.6cqw]">
              <div>
                <div data-w="bar" className="h-[2.2cqw] w-[90%] rounded-full bg-ink" />
                <div data-w="bar" className="mt-[1cqw] h-[2.2cqw] w-[65%] rounded-full bg-ink" />
                <div data-w="bar" className="mt-[1.8cqw] h-[1cqw] w-[85%] rounded-full bg-ink/20" />
                <div data-w="bar" className="mt-[0.8cqw] h-[1cqw] w-[70%] rounded-full bg-ink/20" />
                <span
                  data-w="btn"
                  className="relative mt-[2.4cqw] inline-flex rounded-full bg-accent px-[2.4cqw] py-[1.1cqw] text-[max(8px,1.7cqw)] font-bold text-ink"
                >
                  <span
                    data-w="ripple"
                    className="absolute inset-0 rounded-full bg-accent opacity-0"
                  />
                  <span className="relative">Get a quote</span>
                  <MousePointer2
                    data-w="cursor"
                    className="absolute -bottom-[1.6cqw] right-[0.6cqw] size-[3.4cqw] fill-ink text-white drop-shadow-lg"
                  />
                </span>
              </div>
              <div
                data-w="img"
                className="relative aspect-[4/3] overflow-hidden rounded-[1.4cqw]"
                style={{ background: "linear-gradient(150deg, var(--accent), var(--teal))" }}
              >
                <span className="absolute -bottom-[20%] -right-[10%] size-[70%] rounded-full bg-white/30" />
                <span className="absolute left-[12%] top-[16%] size-[22%] rounded-full bg-glow" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[1.4cqw] px-[2.6cqw] pb-[2.6cqw]">
              {["var(--accent)", "var(--teal)", "var(--glow)"].map((tone) => (
                <div
                  key={tone}
                  data-w="feature"
                  className="rounded-[1cqw] bg-secondary/70 p-[1.4cqw]"
                >
                  <span
                    className="block size-[2.6cqw] rounded-[0.7cqw]"
                    style={{ background: tone }}
                  />
                  <span className="mt-[1cqw] block h-[0.9cqw] w-[80%] rounded-full bg-ink/25" />
                  <span className="mt-[0.6cqw] block h-[0.9cqw] w-[55%] rounded-full bg-ink/15" />
                </div>
              ))}
            </div>
          </div>
        </Glass>

        {/* Performance score */}
        <Glass data-w="score" className="bottom-[8%] right-[5%] px-[2cqw] py-[1.6cqw]">
          <div className="flex items-center gap-[1.6cqw]">
            <svg viewBox="0 0 36 36" className="size-[7cqw] -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="4"
              />
              <circle
                data-w="ring"
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--deep-teal)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="0.02"
              />
            </svg>
            <div>
              <p
                data-w="score-num"
                className="font-display text-[4.4cqw] font-black leading-none text-ink"
              >
                98
              </p>
              <p className={cn(label, "mt-[0.6cqw] text-ink/60")}>Performance</p>
            </div>
          </div>
        </Glass>

        {/* New enquiry */}
        <Glass data-w="toast" className="right-[4%] top-[14%] px-[1.8cqw] py-[1.4cqw]">
          <div className="flex items-center gap-[1.4cqw]">
            <span className="grid size-[4.4cqw] place-items-center rounded-full bg-teal text-ink">
              <Bell className="size-[2.2cqw]" />
            </span>
            <div>
              <p className="text-[max(9px,1.8cqw)] font-bold text-ink">New enquiry</p>
              <p className={cn(label, "text-ink/55")}>Just now</p>
            </div>
          </div>
        </Glass>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Automation: a lead flows through connected systems on its own  */
/* ------------------------------------------------------------------ */

const flowNodes = [
  { icon: Megaphone, name: "New lead", x: 14, y: 28, tone: "var(--glow)" },
  { icon: Users, name: "CRM", x: 44, y: 20, tone: "var(--accent)" },
  { icon: Bot, name: "AI agent", x: 78, y: 30, tone: "var(--teal)" },
  { icon: MessageCircle, name: "WhatsApp", x: 72, y: 74, tone: "var(--accent)" },
  { icon: FileText, name: "Invoice", x: 42, y: 80, tone: "var(--teal)" },
  { icon: BarChart3, name: "Dashboard", x: 14, y: 70, tone: "var(--glow)" },
];
const flowPath = flowNodes.map(({ x, y }, index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

const buildAutomation: Build = (tl, q) => {
  const nodes = q("[data-a=node]");
  const checks = q("[data-a=check]");
  const packet = q("[data-a=packet]");
  tl.from(nodes, { scale: 0.6, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "back.out(1.7)" })
    .from(q("[data-a=wire]"), { autoAlpha: 0, duration: 0.5 }, "-=0.4")
    .from(q("[data-a=status]"), { y: -16, autoAlpha: 0, duration: 0.5 }, "-=0.3")
    .set(packet, { left: `${flowNodes[0]!.x}%`, top: `${flowNodes[0]!.y}%`, autoAlpha: 1 });
  // A data packet hops system to system; each one lights up as it lands.
  nodes.forEach((node, index) => {
    const { x, y } = flowNodes[index]!;
    if (index > 0) {
      tl.to(packet, { left: `${x}%`, top: `${y}%`, duration: 0.7, ease: "power2.inOut" });
    }
    tl.fromTo(
      node,
      { boxShadow: "0 0 0 0 rgba(79,209,197,0)" },
      { boxShadow: "0 0 0 0.9cqw rgba(79,209,197,0.4)", duration: 0.25, yoyo: true, repeat: 1 },
    ).fromTo(
      checks[index]!,
      { scale: 0 },
      { scale: 1, duration: 0.35, ease: "back.out(2.5)" },
      "<",
    );
  });
  tl.to(packet, { autoAlpha: 0, scale: 2, duration: 0.4 })
    .from(q("[data-a=log]"), { y: 16, autoAlpha: 0, stagger: 0.15, duration: 0.5 }, "<")
    .to(q("[data-a=all]"), { autoAlpha: 0, duration: 0.5 }, "+=2");
};

function AutomationScene() {
  return (
    <Stage build={buildAutomation}>
      <div data-a="all" className="absolute inset-0">
        <svg
          data-a="wire"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <path
            d={flowPath}
            fill="none"
            stroke="var(--deep-teal)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          data-a="packet"
          className="absolute z-10 size-[2.6cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow opacity-0 shadow-[0_0_0_0.8cqw_color-mix(in_oklab,var(--glow)_30%,transparent),0_0_3cqw_var(--glow)]"
        />

        {flowNodes.map(({ icon: Icon, name, x, y, tone }) => (
          <div
            key={name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              data-a="node"
              className="relative flex items-center gap-[1.2cqw] rounded-[1.6cqw] border border-ink/10 bg-white px-[1.6cqw] py-[1.2cqw] shadow-[0_18px_40px_-22px_rgba(0,40,40,0.5)]"
            >
              <span
                className="grid size-[4.6cqw] place-items-center rounded-[1.1cqw] text-ink"
                style={{ background: tone }}
              >
                <Icon className="size-[2.4cqw]" strokeWidth={2} />
              </span>
              <span className="whitespace-nowrap text-[max(9px,1.8cqw)] font-bold text-ink">
                {name}
              </span>
              <span
                data-a="check"
                className="absolute -right-[1cqw] -top-[1cqw] grid size-[2.8cqw] place-items-center rounded-full bg-ink text-accent"
              >
                <Check className="size-[1.6cqw]" strokeWidth={3} />
              </span>
            </div>
          </div>
        ))}

        <div className="absolute left-1/2 top-[50%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[1.2cqw]">
          <div
            data-a="status"
            className="flex items-center gap-[1cqw] rounded-full bg-ink px-[2cqw] py-[1cqw] text-ivory"
          >
            <span className="size-[1.2cqw] animate-pulse rounded-full bg-accent" />
            <span className={cn(label, "whitespace-nowrap")}>
              Workflow running · 0 manual steps
            </span>
          </div>
          <div className="flex gap-[0.8cqw]">
            {["Lead assigned in 2s", "WhatsApp sent"].map((line) => (
              <span
                key={line}
                data-a="log"
                className="whitespace-nowrap rounded-full bg-teal px-[1.6cqw] py-[0.6cqw] text-[max(8px,1.5cqw)] font-bold text-ink"
              >
                ✓ {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Ads: creatives compete, a winner emerges, leads climb          */
/* ------------------------------------------------------------------ */

const adTones = [
  "linear-gradient(150deg, var(--accent), var(--deep-teal))",
  "linear-gradient(150deg, var(--teal), var(--accent))",
  "linear-gradient(150deg, var(--glow), color-mix(in oklab, var(--glow) 40%, var(--ivory)))",
];
const barHeights = [28, 38, 34, 52, 64, 80, 94];

const buildAds: Build = (tl, q) => {
  const ads = q("[data-d=ad]");
  tl.from(q("[data-d=radar]"), { scale: 0.4, autoAlpha: 0, duration: 1 })
    .from(ads, { y: 40, autoAlpha: 0, rotate: 0, stagger: 0.12, duration: 0.7 }, "-=0.6")
    .to([ads[0]!, ads[2]!], { autoAlpha: 0.35, scale: 0.94, duration: 0.6 }, "+=0.5")
    .to(ads[1]!, { scale: 1.08, y: "-=4%", duration: 0.6, ease: "back.out(2)" }, "<")
    .from(q("[data-d=winner]"), { scale: 0, duration: 0.4, ease: "back.out(2.5)" }, "-=0.2")
    .from(q("[data-d=chart]"), { x: 30, autoAlpha: 0, duration: 0.6 }, "-=0.2")
    .from(
      q("[data-d=bar]"),
      { scaleY: 0, transformOrigin: "bottom", stagger: 0.08, duration: 0.6 },
      "-=0.2",
    )
    .fromTo(
      q("[data-d=trend]"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
      "-=0.5",
    )
    .from(q("[data-d=chip]"), { y: 16, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
    .to(q("[data-d=all]"), { autoAlpha: 0, duration: 0.5 }, "+=2.2");
};

function AdsScene() {
  const points = barHeights
    .map((height, index) => `${(index + 0.5) * (160 / barHeights.length)} ${100 - height}`)
    .join(" ");
  return (
    <Stage build={buildAds}>
      <div data-d="all" className="absolute inset-0">
        <div
          data-d="radar"
          className="absolute left-[24%] top-1/2 size-[46cqw] -translate-x-1/2 -translate-y-1/2"
        >
          {[1, 0.72, 0.44].map((size) => (
            <span
              key={size}
              className="ring-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-deep-teal/25"
              style={{ width: `${size * 100}%`, height: `${size * 100}%` }}
            />
          ))}
        </div>

        <div className="absolute left-[5%] top-1/2 flex -translate-y-1/2 gap-[1.6cqw]">
          {adTones.map((tone, index) => (
            <div
              key={tone}
              data-d="ad"
              className="relative w-[13cqw] rounded-[1.4cqw] border border-ink/10 bg-white p-[1cqw] shadow-[0_20px_40px_-22px_rgba(0,40,40,0.55)]"
            >
              <div className="aspect-[4/5] rounded-[0.9cqw]" style={{ background: tone }} />
              <span className="mt-[1cqw] block h-[0.9cqw] w-[80%] rounded-full bg-ink/30" />
              <span className="mt-[0.6cqw] block h-[0.9cqw] w-[50%] rounded-full bg-ink/15" />
              <span className={cn(label, "mt-[1cqw] block text-ink/50")}>Ad {"ABC"[index]}</span>
              {index === 1 && (
                <span
                  data-d="winner"
                  className="absolute -right-[1.4cqw] -top-[1.4cqw] grid size-[4.4cqw] place-items-center rounded-full bg-teal text-ink ring-4 ring-white"
                >
                  <Trophy className="size-[2.2cqw]" />
                </span>
              )}
            </div>
          ))}
        </div>

        <Glass data-d="chart" className="right-[5%] top-[12%] w-[40%] p-[2cqw]">
          <div>
            <div className="flex items-center justify-between">
              <span className={cn(label, "text-ink/60")}>Leads</span>
              <span className="flex gap-[0.6cqw]">
                <span className="rounded-full bg-secondary px-[1cqw] py-[0.3cqw] text-[max(8px,1.4cqw)] font-bold text-ink">
                  Google
                </span>
                <span className="rounded-full bg-secondary px-[1cqw] py-[0.3cqw] text-[max(8px,1.4cqw)] font-bold text-ink">
                  Meta
                </span>
              </span>
            </div>
            <div className="relative mt-[2cqw] h-[22cqw]">
              <div className="absolute inset-0 flex items-end gap-[1cqw]">
                {barHeights.map((height, index) => (
                  <span
                    key={index}
                    data-d="bar"
                    className="flex-1 rounded-t-[0.6cqw]"
                    style={{
                      height: `${height}%`,
                      background:
                        index === barHeights.length - 1
                          ? "var(--deep-teal)"
                          : "color-mix(in oklab, var(--accent) 70%, white)",
                    }}
                  />
                ))}
              </div>
              <svg
                viewBox="0 0 160 100"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                <polyline
                  data-d="trend"
                  points={points}
                  fill="none"
                  stroke="var(--glow)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="0"
                />
              </svg>
            </div>
          </div>
        </Glass>

        <div
          data-d="chip"
          className="absolute bottom-[10%] right-[8%] flex items-center gap-[1cqw] rounded-full bg-ink px-[2cqw] py-[1.1cqw] text-ivory shadow-lg"
        >
          <TrendingDown className="size-[2.4cqw] text-glow" />
          <span className="text-[max(9px,1.8cqw)] font-bold">Cost per lead going down</span>
        </div>
      </div>
    </Stage>
  );
}

const scenes: Record<SceneKind, () => ReactNode> = {
  media: MediaScene,
  web: WebScene,
  automation: AutomationScene,
  ads: AdsScene,
};

export function WorkScene({ kind }: { kind: SceneKind }) {
  const Scene = scenes[kind];
  return <Scene />;
}
