import { Play, Sparkles, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { reachLeadPings, reachSources, revenueFigure } from "./data";

const chipDelay = ["", "tdm-d1", "tdm-d2", "tdm-d1", "tdm-d2", "tdm-d3"];

/**
 * 02 Reach: six ad channels stream leads (dotted lines) into "your business"
 * at the centre, while revenue draws itself climbing underneath.
 */
export function StepReach({ videoUrl }: { videoUrl?: string | undefined }) {
  return (
    <div className="relative h-[490px] w-[760px]">
      <p className="sr-only">
        Leads flowing from Google, Meta, Instagram, LinkedIn, AI search and YouTube into your
        business.
      </p>
      <svg
        width="760"
        height="490"
        viewBox="0 0 760 490"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <g fill="none" stroke="#c9dcd6" strokeWidth="1.5" strokeDasharray="3 5">
          {reachSources.map((source) => (
            <path key={source.name} d={source.path} />
          ))}
        </g>
        <g fill="none" strokeWidth="6">
          {reachSources.map((source) => (
            <path
              key={source.name}
              className="tdm-dots"
              d={source.path}
              stroke={source.color}
              style={{ animationDelay: `${source.delay}s` }}
            />
          ))}
        </g>
      </svg>

      {reachSources.map((source, index) => (
        <div
          key={source.name}
          aria-hidden="true"
          className={cn(
            "tdm-in absolute flex h-12 w-[150px] items-center gap-[9px] rounded-[14px] bg-white pl-1.5 pr-3 shadow-[0_8px_22px_rgba(15,42,44,0.1)]",
            chipDelay[index],
          )}
          style={{ left: source.x, top: source.y }}
        >
          <span
            className={cn(
              "inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] font-extrabold text-white",
              source.badge.length > 1 ? "text-xs" : "text-[13px]",
            )}
            style={{ background: source.color }}
          >
            {source.icon === "sparkles" ? (
              <Sparkles className="size-4" strokeWidth={2} />
            ) : source.icon === "play" ? (
              <Play className="size-3.5 fill-current" strokeWidth={0} />
            ) : (
              source.badge
            )}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-[13px] font-bold text-hero-ink">{source.name}</span>
            <span className="truncate text-[11px] text-hero-soft">{source.note}</span>
          </span>
        </div>
      ))}

      {/* Lead pings, crossfading over the hub. */}
      <div aria-hidden="true" className="absolute left-[270px] top-10 h-10 w-[220px]">
        {reachLeadPings.map((ping, index) => (
          <span
            key={ping.label}
            className="tdm-cycle absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-hero-ink text-[13px] font-bold text-white"
            style={{ animationDelay: `${index * 2}s` }}
          >
            <span className="size-2 rounded-full" style={{ background: ping.color }} />
            {ping.label}
          </span>
        ))}
      </div>

      {/* The hub: your business. */}
      <div aria-hidden="true" className="absolute left-[305px] top-[135px] size-[150px]">
        <span className="tdm-ring absolute inset-0 rounded-full border-2 border-aqua-soft" />
        <span
          className="tdm-ring absolute inset-0 rounded-full border-2 border-teal"
          style={{ animationDelay: "1.3s" }}
        />
        <div className="tdm-pop absolute inset-0 flex items-center justify-center rounded-full bg-white shadow-[0_24px_60px_rgba(15,122,120,0.25)]">
          <div className="flex size-28 flex-col items-center justify-center gap-1 rounded-full bg-hero-ink text-white">
            <User className="size-[38px]" strokeWidth={1.8} />
            <span className="text-[11px] font-bold text-aqua">Your business</span>
          </div>
        </div>
        <span className="tdm-pop tdm-d4 absolute -right-[26px] top-1.5 rounded-full bg-teal px-2.5 py-1.5 text-xs font-extrabold text-hero-ink shadow-[0_8px_18px_rgba(15,42,44,0.14)]">
          ▲ Growing
        </span>
      </div>

      {/* Revenue climbing. */}
      <div className="tdm-in tdm-d3 absolute left-[250px] top-[336px] flex w-[260px] flex-col gap-1.5 rounded-[18px] bg-white px-4 pb-3 pt-3.5 shadow-[0_16px_40px_rgba(15,42,44,0.12)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-hero-muted">Revenue</span>
          <span className="rounded-full bg-[#eaf4d0] px-2 py-[3px] text-[11px] font-extrabold text-lime-ink">
            ▲ month on month
          </span>
        </div>
        <svg width="228" height="60" viewBox="0 0 228 60" aria-hidden="true" className="block">
          <path
            className="tdm-fade"
            d="M0 54 L 32 48 L 64 50 L 96 38 L 128 36 L 160 24 L 192 18 L 228 4 L 228 60 L 0 60 Z"
            fill="rgba(31, 163, 157, 0.14)"
          />
          <path
            className="tdm-draw"
            d="M0 54 L 32 48 L 64 50 L 96 38 L 128 36 L 160 24 L 192 18 L 228 4"
            fill="none"
            stroke="#0f7a78"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs text-hero-muted">
          <strong className="font-hero text-lg font-semibold text-hero-ink">{revenueFigure}</strong>{" "}
          driven for clients so far
        </span>
      </div>

      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="tdm-in tdm-d5 absolute left-[584px] top-[440px] inline-flex min-h-[42px] items-center gap-2 rounded-full border-[1.5px] border-dashed border-[#9fbcb8] bg-white/70 py-2 pl-2 pr-3.5 text-xs font-bold text-hero-ink no-underline hover:text-hero-teal"
        >
          <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-glow text-white">
            <Play className="size-2.5 fill-current" strokeWidth={0} />
          </span>
          Watch a live campaign
        </a>
      )}
    </div>
  );
}
