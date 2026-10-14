import { ArrowUpRight, Check, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useExperience } from "./experience";
import { Magnetic, RollText, SectionLabel } from "./primitives";
import { contactDetails } from "./service-links";

const businessDomains = [
  "Real Estate & Construction",
  "Architecture & Interior Design",
  "Healthcare & Biotech",
  "Education & Coaching",
  "Retail & E-commerce",
  "Trading & Distribution",
  "Manufacturing",
  "IT & Software",
  "Hospitality & Travel",
  "Finance & Insurance",
  "Food & Beverage",
  "Fashion & Lifestyle",
  "Startup",
];
const OTHER_DOMAIN = "Other";

const services = [
  "MediaHouse — videos & creative",
  "Ads & performance marketing",
  "Website",
  "CRM",
  "ERP",
  "Automation",
  "AI agents",
];

const budgets = ["Under ₹50,000", "₹50,000 – ₹1 lakh", "₹1 – 3 lakh", "₹3 lakh +", "Not sure yet"];

const nextSteps = [
  {
    title: "We review your brief",
    detail: "A strategist reads it and looks at your current setup.",
  },
  { title: "We call you", detail: "A short call to understand the goal, numbers and timeline." },
  {
    title: "You get a growth plan",
    detail: "A clear plan and quote covering what we’ll build and run.",
  },
];

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "domain"
  | "otherDomain"
  | "services"
  | "budget"
  | "message";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 1000;

/** Checks the enquiry and returns a message for each field that needs fixing. */
function validate(form: FormData): Errors {
  const text = (name: FieldName) => String(form.get(name) ?? "").trim();
  const errors: Errors = {};
  if (text("name").length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL.test(text("email"))) errors.email = "Please enter a valid email address.";
  if (text("phone").replace(/\D/g, "").length < 10)
    errors.phone = "Please enter a phone number with at least 10 digits.";
  if (!text("domain")) errors.domain = "Please choose your industry.";
  if (text("domain") === OTHER_DOMAIN && !text("otherDomain"))
    errors.otherDomain = "Please tell us your industry.";
  if (form.getAll("services").length === 0) errors.services = "Pick at least one service.";
  if (text("message").length < 10)
    errors.message = "Please tell us a little about your goal (at least 10 characters).";
  return errors;
}

const control =
  "w-full scroll-mt-32 rounded-xl border bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/40 focus:border-deep-teal focus:ring-4 focus:ring-deep-teal/15";
const controlState = (error?: string) =>
  error ? "border-red-600/70 focus:border-red-600 focus:ring-red-600/15" : "border-ink/15";

/** A labelled control with its hint and error text, wired up for screen readers. */
function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-glow">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-ink/50">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-ink/55">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: boolean) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  required = false,
  error,
  className,
}: {
  name: FieldName;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  error?: string | undefined;
  className?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={cn(control, controlState(error), "h-12")}
      />
    </FieldShell>
  );
}

function SelectField({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  required = false,
  error,
}: {
  name: FieldName;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | undefined;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error)}
          className={cn(
            control,
            controlState(error),
            "h-12 cursor-pointer appearance-none pr-10",
            !value && "text-ink/45",
          )}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/60"
        />
      </div>
    </FieldShell>
  );
}

/** Services as toggle chips (checkboxes underneath), so a visitor can pick several. */
function ServicesField({ error }: { error?: string | undefined }) {
  const id = useId();
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <fieldset
      aria-describedby={error ? `${id}-error` : `${id}-hint`}
      aria-invalid={error ? true : undefined}
      className="flex flex-col gap-3 md:col-span-2"
    >
      <legend className="text-sm font-semibold text-ink">
        What can we help with?
        <span aria-hidden="true" className="ml-0.5 text-glow">
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => {
          const on = picked.includes(service);
          return (
            <label
              key={service}
              className={cn(
                "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-deep-teal/20",
                on
                  ? "border-deep-teal bg-deep-teal text-white"
                  : "border-ink/15 bg-white text-ink/80 hover:border-ink/35",
              )}
            >
              <input
                type="checkbox"
                name="services"
                value={service}
                checked={on}
                onChange={() =>
                  setPicked((current) =>
                    on ? current.filter((item) => item !== service) : [...current, service],
                  )
                }
                className="sr-only"
              />
              {on && <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
              {service}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-sm text-ink/55">
          Choose all that apply.
        </p>
      )}
    </fieldset>
  );
}

function MessageField({ error }: { error?: string | undefined }) {
  const id = useId();
  const [length, setLength] = useState(0);
  return (
    <FieldShell
      id={id}
      label="Tell us about your project"
      required
      error={error}
      hint={
        <span className="flex justify-between gap-4">
          <span>Your goal, where things stand today and any timeline you’re working to.</span>
          <span className="shrink-0 tabular-nums">
            {length}/{MESSAGE_MAX}
          </span>
        </span>
      }
      className="md:col-span-2"
    >
      <textarea
        id={id}
        name="message"
        required
        rows={5}
        maxLength={MESSAGE_MAX}
        placeholder="e.g. We sell plots in Indore and want more qualified site-visit bookings from Meta ads."
        onChange={(event) => setLength(event.target.value.length)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, true)}
        className={cn(control, controlState(error), "resize-y py-3 leading-relaxed")}
      />
    </FieldShell>
  );
}

/** A numbered group heading inside the form card. */
function FormGroup({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
      <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-deep-teal md:col-span-2">
        <span>{num}</span>
        <span className="h-px w-6 bg-deep-teal/30" />
        {title}
      </p>
      {children}
    </div>
  );
}

/** Shown in place of the form once an enquiry is in. */
function Confirmation({
  name,
  email,
  onReset,
}: {
  name: string;
  email: string;
  onReset: () => void;
}) {
  return (
    <div role="status" className="flex flex-col items-start gap-5 py-6 md:py-10">
      <span className="grid size-14 place-items-center rounded-full bg-deep-teal text-white">
        <Check aria-hidden="true" className="size-7" strokeWidth={2.6} />
      </span>
      <h3 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
        Thank you{name ? `, ${name.split(" ")[0]}` : ""}. Your enquiry is in.
      </h3>
      <p className="max-w-lg text-lg leading-relaxed text-ink/70">
        Our team will review your brief and get back to you
        {email ? (
          <>
            {" "}
            at <span className="font-semibold text-ink">{email}</span>
          </>
        ) : null}{" "}
        to set up a call.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-2 font-semibold text-deep-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-teal"
      >
        Send another enquiry
      </button>
    </div>
  );
}

export function Contact() {
  const { scrollTo } = useExperience();
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [domain, setDomain] = useState("");
  const [budget, setBudget] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { whatsapp, phone, email } = contactDetails;
  const direct = [
    whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp us",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi TDM, I’d like to talk about a project.")}`,
    },
    phone && { icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    email && {
      icon: Mail,
      label: email,
      href: `mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; href: string }[];

  const reset = () => {
    setSent(null);
    setErrors({});
    setDomain("");
    setBudget("");
  };

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative overflow-hidden px-5 pb-24 pt-16 text-ink md:px-14 md:pt-24 lg:px-20"
    >
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-col items-center text-center">
          <SectionLabel>Start a project</SectionLabel>
          <h2
            data-contact-title
            data-split
            className="text-teal-gradient mt-8 text-[13vw] uppercase leading-[0.88] md:text-[8.5vw]"
            style={{ fontStretch: "118%" }}
          >
            Need better results?
          </h2>
          <p
            data-fade
            className="font-display font-bold text-[15vw] leading-[0.9] text-glow md:text-[9vw]"
          >
            Let’s grow.
          </p>
        </div>

        <div
          data-contact-body
          className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20"
        >
          <div data-fade className="lg:pt-4">
            <p className="max-w-md text-xl font-medium leading-relaxed text-ink">
              Bring us the goal. We will bring the strategy, the technology and the campaigns built
              to move the numbers.
            </p>

            <div className="mt-10 border-t border-ink/10 pt-8">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60">
                What happens next
              </p>
              <ol className="mt-6 space-y-6">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-deep-teal/30 font-mono text-xs font-medium text-deep-teal">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink/65">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {direct.length > 0 && (
              <div className="mt-10 border-t border-ink/10 pt-8">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60">
                  Prefer to talk directly?
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {direct.map(({ icon: Icon, label, href }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold transition-colors hover:border-deep-teal hover:text-deep-teal"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                scrollTo("#top");
              }}
              className="group mt-12 hidden items-center gap-2 font-semibold text-deep-teal lg:inline-flex"
            >
              <RollText>Back to the top</RollText>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
            </a>
          </div>

          <div
            data-fade
            className="rounded-[28px] border border-ink/10 bg-white/85 p-5 shadow-[0_30px_80px_-30px_rgba(15,42,44,0.25)] backdrop-blur-md sm:p-8 md:p-10"
          >
            {sent ? (
              <Confirmation name={sent.name} email={sent.email} onReset={reset} />
            ) : (
              <form
                ref={formRef}
                noValidate
                aria-label="Project enquiry"
                // A field's error clears as soon as it's edited.
                onChange={(event) => {
                  const name = (event.target as unknown as HTMLInputElement).name as FieldName;
                  if (errors[name]) {
                    setErrors((current) => {
                      const next = { ...current };
                      delete next[name];
                      return next;
                    });
                  }
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const found = validate(form);
                  setErrors(found);
                  const first = Object.keys(found)[0];
                  if (first) {
                    formRef.current
                      ?.querySelector<HTMLElement>(`[name="${first}"]`)
                      ?.focus({ preventScroll: false });
                    return;
                  }
                  // Not wired to a backend yet: the enquiry is checked, then confirmed.
                  setSent({
                    name: String(form.get("name") ?? "").trim(),
                    email: String(form.get("email") ?? "").trim(),
                  });
                }}
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-2 border-b border-ink/10 pb-6">
                  <h3 className="font-display text-2xl font-bold text-ink md:text-3xl">
                    Project enquiry
                  </h3>
                  <p className="text-[15px] text-ink/60">
                    Takes about two minutes. Fields marked{" "}
                    <span aria-hidden="true" className="text-glow">
                      *
                    </span>
                    <span className="sr-only">with an asterisk</span> are required.
                  </p>
                </div>

                <FormGroup num="01" title="About you">
                  <TextField
                    name="name"
                    label="Full name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    error={errors.name}
                  />
                  <TextField
                    name="company"
                    label="Company or website"
                    autoComplete="organization"
                    placeholder="Company name or URL"
                  />
                  <TextField
                    name="email"
                    label="Work email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    required
                    error={errors.email}
                  />
                  <TextField
                    name="phone"
                    label="Phone / WhatsApp"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    required
                    error={errors.phone}
                  />
                </FormGroup>

                <FormGroup num="02" title="About the project">
                  <SelectField
                    name="domain"
                    label="Industry"
                    placeholder="Choose your industry"
                    options={[...businessDomains, OTHER_DOMAIN]}
                    value={domain}
                    onChange={setDomain}
                    required
                    error={errors.domain}
                  />
                  <SelectField
                    name="budget"
                    label="Monthly budget"
                    placeholder="Select a range"
                    options={budgets}
                    value={budget}
                    onChange={setBudget}
                  />
                  {domain === OTHER_DOMAIN && (
                    <TextField
                      name="otherDomain"
                      label="Your industry"
                      placeholder="e.g. Logistics"
                      required
                      error={errors.otherDomain}
                      className="md:col-span-2"
                    />
                  )}
                  <ServicesField error={errors.services} />
                  <MessageField error={errors.message} />
                </FormGroup>

                <div className="flex flex-col gap-5 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-sm leading-relaxed text-ink/55">
                    We only use these details to reply to your enquiry. No spam, ever.
                  </p>
                  <Magnetic>
                    <button
                      type="submit"
                      className="group inline-flex h-14 shrink-0 items-center gap-4 rounded-full bg-accent pl-7 pr-2 text-base font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <RollText>Send enquiry</RollText>
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight aria-hidden="true" className="size-5" />
                      </span>
                    </button>
                  </Magnetic>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
