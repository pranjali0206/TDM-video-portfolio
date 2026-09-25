import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import {
  ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Bug, Building2, Camera,
  Check, Clapperboard, Cpu, Factory, Film, Gem, GraduationCap, Hammer,
  HeartPulse, House, Leaf, Lightbulb, LoaderCircle, MessageCircle, Package,
  Palette, Play, Scale, Search, ShoppingBag, Smile, Smartphone, Sparkles,
  Stethoscope, Store, Sun, Target, Utensils, Video, WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateCampaignCopy } from "@/lib/campaign-copy.functions";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroFitness from "@/assets/hero-fitness.jpg";
import heroHospitality from "@/assets/hero-hospitality.jpg";
import heroProduct from "@/assets/hero-product.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Framehaus — Digital campaigns built to move" },
      { name: "description", content: "Bold digital marketing, campaign creative, and performance-led video for ambitious brands." },
      { property: "og:title", content: "Framehaus — Digital campaigns built to move" },
      { property: "og:description", content: "Bold digital marketing and performance-led creative for ambitious brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const heroFrames = [
  { image: heroFashion, caption: "Folio — Brand demand, built in motion" },
  { image: heroProduct, caption: "Aster — Product stories that sell" },
  { image: heroHospitality, caption: "Mesa — Social content with momentum" },
  { image: heroFitness, caption: "Pace — Performance creative that lands" },
];

const categories = [
  { title: "Stop the scroll", description: "Paid creative engineered to win attention before the thumb moves on.", icon: Smartphone, videos: ["Performance cut", "Creator concept", "Product hook"] },
  { title: "Build the belief", description: "Brand stories that give people a reason to remember, trust, and choose you.", icon: Film, videos: ["Founder portrait", "Brand manifesto", "Customer story"] },
  { title: "Make the product matter", description: "Clear, desirable product films that turn details into decisive reasons to buy.", icon: Package, videos: ["Product launch", "How it works", "E-commerce loop"] },
  { title: "Own the campaign", description: "One sharp creative idea, built to stay powerful across every channel and format.", icon: Clapperboard, videos: ["Campaign film", "Cutdown series", "Behind the scenes"] },
  { title: "Turn moments into momentum", description: "Culture, events, and real stories captured with energy and commercial purpose.", icon: Camera, videos: ["Event recap", "Culture film", "Speaker profile"] },
];

const industries = [
  ["Fashion", ShoppingBag], ["Cosmetics", Sparkles], ["Service businesses", BriefcaseBusiness],
  ["Jewelry", Gem], ["Healthcare", HeartPulse], ["Home improvement", Hammer], ["Food", Utensils],
  ["Dental clinics", Smile], ["Chiropractors", Stethoscope], ["Health supplements", Leaf],
  ["Real estate", House], ["Law firms", Scale], ["Education", GraduationCap], ["Beauty", Palette],
  ["IT companies", Cpu], ["SaaS companies", Smartphone], ["Manufacturing", Factory],
  ["Enterprises", Building2], ["Solar companies", Sun], ["Roofing", Store], ["Pest control", Bug],
] as const;

const stripProjects = [
  { image: heroFashion, title: "Fashion", tag: "Brand film" },
  { image: heroProduct, title: "Product", tag: "Paid social" },
  { image: heroHospitality, title: "Hospitality", tag: "Social series" },
  { image: heroFitness, title: "Wellness", tag: "Campaign launch" },
];

const stats = [
  ["33%", "More qualified demand"], ["2.4×", "Stronger creative return"],
  ["41%", "Lower cost per result"], ["18M", "Campaign views"],
];

type GeneratedCopy = { headlines: string[]; quotes: string[] };

function Index() {
  const runCampaignWriter = useServerFn(generateCampaignCopy);
  const [brief, setBrief] = useState("");
  const [generated, setGenerated] = useState<GeneratedCopy | null>(null);
  const [writerError, setWriterError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sent, setSent] = useState(false);

  const submitCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWriterError("");
    setGenerated(null);
    setIsGenerating(true);
    try {
      const result = await runCampaignWriter({ data: { brief } });
      setGenerated(result);
    } catch (error) {
      setWriterError(error instanceof Error ? error.message : "The AI writer could not complete this request.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="bg-background">
      <header className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="text-xl font-extrabold text-ink">Framehaus<span className="text-primary">.</span></a>
        <nav className="flex items-center gap-5 text-sm font-bold text-ink sm:gap-8">
          <a href="#writer" className="hidden sm:inline">Campaign writer</a>
          <a href="#contact" className="underline decoration-interactive decoration-2 underline-offset-8">Start a project</a>
        </nav>
      </header>

      <section id="top" className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-[1.12fr_.88fr] lg:px-10 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-7 max-w-lg text-base font-bold text-primary">Digital marketing for brands that refuse to blend in.</p>
          <h1 className="max-w-3xl text-[clamp(2.75rem,5.4vw,4.8rem)] font-extrabold leading-[1.04] text-ink">Make attention pay.</h1>
          <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-muted-foreground">We turn sharp strategy into bold films, social campaigns, and conversion-led creative that gets seen, remembered, and acted on.</p>
          <Button asChild variant="agency" size="pill" className="mt-9">
            <a href="#contact">Build a campaign that moves <ArrowDownRight /></a>
          </Button>
        </div>
        <div className="relative aspect-[4/5] w-full min-w-0 max-h-[720px] overflow-hidden rounded-3xl bg-night sm:min-h-[480px]">
          {heroFrames.map((frame, index) => (
            <figure key={frame.caption} className="hero-frame absolute inset-0" style={{ animationDelay: `${index * 4}s`, opacity: index === 0 ? 1 : 0 }}>
              <img src={frame.image} alt={frame.caption} width={1024} height={1280} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/90 to-transparent" />
              <figcaption className="absolute bottom-7 left-7 right-7 text-sm font-bold text-primary-foreground">{frame.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="border-y border-border bg-secondary/45 py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 text-base font-extrabold text-muted-foreground/70 lg:px-10">
          {["NORTHSTAR", "ASTER & CO.", "MESA", "PACE", "FOLIO", "KINDRED"].map((logo) => <span key={logo}>{logo}</span>)}
        </div>
      </div>

      <section className="bg-ivory px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-2xl text-4xl font-extrabold text-ink md:text-5xl">Five ways we make ideas move</h2>
            <p className="max-w-md font-medium text-muted-foreground">No filler. No forgettable frames. Every decision is built to earn attention and drive action.</p>
          </div>
          <div className="space-y-8">
            {categories.map(({ title, description, icon: Icon, videos }, index) => (
              <article key={title} className="category-glow relative overflow-hidden rounded-2xl bg-night p-6 text-primary-foreground md:p-10">
                <div className="relative z-10">
                  <div className="mb-10 flex items-center gap-5 text-teal"><Icon className="size-7" strokeWidth={1.5} /><span className="font-extrabold">0{index + 1}</span></div>
                  <h3 className="text-3xl font-extrabold md:text-4xl">{title}</h3>
                  <p className="mt-3 max-w-2xl font-medium text-primary-foreground/70">{description}</p>
                  <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {videos.map((video) => <div key={video}>
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-night-soft"><Play className="size-10 text-teal" strokeWidth={1.5} /></div>
                      <p className="mt-3 text-sm font-bold text-primary-foreground/80">{video}</p>
                    </div>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/55 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold text-ink md:text-5xl">Industries we know</h2>
            <p className="mt-5 text-lg font-medium leading-8 text-muted-foreground">Different markets. Different pressures. One standard: creative that performs.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {industries.map(([name, Icon], index) => (
              <article key={name} className="flex min-h-40 flex-col items-center justify-between rounded-2xl border border-border bg-card px-3 py-6 text-center transition-transform duration-200 hover:-translate-y-1">
                <span className={`flex size-12 items-center justify-center rounded-full ${index % 2 === 0 ? "bg-accent/35" : "bg-primary/10"}`}>
                  <Icon className="size-6 text-primary" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-sm font-extrabold leading-5 text-ink">{name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night-soft px-6 py-24 text-primary-foreground lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-5 font-extrabold text-teal">Creative instinct. Commercial discipline.</p>
              <h2 className="max-w-xl text-4xl font-extrabold md:text-5xl">Creative decisions, backed by results.</h2>
              <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-primary-foreground/70">We do not make content to fill a calendar. We find the message that matters, build the work that lands, and use real response signals to make every next move stronger.</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <img src={heroProduct} alt="Bold product campaign creative" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center"><span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="ml-1 size-6" fill="currentColor" /></span></span>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {stats.map(([number, label]) => <div key={number} className="relative min-h-36 border-t border-primary-foreground/15 pt-6">
              <strong className="text-4xl font-extrabold text-teal md:text-5xl">{number}</strong>
              <p className="mt-3 text-sm font-bold text-primary-foreground/80">{label}</p>
              <small className="absolute bottom-0 left-0 text-[10px] text-primary-foreground/40">Reference benchmark</small>
            </div>)}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <p className="font-extrabold text-primary">Built for every feed, screen, and decisive moment.</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold text-ink md:text-5xl">One idea. Infinite momentum.</h2>
        </div>
        <div className="mt-14 overflow-hidden py-6 [perspective:1200px]">
          <div className="strip-track flex w-max gap-5 px-3">
            {[...stripProjects, ...stripProjects].map((project, index) => (
              <figure key={`${project.title}-${index}`} className="strip-card relative aspect-[4/5] w-[240px] shrink-0 overflow-hidden rounded-2xl bg-night sm:w-[320px]">
                <img src={project.image} alt={`${project.title} ${project.tag} project`} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-left text-primary-foreground">
                  <span className="text-xs font-bold text-teal">{project.tag}</span>
                  <strong className="mt-1 block text-xl">{project.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="writer" className="border-y border-border bg-primary px-6 py-24 text-primary-foreground lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10"><WandSparkles className="size-6" /></span>
            <h2 className="mt-8 max-w-lg text-4xl font-extrabold md:text-5xl">Turn your brief into words that hit.</h2>
            <p className="mt-6 max-w-md text-lg font-medium leading-8 text-primary-foreground/75">Give our campaign writer the product, audience, goal, and attitude. Get five bold headlines and five pitch-ready lines in seconds.</p>
          </div>
          <div className="rounded-3xl bg-card p-7 text-card-foreground md:p-10">
            <form onSubmit={submitCampaign}>
              <label htmlFor="campaign-brief" className="text-sm font-extrabold">Campaign brief</label>
              <textarea id="campaign-brief" required minLength={20} maxLength={2000} rows={6} value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Example: Launch a clean energy drink for ambitious young founders. The campaign should feel direct, intelligent, and impossible to ignore." className="mt-3 w-full resize-none rounded-lg border border-input bg-background p-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground/65 focus:border-interactive focus:ring-2 focus:ring-interactive/30" />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-semibold text-muted-foreground">Include audience, offer, objective, and tone.</span>
                <Button type="submit" variant="agency" size="pill" disabled={isGenerating}>
                  {isGenerating ? <><LoaderCircle className="animate-spin" /> Writing</> : <><WandSparkles /> Generate ideas</>}
                </Button>
              </div>
            </form>
            {writerError && <p role="alert" className="mt-6 rounded-lg bg-destructive/10 p-4 text-sm font-bold text-destructive">{writerError}</p>}
            {generated && (
              <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2" aria-live="polite">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink"><Target className="text-primary" /> Headline options</h3>
                  <ol className="mt-5 space-y-4">{generated.headlines.map((headline, index) => <li key={headline} className="flex gap-3"><span className="font-extrabold text-primary">0{index + 1}</span><strong className="text-ink">{headline}</strong></li>)}</ol>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink"><MessageCircle className="text-primary" /> Bold lines</h3>
                  <div className="mt-5 space-y-4">{generated.quotes.map((quote) => <blockquote key={quote} className="border-l-2 border-interactive pl-4 font-bold text-ink">“{quote}”</blockquote>)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <h2 className="text-4xl font-extrabold text-ink md:text-5xl">Less noise. More movement.</h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            [Search, "1. Diagnose", "Find the audience tension, commercial goal, and creative opening worth owning."],
            [Lightbulb, "2. Create", "Turn one sharp idea into work that is impossible to scroll past or mistake for anyone else."],
            [Video, "3. Improve", "Read the response, sharpen the message, and make the next release work even harder."],
          ].map(([Icon, title, text]) => { const StepIcon = Icon as typeof Search; return <article key={title as string} className="rounded-2xl border border-border bg-card p-8">
            <StepIcon className="size-7 text-primary" strokeWidth={1.5} /><h3 className="mt-10 text-xl font-extrabold text-ink">{title as string}</h3><p className="mt-4 font-medium leading-7 text-muted-foreground">{text as string}</p>
          </article>; })}
        </div>
      </section>

      <section id="contact" className="bg-night px-6 py-24 text-primary-foreground lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 className="max-w-xl text-4xl font-extrabold md:text-5xl">Need better results? Get in touch.</h2>
            <p className="mt-6 max-w-md font-medium leading-7 text-primary-foreground/70">Bring us the goal. We will bring the angle, the energy, and the work built to move the numbers.</p>
            <a href="#top" className="mt-12 inline-flex items-center gap-2 font-bold text-teal">Back to the top <ArrowUpRight className="size-4" /></a>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="rounded-3xl bg-card p-7 text-card-foreground md:p-10">
            <div className="grid gap-7 md:grid-cols-2">
              {["Name", "Email", "Phone"].map((label) => <label key={label} className={label === "Phone" ? "md:col-span-2" : ""}><span className="text-sm font-extrabold">{label}</span><input required={label !== "Phone"} type={label === "Email" ? "email" : label === "Phone" ? "tel" : "text"} className="mt-3 w-full border-0 border-b border-input bg-transparent px-0 py-3 outline-none transition-colors focus:border-interactive focus:ring-0" /></label>)}
              <label className="md:col-span-2"><span className="text-sm font-extrabold">Message</span><textarea required rows={4} className="mt-3 w-full resize-none border-0 border-b border-input bg-transparent px-0 py-3 outline-none transition-colors focus:border-interactive focus:ring-0" /></label>
            </div>
            <Button type="submit" variant="agency" size="pill" className="mt-9">{sent ? <><Check /> Message received</> : "Send inquiry"}</Button>
          </form>
        </div>
      </section>
      <footer className="bg-night px-6 pb-10 text-primary-foreground/45 lg:px-10"><div className="mx-auto flex max-w-7xl justify-between border-t border-primary-foreground/10 pt-8 text-xs"><span>Framehaus</span><span>Strategy · Creative · Performance</span></div></footer>
    </main>
  );
}