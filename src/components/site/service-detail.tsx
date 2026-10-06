import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, type LucideIcon } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Corners, Reveal, VideoSlot } from "./primitives";
import { WorkScene, type SceneKind } from "./work-scenes";

/*
 * Building blocks shared by the dedicated Work pages (/media-house,
 * /websites, /automation), so they read as one family with /services.
 */

export type Feature = { icon: LucideIcon; title: string; text: string };

/** Page opener: back link, headline with a serif accent word, intro and showreel. */
export function DetailHero({
  eyebrow,
  title,
  accent,
  intro,
  scene,
  video,
  videoTitle,
  media,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  scene: SceneKind;
  video?: string | undefined;
  videoTitle: string;
  /** Replaces the showreel panel entirely (e.g. a grid of highlights). */
  media?: ReactNode;
}) {
  return (
    <header
      id="top"
      className="relative overflow-hidden px-6 pb-16 pt-32 md:px-14 md:pb-24 md:pt-44 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-[8%] top-[10%] size-[26rem] bg-accent/45" />
        <div className="orb -right-[6%] top-0 size-[24rem] bg-teal/55 [animation-delay:-6s]" />
        <div className="orb left-[45%] top-[45%] size-[18rem] bg-glow/20 [animation-delay:-12s]" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </Reveal>
        <Reveal delay={60}>
          <p className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
            <span className="h-px w-8 bg-current" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1
            data-split
            className="text-teal-gradient mt-6 max-w-5xl text-[clamp(2.6rem,7.2vw,7rem)] leading-[0.92] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            {title}{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              {accent}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-ink sm:mt-8 sm:text-lg md:text-xl">
            {intro}
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-12 md:mt-16">
          {media ?? (
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-video md:rounded-[2.25rem]">
              {video ? (
                <VideoSlot
                  title={videoTitle}
                  src={video}
                  label="Showreel"
                  cursorLabel="Watch"
                  size="lg"
                  className="size-full"
                />
              ) : (
                <WorkScene kind={scene} />
              )}
            </div>
          )}
        </Reveal>
      </div>
    </header>
  );
}

/** A titled band of the page. */
export function DetailSection({
  id,
  label,
  title,
  intro,
  children,
  dark = false,
}: {
  id?: string;
  label: string;
  title: ReactNode;
  intro?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 px-6 py-20 md:px-14 md:py-28 lg:px-20",
        dark ? "bg-ink text-ivory" : "border-t border-ink/10",
      )}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-12">
          <Reveal>
            <p
              className={cn(
                "inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em]",
                dark ? "text-accent" : "text-deep-teal",
              )}
            >
              <span className="h-px w-8 bg-current" />
              {label}
            </p>
            <h2
              data-split
              className={cn(
                "mt-5 text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]",
                !dark && "text-teal-gradient",
              )}
              style={{ fontStretch: "105%" }}
            >
              {title}
            </h2>
          </Reveal>
          {intro && (
            <Reveal delay={100}>
              <p
                className={cn(
                  "max-w-lg text-base font-medium leading-relaxed sm:text-lg",
                  dark ? "text-ivory/80" : "text-ink",
                )}
              >
                {intro}
              </p>
            </Reveal>
          )}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

const featureTones = ["bg-accent", "bg-teal", "bg-glow/70", "bg-secondary"];

const trackSpotlight = (event: PointerEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
};

// Hover: the card lifts, a soft light follows the pointer and an accent line draws in.
const liftCard =
  "spotlight group relative h-full overflow-hidden rounded-[1.5rem] border p-6 transition duration-500 ease-out hover:-translate-y-1.5 md:p-8";

/** Icon cards in a responsive grid. */
export function FeatureGrid({ items, dark = false }: { items: Feature[]; dark?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, text }, index) => (
        <li key={title}>
          <Reveal delay={(index % 3) * 80} className="h-full">
            <div
              onPointerMove={trackSpotlight}
              className={cn(
                liftCard,
                dark
                  ? "border-ivory/10 bg-ivory/5 [--spot:color-mix(in_oklab,var(--accent)_22%,transparent)] hover:border-accent/40"
                  : "border-ink/10 bg-white/70 [--spot:color-mix(in_oklab,var(--accent)_28%,transparent)] hover:border-ink/25 hover:shadow-[0_30px_60px_-30px_rgba(0,40,40,0.45)]",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-accent via-teal to-glow transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
              <span
                className={cn(
                  "relative grid size-12 place-items-center rounded-2xl text-ink transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110",
                  featureTones[index % featureTones.length],
                )}
              >
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <h3
                className="relative mt-6 font-display text-xl font-bold leading-tight md:text-2xl"
                style={{ fontStretch: "105%" }}
              >
                {title}
              </h3>
              <p
                className={cn(
                  "relative mt-3 text-[15px] font-medium leading-relaxed",
                  dark ? "text-ivory/75" : "text-ink/80",
                )}
              >
                {text}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** Numbered process steps. */
export function StepList({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {steps.map(({ title, text }, index) => (
        <li key={title}>
          <Reveal delay={index * 80} className="h-full">
            <div
              onPointerMove={trackSpotlight}
              className={cn(
                liftCard,
                "border-ink/10 bg-white/70 [--spot:color-mix(in_oklab,var(--teal)_45%,transparent)] hover:border-ink/25 hover:shadow-[0_30px_60px_-30px_rgba(0,40,40,0.45)]",
              )}
            >
              <Corners
                className="inset-3 transition-colors duration-500 group-hover:text-deep-teal"
                size="size-3"
              />
              <span
                className="relative block font-display text-6xl leading-none text-outline transition-[-webkit-text-stroke-color] duration-500 group-hover:[--stroke:var(--deep-teal)]"
                style={{ fontStretch: "125%" }}
              >
                0{index + 1}
              </span>
              <h3
                className="relative mt-6 font-display text-xl font-bold leading-tight md:text-2xl"
                style={{ fontStretch: "105%" }}
              >
                {title}
              </h3>
              <p className="relative mt-3 text-[15px] font-medium leading-relaxed text-ink/80">
                {text}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/** Two-column checklist. */
export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-[15px] font-semibold leading-snug sm:text-base"
        >
          <span
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
              dark ? "bg-accent text-ink" : "bg-ink text-accent",
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Closing call to action, matching the /services one. */
export function DetailCta({
  kicker,
  title,
  accent,
}: {
  kicker: string;
  title: string;
  accent: string;
}) {
  return (
    <section className="px-4 pb-24 pt-4 sm:px-6 md:px-14 md:pb-32 md:pt-8 lg:px-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center text-ivory sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>
          <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            {kicker}
          </p>
          <h2
            className="relative mx-auto mt-5 max-w-3xl text-balance text-[clamp(2rem,8.5vw,2.25rem)] leading-[1] sm:mt-6 md:text-6xl"
            style={{ fontStretch: "105%" }}
          >
            {title}{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              {accent}
            </span>
          </h2>
          <Link
            to="/"
            hash="contact"
            className="group relative mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink transition-colors hover:bg-glow"
          >
            Start a project
            <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
