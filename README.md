# Clarity Design System

Here's a deep, buildable prompt for every section — specific enough that no design decisions are left loose. Typography direction across the whole site: one bold, plain grotesque/geometric sans-serif (think Inter Tight, Neue Haas Grotesk, or Söhne — confident, no serif flourish, no italics, no single-word color accents inside headlines, no all-caps labels). Weight does the work of emphasis, not decoration.

---

1. HERO SECTION

Layout: two-column, roughly 55/45 split, left-aligned text block on the left, image card on the right — mirrors the inBeat reference exactly. Generous whitespace above and around, nothing crowds the headline.

Typography: headline in bold weight (700-800), large scale (clamp roughly 40px–64px depending on viewport), tight line-height (1.05–1.1), charcoal-maroon (#2B1810), max 3 lines, plain sentence case — no accent color on any single word.

Effect (from the reference image): the right-side card is a tall rounded rectangle (border-radius ~24px) containing a crossfading image rotation — 3 to 5 real shots from the agency's work, each held on screen 3–4 seconds, crossfading (not sliding, not zooming) over ~600ms. A subtle dark-to-transparent gradient sits at the bottom of the card so a caption label (e.g. client name + project type, like inBeat's "Disney, Marvel — E-com Merch Photography") stays legible over any image.

CTA: one pill-shaped button, burgundy (#5C1A1A) fill, off-white text, no gradient, no icon clutter — just bold text and generous horizontal padding.

Below hero: trust bar — grayscale client logos in a single row, evenly spaced, no card backgrounds, no borders, small and quiet so they don't compete with the hero.

---

2. TYPES OF VIDEOS (filter grid)

Layout: centered section heading (bold, plain, no eyebrow label above it), one-sentence subtext in regular weight, then a grid of cards, 4 per row on desktop collapsing to 2 on mobile.

Card design: white/soft-white (#FAF8F3) background, no shadow or a barely-there one (rgba(0,0,0,.06) max), icon in a small circular badge above the label, label in bold, plain sentence case. Rounded corners (16px), consistent across every card — matches ROI Minds' industry grid exactly.

Interaction effect: clicking a card sets it as the active filter — active state gets a sky blue (#5FB4E0) outline ring (2px) around the card, nothing else changes. No color fill flip, no icon animation — the ring alone signals "selected."

---

3. CATEGORY OF WORK (5 sections — Kroo Production structure)

Layout: each of the 5 categories is a full-width dark card block, stacked vertically, generous vertical spacing between them (not touching).

Card design: near-black background (#0D0D0D), small line-style icon top-left (not filled, not colored — stays white/light gray until hover), number label only if you keep the "01/02/03" sequence (it's legitimate here since these are five presented in order), bold category title (large, plain, off-white), one-line description directly below in a lighter/regular weight, slightly muted off-white.

Effect (from the reference image): on hover, a soft radial glow in burnt orange-red (#C4471E) blooms from behind the icon/number area — low opacity (~15-20%), large soft blur radius, fades in over ~300ms. This is the one bold visual moment reserved for this section only — nothing else on the page uses this glow.

Below each category's description: a horizontal row of video placeholder cards (3 per category to start) — each placeholder is a plain dark rectangle (#1A1A1A) with a centered play-icon outline (sky blue, thin stroke) and a small title label underneath in regular weight. No fake thumbnails, no stretched stock photos — keep placeholders honest and clean until real videos are dropped in.

---

4. EFFICIENCY / RESULTS STRIP

Layout: background flips entirely to near-black-maroon (#1A1012) — this is the deliberate rhythm break in the page. Two-column layout: left = short bold headline + 1-2 sentence description in off-white (#F0EAE3), right = one video/image placeholder card, same rounded-corner treatment as the hero card.

Below that: a row of stat cards, 2–4 per row. Each stat: a large bold number in teal (#1E6E6E — bright enough to read against the dark background, so lean slightly lighter, ~#2E9E9E, if contrast testing calls for it), small plain-weight label underneath in off-white. No icons, no card borders — just clean typographic hierarchy, matching inBeat's "33% / Growth in MoM Profit margin" treatment exactly.

Flag directly in this section: every number here is placeholder/reference data until the client supplies real figures — mark each stat card with a small "reference data" note (tiny, muted, bottom corner) so nothing unverified accidentally ships live.

---

5. PROCESS (optional 3-step)

Layout: 3 cards in a row, light background (matches section 2's card style, not the dark theme) — small icon, bold step number + name ("1. Diagnose"), one short paragraph in regular weight. No connecting arrows or lines between them — let the numbering alone imply sequence, keep it clean.

---

6. CONTACT / CTA SECTION

Layout: dark background (#1A1012), matches the results strip so the page ends on the same dark note it broke into earlier. Left side: bold heading ("Need Better Results? Get in Touch" — style, but plain, no italics), contact details in a simple 2-column info list (business inquiries, address, hours), off-white text, small teal WhatsApp/contact icon if used.

Right side: form panel — but recolored from ROI Minds' yellow into a soft ivory card (#F5F1E8) so it stays inside the established palette. Fields: Name, Email, Phone, Message — each field a clean underlined or lightly-bordered input, no rounded-pill inputs (keep it plain/professional, not playful). Submit button: burgundy fill, matches the hero CTA exactly for consistency.

Effect: field focus state uses the sky blue outline — same interaction language as the filter cards in section 2, so the whole site's "you're interacting with this" signal stays consistent everywhere it appears.

---

Cross-cutting rules to keep this from feeling clumsy:

- Only one motion moment per section — the hero crossfade, the category-card glow, the stat numbers appearing — never combine multiple animated effects in one view.

- No drop shadows heavier than a whisper; depth comes from color contrast (dark vs. ivory sections), not shadow stacking.

- Spacing scale stays consistent site-wide (use a single base unit — e.g. 8px — and only multiples of it for all padding/margins) so nothing feels randomly sized.

- Every rounded corner on the site uses the same radius value within its context (16px for light cards, 24px for hero/image cards) — never mix radii arbitrarily.

Want this compiled into a saved reference document (so you and your team have it as a spec to build from), or should we move straight into the actual HTML prototype next?

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/76369cee-4833-40b3-bd4b-322e449ce0db).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
