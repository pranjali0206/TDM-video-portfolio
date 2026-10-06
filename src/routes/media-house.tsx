import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { MediaHousePage } from "@/components/site/work-pages";

export const Route = createFileRoute("/media-house")({
  // ?tab=<industry> opens the reels on that industry (e.g. from the home ring).
  validateSearch: (search: Record<string, unknown>): { tab?: string } =>
    typeof search["tab"] === "string" ? { tab: search["tab"] } : {},
  head: () => ({
    meta: [
      { title: "MediaHouse — Brand & Digital Creative — TDM Groups" },
      {
        name: "description",
        content:
          "TDM Groups' in-house creative studio: brand identity, ad reels, social media content and ad creatives built to stand out and perform.",
      },
      { property: "og:title", content: "MediaHouse — Brand & Digital Creative — TDM Groups" },
      {
        property: "og:description",
        content:
          "TDM Groups' in-house creative studio: brand identity, ad reels, social media content and ad creatives built to stand out and perform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MediaHouse,
});

function MediaHouse() {
  return (
    <SiteShell>
      <MediaHousePage />
    </SiteShell>
  );
}
