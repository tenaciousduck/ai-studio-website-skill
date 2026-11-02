# Launch and verification

## Contents
- Evidence standard
- First hosted publish
- Before announcing
- After each publish
- Client handover
- Ongoing care

## Evidence standard

Report what was checked, how, and on what. Name what wasn't checked. "Works" with no method isn't a result. If a person's phone is the only real-device check, say so. Don't ask anyone to check what you can check yourself.

## First hosted publish

Some checks only work on the real host, so plan one quiet publish before launch, with nothing announced and any Payments in test mode.

- [ ] The builder publishes.
- [ ] If the site has an admin, the owner or builder claims the first editor straight away. `/auth` allows open sign-up and offers "Claim" while no editor exists, so a stranger could take it. Confirm a new account sees no Claim button.
- [ ] Run the hosted checks below.

## Before announcing

**Content**
- [ ] No invented reviews, quotes, stats, sample text or placeholder links
- [ ] Copy rules checked (banned words, unreleased details, vendor names), including alt text and SEO text
- [ ] Every sold or promised thing is true: gifts, perks, dates, shipping lines
- [ ] Copy in the database searched as well as the code
- [ ] Test data can't reach production: fixture strings absent from the build
- [ ] Assets licensed; no watermarks, no photos of people without permission

**Function**
- [ ] Type check, tests, lint at or below baseline, production build
- [ ] Sealed folders unchanged
- [ ] `src/integrations` and generated files untouched by your commits
- [ ] Every form tested live, end to end
- [ ] Date-driven labels tested with the override, including the switch itself
- [ ] If there's an admin: sign-in, reload, sign-out, and `/admin` after sign-out
- [ ] If there's an admin: a save appears on the public page

**Quality**
- [ ] `tools/page-audit.mjs` shows no sideways scroll and no failed requests at every width
- [ ] Performance budget met (`05-performance-seo.md`)
- [ ] `tools/seo-check.mjs` clean, or each remaining item accepted in `docs/STATUS.md`
- [ ] Accessibility pass and whole-branch review, with fixes re-reviewed

**Legal** (full list in `09-legal.md`)
- [ ] Privacy page reviewed; sender line and footer address correct
- [ ] Consent wording matches what's sent
- [ ] If the site sells anything: terms published and linked, with the tick box working
- [ ] `tools/cookie-check.mjs` run on the live site, and its result matches the privacy page
- [ ] Repo private if a font license needs it

## After each publish

Run these against the live address, and record results in `docs/STATUS.md`:

```bash
node <skill folder>/tools/seo-check.mjs https://SITE
```

```bash
node <skill folder>/tools/page-audit.mjs https://SITE <scratchpad>/live / /about
```

```bash
node <skill folder>/tools/cookie-check.mjs https://SITE <scratchpad>/cookies / /contact
```

1. Confirm it's the new version: look for something only that version contains.
2. `curl -I` an asset, a font and an image: status and cache headers.
3. No third-party font or script requests.
4. Three Lighthouse runs, or PageSpeed Insights.
5. Google's Rich Results Test and schema.org validator.
6. Search Console: verify, submit sitemap.
7. One real sign-up, read back in the CRM.
8. If selling, the Payments checks in `07-commerce.md`.
9. A person checks a real phone.

## Client handover

- If there's an admin, a short "how to edit your site" page: which tab changes what.
- Which edits are live immediately, and which need a publish.
- What needs a build session: replacing images in `public/images`, new uploads worth optimizing, adding a page to the sitemap, schema changes.
- A dated list of client tasks. Example: paste a link on launch day.
- A one-page ownership and costs sheet: who holds each login and who created the account (domain, GitHub, HighLevel, Stripe, Search Console, Google Business Profile), and what the client pays each month. MFA on every vendor account.
- Backups and leaving: ask AI Studio what backups exist and how to export data and files, then write down the answer. The database sits in AI Studio's account, so this is the client's exit plan.
- If there's an admin, owner access: confirm they can sign in, and show them the admin. Claiming the first editor needs the hosted site, and happens at the first publish.

## Ongoing care

- Monitoring, unproven: a free uptime check, and an alert when a form send fails, because failures otherwise reach only a server log.
- Email records: check SPF, DKIM and DMARC on the domain. Review reports on a monitor-only DMARC record, then tighten it.
- Keep `docs/OPEN-ITEMS.md` honest: launch, decisions, content, later.
- After each milestone, update `docs/STATUS.md` and memory. Mark stale notes rather than trust them.
- When a project teaches something new, note it in the project's docs, with the date. If you maintain this skill, add it to the right chapter.
