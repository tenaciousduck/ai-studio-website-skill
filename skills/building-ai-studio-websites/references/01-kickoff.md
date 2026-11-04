# Kickoff, discovery and sitemap

## Contents
- In AI Studio, before Claude
- First session in the repo
- Capability questions
- Discovery question bank
- Sitemap table
- Spec outline
- Build order

## In AI Studio, before Claude

Use AI Studio for the scaffold, not the finish. Its value is the things that are hard to add later. `prompts.md` has a first prompt.

1. Create the project. Enable **Cloud** (database, sign-in, file storage) if the site needs an admin, uploads or stored content.
2. If the site needs an admin (`04-admin.md`), build a basic `/auth` and `/admin`, so the editor gate exists.
3. Enable **Payments** only if the site sells something, and add one product.
4. Enable **form tracking** if the site has forms, so `src/lib/tracking.ts` exists with the project's ids.
5. Connect a **private** GitHub repo. A font license may require it to stay private.
6. Stop spending time on design there. Rework happens in Claude.

## First session in the repo

- Clone to a local folder that no cloud service syncs. iCloud sync created ` 2` duplicate files on the first site.
- Install with `npx --yes bun install --frozen-lockfile`. The repo uses Bun's lockfile. Check `bunfig.toml`: new package versions are held back for 24 hours on purpose.
- Read `AGENTS.md`, `.vibe/project.json`, `vite.config.ts`, `package.json` and `src/routes/README.md`.
- List sealed and generated files: anything marked "Do not edit" or "automatically generated". Add them to the project's `CLAUDE.md`.
- Put `.claude/launch.json` in the folder the app opens, with `npm --prefix <repo>` if the repo sits below it. Name a server per purpose: dev, fixtures, production build, real database.
- Create `docs/STATUS.md`, `docs/OPEN-ITEMS.md` and a project `CLAUDE.md`. Save key facts to memory.
- Add the test workflow from `templates/github/ci.yml`, so a break gets caught on every pull request. It's unproven on AI Studio, so check it passes before relying on it.
- Format only files you create. `main` isn't Prettier-clean, so `prettier --write` on an existing doc rewrites the whole file.
- Read what AI Studio generated and flag invented content, placeholder links and wrong dates or statuses. Tell the builder what you found.

## Capability questions

Ask before designing anything that depends on the answer. Paste them into AI Studio's chat with "Answer only, change nothing". Then verify the answers: read the sealed contract, or test on the hosted site.

- Which stack and template is this? (Assume nothing carries over between projects.)
- Can the checkout: add shipping, collect a separate shipping address, ask a custom question, limit quantity, limit countries, limit orders per buyer, report remaining stock, add tax, show a terms box, take a deposit, sell variants or subscriptions?
- Which payment methods are on, and do any redirect the buyer away?
- Can the host's visit statistics be turned off, and how long are they kept?
- Do test and live modes share product and price ids?
- Which custom fields can the form connection register?
- Is there a preview address that behaves like the live host?

Record each answer in the spec, with its source and date.

## Discovery question bank

Ask one at a time. Skip what the brief already answers.

**Purpose**
- What are the site's jobs, in ranked order? When two jobs compete on a page, which wins?
- What counts as failure even if everything technically works?
- What's the deadline, and is it fixed?

**Audience**
- Who visits, and from where? (Social links usually mean phones first.)
- Are minors or regulated audiences involved?
- Which countries do customers live in? This sets privacy, tax and anti-spam rules.

**Content**
- What real text, photos, reviews and proof exist? What's missing, and who supplies it by when?
- Are there words or facts that must never appear? (Unreleased details, competitor names, vendor names, legal claims.)
- What does a person see before any content exists? Hide empty sections rather than fill them.
- Should decorative images be described or left blank? Blank is accessibility best practice. Described satisfies outside SEO checkers. See "SEO foundations" in `05-performance-seo.md`.
- Do they want an `llms.txt` summary for AI tools? It's optional; see the same section.

**Editing**
- Who edits the site, and how technical are they? What will they change weekly, yearly, never?
- Does it need an admin at all? Work through the questions at the top of `04-admin.md` before scoping one.
- Who else needs access? Is one editor enough?

**Growth**
- What will repeat? A second product, location or service should be a form entry, not a redesign.

**Selling and leads**
- What's sold, for how much, to where, and is it one-off or recurring? Who fulfils it, and where do they work (CRM, inbox, spreadsheet)?
- What happens on a refund, a cancellation, or an order or booking that can't be filled?
- If shipping goods: who pays import duties, which carrier, and is it tracked?
- If it's a service, booking or membership: what's the cancellation rule, and is the price recurring?
- Who is the legal seller, and is that the name on the Stripe account? Is the public name a trade name?
- What are the sender's mailing address, contact email and any public phone number?
- Is the seller registered for tax? What will the card statement show?
- Will a lawyer read the terms and privacy page? The client decides. See `09-legal.md` for the full list.
- Which contacts may receive marketing, and on what basis?

**Identity**
- What's the domain, and is it bare or `www`? Which one is official?
- Which brand assets exist? Are any fonts licensed, and may they be self-hosted?
- Show three sites they like. What exactly do they like?

## Sitemap table

Produce this before mockups. Every page earns a row.

| Route | Purpose | Main action | Content from | Editable in admin | In sitemap | Search-indexed |
|---|---|---|---|---|---|---|
| `/` | Identity plus top job | | | | yes | yes |
| `/<items>` | Index of products or services | | | | yes | yes |
| `/<items>/$slug` | One template per item | | | | yes | yes |
| `/about` | Trust | | | | yes | yes |
| `/contact` | Reach a person | | | | yes | yes |
| `/<signup>` | Focused landing page for social bios, no site chrome | Sign up | | | yes | yes |
| `/privacy` | What's collected and who handles it | | Code | no | yes | yes |
| `/terms` | Rules of sale, if the site sells anything | | Code | no | yes | yes |
| `/auth`, `/admin` | Editor, only if needed | | | n/a | no | no |

Decide these up front:

- Each public page's single main action.
- What's in the nav and footer, and what's reachable only from elsewhere.
- Which actions open a pop-up, and which go to a page. A step with its own decision, such as checkout, deserves a page.
- Redirects from any old addresses.

## Spec outline

Intent with ranked jobs · goals, non-goals, anti-goals · constraints · decisions made and by whom · sitemap · visual system · templates · data model · release or date logic · forms and consent · admin scope · content cleanup · phasing · open items only the client can answer.

Mark each of your own calls "(my call)", so the builder can challenge it.

## Build order

1. Groundwork with no visible change: any schema and data model, pure logic, tests.
   Include the search groundwork here, because retrofitting it took three rounds on the first site: `SITE_URL`, canonical and hreflang in the root route, the security headers in `src/server.ts`, the generated sitemap (and `llms.txt` if wanted), structured data in one tested file, and a test pinning the home description's length (`05-performance-seo.md`, "SEO foundations").
2. Mockups at the chosen depth, approved (`03-design.md`).
3. Any schema through AI Studio, then visible tasks, with a local test-data switch if content lives in the database.
4. If there's an admin, its fields alongside each section, not at the end.
5. Whole-branch review, accessibility pass, one fix wave, re-review.
6. Merge. If content lives in the database, enter it, then run a parity check against the mockups.
7. Commerce and forms, tested on the hosted site, with terms and privacy published before Payments goes live (`09-legal.md`).
8. Launch checklist.

Match reviews to the site's depth (`SKILL.md`). Log rulings and deferred findings in a ledger. Update `docs/STATUS.md` whenever a milestone lands, because a session can end without warning.
