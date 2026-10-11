import { createFileRoute } from "@tanstack/react-router";

import { Contact } from "@/components/site/contact";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TDM Groups" },
      {
        name: "description",
        content:
          "Tell TDM Groups about your goal. We’ll bring the strategy, the technology and the campaigns built to move the numbers.",
      },
      { property: "og:title", content: "Contact TDM Groups — Let’s grow" },
      {
        property: "og:description",
        content: "Share your goal, get a growth plan, launch and scale with TDM Groups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactRoute,
});

function ContactRoute() {
  return (
    <SiteShell>
      {/* Clear the fixed nav; the section brings its own headline and form. */}
      <div id="top" className="pt-20 md:pt-28">
        <Contact />
      </div>
    </SiteShell>
  );
}
