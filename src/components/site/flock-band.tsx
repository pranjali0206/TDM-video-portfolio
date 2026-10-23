import { useRef } from "react";

import flockLarge from "@/assets/flock-1672.webp";
import flockSmall from "@/assets/flock-900.webp";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The closing picture before the footer: one teal sheep standing out in a
 * white flock. Its sky fades up into the white of the contact section above,
 * so the two read as one, and the picture drifts gently as it scrolls past.
 * Framed on the teal sheep, so narrow screens crop the flock, not the hero.
 * On desktop it is held to about one screen high (480–640px under the nav),
 * so it frames like the phone: a strip of sky, then the teal sheep large
 * among its neighbours, all in view at once.
 */
export function FlockBand() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-flock]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="relative h-[clamp(420px,56vw,820px)] overflow-hidden bg-ivory lg:h-[clamp(480px,calc(100svh-90px),640px)]"
    >
      {/* Scaled up a touch so the drift never shows an edge. */}
      <img
        data-flock
        src={flockLarge}
        srcSet={`${flockSmall} 900w, ${flockLarge} 1672w`}
        sizes="100vw"
        width={1672}
        height={940}
        alt="One teal sheep standing out in a flock of white sheep"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full scale-[1.14] object-cover object-[50%_60%]"
      />
      {/* The sky melts up into the white of the contact section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-ivory via-ivory/70 to-transparent"
      />
    </div>
  );
}
