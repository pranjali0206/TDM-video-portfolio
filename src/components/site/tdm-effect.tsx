import { useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

import { SectionLabel } from "./primitives";

/*
 * "The TDM Effect": a suited business owner waves a wand and a rough, black and
 * white idea flips into a full-colour brand, with sales, growth and marketing
 * bursting out around it. Drawn in SVG and looped with GSAP while on screen;
 * the markup is the finished state, so reduced-motion visitors see the result.
 */

const CARD = { x: 700, y: 150, w: 300, h: 340 };
const CENTER = { x: CARD.x + CARD.w / 2, y: CARD.y + CARD.h / 2 };
const WAND_TIP = { x: 566, y: 178 };
const SHOULDER = "418 318";

const chips = [
  { label: "Growth", x: 850, y: 92, tone: "var(--teal)" },
  { label: "Sales", x: 1105, y: 205, tone: "var(--accent)" },
  { label: "Revenue", x: 1102, y: 440, tone: "color-mix(in oklab, var(--glow) 55%, white)" },
  { label: "Marketing", x: 850, y: 560, tone: "var(--accent)" },
  { label: "Leads", x: 628, y: 528, tone: "var(--teal)" },
  { label: "Reach", x: 1062, y: 560, tone: "var(--secondary)" },
];

const sparkles = [
  { x: 600, y: 196, s: 1 },
  { x: 640, y: 214, s: 0.7 },
  { x: 676, y: 232, s: 1.1 },
  { x: 712, y: 250, s: 0.8 },
  { x: 620, y: 240, s: 0.6 },
  { x: 690, y: 196, s: 0.75 },
];

const confetti = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2;
  const radius = 210 + (index % 3) * 40;
  return {
    x: CENTER.x + Math.cos(angle) * radius,
    y: CENTER.y + Math.sin(angle) * radius * 0.8,
    r: (index * 47) % 360,
    tone: ["var(--accent)", "var(--teal)", "var(--glow)", "var(--deep-teal)"][index % 4]!,
  };
});

const bars = [40, 62, 54, 86, 118];

const star = (size: number) =>
  `M0 ${-size} L${size * 0.28} ${-size * 0.28} L${size} 0 L${size * 0.28} ${size * 0.28} L0 ${size} L${-size * 0.28} ${size * 0.28} L${-size} 0 L${-size * 0.28} ${-size * 0.28} Z`;

const chipWidth = (label: string) => label.length * 19 + 60;

function Character() {
  return (
    <g data-fx="character">
      {/* Shadow */}
      <ellipse cx="330" cy="652" rx="120" ry="14" fill="var(--ink)" opacity="0.12" />

      {/* Legs and shoes */}
      <rect x="284" y="470" width="40" height="166" rx="16" fill="var(--night)" />
      <rect x="336" y="470" width="40" height="166" rx="16" fill="var(--night)" />
      <ellipse cx="298" cy="640" rx="36" ry="15" fill="var(--ink)" />
      <ellipse cx="364" cy="640" rx="36" ry="15" fill="var(--ink)" />

      {/* Arm on the hip (behind the jacket) */}
      <path
        d="M250 330 Q200 410 258 452"
        fill="none"
        stroke="var(--night)"
        strokeWidth="36"
        strokeLinecap="round"
      />
      <circle cx="262" cy="452" r="18" fill="#f2c39b" />

      {/* Jacket */}
      <path d="M238 304 Q330 270 422 304 L436 494 Q330 518 224 494 Z" fill="var(--night)" />
      {/* Shirt, lapels and tie */}
      <path d="M298 290 L330 380 L362 290 Z" fill="#ffffff" />
      <path d="M298 290 L330 380 L284 336 L292 296 Z" fill="var(--night-soft)" />
      <path d="M362 290 L330 380 L376 336 L368 296 Z" fill="var(--night-soft)" />
      <path d="M321 300 L339 300 L346 362 L330 392 L314 362 Z" fill="var(--accent)" />
      <rect x="319" y="292" width="22" height="16" rx="5" fill="var(--deep-teal)" />
      {/* Pocket square and buttons */}
      <path d="M372 344 L404 344 L396 330 L388 340 L380 328 Z" fill="var(--glow)" />
      <circle cx="330" cy="430" r="5" fill="var(--ink)" />
      <circle cx="330" cy="462" r="5" fill="var(--ink)" />

      {/* Neck and head */}
      <rect x="317" y="258" width="26" height="40" rx="8" fill="#e8b48a" />
      <circle cx="268" cy="218" r="13" fill="#f2c39b" />
      <circle cx="392" cy="218" r="13" fill="#f2c39b" />
      <circle cx="330" cy="212" r="64" fill="#f2c39b" />
      <path
        d="M266 206 Q266 136 334 140 Q400 144 396 206 Q388 172 350 168 Q330 182 300 172 Q276 178 272 208 Z"
        fill="var(--ink)"
      />
      {/* Face */}
      <g data-fx="eyes">
        <ellipse cx="306" cy="214" rx="7" ry="9" fill="var(--ink)" />
        <ellipse cx="354" cy="214" rx="7" ry="9" fill="var(--ink)" />
        <circle cx="308" cy="211" r="2.2" fill="#fff" />
        <circle cx="356" cy="211" r="2.2" fill="#fff" />
      </g>
      <path
        d="M294 194 Q306 186 318 192"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M342 192 Q354 186 366 194"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="292" cy="238" r="10" fill="var(--glow)" opacity="0.28" />
      <circle cx="368" cy="238" r="10" fill="var(--glow)" opacity="0.28" />
      <path
        d="M306 244 Q330 268 354 244"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Wand arm, pivoting at the shoulder */}
      <g data-fx="arm">
        <path
          d="M418 318 Q474 330 502 278"
          fill="none"
          stroke="var(--night)"
          strokeWidth="36"
          strokeLinecap="round"
        />
        <line
          x1="506"
          y1="270"
          x2={WAND_TIP.x - 4}
          y2={WAND_TIP.y + 6}
          stroke="var(--ink)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <line
          x1={WAND_TIP.x - 14}
          y1={WAND_TIP.y + 21}
          x2={WAND_TIP.x - 4}
          y2={WAND_TIP.y + 6}
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="506" cy="272" r="19" fill="#f2c39b" />
        <path
          data-fx="tip"
          d={star(16)}
          transform={`translate(${WAND_TIP.x} ${WAND_TIP.y})`}
          fill="var(--glow)"
        />
      </g>
    </g>
  );
}

function IdeaCard() {
  return (
    <g data-fx="idea">
      <rect
        x={CARD.x}
        y={CARD.y}
        width={CARD.w}
        height={CARD.h}
        rx="28"
        fill="#ffffff"
        stroke="#bdbdbd"
        strokeWidth="2.5"
        strokeDasharray="10 7"
      />
      {/* A pencil-sketched bulb */}
      <g fill="none" stroke="#3a3a3a" strokeWidth="5" strokeLinecap="round">
        <path d="M850 222 C806 222 784 256 788 290 C792 322 818 334 822 360 L878 360 C882 334 908 322 912 290 C916 256 894 222 850 222 Z" />
        <path d="M828 376 L872 376" />
        <path d="M832 392 L868 392" />
        <path d="M838 408 L862 408" />
        <path d="M836 300 Q850 270 864 300" />
        <path d="M850 196 L850 176" />
        <path d="M778 236 L764 222" />
        <path d="M922 236 L936 222" />
      </g>
      <text
        x="850"
        y="462"
        textAnchor="middle"
        fill="#2b2b2b"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 54 }}
      >
        idea
      </text>
      <path
        d="M740 178 Q760 172 780 180"
        fill="none"
        stroke="#9a9a9a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M920 470 Q940 462 962 470"
        fill="none"
        stroke="#9a9a9a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function BrandCard() {
  return (
    <g data-fx="brand">
      <rect
        x={CARD.x}
        y={CARD.y}
        width={CARD.w}
        height={CARD.h}
        rx="28"
        fill="url(#fx-brand)"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <rect
        x={CARD.x + 18}
        y={CARD.y + 18}
        width={CARD.w - 36}
        height="96"
        rx="18"
        fill="#ffffff"
        opacity="0.92"
      />
      <circle cx={CARD.x + 66} cy={CARD.y + 66} r="30" fill="var(--ink)" />
      <path
        d={star(17)}
        transform={`translate(${CARD.x + 66} ${CARD.y + 66})`}
        fill="var(--glow)"
      />
      <text
        x={CARD.x + 112}
        y={CARD.y + 80}
        fill="var(--ink)"
        style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 40 }}
      >
        BRAND
      </text>
      {/* Rising chart */}
      {bars.map((height, index) => (
        <rect
          key={index}
          data-fx="bar"
          x={CARD.x + 40 + index * 46}
          y={CARD.y + CARD.h - 34 - height}
          width="30"
          height={height}
          rx="7"
          fill={index === bars.length - 1 ? "var(--ink)" : "#ffffff"}
          opacity={index === bars.length - 1 ? 1 : 0.85}
        />
      ))}
      <path
        data-fx="trend"
        d={`M${CARD.x + 48} ${CARD.y + 236} L${CARD.x + 120} ${CARD.y + 214} L${CARD.x + 170} ${CARD.y + 224} L${CARD.x + 262} ${CARD.y + 150}`}
        fill="none"
        stroke="var(--glow)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
      <path
        d={`M${CARD.x + 262} ${CARD.y + 150} l-26 2 m26 -2 l-6 25`}
        fill="none"
        stroke="var(--glow)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </g>
  );
}

export function TdmEffect() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const arm = { svgOrigin: SHOULDER };

      // Idle life: a gentle bob and the odd blink.
      const idle = gsap.timeline({ paused: true });
      idle.to(q("[data-fx=character]"), {
        y: -7,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      const blink = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.6 });
      blink.to(q("[data-fx=eyes]"), {
        scaleY: 0.1,
        transformOrigin: "50% 50%",
        duration: 0.08,
        yoyo: true,
        repeat: 1,
      });

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3 });
      tl.set(q("[data-fx=idea]"), { scaleX: 1, opacity: 0, transformOrigin: "50% 50%" }, 0)
        .set(q("[data-fx=brand]"), { scaleX: 0, opacity: 1, transformOrigin: "50% 50%" }, 0)
        .set(q("[data-fx=bar]"), { scaleY: 0, transformOrigin: "50% 100%" }, 0)
        .set(q("[data-fx=trend]"), { strokeDashoffset: 1 }, 0)
        .set(q("[data-fx=chip]"), { opacity: 0 }, 0)
        .set(q("[data-fx=confetti]"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, 0)
        .set(q("[data-fx=sparkle]"), { opacity: 0 }, 0)
        .set(q("[data-fx=flash]"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, 0)
        .set(q("[data-fx=label]"), { opacity: 0, y: 24 }, 0)
        .set(q("[data-fx=arm]"), { rotation: 38, ...arm }, 0)
        .to(q("[data-fx=idea]"), { opacity: 1, duration: 0.5 }, 0.1)

        // He lifts the wand...
        .to(q("[data-fx=arm]"), { rotation: -14, duration: 0.7, ease: "back.out(2)", ...arm }, 0.9)
        .to(
          q("[data-fx=tip]"),
          {
            rotation: 180,
            scale: 1.4,
            transformOrigin: "50% 50%",
            duration: 0.5,
            yoyo: true,
            repeat: 1,
          },
          1.2,
        )
        // ...flicks it...
        .to(q("[data-fx=arm]"), { rotation: 8, duration: 0.18, ease: "power2.in", ...arm }, 1.75)
        .to(q("[data-fx=arm]"), { rotation: -6, duration: 0.4, ease: "back.out(3)", ...arm }, 1.93);

      // ...and sparkles stream from the wand to the idea.
      sparkles.forEach((sparkle, index) => {
        const at = 1.85 + index * 0.06;
        const el = q("[data-fx=sparkle]")[index];
        tl.fromTo(
          el!,
          {
            x: WAND_TIP.x - sparkle.x,
            y: WAND_TIP.y - sparkle.y,
            opacity: 1,
            scale: 0.4,
            rotation: 0,
          },
          {
            x: CENTER.x - 70 - sparkle.x,
            y: CENTER.y - 40 - sparkle.y,
            scale: sparkle.s * 1.4,
            rotation: 160,
            duration: 0.55,
            ease: "power2.in",
          },
          at,
        ).to(el!, { opacity: 0, duration: 0.15 }, at + 0.5);
      });

      tl
        // The idea trembles, then — flash — it flips into a brand.
        .to(q("[data-fx=idea]"), { x: 6, duration: 0.05, yoyo: true, repeat: 5 }, 2.25)
        .to(
          q("[data-fx=flash]"),
          { scale: 1.5, opacity: 0.95, duration: 0.25, ease: "power2.out" },
          2.55,
        )
        .to(q("[data-fx=flash]"), { opacity: 0, duration: 0.6 }, 2.8)
        .to(q("[data-fx=idea]"), { scaleX: 0, duration: 0.22, ease: "power2.in" }, 2.6)
        .to(q("[data-fx=brand]"), { scaleX: 1, duration: 0.6, ease: "back.out(2)" }, 2.82)
        .to(
          q("[data-fx=bar]"),
          { scaleY: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)" },
          3.2,
        )
        .to(q("[data-fx=trend]"), { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 3.45);

      // Everything a brand needs bursts out around it.
      q("[data-fx=chip]").forEach((chip, index) => {
        const { x, y } = chips[index]!;
        tl.fromTo(
          chip,
          { x: CENTER.x - x, y: CENTER.y - y, scale: 0, opacity: 0, svgOrigin: `${x} ${y}` },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            svgOrigin: `${x} ${y}`,
            duration: 0.8,
            ease: "back.out(1.8)",
          },
          3.3 + index * 0.08,
        );
      });

      tl.to(
        q("[data-fx=confetti]"),
        {
          opacity: 1,
          scale: 1,
          rotation: "+=120",
          duration: 0.6,
          stagger: 0.02,
          ease: "back.out(2)",
        },
        3.35,
      )
        .to(q("[data-fx=confetti]"), { opacity: 0, y: "+=30", duration: 0.8, stagger: 0.02 }, 4.4)
        .to(q("[data-fx=label]"), { opacity: 1, y: 0, duration: 0.7, ease: "back.out(2)" }, 4)
        .to(q("[data-fx=arm]"), { rotation: 38, duration: 0.9, ease: "power2.inOut", ...arm }, 4.4)

        // Hold the result, then clear the stage for the next idea.
        .to(
          q("[data-fx=chip], [data-fx=label], [data-fx=brand]"),
          { opacity: 0, duration: 0.5, stagger: 0.03 },
          "+=3",
        );

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          for (const timeline of [tl, idle, blink]) {
            if (self.isActive) timeline.play();
            else timeline.pause();
          }
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="effect"
      className="relative overflow-hidden bg-ivory px-6 py-24 text-ink md:px-14 md:py-32 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-24 top-24 size-[26rem] bg-accent/30" />
        <div className="orb -right-20 bottom-10 size-[24rem] bg-teal/40 [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <div>
            <SectionLabel>The TDM Effect</SectionLabel>
            <h2
              data-split
              className="mt-6 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em]"
              style={{ fontStretch: "108%" }}
            >
              Ideas in.{" "}
              <span
                className="font-serif font-normal italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                Brands
              </span>{" "}
              out.
            </h2>
          </div>
          <p
            data-fade
            className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg"
          >
            Bring us a rough idea. We turn it into a brand that sells — with the marketing, sales
            and growth engine built all around it.
          </p>
        </div>

        <div
          className="relative mt-12 aspect-[1200/650] overflow-hidden rounded-[1.75rem] md:aspect-[1200/470] bg-white ring-1 ring-ink/10 shadow-[0_40px_90px_-50px_rgba(0,40,40,0.5)] md:mt-16 md:rounded-[2.25rem]"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px), linear-gradient(160deg, white 30%, color-mix(in oklab, var(--secondary) 70%, white))",
            backgroundSize: "20px 20px, 100% 100%",
          }}
        >
          <svg
            // Cropped to the scene; on wider screens the panel is shorter and the
            // scene scales down to fit, centred on the dotted backdrop.
            viewBox="0 40 1200 650"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="A business owner waves a magic wand and turns a black and white idea into a colourful brand surrounded by sales, growth, marketing, leads, reach and revenue — the TDM Effect."
            className="absolute inset-0 block size-full"
          >
            <defs>
              <linearGradient id="fx-brand" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--accent)" }} />
                <stop offset="100%" style={{ stopColor: "var(--teal)" }} />
              </linearGradient>
              <radialGradient id="fx-flash">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" style={{ stopColor: "var(--teal)" }} stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dashed orbit the results ride on */}
            <ellipse
              cx={CENTER.x}
              cy={CENTER.y + 10}
              rx="270"
              ry="250"
              fill="none"
              stroke="var(--deep-teal)"
              strokeOpacity="0.18"
              strokeWidth="2"
              strokeDasharray="6 10"
            />

            {confetti.map((piece, index) => (
              <rect
                key={index}
                data-fx="confetti"
                x={piece.x - 6}
                y={piece.y - 3}
                width="12"
                height="6"
                rx="2"
                fill={piece.tone}
                transform={`rotate(${piece.r} ${piece.x} ${piece.y})`}
                opacity="0"
              />
            ))}

            <IdeaCard />
            <BrandCard />
            <circle
              data-fx="flash"
              cx={CENTER.x}
              cy={CENTER.y}
              r="190"
              fill="url(#fx-flash)"
              opacity="0"
            />

            {chips.map((chip) => {
              const width = chipWidth(chip.label);
              return (
                <g key={chip.label} data-fx="chip">
                  <rect
                    x={chip.x - width / 2}
                    y={chip.y - 30}
                    width={width}
                    height="60"
                    rx="30"
                    fill={chip.tone}
                    stroke="var(--ink)"
                    strokeOpacity="0.12"
                  />
                  <path
                    d={`M${chip.x - width / 2 + 22} ${chip.y + 6} l8 -12 l8 12`}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x={chip.x + 12}
                    y={chip.y + 10}
                    textAnchor="middle"
                    fill="var(--ink)"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 30 }}
                  >
                    {chip.label}
                  </text>
                </g>
              );
            })}

            <Character />

            {sparkles.map((sparkle, index) => (
              <path
                key={index}
                data-fx="sparkle"
                d={star(12 * sparkle.s)}
                transform={`translate(${sparkle.x} ${sparkle.y})`}
                fill={index % 2 ? "var(--teal)" : "var(--glow)"}
                opacity="0"
              />
            ))}

            {/* The payoff */}
            <g data-fx="label">
              <rect x="430" y="616" width="340" height="60" rx="30" fill="var(--ink)" />
              <path d={star(11)} transform="translate(468 646)" fill="var(--glow)" />
              <text
                x="616"
                y="656"
                textAnchor="middle"
                fill="var(--ivory)"
                style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 27 }}
              >
                That’s the TDM Effect
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
