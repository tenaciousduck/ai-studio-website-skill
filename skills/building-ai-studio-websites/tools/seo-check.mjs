// Reads each page's real HTML and reports what search engines and share previews
// see. Run it against a production build and again on the live site.
//
//   node seo-check.mjs https://example.com / /about /contact
//
// It also tries a tracking-tagged address and a page that shouldn't exist. Run
// with no paths to use every address in the site's sitemap.xml.
// Also lists AI bot access, llms.txt and security headers.
import { AI_BOTS_CHECKED, aiBotAccess, starGroupBlocksAll } from "./lib/ai-bots.mjs";
import { isPlainTextFile, isXmlFile, missingSecurityHeaders } from "./lib/http-checks.mjs";

const [base, ...given] = process.argv.slice(2);
if (!base) {
  console.error("usage: node seo-check.mjs <baseUrl> [path...]");
  process.exit(1);
}
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
const host = new URL(base).hostname;
let bad = 0;
const problem = (...line) => {
  bad++;
  console.log("  PROBLEM:", ...line);
};

const robots = await fetch(`${base}/robots.txt`);
const robotsBody = robots.ok ? await robots.text() : "";
// A site may answer an unknown address with its app page and a 200: not a robots.txt.
const hasRobots = robots.ok && isPlainTextFile(robots.headers.get("content-type"), robotsBody);
const robotsText = hasRobots ? robotsBody : "";
console.log(`robots.txt [${robots.status}]`, /Sitemap:/i.test(robotsText) ? "lists a sitemap" : "");
if (!hasRobots) problem("no robots.txt");
if (starGroupBlocksAll(robotsText)) problem("robots.txt blocks the whole site");

// Information only: letting AI crawlers in or out is the owner's choice.
console.log(`AI bots (list checked ${AI_BOTS_CHECKED}):`);
for (const bot of aiBotAccess(robotsText))
  console.log(`  ${bot.token} (${bot.owner}, ${bot.purpose}): ${bot.access} ${bot.named ? "named" : "via *"}`);

const llms = await fetch(`${base}/llms.txt`);
const hasLlms = llms.ok && isPlainTextFile(llms.headers.get("content-type"), await llms.text());
console.log(`llms.txt: ${hasLlms ? "present" : "none (optional)"}`);

// Information only: some hosts don't let a site set these.
const missing = missingSecurityHeaders((await fetch(base, { method: "HEAD" })).headers);
console.log(`security headers: ${missing.length ? `not set: ${missing.join(", ")}` : "all four set"}`);

const sitemap = await fetch(`${base}/sitemap.xml`);
const sitemapText = sitemap.ok ? await sitemap.text() : "";
const listed = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapType = sitemap.headers.get("content-type") || "none";
console.log(`sitemap.xml [${sitemap.status}] ${listed.length} addresses, Content-Type: ${sitemapType}`);
if (!sitemap.ok) problem("no sitemap.xml");
else if (!isXmlFile(sitemapType)) problem(`sitemap.xml isn't sent as XML (Content-Type: ${sitemapType})`);
for (const url of listed) {
  const res = await fetch(url, { redirect: "manual" });
  // A sitemap must list final addresses: a redirect wastes the crawl.
  if (res.status !== 200) problem(`sitemap address answers ${res.status}: ${url}`);
}

const paths = given.length ? given : listed.map((u) => new URL(u).pathname);
const pages = [...paths, "/?utm_source=x&fbclid=abc", "/this-page-should-not-exist"];
for (const p of pages) {
  const res = await fetch(base + p, { redirect: "manual" });
  const html = await res.text();
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const metas = [...head.matchAll(/<meta[^>]+>/g)].map((m) => m[0]);
  const meta = (key, value) =>
    metas.filter((t) => attr(t, key) === value).map((t) => decode(attr(t, "content") || ""));
  const title = decode((head.match(/<title[^>]*>([^<]*)/) || [])[1] || "");
  const description = meta("name", "description");
  const canonical = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)].map((m) =>
    attr(m[0], "href"),
  );
  const ogImage = meta("property", "og:image");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = images.filter((t) => !/\balt=/.test(t)).length;
  const emptyAlt = images.filter((t) => /\balt=""/.test(t)).length;
  const hreflang = (head.match(/<link[^>]*hreflang=/gi) || []).length;
  let bundled = false;
  const words = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const structured = [...html.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].flatMap(
    (m) => {
      try {
        const data = JSON.parse(m[1]);
        if (data["@graph"]) bundled = true;
        return (data["@graph"] || [data]).map((n) => n["@type"]);
      } catch (error) {
        problem("structured data doesn't parse:", error.message);
        return [];
      }
    },
  );

  console.log(`\n${p} [${res.status}] ${words} words in the raw HTML`);
  console.log(`  title (${title.length}): ${title}`);
  console.log(`  description (${(description[0] || "").length}): ${(description[0] || "").slice(0, 110)}`);
  console.log(`  canonical: ${canonical.join(" ") || "none"} | h1: ${h1s} | structured: ${structured.join(", ") || "none"}`);
  console.log(`  share image: ${ogImage[0] || "none"} | robots: ${meta("name", "robots")[0] || "-"}`);
  console.log(`  hreflang links: ${hreflang} | images: ${images.length}, empty alt: ${emptyAlt}`);
  // Information only: valid, but outside checkers often flag these. See 05-performance-seo.md.
  if ((description[0] || "").length > 130) console.log("  note: description over 130 characters; checkers may flag it");
  if (bundled) console.log('  note: structured data uses an "@graph" bundle; some checkers misread it');

  if (p === "/this-page-should-not-exist") {
    if (res.status !== 404) problem(`a missing page answers ${res.status}, not 404`);
    continue;
  }
  if (res.status !== 200) continue;
  if (canonical.length !== 1) problem(`${canonical.length} canonical tags`);
  if (p.includes("utm_") && canonical[0]?.includes("utm_")) problem("canonical keeps the tracking tags");
  // A share image may live in file storage; a canonical address may not leave the site.
  for (const url of canonical)
    if (new URL(url, base).hostname !== host) problem(`canonical on another host: ${url}`);
  if (!title) problem("no title");
  if (description.length !== 1) problem(`${description.length} descriptions`);
  if ((description[0] || "").length > 160) problem("description over 160 characters");
  if (!ogImage.length) problem("no share image");
  if (ogImage[0] && !/^https?:/.test(ogImage[0])) problem("share image address isn't absolute");
  if (h1s !== 1) problem(`${h1s} h1 headings`);
  if (noAlt) problem(`${noAlt} images have no alt attribute (alt="" on decorative ones is fine)`);
  if (words < 100) problem("very little text in the raw HTML; is the page rendered on the server?");
}
console.log(`\nproblems: ${bad}`);
