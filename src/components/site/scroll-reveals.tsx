import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-wide reveals, created after every section has mounted (and pinned) so
 * trigger positions account for pin spacing:
 *   [data-split] — headlines rise line by line out of a mask
 *   [data-fade]  — blocks drift up and in
 */
export function ScrollReveals() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.5,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
      gsap.from(el, {
        y: 44,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    // Fonts change line lengths; re-measure once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}

/** Fixed film-grain layer over everything. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-[0.07]"
    />
  );
}
