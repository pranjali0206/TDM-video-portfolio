import { createFileRoute } from "@tanstack/react-router";

import { ServicesPage } from "@/components/site/services-page";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — TDM Groups" },
      {
        name: "description",
        content:
          "MediaHouse, Ads, Websites, CRM, ERP, Automations and AI Agents — creative, marketing and technology services from TDM Groups, built to turn attention into growth.",
      },
      { property: "og:title", content: "Services — TDM Groups" },
      {
        property: "og:description",
        content: "Everything your business needs to grow — creative, marketing and technology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <SiteShell>
      <ServicesPage />
    </SiteShell>
  );
}
