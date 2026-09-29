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
          "A small, senior team that treats every project like it’s going in the portfolio. MediaHouse, ads, websites, CRM, ERP, automations and AI agents — since 2019.",
      },
      { property: "og:title", content: "About TDM Groups — What’s up" },
      {
        property: "og:description",
        content: "We make people stop and ask, who made that? Sharp work, shipped fast.",
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
