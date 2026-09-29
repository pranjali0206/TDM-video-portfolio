import { Asterisk } from "lucide-react";
import { useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

import { clients } from "./content";

/**
 * One slim, continuously moving strip of client names, sized so the whole
 * list fits on screen at once on desktop. Scrolling nudges its speed and
 * direction.
 */
export function ClientMarquee() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const loop = gsap.fromTo(
        "[data-marquee-track]",
        { xPercent: 0 },
        { xPercent: -50, duration: 36, ease: "none", repeat: -1 },
      );
      // Park far into the repeat so reversing never runs out of timeline.
      loop.totalTime(loop.duration() * 500);

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 3, 1 + Math.abs(self.getVelocity()) / 600);
          gsap.to(loop, { timeScale: self.direction * boost, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.25 });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Clients"
      className="relative overflow-hidden bg-accent py-6 md:py-8"
    >
      <p className="mb-4 px-6 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
        Trusted by teams who build, launch &amp; sell
      </p>
      <ul className="sr-only">
        {clients.map((client) => (
          <li key={client}>{client}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="flex overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]"
      >
        {/* Two identical copies of the list make the loop seamless. */}
        <div data-marquee-track className="flex shrink-0 items-center will-change-transform">
          {[...clients, ...clients].map((client, index) => (
            <span
              key={`${client}-${index}`}
              className="flex items-center font-display text-[clamp(1.05rem,1.5vw,1.9rem)] font-bold leading-none text-ink"
              style={{ fontStretch: "100%" }}
            >
              <span className="px-[0.9em]">{client}</span>
              <Asterisk className="size-[0.7em] text-glow" strokeWidth={2.5} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
