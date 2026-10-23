import {
  BarChart3,
  BellRing,
  BookOpen,
  Bot,
  Boxes,
  Building2,
  Cable,
  CalendarCheck,
  CalendarDays,
  Camera,
  ChartColumn,
  Clapperboard,
  ClipboardList,
  Contact,
  Drone,
  Film,
  FlaskConical,
  Gauge,
  Globe,
  Headset,
  IdCard,
  LayoutDashboard,
  Magnet,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  MousePointerClick,
  Package,
  Palette,
  PanelsTopLeft,
  PenLine,
  PenTool,
  Plug,
  ReceiptIndianRupee,
  Repeat,
  Route,
  ScanText,
  Search,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  SquareKanban,
  Stamp,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import heroFashion from "@/assets/hero-fashion.jpg";
import heroFitness from "@/assets/hero-fitness.jpg";
import heroHospitality from "@/assets/hero-hospitality.jpg";
import heroProduct from "@/assets/hero-product.jpg";
import heroSocial from "@/assets/hero-social.jpg";
import heroAi from "@/assets/hero-ai.jpg";
import heroBranding from "@/assets/hero-branding.jpg";
import heroEcommerce from "@/assets/hero-ecommerce.jpg";
import heroEvents from "@/assets/hero-events.jpg";

export const images = {
  fashion: heroFashion,
  fitness: heroFitness,
  hospitality: heroHospitality,
  product: heroProduct,
  social: heroSocial,
  ai: heroAi,
  branding: heroBranding,
  ecommerce: heroEcommerce,
  events: heroEvents,
};

// Sections the nav, menu, and bottom scrub-bar can jump to.
export const chapters = [
  { id: "top", label: "Intro" },
  { id: "services", label: "Services" },
  { id: "formats", label: "Formats" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * The home-page sections linked from the navbar and the footer, in page order.
 * The reels section (Formats) is listed as "Work".
 */
export const navSectionLinks = [
  { id: "formats", label: "Work" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

export const clients = [
  "AB Associates",
  "HM Realty",
  "MD Urban Links",
  "Arcura",
  "Tulsi Traders",
  "Redwood Biotech",
  "Dreamnest Properties",
  "Mac Realty",
  "Ideal Group",
  "Omaze",
  "Godrej Properties",
  "SH Infotech",
  "R21 Realty",
  "Pitara",
  "Medical",
  "Journey Singh",
  "Eduwise",
];

// Montage frames for the inline preview pill in the hero headline.
export const heroMontage = [heroFashion, heroProduct, heroHospitality, heroFitness, heroEvents];

// Our services, cycling in the hero's "Experts in …" line.
export const heroFlipWords = [
  "MediaHouse",
  "Ads",
  "Websites",
  "CRM",
  "ERP",
  "Automations",
  "AI Agents",
];

// The home-page Work cards. Each card plays one looping animated showreel
// (or a filmed `video`, once uploaded) and links to its own page.
type WorkCard = {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  /** Animated showreel drawn in code (see work-scenes.tsx). */
  scene: "media" | "web" | "automation" | "ads";
  /** Optional filmed clip; when set it replaces the animated scene. */
  video: string;
  href: "/media-house" | "/websites" | "/automation" | "/services";
  hash?: string;
};

export const categories: WorkCard[] = [
  {
    title: "Brand & Digital Creative",
    eyebrow: "MediaHouse",
    description:
      "Our in-house MediaHouse shapes how your brand looks, sounds and shows up — identity, reels, social content and ad creative made to stop the scroll and stay remembered.",
    icon: PenTool,
    tags: ["Brand identity", "Ad reels", "Social content", "Ad creatives"],
    scene: "media",
    video: "",
    href: "/media-house",
  },
  {
    title: "Websites That Convert",
    eyebrow: "Web & landing pages",
    description:
      "We build websites that convert — fast, beautiful and built around your customer, so every visit has a clear path to an enquiry, booking or sale.",
    icon: Globe,
    tags: ["Web design", "Landing pages", "E-commerce", "Conversion optimisation"],
    scene: "web",
    video: "",
    href: "/websites",
  },
  {
    title: "CRM, Automation & AI",
    eyebrow: "Business systems",
    description:
      "CRM, ERP, workflow automations and AI agents that capture every lead, follow up on time and take the busywork off your team — so the business runs itself while you grow it.",
    icon: Bot,
    tags: ["CRM & ERP", "Workflow automation", "AI agents", "Integrations"],
    scene: "automation",
    video: "",
    href: "/automation",
  },
  {
    title: "Performance Marketing",
    eyebrow: "Google & Meta ads",
    description:
      "Google and Meta campaigns built on sharp targeting, tested creative and profitable bidding — so every rupee of ad spend is accountable.",
    icon: Megaphone,
    tags: ["Google Ads", "Meta Ads", "Retargeting"],
    scene: "ads",
    video: "",
    href: "/services",
    hash: "ads",
  },
];

export const formats = [
  { image: heroProduct, title: "Product", tag: "Launch campaigns that sell" },
  { image: heroSocial, title: "Social Media", tag: "Content that builds community" },
  { image: heroAi, title: "AI Content", tag: "Faster, sharper, scaled" },
  { image: heroBranding, title: "Branding", tag: "Identity that sticks" },
  { image: heroEcommerce, title: "E-commerce", tag: "Stores that convert" },
  { image: heroEvents, title: "Events", tag: "Launches that fill the room" },
];

// Our signature services, as shown in the expertise picker: a short label for
// the pill, the full name and highlight tags for the panel.
export const expertise = [
  {
    short: "AI Automation",
    title: "Autonomous AI & Intelligent Automation",
    icon: Bot,
    highlights: ["AI agents", "Workflow automation"],
    description:
      "AI agents and automated workflows that capture leads, answer customers and run repetitive work around the clock — so your team can focus on growth.",
  },
  {
    short: "Web Experiences",
    title: "Immersive Web Experiences",
    icon: Globe,
    highlights: ["Websites", "Landing pages"],
    description:
      "Powerful, immersive websites and landing pages that load fast, look stunning and are engineered to turn visitors into customers.",
  },
  {
    short: "Business Systems",
    title: "Enterprise Business Systems",
    icon: Boxes,
    highlights: ["CRM", "ERP", "HRMS", "AI tools"],
    description:
      "CRM, ERP, HRMS and custom AI tools that bring every lead, deal, team and process into one system that scales with you.",
  },
  {
    short: "CRM",
    title: "CRM That Closes Deals",
    icon: Users,
    highlights: ["Lead capture", "Pipelines", "Follow-ups"],
    description:
      "One place for every lead, call and deal — captured from ads, website and WhatsApp, assigned instantly and followed up on time, so no enquiry slips away.",
  },
  {
    short: "Ad Reels",
    title: "Conversion-Crafted Ad Reels",
    icon: Clapperboard,
    highlights: ["Creative reels", "Sales-driven"],
    description:
      "Scroll-stopping creative reels scripted around what sells — built to grab attention in seconds and drive real action.",
  },
  {
    short: "Brand Design",
    title: "Brand Identity & Visual Design Systems",
    icon: PenTool,
    highlights: ["Brand identity", "Business graphics"],
    description:
      "Structured, beautiful brand graphics and business-ready visual assets that keep every touchpoint consistent and unmistakably yours.",
  },
  {
    short: "Real Estate 360°",
    title: "Real Estate 360°",
    icon: Building2,
    highlights: ["Aerial drone cinematography", "AI property visualisation"],
    description:
      "A professional end-to-end solution for real estate — from aerial drone shoots and AI property visualisation to campaigns that fill site visits.",
  },
  {
    short: "Performance Ads",
    title: "Performance Marketing Mastery",
    icon: TrendingUp,
    highlights: ["10+ years of ad expertise", "₹230 Cr+ in client sales"],
    description:
      "Over a decade of running ads that pay for themselves — a proven journey of ₹230 Cr+ in sales generated for our clients.",
  },
  {
    short: "Google Ads",
    title: "Google Ads & Search Performance",
    icon: MousePointerClick,
    highlights: ["Search", "Performance Max", "Profitable bidding"],
    description:
      "Campaigns built on Ad Rank, auction insights and impression share — with bidding strategies tuned for profit, not just clicks.",
  },
  {
    short: "Meta Ads",
    title: "Meta Ads Growth Engine",
    icon: Megaphone,
    highlights: ["Facebook", "Instagram", "Precision targeting"],
    description:
      "Facebook and Instagram campaigns that pair audience psychology with sharp targeting to generate leads and sell products at scale.",
  },
  {
    short: "SEO",
    title: "Search Authority & SEO",
    icon: Search,
    highlights: ["Technical SEO", "Content", "Backlink authority"],
    description:
      "Technical health, content and backlink authority working together to rank your website at the top for the searches that matter.",
  },
  {
    short: "CRO Lab",
    title: "Conversion Rate Optimisation Lab",
    icon: BarChart3,
    highlights: ["Analytics audits", "User research", "A/B testing"],
    description:
      "Analytics health checks, user research and testing that sharpen every landing page — so the traffic you already have converts better.",
  },
  {
    short: "Lead Generation",
    title: "Precision Lead Generation",
    icon: Magnet,
    highlights: ["Qualified leads", "Funnels", "Lead nurturing"],
    description:
      "Campaigns and funnels designed to remove your lead bottleneck — delivering a steady flow of qualified, sales-ready prospects.",
  },
  {
    short: "Social Media",
    title: "Social Media Brand Building",
    icon: Share2,
    highlights: ["Content strategy", "Community", "Engagement"],
    description:
      "Consistent, valuable content and community management that grow your audience and turn followers into loyal customers.",
  },
  {
    short: "Graphic Design",
    title: "High-Impact Graphic Design",
    icon: Palette,
    highlights: ["Ad creatives", "Landing visuals", "Email graphics"],
    description:
      "Graphics designed to perform — lifting ad results, landing page conversions and email responses, not just looking good.",
  },
];

// Placeholder benchmarks — every stat renders with a "Reference benchmark"
// note until real client figures replace them.
export const stats = [
  { value: 33, decimals: 0, suffix: "%", label: "More qualified demand" },
  { value: 2.4, decimals: 1, suffix: "×", label: "Stronger creative return" },
  { value: 41, decimals: 0, suffix: "%", label: "Lower cost per result" },
  { value: 18, decimals: 0, suffix: "M", label: "Campaign views" },
];

// Client reviews for the home-page testimonial wall. The first four ride the
// top row, the rest the bottom row. Draft wording — every quote must be
// approved by the named client before it goes live. `name` is optional:
// without it the card leads with the company.
export type Review = {
  service: string;
  quote: string;
  name?: string;
  role: string;
  company: string;
};

export const reviews: Review[] = [
  {
    service: "Web Experiences",
    quote:
      "Working with TDM has been really smooth from day one. They listen properly, share ideas of their own and always deliver on time. It honestly feels like having our own team, not an outside agency.",
    name: "Ravishankar Shukla",
    role: "Founder",
    company: "Redwood Biotech",
  },
  {
    service: "Business Systems",
    quote:
      "What I like most about TDM is how organised they are. Everything is explained clearly, updates come on time, and we always know what is happening. Very professional people to work with.",
    name: "Mayank Jagwani",
    role: "Director",
    company: "MD Urban Links",
  },
  {
    service: "Real Estate 360°",
    quote:
      "The quality of work is excellent. The team understood our brand quickly and everything they made looked premium. We have already recommended them to a few friends in business.",
    role: "Founder",
    company: "HM Realty",
  },
  {
    service: "Brand Design",
    quote:
      "They took time to understand what we actually wanted before starting. Very creative team, easy to talk to, and happy to make changes without any fuss. Really happy with the final result.",
    name: "Dipthi Jagwani",
    role: "Architect",
    company: "Arcusa",
  },
  {
    service: "Performance Ads",
    quote:
      "We had worked with other agencies before, but TDM is on a different level. They are honest, transparent and genuinely care about our results. We finally feel our marketing is in safe hands.",
    role: "Marketing Head",
    company: "Dreamnest Properties",
  },
  {
    service: "AI Automation",
    quote:
      "Super responsive team. Whenever we had a question or an urgent change, they sorted it out quickly. Their technical knowledge is strong and they explain things in simple words.",
    name: "Rohan Mehta",
    role: "CEO",
    company: "SH Infotech",
  },
  {
    service: "Meta Ads",
    quote:
      "Very practical and hardworking team. No big promises, just good work done properly. Our business has grown since we started with them, and we are glad we made the decision.",
    role: "Owner",
    company: "Tulsi Traders",
  },
  {
    service: "Lead Generation",
    quote:
      "From planning to execution, everything was handled very professionally. They are always ready with fresh ideas and never make you feel like a small client. Highly recommended.",
    role: "Co-founder",
    company: "Eduwise",
  },
];

// ─── About page ──────────────────────────────────────────────────────────────

export const aboutCapabilities = [
  { id: "mediahouse", icon: Clapperboard, label: "MediaHouse" },
  { id: "ads", icon: Megaphone, label: "Ads" },
  { id: "websites", icon: Globe, label: "Websites" },
  { id: "crm", icon: Users, label: "CRM" },
  { id: "erp", icon: Boxes, label: "ERP" },
  { id: "automations", icon: Bot, label: "Automations" },
  { id: "ai-agents", icon: Sparkles, label: "AI Agents" },
];

// Who we are: the three statements under the About intro.
export const aboutPillars = [
  {
    label: "Mission",
    title: "Make every frame earn its place.",
    body: "We build campaigns, brands and digital systems that do more than look good — they move people to act and move businesses forward.",
  },
  {
    label: "Vision",
    title: "Creative that’s measured like a business asset.",
    body: "A world where every brand treats content, marketing and technology as one growth engine, not three separate bills.",
  },
  {
    label: "Promise",
    title: "Craft you can see. Results you can count.",
    body: "Every project ships with a clear goal, honest reporting and work we’re proud to put our name on.",
  },
];

// "Same question in your mind?" on About: what people ask about TDM itself
// (the service questions live on the home page and /services).
export const aboutQuestions = [
  {
    question: "Who’s actually behind TDM Groups?",
    answer:
      "A team of strategists, creators, marketers and developers who have spent 10+ years growing brands across India.",
  },
  {
    question: "Why one team instead of separate agencies?",
    answer:
      "Because your content, ads, website and CRM should work as one system. With a single team, nothing gets lost between vendors.",
  },
  {
    question: "Do you only work with big brands?",
    answer:
      "No. We work with founders, family businesses and growing companies, and every client gets the same attention.",
  },
  {
    question: "How do we know it’s working?",
    answer:
      "You get clear goals at the start and honest reports throughout. Every rupee and every lead is tracked.",
  },
  {
    question: "What happens after we sign?",
    answer:
      "We start with discovery into your market, audience and numbers, then share a plan before anything is built.",
  },
];

// How a project moves through the studio.
export const aboutProcess = [
  {
    step: "Discover",
    body: "We dig into your market, your audience and your numbers to find the message that actually matters.",
  },
  {
    step: "Create",
    body: "Strategists, designers, marketers and developers shape the work side by side, so nothing gets lost in a handover.",
  },
  {
    step: "Launch",
    body: "Ads, websites, funnels and automations put the work in front of the right people at the right moment.",
  },
  {
    step: "Grow",
    body: "We track what converts, cut what doesn’t and keep sharpening every next move.",
  },
];

export const aboutValues = [
  "Story before spectacle",
  "Numbers over noise",
  "Craft in every detail",
  "Honest by default",
  "Built to scale",
  "Always learning",
];

export const testimonials = [
  {
    quote: "They understood exactly what we needed and delivered it fast.",
    initials: "RK",
    name: "SH Infratech",
    role: "Client",
  },
  {
    quote: "Sharp work, no delays, no drama. Exactly what we needed.",
    initials: "AV",
    name: "MD-Urban Links",
    role: "Client",
  },
  {
    quote: "They just built it right the first time.",
    initials: "SN",
    name: "Vipulanchal",
    role: "Client",
  },
  {
    quote: "Clear communication, clean execution, no surprises.",
    initials: "KR",
    name: "RedWood Biotech",
    role: "Client",
  },
];

export const industries = [
  { name: "Manufacturing", detail: "Robotics, production lines, quality control" },
  { name: "Healthcare", detail: "Appointment systems, records, diagnostics support" },
  { name: "Retail & E-commerce", detail: "Inventory, recommendations, order processing" },
  { name: "Marketing & Advertising", detail: "Campaigns, CRM, lead nurturing, analytics" },
  { name: "IT & Software", detail: "CI/CD, monitoring, testing, support" },
  {
    name: "Real Estate & Construction",
    detail: "Lead management, documentation, project workflows",
  },
];

// The seven services. Each drives an orbit bubble on the home-page globe
// (`question` + `answer`) and a full section on the /services page, anchored at
// `slug`: a bold `headline`, a plain-spoken `serve` line and `brains`, the people
// thinking behind it. `goodThing` closes each service's own page ("That's the
// good thing about Ads: …") before the cards for the other services.
/** One building block of a service, shown on the services orbit. */
export type ServiceModule = { label: string; icon: LucideIcon };

export const problemSolutions = [
  {
    service: "MediaHouse",
    slug: "mediahouse",
    headline: "Content that makes people stop, remember and buy.",
    serve:
      "We’re your in-house creative studio. We plan, shoot and design the reels, posts and ads your brand runs on, so it looks like nobody else.",
    brains:
      "Strategists, scriptwriters, designers and editors decide what your customer needs to see before a single frame is shot.",
    goodThing: "every reel, post and ad starts with what makes your customer stop and buy.",
    icon: Clapperboard,
    question: "Your content looks like everyone else’s?",
    answer: "Our MediaHouse crafts a look competitors can’t copy.",
    pitch:
      "Every reel, post and creative starts from one question: what makes your customer stop, remember and buy?",
    tagline: "Content & creative studio",
    summary:
      "Our in-house creative studio produces the content your brand runs on — ad reels, social content, brand graphics and real estate visuals, all planned around what makes people stop, remember and buy.",
    includes: [
      "Sales-driven ad reels & short-form video",
      "Social media content calendars",
      "Brand graphics & campaign creatives",
      "Real estate drone shoots & AI property visuals",
      "Product and launch content",
      "Scripts, hooks & creative direction",
    ],
    outcomes: ["Scroll-stopping creative", "One consistent brand look", "Content that converts"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Ad Reels", icon: Film },
      { label: "Scripts & Hooks", icon: PenLine },
      { label: "Content Calendar", icon: CalendarDays },
      { label: "Brand Design", icon: Palette },
      { label: "Product Shoots", icon: Camera },
      { label: "Drone Shoots", icon: Drone },
    ],
  },
  {
    service: "Ads",
    slug: "ads",
    headline: "Ads that bring customers, not just clicks.",
    serve:
      "We run your Google and Meta ads like it’s our own money. Every week we move budget to what sells and cut what doesn’t.",
    brains:
      "Media buyers and analysts check your numbers every week and decide where each rupee should go next.",
    goodThing: "every rupee is tracked, tested and moved to the ads that actually sell.",
    icon: Megaphone,
    question: "Burning budget on ads that don’t convert?",
    answer: "Our Ads team turns spend into signal, not noise.",
    pitch:
      "We test, measure and reallocate every week, so your budget keeps flowing to the ads that actually sell.",
    tagline: "Performance marketing",
    summary:
      "Over a decade of running Google and Meta campaigns that pay for themselves. We plan, launch and optimise every campaign around one thing — profitable leads and sales, with clear reporting on where every rupee goes.",
    includes: [
      "Google Search & Performance Max",
      "Facebook & Instagram (Meta) ads",
      "Lead generation campaigns",
      "Retargeting & remarketing",
      "Conversion tracking & analytics",
      "Weekly optimisation & clear reports",
    ],
    outcomes: ["10+ years of ad expertise", "₹230 Cr+ in client sales", "Lower cost per lead"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Google Ads", icon: Search },
      { label: "Meta Ads", icon: Smartphone },
      { label: "Lead Gen", icon: Magnet },
      { label: "Retargeting", icon: Repeat },
      { label: "A/B Testing", icon: FlaskConical },
      { label: "Analytics", icon: ChartColumn },
    ],
  },
  {
    service: "Websites",
    slug: "websites",
    headline: "Websites that turn visitors into customers.",
    serve:
      "We build websites that truly reflect your brand’s identity. Each one is fast, beautiful and designed around one goal: getting people to call, book or buy.",
    brains:
      "Designers, copywriters and developers plan every page around what your visitor needs to take the next step.",
    goodThing: "every page is built for one thing: turning a visitor into a customer.",
    icon: Globe,
    question: "A website that looks pretty but does nothing?",
    answer: "We build Websites engineered to convert, not just impress.",
    pitch:
      "Each page is planned around one action, whether that’s a call, a booking or a sale, and built to load in a blink.",
    tagline: "Websites & landing pages",
    summary:
      "Fast, immersive websites and landing pages designed around your customer. Every page is built to load quickly, rank well on Google and guide visitors toward one clear action.",
    includes: [
      "Business & corporate websites",
      "High-converting landing pages",
      "E-commerce stores",
      "SEO-ready structure & speed optimisation",
      "Conversion rate optimisation (CRO)",
      "Hosting, security & ongoing support",
    ],
    outcomes: ["More enquiries from the same traffic", "Fast on every device", "Easy to update"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Web Design", icon: PenTool },
      { label: "Landing Pages", icon: PanelsTopLeft },
      { label: "E-commerce", icon: ShoppingCart },
      { label: "SEO", icon: Search },
      { label: "Page Speed", icon: Gauge },
      { label: "Security", icon: ShieldCheck },
    ],
  },
  {
    service: "CRM",
    slug: "crm",
    headline: "Never lose a lead again.",
    serve:
      "We set up a CRM around how your team already sells, so every enquiry is captured, followed up and closed on time.",
    brains:
      "Sales and systems specialists study how your team sells, then shape the CRM to fit, not the other way round.",
    goodThing: "every lead is captured, followed up and never forgotten.",
    icon: Users,
    question: "Leads slipping through the cracks?",
    answer: "Our CRM keeps every lead tracked and every deal alive.",
    pitch:
      "We shape the CRM around how your sales team already works, so they adopt it from day one.",
    tagline: "Customer relationship management",
    summary:
      "One place for every lead, call and deal. We set up and customise a CRM around how your sales team actually works — so no enquiry is forgotten and every follow-up happens on time.",
    includes: [
      "CRM setup & customisation",
      "Lead capture from ads, website & WhatsApp",
      "Sales pipelines & deal stages",
      "Automatic follow-up reminders",
      "Team roles & performance dashboards",
      "Data migration & team training",
    ],
    outcomes: ["No lost leads", "Faster follow-ups", "Clear sales visibility"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Lead Capture", icon: Magnet },
      { label: "Contacts", icon: Contact },
      { label: "Deal Pipeline", icon: SquareKanban },
      { label: "Follow-ups", icon: BellRing },
      { label: "Integrations", icon: Plug },
      { label: "Dashboards", icon: LayoutDashboard },
    ],
  },
  {
    service: "ERP",
    slug: "erp",
    headline: "Run your whole business from one place.",
    serve:
      "Stock, billing, accounts and HR in one connected system built around your process, not a template.",
    brains:
      "Business analysts and engineers map how your company really works before they build a single screen.",
    goodThing: "your whole business finally runs from one place.",
    icon: Boxes,
    question: "Operations held together by spreadsheets and duct tape?",
    answer: "We build ERP systems that actually scale as you grow.",
    pitch:
      "Inventory, accounts, HR and operations in one connected system, designed around your process instead of a template.",
    tagline: "ERP, HRMS & business systems",
    summary:
      "Replace scattered spreadsheets with one connected system. We build ERP and HRMS solutions that bring inventory, accounts, HR and operations together — tailored to your business, not the other way round.",
    includes: [
      "Custom ERP development",
      "Inventory & order management",
      "Billing, accounts & GST-ready invoicing",
      "HRMS — attendance, payroll & leave",
      "Role-based access & approvals",
      "Real-time business reports",
    ],
    outcomes: ["One source of truth", "Less manual work", "Systems that scale with you"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Inventory", icon: Package },
      { label: "Orders", icon: ClipboardList },
      { label: "GST Billing", icon: ReceiptIndianRupee },
      { label: "HR & Payroll", icon: IdCard },
      { label: "Approvals", icon: Stamp },
      { label: "Live Reports", icon: ChartColumn },
    ],
  },
  {
    service: "Automations",
    slug: "automations",
    headline: "Give your team their hours back.",
    serve:
      "We hand the repetitive work to automated workflows, so messages, reports and data move on their own.",
    brains:
      "Process experts find where your team’s hours go, then build workflows that never miss a step.",
    goodThing: "the busywork runs itself, so your team can focus on growth.",
    icon: Bot,
    question: "Your team drowning in repetitive busywork?",
    answer: "We automate the grind so your team can focus on growth.",
    pitch:
      "We map where your team’s hours go, then hand the repetitive parts to workflows that never forget a step.",
    tagline: "Workflow automation",
    summary:
      "We find the repetitive tasks slowing your team down and automate them — connecting your tools so data moves on its own, messages go out on time and reports build themselves.",
    includes: [
      "Workflow & process automation",
      "WhatsApp & email automation",
      "App and tool integrations",
      "Automatic lead routing",
      "Scheduled reports & alerts",
      "Document & data-entry automation",
    ],
    outcomes: ["Hours saved every week", "Fewer human errors", "Team focused on growth"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Workflows", icon: Workflow },
      { label: "WhatsApp & Email", icon: MessageCircle },
      { label: "App Integrations", icon: Cable },
      { label: "Lead Routing", icon: Route },
      { label: "Alerts & Reports", icon: BellRing },
      { label: "Data Entry", icon: ScanText },
    ],
  },
  {
    service: "AI Agents",
    slug: "ai-agents",
    headline: "An extra team that never sleeps.",
    serve:
      "AI agents trained on your business reply to customers, qualify leads and book appointments, day and night.",
    brains:
      "AI engineers train every agent on your business, your tone and your customers’ real questions.",
    goodThing: "your customers get a helpful reply in seconds, day or night.",
    icon: Sparkles,
    question: "Wish you had more hands, without more headcount?",
    answer: "Our AI Agents work around the clock like a full extra team.",
    pitch:
      "Trained on your business and speaking in your tone, our agents reply, qualify and book appointments 24/7.",
    tagline: "AI agents & AI tools",
    summary:
      "Custom AI agents trained on your business that answer customers, qualify leads and handle routine work 24/7 — on your website, WhatsApp and internal tools.",
    includes: [
      "AI chat agents for website & WhatsApp",
      "Lead qualification & appointment booking",
      "Customer support automation",
      "Custom AI tools for your team",
      "Knowledge bases trained on your data",
      "Integration with your CRM & systems",
    ],
    outcomes: ["24/7 instant replies", "More leads handled", "Growth without extra headcount"],
    // The building blocks that orbit the globe while this service is in focus.
    modules: [
      { label: "Chat Agents", icon: MessagesSquare },
      { label: "Lead Qualifier", icon: UserCheck },
      { label: "Appointments", icon: CalendarCheck },
      { label: "24/7 Support", icon: Headset },
      { label: "Knowledge Base", icon: BookOpen },
      { label: "Custom AI Tools", icon: Wrench },
    ],
  },
];

/** Frames → SMPTE-style timecode at 24fps: HH:MM:SS:FF */
export function toTimecode(totalFrames: number, fps = 24) {
  const frames = Math.max(0, Math.floor(totalFrames));
  const ff = frames % fps;
  const totalSeconds = Math.floor(frames / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return [hh, mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");
}
