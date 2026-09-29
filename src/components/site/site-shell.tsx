import type { ReactNode } from "react";

import { Cursor } from "./cursor";
import { ExperienceProvider } from "./experience";
import { Footer } from "./footer";
import { Nav } from "./nav";
import { Grain, ScrollReveals } from "./scroll-reveals";
import { ScrollHud } from "./scroll-hud";

/**
 * Chrome shared by every page: smooth scroll, cursor, grain, nav, curtain
 * footer. Each route renders its own shell, so a page's scroll triggers and
 * pins are torn down cleanly when you navigate away.
 */
export function SiteShell({ children, hud = false }: { children: ReactNode; hud?: boolean }) {
  return (
    <ExperienceProvider>
      <Cursor />
      <Grain />
      <Nav />
      {/* The scrub bar maps the home page's chapters, so it only rides there. */}
      {hud && <ScrollHud />}

      <main className="relative z-10 bg-ivory">{children}</main>
      <Footer />

      <ScrollReveals />
    </ExperienceProvider>
  );
}
