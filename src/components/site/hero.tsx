import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { heroFlipWords, heroMontage } from "./content";
import { useExperience } from "./experience";
import { FlipWords } from "./flip-words";
import { HeroShader, type HeroShaderState } from "./hero-shader";
import { Corners, Magnetic, RollText } from "./primitives";

/** Rounded "video pill" set inline in the headline — a fast-cut montage. */
function HeroPill({ onClick }: { onClick: () => void }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setFrame((current) => (current + 1) % heroMontage.length),
      850,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      data-cursor="play"
      data-cursor-label="Work"
      onClick={onClick}
      className="relative inline-block h-[0.72em] w-[1.85em] shrink-0 overflow-hidden rounded-full shadow-[0_18px_40px_-18px_rgba(0,40,40,0.6)] ring-4 ring-white/70"
    >
      {heroMontage.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-200",
            index === frame ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <span className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
      <span className="absolute left-[0.14em] top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] font-medium normal-case tracking-[0.2em] text-ivory backdrop-blur-sm md:text-xs">
        <span className="rec-blink size-1.5 rounded-full bg-glow" />
        WORK
      </span>
    </span>
  );
}

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

      // Content is on screen from the first frame; only the colour wash blooms in.
      gsap.to(shaderState.current, { intro: 1, duration: 2.4, ease: "power2.out" });

      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          defaults: { ease: "none" },
        })
        .to("[data-hero-row='1']", { xPercent: -7 }, 0)
        .to("[data-hero-row='2']", { xPercent: 9 }, 0)
        .to("[data-hero-row='3']", { xPercent: -4 }, 0)
        .to("[data-hero-bottom]", { yPercent: 45, opacity: 0 }, 0)
        .to("[data-hero-frame]", { scale: 1.08, opacity: 0 }, 0)
        .to(shaderState.current, { scroll: 1 }, 0);
    },
    { scope: rootRef },
  );

  const toReel = () => scrollTo("#reel");

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ivory text-ink"
    >
      <HeroShader stateRef={shaderState} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory/80" />

      {/* Camera viewfinder overlay */}
      <div
        data-hero-frame
        className="pointer-events-none absolute inset-x-3 bottom-3 top-[5.25rem] md:inset-x-8 md:bottom-8 md:top-28"
      >
        <Corners className="inset-0 text-ink/40" size="size-5 md:size-9" />
        <div className="absolute left-1/2 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 text-ink/25 md:block">
          <span className="block h-px w-8 bg-current" />
          <span className="absolute left-1/2 top-1/2 block h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 md:px-14 md:pb-28 lg:px-20 lg:pb-32">
        <h1
          className="text-[10.6vw] uppercase leading-[0.86] md:text-[min(9.2vw,14.5svh)] 2xl:text-[min(8.6vw,14.5svh)]"
          style={{ fontStretch: "118%" }}
        >
          <span className="sr-only">Make attention mean something.</span>
          <span aria-hidden="true" className="block">
            <span data-hero-row="1" className="flex items-center gap-[0.16em]">
              <span>Make</span>
              <HeroPill onClick={toReel} />
            </span>
            <span data-hero-row="2" className="block pl-[0.4em] md:pl-[1.5em]">
              Attention
            </span>
            <span data-hero-row="3" className="flex flex-wrap items-baseline gap-x-[0.18em]">
              <span
                className="inline-block font-serif text-[1.08em] font-normal normal-case italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                mean
              </span>
              <span>something.</span>
            </span>
          </span>
        </h1>

        <div
          data-hero-bottom
          className="mt-8 flex flex-col gap-7 md:mt-12 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-xl font-medium leading-snug text-ink md:text-2xl">
              Digital growth for{" "}
              <FlipWords
                words={heroFlipWords}
                className="font-serif text-[1.18em] italic text-deep-teal"
              />
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink/70">
              Performance marketing, high-converting websites and smart automation — working
              together to turn clicks into customers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo("#contact");
                }}
                className="group inline-flex h-14 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow"
              >
                <RollText>Start a project</RollText>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={toReel}
                className="group inline-flex h-14 items-center gap-3 rounded-full border border-ink/20 bg-white/50 px-6 text-base font-semibold text-ink backdrop-blur-md transition-colors hover:border-ink"
              >
                <Play className="size-4" fill="currentColor" strokeWidth={0} />
                <RollText>See our work</RollText>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
