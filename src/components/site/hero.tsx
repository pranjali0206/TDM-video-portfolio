import { Link } from "@tanstack/react-router";
import {
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
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { frame } from "./frame";
import { GrowthTriangle } from "./growth-triangle";
import { PlayIcon } from "./hero-reels";
import { HeroShader } from "./hero-shader";
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
 * Home hero: the promise across the full width; below it, the pitch, every
 * service as a pill, two calls to action and the proof on the left, and the
 * growth triangle (Marketing → Leads → Sales → ∞) on the right. The whole
 * section, nav included, sits on soft WebGL clouds in the brand colours.
 *
 * Measured on one spacing scale: 24px inside the header, 40px from the header
 * to the content, 32px (at least) between content blocks. From lg up the hero
 * fills the screen: the headline and the triangle size themselves to its
 * height, and the left column spreads its blocks evenly so its top and bottom
 * line up with the triangle's.
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
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="top"
      data-hero
      className="relative isolate flex flex-col overflow-hidden bg-ivory font-ui text-hero-ink lg:min-h-svh"
    >
      <HeroShader className="absolute inset-0 -z-10" />
      <div aria-hidden="true" className={cn("shrink-0", NAV_SPACE)} />

      <div
        className={cn(
          frame,
          "flex flex-1 flex-col justify-center gap-10 pb-12 pt-6 lg:gap-[clamp(32px,6.5svh,64px)] lg:py-[clamp(20px,4svh,48px)]",
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Bold, wide (Archivo's expanded width) with teal separators. Each ×
              travels with the word after it, so a wrap never strands one. */}
          <p
            data-hero-item
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-xs font-extrabold uppercase leading-tight tracking-[0.03em] text-hero-ink [font-stretch:125%] md:gap-x-4 md:text-base md:tracking-[0.05em] lg:text-xl"
          >
            <span>Consultation</span>
            {["Digital Marketing", "Technology"].map((word) => (
              <span key={word} className="whitespace-nowrap">
                <span aria-hidden="true" className="mr-2.5 text-hero-teal md:mr-4">
                  ×
                </span>
                {word}
              </span>
            ))}
          </p>

          <h1
            data-hero-item
            className="text-hero-gradient-light hero-sheen text-balance pb-[0.08em] font-display text-[42px] font-extrabold leading-[1.04] tracking-[-0.03em] [font-stretch:normal] md:text-[clamp(44px,5.8vw,58px)] lg:text-[clamp(52px,min(5.4vw,8.8svh),76px)]"
          >
            {/* Phones: one balanced paragraph. md: one clause per line. lg up: two lines. */}
            <span className="md:block md:whitespace-nowrap">
              Turning businesses into brands,
            </span>{" "}
            <span className="md:block md:whitespace-nowrap">
              and brands into profit, <span className="md:block lg:inline">worldwide.</span>
            </span>
          </h1>
        </div>

        {/* Text flush left, triangle flush right. */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[clamp(48px,6vw,112px)]">
          <div className="flex min-w-0 flex-col gap-8 lg:justify-between">
            <p
              data-hero-item
              className="max-w-[560px] text-base leading-[1.55] text-hero-muted md:text-[19px] xl:max-w-[600px] xl:text-xl"
            >
              <span className="font-semibold text-hero-ink">
                Every business has a different problem.
              </span>{" "}
              We find the insight, build the strategy, create the campaign, and engineer the systems
              that <span className="font-semibold text-deep-teal">turn growth into reality.</span>
            </p>

            {/* Every service on one line, gliding left without end. Two copies sit
                side by side so the loop is seamless; hovering or focusing a pill
                holds it. Reduced motion: one still, wrapped row. */}
            <nav
              data-hero-item
              aria-label="Services"
              className="-mx-5 -my-2.5 overflow-hidden py-2.5 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] md:mx-0 motion-reduce:[mask-image:none]"
            >
              <div className="marquee flex w-max [--marquee-duration:40s] focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-reduce:w-auto">
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    inert={copy === 1}
                    aria-hidden={copy === 1 || undefined}
                    className={cn(
                      "flex shrink-0 gap-2.5 pr-2.5 motion-reduce:flex-wrap md:gap-3 md:pr-3",
                      copy === 1 && "motion-reduce:hidden",
                    )}
                  >
                    {services.map(({ label, to, Icon, tone, icon }) => (
                      <Link
                        key={label}
                        to={to}
                        className="inline-flex min-h-12 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-hairline bg-white pl-2 pr-4 text-[15px] font-semibold text-hero-ink shadow-[0_6px_18px_rgba(15,42,44,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(15,42,44,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal md:min-h-14 md:gap-3 md:pl-2.5 md:pr-5 md:text-[17px]"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-8 place-items-center rounded-full md:size-[38px]",
                            tone,
                            icon,
                          )}
                        >
                          <Icon className="size-4 md:size-[18px]" />
                        </span>
                        {label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
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
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-outline bg-white pl-1.5 pr-3 text-sm font-semibold text-hero-ink transition-colors hover:border-hero-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal min-[390px]:pr-3.5 min-[390px]:text-[15px] md:min-h-14 md:flex-none md:gap-3 md:pl-2.5 md:pr-[26px] md:text-[17px]"
              >
                <span className="grid size-8 place-items-center rounded-full bg-chip md:size-[38px]">
                  <PlayIcon className="size-3.5" />
                </span>
                See our work
              </a>
            </div>

            <div data-hero-item>
              <div className="flex border-t border-hairline pt-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "flex min-w-0 flex-auto flex-col gap-1 md:box-content md:flex-[1_1_140px]",
                      index > 0 && "border-l border-hairline pl-2.5 md:pl-5",
                      index < stats.length - 1 && "pr-2.5 md:pr-5",
                    )}
                  >
                    <span className="whitespace-nowrap font-hero text-[22px] font-semibold leading-[normal] tracking-[-0.02em] md:text-[34px] xl:text-[40px]">
                      {stat.value}
                    </span>
                    <span className="text-xs text-hero-muted md:text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GrowthTriangle />
        </div>
      </div>
    </section>
  );
}
