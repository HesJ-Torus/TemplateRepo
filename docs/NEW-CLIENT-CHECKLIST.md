# New client checklist

Work through this top to bottom for every new site. Tick things off as you go.

## 1. Collect from the client
- [ ] Business name, phone, email, address, areas covered, opening hours
- [ ] Their logo (SVG or large PNG, if they have one)
- [ ] Brand colours, or a photo/sign/van you can pick colours from
- [ ] 6–10 good photos: one for the top of the page, one of them or the workshop/shop, the rest of their work
- [ ] The text: what they do, a short "about us", 2–3 customer reviews
- [ ] The domain they want (or their existing one, and who it's registered with)
- [ ] Email choice: forwarding only, or a proper mailbox (Zoho)

## 2. Create the site
- [ ] On GitHub, open `studio-starter` → **Use this template** → **Create a new repository**. Name it after the client (e.g. `corve-dale-joinery`), set it to **Private**
- [ ] Download it to your computer (GitHub Desktop or `git clone`)
- [ ] Run `npm install`, then `npm run new-client` and answer the questions
- [ ] Replace the photos in `public/images/` and update the paths in `home.json`
- [ ] If they have a logo, add it to `public/images/` and set `"logo": "/images/logo.svg"` in `business.json`
- [ ] Write their text in `src/content/home.json`
- [ ] Turn off any sections they don't need in `theme.json` → `sections`
- [ ] Set up a Formspree form for their email address and paste its URL when the setup script asks (or into `theme.json` → `contactForm.action`)
- [ ] Run `npm run dev` and check it on your phone too
- [ ] Commit and push to GitHub

## 3. Put it live on Cloudflare
- [ ] Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → pick the client's repo
- [ ] Build command: `npm run build`  ·  Deploy command: `npx wrangler deploy`
- [ ] Wait for the first build, then open the `.workers.dev` link and check the site

## 4. Domain
- [ ] **New domain:** buy it in Cloudflare → **Domain Registration**. DNS is set up for you
- [ ] **Existing domain:** add the domain to Cloudflare, then change the nameservers at their current registrar to the two Cloudflare gives you
- [ ] In the Worker's **Settings** → **Domains & Routes**, add `theirdomain.co.uk` and `www.theirdomain.co.uk`
- [ ] Make sure `siteUrl` in `theme.json` matches the real domain

## 5. Email
- [ ] **Forwarding:** Cloudflare → the domain → **Email** → **Email Routing**, forward `info@` to their existing inbox
- [ ] **Mailbox:** set up Zoho Mail for the domain and add the DNS records Zoho gives you in Cloudflare
- [ ] Send a test email both ways

## 6. Hand over editing to the client
- [ ] In Pages CMS (app.pagescms.org), open the client's repo (install the Pages CMS GitHub app on it if asked)
- [ ] Invite the client's email as a **collaborator**
- [ ] Send them the welcome guide and do a 10-minute walkthrough: change some text, save, watch the site update

## 7. Admin
- [ ] Add the client to your client tracker: domain, renewal date, email plan, monthly fee
- [ ] Set up their monthly invoice or payment
- [ ] Submit the site to Google Search Console and add a Google Business Profile link if they have one
