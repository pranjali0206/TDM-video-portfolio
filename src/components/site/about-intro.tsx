import { ArrowDown, Star } from "lucide-react";

import { aboutPillars, aboutValues, clients, images } from "./content";
import { Corners, Reveal } from "./primitives";

/**
 * The About-us opener: who TDM Groups is and what drives the company —
 * before the "What's up" bento board.
 */
export function AboutIntro() {
  return (
    <section
      id="top"
      aria-labelledby="about-intro-title"
      className="relative overflow-hidden px-6 pb-24 pt-36 md:px-14 md:pb-32 md:pt-44 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -right-[8%] top-[6%] size-[28rem] bg-accent/35" />
        <div className="orb -left-[10%] top-[40%] size-[24rem] bg-teal/45 [animation-delay:-9s]" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* ── Who we are ─────────────────────────────────────────────── */}
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-deep-teal">
                <span className="h-px w-8 bg-current" />
                About TDM Groups
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1
                id="about-intro-title"
                className="text-teal-gradient mt-6 text-[clamp(2.6rem,7.4vw,7.2rem)] leading-[0.92] tracking-[-0.02em]"
                style={{ fontStretch: "108%" }}
              >
                Where clicks
                <br />
                become{" "}
                <span
                  className="font-serif font-normal italic tracking-normal text-glow"
                  style={{ fontStretch: "100%" }}
                >
                  growth.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed font-medium text-ink md:text-xl">
                TDM Groups is an AI-powered business consulting company. We give you the tools to
                automate your operations and grow your sales — pairing deep market understanding
                with sharp strategy to find what works and take it to its optimal level.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <a
                href="#whats-up"
                className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink transition-colors hover:text-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
              >
                <span className="grid size-9 place-items-center rounded-full border border-ink/20">
                  <ArrowDown className="size-4" />
                </span>
                See what we’re up to
              </a>
            </Reveal>
          </div>

          {/* Image stack — frames from the edit bay. */}
          <Reveal delay={200}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <div className="absolute inset-y-0 left-0 w-[72%] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgba(0,40,40,0.6)]">
                <img
                  src={images.events}
                  alt="A TDM Groups brand launch event"
                  loading="lazy"
                  className="size-full object-cover"
                />
                <Corners className="text-white/70" />
              </div>
              <div className="absolute bottom-[8%] right-0 w-[48%] -rotate-3 overflow-hidden rounded-[1.25rem] ring-4 ring-background shadow-[0_30px_60px_-30px_rgba(0,40,40,0.6)]">
                <img
                  src={images.branding}
                  alt="Brand identity work in progress"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute right-[4%] top-[8%] rotate-6 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory shadow-lg">
                Marketing · Tech · Growth
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Mission / vision / promise ─────────────────────────────── */}
        <div className="mt-24 grid gap-6 md:mt-32 md:grid-cols-3">
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
                <h2
                  className="mt-6 text-2xl leading-[1.05] md:text-3xl"
                  style={{ fontStretch: "105%" }}
                >
                  {pillar.title}
                </h2>
                <p
                  className={
                    index === 1
                      ? "mt-5 text-base leading-relaxed text-ivory/90"
                      : "mt-5 text-base leading-relaxed font-medium text-ink"
                  }
                >
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** What TDM stands for and who trusts us — closes the About page. */
export function AboutValues() {
  return (
    <section
      aria-label="What we stand for"
      className="relative px-6 pb-28 md:px-14 md:pb-36 lg:px-20"
    >
      <div className="relative mx-auto max-w-[1400px]">
        {/* ── What we stand for + who trusts us ──────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal">
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

          <Reveal delay={120}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal">
              Trusted by
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {clients.map((client) => (
                <li
                  key={client}
                  className="border-t border-ink/15 pt-4 font-display text-lg font-bold leading-tight text-ink"
                  style={{ fontStretch: "105%" }}
                >
                  {client.replace(/\.$/, "")}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
