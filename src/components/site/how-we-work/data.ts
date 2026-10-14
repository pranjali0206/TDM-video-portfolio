import { companyStats, formatStat } from "../company-stats";
import { reelUrls } from "../reels";

/**
 * Content for "How We Work — The Growth Engine". Copy and colours come from
 * the approved prototype (src/docs/how-we-work-reference.dc.html); edit here
 * and the rail, the stage and the mobile cards all follow.
 */

export type GrowthStepId = "create" | "reach" | "convince" | "close" | "automate";

export type GrowthStep = {
  id: GrowthStepId;
  num: string;
  title: string;
  /** Subtitle under an idle rail step. */
  short: string;
  /** Circle fill and the number's colour on it. */
  color: string;
  ink: string;
  desc: string;
};

export const growthSteps: GrowthStep[] = [
  {
    id: "create",
    num: "01",
    title: "Create",
    short: "Videos & ad creatives",
    color: "var(--glow)",
    ink: "#ffffff",
    desc: "Ad creatives and videos built on strong hooks and buyer psychology, made to stop the scroll and convert.",
  },
  {
    id: "reach",
    num: "02",
    title: "Reach",
    short: "Google, Meta, LinkedIn & AI search",
    color: "var(--teal)",
    ink: "var(--hero-ink)",
    desc: "Campaigns on Google, Meta, Instagram, LinkedIn, YouTube and AI search bring the right customers to your business from every direction, so leads keep coming and revenue keeps climbing.",
  },
  {
    id: "convince",
    num: "03",
    title: "Convince",
    short: "Websites that win on Google",
    color: "var(--aqua-soft)",
    ink: "var(--hero-ink)",
    desc: "People search on Google, find you at the top, open a fast, animated website that builds trust, and enquire in seconds.",
  },
  {
    id: "close",
    num: "04",
    title: "Close",
    short: "One CRM + ERP",
    color: "var(--hero-ink)",
    ink: "var(--aqua)",
    desc: "That enquiry lands in your CRM instantly, alongside leads from Meta, Instagram and WhatsApp, so your team calls within minutes. ERP keeps operations running smoothly.",
  },
  {
    id: "automate",
    num: "05",
    title: "Automate",
    short: "AI agents follow up 24/7",
    color: "var(--hero-teal)",
    ink: "#ffffff",
    desc: "AI agents reply instantly, follow up on WhatsApp, book site visits and keep every lead tracked in your CRM, day and night, so no lead goes cold.",
  },
];

/** The "Videos → Ads → … → AI Agents" strip in the header. */
export const loopStrip = [
  { label: "Videos", bg: "var(--glow)", fg: "#ffffff" },
  { label: "Ads", bg: "var(--teal)", fg: "var(--hero-ink)" },
  { label: "Google", bg: "var(--aqua-soft)", fg: "var(--hero-ink)" },
  { label: "Website", bg: "var(--mint)", fg: "var(--hero-ink)" },
  { label: "CRM", bg: "var(--hero-ink)", fg: "var(--aqua)" },
  { label: "AI Agents", bg: "var(--hero-teal)", fg: "#ffffff" },
];

// Same figure as the hero's "₹230 Cr+ in client sales".
const salesStat = companyStats.find((stat) => stat.prefix === "₹") ?? companyStats[0]!;
export const revenueFigure = formatStat(salesStat);

// ─── 01 Create ───────────────────────────────────────────────────────────────

export const createFormats = ["Real estate", "Healthcare", "Architecture", "Documentary"];

/** The fanned reels, left to right. `featured` is the big centre card. */
export type CreateReel = ReturnType<typeof reelUrls> & {
  label: string;
  width: number;
  height: number;
  rotate: number;
  featured?: boolean;
};

export const createReels: CreateReel[] = [
  {
    ...reelUrls("medical", "medical-01"),
    label: "Healthcare explainer reel",
    width: 158,
    height: 280,
    rotate: -5,
  },
  {
    ...reelUrls("real-estate", "alpine"),
    label: "HM Realty aerial reel",
    width: 190,
    height: 338,
    rotate: 0,
    featured: true,
  },
  {
    ...reelUrls("architecture", "air-homes-omaxe-hills"),
    label: "Architecture walkthrough reel",
    width: 158,
    height: 280,
    rotate: 5,
  },
  {
    ...reelUrls("real-estate", "godrej-greenview"),
    label: "Project walkthrough reel",
    width: 140,
    height: 248,
    rotate: 8,
  },
];

// ─── 02 Reach ────────────────────────────────────────────────────────────────

export type ReachSource = {
  badge: string;
  icon?: "sparkles" | "play";
  name: string;
  note: string;
  color: string;
  x: number;
  y: number;
  /** Curve from the chip to the hub, in artboard coordinates. */
  path: string;
  delay: number;
};

export const reachSources: ReachSource[] = [
  {
    badge: "G",
    name: "Google Ads",
    note: "Search intent",
    color: "#3b6fd8",
    x: 10,
    y: 36,
    path: "M160 60 C 240 60, 250 160, 314 185",
    delay: 0,
  },
  {
    badge: "M",
    name: "Meta Ads",
    note: "Facebook feed",
    color: "#6d5bd0",
    x: 10,
    y: 186,
    path: "M160 210 L 305 210",
    delay: 0.3,
  },
  {
    badge: "IG",
    name: "Instagram",
    note: "Reels & stories",
    color: "#e8693a",
    x: 10,
    y: 336,
    path: "M160 360 C 240 360, 250 260, 314 235",
    delay: 0.6,
  },
  {
    badge: "Li",
    name: "LinkedIn",
    note: "B2B decision makers",
    color: "#1f6fa8",
    x: 600,
    y: 36,
    path: "M600 60 C 520 60, 510 160, 446 185",
    delay: 0.15,
  },
  {
    badge: "AI",
    icon: "sparkles",
    name: "AI search",
    note: "ChatGPT, Gemini…",
    color: "#1fa39d",
    x: 600,
    y: 186,
    path: "M600 210 L 455 210",
    delay: 0.45,
  },
  {
    badge: "YT",
    icon: "play",
    name: "YouTube",
    note: "Video ads",
    color: "#d64545",
    x: 600,
    y: 336,
    path: "M600 360 C 520 360, 510 260, 446 235",
    delay: 0.75,
  },
];

export const reachLeadPings = [
  { label: "+1 lead · Google Ads", color: "#3b6fd8" },
  { label: "+1 lead · LinkedIn", color: "#1f6fa8" },
  { label: "+1 lead · AI search", color: "#1fa39d" },
];

// ─── Sample lead (illustrative data, used in steps 03–05) ────────────────────

export const sampleLead = {
  name: "Ananya Sharma",
  firstName: "Ananya",
  initials: "AS",
  phone: "98XXX XX021",
  lookingFor: "3BHK · Vijay Nagar",
  source: "Website",
  score: 86,
  scoreLabel: "Hot",
  nextVisit: "Sat 11 AM",
};

// ─── 03 Convince ─────────────────────────────────────────────────────────────

export const convinceSite = {
  query: "premium plots in indore",
  domain: "hmrealtyindore.com",
  title: "HM Realty — Premium plotted developments in Indore",
  snippet: "Layouts, pricing and site visits. Enquire in seconds.",
  heroImage: reelUrls("real-estate", "alpine").poster,
  heroLine: "Your dreams, our responsibility.",
  formTitle: "Book a free site visit",
  badges: ["SEO-ready", "Fast loading", "Mobile-first"],
};

// ─── 04 Close ────────────────────────────────────────────────────────────────

export const closeSources = [
  { label: "Meta Ads", color: "#3b6fd8", path: "M0 22 C 50 22, 40 130, 90 130" },
  { label: "Instagram", color: "#e8693a", path: "M0 76 C 50 76, 40 130, 90 130" },
  { label: "WhatsApp", color: "#1fa36b", path: "M0 130 L 90 130" },
  { label: "Google search", color: "#d7a32a", path: "M0 184 C 50 184, 40 130, 90 130" },
  { label: "Website form", color: "#0f7a78", path: "M0 238 C 50 238, 40 130, 90 130" },
];

export type CrmCard = { label: string; accent: string; note?: string; highlight?: boolean };

/** Illustrative CRM board. The first NEW card is the same lead from step 03. */
export const crmColumns: { title: string; won?: boolean; cards: CrmCard[] }[] = [
  {
    title: "NEW",
    cards: [
      {
        label: `${sampleLead.firstName} · ${sampleLead.source}`,
        note: "just now",
        accent: "#a9c43a",
        highlight: true,
      },
      { label: "Priya · Plot", accent: "#1fa36b" },
      { label: "Amit · Villa", accent: "#e8693a" },
    ],
  },
  {
    title: "QUALIFIED",
    cards: [
      { label: "Neha · 2BHK", accent: "#d7a32a" },
      { label: "Karan · Office", accent: "#0f7a78" },
    ],
  },
  { title: "SITE VISIT", cards: [{ label: "Sneha · Plot", accent: "#3b6fd8" }] },
  { title: "WON", won: true, cards: [{ label: "Vikas · 3BHK", accent: "#a9c43a" }] },
];

export const leadTimeline = [
  { time: "12:04", label: "Form submitted" },
  { time: "12:04", label: "Added to CRM" },
  { time: "12:06", label: "Sales called ✓", done: true },
];

export const erpModules = ["Inventory", "Billing & GST", "Projects", "Team & HR"];

// ─── 05 Automate ─────────────────────────────────────────────────────────────

export type FollowUp = {
  when: string;
  title: string;
  detail: string;
  status: string;
  tone: "done" | "won" | "later";
};

export const followUps: FollowUp[] = [
  {
    when: "Instantly",
    title: "WhatsApp reply",
    detail: `"Hi ${sampleLead.firstName}, thanks for your enquiry! Here's the brochure and price list."`,
    status: "Sent ✓",
    tone: "done",
  },
  {
    when: "+2 min",
    title: "Call task created",
    detail: "Assigned to your sales team with the full lead history.",
    status: "Done ✓",
    tone: "done",
  },
  {
    when: "Day 1",
    title: "Reminder on WhatsApp",
    detail: `"Would Saturday 11 AM work for a site visit?"`,
    status: "Replied ✓",
    tone: "done",
  },
  {
    when: "Day 2",
    title: "Site visit booked",
    detail: `Calendar invite and reminders sent to ${sampleLead.firstName} and your team.`,
    status: "Booked ✓",
    tone: "won",
  },
  {
    when: "Day 7",
    title: "Re-engage if quiet",
    detail: "No reply? The agent follows up again, automatically.",
    status: "Scheduled",
    tone: "later",
  },
];
