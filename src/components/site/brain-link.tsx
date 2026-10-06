import { Link } from "@tanstack/react-router";

import brainBulbOff from "@/assets/brain-bulb-off.webp";
import brainBulbOn from "@/assets/brain-bulb-on.webp";
import { cn } from "@/lib/utils";

/**
 * An icon-only link to the MediaHouse page: a light bulb with a brain in it.
 * The lit picture (bulb plus a burst of colour) sits over the unlit bulb; it
 * flickers on and off, then bursts and holds, with a colourful halo — an idea
 * switching on. The CSS
 * animations (bulb-*) live in styles.css and rest, lit, under reduced motion.
 */
export function BrainLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/media-house"
      onClick={onClick}
      aria-label="MediaHouse — our work"
      className={cn(
        "group relative -my-2 block size-14 shrink-0 rounded-full transition-transform duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive",
        className,
      )}
    >
      {/* Colourful halo behind the bulb's globe. */}
      <span
        aria-hidden="true"
        className="bulb-halo pointer-events-none absolute inset-x-1 top-0 aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 214, 90, 0.85) 0%, rgba(255, 90, 170, 0.4) 35%, rgba(60, 200, 255, 0.25) 55%, transparent 72%)",
        }}
      />
      <img
        src={brainBulbOff}
        alt=""
        width={192}
        height={192}
        className="absolute inset-0 size-full object-contain"
        draggable={false}
      />
      <img
        src={brainBulbOn}
        alt=""
        width={192}
        height={192}
        className="bulb-on absolute inset-0 size-full object-contain"
        draggable={false}
      />
    </Link>
  );
}
