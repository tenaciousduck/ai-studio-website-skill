# Audit checklist

Every check the audit runs, by area. Each row says what's checked, how, one plain sentence for the report, and the chapter its repair follows. The sentences are patterns: fill in what you found, and keep them that plain.

## Contents

- How to use this list
- Commands
- Reading tool output
- Speed
- Design and usability
- SEO and AI crawlers
- Truthful content
- Forms and CRM
- Selling and checkout
- Legal and privacy
- Platform health
- Admin
- Launch and care

## How to use this list

- **Read-only.** Every check reads code, reads the live site or asks the owner. Nothing here edits, commits, submits a form (except the approved live test, which the owner submits using Claude's short steps, or Claude in the owner's signed-in browser only if the owner prefers), places an order or writes to a database. Building the site, if needed, happens in a copy in the session scratchpad, never in the owner's folder.
- **Paths** are from this skill's folder. Chapters such as `05-performance-seo.md` live in `../building-ai-studio-websites/references/`. Paths starting `templates/` live in `../building-ai-studio-websites/`.
- **Placeholders:** `SITE` is the live address, with no slash at the end. `REPO` is the site's code folder. `OUT` is a folder in the session scratchpad. `DOMAIN` is the site's domain name.
- **Mark every result** measured, estimated or unverified, and every recommendation best practice or judgment call. A lesson from an earlier full AI Studio build is unverified for this site until a check here confirms it.
- **Platform facts** come from the build skill's chapters, last checked October to November 2026. Write "AI Studio, as last checked", never "AI Studio can't".
- **An area that doesn't apply** is Not applicable, with one line why. It's never a finding or a question.
- **Needs the live site or a permission that was refused?** List it under "What we couldn't check", or mark it "checked in code only". If that leaves most of an area unchecked and nothing worse than Nice to have found, its scorecard status is Not checked, never Good.
- **Single-area audit:** run only that area's section.
- **If the stack differs** from `02-platform.md` ("The stack"), these checks may not apply and should be marked so before running: sealed and generated folders (Platform health), `src/lib/tracking.ts` and the event type (Forms and CRM), the sign-in toolkit (Speed), `src/start.ts`, migrations, and the checkout block (Selling and checkout).

## Commands

Run from this skill's folder. Usage is at the top of each tool. They need Node 22+ and Google Chrome.

```bash
node ../building-ai-studio-websites/tools/seo-check.mjs SITE
node ../building-ai-studio-websites/tools/content-check.mjs REPO SITE / /about /contact
node ../building-ai-studio-websites/tools/page-audit.mjs SITE OUT/live / /about /contact
node ../building-ai-studio-websites/tools/cookie-check.mjs SITE OUT/cookies / /contact
```

Speed, run three times (once with lighter checks), then summarize:

```bash
npx lighthouse SITE --form-factor=mobile --output=json \
  --output-path=OUT/run1.json --quiet --chrome-flags="--headless=new"
node ../building-ai-studio-websites/tools/lighthouse-summary.mjs OUT/run1.json OUT/run2.json OUT/run3.json
```

Name the site's real pages in place of `/about /contact`. `seo-check` with no paths uses every address in the sitemap.

## Reading tool output

The tools print short technical lines. Never paste them into the report. Translate:

| Tool says | Say to the owner |
|---|---|
| `LCP` (largest paint) | How long until the biggest thing on screen appears |
| `FCP` | How long until anything appears |
| `CLS` | How much the page jumps while it loads |
| `TBT` | How long the page is frozen to taps |
| Server response time | How fast the server starts answering |
| `KB` | How much a phone downloads |
| `allowed via *` | Allowed by your general rule for all bots. With no robots.txt, every bot shows this: there are no rules at all |
| `named` | Your robots.txt names this bot directly |
| `partly blocked` | Kept out of some pages, not all |
| `strict-transport-security` | Tells browsers to always use the secure connection |
| `x-content-type-options` | Tells browsers not to guess what a file is |
| `referrer-policy` | Limits what other sites learn about where visitors came from |
| `x-frame-options` | Stops other sites showing your pages inside theirs |
| `content-check` candidate | Text that might be filler. A person decides, starting with the owner |

## Speed

Fixes follow `../building-ai-studio-websites/references/05-performance-seo.md`, against its Targets table.

```bash
# How fast the server answers, in seconds. Run three times.
curl -o /dev/null -s -w '%{time_starttransfer}\n' SITE
# Cache rules for one script, one font and one image. Take addresses from Lighthouse's download list.
curl -sI SITE/assets/<file>
# Fonts from another company's server
grep -rnsE "fonts\.googleapis|fonts\.gstatic|use\.typekit|fonts\.bunny" REPO/src REPO/public REPO/index.html
```

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Page weight | `lighthouse-summary` KB column; `page-audit` KB per page and width | "Your home page downloads N KB on a phone. The target is under 500 KB, because every extra bit is waiting on mobile data." | `05-performance-seo.md` "Targets", "Images" |
| Score and timings | `lighthouse-summary` score, LCP, CLS, TBT across the runs, and the server-answer `curl` | "On a phone, the main picture appears after N seconds (target under 2.5), the page jumps by N (target under 0.1), and it's frozen to taps for N ms (target under 200)." | `05-performance-seo.md` "Targets" |
| Server answer time | The `curl` above; Lighthouse's `server-response-time` audit flags over 0.6 s | "Your server takes N seconds to start answering, before anything else can load." | `05-performance-seo.md` "JavaScript and server"; `02-platform.md` "Hosting behaviour" |
| What the largest element is, and what delays it | `lighthouse-summary` "largest paint element" and "heaviest downloads" | "The slowest thing to appear is your top photo. It waits on its own size, N KB." | `05-performance-seo.md` "Images", "Fonts" |
| Image format, size and `srcset` | Heaviest downloads of type image; code: `<img>` without `srcset`, no `src/assets/images` copies | "Photos are sent full size in an older format, so phones download far more than they show." | `05-performance-seo.md` "Images"; `templates/image-tools/`, `templates/src/components/responsive-image.tsx` |
| Fonts from other hosts | The `grep` above; `page-audit` `thirdParty` hosts in `OUT/live/results.json` | "Your fonts come from another company's server, which holds up the first view on slow phones." | `05-performance-seo.md` "Fonts" |
| Third-party scripts in first paint | `page-audit` `thirdParty` hosts; Lighthouse downloads before first paint | "Before your page appears, it waits on code from another company." | `05-performance-seo.md` "JavaScript and server" |
| Sign-in toolkit on public pages | Heaviest downloads on `/` include the Supabase client; code: what loads it on every page | "Every visitor downloads the editor sign-in code, though only you sign in." | `05-performance-seo.md` "JavaScript and server"; `templates/src/lib/attach-admin-auth.ts`, `templates/src/lib/saved-session.ts` |
| Heavy animation libraries | `REPO/package.json` lists `framer-motion`, `motion`, `gsap`, `three` or `lottie`, imported by public pages | "A large animation library loads for a few small effects." | `05-performance-seo.md` "JavaScript and server" |
| Cache rules on assets, fonts and images | The `curl -sI` above. Built `/assets/` files should say `max-age=31536000, immutable` | "Returning visitors download your images again, because the server tells browsers not to keep them." | `02-platform.md` "Hosting behaviour"; `05-performance-seo.md` "Images", "Fonts" |
| Test-only delay | Compare Lighthouse's first paint with a real Chrome visit | "Part of the delay shows up only in Google's test, not in real visits, so we won't chase it." (estimated) | `05-performance-seo.md` "Measuring honestly" |

## Design and usability

Fixes follow `../building-ai-studio-websites/references/03-design.md`. Layout and taste findings are judgment calls; accessibility is best practice. The owner's taste wins.

**Mockups before a visible fix.** Before any repair that changes how a page looks, such as a new layout or a reworked call to action, offer concept mockups and advise yes (judgment call). They show the current page and the proposed one side by side, in the project's `design/concepts/` folder, following "Mockups before building" in `03-design.md`. Nothing is built until the owner picks, and they can skip the mockups. Fixes meant to look identical, such as images, fonts and speed work, skip mockups: run `page-audit` before and after, then `page-compare`, as rule 9 in `../building-ai-studio-websites/SKILL.md` says.

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Sideways scroll at 360px | `page-audit` prints SIDEWAYS SCROLL on the `small` view | "On small phones the page slides sideways, which feels broken." | `03-design.md` "Accessibility floor" |
| Button size | `page-audit` phone screenshots in `OUT/live`; Lighthouse `target-size` audit in the run JSON; code: button heights under 44px | "Some buttons are smaller than a fingertip on a phone." | `03-design.md` "Accessibility floor" |
| Contrast | Lighthouse `color-contrast` audit in the run JSON | "Some text is too faint against its background to read easily." | `03-design.md` "Accessibility floor" |
| Skip link | Code: the first focusable item in the root layout jumps to the main content | "Keyboard users must tab through the whole menu on every page." | `03-design.md` "Accessibility floor" |
| Focus after pop-ups | Code: pop-ups built on the UI kit's dialog return focus; hand-made ones often don't | "When a pop-up closes, keyboard users lose their place." | `03-design.md` "Accessibility floor" |
| Form errors | Code: errors move focus to the field and use `aria-describedby`. Never submit a form to see | "When a form has a mistake, screen-reader users aren't told what's wrong." | `03-design.md` "Accessibility floor" |
| Repetitive sections | `page-audit` desktop and phone screenshots | "Several sections in a row look alike, so visitors stop reading." | `03-design.md` "Taste: ask each client" |
| Unclear or competing calls to action | Read each page: one main action per place; buttons of one kind behave alike; none scrolls to something already on screen | "Visitors see several buttons and no clear next step." | `03-design.md` "Page patterns" |
| Generic AI look | Only if the owner wants this review: ask first, then use `avoid-ai-design` in its detection-only mode if it's installed | "The design uses defaults common to AI-made sites, which can make the business look like everyone else." | `03-design.md` "Taste: ask each client" |

**Optional design skills** (judgment call): recommend `avoid-ai-design`, `design-taste-frontend`, `web-design-guidelines` and `frontend-design` for the design repair. They helped on an earlier full AI Studio build, and none is required. Each has strong opinions of its own, so the owner's taste overrides them; how much design freedom the owner wants decides which, if any, to use.

## SEO and AI crawlers

Fixes follow `../building-ai-studio-websites/references/05-performance-seo.md` ("SEO foundations", "Structured data", "Local businesses", "Search Console"). `seo-check` gives most rows; its PROBLEM lines are the start, not the whole finding.

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Title, description, canonical, one `h1`, share image | `seo-check` per-page lines and PROBLEM lines | "Your contact page has no description, so Google writes its own." | "SEO foundations" |
| Real text for crawlers | `seo-check` "very little text in the raw HTML" | "Search engines see an almost empty page before the code runs." | "SEO foundations" |
| Sitemap entries that redirect or are missing | `seo-check` sitemap line and "sitemap address answers" problems; compare with the pages in `REPO/src/routes` | "Your sitemap, the list of pages you give Google, points to addresses that redirect and misses your services page." | "SEO foundations" |
| Sitemap stays current | Look for `REPO/public/sitemap.xml` versus a route that builds the sitemap (grep `REPO/src/routes` for `sitemap`). If it is a hand-written file, compare its entries with the site's pages and published items (from the routes, and the live site's links). Important if the site adds pages or items over time, otherwise Nice to have | "Your sitemap is a file someone updates by hand, so new pages or items won't reach Google until someone adds them." | "SEO foundations" (a route that builds the sitemap from the database is the default for new sites, but unproven: confirm it responds on the live host) |
| robots.txt | `seo-check` robots line, "no robots.txt", "robots.txt blocks the whole site" | "Your robots.txt, the file that tells search engines what they may read, shuts them all out, so Google can't list you." | "SEO foundations" |
| Real 404s | `seo-check` line for `/this-page-should-not-exist` | "A page that doesn't exist still answers as if it did, which confuses search engines." | "SEO foundations" |
| Tracking-tagged addresses | `seo-check` line for `/?utm_source=x&fbclid=abc` | "Links shared with tracking tags count as separate pages in Google." | "SEO foundations" |
| Structured data valid and true | `seo-check` "structured:" and parse problems; then Google's Rich Results Test and the schema.org validator on the live pages; compare each claim with the visible page | "The hidden business details for search engines say you're open Sundays; your page says you aren't." | "Structured data" |
| Alt text | `seo-check` "images have no alt attribute"; `alt=""` on a decorative image is deliberate and fine; code: informative images with empty alt | "Some photos have no description for blind visitors or search engines." | "SEO foundations"; `03-design.md` "Accessibility floor" |
| Search Console | Ask whether it's set up, verified and has the sitemap submitted | "Google's free Search Console shows whether your pages are listed and why not." | "Search Console" |
| Local business details | Only for a business with a location or service area: the same name, address and phone on the site and the Google Business Profile; ask before advising a home address | "Your address on the site doesn't match your Google listing, which can cost you local searches." | "Local businesses" |
| Security headers | `seo-check` "security headers" line | "Your site doesn't send four standard safety instructions to browsers. Some hosts don't let a site set them, so this may need checking with AI Studio." | "SEO foundations" |
| AI bot rules in robots.txt | `seo-check` "AI bots (list checked DATE)" lines | "AI search tools such as ChatGPT can read your site; AI training bots are also allowed. Letting them in is your choice." | "SEO foundations" (keep the owner's AI bot choice) |
| llms.txt | `seo-check` "llms.txt" line | "An llms.txt file is an optional summary for AI tools. It's cheap to add, but there's little evidence yet that they read it." | "SEO foundations" (keep the owner's AI bot choice) |

**AI bots are the owner's choice.** Explain the trade-off and ask: search and user-fetch bots can send visitors from AI answers; training bots use the pages to train models. Vendors say user-fetch bots may ignore robots.txt because a person asked for the page. Offer llms.txt as an option, never as required.

**Re-check the bot list.** `seo-check` prints the date its bot list was last checked against vendor pages (`AI_BOTS_CHECKED`). Always tell the owner that date. If it's more than three months old, read each vendor page listed at the top of `../building-ai-studio-websites/tools/lib/ai-bots.mjs` before reporting, and mark any bot the tool doesn't know as unverified by the tool. The audit doesn't change the tool.

## Truthful content

Fixes follow rule 8 in `../building-ai-studio-websites/SKILL.md` and "Before announcing" in `../building-ai-studio-websites/references/08-launch.md`. Every hit is a candidate. The owner decides what's real, and nothing is deleted during the audit.

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Invented reviews, quotes, stats and sample text | `content-check` kinds: sample text, unnamed reviewer, star rating, round-number claim. Ask the owner where each candidate came from | "This review has no name or source we could find. If it isn't from a real customer, it costs trust if found, and advertising rules in many places forbid it (best practice; not legal advice)." | Rule 8; `08-launch.md` "Before announcing" |
| Placeholder links, names and `example.com` | `content-check` kinds: placeholder link, placeholder address, placeholder name | "A button on your home page leads nowhere." | `08-launch.md` "Before announcing" |
| Content saved in the admin as well as the code | `content-check` with `SITE` scans live wording, which includes text saved in the site editor; compare with the code hits | "Some wording lives in your site editor, not the code, so it must be fixed there too." | `04-admin.md` "Traps" |
| Promises the business can't keep | Read pages for gifts, perks, guarantees, reply times, dates, delivery and scarcity; ask the owner to confirm each | "The page promises a reply within an hour. Is that true every day?" | `08-launch.md` "Before announcing" |

## Forms and CRM

The CRM is the customer list the forms feed, here HighLevel (GHL). Fixes follow `../building-ai-studio-websites/references/06-forms-consent.md` ("Sending forms", "Consent") and `templates/src/lib/ghl-submit.ts`, `templates/src/lib/ghl.functions.ts`. `src/lib/tracking.ts` belongs to AI Studio: repairs build beside it.

```bash
grep -rn "external form submission" REPO/src
grep -rn "defaultChecked" REPO/src
```

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Event type spelling | The first `grep`: a space instead of `external_form_submission` | "Your form labels each message in a way HighLevel, as last checked, accepts and then quietly drops, so enquiries may never arrive." (unverified until a live test) | "Sending forms" |
| Success only after the server confirms | Code: the submit handler waits for the reply and checks it before showing thanks | "Your form says thank you even when sending failed, so a lost enquiry looks like a success." | "Sending forms" |
| Sending from the server | Code: the send to HighLevel runs in a server function, not the visitor's browser | "Your form sends from the visitor's browser, where a failure can't be retried or logged." | "Sending forms" |
| Spam protection | Code: a hidden trap field or a per-visitor limit on the server | "Nothing stops a bot filling in your form, which would create fake contacts and tasks for you." | "Sending forms" |
| Double-submit protection | Code: the button is disabled while sending | "A double click can send the same form twice." | "Sending forms" |
| Consent boxes unticked, exact wording sent | The second `grep`, plus any consent box whose starting state is ticked; code: the wording sits in one constant and is sent with the form | "Your email sign-up box starts ticked, so a sign-up may not count as real permission (best practice; not legal advice)." | "Consent" |
| Sender line | Page text under each sign-up: name, business name, mailing address, contact email, how to unsubscribe | "Your sign-up form doesn't say who will email people or how to stop (best practice; not legal advice)." | "Consent"; `templates/src/lib/sender.ts` |
| Duplicate-contact setting | Ask the owner to check HighLevel's "Allow Duplicate Contact" setting is off | "If it's on, one person can become two contacts and their history splits." | "Sending forms" |
| Live test | Only with permission, as `SKILL.md` step 4 says. Read back tags, fields, note, source and any task | "We sent one test enquiry, and it arrived with everything." Without permission: "checked in code only" | "Testing without creating junk" |

Then point the owner to `references/crm-guide.md`, the plain-English guide to fields, tags, workflows and notes. Offer to copy it into the site's `docs/`.

## Selling and checkout

**Skip this area when** the site takes no payments itself: no `src/integrations/payments/` folder and no checkout page. Links out to another shop or marketplace don't count; mention them in one line.

Fixes follow `../building-ai-studio-websites/references/07-commerce.md` and `../building-ai-studio-websites/references/09-legal.md`. Never place an order. A test order is the owner's, in test mode on the live site, during the repair; list it under "What we couldn't check".

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Shipping charged, or stated as included | Read the product and checkout pages. AI Studio's checkout, as last checked, had no shipping step; ask how shipping is charged | "Your page mentions a shipping fee, but the checkout, as last checked, has no shipping step, so it may never be charged." | `07-commerce.md` "What it can't do", "Designing around it" |
| Terms box before payment | Code: a required, unticked box before the checkout block appears, with the terms readable in full | "Buyers can pay without agreeing to any terms, which weakens you in a refund dispute." | `09-legal.md` "Agreeing before payment" |
| Seller details above the checkout | Page text: who is selling, with links to terms and privacy | "Buyers can't see who they're buying from." | `09-legal.md` "Agreeing before payment" |
| Quantity limits | Ask whether there's a limit; code: a rule hiding the checkout's quantity box | "Buyers can order more than you can supply." | `07-commerce.md` "What it can't do" |
| Tax setting matches the page | Ask the owner, and their accountant, whether the checkout adds tax; compare with the page | "Your page says prices include tax; only you can confirm the checkout's setting matches." | `09-legal.md` "Checks" |
| Card statement name | Ask what buyers see on their statement | "An unfamiliar name on a card statement leads to disputes." | `07-commerce.md` "Going live" |
| Confirmation email contents | Ask for a copy: seller name and contact, itemized price, tax and total, delivery window, refund rule, terms link | "Your order email doesn't say how to get a refund." | `09-legal.md` "Order confirmation" |
| Recurring payments | Code or catalog: any subscription price | "Subscriptions are reported to work in AI Studio, but they weren't tested on an earlier full AI Studio build. Test renewals and cancellations before relying on them." (unverified) | `07-commerce.md` "Recurring payments and memberships" |

## Legal and privacy

Not legal advice: never claim compliance, and put "not legal advice" beside every legal item. Fixes follow `../building-ai-studio-websites/references/09-legal.md`, with `../building-ai-studio-websites/references/legal-canada.md` or `../building-ai-studio-websites/references/legal-us.md`. Ask the country once if it isn't known, and say which checks wait on it. For anywhere else, say the notes don't cover it.

**Skip this area when** the site has no forms and collects nothing on visits. AI Studio, as last checked, adds visit statistics to every published page, so in practice this area is only partly skipped: for a site with no forms, drop the form rows of the data trace and keep the rest. The terms and refund rows apply only when the site sells.

```bash
# Only if a banner offers choices: once per button, with its exact label.
node ../building-ai-studio-websites/tools/cookie-check.mjs SITE OUT/cookies-decline --press "Decline" /
grep -rniE "compliant|compliance|certified" REPO/src
```

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Privacy page matches what the site does | `cookie-check` cookies, storage and outside hosts, plus the data trace in `09-legal.md` "Gap review first", compared with the privacy page | "Your privacy page doesn't mention the visit statistics every page collects." | `09-legal.md` "Privacy page", "Cookies" |
| No cookie choice that changes nothing | If a banner offers choices, run `cookie-check --press` once per button, using its exact label. Accept and Decline must end with different cookies, and nothing non-essential may load before a choice | "Your Decline button changes nothing: the same cookies load either way." | `09-legal.md` "Cookies"; `templates/src/components/cookie-notice.tsx` |
| Terms exist if selling | A terms page, linked from the footer and beside the checkout | "You take payments, but there are no terms of sale." | `09-legal.md` "Terms page"; `templates/src/lib/terms.ts` |
| No public compliance claims | The `grep` above, and the live page text | "Your site says it's fully compliant, a claim that's hard to prove and can count against you." | `09-legal.md` "Terms page" |
| Refund wording | If selling: a refund and cancellation rule in the terms and near the buy button. Ask the owner's real rule | "Nothing tells buyers what happens if they want their money back." | `09-legal.md` "Terms page" |
| The owner's decisions | The questions in `09-legal.md` "Decisions the client must make" that apply. List them under "Only you can do these". Never answer them | "Only you can decide your refund rule and who the legal seller is." | `09-legal.md` "Decisions the client must make" |

## Platform health

Fixes follow `../building-ai-studio-websites/references/02-platform.md`. Never print a secret's value.

```bash
git -C REPO log --format='%h %an %ad %s' --date=short -- src/integrations src/routeTree.gen.ts src/lib/tracking.ts
git -C REPO log --format='%h %an %ad %s' --date=short -- supabase/migrations src/start.ts .env
cut -d= -f1 REPO/.env
(cd REPO && gh run list --limit 3)
```

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| "Diverged" status | Ask whether AI Studio shows "Diverged" | "If AI Studio says Diverged, choose New branch. Force push would overwrite your GitHub copy with AI Studio's." | `02-platform.md` "Sync, publishing and Diverged" |
| Edits inside sealed or generated folders | First `git log`: commits by anyone other than AI Studio are candidates; read what they changed | "Someone changed files AI Studio owns, and AI Studio may overwrite those changes without warning." | `02-platform.md` "Who owns what" |
| Migration files that never ran | Second `git log` and `REPO/supabase/migrations`: files added by hand, not by AI Studio's tool. Unverified until AI Studio confirms what ran | "A database change sits in the code but may never have run, because AI Studio, as last checked, applies only changes made through its own tool." | `02-platform.md` "Database and sign-in"; `prompts.md` "Schema migration" |
| Secrets in `.env` | `cut` lists names only. A name with SECRET, PRIVATE, SERVICE_ROLE, PASSWORD or TOKEN is a candidate; ask before looking further | "Your code's settings file holds something that looks like a password, and anyone who can read the code can see it." | `02-platform.md` "Database and sign-in" |
| `src/start.ts` rewritten | Second `git log`; the file still contains `createCsrfMiddleware` | "A file that protects your forms from forged requests was rewritten." | `02-platform.md` "Database and sign-in" |
| Build passes | `gh run list` if the repo has automatic checks; otherwise ask whether AI Studio's last build succeeded, or build a copy in the scratchpad | "The site doesn't build cleanly, so the next change may fail to publish." | `02-platform.md` "Build failures" |

## Admin

**Skip this area when** the site has no editor: no `admin` or `auth` route in `REPO/src/routes`.

Fixes follow `../building-ai-studio-websites/references/04-admin.md` and "First hosted publish" in `../building-ai-studio-websites/references/08-launch.md`.

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| The first-editor claim is closed | Ask whether the owner claimed editor access at the first publish. A signed-out visit can't prove it: the Claim button usually shows only to a signed-in account, so its absence means nothing. Never create an account or press Claim. If the owner can't confirm, mark it unverified and list it under "Only you can do these": they sign up with a throwaway account they create themselves, and check that it sees no Claim button. Don't press Claim on it. If you see it, sign in with your real account and claim it now | "If the editor claim is still open, a stranger could sign up and take over your site's content." | `08-launch.md` "First hosted publish" |
| Admin pages are `noindex` | `node ../building-ai-studio-websites/tools/seo-check.mjs SITE /admin /auth`: the `robots:` value | "Search engines may list your editor's sign-in page." | `05-performance-seo.md` "SEO foundations" |
| Saved text overrides the code | Code: wording read from the database with code defaults; `content-check` live hits that the code lacks | "Some text is set in your site editor, so a repair must change it there as well as in the code." | `04-admin.md` "Traps" |

## Launch and care

Fixes follow `../building-ai-studio-websites/references/08-launch.md` ("Client handover", "Ongoing care"). Most rows are questions for the owner.

```bash
dig +short TXT DOMAIN
dig +short TXT _dmarc.DOMAIN
```

| Check | How | Say in the report | Fix follows |
|---|---|---|---|
| Ownership and logins sheet | Ask whether one exists: who holds each login and created each account | "Without a list of who holds each login, a lost password or a departing helper can lock you out." | `08-launch.md` "Client handover" |
| Two-step sign-in on vendor accounts | Ask, for the domain, GitHub, HighLevel, payments and Google accounts | "Two-step sign-in stops a stolen password from opening your accounts." | `08-launch.md` "Client handover" |
| Backups and exit plan | Ask whether they know what backups AI Studio keeps and how to export | "Your site's database sits in AI Studio's account, so knowing how to export it is your way out." | `08-launch.md` "Client handover" |
| Email records: SPF, DKIM, DMARC | The `dig` lines show SPF and DMARC. DKIM needs the selector from HighLevel's sending-domain settings; without it, mark DKIM unverified | "Without these records, email from your domain is more likely to land in spam or be faked." | `08-launch.md` "Ongoing care" |
| Uptime and form-failure alerts | Ask; code: what happens when a form send fails | "If the site or a form breaks, nobody is told." | `08-launch.md` "Ongoing care" |
