import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { WebsitesPage } from "@/components/site/work-pages";

export const Route = createFileRoute("/websites")({
  head: () => ({
    meta: [
      { title: "Websites That Convert — TDM Groups" },
      {
        name: "description",
        content:
          "Fast, conversion-focused websites, landing pages and e-commerce stores from TDM Groups, with industry expertise across real estate, healthcare, retail and more.",
      },
      { property: "og:title", content: "Websites That Convert — TDM Groups" },
      {
        property: "og:description",
        content:
          "Fast, conversion-focused websites, landing pages and e-commerce stores from TDM Groups, with industry expertise across real estate, healthcare, retail and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Websites,
});

function Websites() {
  return (
    <SiteShell>
      <WebsitesPage />
    </SiteShell>
  );
}
