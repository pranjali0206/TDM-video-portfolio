import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Clapperboard,
  Globe,
  Layers,
  Megaphone,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { HeroReels, PlayIcon } from "./hero-reels";
import { servicePaths } from "./service-links";
import { useSectionLinks } from "./use-section-links";

/** Every service as a pill: `tone` fills the icon circle (or the dot on phones). */
const services: { label: string; to: string; Icon: LucideIcon; tone: string; icon: string }[] = [
  {
    label: "MediaHouse",
    to: servicePaths.mediahouse,
    Icon: Clapperboard,
    tone: "bg-glow",
    icon: "text-white",
  },
  { label: "Ads", to: servicePaths.ads, Icon: Megaphone, tone: "bg-teal", icon: "text-hero-ink" },
  {
    label: "Websites",
    to: servicePaths.websites,
    Icon: Globe,
    tone: "bg-aqua-soft",
    icon: "text-hero-ink",
  },
  { label: "CRM", to: servicePaths.crm, Icon: Users, tone: "bg-hero-ink", icon: "text-aqua" },
  { label: "ERP", to: servicePaths.erp, Icon: Layers, tone: "bg-peach", icon: "text-hero-ink" },
  {
    label: "Automations",
    to: servicePaths.automations,
    Icon: Zap,
    tone: "bg-hero-teal",
    icon: "text-white",
  },
  {
    label: "AI Agents",
    to: servicePaths["ai-agents"],
    Icon: Sparkles,
    tone: "bg-mint",
    icon: "text-hero-ink",
  },
];

const stats = [
  { value: "10+ yrs", label: "of ad expertise" },
  { value: "₹230 Cr+", label: "in client sales" },
  { value: "7 services", label: "one accountable team" },
];

// The nav is fixed over the hero; this keeps the content clear of it.
const NAV_SPACE = "h-[78px] md:h-[90px]";

/**
 * Home hero: the promise, every service as a pill, two calls to action and the
 * proof on the left; a moving fan of MediaHouse reels on the right. The whole
 * section, nav included, sits on one mesh gradient.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const { hrefFor, goTo } = useSectionLinks();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-item]", {
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
        });
        gsap.from("[data-hero-showcase]", {
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      data-hero
      className="hero-mesh relative flex flex-col overflow-hidden font-ui text-hero-ink lg:min-h-[900px]"
    >
      <div aria-hidden="true" className={cn("shrink-0", NAV_SPACE)} />

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col gap-10 px-5 pb-10 pt-6 md:px-10 md:pb-7 md:pt-9 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-col gap-6 md:gap-7 lg:flex-[1_1_720px]">
          <p
            data-hero-item
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-hero-muted md:text-[13px]"
          >
            Consultation x Digital Marketing × Technology
          </p>

          <h1
            data-hero-item
            className="font-hero text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] text-hero-ink [font-stretch:normal] [font-variation-settings:'opsz'_144] md:text-[44px] md:leading-[1.08] lg:text-[clamp(40px,3.6vw,52px)] xl:text-[52px]"
          >
            <span className="block md:whitespace-nowrap">Marketing that brings leads.</span>
            <span className="block md:whitespace-nowrap">
              Systems that <em className="font-medium italic text-hero-teal">close them.</em>
            </span>
          </h1>

          <p
            data-hero-item
            className="max-w-[540px] text-base leading-[1.55] text-hero-muted md:text-[19px]"
          >
            We find the insight, build the strategy and engineer the systems — ads, websites, CRM,
            ERP and AI automation — that turn attention into revenue.
          </p>

          <nav
            data-hero-item
            aria-label="Services"
            className="flex max-w-[640px] flex-wrap gap-[5px] min-[390px]:gap-1.5 md:gap-2.5"
          >
            {services.map(({ label, to, Icon, tone, icon }, index) => (
              <Fragment key={label}>
                {/* Phones: four pills, then three — never a lone pill on its own row. */}
                {index === 4 && <span aria-hidden="true" className="basis-full md:hidden" />}
                <Link
                  to={to}
                  className="inline-flex min-h-[38px] flex-auto items-center justify-center gap-[5px] whitespace-nowrap rounded-full border border-white/95 bg-white/72 px-[7px] text-xs font-semibold text-hero-ink shadow-[0_4px_14px_rgba(15,42,44,0.07)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(15,42,44,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal min-[390px]:gap-1.5 min-[390px]:px-2.5 min-[390px]:text-[13px] md:min-h-11 md:flex-none md:gap-[9px] md:pl-2 md:pr-4 md:text-sm"
                >
                  <span aria-hidden="true" className={cn("size-2 rounded-full md:hidden", tone)} />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden size-7 place-items-center rounded-full md:grid",
                      tone,
                      icon,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  {label}
                </Link>
              </Fragment>
            ))}
          </nav>

          <div data-hero-item className="flex items-center gap-2.5 md:flex-wrap md:gap-3.5">
            <Link
              to="/contact"
              className="group inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-hero-ink px-3 text-sm font-semibold text-white transition-colors hover:bg-hero-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal focus-visible:ring-offset-2 min-[390px]:px-4 min-[390px]:text-[15px] md:min-h-14 md:flex-none md:gap-2.5 md:px-[30px] md:text-[17px]"
            >
              Start a project
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 group-hover:rotate-45 md:size-[18px]"
              />
            </Link>
            <a
              href={hrefFor("formats")}
              onClick={(event) => {
                event.preventDefault();
                goTo("formats");
              }}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-outline pl-1.5 pr-3 text-sm font-semibold text-hero-ink transition-colors hover:border-hero-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal min-[390px]:pr-3.5 min-[390px]:text-[15px] md:min-h-14 md:flex-none md:gap-3 md:pl-2.5 md:pr-[26px] md:text-[17px]"
            >
              <span className="grid size-8 place-items-center rounded-full bg-chip md:size-[38px]">
                <PlayIcon className="size-3.5" />
              </span>
              See our work
            </a>
          </div>

          <div data-hero-item className="pt-2">
            <div className="flex border-t border-hairline pt-[22px]">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex min-w-0 flex-auto flex-col gap-1 md:box-content md:flex-[1_1_140px]",
                    index > 0 && "border-l border-hairline pl-2.5 md:pl-5",
                    index < stats.length - 1 && "pr-2.5 md:pr-5",
                  )}
                >
                  <span className="whitespace-nowrap font-hero text-[22px] font-semibold leading-[normal] tracking-[-0.02em] md:text-[34px]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-hero-muted md:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HeroReels />
      </div>

      <div className="mx-auto hidden w-full max-w-[1320px] items-center gap-2.5 px-10 pb-[26px] font-mono text-xs uppercase tracking-[0.08em] text-hero-muted md:flex">
        <ArrowDown aria-hidden="true" className="size-4" />
        Scroll to explore
      </div>
    </section>
  );
}
