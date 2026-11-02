// The public address of the site. The sitemap and robots.txt use the same one.
export const SITE_URL = "https://example.com";

// Social networks (Facebook, iMessage, X, Instagram) need an absolute address
// for share images. An address that already starts with http(s):// is kept;
// a site path like "/images/cover.jpg" gets the site address in front; empty
// stays empty so callers can still skip the tag.
export function absoluteUrl(pathOrUrl: string): string {
  const value = pathOrUrl.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

// The one official address of a page, which search engines should index
// whatever tracking or trailing slash a visitor arrived with.
export function canonicalUrl(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return `${SITE_URL}${path || "/"}`;
}
