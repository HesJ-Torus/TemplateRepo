import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import theme from './src/config/theme.json' with { type: 'json' };

export default defineConfig({
  site: theme.siteUrl,
  integrations: [sitemap()],
});
