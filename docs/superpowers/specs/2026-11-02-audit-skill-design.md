# Audit skill, opener and session phases: design

Date: 2026-11-02. Status: draft for the owner's review.

## Intent

The plugin today helps someone build a new site in HighLevel's AI Studio. Most people who need help already have a site: AI Studio made it quickly, and it has the problems one full production build found the hard way. These include slow images and fonts, made-up reviews, forms that look fine and never reach the CRM, a checkout with no terms, and a privacy page that doesn't match what the site does.

This adds an **audit skill** that checks an existing AI Studio site against everything that build learned, explains the results in plain English, and then repairs the site in safe phases. Any business can use it, whatever the site is for.

The people running it are business owners, not developers. They can use GitHub and AI Studio, but they don't know what "Largest Contentful Paint" means and shouldn't have to. Every output is short, in plain English, and says why it matters to their business.

Two changes come with it, for both skills:

- **An opener:** a short, plain introduction every time either skill starts, saying what to expect.
- **Session phases:** clear instructions on which session to run, what it ends with, when to wait and when to start the next one.

## Goals

1. One install gives both skills: build a new site, or audit and repair an existing one.
2. The audit covers every area the first build touched: speed, design and usability, SEO and AI crawlers, truthful content, forms and CRM, selling and checkout, legal and privacy, platform health, admin, and launch and care.
3. The report is something an owner can read alone and act on: what's wrong, why it matters, how sure we are, what fixing it takes, and who does it.
4. Repairs happen in phases, one session per phase, using superpowers agents, with the same review and live-check standard as a build.
5. Owners know why the default is thorough, and how to turn the checking down if they want it cheaper or faster.
6. Platform facts stay dated and honest: "this is how AI Studio worked when last checked".

## Non-goals

- Building CRM workflows for the owner. The audit checks forms and teaches a standard; it doesn't build GHL automations.
- Auditing sites not made in AI Studio. The checks may partly work elsewhere, but nothing promises that.
- Legal advice, or a lawyer's review. Same disclaimer as the build skill.
- A paid or hosted service. This stays a free, open plugin.
- Support for owners without GitHub. GitHub connected to AI Studio is assumed.

## Anti-goals (failure even if it technically works)

- A report full of jargon or scary scores, like the sales-style audits the first build had to debunk.
- Changing anything during the audit session. It's read-only until the owner picks repairs.
- Inventing findings, numbers or certainty. Every finding is marked measured, estimated or unverified.
- Real-world side effects without asking: a form test that creates a real contact or a task for the owner, a purchase, a publish.
- Any trace of the first site's owner, its content, or the plugin author's business in the public plugin.
- Repairs that break the AI Studio sync: force pushes, edited sealed folders, schema changes outside AI Studio's migration tool.

## Constraints

- Lives in the existing public repo `ai-studio-website-skill`, as a second skill in the same plugin. There's one copy of shared knowledge, with no duplicate chapters that can drift apart.
- Follows the existing rules in `building-ai-studio-websites/SKILL.md`, rules 1-11. The audit doesn't restate them; it points to them.
- Reads the same setup file (`.claude/ai-studio-setup.md`, then `~/.claude/ai-studio-setup.md`) for the owner's name, approvals, platform wording and explanation level.
- Requires superpowers, like the build skill, and degrades the same way if it's missing.
- The checking tools need Node 22+ and Chrome, as now.
- Skill descriptions follow the superpowers writing-skills rules: they say when to use the skill, not what it does.

## Decided

These come from the conversation. They're the owner's decisions.

### Who and what

- Anyone with an AI Studio site, for any business or purpose, built for themselves or for someone they know.
- They run the audit skill, not the build skill. It's a separate entry point in the same plugin.
- It covers everything learned on the first build, reworded to fit any purpose. Areas that don't apply are skipped, with one line saying why.
- The owner reads the report themselves, so it's written to them.
- **A narrow request gets a single-area audit.** "My contact form isn't reaching GHL" or "add a sitemap" on an existing site runs the audit for that one area only: the same checklist section, a short report for that area, then one repair session. A full audit stays available and is offered once at the end. The build skill handles brand-new sites and new features.

### Speed

- Runs a real PageSpeed or Lighthouse test, then explains each slow number in plain words.
- Covers image size and format, self-hosted fonts, script size, and animations or effects that hold up loading.
- Diagnoses time to first byte (how fast the server answers) and Largest Contentful Paint (how fast the biggest thing on screen appears), and says what's causing each and what would help.

### Design and usability

- Covers mobile layout, accessibility, the generic AI look, and clear calls to action.
- Recommends the design skills that worked on the first build (`avoid-ai-design`, `design-taste-frontend`, `web-design-guidelines`, `frontend-design`), with a clear note that they're optional and the owner can override them, depending on how much design freedom they want.

### SEO and AI crawlers

- Checks the sitemap, structured data, alt text and Search Console setup.
- Covers files for AI bots, re-checked each run because the facts move fast:
  - **robots.txt rules for AI bots** are the control that works. Letting AI search and training bots in is the owner's choice, so the audit explains the trade-off and asks.
  - **llms.txt** is optional and cheap, with little evidence yet that AI crawlers read it. It's offered as an option, never presented as required.

### Forms and CRM

- Checks that forms really reach the CRM.
- Includes a short owner-facing guide, not a builder: when to use a custom field, a tag, a workflow or a note. It covers naming, the consent layers, and how site forms connect to GHL. It's based on the standard in `references/06-forms-consent.md`, with no real data from any site.

### Honesty

- Every finding is tied to how AI Studio works today, including its limits, with the date the facts were last checked.

### GitHub and branching

- Assumes GitHub is connected to AI Studio and the owner knows the basics.
- Adds plain branching guidance: one branch per phase, reviewed before it reaches `main`, the "Diverged" rule (New branch, never Force push), and no next phase until the last merge has reached AI Studio and been published.

### Sessions and phases

- One session per phase, with superpowers agents doing the work inside it, the same way the first site was built.
- Both skills tell the owner, in simple instructions, which session to run, what it ends with, when to wait and when to start fresh.
- Run one session at a time, not several in parallel. *Builder's call, not the owner's; kept because it's easier to follow.*

### Concept mockups in repairs

Added 2026-11-03.

- Before any repair that visibly changes a page, Claude offers concept mockups and advises yes. Examples: a layout change, a reworked call to action, a new cookie notice or terms step.
- The mockups show the current page and the proposed version side by side, in the project's `design/concepts/` folder, following the build skill's `03-design.md`. Nothing is built until the owner picks.
- The owner can skip them.
- Fixes meant to look identical skip mockups automatically, such as images, fonts and speed work. Those use the page-audit before-and-after comparison instead.
- The build skill is unchanged: its concept rounds and mockups stay required, at the chosen depth.

### Quality dial

- Each skill explains why it checks so much: more checking costs more usage and time, but catches what a single pass misses.
- It also explains how to turn the checking down.

### Opener

- A short plain-English introduction every time either skill starts: what this is, what will happen, what the owner will be asked to do, and how to change the pace. It's concise.

## Design

### Plugin layout

```text
skills/
  building-ai-studio-websites/      existing; gains the opener and a phases section
    SKILL.md
    references/ ...                 shared chapters, one copy
    tools/ ...                      shared tools, plus the new ones below
    templates/ ...
  auditing-ai-studio-websites/      new
    SKILL.md
    references/
      audit-checklist.md            every check, by area
      report-template.md            the owner's report
      crm-guide.md                  owner-facing CRM standard, plain English
shared/
  opener.md                         one opener for both skills
  sessions.md                       phases, waiting, branching, quality dial
```

The audit skill points to the build skill's chapters and tools by relative path (`../building-ai-studio-websites/references/...`). Builder's call: keep it this way, or move shared chapters and tools to a plugin-level folder. Either way there's one copy, and both skills reach it. Confirm that relative paths resolve once the plugin is installed from the marketplace, not just from the local folder.

### The opener (`shared/opener.md`)

It's shown at the start of every run of either skill, once per session. Target: under 150 words on screen. It covers:

1. What this does, in one line. For example: "I'll check your site against what one full AI Studio build learned, explain what I find in plain English, then fix it in steps you approve."
2. The phases ahead, as a short numbered list, with which one this session is.
3. What the owner will do: answer a few questions, approve changes, publish in AI Studio, and make any GHL or business decisions.
4. The pace: thorough by default, and why, in one sentence. Say "lighter checks" to go faster.
5. Where progress is kept: `docs/STATUS.md`, so any new session picks up without re-explaining.

If the setup file says the owner wants less explanation, the opener shrinks to two lines.

### Sessions and phases (`shared/sessions.md`)

Each phase is one session, and each ends the same way:

- Work merged or ready to merge on its own branch.
- `docs/STATUS.md` updated.
- A plain summary for the owner.
- **A ready-to-paste line to start the next session.** For example: "Start a new session and say: *Continue the AI Studio audit: repair phase 2, content.*"

**Audit phases:**

| Phase | Session | Ends with |
|---|---|---|
| 1 | Audit (read-only) | The report, a suggested repair order, and the next session's line |
| 2+ | One repair session per area, safest and highest value first. Default order: speed and SEO, then truthful content, then design and usability, then forms and CRM, then selling and legal, then platform and care | A reviewed branch, merged following the setup file. The owner publishes, then a live check |
| Last | Re-check | The audit re-run, with before and after numbers |

The owner can reorder or skip repair phases. Urgent findings, defined under Report, may jump the queue.

**Single-area audit:** two sessions. First, the audit for that one area, with a short report. Second, its repair, ending with a live check and the offer of a full audit. If the problem is small and clear, both can happen in one session, with the owner's agreement. Urgent findings spotted outside the area in passing are mentioned in one line, not audited.

**Build phases:** the build skill's seven stages, grouped into sessions:
1. Start and discovery
2. Design
3. Build, which may take several sessions, one per plan chunk
4. Forms and selling
5. Quality
6. Launch

The phases map onto the stages already in `SKILL.md`; nothing new is invented.

**When to wait:**
- While a merge syncs to AI Studio.
- While the owner publishes.
- When Claude has asked a question.
- After a publish, until the live check has run.

**When to start a new session:**
- When a phase is merged, published and checked.
- When switching areas.
- When a session has grown long. Claude says so, and gives the line to continue.

**Branching, in plain words:**
- One branch per phase, named for it (for example `repair/speed-seo`).
- Nothing reaches `main` without review.
- "Diverged" means New branch, never Force push.
- Never start a phase on top of unpublished work.

**Quality dial:** it sits on top of the build skill's depth table rather than replacing it. *Builder's call.* Depth (Light, Standard, Full) still picks a build's process, and the dial can only turn checking down from there. Audits and repairs use the dial's default.

- **Default:** a separate reviewer agent per task, a whole-branch review, three Lighthouse runs, an accessibility pass, and live checks after publishing.
- **Why, in one or two sentences:** single passes missed real problems on the first build. Review caught them: an accessibility pass found issues the task reviews missed, and only a live check showed sign-ups weren't reaching the CRM. Thorough costs more usage and time and gives better, safer results.
- **Lighter,** if the owner says "lighter checks" or the setup file says so:
  - Inline reviews instead of a separate reviewer per task.
  - One Lighthouse run.
  - An accessibility spot check.
  - The report gets a line saying the checks were lighter.
- **Never dialed down:**
  - Live checks on forms and payments.
  - Read-only audit.
  - No force push.
  - Sealed folders untouched.
  - No invented content.
  - Legal pages that match reality.
  - Asking before anything with real-world effects.

### Audit session flow

1. Opener. Read the setup file, and check superpowers is installed.
2. **Intake, a few questions only.** Some can be answered from the repo and live site, so ask only what code can't answer:
   - What the site is for.
   - Who it serves and in which countries.
   - Whether it sells anything.
   - Which forms matter.
   - Whether there's an admin.
   - What the owner most wants improved.
3. **Confirm the stack** matches what the chapters assume (`02-platform.md`: `.vibe/project.json`, package versions). If it doesn't, say which checks may not apply.
4. **Run the checks** in `audit-checklist.md`, against the live site and the repo. Read-only:
   - No commits.
   - No form submissions.
   - No purchases.
   - No database writes.
5. **Live form test, only with permission.** *Builder's call.* Before asking, Claude says plainly what will happen:
   - A real contact will be created.
   - The owner's workflows will run on it, including emails and any task for the owner.
   
   The test:
   - It uses the owner's own address with `+sitetest1`, so any email lands in their inbox.
   - The owner reads the contact back in GHL using short written steps from Claude: tags, fields, note, source, any task. Then they tag it `sys:test-record` and delete it.
   - Claude may drive the owner's signed-in GHL in a browser instead, or use a GHL connector, only if the owner prefers that.
   
   If permission isn't given, mark forms "checked in code only".
6. **Write the report** from `report-template.md` to `docs/audit/YYYY-MM-DD-audit.md` in the site repo. Store raw tool output in the session scratchpad, not the repo. *Builder's call:*
   - The audit session doesn't commit. The first repair session commits the report and `docs/STATUS.md` as its first commit, so they reach git through review like everything else.
   - Docs-only commits don't count as "unpublished work" under the branching rule, because they don't change the live site.
   - **If the site repo is public,** the report lists weaknesses an attacker could use. Save it instead to an ignored `.audit/` folder, add that folder to `.gitignore`, and tell the owner why.
7. **Walk the owner through the top findings in chat,** briefly. Agree the repair order, record it in `docs/STATUS.md`, and give the line for the first repair session.

### Repair session flow

1. Opener, then read `docs/STATUS.md` and the report.
2. Take the next area's findings. Use `superpowers:writing-plans` for anything beyond a few lines. Execute with `superpowers:subagent-driven-development`, at the quality dial's level.
3. Fix using the build skill's chapters and templates. Each fix links to the chapter it follows.
4. For "nothing should look different" fixes such as images, fonts and scripts: run page audit and compare, before and after (rule 9).
5. Branch, review, merge following the setup file. The owner publishes, then the live check runs.
6. Update the report: mark each finding fixed, with evidence. Update `docs/STATUS.md`. Give the next session's line.

### What the audit checks (`audit-checklist.md`)

Each check lists:
- What's checked.
- How: tool, code or live.
- Its plain-English explanation.
- The chapter the fix follows.

Areas and their main checks:

**Speed** (`05-performance-seo.md`, `tools/lighthouse-summary.mjs`, `tools/page-audit.mjs`)
- Page weight.
- Score, time to first byte, Largest Contentful Paint, layout shift and blocking time, against the targets table.
- What the largest element is, and what delays it.
- Image format, size and `srcset`.
- Fonts from third-party hosts.
- Third-party scripts in first paint.
- The sign-in toolkit loading on public pages.
- Heavy animation libraries on public pages.
- Cache headers on assets, fonts and images.
- Explains Lighthouse's lab delay honestly ("don't chase what real visits don't show").

**Design and usability** (`03-design.md`)
- Sideways scroll at 360px.
- Button size and contrast.
- Skip link.
- Focus after pop-ups.
- Form errors.
- Repetitive sections.
- Unclear or competing calls to action.
- The generic AI look, if the owner wants that review.
- Recommends the optional design skills, with the override note.

**SEO and AI crawlers** (`05-performance-seo.md`, `tools/seo-check.mjs`)
- Title, description, canonical, one `h1`, share image.
- Sitemap entries that redirect or are missing.
- robots.txt.
- Real 404s.
- Tracking-tagged addresses.
- Structured data validity and truth.
- Alt text, with deliberate empty alts recognized.
- Search Console setup (ask).
- Local business details where relevant.
- Security headers.
- AI bot rules in robots.txt, and llms.txt presence, explained as a choice.

**Truthful content** (rule 8, `08-launch.md`)
- Invented reviews, quotes, stats and sample text.
- Placeholder links and `example.com`.
- Content saved in the admin as well as the code.
- Promises the business can't keep.

**Forms and CRM** (`06-forms-consent.md`, new `crm-guide.md`)
- The event type spelling: the silent-loss bug.
- Success shown only after the server confirms.
- Server-side sending.
- Spam protection.
- Double-submit protection.
- Consent boxes unticked, with the exact wording sent.
- Sender line.
- Duplicate-contact setting (ask).
- Then the owner-facing guide.

**Selling and checkout**, if the site sells (`07-commerce.md`, `09-legal.md`)
- Shipping actually charged, or stated as included.
- Terms box before payment.
- Seller details above the checkout.
- Quantity limits.
- Tax setting matches the page (ask).
- Card statement name (ask).
- Confirmation email contents (ask).
- Recurring payments flagged as untested.

**Legal and privacy** (`09-legal.md`, country notes, `tools/cookie-check.mjs`)
- Privacy page matches the cookie check and the data the site really collects.
- Terms exist if selling.
- No cookie choice that changes nothing.
- No public compliance claims.
- Refund wording.
- The decisions the owner must make, listed, not answered.

**Platform health** (`02-platform.md`)
- "Diverged" status (ask).
- Edits inside sealed or generated folders in git history.
- Migration files that never ran.
- Secrets in `.env`.
- `src/start.ts` rewritten.
- Build passes.

**Admin**, if present (`04-admin.md`)
- The first-editor claim is closed.
- Admin pages are `noindex`.
- Saved text overriding the code is noted, so repairs don't miss it.

**Launch and care** (`08-launch.md`)
- Ownership and logins sheet.
- Multi-factor sign-in on vendor accounts (ask).
- Backups and exit plan.
- Email records: SPF, DKIM, DMARC.
- Uptime and form-failure alerts.

### The report (`report-template.md`)

Written to the owner, in plain English, short. It contains, in order:

1. **Summary:** three to five sentences on the state of the site and the most important fix.
2. **Scorecard:** one row per area. The status is Good, Needs work, Urgent or Not applicable, each with one plain line.
3. **Fix first:** up to five findings.
4. **Findings by area.** Each finding has:
   - What we found.
   - Why it matters to your business.
   - How sure we are: measured, estimated or unverified.
   - Effort: small, medium or large.
   - Who fixes it: a repair session, you in GHL or AI Studio, or your accountant or lawyer.
   - Best practice or judgment call.
5. **Only you can do these:** settings and decisions outside the code.
6. **What we couldn't check,** and why.
7. **Today's numbers:** a baseline table for the re-check.
8. **Repair plan:** the phases in order, each with its ready-to-paste session line.
9. Footer:
   - Platform facts last checked on a date.
   - Lighter checks used, if so.
   - Not legal advice.

**Severity:**
- **Urgent:** costing leads, money or trust now, or legal exposure now. Examples:
  - Forms not reaching the CRM.
  - A checkout with no terms.
  - Invented reviews.
  - An unclaimed admin.
  - A cookie choice that changes nothing.
- **Important:** a real weakness, not costing anything yet.
- **Nice to have.**

### CRM guide (`crm-guide.md`)

A plain-English page, no more than one or two screens. It covers:
- Fields hold the current value.
- Tags record what happened.
- Workflows do things.
- Notes keep proof.
- Naming conventions (`namespace:thing`, `LANE-NN · Purpose`, folders).
- The three consent layers.
- Testing without junk contacts.
- Why a form appears in GHL's trigger list only after one real submission.

It's drawn from `06-forms-consent.md`, written for owners. The audit links to it and may copy it into the site repo's `docs/` if the owner wants.

### New and changed tools

- **`tools/content-check.mjs`** (new): scans the repo and the live HTML for filler and invented content. That includes lorem ipsum, placeholder names and links, star-rating blocks without a real source, round-number stat claims, and `example.com`. It reports candidates for a person to judge, never verdicts.
- **`tools/seo-check.mjs`** (extend): reports robots.txt rules for known AI bot user agents, whether llms.txt exists, and the common security headers.
- **Optional runner** (builder's call): one command that runs the read-only tools in sequence into the scratchpad. Only if it stays simpler than calling them directly.
- The existing tools are unchanged otherwise.

### Changes to the build skill

- Show the opener at start.
- Add a short "Sessions and phases" section pointing to `shared/sessions.md`.
- Point to the quality dial.
- Narrow its description so audits trigger the audit skill. Today it includes "optimizing" and specific fixes such as image, font, SEO and "Diverged" work, which would catch audit requests.
  - **The build skill covers:** new builds and adding new features.
  - **The audit skill covers:** checking, reviewing, fixing or improving an existing site, whole or one area.
  - Test both against overlapping phrases: "make my site faster", "add a sitemap", "my form isn't reaching GHL", "AI Studio says Diverged".

### README and version

- README: describe both skills, the opener, phases, and the quality dial in a few lines each, with an "Audit an existing site" quick start.
- Bump the plugin to 0.2.0, and run `claude plugin validate .`.

## Testing

1. **Skill tests (writing-skills):**
   - Baseline subagent runs without the audit skill, on a sample site description, to see what an audit misses or gets wrong.
   - Then with it. Check the results are plain English, read-only, honestly marked, cover every area, and skip correctly.
   - Trigger tests on overlapping phrases, for both skills.
2. **Control run on a clean site:** run the audit read-only against the first build's live site. It should come back mostly good, and should find that site's known remaining gaps (an LCP above target, no security headers, a static sitemap, Search Console not set up). This proves it finds real issues and doesn't invent them.
3. **Real test, later:** an AI Studio site that hasn't been cleaned up, ideally straight from AI Studio's first version, audited and then repaired through at least two phases.
4. Control-run and real-test results stay out of the public repo.

## Left to the builder

- Exact wording of the opener, the session lines and the report text, within the length limits above.
- Whether shared chapters stay in the build skill's folder or move to plugin level.
- Whether to add the optional runner.
- Patterns for `content-check.mjs`, as long as it reports candidates rather than verdicts.
- How to split `audit-checklist.md` if it grows past a comfortable length.
