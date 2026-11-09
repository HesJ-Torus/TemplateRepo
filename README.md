# Studio starter

A reusable template for small-business brochure websites. You control the design; the client can edit their own text and photos through Pages CMS without touching code.

## How it fits together

```
You build the site  →  GitHub (one repo per client)  →  Cloudflare builds and hosts it (free)
                              ↑
              Client edits text in Pages CMS → saves → site updates in about a minute
```

## The files that matter

| File | Who edits it | What it controls |
| --- | --- | --- |
| `src/config/theme.json` | You only | Colours, fonts, corner rounding, which sections show, contact form, your "Website by" credit, the site's web address |
| `src/content/business.json` | Client (via Pages CMS) | Business name, phone, email, address, opening hours, social links |
| `src/content/home.json` | Client (via Pages CMS) | All the page text and photos |
| `public/images/` | Both | Photos. Clients' uploads land here |
| `.pages.yml` | You only | What the client sees in Pages CMS. Anything not listed here, they can't edit |
| `wrangler.jsonc` | Set by the setup script | The project name in Cloudflare |
| `src/components/` | You only | The layout of each section |

## One-time setup (do this once, not per client)

1. **GitHub:** create a free account if you don't have one. Create a new repository called `studio-starter`, upload this folder to it, then go to the repo's **Settings** and tick **Template repository**.
2. **Cloudflare:** create a free account at cloudflare.com.
3. **Pages CMS:** go to app.pagescms.org and sign in with GitHub.
4. **Formspree** (for contact forms): create a free account at formspree.io. Each client gets their own form, which emails enquiries to them.
5. **Your computer:** install Node.js (the LTS version) from nodejs.org so you can preview sites locally.
6. Put your own studio name and website in the `credit` section of `theme.json` in the template, so every new site carries it.

## Working on a site locally

```bash
npm install        # first time only
npm run dev        # live preview at http://localhost:4321
npm run build      # check it builds before you push
```

## Adding a new section or page

Sections live in `src/components/`. To add one, copy an existing component, add its content to `home.json`, add the matching fields to `.pages.yml`, and include it in `src/pages/index.astro`. Extra pages go in `src/pages/` (e.g. `src/pages/services.astro` becomes `/services`).

For a new client, follow `docs/NEW-CLIENT-CHECKLIST.md`.
