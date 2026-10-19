import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bot, Lock, UserRound } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { FormatsRing } from "./formats-ring";
import { VideoSlot } from "./primitives";
import { FlowCard, Sticker } from "./process-flow";
import { servicePath } from "./service-links";

/**
 * "Walk through our process of profit": one flow of full-screen cards, each
 * step in its own colour, every card sliding up over the one before it. The
 * reel ring opens it (Create); then Reach, Convert, Manage and Automate, and
 * a closing line. The floating mascot leaves its corner to walk the visitor
 * through: amazed by the reels, climbing the ads mountain, showing off the
 * website, pulling leads in with a magnet and handing replies to AI.
 */
export function GrowthProcess() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // The corner mascot steps into the flow, and back out after it.
      ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          document.documentElement.dataset["mascot"] = self.isActive ? "away" : "";
        },
      });
      const cleanup = () => {
        delete document.documentElement.dataset["mascot"];
      };
      if (prefersReducedMotion()) return cleanup;

      // The cards stack like a deck: each one stops just under the nav (a
      // little lower than the one before, so their edges peek out) and stays
      // until the closing card arrives, shrinking back and dimming a touch as
      // the next card comes over it. A card taller than the screen stops once
      // its bottom is in view instead.
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      const last = cards[cards.length - 1]!;
      const stopAt = (index: number) => STACK_TOP + index * STACK_STEP;
      cards.forEach((card, index) => {
        card.style.zIndex = String(index + 1);
        const next = cards[index + 1];
        if (!next) return;
        ScrollTrigger.create({
          trigger: card,
          start: () =>
            card.offsetHeight > window.innerHeight - stopAt(index)
              ? "bottom bottom"
              : `top ${stopAt(index)}px`,
          endTrigger: last,
          end: "top top",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        const covered = {
          trigger: next,
          start: "top bottom",
          end: () => `top ${stopAt(index + 1)}px`,
          scrub: true,
          invalidateOnRefresh: true,
        };
        gsap.to(card.querySelector("[data-card-inner]"), {
          scale: 0.94,
          ease: "none",
          scrollTrigger: covered,
        });
        gsap.to(card.querySelector("[data-card-shade]"), {
          opacity: 0.12,
          ease: "none",
          scrollTrigger: covered,
        });
      });

      const pop = (selector: string, trigger: string, delay = 0) =>
        gsap.fromTo(
          selector,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay,
            ease: "back.out(3)",
            scrollTrigger: { trigger, start: "top 60%", toggleActions: "play none none reverse" },
          },
        );

      // Create: the mascot bounces in beside the reels… and is amazed.
      gsap.fromTo(
        "[data-sticker='create']",
        { x: "-40vw", rotate: -25, opacity: 0 },
        {
          x: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: "[data-step='create']",
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      );
      pop("[data-sticker='create'] [data-say]", "[data-step='create']", 1);

      // Reach: the mountain rises as you scroll, the mascot climbs it.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-mountain]",
            start: "top 90%",
            end: "bottom 70%",
            scrub: 0.8,
          },
        })
        .fromTo(
          "[data-mountain-clip]",
          { attr: { width: 0 } },
          { attr: { width: 1200 }, duration: 1 },
          0,
        )
        .fromTo(
          "[data-sticker='reach']",
          { left: ridge[0]!.left, top: ridge[0]!.top },
          { keyframes: ridge.slice(1), duration: 1 },
          0,
        )
        .fromTo(
          "[data-peak-chip]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.12, stagger: 0.28 },
          0.2,
        )
        .fromTo(
          "[data-flag]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.1 },
          0.9,
        );
      pop("[data-sticker='reach'] [data-say]", "[data-mountain]", 0.2);

      // Convert: the mascot walks across to the website.
      gsap.fromTo(
        "[data-sticker='convert']",
        { x: "55vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-step='convert']",
            start: "top 85%",
            end: "top 25%",
            scrub: 0.8,
          },
        },
      );
      pop("[data-sticker='convert'] [data-say]", "[data-step='convert']", 0.6);

      // Manage: leads fly in from all sides into the magnet, and each one
      // turns up in the CRM.
      const pull = gsap.timeline({
        defaults: { ease: "power2.in" },
        scrollTrigger: {
          trigger: "[data-magnet-field]",
          start: "top 85%",
          end: "center 45%",
          scrub: 0.8,
        },
      });
      magnetLeads.forEach((lead, index) => {
        const at = index * PULL_GAP;
        pull
          .fromTo(
            `[data-magnet-lead='${index}']`,
            { left: lead.left, top: lead.top, rotate: lead.rotate, scale: 1, opacity: 1 },
            { left: "50%", top: MAGNET_MOUTH, rotate: 0, scale: 0.4, duration: PULL_TIME },
            at,
          )
          .to(`[data-magnet-lead='${index}']`, { opacity: 0, duration: 0.04 }, at + PULL_TIME)
          .fromTo(
            `[data-crm-avatar='${index}']`,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.08, ease: "back.out(3)" },
            at + PULL_TIME,
          );
      });
      pop("[data-sticker='manage']", "[data-step='manage']");
      pop("[data-sticker='manage'] [data-say]", "[data-step='manage']", 0.5);

      // Automate: the chat plays out like a real one.
      const chat = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-chat]",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      const say = (selector: string, at: number) =>
        chat.fromTo(selector, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, at);
      const unsay = (selector: string, at: number) =>
        chat.to(selector, { opacity: 0, duration: 0.15 }, at);
      say("[data-chat-line='0']", 0);
      say("[data-chat-typing='1']", 0.5);
      unsay("[data-chat-typing='1']", 1.3);
      say("[data-chat-line='1']", 1.3);
      say("[data-chat-line='2']", 2.1);
      say("[data-chat-typing='3']", 2.6);
      unsay("[data-chat-typing='3']", 3.3);
      say("[data-chat-line='3']", 3.3);
      say("[data-chat-badge]", 3.9);
      gsap.fromTo(
        "[data-sticker='automate']",
        { x: "40vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: "[data-step='automate']",
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      );
      pop("[data-sticker='automate'] [data-say]", "[data-step='automate']", 0.9);

      return cleanup;
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} id="process" className="relative">
      <FormatsRing />
      <ReachCard />
      <ConvertCard />
      <ManageCard />
      <AutomateCard />

      {/* Where it all adds up: the last card, sliding over the flow. */}
      <section data-card aria-labelledby="process-close" className="relative">
        <div
          data-card-inner
          className="relative flex min-h-[100svh] origin-top flex-col items-center justify-center overflow-hidden rounded-t-[2rem] bg-ivory px-6 py-24 text-center shadow-[0_-24px_60px_-28px_rgba(0,30,30,0.5)] md:rounded-t-[3rem]"
        >
          <h2
            id="process-close"
            data-split
            className="text-teal-gradient mx-auto max-w-5xl text-balance text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontStretch: "108%" }}
          >
            This is how attention becomes <span className="font-extrabold text-glow">profit.</span>
          </h2>
          <Link
            to="/contact"
            data-fade
            className="group mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-jet px-8 text-base font-semibold text-ivory transition-colors hover:bg-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
          >
            Start a project
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

/** The key word of a heading, set on a solid block in the card's colours. */
function Mark({ children, bg, fg }: { children: ReactNode; bg: string; fg: string }) {
  return (
    <span
      className="rounded-[0.16em] px-[0.14em] [box-decoration-break:clone]"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

function StepText({
  service,
  slug,
  title,
  children,
  dark = false,
  className,
}: {
  service: string;
  slug: string;
  title: ReactNode;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "font-display text-lg font-bold md:text-xl",
          dark ? "text-accent" : "text-ink/70",
        )}
      >
        {service}
      </p>
      <h3
        data-fade
        className="mt-3 text-balance text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em]"
        style={{ fontStretch: "105%" }}
      >
        {title}
      </h3>
      <div
        data-fade
        className={cn(
          "mt-6 max-w-lg text-base font-medium leading-relaxed sm:text-lg",
          dark ? "text-ivory/80" : "text-ink/80",
        )}
      >
        {children}
      </div>
      <ExploreLink slug={slug} service={service} dark={dark} />
    </div>
  );
}

function ExploreLink({ slug, service, dark }: { slug: string; service: string; dark: boolean }) {
  return (
    <Link
      to={servicePath(slug)}
      data-fade
      className={cn(
        "group mt-8 inline-flex h-12 items-center gap-3 rounded-full pl-6 pr-1.5 font-semibold transition-colors",
        dark ? "bg-ivory text-ink hover:bg-accent" : "bg-ink text-ivory hover:bg-night",
      )}
    >
      Explore {service}
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45",
          dark ? "bg-ink text-ivory" : "bg-ivory text-ink",
        )}
      >
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}

const grid = "mx-auto grid w-full max-w-[1400px] items-center gap-14 lg:gap-14";

// Where the stacked cards stop: just under the nav, each a step lower.
const STACK_TOP = 92;
const STACK_STEP = 14;

/** A light shade of a palette colour, for a card's background. */
const shade = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, white)`;

// ─── Reach ───────────────────────────────────────────────────────────────────

// The path the mascot climbs, as points on the mountain (percent of its box).
const ridge = [
  { left: "2.5%", top: "87%" },
  { left: "7.5%", top: "78%" },
  { left: "21.7%", top: "65%" },
  { left: "35.8%", top: "54%" },
  { left: "51.7%", top: "41%" },
  { left: "66.7%", top: "28%" },
  { left: "79%", top: "14%" },
];

function ReachCard() {
  return (
    <FlowCard step="reach" label="Reach: Google and Meta Ads" background={shade("var(--teal)", 38)}>
      <div className={cn(grid, "lg:grid-cols-[1.15fr_0.85fr]")}>
        {/* The growth mountain: it rises as you scroll, the mascot climbs to the flag. */}
        <div data-mountain className="relative order-2 pt-[8%] lg:order-1">
          <svg
            viewBox="0 0 1200 460"
            aria-hidden="true"
            className="block h-auto w-full overflow-visible"
          >
            <defs>
              <linearGradient id="mountain-front" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--deep-teal)" />
                <stop offset="1" stopColor="var(--night)" />
              </linearGradient>
              <clipPath id="mountain-reveal">
                <rect data-mountain-clip x="0" y="-200" width="1200" height="700" />
              </clipPath>
            </defs>
            <g clipPath="url(#mountain-reveal)">
              <path
                d="M0 460 L0 380 L120 330 L220 350 L340 260 L460 300 L560 210 L680 240 L780 150 L900 190 L1000 90 L1100 140 L1200 100 L1200 460 Z"
                fill="var(--night)"
                fillOpacity="0.16"
              />
              <path
                d="M0 460 L0 400 L90 360 L160 385 L260 300 L330 330 L430 250 L520 280 L620 190 L700 220 L800 130 L870 160 L980 40 L1060 110 L1120 90 L1200 150 L1200 460 Z"
                fill="url(#mountain-front)"
              />
              {/* Snow on the summit. */}
              <path
                d="M944 82 L980 40 L1020 76 L1004 72 L992 86 L976 70 L960 88 Z"
                fill="white"
                fillOpacity="0.92"
              />
            </g>
            <g data-flag style={{ transformOrigin: "980px 40px", transformBox: "view-box" }}>
              <line x1="980" y1="40" x2="980" y2="-46" stroke="var(--ink)" strokeWidth="4" />
              <path d="M980 -46 L1046 -32 L980 -16 Z" fill="var(--glow)" />
            </g>
          </svg>

          {/* What you gain on the way up. */}
          {[
            { label: "Impressions", left: "21.7%", top: "50%" },
            { label: "Clicks", left: "51.7%", top: "27%" },
            { label: "Enquiries ↑", left: "92%", top: "-2%" },
          ].map((chip) => (
            <span
              key={chip.label}
              data-peak-chip
              className="absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-[0_10px_24px_-12px_rgba(0,40,40,0.6)] ring-1 ring-ink/10 sm:text-sm"
              style={{ left: chip.left, top: chip.top }}
            >
              {chip.label}
            </span>
          ))}

          <Sticker
            id="reach"
            say="Look at that climb! 📈"
            sayAlign="right"
            className="w-14 -translate-x-1/2 -translate-y-[92%] sm:w-20 md:w-24"
            style={ridge[ridge.length - 1]!}
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="font-display text-lg font-bold text-ink/70 md:text-xl">
            Google &amp; Meta Ads
          </p>
          <blockquote
            data-fade
            className="mt-3 text-balance font-display text-[clamp(1.9rem,3.8vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          >
            “Your next customer is already searching. We make sure they find{" "}
            <Mark bg="var(--ink)" fg="var(--teal)">
              you.
            </Mark>
            ”
          </blockquote>
          <div data-fade className="mt-7 flex flex-wrap gap-2">
            {["Google Search", "YouTube", "Instagram", "Facebook"].map((channel) => (
              <span
                key={channel}
                className="rounded-full border border-ink/20 bg-white/40 px-4 py-2 text-sm font-semibold"
              >
                {channel}
              </span>
            ))}
          </div>
          <ExploreLink slug="ads" service="Google & Meta Ads" dark={false} />
        </div>
      </div>
    </FlowCard>
  );
}

// ─── Convert ─────────────────────────────────────────────────────────────────

function ConvertCard() {
  return (
    <FlowCard step="convert" label="Convert: Websites" background={shade("var(--deep-teal)", 14)}>
      <div className={cn(grid, "lg:grid-cols-[1.15fr_0.85fr]")}>
        <div className="relative pb-24 sm:pb-28 lg:pb-0">
          {/* A browser, with the website video in it (placeholder until it's cut). */}
          <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
              <span className="flex gap-1.5">
                {["var(--glow)", "var(--teal)", "var(--accent)"].map((color) => (
                  <span key={color} className="size-3 rounded-full" style={{ background: color }} />
                ))}
              </span>
              <span className="flex flex-1 items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-sm text-ink/60">
                <Lock className="size-3.5" /> yourbrand.com
              </span>
            </div>
            <VideoSlot
              title="Website showreel"
              label="Website walkthrough"
              size="lg"
              className="aspect-video rounded-none ring-0"
            />
          </div>
          <Sticker
            id="convert"
            say="Fast, clean & converting! ✨"
            sayAlign="right"
            className="-bottom-2 right-2 w-24 sm:w-32 lg:-bottom-20 lg:right-24"
          />
        </div>

        <StepText
          service="Websites"
          slug="websites"
          title={
            <>
              A website that turns visitors into{" "}
              <Mark bg="var(--ink)" fg="var(--accent)">
                enquiries.
              </Mark>
            </>
          }
        >
          <p>
            Fast, beautiful websites and landing pages built around one goal: getting the visitor to
            reach out.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {["Lightning fast", "Mobile first", "Built to convert", "Easy to update"].map(
              (item) => (
                <li
                  key={item}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </StepText>
      </div>
    </FlowCard>
  );
}

// ─── Manage ──────────────────────────────────────────────────────────────────

// Where each lead starts around the magnet (its centre, as percent of the
// field) before it's pulled into the magnet's mouth.
const magnetLeads = [
  { left: "10%", top: "3%", rotate: -12 },
  { left: "90%", top: "5%", rotate: 10 },
  { left: "6%", top: "15%", rotate: 8 },
  { left: "94%", top: "17%", rotate: -9 },
  { left: "15%", top: "27%", rotate: 12 },
  { left: "85%", top: "28%", rotate: -12 },
];
const leadTones = ["var(--teal)", "var(--accent)", "var(--glow)"];
const MAGNET_MOUTH = "23%";
const PULL_TIME = 0.3;
const PULL_GAP = 0.16;

function ManageCard() {
  return (
    <FlowCard step="manage" label="Manage: CRM and ERP" background={shade("var(--glow)", 20)}>
      <div className={cn(grid, "lg:grid-cols-[0.9fr_1.1fr]")}>
        <StepText
          service="CRM & ERP"
          slug="crm"
          title={
            <>
              Every lead,{" "}
              <Mark bg="var(--ink)" fg="var(--glow)">
                pulled
              </Mark>{" "}
              into one place.
            </>
          }
        >
          Leads from every ad and every page land straight in your CRM, while your ERP keeps stock,
          billing and teams in sync. Nothing slips through.
        </StepText>

        <div
          data-magnet-field
          className="relative mx-auto mb-24 w-full max-w-[620px] pt-[30%] lg:mb-10"
        >
          {/* The magnet, tips down, its field pulsing toward the CRM. */}
          <div aria-hidden="true" className="absolute left-1/2 top-0 z-10 w-[24%] -translate-x-1/2">
            <svg viewBox="0 0 200 190" className="block w-full overflow-visible">
              <path
                d="M50 170 V90 A50 50 0 0 1 150 90 V170"
                fill="none"
                stroke="var(--night)"
                strokeWidth="46"
              />
              <path
                d="M50 150 V182 M150 150 V182"
                stroke="white"
                strokeOpacity="0.92"
                strokeWidth="46"
              />
            </svg>
            {[0, 1, 2].map((ring) => (
              <span
                key={ring}
                className="ring-pulse absolute left-1/2 top-[96%] size-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/30"
                style={{ animationDelay: `${ring * -0.9}s` }}
              />
            ))}
          </div>

          {/* The CRM: who's come in, and its walkthrough video. */}
          <div className="relative overflow-hidden rounded-[1.5rem] bg-white shadow-[0_40px_80px_-30px_rgba(60,20,0,0.45)]">
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-5">
              <span className="font-display text-base font-extrabold text-night sm:text-lg">
                Your CRM
              </span>
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="flex -space-x-2">
                  {magnetLeads.map((_, index) => (
                    <span
                      key={index}
                      data-crm-avatar={index}
                      className="grid size-7 place-items-center rounded-full text-ink ring-2 ring-white sm:size-8"
                      style={{ background: leadTones[index % leadTones.length] }}
                    >
                      <UserRound className="size-4" strokeWidth={2.2} />
                    </span>
                  ))}
                </span>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-ivory sm:text-sm">
                  New leads
                </span>
              </span>
            </div>
            <VideoSlot
              title="CRM & ERP walkthrough"
              label="CRM & ERP walkthrough"
              size="lg"
              className="aspect-video rounded-none ring-0"
            />
          </div>

          {/* The leads, before the magnet pulls them in. */}
          {magnetLeads.map((lead, index) => (
            <div
              key={index}
              data-magnet-lead={index}
              aria-hidden="true"
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-4 opacity-0 shadow-[0_12px_28px_-12px_rgba(60,20,0,0.5)]"
              style={{ left: lead.left, top: lead.top }}
            >
              <span
                className="grid size-7 place-items-center rounded-full text-ink"
                style={{ background: leadTones[index % leadTones.length] }}
              >
                <UserRound className="size-4" strokeWidth={2.2} />
              </span>
              <span className="text-sm font-bold text-ink">Lead</span>
            </div>
          ))}

          <Sticker
            id="manage"
            say="Come to me, leads! 🧲"
            sayAlign="left"
            className="-bottom-24 left-0 w-24 sm:-bottom-20 sm:w-28 lg:-bottom-16 lg:-left-16"
          />
        </div>
      </div>
    </FlowCard>
  );
}

// ─── Automate ────────────────────────────────────────────────────────────────

function AutomateCard() {
  const bubble = "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug sm:text-base";
  const typing = (
    <span className="flex gap-1.5 rounded-2xl bg-accent/35 px-4 py-3.5">
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="size-2 rounded-full bg-night/50" />
      ))}
    </span>
  );
  return (
    <FlowCard step="automate" label="Automate: AI Agents" background={shade("var(--accent)", 28)}>
      <div className={cn(grid, "lg:grid-cols-[0.95fr_1.05fr]")}>
        <div className="relative mx-auto w-full max-w-[520px] pb-20 sm:pb-24 lg:order-2 lg:pb-0">
          <div
            data-chat
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-30px_rgba(0,40,40,0.55)]"
          >
            <div className="flex items-center gap-3 bg-night px-5 py-4 text-ivory">
              <span className="grid size-10 place-items-center rounded-full bg-accent text-night">
                <Bot className="size-5" strokeWidth={2} />
              </span>
              <span>
                <span className="block font-bold">TDM AI Agent</span>
                <span className="block text-xs text-ivory/65">online · replies instantly</span>
              </span>
            </div>
            <div className="flex min-h-[22rem] flex-col gap-3 bg-ink/[0.03] p-5">
              <p
                data-chat-line="0"
                className={cn(bubble, "self-start bg-white ring-1 ring-ink/10")}
              >
                Hi! Is the flat still available?
              </p>
              <div className="grid justify-items-end [grid-template-areas:'m']">
                <span data-chat-typing="1" className="opacity-0 [grid-area:m]">
                  {typing}
                </span>
                <p data-chat-line="1" className={cn(bubble, "bg-accent/35 [grid-area:m]")}>
                  Yes, it is! Would you like to visit this Saturday morning?
                </p>
              </div>
              <p
                data-chat-line="2"
                className={cn(bubble, "self-start bg-white ring-1 ring-ink/10")}
              >
                Saturday works 👍
              </p>
              <div className="grid justify-items-end [grid-template-areas:'m']">
                <span data-chat-typing="3" className="opacity-0 [grid-area:m]">
                  {typing}
                </span>
                <p data-chat-line="3" className={cn(bubble, "bg-accent/35 [grid-area:m]")}>
                  Booked ✅ See you on Saturday. I’ve sent you the location.
                </p>
              </div>
              <span
                data-chat-badge
                className="mt-auto self-center rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-ivory sm:text-sm"
              >
                ⚡ Replies instantly, day and night
              </span>
            </div>
          </div>
          <Sticker
            id="automate"
            say="I’ll take it from here 😎"
            sayAlign="left"
            className="-bottom-2 left-2 w-24 sm:w-32 lg:-bottom-20 lg:-left-16"
          />
        </div>

        <StepText
          service="AI Agents & Automations"
          slug="ai-agents"
          className="lg:order-1"
          title={
            <>
              Let AI do the{" "}
              <Mark bg="var(--ink)" fg="var(--accent)">
                follow-up.
              </Mark>
            </>
          }
        >
          AI agents and automations reply in seconds, book visits and follow up on WhatsApp, day and
          night, so your team only talks to people ready to buy.
        </StepText>
      </div>
    </FlowCard>
  );
}
