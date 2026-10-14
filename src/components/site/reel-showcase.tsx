import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Play,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";

import { finePointer, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { featuredReels, reelIndustries, reelUrls, type Reel, type ReelIndustry } from "./reels";

const FIRST_BATCH = 8;

// The tabs: "All" (the best reels from every industry) first, then each
// industry. One with no reels yet shows a "coming soon" card when opened.
const showcase: ReelIndustry[] = [
  { id: "all", label: "All", reels: featuredReels },
  ...reelIndustries,
];

/**
 * A reel card: poster first, then a silent preview loop while on screen. On a
 * mouse it tilts toward the pointer under a moving glare, like a print in hand.
 */
function ReelCard({
  industry,
  reel,
  number,
  onOpen,
}: {
  industry: string;
  reel: Reel;
  number: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tilt = useRef<{ x: (value: number) => void; y: (value: number) => void } | null>(null);
  const { preview, poster } = reelUrls(reel.folder ?? industry, reel.slug);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !finePointer() || prefersReducedMotion()) return;
    tilt.current = {
      x: gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" }),
    };
  }, []);

  const onMove = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
    tilt.current?.x((px - 0.5) * 10);
    tilt.current?.y((0.5 - py) * 10);
  };
  const onLeave = () => {
    tilt.current?.x(0);
    tilt.current?.y(0);
  };

  return (
    <div data-reel className="[perspective:1100px]">
      <button
        ref={cardRef}
        type="button"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="play"
        data-cursor-label="Watch"
        className={cn(
          "group relative isolate block w-full overflow-hidden rounded-[1.25rem] bg-ink text-left ring-1 ring-ink/10 shadow-[0_40px_80px_-40px_rgba(0,40,40,0.55)] transition-[box-shadow] duration-500 [transform-style:preserve-3d] hover:shadow-[0_50px_90px_-35px_color-mix(in_oklab,var(--accent)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
          reel.wide ? "aspect-video" : "aspect-[9/16]",
        )}
      >
        <video
          ref={videoRef}
          src={preview}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
        />
        {/* Shade, then a glare that follows the pointer. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/30 transition-opacity duration-500 group-hover:opacity-80" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(28rem circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.55), transparent 55%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/0 transition duration-500 group-hover:ring-accent/70"
        />

        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/80">
          {String(number).padStart(2, "0")}
        </span>
        <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/15 text-ivory backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-ink">
          <Play className="size-4 translate-x-px fill-current" />
        </span>

        <span className="absolute inset-x-4 bottom-4 block overflow-hidden">
          <span className="block text-sm font-bold leading-snug text-ivory md:text-base">
            {reel.title}
          </span>
          <span className="mt-1 flex translate-y-full items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            Watch with sound <ArrowUpRight className="size-3" />
          </span>
        </span>
      </button>
    </div>
  );
}

/** Full-screen player with sound, stepping through the reels on show. */
function ReelPlayer({
  industry,
  reels,
  index,
  onIndex,
  onClose,
}: {
  industry: string;
  reels: Reel[];
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const reel = index === null ? null : reels[index];
  const step = (by: number) => {
    if (index === null) return;
    onIndex((index + by + reels.length) % reels.length);
  };
  const urls = reel ? reelUrls(reel.folder ?? industry, reel.slug) : null;

  return (
    <DialogPrimitive.Root open={reel != null} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[95] bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          className="fixed inset-0 z-[96] flex items-center justify-center gap-3 overflow-hidden p-4 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:gap-8"
        >
          {reel && urls && (
            <>
              {/* Ambient glow: the poster, blown up and blurred behind the player. */}
              <img
                key={`glow-${reel.slug}`}
                src={urls.poster}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 size-full scale-125 object-cover opacity-45 blur-[90px] saturate-150 animate-in fade-in-0 duration-700"
              />

              <DialogPrimitive.Title className="sr-only">{reel.title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Reel {index! + 1} of {reels.length}. Use the arrow keys to move between reels.
              </DialogPrimitive.Description>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous reel"
                className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 text-ivory backdrop-blur-md transition-colors hover:bg-accent hover:text-ink sm:grid"
              >
                <ChevronLeft className="size-6" />
              </button>

              <figure
                className={cn(
                  "relative flex flex-col items-center",
                  reel.wide
                    ? "w-[min(calc(100vw-2rem),calc(80svh*16/9),1400px)]"
                    : "h-full max-h-[min(88svh,900px)]",
                )}
              >
                <video
                  key={reel.slug}
                  src={urls.full}
                  poster={urls.poster}
                  autoPlay
                  controls
                  playsInline
                  className={cn(
                    "rounded-2xl bg-black object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 animate-in fade-in-0 zoom-in-95 duration-500",
                    reel.wide
                      ? "aspect-video w-full"
                      : "aspect-[9/16] h-full min-h-0 max-w-[calc(100vw-2rem)]",
                  )}
                />
                <figcaption className="mt-4 flex w-full items-center justify-between gap-4 text-ivory">
                  <span className="text-sm font-bold md:text-base">{reel.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/60">
                    {String(index! + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next reel"
                className="hidden size-12 shrink-0 place-items-center rounded-full bg-white/10 text-ivory backdrop-blur-md transition-colors hover:bg-accent hover:text-ink sm:grid"
              >
                <ChevronRight className="size-6" />
              </button>

              <DialogPrimitive.Close
                aria-label="Close"
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-ivory backdrop-blur-md transition-colors hover:bg-accent hover:text-ink"
              >
                <X className="size-5" />
              </DialogPrimitive.Close>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const tabClass =
  "relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive sm:px-5 sm:py-2.5";

/**
 * Industry tabs with a sliding highlight. An industry with sub-categories
 * (`kinds`) opens a dropdown instead: all of its reels, or one kind.
 */
function IndustryTabs({
  industries,
  activeId,
  kindId,
  onSelect,
}: {
  industries: ReelIndustry[];
  activeId: string;
  kindId: string | null;
  onSelect: (id: string, kind: string | null) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });
  // The highlight only slides once it has a place: on load (even onto a tab
  // further along, from a ?tab= link) it simply appears under the active tab.
  const [slide, setSlide] = useState(false);

  // The active tab's label (and so its width) changes with the kind too.
  useLayoutEffect(() => {
    const measure = () => {
      const tab = listRef.current?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
      if (tab) {
        setPill({
          left: tab.offsetLeft,
          top: tab.offsetTop,
          width: tab.offsetWidth,
          height: tab.offsetHeight,
        });
      }
    };
    measure();
    const frame = requestAnimationFrame(() => setSlide(true));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [activeId, kindId]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Industries"
      className="relative inline-flex flex-wrap gap-1 rounded-[1.75rem] border border-ink/10 bg-white/70 p-1.5 shadow-[0_20px_50px_-30px_rgba(0,40,40,0.4)] backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-full bg-accent shadow-[0_10px_30px_-8px_var(--accent)]",
          slide && "transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]",
        )}
        style={pill}
      />
      {industries.map((industry) => {
        const selected = industry.id === activeId;
        const kind = selected ? industry.kinds?.find((item) => item.id === kindId) : undefined;
        const label = (
          <>
            {industry.label}
            {kind && <span className="font-semibold opacity-70">· {kind.label}</span>}
          </>
        );
        const className = cn(tabClass, selected ? "text-ink" : "text-ink/65 hover:text-ink");

        if (!industry.kinds) {
          return (
            <button
              key={industry.id}
              data-tab={industry.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(industry.id, null)}
              className={className}
            >
              {label}
            </button>
          );
        }

        return (
          <DropdownMenu.Root key={industry.id} modal={false}>
            <DropdownMenu.Trigger
              data-tab={industry.id}
              role="tab"
              aria-selected={selected}
              className={cn(className, "group/kinds")}
            >
              {label}
              <ChevronDown className="size-3.5 transition-transform duration-300 group-data-[state=open]/kinds:rotate-180" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={8}
                className="z-50 min-w-[14rem] rounded-2xl border border-ink/10 bg-white/95 p-1.5 text-ink shadow-[0_24px_60px_-24px_rgba(0,40,40,0.45)] backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
              >
                {[{ id: null, label: `All ${industry.label}` }, ...industry.kinds].map((item) => {
                  const count = item.id
                    ? industry.reels.filter((reel) => reel.kind === item.id).length
                    : industry.reels.length;
                  const current = selected && kindId === item.id;
                  return (
                    <DropdownMenu.Item
                      key={item.id ?? "all"}
                      onSelect={() => onSelect(industry.id, item.id)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition-colors data-[highlighted]:bg-secondary"
                    >
                      <Check className={cn("size-4 text-deep-teal", !current && "invisible")} />
                      <span className="flex-1">{item.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
                        {count > 0 ? count : ""}
                      </span>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      })}
    </div>
  );
}

/** Stands in for the reel grid while an industry (or kind) has no reels yet. */
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink/20 bg-white/60 px-6 py-16 text-center backdrop-blur-md md:py-20">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-ink">
        <Clapperboard className="size-6" strokeWidth={1.8} />
      </span>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal">
        Reels coming soon
      </p>
      <h3 className="mt-3 max-w-xl text-balance font-display text-2xl font-bold leading-tight md:text-3xl">
        Our {label} reels are in the edit room.
      </h3>
      <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-ink/75">
        Want one made for your brand while you wait?
      </p>
      <Link
        to="/contact"
        className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-ink pl-6 pr-2 text-sm font-semibold text-ivory transition-colors hover:bg-deep-teal"
      >
        Talk to MediaHouse
        <span className="grid size-8 place-items-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="size-4" />
        </span>
      </Link>
    </div>
  );
}

/** Industry tabs over a grid of client reels. */
export function ReelShowcase() {
  const industries = showcase;
  const [showAll, setShowAll] = useState(false);
  // A link like /media-house?tab=architecture#reels opens on that industry;
  // adding &kind=interior opens it on that sub-category.
  const { tab, kind: kindParam } = useSearch({ strict: false }) as { tab?: string; kind?: string };
  const linked = industries.find((industry) => industry.id === tab);
  const linkedKind = linked?.kinds?.some((item) => item.id === kindParam) ? kindParam! : null;
  const [kindId, setKindId] = useState<string | null>(linkedKind);
  const [activeId, setActiveId] = useState(linked?.id ?? industries[0]?.id ?? "");
  useEffect(() => {
    if (linked) {
      setActiveId(linked.id);
      setKindId(linkedKind);
      setShowAll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- derived from tab and kindParam
  }, [tab, kindParam]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Cards rise in, one after another, whenever the set changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-reel]", {
        y: 70,
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        stagger: 0.07,
        ease: "expo.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
      });
    },
    { scope: gridRef, dependencies: [activeId, kindId], revertOnUpdate: true },
  );

  const active = industries.find((industry) => industry.id === activeId) ?? industries[0];
  if (!active) return null;
  const kind = active.kinds?.find((item) => item.id === kindId);
  // The reels on show: the whole industry, or just the chosen kind.
  const reels = kind ? active.reels.filter((reel) => reel.kind === kind.id) : active.reels;
  const visible = showAll ? reels : reels.slice(0, FIRST_BATCH);
  const wide = visible.filter((reel) => reel.wide);
  const tall = visible.filter((reel) => !reel.wide);
  const card = (reel: Reel) => (
    <ReelCard
      industry={active.id}
      reel={reel}
      number={reels.indexOf(reel) + 1}
      onOpen={() => setOpenIndex(reels.indexOf(reel))}
    />
  );

  return (
    <div>
      <IndustryTabs
        industries={industries}
        activeId={active.id}
        kindId={kind?.id ?? null}
        onSelect={(id, nextKind) => {
          setActiveId(id);
          setKindId(nextKind);
          setShowAll(false);
        }}
      />

      <div ref={gridRef} key={`${active.id}/${kind?.id ?? "all"}`}>
        {reels.length === 0 && (
          <ComingSoon label={kind ? kind.label.toLowerCase() : active.label} />
        )}
        {/* Landscape films get their own wider row above the vertical reels. */}
        {wide.length > 0 && (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {wide.map((reel) => (
              <li key={reel.slug}>{card(reel)}</li>
            ))}
          </ul>
        )}
        {tall.length > 0 && (
          // Every other column sits a little lower on desktop, like an editorial spread.
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:pb-16 lg:[&>li:nth-child(even)]:translate-y-16">
            {tall.map((reel) => (
              <li key={reel.slug}>{card(reel)}</li>
            ))}
          </ul>
        )}
      </div>

      {!showAll && reels.length > FIRST_BATCH && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="group inline-flex h-14 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive"
          >
            See more of our magic
            <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-90">
              <ChevronRight className="size-5" />
            </span>
          </button>
        </div>
      )}

      <ReelPlayer
        industry={active.id}
        reels={reels}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
