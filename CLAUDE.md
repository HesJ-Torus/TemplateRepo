# Studio starter: instructions for Claude

This repo is a reusable template for small-business brochure websites, built with Astro and deployed to Cloudflare. Clients edit their own text and photos through Pages CMS (a Git-based CMS). The owner, Harry, is learning Astro as he goes: explain changes in plain English when asked, and keep code readable.

## How the site is put together

| Path | What it is | Who edits it |
| --- | --- | --- |
| `src/config/theme.json` | Design settings: colours, fonts, radius, which sections show, layout variants, contact form URL, studio credit, `siteUrl` | Developer only |
| `src/content/business.json` | Business name, phone, email, address, area, opening hours, social links | Client, via Pages CMS |
| `src/content/home.json` | All page text and photo paths, grouped by section | Client, via Pages CMS |
| `.pages.yml` | Defines exactly which fields the client sees in Pages CMS | Developer only |
| `src/components/` | One `.astro` file per section (Header, Hero, Services, About, Gallery, Reviews, Contact, Footer) | Developer |
| `src/layouts/Base.astro` | Page shell: `<head>`, SEO, fonts, CSS variables from `theme.json`, GSAP ScrollSmoother wrapper | Developer |
| `src/styles/global.css` | Shared styles: type scale, buttons, `.wrap`, `.section` spacing | Developer |
| `public/images/` | Photos. Client uploads land here (served at `/images/...`) | Both |
| `scripts/new-client.mjs` | `npm run new-client` setup questionnaire | Developer |
| `wrangler.jsonc` | Cloudflare deploy config. `name` must match the Cloudflare project name | Setup script |

## Rules

1. **Client-editable text never goes in HTML.** Any text a client might want to change lives in `src/content/*.json` and is read into the component. Fixed UI labels (like "Opening hours") can stay in the markup.
2. **Every new client-editable field must be added to `.pages.yml`** with a plain-English `label` a non-technical business owner understands (e.g. "Main heading", not "heroTitle"). Use `type: text` for multi-line text, `type: image` for photos, `type: object` with `list: true` for repeatable items.
3. **Design settings go in `theme.json`, never in `.pages.yml`.** Clients must not be able to change colours, fonts or layout.
4. **Use the CSS variables** from `Base.astro` (`--paper`, `--ink`, `--brand`, `--accent`, `--line`, `--on-brand`, `--radius`, `--font-heading`, `--font-body`, `--heading-weight`) instead of hard-coded colours or fonts, so every design rebrands from `theme.json`.
5. **Styles stay scoped.** Put a section's CSS in its own component's `<style>` block. Only shared rules go in `global.css`.
6. **Layout variants use switchers.** Alternative designs for a section live in a folder (e.g. `src/components/headers/Classic.astro`, `Centered.astro`). The section's main file (e.g. `src/components/Header.astro`) is a switcher that picks one using `theme.json` → `layouts.<section>`, falling back to the default if the name is unknown. When adding a variant, add the file, register it in the switcher, and list the valid names in a comment. If a section has no switcher yet and a variant is requested, create the folder and switcher, moving the existing design in as the default. Files one folder deeper need `../../` in their imports.
7. **Sections can be toggled.** New sections get an on/off flag in `theme.json` → `sections` and are conditionally rendered in `src/pages/index.astro`. Hide a section's nav link when it is off.
8. **Animation:** GSAP is installed and ScrollSmoother wraps the page in `Base.astro` (`#smooth-wrapper` / `#smooth-content`). Always respect `prefers-reduced-motion`. Fixed or sticky elements must sit outside `#smooth-wrapper`. Keep motion subtle: one considered entrance beats animating everything.
9. **Accessibility and quality floor:** responsive down to 360px wide, visible keyboard focus, alt text fields for every image, real `<button>`/`<a>` elements, sensible heading order (one `h1` per page).
10. **Check your work:** run `npm run build` after changes and fix any errors before finishing. Don't commit or push unless asked.

## Workflow notes

- Changes meant for every future client go in the **template repo**. One-off changes go in that **client's repo**.
- Clients edit via Pages CMS, which commits to GitHub. Pull before editing locally to avoid conflicts.
- Node version for builds is pinned in `.node-version`. Don't downgrade it.
- British English in all copy (colour, organise, enquiry).
