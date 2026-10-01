import {
  BarChart3,
  Bot,
  Boxes,
  Building2,
  Clapperboard,
  Globe,
  Magnet,
  Megaphone,
  MousePointerClick,
  Palette,
  PenTool,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
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
  { id: "studio", label: "Studio" },
  { id: "work", label: "Work" },
  { id: "formats", label: "Formats" },
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

export const categories = [
  {
    title: "Performance Marketing",
    description:
      "Google and Meta campaigns built on sharp targeting, tested creative and profitable bidding — so every rupee of ad spend is accountable.",
    icon: Megaphone,
    tags: ["Google Ads", "Meta Ads", "Retargeting"],
  },
  {
    title: "SEO & Content Strategy",
    description:
      "Technical SEO, local search and content that ranks — putting your business in front of people already searching for what you sell.",
    icon: Search,
    tags: ["Technical SEO", "Local SEO", "Content strategy"],
  },
  {
    title: "Websites & Landing Pages",
    description:
      "Fast, modern websites and landing pages engineered to convert — designed around your customer, measured on every click.",
    icon: Globe,
    tags: ["Web design", "Landing pages", "Conversion optimisation"],
  },
  {
    title: "CRM, Automation & AI",
    description:
      "CRM, ERP, workflow automations and AI agents that capture every lead, remove busywork and let your business scale without the chaos.",
    icon: Bot,
    tags: ["CRM & ERP", "Workflow automation", "AI agents"],
  },
  {
    title: "Brand & Digital Creative",
    description:
      "One clear brand idea carried through identity, social content and ad creative — built to stand out and perform on every channel.",
    icon: PenTool,
    tags: ["Brand identity", "Social content", "Ad creatives"],
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

// How a project moves through the studio.
export const aboutProcess = [
  {
    step: "Discover",
    body: "We dig into your market, your audience and your numbers to find the message that actually matters.",
  },
  {
    step: "Create",
    body: "Strategy, creative, websites and automations — designed and built together under one roof.",
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

// The seven services. Each drives an orbit bubble on the home-page globe, the
// rotating "Same question in your mind?" card on About, and a full section on
// the /services page (anchored at `slug`).
export const problemSolutions = [
  {
    service: "MediaHouse",
    slug: "mediahouse",
    icon: Clapperboard,
    question: "Your content looks like everyone else’s?",
    answer: "Our MediaHouse crafts a look competitors can’t copy.",
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
  },
  {
    service: "Ads",
    slug: "ads",
    icon: Megaphone,
    question: "Burning budget on ads that don’t convert?",
    answer: "Our Ads team turns spend into signal, not noise.",
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
  },
  {
    service: "Websites",
    slug: "websites",
    icon: Globe,
    question: "A website that looks pretty but does nothing?",
    answer: "We build Websites engineered to convert, not just impress.",
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
  },
  {
    service: "CRM",
    slug: "crm",
    icon: Users,
    question: "Leads slipping through the cracks?",
    answer: "Our CRM keeps every lead tracked and every deal alive.",
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
  },
  {
    service: "ERP",
    slug: "erp",
    icon: Boxes,
    question: "Operations held together by spreadsheets and duct tape?",
    answer: "We build ERP systems that actually scale as you grow.",
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
  },
  {
    service: "Automations",
    slug: "automations",
    icon: Bot,
    question: "Your team drowning in repetitive busywork?",
    answer: "We automate the grind so your team can focus on growth.",
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
  },
  {
    service: "AI Agents",
    slug: "ai-agents",
    icon: Sparkles,
    question: "Wish you had more hands, without more headcount?",
    answer: "Our AI Agents work around the clock like a full extra team.",
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
