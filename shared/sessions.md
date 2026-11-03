# Sessions and phases

Both skills follow this guide. It says which session to run, what each one ends with, when to wait, when to start fresh, and how much checking to do. Follow it, and explain it to the owner in plain words when it comes up. The owner doesn't need to read this file.

Work happens in phases, one session per phase, with superpowers agents doing the work inside the session. Run one session at a time, not several side by side. This is a judgment call, kept because it's easier for the owner to follow.

The rules that always hold are `Rules that hold in every stage`, 1 to 11, in the build skill's `SKILL.md`. Don't restate them to the owner. Follow them.

## Audit phases

| Phase | Session | Ends with |
|---|---|---|
| 1 | Audit (read-only) | The report, a suggested repair order, and the next session's line |
| 2 and on | One repair session per area, safest and highest value first | A reviewed branch, merged following the setup file. The owner publishes, then a live check runs |
| Last | Re-check | The audit run again, with before and after numbers |

**Default repair order** (best practice, because it starts with low-risk changes that pay off most):

1. Speed and SEO.
2. Truthful content.
3. Design and usability.
4. Forms and CRM.
5. Selling and legal.
6. Platform and care.

CRM means the customer list that your forms feed, such as HighLevel's.

The owner can reorder or skip repair phases. Urgent findings, as the report defines them, may jump the queue. Say why when one does.

The audit session is read-only. It may write the report, `docs/STATUS.md`, and, if the project is public, a `.gitignore` line for `.audit/`. In that case the report is saved in `.audit/` instead, because it lists weaknesses an attacker could use; tell the owner why. It writes nothing else and doesn't commit. The first repair session commits `docs/STATUS.md` and any `.gitignore` change as its first commit, plus the report only when it lives in `docs/audit/`, so they get reviewed like everything else. A report in `.audit/` is never committed.

**Mockups before a visible repair.** Before any repair that visibly changes a page, such as a layout change, a reworked call to action, a new cookie notice or a terms step, offer concept mockups and advise yes. This is a judgment call, and the owner can skip them. Tell them why in one sentence: a mockup shows the change before anything is built, so changing their mind costs nothing. The mockups show the current page and the proposed version side by side, in the project's `design/concepts/` folder, following "Mockups before building" in the build skill's `references/03-design.md`. Nothing is built until the owner picks. Fixes meant to look identical, such as images, fonts and speed work, skip mockups and use the before-and-after comparison in the build skill's rule 9 instead.

## Single-area audit

When the owner names one problem or one area, such as "my contact form isn't reaching HighLevel" or "add a sitemap", audit only that area. Don't go wider.

1. **Session one:** check that one area, read-only, and write a short report for it.
2. **Session two:** repair it. End with a live check, then offer a full audit once.

If the problem is small and clear, both can happen in one session, with the owner's agreement. If you spot something urgent outside the area, mention it in one line and don't audit it.

## Build phases

The build skill's seven stages are grouped into six phases. A stage's "Done when" in `SKILL.md` is what its phase ends with. Nothing new is invented here.

| Phase | Stages in `SKILL.md` |
|---|---|
| 1. Start and discovery | Stage 1 (start a project) and stage 2 (discovery and sitemap) |
| 2. Design | Stage 3 |
| 3. Build | Stage 4. This may take several sessions, one per chunk of the plan |
| 4. Forms and selling | Stage 5 |
| 5. Quality | Stage 6 |
| 6. Launch | Stage 7 |

## When to wait

Stop and wait, and say what you're waiting for:

- **While a merge syncs to AI Studio.** AI Studio as last checked (October to November 2026) copies from GitHub after a merge. Building on a merge that hasn't arrived is how copies drift apart.
- **While the owner publishes.** Only they can, and the live site doesn't change until they do.
- **When you've asked a question.** Ask few, and only what blocks the next step.
- **After a publish, until the live check has run.** The live site is the proof, not the code.

## When to start a new session

Start fresh, and give the owner the line to paste:

- When a phase is merged, published and checked.
- When switching areas.
- When a session has grown long. Say so, and give the line to continue. Long sessions get slower and forget earlier decisions.

## Branching

A branch is a separate copy of the site's files where work happens before it joins the live version. In plain words:

- **One branch per phase,** named for it, for example `repair/speed-seo`.
- **Nothing reaches `main` without review.** `main` is the version AI Studio syncs from.
- **If AI Studio says "Diverged"** (its copy and GitHub's no longer match), choose New branch, never Force push.
- **Never start a phase on top of unpublished work.** Wait until the last merge has reached AI Studio and been published.
- Changes that only touch notes, such as the report and `docs/STATUS.md`, don't count as unpublished work, because they don't change the live site.

## Quality dial

The dial sits on top of the build skill's depth table (Light, Standard, Full). Depth still picks a build's process, and the dial can only turn the checking down from there. Audits and repairs use the dial's default. This is a judgment call.

**Default (thorough):**

- A separate reviewer agent for each task.
- A review of the whole branch.
- Three Lighthouse runs. Lighthouse is Google's speed test, and three runs smooth out its ups and downs.
- An accessibility pass. This checks the site works for people using a keyboard or a screen reader.
- Live checks after publishing.

**Why, in one or two sentences for the owner:** on an earlier full AI Studio build, single passes missed real problems. Reviews caught them: an accessibility pass found issues the task reviews missed, and only a live check showed sign-ups weren't reaching the customer list. Thorough costs more usage and time, and gives better and safer results.

**Lighter,** if the owner says "lighter checks" or the builder's settings file has a line `Checking level: lighter`:

- Inline reviews instead of a separate reviewer for each task.
- One Lighthouse run.
- An accessibility spot check instead of a full pass.
- The report, or the final summary of a build, gets a line saying the checks were lighter.

Turning it down is the owner's call. Say what they give up in one plain sentence, then do it.

**Never dialed down,** whatever the setting (best practice):

- Live checks on forms and payments.
- The read-only audit session.
- No force push.
- Sealed folders untouched.
- No invented content.
- Legal pages that match reality. This isn't legal advice.
- Asking before anything with real-world effects.

If the owner asks to skip one of these, say no, and say why in one plain sentence.

## Ending every session

Every session ends the same four ways:

1. **Branch state.** Say which branch holds the work and whether it's merged, ready to merge, or untouched. An audit session says no site files were changed; the report and `docs/STATUS.md` are written but not committed.
2. **`docs/STATUS.md` updated.** It says what's done, what's next and what's waiting. It names the areas to come, not the weaknesses found, so it's safe in a public project.
3. **A plain summary.** A few sentences for the owner: what now exists and why it matters to their business.
4. **One ready-to-paste line for the next session,** in this format, as the last thing in the message:

   `Start a new session and say: "<line>"`

   For example: `Start a new session and say: "Continue the AI Studio audit: repair phase 2, truthful content."` or `Start a new session and say: "Continue the AI Studio build: phase 3, build, part 2."`

Don't end with a long plan or a list of questions. If something must be answered first, say it in one sentence before the line.
