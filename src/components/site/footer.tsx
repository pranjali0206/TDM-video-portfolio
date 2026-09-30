import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tdmLogo from "@/assets/tdm-logo.webp";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { chapters } from "./content";
import { useExperience } from "./experience";
import { RollText } from "./primitives";
import { useSectionLinks } from "./use-section-links";

const indexLinkClass = "group w-fit text-ink transition-colors hover:text-ink";

const istTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

/**
 * Curtain footer: it sits fixed beneath the page and is uncovered as the last
 * section scrolls away, with the wordmark rising into place.
 */
export function Footer() {
  const { scrollTo } = useExperience();
  const { hrefFor, goTo } = useSectionLinks();
  const rootRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setTime(istTime());
    const id = window.setInterval(() => setTime(istTime()), 15000);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-wordmark]",
        { yPercent: 60, opacity: 0.3 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  const links = chapters.filter((chapter) => chapter.id !== "top");

  return (
    <div
      ref={rootRef}
      id="site-footer"
      className="relative h-[42rem] md:h-[40rem]"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <footer className="fixed bottom-0 left-0 flex h-[42rem] w-full flex-col justify-between overflow-hidden bg-accent px-6 pb-6 pt-16 text-ink md:h-[40rem] md:px-14 md:pt-20 lg:px-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <img src={tdmLogo} alt="TDM Groups" className="h-12 w-auto brightness-0" />
            <p className="mt-6 max-w-sm font-serif text-3xl italic leading-tight text-ink">
              Click by click, we make attention mean something.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 content-start gap-x-6 gap-y-3 text-sm"
          >
            <p className="col-span-2 mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
              Index
            </p>
            <Link to="/about" className={indexLinkClass}>
              <RollText>About us</RollText>
            </Link>
            {links.map((chapter) => (
              <a
                key={chapter.id}
                href={hrefFor(chapter.id)}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(chapter.id);
                }}
                className={indexLinkClass}
              >
                <RollText>{chapter.label}</RollText>
              </a>
            ))}
          </nav>
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink">
                Studio time · IST
              </p>
              <p
                className="mt-2 font-display text-4xl tabular-nums"
                style={{ fontStretch: "118%" }}
              >
                {time}
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollTo("#top")}
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-ink/25 py-2 pl-5 pr-2 text-sm font-semibold transition-colors hover:border-ink hover:bg-white/30"
            >
              <RollText>Back to top</RollText>
              <span className="grid size-8 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:-translate-y-0.5">
                <ArrowUp className="size-4" />
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <svg
            data-wordmark
            viewBox="0 0 1000 170"
            className="w-full"
            role="img"
            aria-label="TDM Groups"
          >
            <defs>
              <linearGradient id="wordmark-fill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--ink)" />
                <stop offset="100%" stopColor="var(--deep-teal)" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="150"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#wordmark-fill)"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontStretch: "125%",
                fontSize: 190,
              }}
            >
              TDM GROUPS
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
          <span>© {new Date().getFullYear()} TDM Groups</span>
          <span>Marketing · Technology · Growth</span>
          <span className="flex items-center gap-2">
            <span className="rec-blink size-1.5 rounded-full bg-glow" /> Always optimising
          </span>
        </div>
      </footer>
    </div>
  );
}
