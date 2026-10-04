import type { APIRoute } from 'astro';

// The Jekyll site published /sitemap.xml, and search consoles may still reference it.
// It points to the same sitemap file as @astrojs/sitemap's /sitemap-index.xml.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-0.xml', site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${sitemap}</loc></sitemap></sitemapindex>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
