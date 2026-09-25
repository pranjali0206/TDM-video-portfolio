# Teal agency refresh and AI campaign writer

## What I’ll build
- Refresh the full page with a confident teal-led palette, accessible contrast, and the existing responsive structure.
- Reorder the page to: hero, Five ways we make ideas move, Industries we know, Creative decisions backed by results, moving project strip, AI campaign writer, contact.
- Rewrite the visible copy with bold, performance-focused digital marketing language.
- Replace the format-card section with a perspective-based moving strip of project and industry imagery that remains readable on mobile.
- Add a campaign brief form that generates punchy quotes and headline options using Lovable AI, with clear loading, success, and error states.

## Technical details
- Keep the current TanStack page, design tokens, Button component, and responsive breakpoints.
- Add a protected server-side AI call using the workspace AI Gateway; prompts and credentials stay off the page.
- Validate and limit brief input before generation, return structured headings and quotes, and display safe provider errors without automatic retries.
- Reuse the existing original campaign images and add only the visual treatments needed for the moving strip.
- Verify the primary experience on desktop and mobile, including animation, form submission, generated output, overflow, and console errors.
