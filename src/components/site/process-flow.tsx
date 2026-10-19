import { Bot, Clapperboard, Globe, Magnet, Megaphone } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import tdmMascot from "@/assets/tdm-mascot.webp";
import { cn } from "@/lib/utils";

/**
 * Shared pieces of the home page's process flow (the reel ring card plus the
 * cards in growth-process.tsx): the card shell that stacks over the one
 * before it, the step bar, and the mascot sticker.
 */

const flowSteps = [
  { id: "create", name: "Create", icon: Clapperboard },
  { id: "reach", name: "Reach", icon: Megaphone },
  { id: "convert", name: "Convert", icon: Globe },
  { id: "manage", name: "Manage", icon: Magnet },
  { id: "automate", name: "Automate", icon: Bot },
] as const;

export type FlowStep = (typeof flowSteps)[number]["id"];

/** Where we are in the flow: every step, the current one lit up. */
export function FlowBar({ current, dark = false }: { current: FlowStep; dark?: boolean }) {
  return (
    <ol aria-label="Our process" className="flex items-center justify-center gap-1 sm:gap-2">
      {flowSteps.map((step, index) => {
        const Icon = step.icon;
        const isCurrent = step.id === current;
        return (
          <li key={step.id} className="flex items-center gap-1 sm:gap-2">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn("h-0.5 w-2 rounded-full sm:w-6", dark ? "bg-ivory/25" : "bg-ink/20")}
              />
            )}
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full font-display font-bold transition-colors",
                isCurrent
                  ? cn(
                      "px-3.5 py-2 text-sm shadow-[0_12px_28px_-14px_rgba(0,30,30,0.7)] sm:px-5 sm:py-2.5 sm:text-base",
                      dark ? "bg-ivory text-ink" : "bg-ink text-ivory",
                    )
                  : cn(
                      "p-2 text-sm sm:px-3.5 sm:py-2",
                      dark
                        ? "text-ivory/55 ring-1 ring-ivory/20"
                        : "text-ink/55 ring-1 ring-ink/15",
                    ),
              )}
            >
              <Icon className="size-4" strokeWidth={2.2} />
              <span className={isCurrent ? undefined : "sr-only sm:not-sr-only"}>{step.name}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * One step of the flow, as a rounded card in a light shade of its own colour,
 * a little smaller than the screen. The section is what gets pinned; the inner
 * card is what shrinks back and dims as the next card stacks over it (driven
 * from growth-process.tsx).
 */
export function FlowCard({
  step,
  label,
  background,
  dark = false,
  children,
  id,
}: {
  step: FlowStep;
  label: string;
  background: string;
  dark?: boolean;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-card
      data-step={step}
      aria-label={label}
      className="relative px-3 py-3 md:px-6 lg:px-10"
    >
      <div
        data-card-inner
        className={cn(
          "relative mx-auto flex max-w-[1500px] origin-top flex-col overflow-hidden rounded-[2rem] px-5 py-9 shadow-[0_30px_70px_-36px_rgba(0,30,30,0.45)] ring-1 ring-ink/5 md:rounded-[2.75rem] md:px-12 md:py-10 lg:min-h-[74svh] lg:px-16",
          dark ? "text-ivory" : "text-ink",
        )}
        style={{ background }}
      >
        <FlowBar current={step} dark={dark} />
        <div className="mt-8 flex flex-1 flex-col justify-center md:mt-10">{children}</div>
        <span
          data-card-shade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 bg-ink opacity-0"
        />
      </div>
    </section>
  );
}

/** The mascot sticker, with what it says above its head. */
export function Sticker({
  id,
  say,
  sayAlign = "center",
  className,
  style,
}: {
  id: string;
  say?: string;
  /** Which way the bubble grows on phones, so it stays on screen. */
  sayAlign?: "center" | "left" | "right";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-sticker={id}
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-20", className)}
      style={style}
    >
      <div className="relative">
        {say && (
          <span
            data-say
            className={cn(
              "absolute bottom-[96%] whitespace-nowrap rounded-full rounded-bl-sm bg-ink px-3.5 py-2 text-sm font-bold text-ivory shadow-[0_12px_24px_-10px_rgba(0,40,40,0.6)] md:text-base",
              sayAlign === "center" && "left-1/2 -translate-x-1/2",
              sayAlign === "left" && "left-0 sm:left-1/2 sm:-translate-x-1/2",
              sayAlign === "right" && "right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2",
            )}
          >
            {say}
          </span>
        )}
        <img
          src={tdmMascot}
          alt=""
          width={271}
          height={360}
          draggable={false}
          className="mascot-bob block h-auto w-full drop-shadow-[0_14px_18px_rgba(0,40,40,0.28)]"
        />
      </div>
    </div>
  );
}
