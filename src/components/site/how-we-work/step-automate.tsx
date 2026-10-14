import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { followUps, sampleLead, type FollowUp } from "./data";

const rowTone: Record<FollowUp["tone"], { row: string; when: string; status: string }> = {
  done: {
    row: "bg-[#f6faf8]",
    when: "text-hero-teal",
    status: "bg-[#dff4f2] text-[#0f6f6b] font-bold",
  },
  won: {
    row: "bg-[#f3f9e4] border border-teal",
    when: "text-lime-ink",
    status: "bg-teal text-[#2c3a0a] font-extrabold",
  },
  later: {
    row: "border border-dashed border-outline",
    when: "text-hero-soft",
    status: "bg-[#f2f6f4] text-hero-muted font-bold",
  },
};

/** 05 Automate: the AI agent works the lead; every follow-up is logged in the CRM. */
export function StepAutomate() {
  return (
    <div className="flex h-[500px] w-[760px] items-stretch gap-5 text-hero-ink">
      <div className="flex w-[290px] shrink-0 flex-col gap-3.5">
        <div className="tdm-in flex flex-col gap-3 rounded-[20px] bg-hero-ink p-[18px] text-white shadow-[0_20px_50px_rgba(15,42,44,0.22)]">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="relative size-12 shrink-0">
              <span className="tdm-ring absolute inset-0 rounded-full border-2 border-aqua" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--hero-teal-2),var(--hero-teal))]">
                <Sparkles className="size-[22px]" strokeWidth={2} />
              </span>
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-base font-bold">TDM AI Agent</span>
              <span className="text-xs text-aqua">● Active 24/7</span>
            </span>
          </div>
          <span className="text-[13px] leading-normal text-[#b9d4d0]">
            Replies instantly, follows up on WhatsApp and calls, books site visits and logs every
            touch in your CRM.
          </span>
        </div>

        <div className="tdm-in tdm-d2 flex flex-1 flex-col gap-2.5 rounded-[20px] bg-white p-4 shadow-[0_14px_36px_rgba(15,42,44,0.1)]">
          <span className="flex items-center gap-2.5">
            <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-teal text-[13px] font-extrabold">
              {sampleLead.initials}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold">{sampleLead.name}</span>
              <span className="text-[11px] text-hero-soft">
                {sampleLead.lookingFor} · {sampleLead.source}
              </span>
            </span>
          </span>
          <span className="flex justify-between text-[11px] font-bold text-hero-muted">
            Lead score
            <span className="text-[#b4471f]">
              {sampleLead.score} · {sampleLead.scoreLabel}
            </span>
          </span>
          <span
            role="meter"
            aria-label="Lead score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sampleLead.score}
            className="h-2 overflow-hidden rounded-full bg-[#eef3f1]"
          >
            <span
              className="block h-full rounded-full bg-[linear-gradient(90deg,#7fd6d3,#d7e98a,#e8693a)]"
              style={{
                width: `${sampleLead.score}%`,
                animation: "tdmMeter 1.8s cubic-bezier(.4,0,.2,1) .6s both",
              }}
            />
          </span>
          <span className="mt-auto flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#eaf4d0] px-2.5 py-[5px] text-[11px] font-bold text-lime-ink">
              Site visit booked
            </span>
            <span className="rounded-full bg-[#f2f6f4] px-2.5 py-[5px] text-[11px] font-semibold">
              Next: {sampleLead.nextVisit}
            </span>
          </span>
        </div>
      </div>

      <div className="tdm-in tdm-d1 flex min-w-0 flex-1 flex-col gap-3 rounded-[20px] bg-white px-5 py-[18px] shadow-[0_14px_36px_rgba(15,42,44,0.1)]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold">Automated follow-ups</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-hero-teal">
            Tracked in CRM
          </span>
        </div>
        <ol className="flex flex-col gap-1">
          {followUps.map((step, index) => {
            const tone = rowTone[step.tone];
            return (
              <li
                key={step.when}
                className={cn("tdm-in flex gap-3 rounded-[14px] px-2.5 py-[9px]", tone.row)}
                style={{ animationDelay: `${0.4 + index * 0.5}s` }}
              >
                <span className={cn("w-[62px] shrink-0 pt-0.5 font-mono text-[11px]", tone.when)}>
                  {step.when}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-[13px] font-bold",
                      step.tone === "later" && "text-hero-muted",
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      step.tone === "later" ? "text-hero-soft" : "text-hero-muted",
                    )}
                  >
                    {step.detail}
                  </span>
                </span>
                <span
                  className={cn(
                    "self-center whitespace-nowrap rounded-full px-[9px] py-1 text-[11px]",
                    tone.status,
                  )}
                >
                  {step.status}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
