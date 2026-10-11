import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Brain, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { problemSolutions } from "./content";
import { useExperience } from "./experience";
import { Reveal } from "./primitives";
import { logoCropSlugs, servicePath, serviceVideo } from "./service-links";
import { toneOf } from "./service-orbit";

type Service = (typeof problemSolutions)[number];

const pillClass =
  "group inline-flex h-14 items-center gap-4 rounded-full pl-7 pr-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive";
const pillIconClass =
  "grid size-10 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45";

function ServicesHeader() {
  const { scrollTo } = useExperience();
  return (
    <header
      id="top"
      className="relative overflow-hidden px-6 pb-12 pt-32 md:px-14 md:pb-24 md:pt-44 lg:px-20"
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
            className="text-teal-gradient mt-6 max-w-5xl text-[clamp(2.6rem,7.2vw,7rem)] leading-[0.92] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            We’re here to help your business{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              grow and thrive.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-ink sm:mt-8 sm:text-lg md:text-xl">
            Every service we offer has one goal: your growth. Start with what you need today and add
            more as you scale. Together, they work even better.
          </p>
        </Reveal>

        {/* The people behind every service. */}
        <Reveal delay={200}>
          <p className="mt-8 flex max-w-2xl items-start gap-4 rounded-[1.25rem] bg-ink px-5 py-4 text-ivory sm:items-center sm:px-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-ink">
              <Brain className="size-5" strokeWidth={1.8} />
            </span>
            <span className="text-base font-medium leading-snug">
              <strong className="font-semibold text-accent">Real thinking brains behind it.</strong>{" "}
              Strategists, creators and engineers who treat your growth like their own.
            </span>
          </p>
        </Reveal>

        {/* Jump links to each service below, all visible at once (wrapping onto
            a few lines on phones). */}
        <Reveal delay={240}>
          <nav
            aria-label="Services on this page"
            className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-2.5"
          >
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
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 bg-white/70 py-1 pl-1 pr-3 text-[13px] font-bold sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-4 sm:text-sm text-ink backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
                >
                  <span
                    className="grid size-6 place-items-center rounded-full sm:size-7"
                    style={{ background: toneOf(index).bg, color: toneOf(index).fg }}
                  >
                    <Icon className="size-3 sm:size-3.5" strokeWidth={2} />
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

/** One service: its film beside a bold promise, what's included and what it delivers. */
function ServiceSection({ service, index }: { service: Service; index: number }) {
  const colors = toneOf(index);
  const Icon = service.icon;
  const flipped = index % 2 === 1;
  const video = serviceVideo(service.slug);

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      // Top padding clears the fixed nav bar when a section is jumped to.
      className="scroll-mt-28 border-t border-ink/10 px-6 pb-16 pt-24 md:px-14 md:py-28 lg:px-20"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn("lg:sticky lg:top-28", flipped && "lg:order-2")}>
          <div className="relative min-h-[17rem] overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_40px_90px_-45px_rgba(0,40,40,0.6)] sm:min-h-[22rem] sm:rounded-[2rem] md:min-h-[28rem]">
            <video
              src={`${video}.mp4`}
              poster={`${video}.jpg`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              // Zoom in from the top-left so a watermark in the bottom-right is
              // pushed outside the box and clipped by `overflow-hidden`.
              className={cn(
                "absolute inset-0 size-full object-cover",
                logoCropSlugs.includes(service.slug) && "origin-top-left scale-[1.15]",
              )}
            />
            {/* The service's name, stamped on the film. */}
            <span
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-bold shadow-lg sm:bottom-6 sm:left-6"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <span className="grid size-7 place-items-center rounded-full bg-white/90 text-ink">
                <Icon className="size-3.5" strokeWidth={2} />
              </span>
              {service.service}
            </span>
          </div>
        </Reveal>

        <Reveal delay={120} className={cn(flipped && "lg:order-1")}>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal">
            {String(index + 1).padStart(2, "0")} · {service.service}
          </p>
          <h2
            id={`${service.slug}-title`}
            className="mt-4 font-display text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink"
            style={{ fontStretch: "108%" }}
          >
            {service.headline}
          </h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-ink sm:mt-6 sm:text-xl">
            {service.serve}
          </p>

          <p className="mt-6 flex max-w-xl items-start gap-3 border-l-2 border-accent pl-4 text-[15px] font-medium leading-relaxed text-ink/80 sm:text-base">
            <Brain className="mt-0.5 size-5 shrink-0 text-deep-teal" strokeWidth={1.8} />
            {service.brains}
          </p>

          <h3 className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal sm:mt-10">
            What’s included
          </h3>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:mt-5 sm:grid-cols-2 sm:gap-y-3.5">
            {service.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] font-semibold leading-snug text-ink sm:text-base"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-deep-teal sm:mt-10">
            What you get
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
            {service.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink sm:px-4 sm:py-2 sm:text-sm"
              >
                {outcome}
              </li>
            ))}
          </ul>

          {/* Full-width on phones for an easy thumb tap. Every service opens its
              own page (MediaHouse with all the reels). */}
          <Link
            to={servicePath(service.slug)}
            className="group mt-8 flex h-14 w-full items-center justify-between gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow sm:mt-10 sm:inline-flex sm:w-auto sm:justify-start"
          >
            Explore {service.service}
            <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/** Who's behind the services, and how we think. */
function ServicesKnowUs() {
  return (
    <section className="border-t border-ink/10 px-6 py-20 md:px-14 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
        <Reveal>
          <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
            <span className="h-px w-8 bg-current" />
            Behind the work
          </p>
          <h2
            className="text-teal-gradient mt-5 text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            Know the people and the{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              thinking
            </span>{" "}
            behind it.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg">
            Every service runs on the same strategy and the same team. See who we are and how we
            plan your growth.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/about" className={cn(pillClass, "bg-ink text-ivory hover:bg-deep-teal")}>
              Know more about us
              <span className={cn(pillIconClass, "bg-accent text-ink")}>
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
            <Link
              to="/tdm-mindset"
              className={cn(pillClass, "border border-ink/25 text-ink hover:border-ink")}
            >
              Our marketing strategies
              <span className={cn(pillIconClass, "bg-ink/10")}>
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesCta() {
  return (
    <section className="px-4 pb-24 pt-4 sm:px-6 md:px-14 md:pb-32 md:pt-8 lg:px-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center text-ivory sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>
          <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Let’s connect
          </p>
          <h2
            className="relative mx-auto mt-5 max-w-3xl text-balance text-[clamp(2rem,8.5vw,2.25rem)] leading-[1] sm:mt-6 md:text-6xl"
            style={{ fontStretch: "105%" }}
          >
            Tell us your goal. We’ll build the{" "}
            <span
              className="font-serif font-normal italic tracking-normal text-glow"
              style={{ fontStretch: "100%" }}
            >
              plan.
            </span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-ivory/80 sm:text-lg">
            Not sure which service fits? Talk to us. We’ll listen first, then show you the simplest
            way to grow.
          </p>
          <Link
            to="/contact"
            className={cn(pillClass, "relative mt-10 bg-accent text-ink hover:bg-glow")}
          >
            Contact us
            <span className={cn(pillIconClass, "bg-ink text-accent")}>
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
      <ServicesKnowUs />
      <ServicesCta />
    </>
  );
}
