import { useLocation, useNavigate } from "@tanstack/react-router";

import { useExperience } from "./experience";

/**
 * Links to home-page sections that work from any page: on "/" they
 * smooth-scroll in place; anywhere else they navigate to "/#section" and the
 * router lands on it once the page’s scroll pins are in place. Contact always
 * opens its own page.
 */
export function useSectionLinks() {
  const { scrollTo } = useExperience();
  const navigate = useNavigate();
  const onHome = useLocation({ select: (location) => location.pathname === "/" });

  const hrefFor = (id: string) => {
    // Contact has a page of its own.
    if (id === "contact") return "/contact";
    if (onHome) return `#${id}`;
    return id === "top" ? "/" : `/#${id}`;
  };

  const goTo = (id: string) => {
    if (id === "contact") {
      void navigate({ to: "/contact" });
      return;
    }
    if (onHome) {
      // The nav bar stays on screen, so sections land just below it.
      const navHeight = document.querySelector<HTMLElement>("header.fixed")?.offsetHeight ?? 0;
      // Contact's headline is a full screen tall on its own, so land on the
      // headline itself, just clear of the fixed nav bar: the whole
      // "Need better results? Let's grow." block shows with the form below.
      const title = id === "contact" && document.querySelector<HTMLElement>("[data-contact-title]");
      if (title) scrollTo(title, { offset: -(navHeight + 48) });
      else scrollTo(`#${id}`, { offset: id === "top" ? 0 : -navHeight });
      return;
    }
    void navigate(id === "top" ? { to: "/" } : { to: "/", hash: id });
  };

  return { onHome, hrefFor, goTo };
}
