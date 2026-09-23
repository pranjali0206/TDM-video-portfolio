import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowDown, BriefcaseBusiness, Building2, Camera, Check, CirclePlay,
  Clapperboard, Cpu, Factory, Film, Gem, GraduationCap, Hammer, HeartPulse,
  House, Leaf, Lightbulb, Megaphone, MessageCircle, Package, Palette,
  Play, Scale, Search, ShoppingBag, Smartphone, Sparkles, Sprout, Stethoscope,
  Store, Sun, Tooth, Utensils, Users, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroProduct from "@/assets/hero-product.jpg";
import heroHospitality from "@/assets/hero-hospitality.jpg";
import heroFitness from "@/assets/hero-fitness.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Framehaus — Video that moves people and performance" },
      { name: "description", content: "Strategy-led video production, social content and campaign creative for ambitious brands." },
      { property: "og:title", content: "Framehaus — Video that moves people and performance" },
      { property: "og:description", content: "Strategy-led video production and campaign creative for ambitious brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const heroFrames = [
  { image: heroFashion, caption: "Folio — Founder brand film" },
  { image: heroProduct, caption: "Aster — Product campaign" },
  { image: heroHospitality, caption: "Mesa — Social content series" },
  { image: heroFitness, caption: "Pace — Performance creative" },
];

const videoTypes = [
  { name: "All work", icon: Film }, { name: "Social ads", icon: Smartphone },
  { name: "Brand films", icon: Clapperboard }, { name: "Product videos", icon: Package },
  { name: "Founder stories", icon: Users }, { name: "E-commerce", icon: ShoppingBag },
  { name: "Campaigns", icon: Megaphone }, { name: "Events", icon: Camera },
];

const categories = [
  { title: "Paid social creative", description: "Fast, focused films designed around the first three seconds and built to convert.", icon: Smartphone, videos: ["Performance cut", "Creator concept", "Product hook"] },
  { title: "Brand storytelling", description: "Human stories with a clear point of view, shaped for attention and recall.", icon: Film, videos: ["Founder portrait", "Brand manifesto", "Customer story"] },
  { title: "Product and e-commerce", description: "Beautiful, useful demonstrations that make every product detail feel essential.", icon: Package, videos: ["Product launch", "How it works", "E-commerce loop"] },
  { title: "Campaign production", description: "One strong creative system adapted into every format your campaign needs.", icon: Clapperboard, videos: ["Campaign film", "Cutdown series", "Behind the scenes"] },
  { title: "Events and culture", description: "Atmosphere, energy and real moments captured without losing the story.", icon: Camera, videos: ["Event recap", "Culture film", "Speaker profile"] },
];

const industries = [
  { name: "Fashion", icon: ShoppingBag },
  { name: "Cosmetics", icon: Sparkles },
  { name: "Service-based businesses", icon: BriefcaseBusiness },
  { name: "Jewelry", icon: Gem },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Home improvement", icon: Hammer },
  { name: "Food", icon: Utensils },
  { name: "Dental clinics", icon: Tooth },
  { name: "Chiropractors", icon: Stethoscope },
  { name: "Health supplements", icon: Leaf },
  { name: "Real estate", icon: House },
  { name: "Law firms", icon: Scale },
  { name: "Education companies", icon: GraduationCap },
  { name: "Beauty", icon: Palette },
  { name: "IT companies", icon: Cpu },
  { name: "SaaS companies", icon: Smartphone },
  { name: "Manufacturing companies", icon: Factory },
  { name: "Enterprises", icon: Building2 },
  { name: "Solar companies", icon: Sun },
  { name: "Roofing contractors", icon: Store },
  { name: "Pest control", icon: Sprout },
];

const stats = [
  ["33%", "Growth in monthly profit"], ["2.4×", "Return on creative spend"],
  ["41%", "Lower cost per result"], ["18M", "Campaign views"],
];

function Index() {
  const [activeType, setActiveType] = useState("All work");
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };

  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="text-xl font-extrabold text-ink">Framehaus<span className="text-primary">.</span></a>
        <a href="#contact" className="text-sm font-bold text-ink underline decoration-primary decoration-2 underline-offset-8">Start a project</a>
      </header>

      <section id="top" className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-[1.12fr_.88fr] lg:px-10 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-7 max-w-lg text-base font-semibold text-muted-foreground">A strategy-led video agency for brands that want creative to work harder.</p>
          <h1 className="max-w-3xl text-[clamp(2.75rem,5.4vw,4.8rem)] font-extrabold leading-[1.04] text-ink">Video that moves people and performance.</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">From the first idea to the final cut, we make distinctive films engineered for attention, action and measurable growth.</p>
          <Button asChild variant="agency" size="pill" className="mt-9">
            <a href="#contact">Plan your next shoot</a>
          </Button>
        </div>
        <div className="relative aspect-[4/5] w-full min-w-0 max-h-[720px] overflow-hidden rounded-3xl bg-night sm:min-h-[480px]">
          {heroFrames.map((frame, index) => (
            <figure key={frame.caption} className="hero-frame absolute inset-0" style={{ animationDelay: `${index * 4}s`, opacity: index === 0 ? 1 : 0 }}>
              <img src={frame.image} alt={frame.caption} width={1024} height={1280} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/85 to-transparent" />
              <figcaption className="absolute bottom-7 left-7 right-7 text-sm font-semibold text-primary-foreground">{frame.caption}</figcaption>
            </figure>
          ))}
        </div>
        <a href="#video-types" aria-label="Explore our work" className="hidden items-center gap-3 text-sm font-bold text-muted-foreground lg:flex"><ArrowDown className="size-4" /> Explore our work</a>
      </section>

      <div className="border-y border-border py-7">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 text-lg font-extrabold text-muted-foreground/65 lg:px-10">
          {['NORTHSTAR', 'ASTER & CO.', 'MESA', 'PACE', 'FOLIO', 'KINDRED'].map((logo) => <span key={logo}>{logo}</span>)}
        </div>
      </div>

      <section id="video-types" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold text-ink md:text-5xl">Made for every screen</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Choose a format to explore how we turn brand goals into work people want to watch.</p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {videoTypes.map(({ name, icon: Icon }) => {
            const active = activeType === name;
            return <button key={name} type="button" aria-pressed={active} onClick={() => setActiveType(name)} className={`min-h-40 rounded-2xl border-2 bg-card p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive ${active ? 'border-interactive' : 'border-transparent hover:border-border'}`}>
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary"><Icon className="size-5 text-ink" /></span>
              <span className="mt-6 block font-bold text-ink">{name}</span>
              {active && <Check className="mt-3 size-4 text-interactive" aria-hidden="true" />}
            </button>;
          })}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold text-ink md:text-5xl">Industries we know</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Our production systems adapt to different audiences, buying journeys and business goals.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {industries.map(({ name, icon: Icon }, index) => (
              <article key={name} className="flex min-h-40 flex-col items-center justify-between rounded-2xl border border-border bg-card px-3 py-6 text-center transition-transform duration-200 hover:-translate-y-1">
                <span className={`flex size-12 items-center justify-center rounded-full ${index % 2 === 0 ? 'bg-accent/35' : 'bg-primary/10'}`}>
                  <Icon className="size-6 text-ink" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-sm font-bold leading-5 text-ink">{name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-2xl text-4xl font-extrabold text-ink md:text-5xl">Five ways we make ideas move</h2>
            <p className="max-w-md text-muted-foreground">Focused teams, sharp creative direction and a production model built around your goals.</p>
          </div>
          <div className="space-y-8">
            {categories.map(({ title, description, icon: Icon, videos }, index) => (
              <article key={title} className="category-glow relative overflow-hidden rounded-2xl bg-night p-6 text-primary-foreground md:p-10">
                <div className="relative z-10">
                  <div className="mb-10 flex items-center gap-5 text-primary-foreground/60"><Icon className="size-7" strokeWidth={1.5} /><span className="font-semibold">0{index + 1}</span></div>
                  <h3 className="text-3xl font-extrabold md:text-4xl">{title}</h3>
                  <p className="mt-3 max-w-2xl text-primary-foreground/65">{description}</p>
                  <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {videos.map((video) => <div key={video}>
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-night-soft"><CirclePlay className="size-10 text-interactive" strokeWidth={1.25} /></div>
                      <p className="mt-3 text-sm text-primary-foreground/75">{video}</p>
                    </div>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-night-soft px-6 py-24 text-primary-foreground lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="max-w-xl text-4xl font-extrabold md:text-5xl">Creative decisions, backed by results.</h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/65">We connect creative craft to the numbers that matter, learning from every release to make the next one stronger.</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <img src={heroProduct} alt="A burgundy product campaign set" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center"><span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="ml-1 size-6" fill="currentColor" /></span></span>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {stats.map(([number, label]) => <div key={number} className="relative min-h-36 border-t border-primary-foreground/15 pt-6">
              <strong className="text-4xl font-extrabold text-teal md:text-5xl">{number}</strong>
              <p className="mt-3 text-sm text-primary-foreground/75">{label}</p>
              <small className="absolute bottom-0 left-0 text-[10px] text-primary-foreground/35">Reference data</small>
            </div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <h2 className="text-4xl font-extrabold text-ink md:text-5xl">A simple way to make better work</h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            [Search, "1. Diagnose", "We find the audience tension, business goal and creative opportunity worth solving."],
            [Lightbulb, "2. Create", "We shape the idea, direct the production and make every frame earn its place."],
            [Video, "3. Improve", "We deliver, learn from performance and turn those signals into the next iteration."],
          ].map(([Icon, title, text]) => { const StepIcon = Icon as typeof Search; return <article key={title as string} className="rounded-2xl bg-card p-8">
            <StepIcon className="size-7 text-primary" strokeWidth={1.5} /><h3 className="mt-10 text-xl font-extrabold text-ink">{title as string}</h3><p className="mt-4 leading-7 text-muted-foreground">{text as string}</p>
          </article>; })}
        </div>
      </section>

      <section id="contact" className="bg-night-soft px-6 py-24 text-primary-foreground lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 className="max-w-xl text-4xl font-extrabold md:text-5xl">Need better results? Get in touch.</h2>
            <p className="mt-6 max-w-md leading-7 text-primary-foreground/65">Tell us what you are making, where it needs to work and what success should look like.</p>
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 text-sm">
              <div><p className="text-primary-foreground/45">Business inquiries</p><p className="mt-2 font-semibold">Details to be confirmed</p></div>
              <div><p className="text-primary-foreground/45">Studio</p><p className="mt-2 font-semibold">Mumbai & worldwide</p></div>
              <div><p className="text-primary-foreground/45">Hours</p><p className="mt-2 font-semibold">Details to be confirmed</p></div>
              <div><p className="text-primary-foreground/45">Quick contact</p><p className="mt-2 flex items-center gap-2 font-semibold"><MessageCircle className="size-4 text-teal" /> WhatsApp on request</p></div>
            </div>
          </div>
          <form onSubmit={submit} className="rounded-3xl bg-card p-7 text-card-foreground md:p-10">
            <div className="grid gap-7 md:grid-cols-2">
              {['Name', 'Email', 'Phone'].map((label) => <label key={label} className={label === 'Phone' ? 'md:col-span-2' : ''}><span className="text-sm font-bold">{label}</span><input required={label !== 'Phone'} type={label === 'Email' ? 'email' : label === 'Phone' ? 'tel' : 'text'} className="mt-3 w-full border-0 border-b border-input bg-transparent px-0 py-3 outline-none transition-colors focus:border-interactive focus:ring-0" /></label>)}
              <label className="md:col-span-2"><span className="text-sm font-bold">Message</span><textarea required rows={4} className="mt-3 w-full resize-none border-0 border-b border-input bg-transparent px-0 py-3 outline-none transition-colors focus:border-interactive focus:ring-0" /></label>
            </div>
            <Button type="submit" variant="agency" size="pill" className="mt-9">{sent ? 'Message received' : 'Send inquiry'}</Button>
            {sent && <p role="status" className="mt-4 text-sm text-muted-foreground">Thanks — this prototype has captured the interaction only.</p>}
          </form>
        </div>
      </section>
      <footer className="bg-night-soft px-6 pb-10 text-primary-foreground/45 lg:px-10"><div className="mx-auto flex max-w-7xl justify-between border-t border-primary-foreground/10 pt-8 text-xs"><span>Framehaus</span><span>Strategy · Production · Performance</span></div></footer>
    </main>
  );
}