import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tdmLogoMark from "@/assets/tdm-logo-mark.webp";

import { chapters } from "./content";
import { useExperience } from "./experience";
import { RollText } from "./primitives";
import { useSectionLinks } from "./use-section-links";

const indexLinkClass = "group w-fit text-ivory/80 transition-colors hover:text-aqua";

// The TDM GROUPS wordmark is Archivo 900 at its condensed 68% width, which
// sets almost exactly 1000 units wide at size 190 — so it fills the box
// natively. (It used to be the 125% width squashed to fit with textLength /
// lengthAdjust, which Safari on iPhone doesn't apply: the text ran 1706 units
// wide and was cut off after "TDM GR".)
const WORDMARK_WIDTH = 1000;
const WORDMARK_HEIGHT = 170;

/**
 * Curtain footer: from tablet up it sits fixed beneath the page and is
 * uncovered as the last section scrolls away. The TDM GROUPS wordmark is
 * drawn in place from the start (no rise-in), so it's whole and crisp the
 * moment it's uncovered. The footer is never taller than the screen, so on
 * short laptops the logo at its top isn't pushed off-screen. On phones it
 * simply follows the page at its natural height, so nothing gets squeezed.
 */
export function Footer() {
  const { scrollTo } = useExperience();
  const { hrefFor, goTo } = useSectionLinks();
  const wordmarkRef = useRef<SVGTextElement>(null);
  const [wordmarkWidth, setWordmarkWidth] = useState(WORDMARK_WIDTH);

  // Once the font is in, size the box to the text as this browser actually
  // draws it, so the whole name always fits — whatever the engine, or if a
  // fallback font stands in.
  useEffect(() => {
    const text = wordmarkRef.current;
    if (!text) return;
    let active = true;
    const fit = () => {
      const width = text.getComputedTextLength();
      if (active && width > 0) setWordmarkWidth(Math.ceil(width) + 2);
    };
    fit();
    void document.fonts?.ready.then(fit);
    return () => {
      active = false;
    };
  }, []);
  // Services has its own page, linked separately below.
  const links = chapters.filter(
    (chapter) => !["top", "services", "formats", "reviews"].includes(chapter.id),
  );

  return (
    <div
      id="site-footer"
      className="relative md:h-[min(40rem,100svh)] md:[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"
    >
      <footer className="relative flex w-full flex-col justify-between gap-10 overflow-hidden bg-night px-6 pb-28 pt-14 text-ivory md:fixed md:bottom-0 md:left-0 md:h-[min(40rem,100svh)] md:gap-0 md:px-14 md:pb-6 md:pt-[clamp(32px,8svh,80px)] lg:px-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:gap-12">
          <div>
            {/* The logo trimmed to its mark, in white so it reads on the dark
                ground; big enough that GROUPS stays legible. */}
            <img
              src={tdmLogoMark}
              alt="TDM Groups"
              width={789}
              height={451}
              className="h-14 w-auto brightness-0 invert md:h-16"
            />
            <p className="mt-5 max-w-sm font-display font-bold text-[1.75rem] leading-tight text-ivory md:mt-6 md:text-3xl">
              Click by click, we make attention mean something.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 content-start gap-x-6 gap-y-3 text-sm"
          >
            <p className="col-span-2 mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-aqua">
              Index
            </p>
            <Link to="/about-us" className={indexLinkClass}>
              <RollText>About us</RollText>
            </Link>
            <Link to="/services" className={indexLinkClass}>
              <RollText>Services</RollText>
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
          <div className="flex md:items-start">
            <button
              type="button"
              onClick={() => scrollTo("#top")}
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-ivory/25 py-2 pl-5 pr-2 text-sm font-semibold transition-colors hover:border-aqua hover:bg-white/10"
            >
              <RollText>Back to top</RollText>
              <span className="grid size-8 place-items-center rounded-full bg-aqua text-night transition-transform duration-500 group-hover:-translate-y-0.5">
                <ArrowUp className="size-4" />
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <svg
            viewBox={`0 0 ${wordmarkWidth} ${WORDMARK_HEIGHT}`}
            className="w-full"
            role="img"
            aria-label="TDM Groups"
          >
            <defs>
              <linearGradient id="wordmark-fill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--aqua)" />
                <stop offset="100%" stopColor="var(--hero-teal)" />
              </linearGradient>
            </defs>
            <text
              ref={wordmarkRef}
              x="0"
              y="150"
              fill="url(#wordmark-fill)"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontStretch: "68%",
                fontSize: 190,
              }}
            >
              TDM GROUPS
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-ivory/15 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:pr-24 md:pr-28">
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
