---
name: auditing-ai-studio-websites
description: Use when checking, auditing, reviewing, fixing, speeding up or improving an existing website made in GoHighLevel (GHL, HighLevel, LeadConnector) AI Studio, the whole site or one area. Also use when a repo has .vibe/project.json or src/integrations/payments and the site is slow, isn't showing in Google, needs a sitemap, has a form not reaching GHL, has fake reviews, raises privacy or terms questions, or AI Studio shows "Diverged".
---

# Auditing AI Studio Websites

## Overview

Audits an existing AI Studio site, then repairs it in approved phases.

**Core principle:** measure first, change nothing until the owner picks repairs.

## First, in every session

1. Read the builder's settings (`.claude/ai-studio-setup.md` in the project, then `~/.claude/ai-studio-setup.md`) and `docs/STATUS.md`.
2. Show the audit opener from `../../shared/opener.md`. Follow `../../shared/sessions.md` for phases, waiting, branching, the dial and endings.
3. Check superpowers, as in step 2 of `../building-ai-studio-websites/SKILL.md`. That file's rules 1-11 bind every session here.

**One area named** ("my form isn't reaching GHL", "add a sitemap"): audit only that checklist area, read-only, with a short report. Repair it next session (or now, if the owner agrees it's small and clear), then offer a full audit once. New sites and features belong to the build skill.

## Audit session (read-only)

1. **Intake.** Ask only what code and the live site can't answer: what the site is for, who it serves and in which countries, whether it sells, which forms matter, whether there's an admin, what they most want improved. Never assume a country.
2. **Confirm the stack** against "The stack" in `../building-ai-studio-websites/references/02-platform.md`. If it differs, say which checks may not apply.
3. **Run the checks** in `references/audit-checklist.md`. Keep raw output in the scratchpad; translate results into plain English.
4. **Live form test, only after a yes.** First say: "A real contact will be created, and your workflows will run on it, including emails and any task for you." Use their address with `+sitetest1`. They submit it, following your short steps, then read the contact back in GHL (tags, fields, note, source, any task), tag it `sys:test-record` and delete it. Drive their signed-in browser, GHL or a connector only if they prefer. No yes: "checked in code only".
5. **Write the report** from `references/report-template.md` to `docs/audit/YYYY-MM-DD-audit.md`. If the project is public (`gh repo view --json visibility`, else ask; unknown counts as public), save it in `.audit/`, add `.audit/` to `.gitignore`, telling the owner why: it lists weaknesses attackers could use.
6. **Walk through the top findings,** record the agreed repair order in `docs/STATUS.md`, and end as `sessions.md` says.

The audit writes only the report, `docs/STATUS.md` and that `.gitignore` line: no other edits, commits, form submissions (except the approved live test), purchases or database writes.

## Repair session

1. Read `docs/STATUS.md` and the report. First commit on the phase branch: `docs/STATUS.md`, any `.gitignore` change, and a report in `docs/audit/`.
2. Plan with `superpowers:writing-plans` beyond a few lines; execute with `superpowers:subagent-driven-development` at the dial's level.
3. Fix with the build skill's chapters and templates, citing its chapter. Where nothing should look different, compare before and after (rule 9).
4. Review, merge per the setup file. The owner publishes; run the live check: the same tools on the live site, plus `curl -sI` for headers and generated files. If the findings came from an outside checker, ask the owner to re-run it.
5. Mark each finding fixed, with evidence. Update `docs/STATUS.md`; give the next session's line.

Not legal advice. Never claim compliance.

## Common mistakes

| Thought | Reality |
|---|---|
| "Fix stuff as you go to save time", "only clear-cut fixes", "just a copy" | Decline in one sentence: nothing changes before the owner sees it all. A scratch copy is still repair. |
| "This lost sign-ups on another site" | Unverified until checked here. |
| "Noticed, separate from your question" | Single area: one line per urgent item. |
| Selling or Admin asked about | Not applicable, one line why. |
| Nine questions, or a closing plan | Ask only blockers; end with one next-session line. |
| Legal point stated as fact | Best practice or judgment call, plus "not legal advice". |
| "1-pixel placeholder" | Code can't measure it: check live, or list it under "What we couldn't check". |
| Editing `src/lib/tracking.ts` | AI Studio owns it; repairs build beside it. |
