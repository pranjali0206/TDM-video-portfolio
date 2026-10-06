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
          "TDM Groups is an AI-powered business consulting company. We give you the tools to automate your operations and grow your sales, backed by deep market understanding and sharp strategy.",
      },
      { property: "og:title", content: "About TDM Groups — Where clicks become growth" },
      {
        property: "og:description",
        content:
          "AI-powered business consulting: tools to automate your operations and grow your sales.",
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
