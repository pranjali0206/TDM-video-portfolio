import { createFileRoute } from "@tanstack/react-router";

import { AiAgentsPage } from "@/components/site/service-pages";
import { SiteShell } from "@/components/site/site-shell";

const title = "AI Agents for Business — TDM Groups";
const description =
  "Custom AI agents trained on your business that answer customers, qualify leads and book appointments 24/7 on your website, WhatsApp and internal tools.";

export const Route = createFileRoute("/ai-agents")({
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
      <AiAgentsPage />
    </SiteShell>
  );
}
