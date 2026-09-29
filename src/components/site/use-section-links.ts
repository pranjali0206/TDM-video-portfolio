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
      scrollTo(`#${id}`);
      return;
    }
    void navigate(id === "top" ? { to: "/" } : { to: "/", hash: id });
  };

  return { onHome, hrefFor, goTo };
}
