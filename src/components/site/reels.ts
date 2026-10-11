// Client reels, hosted on Cloudflare R2. Each reel lives in its industry
// folder as three files: `<slug>.mp4` (full, with sound), `<slug>-preview.mp4`
// (8-second silent loop) and `<slug>.jpg` (poster).
//
// Switch this to the custom domain (e.g. https://videos.<domain>) before launch.
export const VIDEO_BASE = "https://pub-4a4a71388ba343228db895feb4113376.r2.dev";

/**
 * `wide` marks a landscape (16:9) film; reels are vertical (9:16) by default.
 * `kind` files a reel under one of its industry's `kinds` (sub-categories),
 * and `seconds` is its running time. `folder` is the R2 folder when it isn't
 * the industry's own (the "All" picks come from every folder).
 */
export type Reel = {
  slug: string;
  title: string;
  wide?: boolean;
  kind?: string;
  seconds?: number;
  folder?: string;
};

/** A sub-category inside an industry, picked from that industry's dropdown. */
export type ReelKind = { id: string; label: string };

/**
 * `id` is also the R2 folder. An industry with no reels yet still gets a tab,
 * showing a "coming soon" card until its folder is uploaded.
 */
export type ReelIndustry = { id: string; label: string; reels: Reel[]; kinds?: ReelKind[] };

// Real estate splits by length: anything over a minute is a plotting reel
// (a full project walkthrough), a minute or less is an ad reel.
const PLOTTING_MIN_SECONDS = 60;
const byLength = (reels: (Reel & { seconds: number })[]): Reel[] =>
  reels.map((reel) => ({ ...reel, kind: reel.seconds > PLOTTING_MIN_SECONDS ? "plotting" : "ad" }));

export const reelIndustries: ReelIndustry[] = [
  {
    id: "real-estate",
    label: "Real Estate",
    kinds: [
      { id: "plotting", label: "Plotting reels" },
      { id: "ad", label: "Ad reels" },
    ],
    // Running times measured from the uploaded files.
    reels: byLength([
      { slug: "alpine", title: "Alpine", seconds: 64.1 },
      { slug: "forum", title: "Forum", seconds: 66.4 },
      { slug: "shiv-kutir", title: "Shiv Kutir", seconds: 47.7 },
      { slug: "hm-2", title: "HM Realty", seconds: 56.6 },
      { slug: "godrej-greenview", title: "Godrej Greenview Estate", seconds: 60.0 },
      { slug: "aditya-gateway", title: "Aditya Gateway", seconds: 57.2 },
      { slug: "cybercity-micromitti", title: "Cybercity by Micromitti", seconds: 55.7 },
      { slug: "real-estate-reel-01", title: "Real estate reel 01", seconds: 22.3 },
      { slug: "real-estate-reel-02", title: "Real estate reel 02", seconds: 30.7 },
      { slug: "real-estate-reel-03", title: "Real estate reel 03", seconds: 48.9 },
      { slug: "real-estate-reel-04", title: "Real estate reel 04", seconds: 44.4 },
      { slug: "real-estate-reel-05", title: "Real estate reel 05", seconds: 38.5 },
      { slug: "real-estate-reel-06", title: "Real estate reel 06", seconds: 63.2 },
      { slug: "real-estate-reel-07", title: "Real estate reel 07", seconds: 46.0 },
      { slug: "real-estate-reel-08", title: "Real estate reel 08", seconds: 71.0 },
      { slug: "real-estate-reel-09", title: "Real estate reel 09", seconds: 14.5 },
    ]),
  },
  {
    id: "architecture",
    label: "Architecture",
    // The three films so far each walk through a whole home, inside and out.
    // The other kinds fill in as interior-only, exterior-only, etc. films arrive.
    kinds: [
      { id: "walkthrough", label: "Full walkthroughs" },
      { id: "interior", label: "Interior" },
      { id: "exterior", label: "Exterior" },
      { id: "commercial", label: "Commercial" },
      { id: "turnkey", label: "Turnkey execution" },
    ],
    reels: [
      {
        slug: "jayram-mali-house",
        title: "Jayram Mali 10 BHK House",
        wide: true,
        kind: "walkthrough",
      },
      { slug: "barsana", title: "Barsana", wide: true, kind: "walkthrough" },
      { slug: "air-homes-omaxe-hills", title: "Air Homes, Omaxe Hills", kind: "walkthrough" },
    ],
  },
  {
    id: "medical",
    label: "Medical",
    reels: [
      { slug: "medical-01", title: "4 dental treatments explained" },
      { slug: "medical-03", title: "Denture consultation" },
      { slug: "medical-04", title: "Bad denture vs good denture" },
      { slug: "medical-05", title: "Dental care, close up" },
    ],
  },
  {
    // Matches the R2 folder name, which is spelled "documentry".
    id: "documentry",
    label: "Documentary",
    reels: [
      { slug: "documentary-01", title: "Redwood Biotech — Founder interview", wide: true },
      { slug: "documentary-02", title: "Redwood Biotech — Story" },
    ],
  },
  // Coming soon: add each one's reels as its R2 folder (named after `id`) is uploaded.
  { id: "clothing", label: "Clothing", reels: [] },
  { id: "fmcg", label: "FMCG", reels: [] },
  { id: "ai-character", label: "AI Character Videos", reels: [] },
  { id: "education", label: "Education", reels: [] },
  { id: "cinematic", label: "Cinematic", reels: [] },
  { id: "beauty", label: "Beauty Brands", reels: [] },
  { id: "traders", label: "Traders", reels: [] },
  { id: "product", label: "Product", reels: [] },
  { id: "fitness", label: "Fitness", reels: [] },
];

/**
 * The "All" tab: the best reels from every industry, in this order. Each pick
 * is `[industry id, reel slug]`, looked up in `reelIndustries` so titles and
 * shapes stay in one place.
 */
const featuredPicks: [string, string][] = [
  ["architecture", "jayram-mali-house"],
  ["documentry", "documentary-01"],
  ["real-estate", "alpine"],
  ["architecture", "air-homes-omaxe-hills"],
  ["medical", "medical-01"],
  ["real-estate", "forum"],
  ["documentry", "documentary-02"],
  ["real-estate", "godrej-greenview"],
  ["medical", "medical-04"],
  ["real-estate", "aditya-gateway"],
  ["real-estate", "shiv-kutir"],
  ["real-estate", "cybercity-micromitti"],
];

export const featuredReels: Reel[] = featuredPicks.flatMap(([industryId, slug]) => {
  const reel = reelIndustries
    .find((industry) => industry.id === industryId)
    ?.reels.find((item) => item.slug === slug);
  return reel ? [{ ...reel, folder: industryId }] : [];
});

export const reelUrls = (industry: string, slug: string) => {
  const base = `${VIDEO_BASE}/${industry}/${slug}`;
  return { full: `${base}.mp4`, preview: `${base}-preview.mp4`, poster: `${base}.jpg` };
};

/**
 * Reels for the home page's "One idea. Infinite momentum." ring: vertical
 * clips from every MediaHouse industry. `industry` is the R2 folder and the
 * MediaHouse tab each one opens.
 */
export const ringReels = [
  { industry: "real-estate", slug: "alpine", title: "Alpine" },
  { industry: "medical", slug: "medical-01", title: "4 dental treatments explained" },
  { industry: "real-estate", slug: "forum", title: "Forum" },
  { industry: "architecture", slug: "air-homes-omaxe-hills", title: "Air Homes, Omaxe Hills" },
  { industry: "real-estate", slug: "shiv-kutir", title: "Shiv Kutir" },
  { industry: "documentry", slug: "documentary-02", title: "Redwood Biotech — Story" },
  { industry: "real-estate", slug: "aditya-gateway", title: "Aditya Gateway" },
  { industry: "medical", slug: "medical-04", title: "Bad denture vs good denture" },
  { industry: "real-estate", slug: "godrej-greenview", title: "Godrej Greenview Estate" },
  { industry: "real-estate", slug: "hm-2", title: "HM Realty" },
  { industry: "real-estate", slug: "cybercity-micromitti", title: "Cybercity by Micromitti" },
  { industry: "medical", slug: "medical-03", title: "Denture consultation" },
];
