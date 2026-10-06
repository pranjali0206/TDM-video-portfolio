import { createFileRoute } from "@tanstack/react-router";

import { ClientMarquee } from "@/components/site/client-marquee";
import { Contact } from "@/components/site/contact";
import { FormatsRing } from "@/components/site/formats-ring";
import { Hero } from "@/components/site/hero";
import { Impact } from "@/components/site/impact";
import { Expertise, Services } from "@/components/site/services";
import { SiteShell } from "@/components/site/site-shell";
import { Testimonials } from "@/components/site/testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TDM Groups — Digital marketing & technology company" },
      {
        name: "description",
        content:
          "TDM Groups is a digital marketing and technology company: performance ads, SEO, websites, CRM, automation and AI agents that turn attention into leads, sales and growth.",
      },
      { property: "og:title", content: "TDM Groups — Make attention mean something" },
      {
        property: "og:description",
        content:
          "Performance marketing, high-converting websites and smart automation for businesses that want real growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell hud>
      <Hero />
      <Impact />
      <Services />
      <ClientMarquee />
      <FormatsRing />
      <Expertise />
      <Testimonials />
      <Contact />
    </SiteShell>
  );
}
