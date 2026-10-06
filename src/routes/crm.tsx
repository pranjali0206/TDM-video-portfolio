import { createFileRoute } from "@tanstack/react-router";

import { CrmPage } from "@/components/site/service-pages";
import { SiteShell } from "@/components/site/site-shell";

const title = "CRM Setup & Customisation — TDM Groups";
const description =
  "A CRM built around how your team sells: every lead captured from ads, website, WhatsApp and calls, auto-assigned, followed up on time and tracked to the sale.";

export const Route = createFileRoute("/crm")({
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
      <CrmPage />
    </SiteShell>
  );
}
