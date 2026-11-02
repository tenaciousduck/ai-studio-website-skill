---
name: building-ai-studio-websites
description: Use when planning, starting, building, optimizing or launching a website made in GoHighLevel (GHL, HighLevel, LeadConnector) AI Studio, for any type of business, or when a repo has .vibe/project.json, @leadconnector/vite-tanstack-config or src/integrations/payments. Also use when such a site needs a sitemap, admin editor, checkout, CRM forms, consent, cookie notice, terms of sale, privacy page, image, font, JavaScript or SEO work, or AI Studio shows "Diverged".
---

# Building AI Studio Websites

## Overview

AI Studio makes a working site quickly, then Claude does the real build from the GitHub repo. This skill holds what one full build taught: what the platform can't do, what only looks finished, and what must be proven on the live site.

**Core principle:** a site is done when the live site proves it, not when the code looks right.

"AI Studio" here means HighLevel's builder, not Google AI Studio. Platform facts come from one project, last checked October to November 2026, so re-check anything that decides a design. "The first site" means that project, an author's site selling one personalized product. Apply the idea, not its details. This works for any business. The "builder" is the person using this skill, and the "client" is whoever owns the site, who may be the same person.

## First, in every project

1. **Read the builder's settings.** Look for `.claude/ai-studio-setup.md` in the project, then `~/.claude/ai-studio-setup.md`. If neither exists, offer to fill in `setup-template.md` with the builder and save it to the second path. It holds their name, approvals, wording for the platform and how much explanation they want. Don't store it inside this skill's folder, because plugin updates replace that folder.
2. **Check the required skills.** This skill needs superpowers: `superpowers:brainstorming`, `superpowers:writing-plans` and `superpowers:subagent-driven-development`. If it's missing, tell the builder to run `/plugin install superpowers@claude-plugins-official`. If they decline, follow the same steps by hand: discovery, spec, plan, review.
3. **Choose the depth,** and say which and why.

| Depth | Use when | Process |
|---|---|---|
| Light | No payments or accounts, content rarely changes, and at most a simple contact form | One concept round, short spec, mockup of the home page and one inner page, reviews inline |
| Standard | Owner-edited content, repeating items, or CRM workflows beyond a simple contact form | Two concept rounds, a mockup per template, spec and plan, a separate reviewer on risky tasks, one whole-branch review |
| Full | Takes money, holds sensitive details, or serves a regulated audience | A mockup of every page, a builder and reviewer per task, accessibility pass, whole-branch review, terms of sale, hosted test list |

The highest row that matches wins. Every depth keeps the quality work: images, fonts, SEO, a truthful privacy page, a cookie check and live checks. These are judgment calls, and the setup file or the builder can override them.

## Stages

Read the chapter for the stage you're in. Don't load them all at once.

| Stage | Read | Done when |
|---|---|---|
| 1. Start a project | `references/01-kickoff.md` | Repo runs locally, sealed files listed, capability answers recorded, `docs/STATUS.md` exists |
| 2. Discovery and sitemap | `references/01-kickoff.md`; if selling, the limits table in `references/07-commerce.md` | Ranked site jobs, admin decision, any checkout route, sitemap table and spec approved |
| 3. Design | `references/03-design.md` | Mockups approved at the chosen depth, with real assets |
| 4. Build | `references/02-platform.md`, `references/04-admin.md` | Each task reviewed; everything the client needs to change is editable or has a stated route |
| 5. Forms and selling | `references/06-forms-consent.md`, `references/09-legal.md`; if selling, `references/07-commerce.md` | Every form reaches the CRM. If selling, the full flow passes in test mode on the hosted site, with terms and privacy published before Payments goes live |
| 6. Quality | `references/05-performance-seo.md` | Goals met from day one, or a stated reason for each miss |
| 7. Launch | `references/08-launch.md` | Checklist evidence recorded on the live site |

## Rules that hold in every stage

1. **Stack and ownership:** read `references/02-platform.md` before changing database schema, payments, generated files or sync settings.
2. **Never force push or rewrite pushed history.** If AI Studio shows "Diverged", the answer is New branch, never Force push. Before saying a merge reached AI Studio, confirm it.
3. **Schema changes go through AI Studio's Cloud migration tool**, using a strict prompt from `references/prompts.md`. A file dropped in `supabase/migrations/` does nothing.
4. **Never edit sealed folders**, such as `src/integrations/payments/`. Build the page around them.
5. **Treat AI Studio's answers, outside reports and your own notes as claims.** Check code, then the live site, before relying on them.
6. **Check saved content before changing wording.** Text saved in the admin beats the code default.
7. **Real data, real money and real contacts need care:** back up before database edits. Stub form sends while building. The builder types their own passwords, publishes, and switches payments to live. Merges to `main` and database changes follow the setup file, and default to asking first.
8. **Never invent content.** No fake reviews, quotes, stats or sample text on a public page. Search what AI Studio generated for filler before launch.
9. **Compare before and after.** For any "nothing should look different" change, run `tools/page-audit.mjs` on both versions and `tools/page-compare.mjs` on the results.
10. **Mark every recommendation** as best practice or judgment call, and every result as measured, estimated or unverified.
11. **Legal pages describe what the site really does.** Test it on the live site, and never offer a choice that changes nothing. The client decides refunds, seller details and legal review; Claude drafts and doesn't invent them. This skill isn't legal advice.

## Reusable parts

- `tools/`: page audit and compare, SEO check, cookie check, Lighthouse summary. Run them from this skill's folder, and keep their output in the session scratchpad. Usage is at the top of each file. They need Node 22+ and Google Chrome; outside macOS, set `CHROME_PATH` to Chrome's location.
- `templates/`: working code from one live site, to adapt and test: image pipeline, responsive image component, upload shrinking, server-side CRM forms, request memo, cookie notice, sample terms, and the code that keeps the sign-in toolkit off public pages. Read `templates/README.md` before copying.

## Common mistakes

| Mistake | What happened on the first site |
|---|---|
| Treating AI Studio's first version as real content | It shipped invented praise and sample text |
| Building from mockup data | The site matched the mockups only in test data; the live database still held old content |
| Assuming a product setting reaches the checkout | Shipping rates sat on the product, but the checkout never charged them |
| Testing on localhost only | Checkout security won't load there; hosting and caching differ |
| Trusting an event because the server said "ok" | Sign-ups never reached the CRM until a live check caught it |
| Chasing a score | Some of the remaining PageSpeed delay exists only inside its test |
| Offering a cookie choice without testing it | "Essential only" changed nothing, and the host's visit cookie ran for everyone |
| Leaving terms until last | The checkout was live with no terms, and new terms can't bind earlier orders |
| Building an admin by default | Ask first: an admin adds sign-in, database rules and testing that a rarely changed site doesn't need |
