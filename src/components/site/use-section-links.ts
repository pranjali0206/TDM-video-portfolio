import { useLocation, useNavigate } from "@tanstack/react-router";

import { useExperience } from "./experience";

/**
 * Links to home-page sections that work from any page: on "/" they
 * smooth-scroll in place; anywhere else they navigate to "/#section" and the
 * router lands on it once the page's scroll pins are in place.
 */
export function useSectionLinks() {
  const { scrollTo } = useExperience();
  const navigate = useNavigate();
  const onHome = useLocation({ select: (location) => location.pathname === "/" });

  const hrefFor = (id: string) => {
    if (onHome) return `#${id}`;
    return id === "top" ? "/" : `/#${id}`;
  };

  const goTo = (id: string) => {
    if (onHome) {
      // Contact's headline is a full screen tall on its own, so land on the
      // headline itself, just clear of the fixed nav bar: the whole
      // "Need better results? Let's grow." block shows with the form below.
      const title = id === "contact" && document.querySelector<HTMLElement>("[data-contact-title]");
      if (title) {
        const navHeight = document.querySelector<HTMLElement>("header.fixed")?.offsetHeight ?? 0;
        scrollTo(title, { offset: -(navHeight + 48) });
      } else scrollTo(`#${id}`);
      return;
    }
    void navigate(id === "top" ? { to: "/" } : { to: "/", hash: id });
  };

  return { onHome, hrefFor, goTo };
}
