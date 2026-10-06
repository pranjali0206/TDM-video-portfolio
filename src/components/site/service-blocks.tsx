import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Mail, MessageCircle, Phone } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { companyStats, formatStat } from "./company-stats";
import { problemSolutions } from "./content";
import { Reveal } from "./primitives";
import { contactDetails, servicePath, type ServiceSlug } from "./service-links";

/*
 * Shared blocks for the dedicated service pages (/ads, /websites, /crm, /erp,
 * /automation, /ai-agents): the numbers strip, links to the other services
 * and a contact section tailored to each service.
 */

/** The company figures, as a ruled row of big numbers. */
export function NumbersStrip({ dark = false }: { dark?: boolean }) {
  return (
    <Reveal>
      <dl
        className={cn(
          "grid grid-cols-2 border-y lg:grid-cols-4",
          dark ? "border-ivory/15" : "border-ink/15",
        )}
      >
        {companyStats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "py-7 md:py-9",
              index % 2 === 1 && "border-l pl-4 md:pl-8",
              index >= 2 && "border-t lg:border-t-0",
              index >= 1 && "lg:border-l lg:pl-8",
              dark ? "border-ivory/15" : "border-ink/15",
            )}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="whitespace-nowrap font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-none tracking-[-0.04em]">
              {formatStat(stat)}
            </dd>
            <dd
              className={cn(
                "mt-3 max-w-[14rem] text-sm font-medium leading-snug md:text-base",
                dark ? "text-ivory/70" : "text-ink/65",
              )}
            >
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/** Cards linking to the services that pair well with this one. */
export function RelatedServices({ slugs }: { slugs: ServiceSlug[] }) {
  const services = slugs.map((slug) => problemSolutions.find((item) => item.slug === slug)!);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map(({ slug, service, tagline, answer, icon: Icon }, index) => (
        <li key={slug}>
          <Reveal delay={index * 80} className="h-full">
            <Link
              to={servicePath(slug)}
              className="group flex h-full flex-col rounded-[1.5rem] border border-ink/10 bg-white/70 p-6 transition duration-500 hover:-translate-y-1.5 hover:border-ink/25 hover:shadow-[0_30px_60px_-30px_rgba(0,40,40,0.45)] md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-ink">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
              </div>
              <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-deep-teal">
                {tagline}
              </p>
              <h3
                className="mt-2 font-display text-2xl font-bold leading-tight"
                style={{ fontStretch: "105%" }}
              >
                {service}
              </h3>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink/75">{answer}</p>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

const fieldControl =
  "peer w-full resize-none border-0 border-b border-ivory/25 bg-transparent px-0 pb-3 pt-7 text-base text-ivory outline-none md:text-lg";
const fieldLabel =
  "pointer-events-none absolute left-0 top-7 text-base font-medium text-ivory/65 transition-all duration-300 md:text-lg peer-focus:top-0 peer-focus:font-mono peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.25em] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.25em]";

function DarkField({
  label,
  name,
  type = "text",
  required = false,
  multiline = false,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={3}
          placeholder=" "
          className={fieldControl}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder=" "
          className={fieldControl}
        />
      )}
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {!required && " (optional)"}
      </label>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 peer-focus:scale-x-100" />
    </div>
  );
}

/** The one question that matters most for this service, as chips. */
function ChoiceField({ label, name, options }: { label: string; name: string; options: string[] }) {
  const [value, setValue] = useState("");
  return (
    <fieldset className="md:col-span-2">
      <legend className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {label}
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
              value === option
                ? "border-accent bg-accent text-ink"
                : "border-ivory/25 text-ivory/85 hover:border-ivory/60",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              required
              checked={value === option}
              onChange={() => setValue(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export type ContactQuestion = { label: string; options: string[] };

/**
 * Closing contact section for a service page: a short pitch, direct contact
 * options and an enquiry form with one service-specific question.
 */
export function ServiceContact({
  service,
  title,
  accent,
  intro,
  question,
  steps = ["Share the goal", "Get a growth plan", "Launch & scale"],
}: {
  service: string;
  title: ReactNode;
  accent: string;
  intro: string;
  question: ContactQuestion;
  steps?: string[];
}) {
  const [sent, setSent] = useState(false);
  const { whatsapp, phone, email } = contactDetails;
  const direct = [
    whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp us",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi TDM, I'd like to talk about ${service}.`)}`,
    },
    phone && { icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    email && {
      icon: Mail,
      label: email,
      href: `mailto:${email}?subject=${encodeURIComponent(`${service} enquiry`)}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  return (
    <section
      id="contact"
      className="scroll-mt-28 px-4 pb-24 pt-4 sm:px-6 md:px-14 md:pb-32 md:pt-8 lg:px-20"
    >
      <Reveal>
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-ivory sm:rounded-[2.5rem] sm:px-10 sm:py-16 md:px-16 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="orb -left-20 -top-20 size-[22rem] bg-accent/30" />
            <div className="orb -bottom-24 -right-16 size-[22rem] bg-glow/25 [animation-delay:-7s]" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
                Start with {service}
              </p>
              <h2
                className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.98] tracking-[-0.02em]"
                style={{ fontStretch: "105%" }}
              >
                {title}{" "}
                <span
                  className="font-serif font-normal italic tracking-normal text-glow"
                  style={{ fontStretch: "100%" }}
                >
                  {accent}
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-ivory/80 sm:text-lg">
                {intro}
              </p>

              <ol className="mt-10 space-y-4 border-t border-ivory/15 pt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ivory/90">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="text-accent">0{index + 1}</span>
                    <span className="h-px w-6 bg-ivory/25" />
                    {step}
                  </li>
                ))}
              </ol>

              {direct.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-3">
                  {direct.map(({ icon: Icon, label, href }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full border border-ivory/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                    >
                      <Icon className="size-4" />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="grid content-start gap-x-8 gap-y-6 md:grid-cols-2"
            >
              <input type="hidden" name="service" value={service} />
              <ChoiceField label={question.label} name="detail" options={question.options} />
              <DarkField label="Name" name="name" required />
              <DarkField label="Phone" name="phone" type="tel" required />
              <DarkField label="Email" name="email" type="email" required />
              <DarkField label="Company or website" name="company" />
              <DarkField
                label="Anything we should know?"
                name="message"
                multiline
                className="md:col-span-2"
              />
              <div className="mt-4 md:col-span-2">
                <button
                  type="submit"
                  className="group inline-flex h-14 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink transition-colors hover:bg-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
                >
                  {sent ? "Enquiry received — we’ll be in touch" : `Talk to us about ${service}`}
                  <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
                    {sent ? <Check className="size-5" /> : <ArrowUpRight className="size-5" />}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
