import tdmMascot from "@/assets/tdm-mascot.webp";

import { useSectionLinks } from "./use-section-links";

/**
 * The TDM mascot, floating in the bottom-right corner of every page. It bobs
 * gently, waves a "Let's talk!" bubble on hover and opens the contact form.
 */
export function FloatingMascot() {
  const { hrefFor, goTo } = useSectionLinks();

  return (
    <a
      href={hrefFor("contact")}
      onClick={(event) => {
        event.preventDefault();
        goTo("contact");
      }}
      aria-label="Let’s talk — start a project"
      className="group fixed bottom-3 right-2 z-40 block w-16 sm:bottom-5 sm:right-4 sm:w-20 md:w-24"
    >
      <span className="pointer-events-none absolute bottom-full right-1/2 mb-1 translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full rounded-br-sm bg-ink px-3 py-1.5 text-xs font-semibold text-ivory opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        Let’s talk!
      </span>
      <img
        src={tdmMascot}
        alt=""
        width={271}
        height={360}
        draggable={false}
        className="mascot-bob block h-auto w-full drop-shadow-[0_14px_18px_rgba(0,40,40,0.28)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
      />
    </a>
  );
}
