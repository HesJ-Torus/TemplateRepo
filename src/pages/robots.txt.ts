import theme from '../config/theme.json';

export function GET() {
  const site = theme.siteUrl.replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
