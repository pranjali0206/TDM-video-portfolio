import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import { chapters, toTimecode } from "./content";
import { useExperience } from "./experience";

// The whole page reads as a 2.5-minute sequence on the scrub bar.
const PAGE_FRAMES = 150 * 24;

type Marker = { id: string; label: string; position: number };

/**
 * Fixed "edit timeline" at the bottom of the viewport: the playhead tracks
 * page progress, chapter markers jump to sections, and the timecode reads
 * like a sequence being scrubbed.
 */
export function ScrollHud() {
  const { scrollTo } = useExperience();
  const rootRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [current, setCurrent] = useState<string>(chapters[0].label);
  const markersRef = useRef<Marker[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      const next = chapters.map((chapter) => {
        const el = document.getElementById(chapter.id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return {
          id: chapter.id,
          label: chapter.label,
          position: Math.min(1, Math.max(0, top / max)),
        };
      });
      markersRef.current = next;
      setMarkers(next);
    };
    ScrollTrigger.addEventListener("refresh", measure);
    measure();
    return () => ScrollTrigger.removeEventListener("refresh", measure);
  }, []);

  useGSAP(() => {
    const playhead = playheadRef.current;
    if (!playhead) return;
    const moveTo = gsap.quickTo(playhead, "xPercent", { duration: 0.35, ease: "power3" });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        moveTo(self.progress * 100);
        if (timecodeRef.current)
          timecodeRef.current.textContent = toTimecode(self.progress * PAGE_FRAMES);
        const active = [...markersRef.current]
          .reverse()
          .find((marker) => marker.position <= self.progress + 0.002);
        if (active) setCurrent(active.label);
      },
    });

    // Step aside once the curtain footer is uncovered.
    const dock = dockRef.current;
    ScrollTrigger.create({
      trigger: "#site-footer",
      start: "top 85%",
      refreshPriority: -1,
      onEnter: () =>
        gsap.to(dock, { yPercent: 160, autoAlpha: 0, duration: 0.5, ease: "power3.in" }),
      onLeaveBack: () =>
        gsap.to(dock, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" }),
    });
  });

  useGSAP(() => {
    gsap.fromTo(
      rootRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.6, ease: "expo.out" },
    );
  });

  return (
    <div className="fixed bottom-5 left-1/2 z-40 hidden w-[min(640px,calc(100%-4rem))] -translate-x-1/2 md:block">
      <div ref={dockRef}>
        <div
          ref={rootRef}
          className="flex items-center gap-4 rounded-full border border-ink/10 bg-white/75 py-2 pl-4 pr-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55 opacity-0 shadow-[0_10px_40px_-20px_rgba(0,40,40,0.4)] backdrop-blur-xl"
        >
          <span className="flex shrink-0 items-center gap-2">
            <span className="size-1.5 rounded-full bg-glow" />
            <span ref={timecodeRef} className="tabular-nums text-ink">
              00:00:00:00
            </span>
          </span>

          <div className="relative h-6 flex-1">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/15" />
            {markers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => scrollTo(`#${marker.id}`)}
                aria-label={`Jump to ${marker.label}`}
                className="group absolute top-0 flex h-full w-3 -translate-x-1/2 justify-center"
                style={{ left: `${marker.position * 100}%` }}
              >
                <span className="mt-1.5 h-3 w-px bg-ink/35 transition-colors group-hover:bg-glow" />
                <span className="pointer-events-none absolute bottom-full mb-3 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                  {marker.label}
                </span>
              </button>
            ))}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div ref={playheadRef} className="absolute inset-y-0 left-0 w-full">
                <span className="absolute inset-y-0 left-0 w-px bg-glow" />
                <span className="absolute -left-[3px] top-0 size-[7px] rotate-45 bg-glow" />
              </div>
            </div>
          </div>

          <span className="w-[5.5rem] shrink-0 truncate text-right text-deep-teal">{current}</span>
        </div>
      </div>
    </div>
  );
}
