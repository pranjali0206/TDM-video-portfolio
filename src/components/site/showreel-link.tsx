import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { reelUrls, ringReels } from "./reels";

// How long each reel shows before the next one fades in.
const CLIP_SECONDS = 2.6;
const FADE_MS = 500;
// The home ring's reels minus the ones carrying HM Realty branding (Alpine
// opens on the HM logo, hm-2 has its watermark), so no single client is
// promoted here. Starts on Forum.
const HIDDEN = new Set(["alpine", "hm-2"]);
const navReels = ringReels.filter((reel) => !HIDDEN.has(reel.slug));
const start = Math.max(
  0,
  navReels.findIndex((reel) => reel.slug === "forum"),
);
const clips = [...navReels.slice(start), ...navReels.slice(0, start)].map((reel) =>
  reelUrls(reel.industry, reel.slug),
);
const clipAt = (index: number) => clips[index % clips.length]!;

/**
 * The nav's link to MediaHouse: a tiny round showreel in a turning teal ring,
 * like a story you can tap. Two stacked videos take turns: while one plays,
 * the other has the next reel's silent preview loaded, so each cut is a
 * crossfade with no blank frame. Off screen, under reduced motion or with
 * Save-Data on, it stays on the first poster.
 */
export function ShowreelLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)] as const;
  // Which reel each of the two videos holds, and which video is on top.
  const [slots, setSlots] = useState<[number, number]>([0, 1]);
  const [active, setActive] = useState<0 | 1>(0);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  // Only a copy that is on screen plays (the nav renders a second, hidden one
  // for mobile), so hidden copies download nothing.
  const playing = allowed && visible;
  const switching = useRef(false);
  // Outlives the effect below (which re-runs the moment `active` flips).
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (prefersReducedMotion() || saveData) return;
    setAllowed(true);

    const link = linkRef.current;
    if (!link) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting));
    observer.observe(link);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const current = videoRefs[active].current;
    const next = videoRefs[active === 0 ? 1 : 0].current;
    if (!current || !next) return;

    switching.current = false;
    current.play().catch(() => {});

    const onTime = () => {
      if (switching.current || current.currentTime < CLIP_SECONDS) return;
      switching.current = true;
      next.currentTime = 0;
      next.play().catch(() => {});
      setActive(active === 0 ? 1 : 0);
      // Once the fade is done, park this video and load the reel after next.
      fadeTimer.current = setTimeout(() => {
        current.pause();
        setSlots((prev) => {
          const upcoming = (prev[active === 0 ? 1 : 0] + 1) % clips.length;
          return active === 0 ? [upcoming, prev[1]] : [prev[0], upcoming];
        });
      }, FADE_MS);
    };

    current.addEventListener("timeupdate", onTime);
    return () => {
      current.removeEventListener("timeupdate", onTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [active, playing]);

  return (
    <Link
      ref={linkRef}
      to="/media-house"
      onClick={onClick}
      aria-label="MediaHouse — watch our work"
      className={cn(
        "group relative -my-2 block size-14 shrink-0 rounded-full transition-transform duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
        className,
      )}
    >
      {/* The story ring: a teal sweep that slowly turns. */}
      <span aria-hidden="true" className="reel-ring absolute inset-0 rounded-full" />

      <span className="absolute inset-[4.5px] overflow-hidden rounded-full bg-night ring-2 ring-white">
        <img
          src={clipAt(0).poster}
          alt=""
          width={112}
          height={112}
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        {playing &&
          slots.map((reel, index) => (
            <video
              key={index}
              ref={videoRefs[index as 0 | 1]}
              src={clipAt(reel).preview}
              poster={clipAt(reel).poster}
              muted
              playsInline
              loop
              preload="auto"
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-full scale-[1.15] object-cover transition-opacity ease-out",
                active === index ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            />
          ))}

        {/* A dark teal wash, so the reel sits a little deeper in the ring. */}
        <span aria-hidden="true" className="absolute inset-0 bg-night/25" />

        {/* Hover: a play mark, saying "tap to watch". */}
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-night/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Play className="size-4 fill-white text-white" strokeWidth={0} />
        </span>
      </span>
    </Link>
  );
}
