import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSearch } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";

import { finePointer, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { reelIndustries, reelUrls, type Reel } from "./reels";

const FIRST_BATCH = 8;

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
  const { preview, poster } = reelUrls(industry, reel.slug);

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

/** Full-screen player with sound, stepping through the current industry's reels. */
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
  const urls = reel ? reelUrls(industry, reel.slug) : null;

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

/** Industry tabs with a sliding highlight. */
function IndustryTabs({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });

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
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Industries"
      className="relative inline-flex flex-wrap gap-1 rounded-[1.75rem] border border-ink/10 bg-white/70 p-1.5 shadow-[0_20px_50px_-30px_rgba(0,40,40,0.4)] backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="absolute rounded-full bg-accent shadow-[0_10px_30px_-8px_var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={pill}
      />
      {items.map((item) => {
        const selected = item.id === activeId;
        return (
          <button
            key={item.id}
            data-tab={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(item.id)}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive sm:px-5 sm:py-2.5",
              selected ? "text-ink" : "text-ink/65 hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/** Industry tabs over a grid of client reels. */
export function ReelShowcase() {
  const industries = reelIndustries.filter((industry) => industry.reels.length > 0);
  const [showAll, setShowAll] = useState(false);
  // A link like /media-house?tab=architecture#reels opens on that industry.
  const { tab } = useSearch({ strict: false }) as { tab?: string };
  const [activeId, setActiveId] = useState(
    industries.find((industry) => industry.id === tab)?.id ?? industries[0]?.id ?? "",
  );
  useEffect(() => {
    if (tab && industries.some((industry) => industry.id === tab)) {
      setActiveId(tab);
      setShowAll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- industries is static data
  }, [tab]);
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
    { scope: gridRef, dependencies: [activeId], revertOnUpdate: true },
  );

  const active = industries.find((industry) => industry.id === activeId) ?? industries[0];
  if (!active) return null;
  const visible = showAll ? active.reels : active.reels.slice(0, FIRST_BATCH);
  const wide = visible.filter((reel) => reel.wide);
  const tall = visible.filter((reel) => !reel.wide);
  const card = (reel: Reel) => (
    <ReelCard
      industry={active.id}
      reel={reel}
      number={active.reels.indexOf(reel) + 1}
      onOpen={() => setOpenIndex(active.reels.indexOf(reel))}
    />
  );

  return (
    <div>
      <IndustryTabs
        items={industries.map(({ id, label }) => ({ id, label }))}
        activeId={active.id}
        onSelect={(id) => {
          setActiveId(id);
          setShowAll(false);
        }}
      />

      <div ref={gridRef} key={active.id}>
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

      {!showAll && active.reels.length > FIRST_BATCH && (
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
        reels={active.reels}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
