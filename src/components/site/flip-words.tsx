import { useEffect, useRef, useState } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Aceternity-style "flip words", rebuilt on GSAP: the current phrase blurs
 * out upward, then the next one assembles letter by letter.
 */
export function FlipWords({
  words,
  className,
  interval = 2800,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const word = words[index] ?? "";

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-letter]",
        { opacity: 0, yPercent: 70, filter: "blur(8px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.022,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [index], scope: ref },
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) {
        setIndex((current) => (current + 1) % words.length);
        return;
      }
      gsap.to(el, {
        opacity: 0,
        y: -14,
        filter: "blur(8px)",
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(el, { opacity: 1, y: 0, filter: "none" });
          setIndex((current) => (current + 1) % words.length);
        },
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span ref={ref} aria-live="polite" className={cn("relative inline-block", className)}>
      {word.split(" ").map((part, partIndex) => (
        <span key={`${index}-${partIndex}`} className="inline-block whitespace-nowrap">
          {[...part].map((letter, letterIndex) => (
            <span key={letterIndex} data-letter className="inline-block">
              {letter}
            </span>
          ))}
          {partIndex < word.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
