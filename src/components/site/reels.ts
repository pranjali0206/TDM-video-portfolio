// Client reels, hosted on Cloudflare R2. Each reel lives in its industry
// folder as three files: `<slug>.mp4` (full, with sound), `<slug>-preview.mp4`
// (8-second silent loop) and `<slug>.jpg` (poster).
//
// Switch this to the custom domain (e.g. https://videos.<domain>) before launch.
export const VIDEO_BASE = "https://pub-4a4a71388ba343228db895feb4113376.r2.dev";

/** `wide` marks a landscape (16:9) film; reels are vertical (9:16) by default. */
export type Reel = { slug: string; title: string; wide?: boolean };

export type ReelIndustry = { id: string; label: string; reels: Reel[] };

const numbered = (prefix: string, label: string, count: number): Reel[] =>
  Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return { slug: `${prefix}-reel-${number}`, title: `${label} reel ${number}` };
  });

// Industries with no reels yet are hidden; add them here as folders are uploaded.
export const reelIndustries: ReelIndustry[] = [
  {
    id: "real-estate",
    label: "Real Estate",
    reels: [
      { slug: "alpine", title: "Alpine" },
      { slug: "forum", title: "Forum" },
      { slug: "shiv-kutir", title: "Shiv Kutir" },
      { slug: "hm-2", title: "HM Realty" },
      { slug: "godrej-greenview", title: "Godrej Greenview Estate" },
      { slug: "aditya-gateway", title: "Aditya Gateway" },
      { slug: "cybercity-micromitti", title: "Cybercity by Micromitti" },
      ...numbered("real-estate", "Real estate", 9),
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    reels: [
      { slug: "jayram-mali-house", title: "Jayram Mali 10 BHK House", wide: true },
      { slug: "barsana", title: "Barsana", wide: true },
      { slug: "air-homes-omaxe-hills", title: "Air Homes, Omaxe Hills" },
    ],
  },
  { id: "commercial", label: "Commercial", reels: [] },
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
];

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
