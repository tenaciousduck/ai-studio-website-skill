// Builds sitemap.xml from the site's fixed pages plus its published items, so a
// new item reaches search engines without anyone editing a file. Served by
// src/routes/sitemap[.]xml.ts with an XML Content-Type. A static
// public/sitemap.xml came back from AI Studio's host with no Content-Type, and an
// outside checker reported "no sitemap".
//
// List only addresses that answer 200 directly: no redirects, no admin or
// sign-in pages, and an item's extra page only when its route would answer 200
// (use the same rule as that route's 404). lastmod, changefreq and priority are
// left out: Google ignores the last two, and a hand-kept date goes stale.

import { canonicalUrl } from "./site";

// REPLACE: the site's fixed public pages.
const PAGES = ["/", "/about", "/contact", "/privacy", "/terms"];

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sitemapXml(itemPaths: string[]): string {
  const urls = [...PAGES, ...itemPaths]
    .map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
