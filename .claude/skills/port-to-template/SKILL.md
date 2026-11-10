---
name: port-to-template
description: Use when copying new section variants, new sections or other reusable improvements from a client site repo back into the TemplateRepo (or from the template into a client repo).
---

# Copy reusable work between a client repo and the template

Client repos and `TemplateRepo` sit side by side in the same folder (e.g. `../dwshotton` and `../TemplateRepo`). Run this from the **destination** repo. If it is unclear which repo or commits to copy from, ask before starting.

## 1. Find what changed

In the source repo, read the relevant commits (`git log`, `git show --stat <commit>`) to get the exact list of files. Summarise the list for Harry before copying.

## 2. Clean check before copying

Search the files being copied (mainly `src/components/`, `src/layouts/`, `src/styles/`) for anything client-specific:
- The client's business name, phone, email, town names or trade-specific wording
- Hard-coded hex colours or font names
- Client image paths

If you find any, stop and tell Harry. The fix belongs in the source repo first (move text into the content JSON, colours into CSS variables), so both repos end up with the clean version.

## 3. Copy

**Copy as-is** (generic by design):
- Variant files in section folders (`headers/`, `heroes/`, ...)
- Switcher files (`Header.astro`, `Hero.astro`, ...). If the destination's switcher has variants the source doesn't, merge the imports and `variants` entries rather than overwriting.
- Shared changes in `Base.astro`, `global.css`, `index.astro`, `404.astro`, after checking they contain nothing client-specific.
- New npm dependencies: install them with `npm install <package>` in the destination rather than copying `package.json` wholesale.

**Never copy wholesale, merge by hand instead:**
- `src/config/theme.json`: only add new keys (e.g. a new `layouts` entry using the default variant, a new `sections` flag). Keep the destination's colours, fonts, `siteUrl`, contact form and credit.
- `src/content/business.json` and `home.json`: only add new fields. When copying into the template, fill them with generic demo content matching the template's demo business, not the client's text.
- `.pages.yml`: add the new fields only.

**Never copy:** `wrangler.jsonc`, client photos in `public/images/`, `.node-version` changes that downgrade, or anything in `node_modules`/`dist`.

## 4. Check

1. Run `npm run build` in the destination and fix any errors.
2. Confirm the destination still shows its own name, colours and demo text.
3. List what was copied, what was merged by hand, and anything skipped.

Don't commit unless asked.
