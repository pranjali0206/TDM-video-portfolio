import type { ReactNode } from "react";

import { ExperienceProvider } from "./experience";
import { FloatingMascot } from "./floating-mascot";
import { Footer } from "./footer";
import { WhatsAppButton } from "./whatsapp-button";
import { Nav } from "./nav";
import { ScrollReveals } from "./scroll-reveals";
import { ScrollHud } from "./scroll-hud";

/**
 * Chrome shared by every page: smooth scroll, nav, curtain
 * footer. Each route renders its own shell, so a page's scroll triggers and
 * pins are torn down cleanly when you navigate away.
 */
export function SiteShell({
  children,
  hud = false,
  floating = "mascot",
}: {
  children: ReactNode;
  hud?: boolean;
  /** What floats in the bottom-right corner: the TDM mascot, or a WhatsApp chat button. */
  floating?: "mascot" | "whatsapp";
}) {
  return (
    <ExperienceProvider>
      <Nav />
      {/* The scrub bar maps the home page's chapters, so it only rides there. */}
      {hud && <ScrollHud />}

      <main className="relative z-10 bg-ivory">{children}</main>
      <Footer />
      {floating === "whatsapp" ? <WhatsAppButton /> : <FloatingMascot />}

      <ScrollReveals />
    </ExperienceProvider>
  );
}
