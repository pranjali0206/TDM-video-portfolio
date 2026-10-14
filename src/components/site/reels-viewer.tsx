import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  Play,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import tdmLogo from "@/assets/tdm-logo.webp";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { useExperience } from "./experience";
import { featuredReels, reelIndustries, reelUrls } from "./reels";

type FeedReel = {
  id: string;
  industry: string;
  industryLabel: string;
  title: string;
  wide: boolean;
  urls: ReturnType<typeof reelUrls>;
};

const industryLabel = (id: string) =>
  reelIndustries.find((industry) => industry.id === id)?.label ?? id;

/** Every MediaHouse reel: the featured picks first, then the rest by industry. */
const feed: FeedReel[] = (() => {
  const seen = new Set<string>();
  const items: FeedReel[] = [];
  const add = (industry: string, slug: string, title: string, wide?: boolean) => {
    const id = `${industry}/${slug}`;
    if (seen.has(id)) return;
    seen.add(id);
    items.push({
      id,
      industry,
      industryLabel: industryLabel(industry),
      title,
      wide: wide ?? false,
      urls: reelUrls(industry, slug),
    });
  };
  featuredReels.forEach((reel) => add(reel.folder ?? "", reel.slug, reel.title, reel.wide));
  reelIndustries.forEach((industry) =>
    industry.reels.forEach((reel) => add(industry.id, reel.slug, reel.title, reel.wide)),
  );
  // Vertical reels first (they fill the screen); landscape films close the feed.
  return [...items.filter((reel) => !reel.wide), ...items.filter((reel) => reel.wide)];
})();

// ─── Likes & saves, remembered in this browser ──────────────────────────────

const MARKS_KEY = "tdm-mediahouse-marks";
type Marks = { liked: string[]; saved: string[] };

function readMarks(): Marks {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MARKS_KEY) ?? "null") as Partial<Marks>;
    return {
      liked: Array.isArray(parsed?.liked) ? parsed.liked : [],
      saved: Array.isArray(parsed?.saved) ? parsed.saved : [],
    };
  } catch {
    return { liked: [], saved: [] };
  }
}

function useReelMarks() {
  const [marks, setMarks] = useState<Marks>({ liked: [], saved: [] });
  // Only write once the visitor changes something, so loading never overwrites storage.
  const dirty = useRef(false);

  useEffect(() => {
    setMarks(readMarks());
  }, []);

  useEffect(() => {
    if (!dirty.current) return;
    try {
      window.localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
    } catch {
      // Private mode or blocked storage: marks just last for this visit.
    }
  }, [marks]);

  const set = useCallback((kind: keyof Marks, id: string, on: boolean) => {
    dirty.current = true;
    setMarks((current) => {
      const has = current[kind].includes(id);
      if (has === on) return current;
      const list = on ? [...current[kind], id] : current[kind].filter((item) => item !== id);
      return { ...current, [kind]: list };
    });
  }, []);

  return { marks, set };
}

// ─── One reel ────────────────────────────────────────────────────────────────

const DOUBLE_TAP_MS = 260;

function ActionButton({
  label,
  onClick,
  children,
  pressed,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className="group flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      <span className="grid size-11 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-colors group-hover:bg-white/20 md:bg-white/10">
        {children}
      </span>
      <span aria-hidden="true" className="text-[11px] font-semibold drop-shadow">
        {label.split(" ")[0]}
      </span>
    </button>
  );
}

function ReelCard({
  reel,
  active,
  near,
  muted,
  onToggleMute,
  onAutoMute,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
}: {
  reel: FeedReel;
  active: boolean;
  near: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onAutoMute: () => void;
  liked: boolean;
  saved: boolean;
  onLike: (on: boolean) => void;
  onSave: (on: boolean) => void;
  onShare: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapTimer = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [likePop, setLikePop] = useState(0);

  // Only the reel on screen plays; the others rewind and wait.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (active && !paused) {
      video.play().catch((error: unknown) => {
        // Autoplay with sound was blocked: carry on muted, like Instagram does.
        if (error instanceof DOMException && error.name === "NotAllowedError" && !video.muted) {
          onAutoMute();
        }
      });
    } else {
      video.pause();
    }
  }, [active, paused, muted, onAutoMute]);

  useEffect(() => {
    if (active) return;
    setPaused(false);
    setProgress(0);
    const video = videoRef.current;
    if (video) video.currentTime = 0;
  }, [active]);

  useEffect(
    () => () => {
      if (tapTimer.current) window.clearTimeout(tapTimer.current);
    },
    [],
  );

  const like = (on: boolean) => {
    onLike(on);
    if (on) setLikePop((count) => count + 1);
  };

  // Tap pauses / plays; double tap likes, with a heart where you tapped.
  const tap = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (tapTimer.current) {
      window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      const id = Date.now();
      setHearts((list) => [...list, { id, ...point }]);
      window.setTimeout(() => setHearts((list) => list.filter((heart) => heart.id !== id)), 900);
      like(true);
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      setPaused((value) => !value);
    }, DOUBLE_TAP_MS);
  };

  return (
    <div className="relative flex h-full w-full items-end justify-center gap-4 md:w-auto">
      {/* The reel */}
      <div
        className="relative h-full w-full overflow-hidden bg-black md:aspect-[9/16] md:w-auto md:rounded-2xl md:shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        onClick={tap}
      >
        <video
          ref={videoRef}
          src={near ? reel.urls.full : undefined}
          poster={reel.urls.poster}
          aria-label={reel.title}
          playsInline
          loop
          preload={near ? "auto" : "none"}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (video.duration) setProgress(video.currentTime / video.duration);
          }}
          className={cn("size-full", reel.wide ? "object-contain" : "object-cover")}
        />

        {paused && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Play className="ml-1 size-9 fill-current" strokeWidth={0} />
          </span>
        )}

        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            aria-hidden="true"
            className="reel-heart pointer-events-none absolute size-24 fill-[#ff3040] text-[#ff3040] drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            style={{ left: heart.x, top: heart.y }}
          />
        ))}

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-6 pt-24 pr-20 text-white md:pr-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-white/60">
              <img src={tdmLogo} alt="" className="w-7 object-contain" />
            </span>
            <span className="text-sm font-bold">TDM MediaHouse</span>
            <span className="rounded-md border border-white/50 px-2 py-0.5 text-xs font-semibold">
              {reel.industryLabel}
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-snug">{reel.title}</p>
          <p className="mt-1 text-xs text-white/75">
            #{reel.industryLabel.replace(/\s+/g, "")} #TDMGroups #MediaHouse
          </p>
        </div>

        {/* Playback progress */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
          <span
            className="block h-full bg-white transition-[width] duration-200 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
      </div>

      {/* Actions: over the reel on phones, beside it on larger screens. */}
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 md:static md:bottom-auto md:right-auto md:pb-6">
        <ActionButton label={liked ? "Liked" : "Like"} pressed={liked} onClick={() => like(!liked)}>
          <Heart
            key={likePop}
            className={cn("size-6", liked && "reel-like-pop fill-[#ff3040] text-[#ff3040]")}
            strokeWidth={2}
          />
        </ActionButton>
        <ActionButton label="Share" onClick={onShare}>
          <Send className="size-6 -rotate-12" strokeWidth={2} />
        </ActionButton>
        <ActionButton
          label={saved ? "Saved" : "Save"}
          pressed={saved}
          onClick={() => onSave(!saved)}
        >
          <Bookmark className={cn("size-6", saved && "fill-current")} strokeWidth={2} />
        </ActionButton>
        <ActionButton label={muted ? "Unmute" : "Mute"} onClick={onToggleMute}>
          {muted ? (
            <VolumeX className="size-6" strokeWidth={2} />
          ) : (
            <Volume2 className="size-6" strokeWidth={2} />
          )}
        </ActionButton>
        <Link
          to="/media-house"
          search={{ tab: reel.industry }}
          hash="reels"
          aria-label={`More ${reel.industryLabel} reels in MediaHouse`}
          className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <span className="grid size-11 place-items-center rounded-xl border-2 border-white/80 bg-white/10 backdrop-blur-md">
            <ArrowUpRight className="size-5" strokeWidth={2.2} />
          </span>
          <span aria-hidden="true" className="text-[11px] font-semibold drop-shadow">
            More
          </span>
        </Link>
      </div>
    </div>
  );
}

// ─── The viewer ──────────────────────────────────────────────────────────────

/**
 * TDM MediaHouse World: every MediaHouse reel in a full-screen, swipeable
 * vertical feed (like Instagram Reels). Likes and saves are remembered in
 * this browser.
 */
export function ReelsViewer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lockScroll } = useExperience();
  // State, not a ref: the dialog's portal mounts a render late, and the
  // observer below has to wait for the feed to exist.
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { marks, set } = useReelMarks();

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open, lockScroll]);

  // Which reel fills the screen.
  useEffect(() => {
    const root = scroller;
    if (!open || !root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset["index"]));
        });
      },
      { root, threshold: 0.6 },
    );
    itemRefs.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, [open, scroller]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const go = useCallback((index: number) => {
    const target = itemRefs.current[Math.max(0, Math.min(feed.length - 1, index))];
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  // Arrow keys / J K move between reels, M mutes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
      if (["ArrowDown", "PageDown", "j"].includes(event.key)) {
        event.preventDefault();
        go(active + 1);
      } else if (["ArrowUp", "PageUp", "k"].includes(event.key)) {
        event.preventDefault();
        go(active - 1);
      } else if (event.key === "m") {
        setMuted((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, go]);

  const autoMute = useCallback(() => setMuted(true), []);

  const share = async (reel: FeedReel) => {
    const url = `${window.location.origin}/media-house?tab=${reel.industry}#reels`;
    const data = { title: `${reel.title} — TDM MediaHouse`, text: reel.title, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setToast("Couldn't share this reel");
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setActive(0);
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-[#050b0c]/95 backdrop-blur-md" />
        <Dialog.Content className="fixed inset-0 z-[201] text-white outline-none">
          <Dialog.Title className="sr-only">TDM MediaHouse World</Dialog.Title>
          <Dialog.Description className="sr-only">
            Reels made by TDM Groups. Scroll, swipe or use the arrow keys to move between reels;
            double tap a reel to like it.
          </Dialog.Description>

          <div
            ref={setScroller}
            data-lenis-prevent
            className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {feed.map((reel, index) => (
              <section
                key={reel.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                data-index={index}
                aria-label={`${reel.title}, reel ${index + 1} of ${feed.length}`}
                className="flex h-[100dvh] snap-start snap-always items-center justify-center md:py-6"
              >
                <ReelCard
                  reel={reel}
                  active={open && index === active}
                  near={Math.abs(index - active) <= 1}
                  muted={muted}
                  onToggleMute={() => setMuted((value) => !value)}
                  onAutoMute={autoMute}
                  liked={marks.liked.includes(reel.id)}
                  saved={marks.saved.includes(reel.id)}
                  onLike={(on) => set("liked", reel.id, on)}
                  onSave={(on) => set("saved", reel.id, on)}
                  onShare={() => void share(reel)}
                />
              </section>
            ))}
          </div>

          {/* Top bar */}
          <div className="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-4 md:bg-none md:px-8 md:py-6">
            <p className="font-hero text-xl font-semibold tracking-[-0.01em] drop-shadow md:text-2xl">
              TDM MediaHouse <span className="italic text-aqua">World</span>
            </p>
            <Dialog.Close
              aria-label="Close reels"
              className="pointer-events-auto grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          {/* Previous / next on larger screens */}
          <div className="fixed right-8 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
            <button
              type="button"
              aria-label="Previous reel"
              disabled={active === 0}
              onClick={() => go(active - 1)}
              className="grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:opacity-30"
            >
              <ChevronUp className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next reel"
              disabled={active === feed.length - 1}
              onClick={() => go(active + 1)}
              className="grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:opacity-30"
            >
              <ChevronDown className="size-6" />
            </button>
          </div>

          <p
            role="status"
            className={cn(
              "pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-hero-ink shadow-lg transition-opacity",
              toast ? "opacity-100" : "opacity-0",
            )}
          >
            {toast}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
