import { Users } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

import { closeSources, crmColumns, erpModules, leadTimeline } from "./data";

const sourceDelay = ["", "tdm-d1", "tdm-d2", "tdm-d3", "tdm-d4"];
const timelineDelay = ["tdm-d3", "tdm-d4", "tdm-d6"];

/** 04 Close: every channel lands in one CRM; the same lead is called in two minutes. */
export function StepClose() {
  // Kanban cards pop in one after another, left to right, top to bottom.
  let cardIndex = 0;

  return (
    <div className="flex h-[500px] w-[760px] flex-col gap-[18px] text-hero-ink">
      <div className="flex flex-1 items-center">
        <ul className="flex w-[170px] shrink-0 flex-col gap-2.5">
          {closeSources.map((source, index) => (
            <li
              key={source.label}
              className={cn(
                "tdm-in flex items-center gap-2 rounded-[14px] bg-white px-3 py-2.5 text-[13px] font-semibold",
                sourceDelay[index],
              )}
            >
              <span className="size-2.5 rounded-full" style={{ background: source.color }} />
              {source.label}
            </li>
          ))}
        </ul>

        <svg width="90" height="260" viewBox="0 0 90 260" aria-hidden="true" className="shrink-0">
          {closeSources.map((source) => (
            <path
              key={source.label}
              className="tdm-flow"
              d={source.path}
              fill="none"
              stroke={source.color}
              strokeWidth="2"
            />
          ))}
        </svg>

        <div className="tdm-in tdm-d2 flex min-w-0 flex-1 flex-col gap-3 rounded-[20px] bg-white p-4 shadow-[0_20px_50px_rgba(15,42,44,0.14)]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[15px] font-bold">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-hero-ink text-aqua">
                <Users className="size-3.5" strokeWidth={2} />
              </span>
              One CRM · All leads
            </span>
            <span className="font-mono text-[11px] text-hero-teal">LIVE</span>
          </div>

          <div className="flex gap-2">
            {crmColumns.map((column) => (
              <div
                key={column.title}
                className={cn(
                  "flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl p-2",
                  column.won ? "bg-[#eaf4d0]" : "bg-[#f2f6f4]",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-bold",
                    column.won ? "text-lime-ink" : "text-hero-muted",
                  )}
                >
                  {column.title}
                </span>
                {column.cards.map((card) => {
                  const delay = 0.24 + 0.08 * cardIndex++;
                  return (
                    <span
                      key={card.label}
                      className={cn(
                        "tdm-pop rounded-lg border-l-[3px] px-2 py-[7px] text-[11px]",
                        card.highlight
                          ? "bg-[#f6fbe9] font-bold shadow-[0_0_0_2px_#d7e98a]"
                          : "bg-white font-semibold",
                      )}
                      style={{ borderLeftColor: card.accent, animationDelay: `${delay}s` }}
                    >
                      {card.label}
                      {card.note && (
                        <span className="block text-[10px] font-semibold text-lime-ink">
                          {card.note}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t border-dashed border-hairline pt-2.5">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.06em] text-hero-soft">
              Same lead · 2 min
            </span>
            {leadTimeline.map((event, index) => (
              <Fragment key={`${event.time}-${event.label}`}>
                {index > 0 && (
                  <span aria-hidden="true" className="text-[11px] text-[#8aa3a2]">
                    →
                  </span>
                )}
                <span
                  className={cn(
                    "tdm-pop rounded-full px-[9px] py-[5px] text-[11px]",
                    timelineDelay[index],
                    event.done ? "bg-teal font-extrabold" : "bg-[#f2f6f4] font-semibold",
                  )}
                >
                  {event.time} {event.label}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="tdm-in tdm-d5 flex flex-wrap items-center gap-2 rounded-2xl bg-hero-ink px-3.5 py-3 text-white">
        <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-aqua">
          ERP keeps ops in sync
        </span>
        {erpModules.map((module) => (
          <span
            key={module}
            className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold"
          >
            {module}
          </span>
        ))}
      </div>
    </div>
  );
}
