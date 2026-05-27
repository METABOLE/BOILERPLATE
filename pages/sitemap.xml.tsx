import { META } from '@/constants';
import { STATIC_PAGES } from '@/constants';
// import { fetchAllProjectSlugs } from '@/services/projects.service';
import type { GetServerSideProps } from 'next';

const BASE = META.url;
const LANGS = ['fr', 'en'] as const;

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

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const lastmod = new Date().toISOString();
  const staticPaths = [...new Set(STATIC_PAGES)];

  let staticBlocks = '';
  for (const path of staticPaths) {
    for (const lang of LANGS) {
      const loc = `${BASE}/${lang}${path}`;
      let changefreq: 'weekly' | 'monthly' | 'yearly' = 'monthly';
      if (path === '') changefreq = 'weekly';
      else if (path === '/terms-of-service') changefreq = 'yearly';
      const priority = path === '' ? '1.0' : '0.8';
      staticBlocks += `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }
  }

  // let projectBlocks = '';
  // try {
  //   const projectSlugs = await fetchAllProjectSlugs();
  //   if (Array.isArray(projectSlugs)) {
  //     for (const { slug } of projectSlugs) {
  //       for (const lang of LANGS) {
  //         projectBlocks += `
  // <url>
  //   <loc>${escapeXml(`${BASE}/${lang}/projects/${slug}`)}</loc>
  //   <lastmod>${lastmod}</lastmod>
  //   <changefreq>monthly</changefreq>
  //   <priority>0.6</priority>
  // </url>`;
  //       }
  //     }
  //   }
  // } catch {
  //   // Sanity indisponible
  // }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd 
        http://www.w3.org/1999/xhtml 
        http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd">
        ${staticBlocks}
        ${/* projectBlocks */ ''}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap.trim());
  res.end();

  return { props: {} };
};
