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
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
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
        const target = document.getElementById(id);
        if (cancelled || !target) return;
        ScrollTrigger.refresh();
        const top = target.getBoundingClientRect().top + window.scrollY;
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
