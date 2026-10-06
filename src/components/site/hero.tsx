import { useRef } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { heroFlipWords } from "./content";
import { useExperience } from "./experience";
import { FlipWords } from "./flip-words";
import { HeroShader, type HeroShaderState } from "./hero-shader";
import { VIDEO_BASE } from "./reels";

// The hero statement's typeface: Unbounded, via the font-hero role in styles.css
// (loaded in __root.tsx).
const GROTESK = "font-hero";

// The TDM Effect animation ("Ideas in. Brands out."), from the R2 folder "animated video".
const effectVideo = `${VIDEO_BASE}/animated%20video/tdm-animation-01`;

/**
 * The TDM Effect animation, filling the "o" of "something". Sized and placed
 * from the real Unbounded Bold "o" (measured in em): its ink is a 0.734 ×
 * 0.609 oval starting 0.031em into the letter and dipping 0.016em below the
 * baseline. The margins add up to the letter's advance (0.792em) minus the
 * headline's -0.06em tracking, so "s" and "m" sit exactly where they would.
 */
function HeroBlob({ onClick }: { onClick: () => void }) {
  return (
    <span
      data-cursor="play"
      data-cursor-label="Work"
      onClick={onClick}
      className="relative -mb-[0.016em] -mr-[0.034em] ml-[0.031em] inline-block h-[0.609em] w-[0.734em] shrink-0 overflow-hidden rounded-[50%] bg-white"
    >
      <video
        // React doesn't render `muted` into the server HTML, so browsers can
        // refuse to autoplay; mute and start it explicitly once mounted.
        ref={(video) => {
          if (!video) return;
          video.muted = true;
          void video.play().catch(() => {});
        }}
        src={`${effectVideo}.mp4`}
        poster={`${effectVideo}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}

/**
 * Hero layout rules (nothing is placed by eye):
 *  - One shared content box. Its left and right edges are the only two
 *    alignment lines on the page.
 *  - All four rows ("make", "attention", "mean", "something.") hug the LEFT
 *    edge; the intro copy hugs the RIGHT edge.
 *  - Everything scales from one variable, --fs, so proportions hold at any size.
 */
export function Hero() {
  const { scrollTo } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const shaderState = useRef<HeroShaderState>({ intro: 0, scroll: 0 });

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (prefersReducedMotion()) {
        shaderState.current.intro = 1;
        return;
      }

      gsap.to(shaderState.current, { intro: 1, duration: 2.4, ease: "power2.out" });

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          defaults: { ease: "none" },
        })
        .to("[data-hero-row='1']", { xPercent: -4 }, 0)
        .to("[data-hero-row='2']", { xPercent: 4 }, 0)
        .to("[data-hero-row='3']", { xPercent: -3 }, 0)
        .to("[data-hero-row='4']", { xPercent: 3 }, 0)
        .to("[data-hero-bottom]", { yPercent: 40, opacity: 0 }, 0)
        .to(shaderState.current, { scroll: 1 }, 0);
    },
    { scope: rootRef },
  );

  const toServices = () => scrollTo("#services");

  // Same recipe for every row: tight stacking, but room for ascenders/descenders.
  const mask = "block overflow-y-clip pb-[0.14em] pt-[0.08em] -mt-[0.1em] first:mt-0";

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ivory text-ink"
    >
      <HeroShader stateRef={shaderState} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/35 via-transparent to-ivory/70" />

      <div className="relative z-10 flex h-full flex-col justify-center px-5 pb-10 pt-24 md:px-[4.5vw] md:pb-24 md:pt-28">
        {/*
          --fs is the one number to tune: the widest row ("something.") sets the
          width limit, the four stacked rows set the height limit.
        */}
        <div className="[--fs:13.4vw] md:[--fs:min(12.6vw,18.5svh)]">
          <h1
            className={cn(
              GROTESK,
              "text-[length:var(--fs)] font-bold leading-[0.88] tracking-[-0.06em] text-jet",
            )}
          >
            <span className="sr-only">Make attention mean something.</span>
            <span aria-hidden="true" className="block">
              {/* Row 1: left edge */}
              <span className={mask}>
                <span data-hero-row="1" className="hero-rise block [--d:0.15s]">
                  make
                </span>
              </span>

              {/* Row 2: left edge */}
              <span className={mask}>
                <span data-hero-row="2" className="hero-rise block whitespace-nowrap [--d:0.3s]">
                  attention
                </span>
              </span>

              {/* Row 3: coral "mean", with the intro copy beside it on wide screens */}
              <span className={mask}>
                <span
                  data-hero-row="3"
                  className="hero-rise flex items-end justify-between gap-8 [--d:0.45s]"
                >
                  <span className="text-glow">mean</span>
                  <span
                    data-hero-bottom
                    className="hero-fade mb-[0.12em] hidden max-w-[30rem] font-sans text-[clamp(1rem,1.35vw,1.5rem)] font-medium leading-[1.25] tracking-[-0.02em] text-ink [--d:0.8s] md:block"
                  >
                    <span className="block font-bold">
                      Experts in <FlipWords words={heroFlipWords} className="font-bold text-glow" />
                    </span>
                    <span className="mt-1 block">
                      Deep expertise across marketing, technology and AI — every service working
                      together to <strong className="font-bold">turn clicks into customers.</strong>
                    </span>
                  </span>
                </span>
              </span>

              {/* Row 4: the TDM Effect animation in place of the "o" */}
              <span className={mask}>
                <span data-hero-row="4" className="hero-rise block whitespace-nowrap [--d:0.6s]">
                  s<HeroBlob onClick={toServices} />
                  mething.
                </span>
              </span>
            </span>
          </h1>

          {/* Phones: the intro copy sits under the headline. */}
          <div className="hero-fade mt-6 max-w-[34rem] text-[1.05rem] font-medium leading-[1.3] tracking-[-0.02em] text-ink [--d:0.8s] md:hidden">
            <p className="font-bold">
              Experts in <FlipWords words={heroFlipWords} className="font-bold text-glow" />
            </p>
            <p className="mt-1">
              Deep expertise across marketing, technology and AI — every service working together to{" "}
              <strong className="font-bold">turn clicks into customers.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
