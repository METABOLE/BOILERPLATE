import { META, STATIC_PAGES } from '@/constants';
import type { GetServerSideProps } from 'next';

const BASE = META.url;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const Sitemap = () => null;

export default Sitemap;

/**
 * Lists real routes only. When adding `/fr` + `/en` locale prefixes, emit both
 * locales here and add xhtml hreflang alternates (see PENNN-WEB sitemap).
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const lastmod = new Date().toISOString();
  const staticPaths = [...new Set(STATIC_PAGES)];

  let staticBlocks = '';
  for (const path of staticPaths) {
    const loc = `${BASE}${path || '/'}`;
    let changefreq: 'weekly' | 'monthly' | 'yearly' = 'monthly';
    if (path === '') changefreq = 'weekly';
    else if (path === '/terms-of-service') changefreq = 'yearly';
    const priority = path === '' ? '1.0' : '0.8';
    staticBlocks += `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticBlocks}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(sitemap.trim());
  res.end();

  return { props: {} };
};
