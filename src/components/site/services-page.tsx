import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { problemSolutions } from "./content";
import { useExperience } from "./experience";
import { Corners, Reveal } from "./primitives";
import { markOf, toneOf } from "./service-orbit";

type Service = (typeof problemSolutions)[number];

function ServicesHeader() {
  const { scrollTo } = useExperience();
  return (
    <header
      id="top"
      className="relative overflow-hidden px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44 lg:px-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-[8%] top-[10%] size-[26rem] bg-accent/45" />
        <div className="orb -right-[6%] top-0 size-[24rem] bg-teal/55 [animation-delay:-6s]" />
        <div className="orb left-[45%] top-[45%] size-[18rem] bg-glow/20 [animation-delay:-12s]" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
            <span className="h-px w-8 bg-current" />
            Our services
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="mt-6 max-w-5xl text-[clamp(2.6rem,7.2vw,7rem)] leading-[0.92] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            Everything your business needs to{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              grow.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-ink md:text-xl">
            Creative, marketing and technology under one roof — from the content that wins attention
            to the systems that turn it into sales. Pick a service to see exactly what’s included.
          </p>
        </Reveal>

        {/* Jump links to each service below. */}
        <Reveal delay={220}>
          <nav aria-label="Services on this page" className="mt-10 flex flex-wrap gap-2.5">
            {problemSolutions.map((service, index) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.slug}
                  href={`#${service.slug}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollTo(`#${service.slug}`);
                    window.history.replaceState(null, "", `#${service.slug}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 py-1.5 pl-1.5 pr-4 text-sm font-bold text-ink backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
                >
                  <span
                    className="grid size-7 place-items-center rounded-full"
                    style={{ background: toneOf(index).bg, color: toneOf(index).fg }}
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                  </span>
                  {service.service}
                </a>
              );
            })}
          </nav>
        </Reveal>
      </div>
    </header>
  );
}

/** One service: a coloured title card beside what's included and what it delivers. */
function ServiceSection({ service, index }: { service: Service; index: number }) {
  const colors = toneOf(index);
  const Icon = service.icon;
  const flipped = index % 2 === 1;

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="scroll-mt-28 border-t border-ink/10 px-6 py-20 md:px-14 md:py-28 lg:px-20"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn(flipped && "lg:order-2")}>
          <div
            className="relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2rem] p-8 shadow-[0_40px_90px_-45px_rgba(0,40,40,0.6)] md:min-h-[26rem] md:p-12"
            style={{ background: colors.bg, color: colors.fg }}
          >
            <Corners className="inset-4 text-current opacity-40" size="size-4" />
            <div className="relative flex items-center justify-between gap-4">
              <span className="grid size-16 -rotate-6 place-items-center rounded-2xl bg-white/90 text-ink shadow-lg">
                <Icon className="size-7" strokeWidth={1.8} />
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em]">
                {service.tagline}
              </span>
            </div>
            <h2
              id={`${service.slug}-title`}
              className="relative mt-auto pt-12 font-display text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.02em]"
              style={{ fontStretch: "110%" }}
            >
              {service.service}
            </h2>
            <p className="relative mt-5 max-w-md text-lg font-semibold leading-snug md:text-xl">
              {service.question}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className={cn(flipped && "lg:order-1")}>
          <p
            className="font-display text-2xl font-bold leading-snug md:text-3xl"
            style={{ fontStretch: "105%" }}
          >
            <span className="relative isolate">
              <span
                aria-hidden="true"
                className="absolute inset-x-[-0.06em] bottom-[0.06em] -z-10 h-[0.32em] -rotate-1 rounded-sm"
                style={{ background: markOf(index) }}
              />
              {service.answer}
            </span>
          </p>
          <p className="mt-6 text-lg font-medium leading-relaxed text-ink">{service.summary}</p>

          <h3 className="mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal">
            What’s included
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base font-semibold text-ink">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal">
            What you get
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {service.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-bold text-ink"
              >
                {outcome}
              </li>
            ))}
          </ul>

          <Link
            to="/"
            hash="contact"
            className="group mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow"
          >
            Start with {service.service}
            <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesCta() {
  return (
    <section className="px-6 pb-32 pt-8 md:px-14 lg:px-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center text-ivory md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>
          <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Not sure where to start?
          </p>
          <h2
            className="relative mx-auto mt-6 max-w-3xl text-4xl leading-[0.95] md:text-6xl"
            style={{ fontStretch: "105%" }}
          >
            Tell us the goal. We’ll build the{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              plan.
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

/** The Services page: every service in full, each anchored at its slug. */
export function ServicesPage() {
  return (
    <>
      <ServicesHeader />
      {problemSolutions.map((service, index) => (
        <ServiceSection key={service.slug} service={service} index={index} />
      ))}
      <ServicesCta />
    </>
  );
}
