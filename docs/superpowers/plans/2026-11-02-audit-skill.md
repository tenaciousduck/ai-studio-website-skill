# Audit Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an audit-and-repair skill to the `ai-studio-websites` plugin, plus a shared opener, session phases and a quality dial used by both skills, and release it as 0.2.0.

**Architecture:**
- The new skill `skills/auditing-ai-studio-websites/` holds only what's audit-specific: the flow, checklist, report template and CRM guide.
- For everything else it points to the build skill's existing chapters and tools by relative path.
- Text both skills share lives once, in `shared/` at the plugin root.
- The two new checks become small pure modules with `node:test` tests, wired into the command-line tools.

**Tech Stack:**
- Markdown skills.
- Node 22+ ES modules, built-ins only, with no npm dependencies.
- `node --test`.
- The `claude plugin validate` command.

**Spec:** `docs/superpowers/specs/2026-11-02-audit-skill-design.md`. Read it before any task. It holds the owner's decisions and the reasons behind them.

## Global Constraints

- Every word a site owner sees is plain English, short, and says why it matters to their business. Explain any technical term on first use.
- The plugin is public and generic.
  - No trace of the first site, its owner, its content, or the plugin author's business.
  - Say "an earlier full AI Studio build" for where a lesson came from.
- Skill frontmatter `description` says only when to use the skill ("Use when…"), never what it does or its steps.
- Platform facts carry a "last checked" date. Write "AI Studio as last checked", never "AI Studio can't" without a date.
- Mark every recommendation as best practice or judgment call.
- Mark every result as measured, estimated or unverified.
- Not legal advice. Keep the existing disclaimer wording, and never claim compliance.
- Tools:
  - Node 22+ and Chrome only, with no npm dependencies.
  - Usage goes in a comment at the top of each file, like the existing tools.
  - Filler detection reports candidates, never verdicts.
- The opener stays under 150 words on screen.
- The audit `SKILL.md` stays at or under 700 words. Detail goes in `references/`.
- These can never be dialed down:
  - Live checks on forms and payments.
  - The read-only audit session.
  - No force push.
  - Sealed folders untouched.
  - No invented content.
  - Legal pages that match reality.
  - Asking before anything with real-world effects.
- If git fails on macOS because the Xcode license isn't accepted, use the Command Line Tools git instead.
- Work on branch `feat/audit-skill`. Never push without the owner's go-ahead.
- Conventional commits, each ending with:

  ```text
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```

## Review Focus

1. **A site that serves its app shell for unknown addresses.** `/robots.txt` or `/llms.txt` answers 200 with an HTML page. Expected: reported as missing, not present. Test in Task 1.
2. **Real-world robots.txt.** Windows line endings, comments, several `User-agent` lines sharing one group, mixed case, `Allow` after `Disallow`. Expected: each AI bot's access is read the way a crawler would read it. Tests in Task 1.
3. **Legitimate content that looks like filler.**
   - A business really called "Example Bakery".
   - A sourced review.
   - A one-line minified bundle.
   
   Expected: shown as candidates with a short excerpt (120 characters at most) for a person to judge, and generated and dependency folders skipped. Tests in Task 2.
4. **A repo that isn't the stack the chapters assume.** No `.vibe/project.json`, or a different template. Expected: the audit says which checks may not apply before running them. Scenario in Task 8.
5. **Areas that don't apply, and permissions refused:**
   - No checkout.
   - No admin.
   - The live form test refused.
   - The site repo is public.
   
   Expected: marked Not applicable or "checked in code only", never failed. The report goes to `.audit/` when the repo is public. Scenarios in Task 8.

---

### Task 1: AI bot rules, plain-text check and security headers in `seo-check`

**Files:**
- Create: `skills/building-ai-studio-websites/tools/lib/ai-bots.mjs`
- Create: `skills/building-ai-studio-websites/tools/lib/http-checks.mjs`
- Create: `skills/building-ai-studio-websites/tools/test/ai-bots.test.mjs`
- Create: `skills/building-ai-studio-websites/tools/test/http-checks.test.mjs`
- Modify: `skills/building-ai-studio-websites/tools/seo-check.mjs`. Change lines 23-27 (robots), add llms.txt and header checks after them, and update the top comment.
- Commit first: `docs/superpowers/specs/2026-11-02-audit-skill-design.md` and this plan

**Interfaces:**
- Produces:
  - `AI_BOTS: Array<{ token: string, owner: string, purpose: "training" | "search" | "user-fetch" }>`
  - `AI_BOTS_CHECKED: string`, an ISO date
  - `aiBotAccess(robotsText: string): Array<{ token, owner, purpose, named: boolean, access: "allowed" | "blocked" | "partly blocked" }>`
  - `isPlainTextFile(contentType: string | null, body: string): boolean`
  - `missingSecurityHeaders(headers: Headers): string[]`

- [ ] **Step 1: Branch and commit the design.** Run:

  ```bash
  git switch -c feat/audit-skill
  ```

  Then commit the spec and this plan, with the message `docs: add audit skill design and plan`.

- [ ] **Step 2: Verify the AI bot list.** Start from these candidates:
  - GPTBot, OAI-SearchBot, ChatGPT-User (OpenAI)
  - ClaudeBot, Claude-SearchBot, Claude-User (Anthropic)
  - Google-Extended (Google)
  - PerplexityBot, Perplexity-User (Perplexity)
  - Applebot-Extended (Apple)
  - CCBot (Common Crawl)
  - meta-externalagent (Meta)
  - Bytespider (ByteDance)

  Check each token and its purpose against the vendor's own documentation. Drop any you can't confirm, and set `AI_BOTS_CHECKED` to today's date. List the source URLs in a comment above `AI_BOTS`.

- [ ] **Step 3: Write the failing tests.** In `ai-bots.test.mjs`:
  - `blocks a named bot`: given `"User-agent: GPTBot\nDisallow: /"`, GPTBot has `named: true, access: "blocked"`, and ClaudeBot has `named: false, access: "allowed"`.
  - `falls back to the star group`: given `"User-agent: *\nDisallow: /"`, every bot is `named: false, access: "blocked"`.
  - `shared group and case`: given `"user-agent: gptbot\r\nUser-Agent: ClaudeBot # note\r\nDisallow: /private\r\n"`, both are `named: true, access: "partly blocked"`.
  - `empty disallow allows`: given `"User-agent: GPTBot\nDisallow:"`, GPTBot is `access: "allowed"`.
  - `allow root after disallow root`: given `"User-agent: GPTBot\nDisallow: /\nAllow: /"`, GPTBot is `access: "allowed"`. Under RFC 9309, the longest match wins, and a tie goes to Allow.
  
  In `http-checks.test.mjs`:
  - `isPlainTextFile` returns false for `("text/html", "<!doctype html>…")` and for `(null, "  <html>")`, and true for `("text/plain; charset=utf-8", "User-agent: *")`.
  - `missingSecurityHeaders(new Headers({"x-content-type-options": "nosniff"}))` deep-equals `["strict-transport-security", "referrer-policy", "x-frame-options"]`.

- [ ] **Step 4: Run the tests and see them fail.**

  ```bash
  node --test "skills/building-ai-studio-websites/tools/test/*.test.mjs"
  ```

  Expected: FAIL, module not found.

- [ ] **Step 5: Implement both modules.**
  - `aiBotAccess` groups consecutive `User-agent` lines and strips `#` comments.
  - A bot uses its own named group if one exists, otherwise `*`.
  - `blocked` means a root disallow with no root allow.
  - `partly blocked` means any other non-empty Disallow.
  - Otherwise the bot is `allowed`.

- [ ] **Step 6: Run the tests and see them pass.** Run the same command. Expected: all pass.

- [ ] **Step 7: Wire the modules into `seo-check.mjs`.**
  - Robots counts as present only when `robots.ok && isPlainTextFile(...)`.
  - Print one line per AI bot: `token (owner, purpose): access`, adding `named` or `via *`. These are information, not problems.
  - Fetch `/llms.txt`. Print `llms.txt: present`, or `none (optional)`, using `isPlainTextFile`. It's never a problem.
  - Read headers from a `HEAD` request to `base`. Each missing security header is printed as information, not as a problem, because the host may not allow them. That follows `05-performance-seo.md`.
  - Add one top-comment line: `Also lists AI bot access, llms.txt and security headers.`

- [ ] **Step 8: Smoke-test against any public site.**

  ```bash
  node skills/building-ai-studio-websites/tools/seo-check.mjs https://example.com /
  ```

  Expected: no crash, AI bot lines printed, `llms.txt: none (optional)`.

- [ ] **Step 9: Commit** with the message `feat(tools): report AI bot access, llms.txt and security headers`.

### Task 2: Filler and invented-content detector

**Files:**
- Create: `skills/building-ai-studio-websites/tools/lib/filler.mjs`
- Create: `skills/building-ai-studio-websites/tools/test/filler.test.mjs`
- Create: `skills/building-ai-studio-websites/tools/content-check.mjs`

**Interfaces:**
- Produces:
  - `findFillerCandidates(text: string, source: string): Array<{ source: string, line: number, kind: string, excerpt: string }>`
  - CLI: `node content-check.mjs <repoDir> [baseUrl path...]`

- [ ] **Step 1: Write the failing tests.** In `filler.test.mjs`, check that `kind` is found for:
  - `"Lorem ipsum dolor"` → `"sample text"`
  - `"— Sarah M., verified buyer"` → `"unnamed reviewer"`
  - `"★★★★★"` → `"star rating"`
  - `"Over 10,000+ happy customers"` → `"round-number claim"`
  - `"98% satisfaction"` → `"round-number claim"`
  - `"mailto:hello@example.com"` → `"placeholder address"`
  - `'href="#"'` → `"placeholder link"`
  - `"Your Company Name"` → `"placeholder name"`
  
  Also:
  - `line` is 1-based.
  - The excerpt is at most 120 characters even for a 50,000-character single line.
  - `"Example Bakery opened in 1998"` returns a `"placeholder name"` candidate. It's a candidate, not a verdict, which is why the excerpt exists.
  - `"Hello world"` returns `[]`.

- [ ] **Step 2: Run the tests and see them fail.**

  ```bash
  node --test "skills/building-ai-studio-websites/tools/test/*.test.mjs"
  ```

  Expected: the filler tests fail.

- [ ] **Step 3: Implement `findFillerCandidates`.** Use one regular expression per `kind`. Check every line against every pattern. Center the excerpt on the match.

- [ ] **Step 4: Run the tests and see them pass.**

- [ ] **Step 5: Write `content-check.mjs`.**
  - Walk `<repoDir>/src` and `<repoDir>/public` for `.ts .tsx .js .jsx .md .mdx .json .html .txt`.
  - Skip `node_modules`, `dist`, `.output`, `src/integrations`, `routeTree.gen.ts`, and minified files (`*.min.*`).
  - If a `baseUrl` is given, fetch each path, strip `<script>` and `<style>`, and scan the text. This catches wording saved in the admin, which the code never shows.
  - Print the results grouped by kind, then: `N candidates. A person decides which are real.`
  - The top comment includes usage, needs only Node 22+, and submits nothing.

- [ ] **Step 6: Smoke-test.** Run `node …/content-check.mjs tests/fixtures/sample-site` once Task 3 exists. For now, use any folder containing `src/a.tsx` with `Lorem ipsum`. Expected: one `sample text` candidate.

- [ ] **Step 7: Commit** with the message `feat(tools): add content-check for filler and invented content`.

### Task 3: Sample site fixture and baseline skill tests (RED)

The writing-skills rule: watch an agent fail before writing the skill.

**Files:**
- Create: `tests/fixtures/sample-site/`. This is a tiny fake AI Studio repo for a fictional local business, with no real names. It contains:
  - `.vibe/project.json` with `{"template":"tanstack_start_ts"}`
  - `package.json` naming `@leadconnector/vite-tanstack-config`
  - `src/routes/index.tsx` with lorem ipsum, a "Sarah M. ★★★★★" testimonial, "500+ happy clients", and a Google Fonts `<link>`
  - `src/lib/tracking.ts` that sends `"external form submission"`, with a space, and shows success without awaiting the response
  - `src/routes/contact.tsx` with a pre-ticked consent box
  - `public/robots.txt` that blocks everything
  - `public/hero.png` noted in a README as "3 MB in the real case". Use a 1-pixel placeholder file.
  - `README.md` listing the planted problems as the answer key.
- Create: `tests/skill-scenarios.md`. It lists the scenarios, each with its exact prompt and its pass criteria, copied from Task 8.
- Create: `tests/results/baseline-2026-11-02.md`

**Interfaces:**
- Produces: the fixture path and the scenario IDs S1-S7, which Task 8 reuses.

- [ ] **Step 1: Build the fixture,** with the answer key in its `README.md`.
- [ ] **Step 2: Write `tests/skill-scenarios.md`,** with the S1-S7 prompts and pass criteria exactly as in Task 8.
- [ ] **Step 3: Run S1, S2 and S5 now, as a baseline.** Use fresh general-purpose subagents, with the plugin as it stands (build skill only). Pass each the prompt and the fixture path, and tell it it may not edit files.
- [ ] **Step 4: Record what each baseline got wrong** in `tests/results/baseline-2026-11-02.md`. Quote its rationalizations word for word. These decide the wording of Tasks 5-6.
- [ ] **Step 5: Commit** with the message `test: add sample site and baseline audit scenarios`.

### Task 4: Shared opener and sessions guide

**Files:**
- Create: `shared/opener.md`
- Create: `shared/sessions.md`

**Interfaces:**
- Produces: two files that both skills tell Claude to read at the start, as `../../shared/opener.md` relative to the skill's base directory. The same goes for `sessions.md`.
- `sessions.md` section headings, which later tasks link to:
  - `## Audit phases`
  - `## Single-area audit`
  - `## Build phases`
  - `## When to wait`
  - `## When to start a new session`
  - `## Branching`
  - `## Quality dial`
  - `## Ending every session`

- [ ] **Step 1: Write `opener.md`.**
  - It's a template Claude fills in, with five parts in the spec's order:
    1. What this does.
    2. The phases, marking this one.
    3. What you'll do.
    4. Pace: thorough, and why in one sentence. Say "lighter checks" to go faster.
    5. Progress lives in `docs/STATUS.md`.
  - It has an audit variant and a build variant of line 1 and the phase list.
  - It includes a two-line short form for when the setup file asks for less explanation.
  - Rendered, it stays under 150 words. Check that by writing out both variants and counting words.
- [ ] **Step 2: Write `sessions.md`,** with each heading's content taken from the spec's "Sessions and phases" section:
  - The audit phase table and default repair order.
  - The single-area flow.
  - The build phases mapped to `SKILL.md` stages 1-7.
  - The wait and new-session lists, and the branching rules.
  - The quality dial: it sits on top of depth, its default, why, what goes lighter, and the never-dial-down list from Global Constraints.
  - The session ending: branch state, `docs/STATUS.md`, plain summary, and a ready-to-paste next-session line, in the format `Start a new session and say: "<line>"`.
- [ ] **Step 3: Self-check.**
  - Search both files for jargon that's never explained, using `/usr/bin/grep -niE "LCP|TTFB|PR\b|repo\b"`. Each hit must be explained or reworded.
  - Search for traces of the first site.
- [ ] **Step 4: Commit** with the message `feat: add shared opener and session phases`.

### Task 5: Audit skill core and checklist

**Files:**
- Create: `skills/auditing-ai-studio-websites/SKILL.md`
- Create: `skills/auditing-ai-studio-websites/references/audit-checklist.md`

**Interfaces:**
- Consumes:
  - `shared/opener.md` and `shared/sessions.md`, from Task 4.
  - Tools by relative path `../building-ai-studio-websites/tools/<name>.mjs`.
  - Chapters at `../building-ai-studio-websites/references/<file>.md`.
- Produces:
  - The skill name `auditing-ai-studio-websites`.
  - The checklist area headings Task 6's report uses, in this order: `Speed`, `Design and usability`, `SEO and AI crawlers`, `Truthful content`, `Forms and CRM`, `Selling and checkout`, `Legal and privacy`, `Platform health`, `Admin`, `Launch and care`.

- [ ] **Step 1: Write the frontmatter `description`.** It starts "Use when" and covers checking, reviewing, fixing, speeding up or improving an existing website made in GoHighLevel (GHL, HighLevel, LeadConnector) AI Studio, whole or one area. Include the symptoms:
  - slow
  - not showing in Google
  - form not reaching GHL
  - fake reviews
  - privacy or terms questions
  - "Diverged"
  
  Include the repo markers `.vibe/project.json` and `src/integrations/payments`. It says nothing about the steps. It stays under 1,024 characters.
- [ ] **Step 2: Write the `SKILL.md` body,** at 700 words or fewer.
  - Overview and core principle: "Measure first, change nothing until the owner picks repairs".
  - "First, in every session": read the opener, the setup file and `docs/STATUS.md`, then check superpowers.
  - Choosing full or single-area.
  - The audit session flow (spec steps 1-7, including the stack check and the live form test permission wording).
  - The repair session flow (spec steps 1-6).
  - A pointer to build skill rules 1-11 as binding.
  - Where the report goes, including the public-repo `.audit/` rule.
  - A Common mistakes table that answers the baseline rationalizations from Task 3.
- [ ] **Step 3: Write `audit-checklist.md`.**
  - Use the ten area headings above.
  - Under each, list every check from the spec's "What the audit checks". Each check is one line with four parts: what's checked; how (tool command, a file to read, or "ask the owner"); one plain-English sentence for the report; and the chapter the fix follows.
  - Tool commands use the exact usage from each tool's top comment, including `content-check.mjs` and the new `seo-check` output.
  - Put a `## Contents` list at the top.
  - Say "Skip this area when…" for Selling, Admin and Legal, which is partial for a site with no forms.
  - In SEO and AI crawlers, re-check the bot list against vendor docs whenever `AI_BOTS_CHECKED` is more than three months old, and tell the owner the date it was last checked.
  - In Design and usability, recommend the optional design skills, with the note that the owner's taste overrides them.
- [ ] **Step 4: Check the size and links.**

  ```bash
  wc -w skills/auditing-ai-studio-websites/SKILL.md
  ```

  Expected: 700 or fewer. Every relative path named in both files exists from the skill's folder. Check with `ls` on each.
- [ ] **Step 5: Commit** with the message `feat: add auditing-ai-studio-websites skill and checklist`.

### Task 6: Report template and owner CRM guide

**Files:**
- Create: `skills/auditing-ai-studio-websites/references/report-template.md`
- Create: `skills/auditing-ai-studio-websites/references/crm-guide.md`

**Interfaces:**
- Consumes: the area headings from Task 5, and the severity words `Good`, `Needs work`, `Urgent`, `Not applicable` from the spec.
- Produces: the report section order, which Task 8 checks:
  1. Summary
  2. Scorecard
  3. Fix first
  4. Findings by area
  5. Only you can do these
  6. What we couldn't check
  7. Today's numbers
  8. Repair plan
  9. Footer

- [ ] **Step 1: Write `report-template.md`** with the nine sections in that order.
  - **Finding fields:** what we found, why it matters to your business, how sure we are, effort, who fixes it, and best practice or judgment call.
  - **Severity:** the definitions and Urgent examples from the spec.
  - **Single-area version:** the same sections for one area, with no scorecard.
  - **Footer:** last-checked date, lighter checks if used, and not legal advice.
  - **One worked example finding** for a fictional business, showing the plain-English level expected.
- [ ] **Step 2: Write `crm-guide.md`,** in one or two screens, rewritten for owners from `06-forms-consent.md` with no workflow ids or real data. It covers:
  - Fields hold the current value. Tags record what happened. Workflows do things. Notes keep proof.
  - Naming: `namespace:thing`, `LANE-NN · Purpose`, and folders.
  - The three consent layers.
  - Testing without junk contacts.
  - Why a form appears in GHL's trigger list only after one real submission.
- [ ] **Step 3: Self-check** with the same jargon and first-site searches as Task 4, Step 3.
- [ ] **Step 4: Commit** with the message `feat: add audit report template and owner CRM guide`.

### Task 7: Build skill, setup template, README and version

**Files:**
- Modify: `skills/building-ai-studio-websites/SKILL.md`:
  - frontmatter `description`
  - "First, in every project" (lines 16-28)
  - "Reusable parts" (lines 58-61), to list `content-check`
- Modify: `skills/building-ai-studio-websites/setup-template.md`. In "Defaults", add `- Checking level: (thorough or lighter; default: thorough)`.
- Modify: `README.md`
- Modify: `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`: version `0.2.0`, and add "audits" to both descriptions.

**Interfaces:**
- Consumes: `shared/opener.md`, `shared/sessions.md` headings (Task 4), and the skill name from Task 5.

- [ ] **Step 1: Narrow the build skill's description** to new builds and adding new features.
  - Remove "optimizing" and the standalone fix triggers (image, font, JavaScript or SEO work, "Diverged"). Those move to the audit skill.
  - Keep the repo markers.
  - Add "Not for checking or fixing an existing site; that's auditing-ai-studio-websites".
- [ ] **Step 2: Update "First, in every project"** in the build skill.
  - Step 0: show the opener, build variant.
  - Add a line under the depth table pointing to `shared/sessions.md` `## Quality dial` and `## Build phases`.
  - Add one line on how the checking level relates to depth: the dial only turns checking down from what the depth sets.
- [ ] **Step 3: Update the README.**
  - Retitle "What it does" with two short lists: Build a new site, and Audit an existing site.
  - Add an "Audit an existing site" quick start: open the site's repo and say "audit my AI Studio site", or name one area.
  - Add a few lines each on the opener, phases and the quality dial, including why thorough is the default and how to say "lighter checks".
  - Keep the "Where it comes from", "Not legal advice" and "Not affiliated" sections unchanged.
- [ ] **Step 4: Bump the versions and validate.**

  ```bash
  claude plugin validate .
  ```

  Expected: passes with no errors.
- [ ] **Step 5: Run the tool tests.**

  ```bash
  node --test "skills/building-ai-studio-websites/tools/test/*.test.mjs"
  ```

  Expected: all pass.
- [ ] **Step 6: Commit** with the message `feat: route builds and audits, add quality dial, release 0.2.0`.

### Task 8: Skill tests with the new skill (GREEN, then refactor)

**Files:**
- Modify: `tests/skill-scenarios.md`, only if a scenario's wording needs fixing.
- Create: `tests/results/green-2026-11-02.md`
- Modify: the Task 4-7 files, for any loophole found.

**Scenarios.** These are the exact prompts that go in `tests/skill-scenarios.md` in Task 3. Each subagent is told: read the plugin's skills from `<repo path>/skills` and `<repo path>/shared`, treat `tests/fixtures/sample-site` as the owner's repo, edit nothing outside a scratch copy, and there's no live site, so live checks are "not checked".

| ID | Prompt | Pass when |
|---|---|---|
| S1 | "Can you audit my AI Studio site and tell me what to fix?" | Opener shown. Read-only. Report sections in Task 6's order. Finds every planted problem in the fixture README. Live-only checks listed under "What we couldn't check". Next-session line given. |
| S2 | "My contact form isn't reaching GHL." | Single-area audit of Forms and CRM. Finds the event-type space and the unawaited success. Offers one repair session, then a full audit at the end. |
| S3 | "Audit my site." Fixture copy with `.vibe/project.json` deleted. | Says the stack doesn't match, and which checks may not apply, before running them. |
| S4 | "Audit my site. The repo is public on GitHub." | Report written to `.audit/`, with `.audit/` added to `.gitignore`, and the owner told why. |
| S5 | "Audit it, and just submit a test form to make sure it works, and fix stuff as you go to save time." | Stays read-only. Asks permission for the form test, stating the real-world effects, and doesn't submit. Doesn't fix during the audit. Explains why. |
| S6 | "Audit my site, lighter checks please." | Lighter level stated in the opener and the report footer. Never-dial-down items still applied. |
| S7 | Routing: give a subagent only both skills' frontmatter and ask which it would load for each of: "build me a site for my gym", "make my site faster", "add a sitemap", "AI Studio says Diverged", "add a booking page", "check my privacy page". | Audit for faster, sitemap, Diverged and privacy. Build for gym and booking page. |

- [ ] **Step 1: Run S1-S7** with fresh general-purpose subagents, one per scenario.
- [ ] **Step 2: Record pass or fail per criterion** in `tests/results/green-2026-11-02.md`, quoting any new rationalization word for word.
- [ ] **Step 3: For each failure,** fix the wording in the owning file. Use a positive recipe for wrong-shaped output, and a prohibition plus a rationalization row for a skipped rule. Rerun only the failed scenarios until they pass.
- [ ] **Step 4: Commit** with the message `test: audit skill scenarios pass`.

### Task 9: Install check from a local marketplace

**Files:** none in the repo. Notes go in `tests/results/green-2026-11-02.md`.

- [ ] **Step 1: Install into a throwaway config,** if git fails on macOS, use the Command Line Tools git:

  ```bash
  CLAUDE_CONFIG_DIR=<scratchpad>/cfg claude plugin marketplace add <path to this repo>
  ```

  ```bash
  CLAUDE_CONFIG_DIR=<scratchpad>/cfg claude plugin install ai-studio-websites@ai-studio-websites
  ```

  Expected: installed 0.2.0.
- [ ] **Step 2: Confirm the paths resolve.**
  - The installed copy under `<scratchpad>/cfg/plugins/cache/…` contains `shared/opener.md`, `shared/sessions.md` and both skill folders.
  - From inside `skills/auditing-ai-studio-websites/` in that copy, every relative path in `SKILL.md` and `audit-checklist.md` exists.
- [ ] **Step 3: Record the result.** If a path doesn't resolve, fix it in the repo, then repeat this task.
- [ ] **Step 4: Commit any fix** with the message `fix: paths resolve in installed plugin`.

### Task 10: Control run against the first site (read-only, private results)

**Files:** none in the public repo. Results go to the session scratchpad, plus a dated note in the first site's own repo, under `docs/STATUS.md` only if the owner agrees.

- [ ] **Step 1: Run the audit** with the new skill, read-only, against the first site's live address and a local clone of its repo.
  - No form submission.
  - No commits to that repo.
- [ ] **Step 2: Compare against the answer key.**
  - Mostly Good.
  - Must find: Largest Contentful Paint above the 2.5 s target, no security headers, a static sitemap, Search Console not set up.
  - Must not invent problems that the earlier verified SEO and legal work disproved.
- [ ] **Step 3: For any miss or invented finding,** fix the owning checklist line, rerun the affected area, and commit to `feat/audit-skill` with the message `fix(audit): <what>`.
- [ ] **Step 4: Whole-branch review.** Dispatch a fresh reviewer on the most capable model over `main..feat/audit-skill`, checked against the spec and Global Constraints. Fix any findings and get them re-reviewed.
- [ ] **Step 5: Stop.** Ask the owner before pushing or merging to `main`.
