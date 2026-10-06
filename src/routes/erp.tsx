import { createFileRoute } from "@tanstack/react-router";

import { ErpPage } from "@/components/site/service-pages";
import { SiteShell } from "@/components/site/site-shell";

const title = "ERP & HRMS Systems — TDM Groups";
const description =
  "Custom ERP and HRMS from TDM Groups: inventory, purchase, GST billing, accounts, payroll and live reports in one connected system built around your business.";

export const Route = createFileRoute("/erp")({
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
      <ErpPage />
    </SiteShell>
  );
}
