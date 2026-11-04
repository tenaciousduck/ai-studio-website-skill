# AI Studio Websites

A Claude Code plugin for building and auditing websites made with HighLevel's AI Studio, for any type of business.

AI Studio gets a working site up fast, but it has gaps: what the checkout can't do, forms that look fine and quietly fail, generated content that isn't real, and sync problems that can wipe your work. This skill gives Claude what one full production build learned, so you start with those lessons instead of finding them yourself.

You kick the project off in AI Studio, connect it to GitHub, then do the real build with Claude Code. Already have a site? The audit checks it and fixes it in steps you approve.

## What it does

Two skills share one set of lessons. Claude picks the right one from what you ask.

### Build a new site

- Sizes the process to the site, from a small brochure site to a full store.
- Asks whether the site needs an admin at all, and how much of one.
- Lists what AI Studio can't do, and how to design around it.
- Covers design process, images, self-hosted fonts, JavaScript, SEO and sitemaps.
- Sets up CRM forms, consent, tags and workflows that hold up.
- Walks through checkout limits, a test list and going live.
- Reviews privacy pages, terms and cookies against what the site really does, with notes for Canada and the US.
- Adds checking tools for page layout, SEO, cookies and filler text, plus reusable code.

### Audit an existing site

- Checks the site you already have, the whole thing or one area, without changing anything.
- Covers speed, images, fonts, search visibility, sitemap, forms reaching your customer list, cookies, privacy and terms, and made-up content left over from AI Studio's first version.
- Explains each finding in plain English, says why it matters to your business, and marks whether it was measured, estimated or unverified.
- Then fixes what you choose, one area per session, and re-runs the same tests to show the difference.
- Marks areas that don't apply (no checkout, no admin) as not applicable, never as failures.

## Install

You need Claude Code, a HighLevel account with AI Studio, and a GitHub account. The checking tools need Node 22+ and Google Chrome; outside macOS, set `CHROME_PATH` to Chrome's location.

In Claude Code:

```text
/plugin marketplace add tenaciousduck/ai-studio-website-skill
/plugin install ai-studio-websites@ai-studio-websites
```

Then install the one required companion, [superpowers](https://github.com/obra/superpowers), which supplies the planning and review process:

```text
/plugin install superpowers@claude-plugins-official
```

### Optional design skills

None is required. Each comes from a different author with its own license, and the client's taste overrides them all.

| Skill | Good for | Where to get it |
|---|---|---|
| `frontend-design` | General design direction | `/plugin install frontend-design@claude-plugins-official` |
| `web-design-guidelines` | Interface and accessibility review | Vercel's published agent skills |
| `avoid-ai-design` | Catching generic AI design defaults | Search for it by name |
| `design-taste-frontend` | Research and page structure | Search for it by name |

## Audit an existing site

1. Open the site's repository in Claude Code. If you don't have it on your computer yet, connect the site to GitHub from AI Studio first, then copy it down (called cloning). In GitHub Desktop, choose File, then Clone repository, and pick your site.
2. Say "audit my AI Studio site" for the whole site, or name one area, such as "my form isn't reaching GHL", "make my site faster" or "AI Studio says Diverged".
3. Claude reads the site and reports what it found. This session is read-only: nothing changes.
4. You choose which repairs to make. Each one gets its own session, and you publish in AI Studio yourself.

If the site's repository is public, Claude saves the report to a `.audit/` folder instead of putting it where anyone who can see your GitHub project could read it. If the site wasn't built the way these checks expect, Claude says which checks may not apply before running them.

## First use

Open a project made in AI Studio and tell Claude what you're building. The skill starts by itself when it sees an AI Studio project, or you can ask for it by name.

The first time, Claude offers to save your settings to `~/.claude/ai-studio-setup.md`: your name, what needs your approval, how to describe the platform on public pages, and how much to explain. They live outside the plugin, so updates won't erase them. See [setup-template.md](skills/building-ai-studio-websites/setup-template.md).

## How a session runs

### The opener

Every session starts with a short note, under 150 words, saying what Claude is about to do, which phase you are in, what you will be asked to do, and where progress is saved. Prefer two lines? Put `Opener: short` in your settings file, or ask for a shorter one.

### Phases

Work is split into phases so no single session has to hold everything. An audit runs as a read-only check, then repairs one area at a time, then a re-check. A build runs in six phases from discovery to launch. Progress is written to `docs/STATUS.md` in the site's repository, so a new session picks up where the last one stopped and you never have to re-explain.

### The quality dial

Checking comes in two levels, and thorough is the default. Thorough means a separate reviewer for each task, a review of the whole branch, three speed-test runs, an accessibility pass and live checks after publishing. We chose it because on an earlier full AI Studio build, single quick passes missed real problems, and the extra checks caught them. It costs more time and usage, and gives safer results.

To go faster, say "lighter checks", or add `Checking level: lighter` to your settings file. That means quicker reviews, one speed-test run and an accessibility spot check, and the report says the checks were lighter. Some checks never turn down: live tests of forms and payments, the audit staying read-only, no force pushing, leaving protected folders alone, no invented content, legal pages that match what the site does, and asking before anything with real-world effects. This is a judgment call, and it is yours to make.

## Where it comes from

- **A real production site:** the lessons, tools and code come from a live AI Studio site that takes real payments.
- **Platform facts** were last checked October to November 2026. AI Studio changes often, so Claude is told to re-check anything a design depends on.
- **Marked "unproven"** means best practice not yet built, including spam protection and the test workflow. The sitemap route, `llms.txt` route and security headers were proven live on 2026-11-04.
- **The code templates** are starting points. Adapt them to your project and test them.

## Not legal advice

The legal chapter, country notes and sample terms are general information from an AI-assisted review, not legal advice. They may be out of date or wrong for your situation, and they cover only part of Canadian and US law. Whether a lawyer reads a site's pages is up to you and your client. Using this doesn't create any professional relationship.

## Not affiliated

This is an independent project, not made or endorsed by HighLevel, Stripe, Anthropic or anyone else named here. Their names belong to their owners.

## Found something out of date?

Open an issue with what you saw and the date. Facts that have changed are the most useful thing you can report.

## License

MIT. See [LICENSE](LICENSE).
