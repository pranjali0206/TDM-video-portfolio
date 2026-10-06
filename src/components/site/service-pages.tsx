import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Boxes,
  Brain,
  CalendarCheck,
  Check,
  ClipboardCheck,
  Factory,
  FileSpreadsheet,
  Filter,
  Globe,
  Headphones,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  PlayCircle,
  Receipt,
  Repeat,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Target,
  Truck,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { Reveal } from "./primitives";
import { VIDEO_BASE } from "./reels";
import { NumbersStrip, RelatedServices, ServiceContact } from "./service-blocks";
import {
  CheckList,
  DetailHero,
  DetailSection,
  FeatureGrid,
  StepList,
  type Feature,
} from "./service-detail";

const serviceVideo = (name: string) => `${VIDEO_BASE}/service-section/${name}.mp4`;

/* ------------------------------------------------------------------ */
/* Ads — Performance marketing                                         */
/* ------------------------------------------------------------------ */

const adChannels: Feature[] = [
  {
    icon: Search,
    title: "Google Search ads",
    text: "Show up the moment someone searches for what you sell — and pay only when they click.",
  },
  {
    icon: Target,
    title: "Performance Max",
    text: "One campaign across Search, YouTube, Display, Gmail and Maps, steered by your conversion data.",
  },
  {
    icon: PlayCircle,
    title: "YouTube ads",
    text: "Short, sharp video ads that build demand before people even start searching.",
  },
  {
    icon: Users,
    title: "Meta lead ads",
    text: "Facebook and Instagram forms that capture enquiries without leaving the app — straight into your CRM.",
  },
  {
    icon: Smartphone,
    title: "Instagram Reels & Stories",
    text: "Full-screen creative made by our MediaHouse, built to stop the scroll in the first second.",
  },
  {
    icon: MessageCircle,
    title: "Click-to-WhatsApp ads",
    text: "One tap opens a WhatsApp chat with your team — the fastest route from ad to conversation in India.",
  },
  {
    icon: Repeat,
    title: "Retargeting & remarketing",
    text: "Bring back the visitors who looked but didn’t enquire, with the right message for where they left off.",
  },
  {
    icon: MapPin,
    title: "Local & Maps ads",
    text: "Put your store, clinic or site office in front of people nearby who are ready to visit.",
  },
  {
    icon: ShoppingBag,
    title: "Shopping & catalogue ads",
    text: "Products with price and photo, shown to shoppers already comparing options.",
  },
];

// The funnel: what we run at each stage of the buyer's journey.
const adFunnel = [
  {
    stage: "Get seen",
    goal: "Reach the right people",
    run: ["Reels & YouTube ads", "Interest & lookalike audiences", "Launch campaigns"],
  },
  {
    stage: "Get chosen",
    goal: "Turn interest into intent",
    run: ["Google Search ads", "Retargeting", "Proof-led creative & reviews"],
  },
  {
    stage: "Get enquiries",
    goal: "Capture the lead",
    run: ["Meta lead forms", "Click-to-WhatsApp", "High-converting landing pages"],
  },
  {
    stage: "Get sales",
    goal: "Close and repeat",
    run: ["CRM follow-ups", "Remarketing to past buyers", "Offers for repeat purchase"],
  },
];

const adProcess = [
  {
    title: "Audit & research",
    text: "We study your market, competitors, past campaigns and customers to find where the profitable demand is.",
  },
  {
    title: "Set up to measure",
    text: "Conversion tracking, pixels, landing pages and creatives in place before a single rupee is spent.",
  },
  {
    title: "Launch & test",
    text: "Several audiences, hooks and creatives go live together, so the data tells us what works — fast.",
  },
  {
    title: "Optimise & scale",
    text: "Losers paused, winners scaled. Weekly tuning keeps cost per lead falling as volume grows.",
  },
];

const adMonthly = [
  "Campaign strategy and media plan",
  "Ad creatives and copy, refreshed regularly",
  "Conversion tracking and pixel setup",
  "Audience building and retargeting",
  "Weekly bid and budget optimisation",
  "A/B tests on hooks, creatives and pages",
  "Clear reports: spend, leads, cost per lead",
  "A dedicated account manager",
];

export function AdsPage() {
  return (
    <>
      <DetailHero
        eyebrow="Performance marketing · Google & Meta"
        title="Ads that pay for"
        accent="themselves."
        intro="Over a decade of running Google and Meta campaigns built around one number — profitable leads and sales. Every rupee tracked, every week optimised, every result reported in plain words."
        scene="ads"
        video={serviceVideo("ads")}
        videoTitle="Ads showreel"
      />

      <section className="px-6 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>

      <DetailSection
        label="Where we advertise"
        title="Every channel your customers use."
        intro="We pick the mix that suits your business and budget — not the one that’s easiest to sell."
      >
        <FeatureGrid items={adChannels} />
      </DetailSection>

      <DetailSection
        dark
        label="The full funnel"
        title="From first glance to final sale."
        intro="Most agencies stop at clicks. We plan every stage of the journey, so the people who see your ad end up as customers."
      >
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adFunnel.map(({ stage, goal, run }, index) => (
            <li key={stage}>
              <Reveal delay={index * 90} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-ivory/10 bg-ivory/5 p-6 md:p-8">
                  {/* The funnel narrows: each stage's bar is a little shorter. */}
                  <span
                    aria-hidden="true"
                    className="block h-1.5 rounded-full bg-gradient-to-r from-accent to-glow"
                    style={{ width: `${100 - index * 18}%` }}
                  />
                  <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
                    0{index + 1} · {goal}
                  </p>
                  <h3
                    className="mt-3 font-display text-2xl font-bold leading-tight"
                    style={{ fontStretch: "105%" }}
                  >
                    {stage}
                  </h3>
                  <ul className="mt-5 space-y-2.5">
                    {run.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] font-medium leading-snug text-ivory/80"
                      >
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-teal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </DetailSection>

      <DetailSection
        label="How we work"
        title="Test fast. Scale what works."
        intro="No guesswork and no set-and-forget. A clear loop of measuring, learning and improving."
      >
        <StepList steps={adProcess} />
      </DetailSection>

      <DetailSection
        label="Every month, as standard"
        title="What your retainer includes."
        intro="Everything needed to run campaigns properly — no surprise add-ons."
      >
        <CheckList items={adMonthly} />
      </DetailSection>

      <DetailSection label="Works best with" title="Ads land harder with these.">
        <RelatedServices slugs={["mediahouse", "websites", "crm"]} />
      </DetailSection>

      <ServiceContact
        service="Ads"
        title="Let’s make your ad spend"
        accent="pay back."
        intro="Tell us what you sell and what a good month looks like. We’ll come back with where we’d advertise, what it should cost and what to expect."
        question={{
          label: "Your monthly ad budget",
          options: ["Under ₹50k", "₹50k – ₹2L", "₹2L – ₹5L", "₹5L+", "Not sure yet"],
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CRM                                                                 */
/* ------------------------------------------------------------------ */

const crmSources = ["Meta ads", "Google ads", "Website", "WhatsApp", "Calls", "Walk-ins"];
const crmStages = ["New lead", "Contacted", "Visit / demo", "Negotiation", "Won"];

const crmFeatures: Feature[] = [
  {
    icon: Filter,
    title: "Every lead, captured",
    text: "Ads, website, WhatsApp, calls and walk-ins land in one list automatically — no more copying from sheets.",
  },
  {
    icon: UserCheck,
    title: "Auto-assignment",
    text: "Leads go to the right person by city, project or product, the moment they arrive.",
  },
  {
    icon: Bell,
    title: "Follow-up reminders",
    text: "Nobody forgets a call back. Overdue follow-ups are flagged to the salesperson and their manager.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & call history",
    text: "Every message, call and note on one timeline, so anyone can pick up where a colleague left off.",
  },
  {
    icon: Receipt,
    title: "Quotes & proposals",
    text: "Send professional quotations in a click, and see when they’re opened.",
  },
  {
    icon: LayoutDashboard,
    title: "Sales dashboards",
    text: "Leads by source, conversion by stage, team performance and revenue forecast — live.",
  },
  {
    icon: Smartphone,
    title: "On every phone",
    text: "Your team updates leads from the field, the site or the showroom floor.",
  },
  {
    icon: ShieldCheck,
    title: "Roles & permissions",
    text: "Everyone sees what they need — and your customer data stays with your company.",
  },
  {
    icon: FileSpreadsheet,
    title: "Migration & training",
    text: "We move your existing leads across and train your team until the CRM is a habit.",
  },
];

const crmProcess = [
  {
    title: "Understand your sale",
    text: "We map how a lead becomes a customer today — the stages, the people and the gaps.",
  },
  {
    title: "Configure",
    text: "Pipelines, fields, roles and automations set up around your process, not a template.",
  },
  {
    title: "Connect",
    text: "Your ads, website forms, WhatsApp and phone lines feed the CRM automatically.",
  },
  {
    title: "Train & support",
    text: "Hands-on training for your team, and support as you grow into it.",
  },
];

const crmFor = [
  "Real estate developers & brokers",
  "Clinics & hospitals",
  "Schools, colleges & coaching",
  "B2B sales & distributors",
  "Showrooms & dealerships",
  "Agencies & service businesses",
];

export function CrmPage() {
  return (
    <>
      <DetailHero
        eyebrow="Customer relationship management"
        title="Never lose a"
        accent="lead again."
        intro="One place for every lead, call and deal. We set up a CRM around how your team actually sells — so every enquiry is captured, every follow-up happens on time and you can see your whole pipeline at a glance."
        scene="automation"
        video={serviceVideo("crm")}
        videoTitle="CRM showreel"
      />

      <DetailSection
        dark
        label="How it flows"
        title="Every source in. Every deal tracked."
        intro="Leads arrive from everywhere you advertise and move through your sales stages — with nothing slipping between the cracks."
      >
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_auto_1.6fr] lg:items-center">
            <ul className="flex flex-wrap gap-2.5">
              {crmSources.map((source) => (
                <li
                  key={source}
                  className="rounded-full border border-ivory/20 px-4 py-2 text-sm font-semibold text-ivory/90"
                >
                  {source}
                </li>
              ))}
            </ul>
            <span className="hidden size-14 place-items-center rounded-full bg-accent text-ink lg:grid">
              <ArrowRight className="size-6" />
            </span>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {crmStages.map((stage, index) => (
                <li
                  key={stage}
                  className={
                    index === crmStages.length - 1
                      ? "rounded-2xl bg-accent p-4 text-ink"
                      : "rounded-2xl border border-ivory/15 bg-ivory/5 p-4"
                  }
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                    Stage {index + 1}
                  </span>
                  <p className="mt-2 font-display text-lg font-bold leading-tight">{stage}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </DetailSection>

      <DetailSection
        label="What you get"
        title="Built around how your team sells."
        intro="Every feature configured for your business — from lead capture to the final invoice."
      >
        <FeatureGrid items={crmFeatures} />
      </DetailSection>

      <DetailSection
        label="How we set it up"
        title="Live in weeks, not months."
        intro="We do the heavy lifting, so your team can start selling from it straight away."
      >
        <StepList steps={crmProcess} />
      </DetailSection>

      <DetailSection
        label="Who it’s for"
        title="Made for businesses that run on enquiries."
        intro="If your growth depends on following up with people, a CRM pays for itself."
      >
        <CheckList items={crmFor} />
      </DetailSection>

      <section className="border-t border-ink/10 px-6 py-16 md:px-14 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>

      <DetailSection label="Works best with" title="Fill the CRM, then automate it.">
        <RelatedServices slugs={["ads", "automations", "ai-agents"]} />
      </DetailSection>

      <ServiceContact
        service="CRM"
        title="Show us how you sell. We’ll build the"
        accent="CRM."
        intro="Tell us a little about your team and where your leads come from. We’ll show you what your pipeline could look like."
        question={{
          label: "Your sales team size",
          options: ["Just me", "2 – 5", "6 – 20", "21 – 50", "50+"],
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ERP                                                                 */
/* ------------------------------------------------------------------ */

const erpModules: Feature[] = [
  {
    icon: Boxes,
    title: "Inventory & warehouse",
    text: "Live stock across locations, batch and expiry tracking, and low-stock alerts.",
  },
  {
    icon: Truck,
    title: "Purchase & vendors",
    text: "Purchase orders, approvals, vendor rates and goods received, all in one flow.",
  },
  {
    icon: Receipt,
    title: "Sales & GST billing",
    text: "Quotations, sales orders and GST-ready invoices generated in seconds.",
  },
  {
    icon: Wallet,
    title: "Accounts & payments",
    text: "Receivables, payables and payment reminders, ready for your accountant.",
  },
  {
    icon: Users,
    title: "HRMS & payroll",
    text: "Attendance, leave, payroll and onboarding — without the spreadsheets.",
  },
  {
    icon: Factory,
    title: "Production & projects",
    text: "Work orders, job cards and project milestones tracked from start to delivery.",
  },
  {
    icon: ClipboardCheck,
    title: "Approvals & roles",
    text: "The right people approve the right things, with a full record of who did what.",
  },
  {
    icon: BarChart3,
    title: "Live reports",
    text: "Sales, stock, cash flow and team output on one dashboard, always up to date.",
  },
  {
    icon: Smartphone,
    title: "Mobile access",
    text: "Check stock, approve orders and see reports from your phone, wherever you are.",
  },
];

const erpBefore = [
  "Stock counted by hand, never quite right",
  "Invoices typed again in a separate tool",
  "Approvals chased on WhatsApp",
  "Reports built late on a Sunday night",
  "Every department with its own spreadsheet",
];

const erpAfter = [
  "Stock updates itself with every sale and purchase",
  "Invoices created straight from the order",
  "Approvals in one click, with a record",
  "Live dashboards whenever you need them",
  "One system, one version of the truth",
];

const erpProcess = [
  {
    title: "Study the operation",
    text: "We walk through how orders, stock, money and people move through your business today.",
  },
  {
    title: "Design the system",
    text: "Modules, approvals and reports planned around your process — only what you need.",
  },
  {
    title: "Build & migrate",
    text: "We build, test and move your existing data across, department by department.",
  },
  {
    title: "Train & grow",
    text: "Your team is trained, and the system grows with new branches, products and people.",
  },
];

const erpFor = [
  "Manufacturing",
  "Trading & distribution",
  "Retail & e-commerce",
  "Construction & real estate",
  "Healthcare & pharma",
  "Education institutions",
];

export function ErpPage() {
  return (
    <>
      <DetailHero
        eyebrow="ERP · HRMS · Business systems"
        title="One system to run your"
        accent="whole business."
        intro="Replace scattered spreadsheets with one connected system. Inventory, billing, accounts, HR and operations working together — built around your business, not the other way round."
        scene="automation"
        video={serviceVideo("erp")}
        videoTitle="ERP showreel"
      />

      <DetailSection
        label="Modules"
        title="Pick what you need. Connect it all."
        intro="Start with the module that hurts most today, then add the rest as you grow."
      >
        <FeatureGrid items={erpModules} />
      </DetailSection>

      <DetailSection dark label="Before & after" title="From spreadsheets to one source of truth.">
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { name: "Without an ERP", items: erpBefore, good: false },
            { name: "With your TDM ERP", items: erpAfter, good: true },
          ].map(({ name, items, good }, index) => (
            <Reveal key={name} delay={index * 100} className="h-full">
              <div
                className={
                  good
                    ? "h-full rounded-[1.5rem] bg-accent p-6 text-ink md:p-10"
                    : "h-full rounded-[1.5rem] border border-ivory/15 bg-ivory/5 p-6 md:p-10"
                }
              >
                <h3
                  className="font-display text-2xl font-bold leading-tight md:text-3xl"
                  style={{ fontStretch: "105%" }}
                >
                  {name}
                </h3>
                <ul className="mt-8 space-y-3.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] font-semibold leading-snug sm:text-base"
                    >
                      <span
                        className={
                          good
                            ? "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-accent"
                            : "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ivory/15 text-ivory/70"
                        }
                      >
                        {good ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : (
                          <X className="size-3" strokeWidth={3} />
                        )}
                      </span>
                      <span className={good ? undefined : "text-ivory/75"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </DetailSection>

      <DetailSection
        label="How we build it"
        title="Rolled out in stages, without disruption."
        intro="Your business keeps running while we move it, one department at a time."
      >
        <StepList steps={erpProcess} />
      </DetailSection>

      <DetailSection
        label="Industries"
        title="Built for businesses that move stock, money and people."
      >
        <CheckList items={erpFor} />
      </DetailSection>

      <section className="border-t border-ink/10 px-6 py-16 md:px-14 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>

      <DetailSection label="Works best with" title="Connect sales to operations.">
        <RelatedServices slugs={["crm", "automations", "ai-agents"]} />
      </DetailSection>

      <ServiceContact
        service="ERP"
        title="Let’s retire the"
        accent="spreadsheets."
        intro="Tell us which part of the business is hardest to keep track of. We’ll map what an ERP would change, and what it would take."
        question={{
          label: "Where do you need it most?",
          options: ["Inventory", "Billing & accounts", "HR & payroll", "Production", "Everything"],
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* AI Agents                                                           */
/* ------------------------------------------------------------------ */

const agentTypes: Feature[] = [
  {
    icon: Globe,
    title: "Website chat agent",
    text: "Answers visitors’ questions instantly and turns them into enquiries, day or night.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp agent",
    text: "Replies to every WhatsApp message in seconds, shares brochures and prices, and books the next step.",
  },
  {
    icon: UserCheck,
    title: "Lead qualification",
    text: "Asks the right questions — budget, location, timeline — and passes only serious leads to sales.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment booking",
    text: "Books site visits, consultations and demos straight into your team’s calendar.",
  },
  {
    icon: Headphones,
    title: "Customer support",
    text: "Handles common questions and order updates, and hands tricky cases to a person.",
  },
  {
    icon: Brain,
    title: "Internal knowledge assistant",
    text: "Your team asks about policies, prices or processes and gets answers from your own documents.",
  },
];

const agentChat = [
  { from: "user", text: "Hi, do you have 3 BHK flats near the bypass?" },
  {
    from: "agent",
    text: "Yes! We have 3 BHK homes from 1,450 sq ft. Are you looking to move in soon, or investing?",
  },
  { from: "user", text: "Moving in, within 6 months." },
  {
    from: "agent",
    text: "Perfect — two towers are ready by then. Shall I book a site visit? Saturday 11 am or Sunday 4 pm?",
  },
  { from: "user", text: "Sunday works." },
  {
    from: "agent",
    text: "Booked for Sunday, 4 pm ✓ Our sales manager will call you to confirm. I’ve sent the brochure here too.",
  },
];

const agentProcess = [
  {
    title: "Train on your business",
    text: "We feed the agent your services, prices, FAQs and documents, in your brand’s tone of voice.",
  },
  {
    title: "Connect your channels",
    text: "Website, WhatsApp and your CRM — so every conversation and lead is recorded automatically.",
  },
  {
    title: "Test & go live",
    text: "We test it against real customer questions with your team before it talks to anyone.",
  },
  {
    title: "Review & improve",
    text: "We read the conversations, fill the gaps and make the agent sharper every week.",
  },
];

const agentGuardrails = [
  "Answers only from your approved information",
  "Hands over to a person when it should",
  "Every conversation saved to your CRM",
  "Replies in your customers’ language",
  "Your data stays private to your business",
  "Works 24/7, including holidays",
];

export function AiAgentsPage() {
  return (
    <>
      <DetailHero
        eyebrow="AI agents & AI tools"
        title="A team member who never"
        accent="sleeps."
        intro="Custom AI agents trained on your business that answer customers, qualify leads and book appointments around the clock — on your website, WhatsApp and internal tools."
        scene="automation"
        video={serviceVideo("ai-agents-chat")}
        videoTitle="AI agents showreel"
      />

      <DetailSection
        label="What our agents do"
        title="Extra hands, without extra headcount."
        intro="Each agent is built for one job and trained on your business, so it answers like your best team member would."
      >
        <FeatureGrid items={agentTypes} />
      </DetailSection>

      <DetailSection
        dark
        label="See it in action"
        title="From first message to booked visit."
        intro="An example of a WhatsApp agent for a real estate project — it answers, qualifies and books, then hands over to your team."
      >
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-ivory/10 bg-ivory/5 p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b border-ivory/10 pb-4">
              <span className="grid size-10 place-items-center rounded-full bg-accent text-ink">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="font-semibold">Project assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-ivory/60">
                  <span className="size-1.5 rounded-full bg-accent" /> Online · replies instantly
                </p>
              </div>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
                Example
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {agentChat.map((message, index) => (
                <li
                  key={index}
                  className={message.from === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <p
                    className={
                      message.from === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-md bg-ivory px-4 py-2.5 text-[15px] font-medium text-ink"
                        : "max-w-[80%] rounded-2xl rounded-bl-md bg-deep-teal px-4 py-2.5 text-[15px] font-medium text-ivory"
                    }
                  >
                    {message.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </DetailSection>

      <DetailSection label="How we build it" title="Trained on your business, tested by your team.">
        <StepList steps={agentProcess} />
      </DetailSection>

      <DetailSection
        label="Safe by design"
        title="Helpful, accurate and always in your control."
        intro="An AI agent speaks for your brand, so we build it with the right limits from day one."
      >
        <CheckList items={agentGuardrails} />
      </DetailSection>

      <section className="border-t border-ink/10 px-6 py-16 md:px-14 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <NumbersStrip />
        </div>
      </section>

      <DetailSection label="Works best with" title="Give your agent a system to work in.">
        <RelatedServices slugs={["crm", "automations", "ads"]} />
      </DetailSection>

      <ServiceContact
        service="AI Agents"
        title="Let’s build your"
        accent="AI teammate."
        intro="Tell us where your customers reach you and what they ask most. We’ll show you what an agent could take off your team’s plate."
        question={{
          label: "Where should the agent work?",
          options: ["Website chat", "WhatsApp", "Internal team tool", "All of these"],
        }}
      />
    </>
  );
}
