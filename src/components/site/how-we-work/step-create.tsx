import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { createFormats, createReels } from "./data";
import { useGrowthMotion } from "./motion";

const chips = [
  {
    label: "Hook in the first 3 sec",
    dot: "#e8693a",
    pos: "left-[4%] top-[6%]",
    pop: "tdm-d3",
    float: "0s",
  },
  {
    label: "Pattern interrupt",
    dot: "#0f7a78",
    pos: "right-[3%] top-[14%]",
    pop: "tdm-d4",
    float: ".6s",
  },
  {
    label: "Buyer psychology",
    dot: "#a9c43a",
    pos: "left-[8%] bottom-[6%]",
    pop: "tdm-d5",
    float: "1.2s",
  },
  {
    label: "One clear CTA",
    dot: "#7fe0db",
    pos: "right-[6%] bottom-[8%]",
    pop: "tdm-d6",
    float: "1.8s",
    dark: true,
  },
];

const reelDelay = ["tdm-d1", "tdm-d2", "tdm-d3", "tdm-d4"];

/** 01 Create: four fanned MediaHouse reels with the craft behind them floating around. */
export function StepCreate() {
  const { onScreen, reduced } = useGrowthMotion();
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  // Play only while this step is showing and the section is on screen.
  useEffect(() => {
    const list = videos.current;
    list.forEach((video) => {
      if (!video) return;
      if (onScreen && !reduced) video.play().catch(() => {});
      else video.pause();
    });
    return () => list.forEach((video) => video?.pause());
  }, [onScreen, reduced]);

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="tdm-in flex flex-wrap items-center gap-2">
        <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-hero-muted">
          Formats
        </span>
        {createFormats.map((format, index) => (
          <span
            key={format}
            className={cn(
              "rounded-full px-3.5 py-2 text-[13px] font-semibold",
              index === 0 ? "bg-hero-ink text-white" : "bg-white text-hero-ink",
            )}
          >
            {format}
          </span>
        ))}
      </div>

      <div className="relative flex min-h-[380px] flex-1 items-center justify-center gap-4">
        {createReels.map((reel, index) => (
          <div key={reel.label} className={cn("tdm-in", reelDelay[index])}>
            <video
              ref={(el) => {
                videos.current[index] = el;
              }}
              src={reel.preview}
              poster={reel.poster}
              aria-label={reel.label}
              muted
              loop
              playsInline
              preload={reel.featured ? "auto" : "none"}
              className={cn(
                "block object-cover",
                reel.featured
                  ? "rounded-[20px] border-4 border-white shadow-[0_24px_50px_rgba(15,42,44,0.25)]"
                  : "rounded-[18px] shadow-[0_16px_36px_rgba(15,42,44,0.18)]",
              )}
              style={{
                width: reel.width,
                height: reel.height,
                transform: reel.rotate ? `rotate(${reel.rotate}deg)` : undefined,
              }}
            />
          </div>
        ))}

        {chips.map((chip) => (
          <span key={chip.label} className={cn("tdm-pop absolute", chip.pos, chip.pop)}>
            <span
              className={cn(
                "tdm-float inline-flex items-center gap-2 rounded-full px-3.5 py-[9px] text-[13px] font-bold",
                chip.dark
                  ? "bg-hero-ink text-white shadow-[0_10px_26px_rgba(15,42,44,0.2)]"
                  : "bg-white text-hero-ink shadow-[0_10px_26px_rgba(15,42,44,0.14)]",
              )}
              style={{ animationDelay: chip.float }}
            >
              <span className="size-2 rounded-full" style={{ background: chip.dot }} />
              {chip.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
