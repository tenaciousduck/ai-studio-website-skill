// Standard safety headers on every response the app sends (pages, server
// functions, generated files such as the sitemap). Wire it into the fetch
// wrapper in src/server.ts:
//
//   return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
//
// and wrap the catch branch's error Response the same way. Static files (public/
// and built /assets) don't pass through the wrapper; browsers only need to see
// HSTS once. Checked on an AI Studio site 2026-11-04: the host passes these
// headers through.
//
// - Strict-Transport-Security: always use https for a year. No includeSubDomains
//   unless every subdomain (mail, tracking, CRM pages) is known to serve https.
// - X-Content-Type-Options: don't guess a script's or stylesheet's type. Safe as
//   long as every app response sets a Content-Type.
// - Referrer-Policy: the browser default, made explicit. Other sites see only the
//   domain, never a full page address.
// X-Frame-Options is left out on purpose: AI Studio's editor may show the site
// in a frame. Leave a content security policy until the checkout is proven with one.
export const SECURITY_HEADERS: Record<string, string> = {
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export function withSecurityHeaders(response: Response): Response {
  // A response's headers can be read-only, so build a new one around the same
  // body. Status, other headers and each Set-Cookie line are kept.
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!secured.headers.has(name)) secured.headers.set(name, value);
  }
  return secured;
}
