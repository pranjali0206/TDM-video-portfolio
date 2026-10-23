import { useEffect, useState } from "react";

import tdmMascot from "@/assets/tdm-mascot.webp";
import { cn } from "@/lib/utils";

import { useSectionLinks } from "./use-section-links";

/**
 * The TDM mascot, floating in the bottom-right corner of every page. It bobs
 * gently, waves a "Let's talk!" bubble on hover and opens the contact form.
 * It stays out of the way while the home hero or the footer is on screen, so
 * it never sits on the headline or the TDM wordmark. During the home page's
 * growth process it steps onto that stage instead.
 */
export function FloatingMascot() {
  const { hrefFor, goTo } = useSectionLinks();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // The footer's in-flow wrapper (the footer itself is fixed on desktop, so
    // it would always count as on screen).
    const targets = [
      document.querySelector("[data-hero]"),
      document.getElementById("site-footer"),
    ].filter((el): el is Element => el !== null);
    if (targets.length === 0) {
      setHidden(false);
      return;
    }
    const onScreen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting);
      setHidden([...onScreen.values()].some(Boolean));
    });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={hrefFor("contact")}
      onClick={(event) => {
        event.preventDefault();
        goTo("contact");
      }}
      aria-label="Let’s talk — start a project"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "floating-mascot group fixed bottom-3 right-2 z-40 block w-16 transition-[opacity,translate] duration-500 sm:bottom-5 sm:right-4 sm:w-20 md:w-24",
        hidden && "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span className="pointer-events-none absolute bottom-full right-1/2 mb-1 translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full rounded-br-sm bg-ink px-3 py-1.5 text-xs font-semibold text-ivory opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        Let’s talk!
      </span>
      <img
        src={tdmMascot}
        alt=""
        width={271}
        height={360}
        draggable={false}
        className="mascot-bob block h-auto w-full drop-shadow-[0_14px_18px_rgba(0,40,40,0.28)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
      />
    </a>
  );
}
