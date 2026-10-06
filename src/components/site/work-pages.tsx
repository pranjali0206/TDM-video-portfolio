import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Building2,
  Camera,
  Car,
  Clapperboard,
  Database,
  Dumbbell,
  Factory,
  FileText,
  Gauge,
  GraduationCap,
  HeartPulse,
  Hotel,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PenTool,
  Plug,
  Search,
  ServerCog,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
  Workflow,
} from "lucide-react";

import { clientLogos } from "./client-logos";
import { filmsMade } from "./company-stats";
import { categories } from "./content";
import { Reveal } from "./primitives";
import { ReelShowcase } from "./reel-showcase";
import { NumbersStrip, RelatedServices, ServiceContact } from "./service-blocks";
import {
  CheckList,
  DetailCta,
  DetailHero,
  DetailSection,
  FeatureGrid,
  StepList,
  type Feature,
} from "./service-detail";

const videoFor = (href: string) => categories.find((card) => card.href === href)?.video;

/* ------------------------------------------------------------------ */
/* MediaHouse — Brand & Digital Creative                               */
/* ------------------------------------------------------------------ */

const mediaHouseServices: Feature[] = [
  {
    icon: Palette,
    title: "Brand identity",
    text: "Logo, colour, type and voice — one clear brand idea your customers recognise everywhere.",
  },
  {
    icon: Clapperboard,
    title: "Ad reels & short-form video",
    text: "Scripted, shot and edited around the hook, so people stop scrolling in the first second.",
  },
  {
    icon: Sparkles,
    title: "Social media content",
    text: "Monthly content calendars, posts and stories that keep your brand present and consistent.",
  },
  {
    icon: Megaphone,
    title: "Ad creatives",
    text: "Static and motion ad designs built for Google and Meta — tested, iterated and made to convert.",
  },
  {
    icon: Camera,
    title: "Shoots & production",
    text: "Product, lifestyle and real estate shoots, including drone footage and AI-assisted visuals.",
  },
  {
    icon: PenTool,
    title: "Creative direction",
    text: "Concepts, scripts and campaign ideas that tie every piece of content back to what sells.",
  },
];

/** The client reels, presented on a dark "screening room" band. */
function ReelsSection() {
  return (
    <section
      id="reels"
      className="relative scroll-mt-20 overflow-hidden border-t border-ink/10 bg-gradient-to-b from-ivory via-secondary/50 to-ivory pb-24 text-ink md:pb-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb -left-[10%] top-[8%] size-[34rem] bg-accent/35" />
        <div className="orb -right-[8%] top-[40%] size-[30rem] bg-teal/45 [animation-delay:-7s]" />
        <div className="orb bottom-0 left-[35%] size-[26rem] bg-glow/15 [animation-delay:-13s]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 md:px-14 md:pt-28 lg:px-20">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-12">
          <Reveal>
            <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-deep-teal">
              <span className="rec-blink size-2 rounded-full bg-glow" />
              Now screening
            </p>
            <h2
              data-split
              className="text-teal-gradient mt-5 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em]"
              style={{ fontStretch: "108%" }}
            >
              Reels that made people{" "}
              <span
                className="font-serif font-normal italic tracking-normal text-glow"
                style={{ fontStretch: "100%" }}
              >
                stop scrolling.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg">
              Real projects we’ve shot, edited and launched for our clients. Pick an industry, then
              tap any reel to watch it with sound.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 md:mt-20">
          <ReelShowcase />
        </div>
      </div>
    </section>
  );
}

// Short, punchy proof points for the MediaHouse hero — real figures only.
const mediaHouseHighlights = [
  {
    kicker: "Revenue",
    value: "₹230 Cr+",
    text: "in sales generated for the brands we create for.",
    tone: "bg-night text-ivory",
    accent: "text-accent",
  },
  {
    kicker: "Growth",
    value: `${clientLogos.length}+ brands`,
    text: "grown across real estate, architecture, healthcare and biotech.",
    tone: "bg-accent text-ink",
    accent: "text-night",
  },
  {
    kicker: "Results",
    value: `${filmsMade}+ films`,
    text: "shot, edited and launched — every one built to stop the scroll.",
    tone: "bg-card text-ink ring-1 ring-ink/10",
    accent: "text-deep-teal",
  },
  {
    kicker: "The Purple Cow effect",
    value: "Be the purple one.",
    text: "Nobody stops for another brown cow. We make brands people talk about.",
    tone: "bg-glow text-ink",
    accent: "text-night",
  },
];

function MediaHouseHighlights() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mediaHouseHighlights.map(({ kicker, value, text, tone, accent }) => (
        <li
          key={kicker}
          className={`flex min-h-[15rem] flex-col rounded-[1.75rem] p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-8 ${tone}`}
        >
          <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.25em] ${accent}`}>
            {kicker}
          </p>
          <p
            className="mt-auto pt-10 font-display text-[clamp(2rem,3.2vw,2.9rem)] font-bold leading-[0.95] tracking-[-0.03em]"
            style={{ fontStretch: "105%" }}
          >
            {value}
          </p>
          <p className="mt-3 text-[15px] font-medium leading-snug opacity-80">{text}</p>
        </li>
      ))}
    </ul>
  );
}

export function MediaHousePage() {
  return (
    <>
      <DetailHero
        eyebrow="MediaHouse · Brand & digital creative"
        title="Creative that makes your brand"
        accent="unforgettable."
        intro="MediaHouse is our in-house creative studio. We shape how your brand looks, sounds and shows up — then produce the reels, posts and ad creative that keep it in front of the right people."
        scene="media"
        videoTitle="MediaHouse showreel"
        media={<MediaHouseHighlights />}
      />
      <ReelsSection />
      <DetailSection
        label="What we create"
        title="Everything your brand needs to be seen."
        intro="Strategy, design and production under one roof — so your identity, social and ads all speak with one voice."
      >
        <FeatureGrid items={mediaHouseServices} />
      </DetailSection>
      <DetailCta
        kicker="Ready to stand out?"
        title="Let’s make something people"
        accent="remember."
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Websites That Convert                                               */
/* ------------------------------------------------------------------ */

const webDeliverables: Feature[] = [
  {
    icon: Building2,
    title: "Business & corporate websites",
    text: "A credible, modern home for your brand that explains what you do and turns visitors into enquiries.",
  },
  {
    icon: LayoutTemplate,
    title: "High-converting landing pages",
    text: "Focused, single-goal pages for ad campaigns and launches — built to lower your cost per lead.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce stores",
    text: "Online stores with smooth checkout, secure payments and product pages that sell.",
  },
  {
    icon: MonitorSmartphone,
    title: "Web apps & customer portals",
    text: "Booking systems, dashboards and member areas custom-built around your workflow.",
  },
  {
    icon: Gauge,
    title: "Speed & performance",
    text: "Optimised images, code and hosting so pages load fast on every phone and network.",
  },
  {
    icon: Search,
    title: "SEO-ready structure",
    text: "Clean code, page titles, schema and site structure that help Google understand and rank you.",
  },
  {
    icon: BarChart3,
    title: "Tracking & analytics",
    text: "Google Analytics, Meta Pixel and conversion events set up so you see exactly what drives results.",
  },
  {
    icon: Plug,
    title: "CRM, WhatsApp & payment integrations",
    text: "Forms that land straight in your CRM, WhatsApp chat buttons and payment gateways that just work.",
  },
  {
    icon: ShieldCheck,
    title: "Hosting, security & support",
    text: "SSL, backups, updates and a team on call — so your site stays fast, safe and online.",
  },
];

const webProcess = [
  {
    title: "Discover",
    text: "We learn your business, customers and goals, and agree on the one action every page should drive.",
  },
  {
    title: "Design",
    text: "Wireframes and visual design built around your customer’s journey — reviewed with you before a line of code.",
  },
  {
    title: "Build",
    text: "Fast, mobile-first development with SEO, tracking and integrations built in from the start.",
  },
  {
    title: "Launch & grow",
    text: "We go live, measure what visitors do and keep improving the pages that matter most.",
  },
];

const webStandards = [
  "Mobile-first, responsive design",
  "Fast load times on every device",
  "On-page SEO and clean site structure",
  "Analytics and conversion tracking",
  "Enquiry forms connected to your CRM",
  "SSL security and regular backups",
  "Easy for your team to update",
  "Accessible, readable and on-brand",
];

const webIndustries: Feature[] = [
  {
    icon: Building2,
    title: "Real estate & construction",
    text: "Project showcases, virtual tours and lead pages that fill site visits.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & clinics",
    text: "Doctor profiles, services and online appointment booking.",
  },
  {
    icon: GraduationCap,
    title: "Education & coaching",
    text: "Course pages, admissions enquiries and student portals.",
  },
  {
    icon: Hotel,
    title: "Hospitality & restaurants",
    text: "Menus, galleries and direct bookings without commission.",
  },
  {
    icon: Shirt,
    title: "Fashion & lifestyle",
    text: "Visual-first stores and lookbooks that turn browsers into buyers.",
  },
  {
    icon: Store,
    title: "Retail & D2C brands",
    text: "E-commerce stores with smooth checkout and repeat-purchase journeys.",
  },
  {
    icon: Dumbbell,
    title: "Fitness & wellness",
    text: "Membership sign-ups, class schedules and trial bookings.",
  },
  {
    icon: Factory,
    title: "Manufacturing & B2B",
    text: "Product catalogues and RFQ forms that bring in qualified buyers.",
  },
  {
    icon: Car,
    title: "Automobile & dealerships",
    text: "Model showcases, test-drive bookings and service enquiries.",
  },
];

export function WebsitesPage() {
  return (
    <>
      <DetailHero
        eyebrow="Websites & landing pages"
        title="We build websites that"
        accent="convert."
        intro="Not just good-looking pages — fast, focused websites designed around your customer, where every section moves a visitor one step closer to an enquiry, booking or sale."
        scene="web"
        video={videoFor("/websites")}
        videoTitle="Websites showreel"
      />
      <DetailSection
        label="Delivery capabilities"
        title="What we design, build and deliver."
        intro="From a single campaign landing page to a full e-commerce store or customer portal — planned, designed, built and supported by one team."
      >
        <FeatureGrid items={webDeliverables} />
      </DetailSection>
      <DetailSection
        label="How we deliver"
        title="A clear process, from brief to launch."
        intro="You always know what’s happening, what’s next and what you’re approving."
      >
        <StepList steps={webProcess} />
      </DetailSection>
      <DetailSection
        dark
        label="Built in, as standard"
        title="Every site we ship comes with"
        intro="The basics that decide whether a website earns money — never sold as optional extras."
      >
        <CheckList items={webStandards} dark />
      </DetailSection>
      <DetailSection
        label="Industry expertise"
        title="We have expertise in these industries."
        intro="We know what customers in your industry look for — and how to design the path from first visit to first enquiry."
      >
        <FeatureGrid items={webIndustries} />
      </DetailSection>
      <section className="border-t border-ink/10 px-6 py-16 md:px-14 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>
      <DetailSection label="Works best with" title="Bring traffic. Catch every lead.">
        <RelatedServices slugs={["ads", "mediahouse", "crm"]} />
      </DetailSection>
      <ServiceContact
        service="Websites"
        title="Let’s build a site that"
        accent="sells."
        intro="Tell us what the site needs to do — bring enquiries, take bookings or sell online. We’ll come back with a plan, a timeline and a quote."
        question={{
          label: "What do you need?",
          options: [
            "Business website",
            "Landing page",
            "E-commerce store",
            "Web app / portal",
            "Redesign",
          ],
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CRM, Automation & AI                                                */
/* ------------------------------------------------------------------ */

const automationProcess = [
  {
    title: "Map",
    text: "We sit with your team and map how leads, orders, approvals and data move today — and where time leaks.",
  },
  {
    title: "Design",
    text: "We plan the system: what triggers each step, where data lives, who owns what and what runs on its own.",
  },
  {
    title: "Build & connect",
    text: "We set up your CRM, ERP and automations and connect them to the tools you already use.",
  },
  {
    title: "Train & improve",
    text: "We train your team, monitor every workflow and keep refining as your business grows.",
  },
];

const automationSystems: Feature[] = [
  {
    icon: Workflow,
    title: "Workflow automation",
    text: "Multi-step processes — approvals, hand-offs, follow-ups — that run on their own, every time.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & email automation",
    text: "Welcome messages, reminders, payment nudges and updates sent automatically at the right moment.",
  },
  {
    icon: Users,
    title: "Lead routing",
    text: "New leads assigned to the right person instantly, by city, product or availability.",
  },
  {
    icon: FileText,
    title: "Documents & data entry",
    text: "Invoices, quotes and records created from forms and orders — no retyping.",
  },
  {
    icon: BarChart3,
    title: "Scheduled reports & alerts",
    text: "Daily sales, stock and team reports delivered to your inbox or WhatsApp, automatically.",
  },
  {
    icon: Plug,
    title: "App integrations",
    text: "Your ads, website, CRM, sheets, payments and accounting tools sharing data on their own.",
  },
];

// Trigger → what happens automatically.
const automationExamples = [
  {
    area: "Lead capture",
    trigger: "A lead fills your Meta or Google ad form",
    steps: [
      "Lead lands in the CRM instantly",
      "Assigned to the right salesperson",
      "WhatsApp welcome sent in under a minute",
      "Follow-up reminder set automatically",
    ],
  },
  {
    area: "Sales follow-up",
    trigger: "A deal goes quiet for three days",
    steps: [
      "Gentle follow-up message goes out",
      "Salesperson gets a nudge",
      "Manager sees it on the pipeline dashboard",
    ],
  },
  {
    area: "Orders & billing",
    trigger: "A customer confirms an order",
    steps: [
      "Invoice generated and emailed",
      "Stock updated in the ERP",
      "Payment link sent with auto-reminders",
    ],
  },
  {
    area: "Inventory",
    trigger: "Stock drops below the minimum level",
    steps: [
      "Purchase order drafted for approval",
      "Supplier notified once approved",
      "Team alerted on WhatsApp or email",
    ],
  },
  {
    area: "HR & onboarding",
    trigger: "A new employee joins",
    steps: [
      "Accounts and documents created",
      "Onboarding checklist assigned",
      "Payroll and attendance set up",
    ],
  },
  {
    area: "Customer support",
    trigger: "A customer messages at 11 pm",
    steps: [
      "AI agent answers common questions",
      "Complex cases become a support ticket",
      "Team picks it up first thing in the morning",
    ],
  },
];

const connectedTools = [
  "WhatsApp Business",
  "Meta Lead Ads",
  "Google Ads",
  "Website forms",
  "Gmail & Outlook",
  "Google Sheets",
  "Payment gateways",
  "Accounting software",
  "Shopify & WooCommerce",
  "Calendars",
  "Telephony & IVR",
  "Slack & team chat",
];

const automationOutcomes: Feature[] = [
  {
    icon: MessageCircle,
    title: "Leads answered in seconds",
    text: "Every enquiry gets an instant reply and a clear owner — no more leads lost overnight.",
  },
  {
    icon: ServerCog,
    title: "Hours of busywork removed",
    text: "Your team stops copying data between tools and spends that time selling and serving.",
  },
  {
    icon: Database,
    title: "One source of truth",
    text: "Sales, stock, finance and people data in one connected system everyone trusts.",
  },
  {
    icon: BarChart3,
    title: "Decisions on live data",
    text: "Real-time dashboards show what’s working, what’s stuck and where to act next.",
  },
];

export function AutomationPage() {
  return (
    <>
      <DetailHero
        eyebrow="Workflow automation"
        title="We automate the busywork so your business"
        accent="runs itself."
        intro="We find the repetitive work slowing your team down and automate it — connecting your tools so data moves on its own, messages go out on time and reports build themselves."
        scene="automation"
        video={videoFor("/automation")}
        videoTitle="Automation showreel"
      />

      <DetailSection
        label="How we automate your business"
        title="From manual tasks to work that runs itself."
        intro="We don’t start with software. We start with how work moves through your business — then automate the parts that slow you down."
      >
        <StepList steps={automationProcess} />
      </DetailSection>

      <DetailSection
        label="What we build"
        title="What we automate."
        intro="Start with the task your team repeats most, then connect the rest."
      >
        <FeatureGrid items={automationSystems} />
      </DetailSection>

      <DetailSection
        dark
        label="Automations in action"
        title="When this happens, the system does the rest."
        intro="A few of the workflows we set up for businesses every day."
      >
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {automationExamples.map(({ area, trigger, steps }, index) => (
            <li key={area}>
              <Reveal delay={(index % 3) * 80} className="h-full">
                <div className="h-full rounded-[1.5rem] border border-ivory/10 bg-ivory/5 p-6 md:p-8">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
                    {area}
                  </p>
                  <p
                    className="mt-4 font-display text-xl font-bold leading-snug"
                    style={{ fontStretch: "105%" }}
                  >
                    {trigger}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {steps.map((step) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 text-[15px] font-medium leading-snug text-ivory/80"
                      >
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-teal" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection
        label="Integrations"
        title="We connect the tools you already use."
        intro="No rip-and-replace. Your existing apps keep working — they just start sharing data automatically."
      >
        <Reveal>
          <ul className="flex flex-wrap gap-2.5">
            {connectedTools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-bold text-ink"
              >
                {tool}
              </li>
            ))}
          </ul>
        </Reveal>
      </DetailSection>

      <DetailSection label="What changes" title="What your business gets.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {automationOutcomes.map(({ icon: Icon, title, text }, index) => (
            <li key={title}>
              <Reveal delay={index * 80} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-ink p-6 text-ivory md:p-8">
                  <Icon className="size-6 text-accent" strokeWidth={1.8} />
                  <h3
                    className="mt-6 font-display text-xl font-bold leading-tight"
                    style={{ fontStretch: "105%" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] font-medium leading-relaxed text-ivory/75">
                    {text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </DetailSection>

      <section className="border-t border-ink/10 px-6 py-16 md:px-14 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>

      <DetailSection label="Works best with" title="Automation runs best on a solid system.">
        <RelatedServices slugs={["crm", "erp", "ai-agents"]} />
      </DetailSection>

      <ServiceContact
        service="Automations"
        title="Show us your process. We’ll show you what to"
        accent="automate."
        intro="Tell us the task your team repeats most. We’ll map how it could run on its own — and how many hours it would give back."
        question={{
          label: "What would you automate first?",
          options: ["Lead follow-ups", "WhatsApp & email", "Reports", "Data entry", "Not sure yet"],
        }}
      />
    </>
  );
}
