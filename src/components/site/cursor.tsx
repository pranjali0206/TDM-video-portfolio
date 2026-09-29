import { useEffect, useRef } from "react";

import { finePointer, gsap } from "@/lib/gsap";

type Mode = "default" | "link" | "media";

/**
 * Two-part cursor: a precise dot and a lagging ring. Over [data-cursor]
 * elements the ring grows into a lime disc labelled with data-cursor-label
 * ("Play", "Drag", …); over links and buttons it swells slightly.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label || !finePointer()) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

    let visible = false;
    let mode: Mode = "default";

    const setMode = (next: Mode, text = "") => {
      if (next === mode && label.textContent === text) return;
      mode = next;
      label.textContent = text;
      ring.dataset["mode"] = next;
      dot.dataset["mode"] = next;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const media = target.closest<HTMLElement>("[data-cursor]");
      if (media) return setMode("media", media.dataset["cursorLabel"] ?? "View");
      if (target.closest("a, button, [role='button'], select, label, input[type='range']")) {
        return setMode("link");
      }
      setMode("default");
    };

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.3, ease: "power3.out" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onLeave);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);

    return () => {
      root.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-mode="default"
        className="group pointer-events-none fixed left-0 top-0 z-[200] hidden size-9 place-items-center rounded-full border border-ivory/60 opacity-0 mix-blend-difference transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)_and_(pointer:fine)]:grid data-[mode=link]:size-16 data-[mode=link]:border-ivory data-[mode=link]:bg-ivory/10 data-[mode=media]:size-[6.5rem] data-[mode=media]:border-ink data-[mode=media]:bg-ink data-[mode=media]:mix-blend-normal"
      >
        <span
          ref={labelRef}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent opacity-0 transition-opacity duration-300 group-data-[mode=media]:opacity-100"
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-mode="default"
        className="group pointer-events-none fixed left-0 top-0 z-[201] hidden opacity-0 mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <span className="block size-1.5 rounded-full bg-ivory transition-transform duration-300 group-data-[mode=media]:scale-0" />
      </div>
    </>
  );
}
