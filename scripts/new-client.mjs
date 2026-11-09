// Run with: npm run new-client
// Asks a few questions and fills in the settings and content files for a new client.
// Press Enter to keep the value shown in [brackets].

import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const themePath = new URL('../src/config/theme.json', import.meta.url);
const businessPath = new URL('../src/content/business.json', import.meta.url);
const wranglerPath = new URL('../wrangler.jsonc', import.meta.url);

const theme = JSON.parse(await readFile(themePath, 'utf8'));
const business = JSON.parse(await readFile(businessPath, 'utf8'));
const rl = createInterface({ input, terminal: false });
const lines = rl[Symbol.asyncIterator]();

async function ask(question, current) {
  output.write(`${question} [${current}]: `);
  const { value, done } = await lines.next();
  const answer = done ? '' : value.trim();
  return answer || current;
}

const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);
async function askColour(question, current) {
  while (true) {
    const v = await ask(question, current);
    if (isHex(v)) return v.toUpperCase();
    console.log('  Use a 6-digit hex colour, like #3D5A47');
  }
}

console.log('\nNew client setup. Press Enter to keep the current value.\n');

console.log('Business details');
business.name = await ask('  Business name', business.name);
business.tagline = await ask('  Tagline', business.tagline);
business.phone = await ask('  Phone', business.phone);
business.email = await ask('  Email', business.email);
business.address = await ask('  Address', business.address);
business.area = await ask('  Areas covered', business.area);

console.log('\nWebsite');
const domain = await ask('  Domain (no https://)', theme.siteUrl.replace(/^https?:\/\//, ''));
theme.siteUrl = `https://${domain.replace(/\/$/, '')}`;

console.log('\nBrand colours');
theme.colors.brand = await askColour('  Main brand colour', theme.colors.brand);
theme.colors.accent = await askColour('  Accent colour', theme.colors.accent);
theme.colors.ink = await askColour('  Text colour', theme.colors.ink);
theme.colors.paper = await askColour('  Background colour', theme.colors.paper);

console.log('\nFonts (any Google Fonts name, e.g. "DM Sans", "Fraunces")');
theme.fonts.heading = await ask('  Heading font', theme.fonts.heading);
theme.fonts.body = await ask('  Body font', theme.fonts.body);

console.log('\nContact form');
theme.contactForm.action = await ask('  Formspree URL (leave blank for none)', theme.contactForm.action || '');

rl.close();

await writeFile(themePath, JSON.stringify(theme, null, 2) + '\n');
await writeFile(businessPath, JSON.stringify(business, null, 2) + '\n');

// Give the Cloudflare project a unique name based on the business name.
const slug = business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const wrangler = await readFile(wranglerPath, 'utf8');
await writeFile(wranglerPath, wrangler.replace(/"name":\s*"[^"]*"/, `"name": "${slug}"`));

console.log(`
Done. Saved settings for ${business.name}.

Next:
  1. Replace the photos in public/images
  2. Edit the page text in src/content/home.json (or let the client do it in Pages CMS)
  3. Run "npm run dev" to preview
  4. Follow docs/NEW-CLIENT-CHECKLIST.md to put it live
`);
