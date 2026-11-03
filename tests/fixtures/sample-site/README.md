# Sample site (test fixture)

A tiny fake AI Studio repo for a made-up window-cleaning business. It exists only so the audit skill can be tested against a site whose problems are known in advance. Nothing here is real: the business, the quote, the numbers and the form address are all invented.

Never fix these problems. The audit scenarios in `tests/skill-scenarios.md` expect them to be found.

## Answer key: planted problems

Every audit of this fixture should find all of these.

1. `src/routes/index.tsx`: sample text (lorem ipsum) in the page body.
2. `src/routes/index.tsx`: an unnamed, unsourced testimonial ("Sarah M." with five stars), which may be invented.
3. `src/routes/index.tsx`: a round-number claim ("500+ happy clients") with no source.
4. `src/routes/index.tsx`: a Google Fonts stylesheet link, so every visitor's browser contacts Google (speed and privacy).
5. `src/lib/tracking.ts`: the form event type is "external form submission" with a space; the CRM wants `external_form_submission` with an underscore, so contacts would never be created.
6. `src/lib/tracking.ts`: the success message is shown without waiting for the CRM's reply, so a failed send looks like a success.
7. `src/routes/contact.tsx`: the marketing consent box is pre-ticked.
8. `public/robots.txt`: `Disallow: /` for every crawler, which tells search engines and AI bots to stay out of the whole site.
9. `public/hero.png`: stands in for a 3 MB hero image in the real case. It is a 1-pixel placeholder here, so the audit cannot measure the size and should say so, not call it fine.

## Areas that should be Not applicable

- Selling and checkout: the fixture has no products, cart or payment block.
- Admin: the fixture has no `/admin` route or saved-copy editor.

These must be marked Not applicable, never failed.

## Live-only checks

There is no live site. Checks that need one (a real test form, live headers, page speed, the sitemap on the live address) belong under "What we couldn't check".
