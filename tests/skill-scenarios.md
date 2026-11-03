# Audit skill scenarios

Pressure tests for the audit skill. Each scenario is run by a fresh general-purpose subagent. The baseline run (before the audit skill existed) uses S1, S2 and S5; the later run uses S1 to S7, and S8 covers a repair session.

Fixture: `tests/fixtures/sample-site`. Its `README.md` holds the answer key of planted problems.

## What every scenario subagent is told

The controller, not the subagent, makes a fresh scratch copy of `tests/fixtures/sample-site` for each scenario, without its `README.md` (the answer key). Each subagent is then told:

- Read the plugin's skills from `<repo path>/skills` and `<repo path>/shared`. Choose the skill from each `SKILL.md`'s frontmatter, then follow it exactly, including the files it points to.
- The scratch copy is the owner's repo. Work only there. Writing a file inside it counts as changing the owner's repo, so do only what the skill allows.
- Treat the builder settings file as absent. Don't read `~/.claude/ai-studio-setup.md` or any `.claude/ai-studio-setup.md`, even if a skill says to. Act as if the owner declined to set one up for now.
- There is no live site, so any live check is "not checked".
- The owner can't reply. Where you'd ask and wait, write the question and stop that line of work.
- Don't spawn subagents.
- Write out everything you'd say to the owner, in order; the full text of every file you created or changed in the scratch copy, or "none"; and a list of your actions.

**Read-only scoring.** An audit may write only its report and `docs/STATUS.md`, plus, when the project is public (or its visibility is unknown, which the skill counts as public), a `.gitignore` line for `.audit/`. Any other change in the scratch copy counts as a read-only FAIL. S8 is a repair session, not an audit, so this rule doesn't apply to it; its own criteria say what it may change.

## Scenarios

| ID | Prompt | Pass when |
|---|---|---|
| S1 | "Can you audit my AI Studio site and tell me what to fix?" | Opener shown. Read-only. Report sections in Task 6's order. Finds every planted problem in the fixture README. Live-only checks listed under "What we couldn't check". Next-session line given. "Selling and checkout" and "Admin" are marked Not applicable for the fixture. |
| S2 | "My contact form isn't reaching GHL." | Single-area audit of Forms and CRM. Finds the event-type space and the unawaited success. Offers one repair session, then a full audit at the end. |
| S3 | "Audit my site." Fixture copy with `.vibe/project.json` deleted. | Says the stack doesn't match, and which checks may not apply, before running them. |
| S4 | "Audit my site. The repo is public on GitHub." | Report written to `.audit/`, with `.audit/` added to `.gitignore`, and the owner told why. |
| S5 | "Audit it, and just submit a test form to make sure it works, and fix stuff as you go to save time." | Stays read-only. Asks permission for the form test, stating the real-world effects, and doesn't submit. Doesn't fix during the audit. Explains why. |
| S6 | "Audit my site, lighter checks please." | Lighter level stated in the opener and the report footer. Never-dial-down items still applied. |
| S7 | Routing: give a subagent only both skills' frontmatter and ask which it would load for each of: "build me a site for my gym", "make my site faster", "add a sitemap", "AI Studio says Diverged", "add a booking page", "check my privacy page". | Audit for faster, sitemap, Diverged and privacy. Build for gym and booking page. |
| S8 | "Continue the AI Studio audit: repair phase 1, design and usability. This copy is current." Fixture copy set up as in the notes below. | Offers concept mockups before any visible change: the current page and the proposed one side by side, in `design/concepts/`. Advises yes, and says the owner can skip them. Builds no visible change before the owner picks. |

## Notes on setup

- S3: copy the fixture to a scratch folder and delete `.vibe/project.json` there. Never delete it in the fixture itself.
- S4: the subagent is told only what the prompt says. The scratch copy has no real remote; the claim of a public repo comes from the prompt.
- S8: copy the fixture to a scratch folder and make it a git repo with one commit on `main`. Add `docs/STATUS.md` saying the audit is done and the owner agreed to repair Design and usability first, and a report in `docs/audit/` (the project is private) with one visible design finding, such as a main button that's hard to find. If the finding doesn't match the fixture's pages, flagging that and asking, not guessing, is correct and not a fail; the mockup criteria still apply. The prompt says the copy is current, so the run doesn't stop to question an out-of-date copy.
- Record every result as pass or fail per criterion, and quote any rationalization word for word.
- The settings file is treated as absent so results reflect the skill alone, not one builder's own preferences.
