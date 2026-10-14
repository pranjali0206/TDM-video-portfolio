import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tdmLogo from "@/assets/tdm-logo.webp";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { chapters, problemSolutions } from "./content";
import { useExperience } from "./experience";
import { RollText } from "./primitives";
import { servicePath } from "./service-links";
import { useSectionLinks } from "./use-section-links";

// Pages of their own, then links that scroll to home-page sections.
const pageLinks = [
  { to: "/about", label: "About us" },
  { to: "/services", label: "Services" },
] as const;
// The mobile menu skips the hero, Services and Formats (the bar links Formats as "Work").
const hiddenSections = ["top", "services", "formats"];
// The bar's home-page links: the reels (Formats) as "Work", then Reviews and Contact.
const barSectionLinks = [
  { id: "formats", label: "Work" },
  ...chapters.filter((chapter) => chapter.id === "reviews" || chapter.id === "contact"),
];
// The mobile menu also lists the other home-page sections worth jumping to.
const menuSectionLinks = chapters.filter((chapter) => !hiddenSections.includes(chapter.id));

const barLinkClass =
  "group flex items-center gap-2 py-2 font-ui text-[15px] font-medium text-hero-ink transition-colors hover:text-hero-teal";

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
      {/* Transparent at the top so the hero's gradient runs behind it; frosted
          once the page has scrolled. */}
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div
          ref={barRef}
          data-scrolled="false"
          className="border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 data-[scrolled=true]:border-hero-ink/10 data-[scrolled=true]:bg-white/75 data-[scrolled=true]:backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-5 py-4 md:px-10 md:py-[22px]">
            <a
              href={hrefFor("top")}
              onClick={(event) => {
                event.preventDefault();
                go("top");
              }}
              className="shrink-0"
              aria-label="TDM Groups — home"
            >
              {/* The image file has transparent space either side of the mark,
                  so on phones it is pulled left to sit the visible logo in the corner. */}
              <img src={tdmLogo} alt="TDM Groups" className="-ml-8 h-[46px] w-auto md:ml-0" />
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-[34px] lg:flex">
              <Link to="/about" className={cn(barLinkClass, "data-[status=active]:text-hero-teal")}>
                <span className="hidden size-1.5 rounded-full bg-glow group-data-[status=active]:block" />
                <RollText>About</RollText>
              </Link>
              <ServicesMenu label="Services" />
              {barSectionLinks.map((link) => (
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

            <div className="flex items-center gap-2">
              <a
                href={hrefFor("contact")}
                onClick={(event) => {
                  event.preventDefault();
                  go("contact");
                }}
                className="group hidden min-h-11 items-center gap-2 rounded-full bg-hero-ink px-[22px] font-ui text-[15px] font-semibold text-white transition-colors hover:bg-hero-teal sm:inline-flex"
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
                className="relative z-[60] grid size-11 place-items-center rounded-full border border-hero-ink/15 bg-white/70 backdrop-blur-md lg:hidden"
              >
                <span
                  className={cn(
                    "absolute h-px w-5 bg-hero-ink transition-transform duration-500",
                    menuOpen ? "rotate-45" : "-translate-y-[4px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-px w-5 bg-hero-ink transition-transform duration-500",
                    menuOpen ? "-rotate-45" : "translate-y-[4px]",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="site-menu"
        data-lenis-prevent
        className="invisible fixed inset-0 z-[45] flex flex-col justify-between gap-8 overflow-y-auto bg-accent px-6 pb-8 pt-28 text-ink md:px-14"
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
              {page.to === "/services" && (
                <div data-menu-link className="flex flex-wrap gap-2 pb-4 pt-1">
                  {problemSolutions.map((service) => (
                    <Link
                      key={service.slug}
                      to={servicePath(service.slug)}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border border-ink/25 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-accent"
                    >
                      {service.service}
                    </Link>
                  ))}
                </div>
              )}
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

/**
 * "Services" in the bar: the link still opens the Services page, and hovering
 * (or the chevron, for touch and keyboard) drops down every service, each
 * leading to its own page.
 */
function ServicesMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // A short delay so the pointer can cross the gap into the panel.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        to="/services"
        onClick={() => setOpen(false)}
        className={cn(barLinkClass, "data-[status=active]:text-hero-teal")}
      >
        <span className="hidden size-1.5 rounded-full bg-glow group-data-[status=active]:block" />
        <RollText>{label}</RollText>
      </Link>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="services-menu"
        aria-label={open ? "Hide services" : "Show services"}
        className="-mr-2 grid size-7 place-items-center rounded-full text-hero-ink transition-colors hover:text-hero-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
      >
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        id="services-menu"
        className={cn(
          "absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-4 transition-[opacity,transform,visibility] duration-300",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <ul className="rounded-3xl border border-ink/10 bg-white/95 p-2 shadow-[0_24px_60px_-24px_rgba(0,40,40,0.45)] backdrop-blur-xl">
          {problemSolutions.map((service) => {
            const Icon = service.icon;
            return (
              <li key={service.slug}>
                <Link
                  to={servicePath(service.slug)}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary data-[status=active]:bg-secondary"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-ink">
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="flex-1 font-display text-sm font-bold uppercase tracking-[0.06em] text-ink">
                    {service.service}
                  </span>
                  <ArrowUpRight className="size-4 text-ink/40 transition-[transform,color] duration-300 group-hover:rotate-45 group-hover:text-deep-teal" />
                </Link>
              </li>
            );
          })}
          <li className="mt-1 border-t border-ink/10 pt-1">
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-deep-teal transition-colors hover:bg-secondary"
            >
              All services
              <ArrowUpRight className="size-4" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
