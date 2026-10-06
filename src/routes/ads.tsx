import { createFileRoute } from "@tanstack/react-router";

import { AdsPage } from "@/components/site/service-pages";
import { SiteShell } from "@/components/site/site-shell";

const title = "Performance Marketing & Ads — TDM Groups";
const description =
  "Google and Meta ad campaigns from TDM Groups that pay for themselves: search, Performance Max, YouTube, Meta lead ads, Click-to-WhatsApp and retargeting, with ₹230 Cr+ in client sales generated.";

export const Route = createFileRoute("/ads")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <AdsPage />
    </SiteShell>
  );
}
