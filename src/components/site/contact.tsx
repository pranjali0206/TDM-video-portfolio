import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { useExperience } from "./experience";
import { Magnetic, RollText, SectionLabel } from "./primitives";

function Field({
  label,
  type = "text",
  required = false,
  multiline = false,
  className,
}: {
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}) {
  const id = useId();
  const control =
    "peer w-full resize-none border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pt-8 text-lg text-ink outline-none";
  return (
    <div className={cn("relative", className)}>
      {multiline ? (
        <textarea id={id} required={required} rows={4} placeholder=" " className={control} />
      ) : (
        <input id={id} type={type} required={required} placeholder=" " className={control} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-8 text-lg font-medium text-ink/70 transition-all duration-300 peer-focus:top-0 peer-focus:font-mono peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.25em] peer-focus:text-deep-teal peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:font-mono peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.25em]"
      >
        {label}
        {!required && " (optional)"}
      </label>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-deep-teal transition-transform duration-500 peer-focus:scale-x-100" />
    </div>
  );
}

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

/** Business-domain picker, styled like the underlined text fields around it. */
function DomainField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        name="domain"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "peer w-full cursor-pointer appearance-none border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pr-8 pt-8 text-lg outline-none",
          value ? "text-ink" : "text-ink/70",
        )}
      >
        <option value="" disabled>
          Choose your industry
        </option>
        {[...businessDomains, OTHER_DOMAIN].map((domain) => (
          <option key={domain} value={domain}>
            {domain}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 font-mono text-[11px] uppercase tracking-[0.25em] text-deep-teal"
      >
        Business domain
      </label>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 right-0 size-5 text-ink"
      />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-deep-teal transition-transform duration-500 peer-focus:scale-x-100" />
    </div>
  );
}

export function Contact() {
  const { scrollTo } = useExperience();
  const [sent, setSent] = useState(false);
  const [domain, setDomain] = useState("");
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Opacity only: the orbs' CSS drift animation owns their transform.
      gsap.from("[data-orb]", {
        opacity: 0,
        duration: 2.2,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative overflow-hidden bg-ivory px-6 pb-32 pt-36 text-ink md:px-14 md:pt-48 lg:px-20"
    >
      {/* Drifting colour orbs — teal, lime and coral light spilling behind the headline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-orb className="orb left-[8%] top-[6%] size-[28rem] bg-accent/55" />
        <div
          data-orb
          className="orb right-[6%] top-[14%] size-[24rem] bg-teal/70 [animation-delay:-6s]"
        />
        <div
          data-orb
          className="orb left-[38%] top-[30%] size-[20rem] bg-glow/35 [animation-delay:-12s]"
        />
      </div>

      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-col items-center text-center">
          <SectionLabel>Start a project</SectionLabel>
          <h2
            data-split
            className="mt-8 text-[13vw] uppercase leading-[0.88] md:text-[8.5vw]"
            style={{ fontStretch: "118%" }}
          >
            Need better results?
          </h2>
          <p
            data-fade
            className="font-serif text-[15vw] italic leading-[0.9] text-glow md:text-[9vw]"
          >
            Let’s grow.
          </p>
        </div>

        <div
          data-contact-body
          className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"
        >
          <div data-fade>
            <p className="max-w-md text-xl leading-relaxed font-medium text-ink">
              Bring us the goal. We will bring the strategy, the technology and the campaigns built
              to move the numbers.
            </p>
            <ol className="mt-10 space-y-4 border-t border-ink/10 pt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
              {["Share the goal", "Get a growth plan", "Launch & scale"].map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="text-deep-teal">0{index + 1}</span>
                  <span className="h-px w-6 bg-ink/20" />
                  {step}
                </li>
              ))}
            </ol>
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                scrollTo("#top");
              }}
              className="group mt-12 inline-flex items-center gap-2 font-semibold text-deep-teal"
            >
              <RollText>Back to the top</RollText>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
            </a>
          </div>

          <form
            data-fade
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="grid gap-x-8 gap-y-6 md:grid-cols-2"
          >
            <Field label="Name" required />
            <Field label="Email" type="email" required />
            <Field label="Phone" type="tel" required />
            <DomainField value={domain} onChange={setDomain} />
            {domain === OTHER_DOMAIN && (
              <Field label="Tell us your business domain" required className="md:col-span-2" />
            )}
            <Field label="Message" required multiline className="md:col-span-2" />
            <div className="mt-6 md:col-span-2">
              <Magnetic>
                <button
                  type="submit"
                  className="group inline-flex h-16 items-center gap-4 rounded-full bg-accent pl-8 pr-2 text-lg font-semibold text-ink shadow-[0_14px_34px_-14px_var(--accent)] transition-colors hover:bg-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  {sent ? (
                    <>
                      <span>Message received</span>
                      <span className="grid size-12 place-items-center rounded-full bg-ink text-accent">
                        <Check className="size-5" />
                      </span>
                    </>
                  ) : (
                    <>
                      <RollText>Send inquiry</RollText>
                      <span className="grid size-12 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
