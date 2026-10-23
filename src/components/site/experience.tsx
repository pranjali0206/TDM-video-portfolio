import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

type ScrollTarget = string | number | HTMLElement;

type ScrollOptions = {
  immediate?: boolean;
  /** Pixels added to the target's position (negative lands above it). */
  offset?: number;
};

type ExperienceValue = {
  scrollTo: (target: ScrollTarget, options?: ScrollOptions) => void;
  lockScroll: (locked: boolean) => void;
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return value;
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis
 * share one clock. Each page mounts its own provider (via SiteShell); the
 * router owns where a page starts — top, restored position, or a #section.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // A menu left open on the previous page may have locked scrolling.
    document.documentElement.style.overflow = "";

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (!prefersReducedMotion()) {
      // Long, gliding wheel scroll: each notch travels further than native and
      // eases out over a long expo tail, so one flick carries across a section.
      lenis = new Lenis({
        smoothWheel: true,
        wheelMultiplier: 1.6,
        duration: 1.5,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Arriving on a #section (e.g. /#work from the About page): the router has
    // already jumped there; land again once fonts have settled the layout.
    let cancelled = false;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) {
      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        // Contact lands on its headline, clear of the nav, so the form shows too.
        const contactTitle =
          id === "contact" ? document.querySelector<HTMLElement>("[data-contact-title]") : null;
        const target = contactTitle ?? document.getElementById(id);
        if (cancelled || !target) return;
        ScrollTrigger.refresh();
        const navHeight = document.querySelector<HTMLElement>("header.fixed")?.offsetHeight ?? 0;
        // The nav bar stays on screen, so sections land just below it.
        const clearance = contactTitle ? navHeight + 48 : id === "top" ? 0 : navHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - clearance;
        if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
        else window.scrollTo(0, top);
      });
    }

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const scrollTo = useCallback((target: ScrollTarget, options?: ScrollOptions) => {
    const lenis = lenisRef.current;
    const element =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (element === null) return;
    const offset = options?.offset ?? 0;

    if (lenis) {
      lenis.scrollTo(element, {
        offset,
        duration: options?.immediate ? 0 : 1.6,
        immediate: options?.immediate ?? false,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }

    const top =
      typeof element === "number" ? element : element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + offset });
  }, []);

  const value = useMemo(() => ({ scrollTo, lockScroll }), [scrollTo, lockScroll]);

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
