import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { AutomationPage } from "@/components/site/work-pages";

export const Route = createFileRoute("/automation")({
  head: () => ({
    meta: [
      { title: "CRM, Automation & AI — TDM Groups" },
      {
        name: "description",
        content:
          "How TDM Groups automates businesses with CRM, ERP, HRMS, workflow automation and AI agents — every lead captured, every task on time.",
      },
      { property: "og:title", content: "CRM, Automation & AI — TDM Groups" },
      {
        property: "og:description",
        content:
          "How TDM Groups automates businesses with CRM, ERP, HRMS, workflow automation and AI agents — every lead captured, every task on time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Automation,
});

function Automation() {
  return (
    <SiteShell>
      <AutomationPage />
    </SiteShell>
  );
}
