import {
  ArrowUpRight,
  Brain,
  Database,
  LayoutGrid,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";

import { Reveal } from "./primitives";

type CloudCard = { icon: typeof Brain; tag: string; title: string; text: string };

// What Meta's ad AI (sold mostly as "Advantage+") does, in plain words.
const metaAi: CloudCard[] = [
  {
    icon: Users,
    tag: "Advantage+ audience",
    title: "Finds the buyers",
    text: "Instead of hand-picked interests, Meta’s AI looks for the people most likely to act — your targeting becomes a hint, not a wall.",
  },
  {
    icon: LayoutGrid,
    tag: "Advantage+ placements",
    title: "Picks the spot",
    text: "Feeds, Stories, Reels, Messenger — the budget flows to wherever results are cheapest that day.",
  },
  {
    icon: Sparkles,
    tag: "Generative AI creative",
    title: "Makes variations",
    text: "New headlines and text, extended backgrounds, resized images and short animations — many versions tested at once.",
  },
  {
    icon: Target,
    tag: "Advantage+ campaigns",
    title: "Runs the campaign",
    text: "One AI-led campaign balances audience, placements, budget and creative together, for sales or leads.",
  },
  {
    icon: Brain,
    tag: "Smart delivery",
    title: "Predicts every view",
    text: "For each person and each ad, it predicts the chance of a click, lead or sale — and bids for the best ones.",
  },
  {
    icon: Database,
    tag: "What we add",
    title: "Feeds it real results",
    text: "AI is only as smart as its data. We wire the Pixel, Conversions API and CRM so it learns from real customers, not cheap clicks.",
  },
];

// Soft clouds drifting behind the cards: [left, top, size, delay, duration].
const clouds: [string, string, string, string, string][] = [
  ["-8%", "6%", "34rem", "0s", "38s"],
  ["55%", "-4%", "30rem", "-12s", "44s"],
  ["20%", "48%", "38rem", "-20s", "50s"],
  ["70%", "60%", "28rem", "-6s", "40s"],
];

const adLibraryUrl = (query: string) =>
  `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=IN&media_type=all&search_type=keyword_unordered&q=${encodeURIComponent(query)}`;

/**
 * Meta Ads AI, explained on floating "cloud" cards, plus a search box that
 * opens Meta's public Ad Library for any brand or keyword.
 */
export function MetaAiSection() {
  const [query, setQuery] = useState("");

  const search = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (term) window.open(adLibraryUrl(term), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="meta-ai"
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-accent/45 via-secondary to-ivory px-6 py-24 md:px-14 md:py-32 lg:px-20"
    >
      {/* Drifting clouds */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Each cloud is three soft puffs: a wide base and two domes on top. */}
        {clouds.map(([left, top, size, delay, duration]) => (
          <span
            key={left + top}
            className="cloud-drift absolute blur-xl"
            style={{
              left,
              top,
              width: size,
              height: `calc(${size} * 0.5)`,
              animationDelay: delay,
              animationDuration: duration,
            }}
          >
            <span className="absolute inset-x-0 bottom-0 h-1/2 rounded-full bg-white/90" />
            <span className="absolute bottom-[25%] left-[14%] aspect-square w-[38%] rounded-full bg-white/90" />
            <span className="absolute bottom-[22%] left-[42%] aspect-square w-[46%] rounded-full bg-white/90" />
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-12">
          <Reveal>
            <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
              <span className="h-px w-8 bg-current" />
              Meta ads AI
            </p>
            <h2
              data-split
              className="text-teal-gradient mt-5 text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]"
              style={{ fontStretch: "105%" }}
            >
              Facebook’s AI does the heavy lifting.{" "}
              <span
                className="font-serif font-normal italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                We steer it.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-lg text-base font-medium leading-relaxed text-ink sm:text-lg">
              Meta’s Advantage+ AI now decides much of who sees an ad, where and in what form. Used
              well, it lowers your cost per lead. Used blindly, it chases cheap clicks. Here’s what
              it does — and where we come in.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {metaAi.map(({ icon: Icon, tag, title, text }, index) => (
            <li key={tag}>
              <Reveal delay={(index % 3) * 90} className="h-full">
                <div
                  className={cn(
                    "cloud-float h-full rounded-[2.25rem] border border-white/80 bg-white/60 p-7 shadow-[0_30px_60px_-34px_rgba(0,60,60,0.45)] backdrop-blur-xl md:p-8",
                    index === metaAi.length - 1 && "bg-ink/90 text-ivory",
                  )}
                  style={{ animationDelay: `${-index * 1.3}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full",
                        index === metaAi.length - 1 ? "bg-glow text-ink" : "bg-accent text-ink",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <p
                      className={cn(
                        "font-mono text-[10px] font-medium uppercase tracking-[0.22em]",
                        index === metaAi.length - 1 ? "text-accent" : "text-deep-teal",
                      )}
                    >
                      {tag}
                    </p>
                  </div>
                  <h3
                    className="mt-6 font-display text-2xl font-bold leading-tight"
                    style={{ fontStretch: "105%" }}
                  >
                    {title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 text-[15px] font-medium leading-relaxed",
                      index === metaAi.length - 1 ? "text-ivory/80" : "text-ink/80",
                    )}
                  >
                    {text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Ad Library search */}
        <Reveal className="mt-14 md:mt-20">
          <div className="cloud-float relative mx-auto max-w-4xl rounded-[2.5rem] border border-white/80 bg-white/70 p-7 text-center shadow-[0_40px_80px_-40px_rgba(0,60,60,0.5)] backdrop-blur-xl md:p-12">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
              Meta Ad Library · free & public
            </p>
            <h3
              className="mx-auto mt-4 max-w-2xl text-balance font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-bold leading-[1.05]"
              style={{ fontStretch: "105%" }}
            >
              See every ad any brand is running — right now.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-ink/75">
              Facebook’s Ad Library shows all active ads on Facebook and Instagram: the creative,
              the text and how long each one has run. Long-running ads are usually the ones that
              work. Try a competitor:
            </p>
            <form
              onSubmit={search}
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-ink/15 bg-white p-1.5 pl-5 shadow-sm focus-within:border-deep-teal"
            >
              <Search className="size-5 shrink-0 text-deep-teal" />
              <label htmlFor="ad-library-query" className="sr-only">
                Brand or keyword
              </label>
              <input
                id="ad-library-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Godrej Properties, dental clinic…"
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink/45"
              />
              <button
                type="submit"
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-ink transition-colors hover:bg-glow"
              >
                Search ads
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
              </button>
            </form>
            <p className="mt-4 text-xs font-medium text-ink/55">
              Opens Meta’s Ad Library (India) in a new tab. We use it for every client’s competitor
              audit.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
