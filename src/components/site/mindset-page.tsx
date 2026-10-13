import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import butterflyImage from "@/assets/mindset-butterfly.jpg";
import purpleCowImage from "@/assets/mindset-purple-cow.jpg";
import tdmEffectImage from "@/assets/mindset-tdm-effect.jpg";
import { cn } from "@/lib/utils";

import { companyStats, formatStat } from "./company-stats";
import { problemSolutions } from "./content";
import { useExperience } from "./experience";
import { Corners, Reveal } from "./primitives";
import { servicePath } from "./service-links";

// The three ideas behind how TDM works, in reading order.
const chapters = [
  { id: "purple-cow", number: "01", label: "The Purple Cow Effect" },
  { id: "butterfly", number: "02", label: "The Butterfly Effect" },
  { id: "tdm-effect", number: "03", label: "The TDM Effect" },
];

// The Butterfly Effect: one small fix at each step of the customer journey.
const smallChanges = [
  {
    stage: "First look",
    change: "A sharper opening line",
    gain: "earns one more second of attention.",
  },
  { stage: "Reach", change: "A better-targeted ad", gain: "finds people who actually care." },
  { stage: "Visit", change: "A faster landing page", gain: "makes the next step feel easy." },
  { stage: "Follow-up", change: "A CRM reminder on time", gain: "brings a buyer one step closer." },
];

// The TDM Effect: the six steps every project moves through.
const steps = [
  {
    title: "Understand",
    body: "We study your business, product, competitors and customers to find the opportunity others miss.",
  },
  {
    title: "Strategise",
    body: "We shape the message, the offer and the creative idea around what makes your audience act.",
  },
  {
    title: "Create",
    body: "Ad reels, creatives, graphics and websites, made with human creativity, data and AI tools.",
  },
  {
    title: "Convert",
    body: "Targeted campaigns and a smooth customer journey turn attention into leads, and leads into customers.",
  },
  {
    title: "Automate",
    body: "CRM, ERP, AI agents and custom apps keep follow-ups on time and take busywork off your team.",
  },
  {
    title: "Scale",
    body: "We measure, learn and improve every month, so your marketing grows as fast as your business.",
  },
];

/** A bold colour accent inside a display heading, as on every other page. */
function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-extrabold text-glow", className)} style={{ fontStretch: "100%" }}>
      {children}
    </span>
  );
}

function MindsetHeader() {
  const { scrollTo } = useExperience();
  return (
    <header
      id="top"
      className="relative overflow-hidden px-6 pb-16 pt-32 md:px-14 md:pb-24 md:pt-44 lg:px-20"
    >
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
            <span className="h-px w-8 bg-current" />
            The TDM mindset
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="text-teal-gradient mt-5 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight tracking-[-0.01em]"
            style={{ fontStretch: "105%" }}
          >
            Three ideas behind every <Accent>win.</Accent>
          </h1>
        </Reveal>

        {/* The page's promise, set as the big pull quote. */}
        <Reveal delay={160}>
          <figure className="relative mt-10 max-w-5xl md:mt-14">
            <blockquote
              className="relative font-display text-[clamp(1.75rem,4.2vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink"
              style={{ fontStretch: "105%" }}
            >
              <p>
                <span className="text-glow">“</span>Every business has a different problem. We find
                the insight, build the strategy, create the campaign and set up the systems that
                make growth real. <Accent className="text-deep-teal">Here’s how we think.</Accent>
                <span className="text-glow">”</span>
              </p>
            </blockquote>
          </figure>
        </Reveal>

        <Reveal delay={220}>
          <nav aria-label="Ideas on this page" className="mt-10 grid gap-3 sm:grid-cols-3">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(`#${chapter.id}`);
                }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-ink/15 bg-white/70 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-deep-teal">{chapter.number}</span>
                  <span className="text-base font-bold text-ink">{chapter.label}</span>
                </span>
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            ))}
          </nav>
        </Reveal>
      </div>
    </header>
  );
}

/** One idea: the picture on one side, the story on the other. */
function Chapter({
  id,
  number,
  title,
  kicker,
  image,
  imageAlt,
  caption,
  flipped = false,
  children,
}: {
  id: string;
  number: string;
  title: string;
  kicker: string;
  image: string;
  imageAlt: string;
  caption: string;
  flipped?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 border-t border-ink/10 px-6 py-20 md:px-14 md:py-28 lg:px-20"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn("lg:sticky lg:top-28", flipped && "lg:order-2")}>
          <figure>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_40px_90px_-45px_rgba(0,40,40,0.6)] sm:rounded-[2rem]">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <Corners className="inset-3 text-white/70 sm:inset-4" />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-deep-teal">
              <span className="h-px w-8 bg-current opacity-60" />
              {caption}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={120} className={cn(flipped && "lg:order-1")}>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
            Idea {number}
          </p>
          <h2
            id={`${id}-title`}
            className="text-teal-gradient mt-4 text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            {title}
          </h2>
          <p className="mt-4 font-display font-bold text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight text-ink">
            {kicker}
          </p>
          <div className="mt-8 space-y-5 text-base font-medium leading-relaxed text-ink sm:text-lg">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PurpleCow() {
  return (
    <Chapter
      id="purple-cow"
      number="01"
      title="The Purple Cow Effect"
      kicker="Be the brand people remember."
      image={purpleCowImage}
      imageAlt="A herd of brown cows with one bright purple cow in the middle"
      caption="Same field. Only one gets noticed."
    >
      <p>
        Drive past a field of brown cows and you won’t look twice. Spot a purple one and you’ll talk
        about it for days. That’s Seth Godin’s Purple Cow idea: when every option looks the same,
        the remarkable one wins.
      </p>
      <div className="rounded-[1.5rem] bg-card p-6 ring-1 ring-ink/10 md:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-deep-teal">
          A quick example
        </p>
        <p className="mt-3">
          Two builders sell similar homes: same kind of location, same amenities, similar prices.
          Both post photos. Both run ads.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <p className="rounded-2xl border border-ink/15 px-4 py-3 text-[15px]">
            <span className="block font-bold">Builder A</span>
            Shows rooms and a price list. Blends into the feed.
          </p>
          <p className="rounded-2xl bg-ink px-4 py-3 text-[15px] text-ivory">
            <span className="block font-bold text-accent">Builder B</span>
            Tells the story of the life you’ll live there. Gets remembered.
          </p>
        </div>
        <p className="mt-5 font-semibold">
          Same category. Different feeling. A very different result.
        </p>
      </div>
      <p>
        That’s our job. We dig into your product, find what makes it truly valuable, learn what your
        customers care about, and turn it into a campaign nobody else could run. The idea, the
        story, the visuals and the journey that make people stop.
      </p>
      <p className="border-l-2 border-glow pl-5 font-display text-xl font-bold leading-snug sm:text-2xl">
        The question we always start with: what makes your business worth noticing?
      </p>
    </Chapter>
  );
}

function Butterfly() {
  return (
    <Chapter
      id="butterfly"
      number="02"
      title="The Butterfly Effect"
      kicker="Small changes. Big results."
      image={butterflyImage}
      imageAlt="A white butterfly resting on a small flower bud, lit from behind"
      caption="Tiny wings. Big ripples."
      flipped
    >
      <p>
        In science, the butterfly effect says a tiny change at the start can lead to a huge
        difference later. In business, it works the same way. Growth rarely comes from one big move.
        It comes from many small ones that add up.
      </p>
      <ol className="relative space-y-3">
        {smallChanges.map((item, index) => (
          <li
            key={item.stage}
            className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 sm:px-5"
          >
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] font-bold text-accent">
              {index + 1}
            </span>
            <p className="text-[15px] leading-snug sm:text-base">
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-deep-teal">
                {item.stage}
              </span>
              <span className="font-bold">{item.change}</span> {item.gain}
            </p>
          </li>
        ))}
      </ol>
      <p>
        We look for these moments everywhere, from the first impression to the final sale. We test
        ideas, read the numbers, smooth out the experience and connect your marketing to the systems
        behind your sales.
      </p>
      <p className="border-l-2 border-glow pl-5 font-display text-xl font-bold leading-snug sm:text-2xl">
        Sometimes the biggest jump starts with the smallest detail.
      </p>
    </Chapter>
  );
}

function TdmEffect() {
  return (
    <Chapter
      id="tdm-effect"
      number="03"
      title="The TDM Effect"
      kicker="Business sense, creativity and technology, working as one."
      image={tdmEffectImage}
      imageAlt="A man facing three big screens labelled Concept, Creation and Conversion"
      caption="Concept. Creation. Conversion."
    >
      <p>
        Your business has a story. Your product has a purpose. Your customers have a reason to
        choose you. We find the link between all three, and turn it into growth.
      </p>
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl bg-card p-5 ring-1 ring-ink/10">
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-deep-teal">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-bold" style={{ fontStretch: "105%" }}>
                {step.title}
              </span>
            </p>
            <p className="mt-2 text-[15px] leading-snug">{step.body}</p>
          </li>
        ))}
      </ol>
      <p>
        Strategy, creativity, marketing and technology, all in one connected system. No handovers
        between agencies, no gaps where leads get lost.
      </p>
      <p className="border-l-2 border-glow pl-5 font-display text-xl font-bold leading-snug sm:text-2xl">
        You bring the ambition. We bring the thinking, the creativity and the tech to take it
        further. That’s the TDM Effect.
      </p>
    </Chapter>
  );
}

/** What the three ideas add up to, in confirmed numbers. */
function Results() {
  return (
    <section
      aria-labelledby="results-title"
      className="border-t border-ink/10 px-6 py-20 md:px-14 md:py-28 lg:px-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <Reveal>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
              The result
            </p>
            <h2
              id="results-title"
              className="text-teal-gradient mt-4 text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ fontStretch: "108%" }}
            >
              When the thinking is right, the numbers <Accent>follow.</Accent>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg">
              Stand out, sharpen every small step, connect it all. Here’s what that has added up to
              for the businesses we work with.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <dl className="mt-12 grid grid-cols-2 gap-3 md:mt-16 lg:grid-cols-4 lg:gap-4">
            {companyStats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col justify-between rounded-[1.5rem] p-6 md:p-8",
                  index === 0 ? "bg-ink text-ivory" : "bg-card text-ink ring-1 ring-ink/10",
                )}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd
                  className={cn(
                    "whitespace-nowrap font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-none tracking-[-0.04em]",
                    index === 0 && "text-accent",
                  )}
                >
                  {formatStat(stat)}
                </dd>
                <dd
                  className={cn(
                    "mt-6 text-sm font-medium leading-snug md:text-base",
                    index === 0 ? "text-ivory/80" : "text-ink/70",
                  )}
                >
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/** Close the page: hire us, or browse the services first. */
function MindsetCta() {
  return (
    <section className="px-4 pb-24 pt-4 sm:px-6 md:px-14 md:pb-32 md:pt-8 lg:px-20">
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center text-ivory sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>
          <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Ready to be the purple cow?
          </p>
          <h2
            className="relative mx-auto mt-5 max-w-4xl text-balance text-[clamp(2.2rem,8.5vw,2.5rem)] leading-[1] sm:mt-6 md:text-7xl"
            style={{ fontStretch: "105%" }}
          >
            Hire our brain for your <Accent>growth.</Accent>
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-ivory/80 sm:text-lg">
            Tell us where you want your business to be. We’ll bring the ideas, the creative and the
            systems to get you there.
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink transition-colors hover:bg-glow sm:w-auto"
            >
              Hire our brain
              <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
            <Link
              to="/services"
              className="group inline-flex h-14 w-full items-center justify-between gap-4 rounded-full border border-ivory/25 pl-7 pr-2 text-base font-semibold text-ivory transition-colors hover:border-ivory sm:w-auto"
            >
              Explore our services
              <span className="grid size-10 place-items-center rounded-full bg-ivory/10 transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>

          <div className="relative mt-12 border-t border-ivory/15 pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/60">
              Or jump straight to a service
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {problemSolutions.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.slug}>
                    <Link
                      to={servicePath(service.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-2 text-sm font-semibold text-ivory transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon className="size-3.5" />
                      {service.service}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** The TDM Mindset page: Purple Cow, Butterfly and TDM effects, then results. */
export function MindsetPage() {
  return (
    <>
      <MindsetHeader />
      <PurpleCow />
      <Butterfly />
      <TdmEffect />
      <Results />
      <MindsetCta />
    </>
  );
}
