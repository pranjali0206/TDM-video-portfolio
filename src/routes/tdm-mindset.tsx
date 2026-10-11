import { createFileRoute } from "@tanstack/react-router";

import { MindsetPage } from "@/components/site/mindset-page";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/tdm-mindset")({
  head: () => ({
    meta: [
      { title: "The TDM Mindset — TDM Groups" },
      {
        name: "description",
        content:
          "The Purple Cow Effect, the Butterfly Effect and the TDM Effect: the three ideas behind how TDM Groups grows brands.",
      },
      { property: "og:title", content: "The TDM Mindset — Three ideas behind every win" },
      {
        property: "og:description",
        content:
          "Stand out, sharpen every small step and connect it all. How TDM Groups thinks about growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TdmMindset,
});

function TdmMindset() {
  return (
    <SiteShell>
      <MindsetPage />
    </SiteShell>
  );
}
