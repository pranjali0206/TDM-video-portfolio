import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { problemSolutions } from "./content";
import { servicePath } from "./service-links";
import { toneOf } from "./service-orbit";

/**
 * Every service as a colour pill (each in its own tone), in one centred row
 * that wraps on narrow screens. Each pill opens that service's page.
 */
export function ServicePills({ className }: { className?: string }) {
  return (
    <nav aria-label="Our services" className={cn("w-full", className)}>
      <ul className="flex flex-wrap justify-center gap-1.5 md:gap-2">
        {problemSolutions.map((service, index) => {
          const Icon = service.icon;
          const colors = toneOf(index);
          return (
            <li
              key={service.slug}
              className="hero-fade"
              style={{ ["--d" as string]: `${0.7 + index * 0.05}s` }}
            >
              <Link
                to={servicePath(service.slug)}
                className="inline-flex items-center gap-[0.5em] whitespace-nowrap rounded-full py-[0.34em] pl-[0.34em] pr-[1em] text-xs font-bold leading-none shadow-[0_10px_24px_-12px_rgba(0,40,40,0.55)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive md:text-sm"
                style={{ background: colors.bg, color: colors.fg }}
              >
                <span className="grid size-[1.7em] place-items-center rounded-full bg-white/90 text-ink">
                  <Icon className="size-[0.95em]" strokeWidth={2} />
                </span>
                {service.service}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
