# The opener

Show this to the owner at the start of every run of either skill, once per session, before any findings, questions or work. Fill in the blanks, keep the wording, and add nothing. The opener must stay under 150 words on screen. The words you add to fill the blanks count.

## When to use which form

- **Full form (the default):** use the audit version or the build version below.
- **Short form:** use it when the builder's settings file has the line `Opener: short`. Read the file the way the skill says: `.claude/ai-studio-setup.md` in the project, then `~/.claude/ai-studio-setup.md`. Use it too if the owner asks for a shorter opener.
- **Lighter checks:** if they are on (the owner asked, or the settings file has `Checking level: lighter`), change the pace line, or the short form's second line, to "Lighter checks are on." Otherwise leave it as written.

## Audit version

Pick the phase list that fits the session. Mark this session by adding "(this session)" to its line. In a later session, mark that phase instead.

**Line 1 (what this does):**

> I'll check your site against what an earlier full AI Studio build learned, explain what I find in plain English, then fix it in steps you approve. Nothing changes until you choose.

**Phase list, full audit:**

> 1. Audit: read-only, ends with a report.
> 2. Repairs: one session per area.
> 3. Re-check: the same tests, before and after.

**Phase list, one area only** (the owner named one problem):

> 1. Check that one area: read-only, short report.
> 2. Fix it, then test it live.
> 3. Optional: a full audit.

The rest of the audit opener:

> **You'll:** answer a few questions, approve changes, publish in AI Studio, and make the business decisions only you can.
>
> **Pace:** thorough, because quick single passes missed real problems on an earlier full AI Studio build. Say "lighter checks" to go faster.
>
> **Progress** lives in `docs/STATUS.md`, so any new session picks up without you re-explaining.

## Build version

Mark this session by adding "(this session)" to its line.

**Line 1 (what this does):**

> I'll help you plan, build and launch your AI Studio site in steps: work out what it's for, design it, build it, then prove it works on the live site.

**Phase list:**

> 1. Start and discovery.
> 2. Design.
> 3. Build, which may take several sessions.
> 4. Forms and selling.
> 5. Quality.
> 6. Launch.

The rest of the build opener:

> **You'll:** answer questions, approve designs and changes, publish in AI Studio, and make the business decisions only you can.
>
> **Pace:** thorough, because quick single passes missed real problems on an earlier full AI Studio build. Say "lighter checks" to go faster.
>
> **Progress** lives in `docs/STATUS.md`, so any new session picks up without you re-explaining.

## Short form (two lines)

Pick the version for the skill, then fill in the phase. If lighter checks are on, the second line reads "Lighter checks are on. Progress is in `docs/STATUS.md`."

Audit:

> I'll check your AI Studio site, then fix it in steps you approve. This is phase `<number>` of `<total>`: `<name>`.
> Say "lighter checks" to go faster. Progress is in `docs/STATUS.md`.

Build:

> I'll build your AI Studio site in steps you approve. This is phase `<number>` of `<total>`: `<name>`.
> Say "lighter checks" to go faster. Progress is in `docs/STATUS.md`.

## After the opener

Go straight to the skill's first step. Don't repeat the opener later in the same session, except when the owner asks what's going on.
