import {
  BarChart3,
  Bot,
  Boxes,
  Clapperboard,
  ClipboardCheck,
  Facebook,
  Filter,
  Globe,
  MapPin,
  Megaphone,
  Package,
  PenTool,
  Search,
  Share2,
  ShoppingCart,
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
  { id: "reel", label: "Showcase" },
  { id: "studio", label: "Studio" },
  { id: "work", label: "Work" },
  { id: "formats", label: "Formats" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

export const clients = [
  "Godrej",
  "MD-Urban Links.",
  "RedWood Biotech",
  "SH Infratech",
  "HM Reality",
  "Rural Edibles",
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

export const expertise = [
  {
    title: "Google Ads",
    icon: Search,
    description:
      "Don't waste money running Google Ads campaigns without understanding the Ad rank, Auction Insights, Impression Share, and, most importantly, the profitable bidding strategies.",
  },
  {
    title: "Facebook Ads",
    icon: Facebook,
    description:
      "Reaching and influencing people to take appropriate actions on your Facebook ads requires real psychology and targeting skills. We have worked on hundreds of Facebook advertising accounts across industries to generate leads and sell physical products.",
  },
  {
    title: "SEO",
    icon: TrendingUp,
    description:
      "As the best seo company in India, we optimize websites to rank in top search results for the targeted keywords. Our SEO services are comprehensive suite of content marketing, technical wellness and backlinks authority.",
  },
  {
    title: "Conversion Rate Optimisation",
    icon: BarChart3,
    description:
      "We help you improve the user experience on the landing pages to improve the conversion rate. We do analytics health checks, user research, insights gathering, qualitative and quantitative research.",
  },
  {
    title: "Sales Funnel",
    icon: Filter,
    description:
      "A single tool can fulfill all of your performance marketing needs. Through Clickfunnels, we create profitable sales funnels, digital marketing strategies, and web pages.",
  },
  {
    title: "Ecommerce Marketing",
    icon: ShoppingCart,
    description:
      "We help eCommerce brands to scale with our digital marketing services by providing comprehensive Google Ads, Facebook Ads, and SEO solutions. As a leading eCommerce marketing agency, Our eCommerce strategies are based on ROI and profits to enable a brand growth and sustainability.",
  },
  {
    title: "Amazon Marketing",
    icon: Package,
    description:
      "Amazon is no longer an option for merchants to scale their business. We can help you become the best seller on Amazon. We use contextual and interest-based advertising strategies with a sales funnel to generate sales and reviews on the Amazon store. Get in touch for a free consultation.",
  },
  {
    title: "Lead Generation",
    icon: Users,
    description:
      "Utilize our expertise in lead generation with digital marketing. We enable businesses to remove their bottleneck of lead generation by using effective digital marketing campaigns.",
  },
  {
    title: "Local SEO",
    icon: MapPin,
    description:
      "Local search engine optimization is an essential tool for growing a local business. Local customers can reach your business point, explore the best eCommerce marketing services, leave feedback, and use Google Maps to visit you.",
  },
  {
    title: "Social Media Marketing",
    icon: Share2,
    description:
      "More than a billion people are active on social media. The latest updates on social networking sites make the job of a Social Media Strategist even more responsible for delivering better and more valued content to reach the audience.",
  },
  {
    title: "Graphic Designing",
    icon: PenTool,
    description:
      "Our graphic designing services are specialized to boost your digital marketing results. We make graphics to boost your ads performance, landing pages conversions, and email campaigns responses.",
  },
  {
    title: "Auditing",
    icon: ClipboardCheck,
    description:
      "Hire our marketing experts to audit your existing team marketing campaigns on the regular basis so we can guide them to get the maximum ROI of your marketing dollars. Our auditing services include Google Ads, Facebook Ads, CRO, SEO, and Content Marketing.",
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
// top row, the rest the bottom row.
export const reviews = [
  {
    service: "Websites",
    quote:
      "The new site doesn’t just look sharp — it converts. Signups went up before we even ran a single ad.",
    name: "Ravishankar Shukla",
    role: "Founder",
    company: "RedWood Biotech",
  },
  {
    service: "CRM",
    quote:
      "No lead falls through the cracks anymore. Our sales team actually trusts the pipeline now.",
    name: "Mayank Jagwani",
    role: "CEO",
    company: "MD-Urban Links",
  },
  {
    service: "MediaHouse",
    quote:
      "Our content finally looks like nobody else’s in the space. Engagement doubled in the first month.",
    name: "Dipthi Jagwani",
    role: "Architect",
    company: "Arcura Studio",
  },
  {
    service: "Ads",
    quote:
      "We stopped guessing with ad spend. Every rupee is accountable now. CAC dropped by a third.",
    name: "Vipul Jain",
    role: "Founder",
    company: "Vipulanchal",
  },
  {
    service: "ERP",
    quote:
      "We went from three spreadsheets and a prayer to one system that actually talks to itself.",
    name: "Vikram Malhotra",
    role: "Operations Head",
    company: "Aveer Destino",
  },
  {
    service: "Automations",
    quote:
      "The repetitive stuff just handles itself now. My team finally has time to think, not just process.",
    name: "Ananya Iyer",
    role: "COO",
    company: "Veranya Veda",
  },
  {
    service: "AI Agents",
    quote: "It genuinely feels like we hired three extra people, without hiring anyone.",
    name: "Rohan Mehta",
    role: "CEO",
    company: "SH Infratech",
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

// One problem → solution pair per service; powers the rotating
// "Same question in your mind?" card.
export const problemSolutions = [
  {
    service: "MediaHouse",
    icon: Clapperboard,
    question: "Your content looks like everyone else’s?",
    answer: "Our MediaHouse crafts a look competitors can’t copy.",
  },
  {
    service: "Ads",
    icon: Megaphone,
    question: "Burning budget on ads that don’t convert?",
    answer: "Our Ads team turns spend into signal, not noise.",
  },
  {
    service: "Websites",
    icon: Globe,
    question: "A website that looks pretty but does nothing?",
    answer: "We build Websites engineered to convert, not just impress.",
  },
  {
    service: "CRM",
    icon: Users,
    question: "Leads slipping through the cracks?",
    answer: "Our CRM keeps every lead tracked and every deal alive.",
  },
  {
    service: "ERP",
    icon: Boxes,
    question: "Operations held together by spreadsheets and duct tape?",
    answer: "We build ERP systems that actually scale as you grow.",
  },
  {
    service: "Automations",
    icon: Bot,
    question: "Your team drowning in repetitive busywork?",
    answer: "We automate the grind so your team can focus on growth.",
  },
  {
    service: "AI Agents",
    icon: Sparkles,
    question: "Wish you had more hands, without more headcount?",
    answer: "Our AI Agents work around the clock like a full extra team.",
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
