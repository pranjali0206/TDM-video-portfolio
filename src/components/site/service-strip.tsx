import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type ServicePill = {
  label: string;
  to: string;
  Icon: LucideIcon;
  tone: string;
  icon: string;
};

// Copies of the pill row laid side by side. The view is kept inside the
// second copy and quietly re-centred, so it never runs out in either direction.
const COPIES = 4;
// Auto-glide speed, px per second.
const SPEED = 32;
// After someone swipes, drags or scrolls it, wait this long before gliding on.
const RESUME_MS = 2200;

/**
 * The hero's service pills on one endless line. It glides left on its own and
 * can also be moved by hand: swipe it on a phone, drag it with the mouse or
 * scroll it sideways with a trackpad. Hovering or touching it holds the glide;
 * it resumes a moment after you let go. Reduced motion: it only moves by hand.
 */
export function ServiceStrip({ items }: { items: ServicePill[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const copy = firstCopyRef.current;
    if (!scroller || !copy) return;

    let span = copy.offsetWidth; // width of one copy, gaps included
    let pos = span; // float position; the browser rounds scrollLeft
    let lastHand = 0; // when someone last moved it by hand
    let hovering = false;
    let holding = false; // finger or mouse button down
    const still = prefersReducedMotion();

    const wrap = () => {
      if (span <= 0) return;
      if (pos < span) pos += span;
      else if (pos >= span * 2) pos -= span;
    };
    const apply = () => {
      wrap();
      scroller.scrollLeft = pos;
    };
    apply();

    // Hand scrolling (swipe, trackpad, scrollbar): follow it, then re-centre.
    const onScroll = () => {
      if (Math.abs(scroller.scrollLeft - pos) < 1.5) return; // our own write
      pos = scroller.scrollLeft;
      lastHand = performance.now();
      const before = pos;
      wrap();
      if (pos !== before) scroller.scrollLeft = pos;
    };

    // Trackpads send sideways wheel events; keep them on the strip (and away
    // from the page's smooth scroller). Vertical wheels still scroll the page.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      event.stopPropagation();
      pos += event.deltaX;
      lastHand = performance.now();
      apply();
    };

    // Mouse drag (touch uses native swiping). A drag doesn't open the pill.
    let dragX = 0;
    let dragged = false;
    let pressed = false;
    const onPointerDown = (event: PointerEvent) => {
      holding = true;
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pressed = true;
      dragX = event.clientX;
      dragged = false;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pressed) return;
      const dx = event.clientX - dragX;
      if (!dragged && Math.abs(dx) < 4) return;
      // Only now take the pointer: capturing on press would turn a plain
      // click into a click on the strip instead of the pill.
      if (!dragged) scroller.setPointerCapture(event.pointerId);
      dragged = true;
      dragX = event.clientX;
      pos -= dx;
      lastHand = performance.now();
      apply();
    };
    const onPointerUp = (event: PointerEvent) => {
      holding = false;
      pressed = false;
      if (scroller.hasPointerCapture(event.pointerId))
        scroller.releasePointerCapture(event.pointerId);
      lastHand = performance.now();
    };
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    // Keyboard focus on a pill holds it too.
    const onFocusIn = () => (hovering = true);
    const onFocusOut = () => (hovering = false);

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("pointerdown", onPointerDown);
    scroller.addEventListener("pointermove", onPointerMove);
    scroller.addEventListener("pointerup", onPointerUp);
    scroller.addEventListener("pointercancel", onPointerUp);
    scroller.addEventListener("click", onClick, true);
    scroller.addEventListener("pointerenter", onEnter);
    scroller.addEventListener("pointerleave", onLeave);
    scroller.addEventListener("focusin", onFocusIn);
    scroller.addEventListener("focusout", onFocusOut);
    // Touch: hold the glide from the first touch until shortly after release.
    const onTouchStart = () => (holding = true);
    const onTouchEnd = () => {
      holding = false;
      lastHand = performance.now();
    };
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", onTouchEnd, { passive: true });

    const resize = new ResizeObserver(() => {
      const offset = pos - span;
      span = copy.offsetWidth;
      pos = span + offset;
      apply();
    });
    resize.observe(copy);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(scroller);

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const idle = !hovering && !holding && now - lastHand > RESUME_MS;
      if (still || !visible || !idle) return;
      pos += SPEED * dt;
      apply();
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      io.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("pointermove", onPointerMove);
      scroller.removeEventListener("pointerup", onPointerUp);
      scroller.removeEventListener("pointercancel", onPointerUp);
      scroller.removeEventListener("click", onClick, true);
      scroller.removeEventListener("pointerenter", onEnter);
      scroller.removeEventListener("pointerleave", onLeave);
      scroller.removeEventListener("focusin", onFocusIn);
      scroller.removeEventListener("focusout", onFocusOut);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <nav
      data-hero-item
      aria-label="Services"
      className="-mx-5 -my-2.5 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] md:mx-0"
    >
      <div
        ref={scrollerRef}
        data-lenis-prevent-touch
        className="cursor-grab overflow-x-auto overflow-y-hidden py-2.5 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div
              key={copy}
              ref={copy === 0 ? firstCopyRef : undefined}
              // The repeats are for the loop: clickable, but hidden from
              // screen readers and the Tab key.
              aria-hidden={copy > 0 || undefined}
              className="flex shrink-0 gap-2.5 pr-2.5 md:gap-3 md:pr-3"
            >
              {items.map(({ label, to, Icon, tone, icon }) => (
                <Link
                  key={label}
                  to={to}
                  tabIndex={copy > 0 ? -1 : undefined}
                  draggable={false}
                  className="inline-flex min-h-12 shrink-0 select-none items-center gap-2.5 whitespace-nowrap rounded-full border border-hairline bg-white pl-2 pr-4 text-[15px] font-semibold text-hero-ink shadow-[0_6px_18px_rgba(15,42,44,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(15,42,44,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-teal md:min-h-14 md:gap-3 md:pl-2.5 md:pr-5 md:text-[17px]"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 place-items-center rounded-full md:size-[38px]",
                      tone,
                      icon,
                    )}
                  >
                    <Icon className="size-4 md:size-[18px]" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
