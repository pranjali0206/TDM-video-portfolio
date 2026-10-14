import { Check, Search } from "lucide-react";
import type { CSSProperties } from "react";

import { convinceSite, sampleLead } from "./data";

/** A text that types itself (CSS `steps()` width reveal). */
function Typed({
  text,
  width,
  duration,
  delay,
}: {
  text: string;
  width: number;
  duration: number;
  delay: number;
}) {
  return (
    <span
      className="tdm-type"
      style={
        {
          width,
          "--type-dur": `${duration}s`,
          "--type-steps": text.length,
          "--type-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      {text}
    </span>
  );
}

const formFields = [
  { label: "Name", value: sampleLead.name, width: 100, duration: 0.7, delay: 3.7 },
  { label: "Phone", value: sampleLead.phone, width: 92, duration: 0.6, delay: 4.4 },
  { label: "Looking for", value: sampleLead.lookingFor, width: 128, duration: 0.5, delay: 4.9 },
];

const skeletons = [
  { delay: "1.9s", widths: ["40%", "80%", "65%"] },
  { delay: "2s", widths: ["35%", "72%", "58%"] },
];

/**
 * 03 Convince: a ~6.5s mini-film. A Google search types itself, your site
 * tops the results, the cursor clicks through, the site opens, the enquiry
 * form fills and submits, and the lead heads to the CRM.
 */
export function StepConvince() {
  return (
    <div className="relative h-[500px] w-[760px]">
      <p className="sr-only">
        A customer searches Google for “{convinceSite.query}”, finds {convinceSite.domain} at the
        top, opens the website and sends an enquiry, which goes straight to your CRM.
      </p>

      {/* The search card. */}
      <div
        aria-hidden="true"
        className="tdm-in absolute left-2.5 top-0 flex w-[450px] flex-col gap-3.5 rounded-[20px] bg-white p-[18px] shadow-[0_14px_36px_rgba(15,42,44,0.1)]"
      >
        <div className="flex h-11 items-center gap-2.5 rounded-full border border-hairline px-4 text-[15px] shadow-[0_2px_8px_rgba(15,42,44,0.06)]">
          <Search className="size-4 text-hero-soft" strokeWidth={2} />
          <Typed text={convinceSite.query} width={192} duration={1.3} delay={0.3} />
          <span className="tdm-caret h-[18px] w-0.5 bg-hero-teal" />
        </div>
        <div
          className="tdm-in relative flex flex-col gap-[3px] rounded-[14px] border-[1.5px] border-aqua-soft bg-[#f3faf7] px-3.5 py-3"
          style={{ animationDelay: "1.7s" }}
        >
          <span className="text-[11px] text-hero-muted">{convinceSite.domain}</span>
          <span className="text-base font-semibold text-[#1a4fb4]">{convinceSite.title}</span>
          <span className="text-xs text-[#4b5d5d]">{convinceSite.snippet}</span>
          <span
            className="tdm-pop absolute -right-3 -top-3 rounded-full bg-teal px-2.5 py-[5px] text-[11px] font-extrabold text-hero-ink shadow-[0_6px_16px_rgba(15,42,44,0.14)]"
            style={{ animationDelay: "2.1s" }}
          >
            Top of Google
          </span>
        </div>
        {skeletons.map((skeleton) => (
          <div
            key={skeleton.delay}
            className="tdm-in flex flex-col gap-1.5 px-3.5 py-1"
            style={{ animationDelay: skeleton.delay }}
          >
            {skeleton.widths.map((width, index) => (
              <span
                key={width}
                className={
                  index === 1 ? "h-[11px] rounded bg-track" : "h-[9px] rounded bg-[#eef3f1]"
                }
                style={{ width }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* What the site is built for. */}
      <div className="absolute left-5 top-[330px] flex flex-col items-start gap-2">
        {convinceSite.badges.map((badge, index) => (
          <span
            key={badge}
            className="tdm-pop rounded-full bg-white px-3 py-2 text-xs font-bold text-hero-ink shadow-[0_8px_20px_rgba(15,42,44,0.1)]"
            style={{ animationDelay: `${1 + index * 0.2}s` }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* The website opens. */}
      <div
        aria-hidden="true"
        className="absolute left-[236px] top-[118px] flex h-[372px] w-[514px] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_rgba(15,42,44,0.22)]"
        style={{ animation: "tdmSlideUp .6s cubic-bezier(.2,.7,.2,1) 3s both" }}
      >
        <div className="flex h-9 items-center gap-[7px] border-b border-[#eef3f1] px-3">
          <span className="size-[9px] rounded-full bg-peach" />
          <span className="size-[9px] rounded-full bg-teal" />
          <span className="size-[9px] rounded-full bg-aqua-soft" />
          <span className="ml-2 flex-1 rounded-full bg-[#f2f6f4] px-3 py-1 font-mono text-[11px] text-hero-muted">
            {convinceSite.domain}
          </span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="relative w-[250px] shrink-0">
            <img
              src={convinceSite.heroImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 block size-full object-cover object-[center_60%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,27,29,0.15)_0%,rgba(7,27,29,0.8)_100%)]" />
            <span className="absolute inset-x-[18px] top-[22px] font-hero text-2xl font-semibold leading-[1.12] text-white">
              {convinceSite.heroLine}
            </span>
            <div
              className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-hero-ink shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
              style={{ animation: "tdmIn .5s cubic-bezier(.2,.7,.2,1) 5.8s both" }}
            >
              <span className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#1fa36b] text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              Thanks {sampleLead.firstName}! We'll call you shortly.
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 p-[18px] text-hero-ink">
            <span className="h-5 text-[15px] font-bold">{convinceSite.formTitle}</span>
            {formFields.map((field) => (
              <span key={field.label} className="flex flex-col gap-1">
                <span className="h-2.5 text-[10px] font-semibold leading-none text-hero-soft">
                  {field.label}
                </span>
                <span className="flex h-9 items-center rounded-[10px] border border-hairline px-3 text-[13px]">
                  <Typed
                    text={field.value}
                    width={field.width}
                    duration={field.duration}
                    delay={field.delay}
                  />
                </span>
              </span>
            ))}
            <span
              className="mt-1 flex h-10 items-center justify-center rounded-full bg-hero-ink text-[13px] font-bold text-white"
              style={{ animation: "tdmClick .3s ease 5.35s both" }}
            >
              Request a call back
            </span>
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="tdm-pop absolute left-[560px] top-[70px]"
        style={{ animationDelay: "6.2s" }}
      >
        <span className="tdm-float inline-flex items-center gap-2 rounded-full bg-hero-ink px-3.5 py-[9px] text-[13px] font-extrabold text-teal shadow-[0_12px_28px_rgba(15,42,44,0.25)]">
          Lead sent to CRM →
        </span>
      </span>

      {/* The visitor's mouse: clicks the result, then the submit button. */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="tdm-cursor absolute left-0 top-0 z-[5] drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)]"
        style={{ animation: "tdmCursor 3.6s ease-in-out 1.9s both" }}
      >
        <path
          d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.3 L11.3 13.7 L17.5 13.4 Z"
          fill="#0f2a2c"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
