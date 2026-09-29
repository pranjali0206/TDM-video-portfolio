import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/components/site/about-page";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TDM Groups" },
      {
        name: "description",
        content:
          "TDM Groups is a digital marketing and technology company — performance ads, SEO, websites, CRM, ERP, automations and AI agents that turn attention into growth.",
      },
      { property: "og:title", content: "About TDM Groups — Where clicks become growth" },
      {
        property: "og:description",
        content: "Data-driven marketing and technology, built to turn attention into revenue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <AboutPage />
    </SiteShell>
  );
}
