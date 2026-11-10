---
name: new-variant
description: Use when adding a new design variant for a site section (header, hero, services, about, gallery, reviews, contact, footer), or when a section needs its first switcher.
---

# Add a new section variant

Follow CLAUDE.md throughout. A variant is an alternative design for one section, picked in `src/config/theme.json` → `layouts`.

## 1. Check whether the section already has a switcher

Look for a folder named after the section in `src/components/` (e.g. `heroes/`, `headers/`, `footers/`).

**No folder yet (first variant for this section):**
1. Create the folder, using the plural of the section name (`heroes`, `galleries`, `footers`).
2. Move the existing component in as the default variant, named by its style (e.g. `Hero.astro` → `heroes/Split.astro`). Fix its imports: files one folder deeper need `../../`.
3. Replace the original file (e.g. `src/components/Hero.astro`) with a switcher:

```astro
---
import theme from '../config/theme.json';
import Split from './heroes/Split.astro';

// Valid names for theme.json → layouts.hero: split
const variants = { split: Split };
const Chosen = variants[theme.layouts?.hero] ?? Split;
---
<Chosen />
```

4. Add the section to `layouts` in `theme.json` with the default name (e.g. `"hero": "split"`).
5. Do not change `src/pages/index.astro`; it already imports the switcher by its original name.

**Folder exists:** go straight to step 2.

## 2. Build the variant

- Name the file by its **style**, never by a client: `Fullbleed.astro`, `Centered.astro`, `Bold.astro`.
- Read all text from `src/content/*.json` and business details from `business.json`. No client names, phone numbers, hard-coded copy or client image paths in the component.
- Use only the theme CSS variables (`--paper`, `--ink`, `--brand`, `--accent`, `--line`, `--on-brand`, `--radius`, `--font-heading`, `--font-body`, `--heading-weight`). No hard-coded hex colours or font names.
- Keep styles in the component's own `<style>` block.
- Responsive down to 360px, visible keyboard focus, alt text on images, one `h1` per page (only hero variants use `h1`).
- Animation: GSAP is available. Respect `prefers-reduced-motion`, keep it subtle. Sticky or fixed elements must render outside `#smooth-wrapper` in `Base.astro`.

## 3. New content fields (only if the variant needs them)

If the variant needs text or images the existing content doesn't have (e.g. a second button, a background video):
1. Add the fields under the section's key in `src/content/home.json` (or `business.json` for business details), with sensible values.
2. Add matching fields to `.pages.yml` with plain-English labels a business owner understands. Images get an alt-text field.
3. Make the variant cope if the fields are empty (hide the element rather than breaking).

## 4. Register and test

1. Import the variant in the switcher, add it to the `variants` object, and update the "Valid names" comment.
2. Run `npm run build` and fix any errors.
3. Tell Harry the variant name to put in `theme.json`, and list any new fields the client can now edit.

Don't commit unless asked.
