import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tdmLogo from "@/assets/tdm-logo.webp";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { BrainLink } from "./brain-link";
import { chapters } from "./content";
import { useExperience } from "./experience";
import { RollText } from "./primitives";
import { useSectionLinks } from "./use-section-links";

// Pages of their own, then links that scroll to home-page sections.
const pageLinks = [
  { to: "/about", label: "About us" },
  { to: "/services", label: "Services" },
] as const;
// Formats and Reviews stay on the home page but aren't linked from the nav.
const hiddenSections = ["top", "services", "formats", "reviews"];
const sectionLinks = chapters.filter((chapter) => chapter.id === "contact");
// The mobile menu also lists the other home-page sections worth jumping to.
const menuSectionLinks = chapters.filter((chapter) => !hiddenSections.includes(chapter.id));

const barLinkClass =
  "group flex items-center gap-2 rounded-full px-3 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:text-deep-teal xl:px-4 xl:text-[15px]";

const menuLinkClass =
  "group flex items-baseline gap-4 py-2 font-display text-[9.5vw] uppercase leading-none sm:text-[8vw] lg:text-[6vw]";

export function Nav() {
  const { lockScroll } = useExperience();
  const { hrefFor, goTo } = useSectionLinks();
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  // Hide on scroll down, reveal on scroll up; frost the bar once off the top.
  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reveal = gsap
      .from(headerRef.current, { yPercent: -140, duration: 0.6, ease: "power3.out", paused: true })
      .progress(1);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const scrolled = self.scroll() > 80;
        bar.dataset["scrolled"] = String(scrolled);
        if (!scrolled || self.direction === -1) reveal.play();
        else reveal.reverse();
      },
    });
  });

  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menuRef.current, { visibility: "visible" })
        .fromTo(
          menuRef.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
        )
        .from(
          "[data-menu-link]",
          { yPercent: 110, duration: 1, stagger: 0.06, ease: "expo.out" },
          "-=0.35",
        )
        .from("[data-menu-meta]", { opacity: 0, y: 20, duration: 0.8, stagger: 0.05 }, "-=0.7");
    },
    { scope: menuRef },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (menuOpen) tl.timeScale(1).play();
    else tl.timeScale(1.6).reverse();
    lockScroll(menuOpen);

    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, lockScroll]);

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => goTo(id), menuOpen ? 450 : 0);
  };

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-8 md:pt-6">
        <div
          ref={barRef}
          data-scrolled="false"
          className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 rounded-full border border-transparent py-2 pl-4 pr-2 transition-[background-color,border-color,backdrop-filter] duration-500 data-[scrolled=true]:border-ink/10 data-[scrolled=true]:bg-white/70 data-[scrolled=true]:shadow-[0_10px_40px_-20px_rgba(0,40,40,0.35)] data-[scrolled=true]:backdrop-blur-xl md:pl-6"
        >
          <a
            href={hrefFor("top")}
            onClick={(event) => {
              event.preventDefault();
              go("top");
            }}
            className="shrink-0"
            aria-label="TDM Groups — home"
          >
            {/* Negative margins let the larger logo overhang the bar's padding
                instead of making the whole nav bar taller. The image file has
                transparent space either side of the mark, so on phones it is
                pulled left to sit the visible logo in the corner. */}
            <img
              src={tdmLogo}
              alt="TDM Groups"
              className="-my-3 -ml-11 h-16 w-auto md:-my-5 md:ml-0 md:h-20"
            />
          </a>

          {/* Links sit on the right, grouped with the call to action. */}
          <div className="flex items-center gap-2">
            <nav aria-label="Primary" className="mr-3 hidden items-center gap-0.5 lg:flex xl:mr-5">
              {pageLinks.map((page) => (
                <Link
                  key={page.to}
                  to={page.to}
                  className={cn(barLinkClass, "data-[status=active]:text-deep-teal")}
                >
                  <span className="hidden size-1.5 rounded-full bg-glow group-data-[status=active]:block" />
                  <RollText>{page.label}</RollText>
                </Link>
              ))}
              {/* MediaHouse: an icon-only brain that lights up. */}
              <BrainLink className="mx-1" />
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  href={hrefFor(link.id)}
                  onClick={(event) => {
                    event.preventDefault();
                    go(link.id);
                  }}
                  className={barLinkClass}
                >
                  <RollText>{link.label}</RollText>
                </a>
              ))}
            </nav>
            <BrainLink className="lg:hidden" onClick={() => setMenuOpen(false)} />
            <a
              href={hrefFor("contact")}
              onClick={(event) => {
                event.preventDefault();
                go("contact");
              }}
              className="group hidden h-11 items-center gap-2 rounded-full bg-accent pl-5 pr-4 text-sm font-semibold text-ink transition-colors hover:bg-glow sm:inline-flex"
            >
              <RollText>Start a project</RollText>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative z-[60] grid size-11 place-items-center rounded-full border border-ink/15 bg-white/70 backdrop-blur-md lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-5 bg-ink transition-transform duration-500",
                  menuOpen ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-5 bg-ink transition-transform duration-500",
                  menuOpen ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        className="invisible fixed inset-0 z-[45] flex flex-col justify-between bg-accent px-6 pb-8 pt-28 text-ink md:px-14"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Menu" className="flex flex-col">
          {pageLinks.map((page, index) => (
            <div key={page.to} className="overflow-hidden border-b border-ink/15">
              <Link
                data-menu-link
                to={page.to}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className={menuLinkClass}
                style={{ fontStretch: "112%" }}
              >
                <span className="font-mono text-xs tracking-[0.2em] text-ink">0{index + 1}</span>
                <RollText>{page.label}</RollText>
              </Link>
            </div>
          ))}
          {menuSectionLinks.map((chapter, index) => (
            <div key={chapter.id} className="overflow-hidden border-b border-ink/15">
              <a
                data-menu-link
                href={hrefFor(chapter.id)}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault();
                  go(chapter.id);
                }}
                className={menuLinkClass}
                style={{ fontStretch: "112%" }}
              >
                <span className="font-mono text-xs tracking-[0.2em] text-ink">
                  0{index + pageLinks.length + 1}
                </span>
                <RollText>{chapter.label}</RollText>
              </a>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink sm:flex-row sm:items-end sm:justify-between">
          <span data-menu-meta>TDM Groups — Marketing · Technology · Growth</span>
          <span data-menu-meta className="flex items-center gap-2">
            <span className="rec-blink size-2 rounded-full bg-glow" /> Always optimising
          </span>
        </div>
      </div>
    </>
  );
}
