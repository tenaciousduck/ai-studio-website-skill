# Performance and SEO

The first site went from 6,345 KB to 495 KB and PageSpeed 95, with no visual change. That took three rounds of retrofit. Do these from day one.

## Contents
- Targets
- Images
- Fonts
- JavaScript and server
- What's not worth doing
- Measuring honestly
- SEO foundations
- Structured data
- Local businesses
- Reading outside reports
- Search Console

## Targets

Judgment-call starting points, phone home page, nothing cached. A photo-heavy site may reasonably exceed the weight target; agree an exception rather than hide the number.

| Measure | Target | First site's result |
|---|---|---|
| Total weight | Under 500 KB | 495 KB |
| PageSpeed performance | 90+ | 95 |
| Largest paint (LCP) | Under 2.5 s | 2.9 s |
| Layout shift (CLS) | Under 0.1 | 0.003 |
| Blocking time | Under 200 ms | 40 ms |
| Third-party requests in first paint | None | None |

## Images

**Pipeline (`templates/`):** originals stay in `public/images`. `templates/image-tools/optimize.mjs` writes AVIF and WebP copies at 160, 320, 480, 640, 960, 1440 and 2000px into `src/assets/images`, plus a manifest. Copies are committed, because AI Studio can't run the tool. Keep it outside the site's dependencies.

**Every public image** goes through `ResponsiveImage`:

- Importing copies with `import.meta.glob` gives fingerprinted `/assets` addresses and year-long caching. `?no-inline` stops small ones being embedded, which would break `srcset`.
- Give each use an honest `sizes`. Match breakpoints to the layout's real ones (901px, not 900px).
- The main top-of-page image gets `priority`: `fetchPriority="high"`, never lazy. Everything else is lazy and async.
- Always reserve space. A mismatched width and height pair reserves the wrong shape and the page jumps.
- `<source>` tags need `class="hidden"` inside `<picture class="contents">`, or they become empty grid cells and shift layouts. Comparing pages found this.
- Look up `src` with `Object.hasOwn`, because database values are arbitrary strings.
- Don't tighten `sizes` to save bytes if it changes rendered size. It shrank covers by up to 12%, and with `w-auto`, `sizes` sets the natural width.

**Uploaded photos** live in storage: slow caching, a second connection and no copies. Options:

1. Shrink on upload (always).
2. List key uploads by exact address in `uploads.json` and re-run the tool. A new upload shows at full size until then. Fine for a few images; it needs a build session each time.
3. Storage on-demand resizing works, but it's a paid feature on AI Studio's account, so don't rely on it.
4. Unproven: have the admin make several sizes in the browser during upload, with no new vendor or cost. This closes the biggest gap for sites owners manage, so try it on the first site that needs it and record the result here.

**Also:** use small PNG favicons, not a heavy SVG with an embedded image. Keep originals for share previews and very old browsers. Show the client side-by-sides before replacing art. Replacing a file in `public/images` needs the tool re-run, or the old picture keeps showing.

Lazy loading alone doesn't help: the files stay the same size.

## Fonts

Self-host from day one. Third-party font stylesheets blocked first paint by an estimated 2 s on a slow phone.

- Put `woff2` files in `src/assets/fonts`, not `public/`, so they get long caching. Reference them from `styles.css` with `font-display: swap`.
- Read the license before copying. Some commercial licenses forbid altering or publicly distributing the files, so the repo must stay private and subsetting or conversion is off limits. Keep license files beside the fonts.
- List every font in use, including one-off handwriting faces. AI Studio's brief missed one.
- For Google fonts, Google's own variable `woff2` files keep letters identical with one download.
- Prove nothing moved with the page audit: same font, size and position for every text item.
- Move the fonts before chasing other delays. Don't chase a font marked red in a dependency chart if it isn't holding up the largest paint.

## JavaScript and server

Measure what a fresh visitor actually downloads before cutting anything.

- **Keep the sign-in toolkit off public pages.** Supabase's client cost an estimated 50 KB compressed. Only load it on `/auth`, on `/admin`, with a saved session, or when an email link puts a session in the address. That last case is easy to miss, and a review caught it. See `attach-admin-auth.ts` and `saved-session.ts`. If AI Studio restores the generated attacher, nothing breaks but the saving is lost.
- **Load pop-ups on first press**, with a fallback to the page section if loading fails.
- **Remove repeated lookups.** Memoize per request by the request object, so nothing leaks between visitors and admin edits show at once (`request-memo.ts`).
- Root loader `staleTime` avoids refetching on every page change, but pair it with `router.invalidate()` on admin saves.
- Remove unused shadcn components and packages at the start. Don't add `framer-motion`-style weight to public pages for small effects.

## What's not worth doing

- Removing a cookie banner to gain speed: an estimated 0.1 s at most.
- Cutting React or the router.
- Caching whole pages on the host when admin edits and countdowns must stay current.
- Rewriting working code for 10-20 KB of "unused JavaScript".

## Measuring honestly

- Use real Chrome numbers plus three Lighthouse runs, because scores move between runs. PageSpeed's API has a shared quota, so run Lighthouse locally when it fails.
- `vite preview` doesn't compress, so local weight overstates and local LCP isn't comparable. Use a production build for layout comparisons and the live host for timing.
- Baseline against a build of the same code. Comparing with live when live is behind produces false differences.
- On the first host, Lighthouse showed 1-2 s of idle before first paint that real Chrome sessions didn't, at 0.4-0.6 s. No cause was found after ruling out scripts, fonts, images and animation. Don't chase what real sessions don't show. Say so instead.
- Estimates go in as estimates. A 425 KB estimate landed at 495 KB.
- After each round, run: audit and compare, then real device, then record the before and after table in `docs/STATUS.md`.

## SEO foundations

Build these once, centrally:

- One `SITE_URL` constant. Check which of `www` or bare is official (`curl -I`), and use it everywhere: site, sitemap, robots, share tags.
- Root route head adds canonical and `og:url` for every page from the current path, so new pages inherit them. Skip `/auth`, `/admin` and not-found. `/auth` and `/admin` also carry `noindex`. `matches[].status` is stale inside `head`, so a missing item may keep its canonical, which is harmless on a true 404.
- Missing items return a real 404, not a 200 "not found" page.
- Each page sets its own title and description, editable in the admin if the site has one. Keep descriptions under 160 characters.
- A default share image for pages without one, with absolute addresses.
- `robots.txt` allows all crawlers and names the sitemap.
- `sitemap.xml` lists only final, indexable addresses, no redirects. On the first site it was a static file, so a new item needed adding by hand. Default on new sites: a route that generates the sitemap from the database. It's unproven, so confirm the route responds on the live host.
- Security headers: the first site sent none of the common ones. Default on new sites, unproven: add the safe ones (`Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) if the host allows it, and check with `curl -I`. Leave a content security policy until the checkout is proven with it.
- Pages render real text on the server. Confirm with `tools/seo-check.mjs`.
- One `h1` per page. Decorative images use empty alt on purpose.
- Tracking-tagged addresses must canonicalize to the clean one.

## Structured data

Put it in one tested file (`structured-data.ts`). Reuse approved copy only, so no new claims sneak in.

- Business or person: `Person`, `Organization` or a suitable `LocalBusiness` subtype, with `sameAs` for real profiles.
- `WebSite` on home, `ProfilePage` on about.
- Item pages: the right type (`Book`, `Product`, `Service`) plus `BreadcrumbList`.
- Mark up only what's true and visible. A contributor to a collection isn't its author. Leave out prices that live in a sealed checkout, and identifiers you don't store.

Validate on the live pages with Google's Rich Results Test and the schema.org validator. Not every type gets a rich result: `Book` doesn't, so a clean test may report only breadcrumbs.

## Local businesses

Not tested on a real site yet. Best-practice starting points for a shop, bakery or service with a location:

- Claim the Google Business Profile, and use the same name, address and phone on the site and every listing.
- Put address, hours, phone and a map link on the contact page and in the footer, as real text.
- A home-based or service-area business shouldn't publish a home address without asking. Name the towns served instead, use `areaServed` in structured data, and set a service area in the Business Profile.
- Use the most specific `LocalBusiness` subtype, with `address`, `openingHours`, `telephone` and `geo` where true. Show the same details on the page.
- Name the town and the service in titles and headings, naturally.
- Add a page per main service if each has something real to say. Avoid town-name filler pages.

## Reading outside reports

Sales-style audits mix real findings with templates. Check each claim against the live HTML, then sort it:

- **Real:** fix it.
- **Generic or wrong:** explain why. On the first site, "missing alt" meant deliberate empty alts, and "invisible to AI" was false because every crawler was allowed and pages held 300-750 words.
- **Missed:** look for what they didn't catch. The report missed a sitemap made entirely of redirects.

A scary score is a hook. Never let one set priorities.

## Search Console

Set it up at launch, not later. Verify the domain, submit the sitemap, and check indexing. A blog or articles only pays off if the client will keep writing, so make that a decision, not a default.
