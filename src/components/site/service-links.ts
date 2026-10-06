/** Where each service's "Start with …" button leads, keyed by service slug. */
export const servicePaths = {
  mediahouse: "/media-house",
  ads: "/ads",
  websites: "/websites",
  crm: "/crm",
  erp: "/erp",
  automations: "/automation",
  "ai-agents": "/ai-agents",
} as const;

export type ServiceSlug = keyof typeof servicePaths;

export const servicePath = (slug: string) =>
  slug in servicePaths ? servicePaths[slug as ServiceSlug] : ("/services" as const);

/**
 * Direct ways to reach the team, shown beside every service contact form.
 * Each button appears only once its value is filled in.
 */
export const contactDetails = {
  /** International format, digits only, e.g. "919876543210". */
  whatsapp: "",
  /** As dialled, e.g. "+91 98765 43210". */
  phone: "",
  email: "",
};
