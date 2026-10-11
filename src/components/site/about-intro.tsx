import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Star } from "lucide-react";
import type { ReactNode } from "react";

import { aboutPillars, aboutProcess, aboutValues } from "./content";
import { Corners, Reveal } from "./primitives";

/** A highlighter stroke behind the sentences that carry the page. */
function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="box-decoration-clone rounded-[0.2em] bg-[linear-gradient(to_top,var(--accent)_42%,transparent_42%)] px-[0.12em] font-semibold text-ink">
      {children}
    </mark>
  );
}

/** Mono label with rules either side, used to open each About section. */
function Eyebrow({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return (
    <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal">
      <span className="h-px w-8 bg-current" />
      {children}
      {centered && <span className="h-px w-8 bg-current" />}
    </p>
  );
}

const ctaClass =
  "group inline-flex h-14 items-center gap-4 rounded-full pl-7 pr-2 font-display text-base font-bold uppercase tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:h-16 md:text-lg";
const ctaIconClass =
  "grid size-10 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 md:size-12";

/**
 * The About-us opener: who TDM Groups is, in one statement with its key
 * sentences highlighted — all about us, no imagery.
 */
export function AboutIntro() {
  return (
    <section
      id="top"
      aria-labelledby="about-intro-title"
      className="relative overflow-hidden px-6 pb-20 pt-36 text-center md:px-14 md:pb-28 md:pt-44 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -right-[8%] top-[6%] size-[28rem] bg-accent/35" />
        <div className="orb -left-[10%] top-[40%] size-[24rem] bg-teal/45 [animation-delay:-9s]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center">
        <Reveal>
          <Eyebrow centered>About TDM Groups</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1
            id="about-intro-title"
            className="text-teal-gradient mt-6 text-[clamp(2.8rem,8.5vw,8rem)] leading-[0.9] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            Where clicks become{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              growth.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-10 max-w-3xl text-xl font-medium leading-relaxed text-ink md:text-2xl md:leading-relaxed">
            TDM Groups is an <Highlight>AI-powered business consulting company</Highlight>. We give
            you the tools to <Highlight>automate your operations and grow your sales</Highlight>,
            pairing <Highlight>deep market understanding with sharp strategy</Highlight> to find
            what works and take it to its optimal level.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <a
            href="#whats-up"
            className="mt-12 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink transition-colors hover:text-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
          >
            <span className="grid size-9 place-items-center rounded-full border border-ink/20">
              <ArrowDown className="size-4" />
            </span>
            A little about us
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/** After the bento: how we think, and the way into the case study. */
export function AboutThinking() {
  return (
    <section
      aria-labelledby="about-thinking-title"
      className="relative px-4 pb-24 sm:px-6 md:px-14 md:pb-32 lg:px-20"
    >
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-accent px-6 py-14 text-center text-ink sm:rounded-[2.5rem] sm:px-10 md:py-20">
          <Corners className="inset-4 text-ink/30 md:inset-6" size="size-5 md:size-7" />
          <Eyebrow centered>Know our thinking strategy</Eyebrow>
          <h2
            id="about-thinking-title"
            className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.02em]"
            style={{ fontStretch: "105%" }}
          >
            Stand out. Sharpen every small step.{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-deep-teal"
              style={{ fontStretch: "100%" }}
            >
              Connect it all.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed sm:text-lg">
            Three ideas sit behind every brand we grow: the Purple Cow, the Butterfly Effect and the
            TDM Effect. See how they play out, step by step, with real numbers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/tdm-mindset" className={`${ctaClass} bg-ink text-ivory hover:bg-deep-teal`}>
              View the case study
              <span className={`${ctaIconClass} bg-accent text-ink`}>
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
            <Link
              to="/media-house"
              className={`${ctaClass} border border-ink/25 text-ink hover:border-ink`}
            >
              See our work
              <span className={`${ctaIconClass} bg-ink/10`}>
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** "We hold expertise in world-class marketing strategies" — how a project runs. */
export function AboutExpertise() {
  return (
    <section
      aria-labelledby="about-expertise-title"
      className="relative px-6 pb-24 md:px-14 md:pb-32 lg:px-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <Reveal>
            <Eyebrow>Our expertise</Eyebrow>
            <h2
              id="about-expertise-title"
              className="text-teal-gradient mt-5 text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ fontStretch: "108%" }}
            >
              We hold expertise in{" "}
              <span
                className="font-serif font-normal italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                world-class
              </span>{" "}
              marketing strategies.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg">
              Strategy, creative, ads and technology from one team, run as one plan, so every move
              builds on the last.
            </p>
          </Reveal>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {aboutProcess.map((item, index) => (
            <Reveal key={item.step} delay={index * 90}>
              <li
                className={
                  index === 0
                    ? "flex h-full flex-col rounded-[1.5rem] bg-ink p-7 text-ivory md:p-8"
                    : "flex h-full flex-col rounded-[1.5rem] bg-card p-7 text-ink ring-1 ring-ink/10 md:p-8"
                }
              >
                <span
                  className={
                    index === 0
                      ? "font-mono text-[11px] tracking-[0.25em] text-accent"
                      : "font-mono text-[11px] tracking-[0.25em] text-deep-teal"
                  }
                >
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-3xl leading-none" style={{ fontStretch: "105%" }}>
                  {item.step}
                </h3>
                <p
                  className={
                    index === 0
                      ? "mt-4 text-base leading-relaxed text-ivory/85"
                      : "mt-4 text-base font-medium leading-relaxed text-ink"
                  }
                >
                  {item.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Mission and vision (plus our promise and values), near the end of the page. */
export function AboutMission() {
  return (
    <section
      aria-labelledby="about-mission-title"
      className="relative px-6 pb-24 md:px-14 md:pb-32 lg:px-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <Eyebrow>Mission &amp; vision</Eyebrow>
          <h2 id="about-mission-title" className="sr-only">
            Our mission and vision
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {aboutPillars.map((pillar, index) => (
            <Reveal key={pillar.label} delay={index * 90}>
              <article
                className={
                  index === 1
                    ? "flex h-full flex-col rounded-[1.75rem] bg-ink p-7 text-ivory md:p-9"
                    : "flex h-full flex-col rounded-[1.75rem] bg-card p-7 text-ink ring-1 ring-ink/10 md:p-9"
                }
              >
                <p
                  className={
                    index === 1
                      ? "font-mono text-[11px] uppercase tracking-[0.25em] text-accent"
                      : "font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal"
                  }
                >
                  {pillar.label}
                </p>
                <h3
                  className="mt-6 text-2xl leading-[1.05] md:text-3xl"
                  style={{ fontStretch: "105%" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className={
                    index === 1
                      ? "mt-5 text-base leading-relaxed text-ivory/90"
                      : "mt-5 text-base font-medium leading-relaxed text-ink"
                  }
                >
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal">
            What we stand for
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {aboutValues.map((value) => (
              <li
                key={value}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2.5 text-base font-semibold"
              >
                <Star className="size-3.5 fill-glow text-glow" strokeWidth={0} />
                {value}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Closes the About page: one line and the way to the contact page. */
export function AboutConnect() {
  return (
    <section className="px-4 pb-24 sm:px-6 md:px-14 md:pb-32 lg:px-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-ink px-6 py-16 text-center text-ivory sm:rounded-[2.5rem] sm:px-8 md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>
          <h2
            className="relative mx-auto max-w-4xl text-balance text-[clamp(2.2rem,7vw,5rem)] leading-[1]"
            style={{ fontStretch: "105%" }}
          >
            Let’s connect to make something{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-accent"
              style={{ fontStretch: "100%" }}
            >
              outstanding
            </span>{" "}
            for you.
          </h2>
          <Link
            to="/contact"
            className={`${ctaClass} relative mt-10 bg-accent text-ink hover:bg-glow`}
          >
            Connect with us
            <span className={`${ctaIconClass} bg-ink text-accent`}>
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
