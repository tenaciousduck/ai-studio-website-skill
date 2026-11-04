// Small checks on what a site answers over HTTP. Used by seo-check.mjs.
//
//   isPlainTextFile(contentType, body)  true for a real robots.txt or llms.txt
//   isXmlFile(contentType)              true when a sitemap is labelled as XML
//   missingSecurityHeaders(headers)     lower-case names of headers not set

// Some sites answer every unknown address with their app page and a 200 status,
// so "found" isn't enough: the answer must be text, not a web page.
export function isPlainTextFile(contentType, body) {
  if (/html/i.test(contentType || "")) return false;
  return !body.trimStart().startsWith("<");
}

// A sitemap sent without an XML Content-Type can read as "no sitemap" to outside
// checkers, even when the file itself is fine. A static file on one host came
// back with no Content-Type at all.
export function isXmlFile(contentType) {
  return /\bxml\b/i.test(contentType || "");
}

const SECURITY_HEADERS = [
  "x-content-type-options",
  "strict-transport-security",
  "referrer-policy",
  "x-frame-options",
];

// frame-ancestors in a content security policy does the job of x-frame-options.
export function missingSecurityHeaders(headers) {
  const framed = /frame-ancestors/i.test(headers.get("content-security-policy") || "");
  return SECURITY_HEADERS.filter(
    (name) => !headers.has(name) && !(name === "x-frame-options" && framed),
  );
}
