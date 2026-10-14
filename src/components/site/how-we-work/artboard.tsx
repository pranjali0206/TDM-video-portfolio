import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const ARTBOARD_WIDTH = 760;
export const ARTBOARD_HEIGHT = 500;

/**
 * Every step visual is drawn on a fixed 760px artboard with absolute
 * coordinates. This scales it down to the container's width (never up) and
 * keeps a matching height, so narrow screens get the same composition.
 */
export function Artboard({
  height = ARTBOARD_HEIGHT,
  className,
  children,
}: {
  height?: number;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / ARTBOARD_WIDTH));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ height: height * scale }}>
      <div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width: ARTBOARD_WIDTH, height, transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
