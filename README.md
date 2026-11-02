# AI Studio Websites

A Claude Code plugin for building websites with HighLevel's AI Studio, for any type of business.

AI Studio gets a working site up fast, but it has gaps: what the checkout can't do, forms that look fine and quietly fail, generated content that isn't real, and sync problems that can wipe your work. This skill gives Claude what one full production build learned, so you start with those lessons instead of finding them yourself.

You kick the project off in AI Studio, connect it to GitHub, then do the real build with Claude Code.

## What it does

- Sizes the process to the site, from a small brochure site to a full store.
- Asks whether the site needs an admin at all, and how much of one.
- Lists what AI Studio can't do, and how to design around it.
- Covers design process, images, self-hosted fonts, JavaScript, SEO and sitemaps.
- Sets up CRM forms, consent, tags and workflows that hold up.
- Walks through checkout limits, a test list and going live.
- Reviews privacy pages, terms and cookies against what the site really does, with notes for Canada and the US.
- Adds checking tools for page layout, SEO and cookies, plus reusable code.

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

## First use

Open a project made in AI Studio and tell Claude what you're building. The skill starts by itself when it sees an AI Studio project, or you can ask for it by name.

The first time, Claude offers to save your settings to `~/.claude/ai-studio-setup.md`: your name, what needs your approval, how to describe the platform on public pages, and how much to explain. They live outside the plugin, so updates won't erase them. See [setup-template.md](skills/building-ai-studio-websites/setup-template.md).

## Where it comes from

- **A real production site:** the lessons, tools and code come from a live AI Studio site that takes real payments.
- **Platform facts** were last checked October to November 2026. AI Studio changes often, so Claude is told to re-check anything a design depends on.
- **Marked "unproven"** means best practice not yet built, including the sitemap route, security headers, spam protection and test workflow.
- **The code templates** are starting points. Adapt them to your project and test them.

## Not legal advice

The legal chapter, country notes and sample terms are general information from an AI-assisted review, not legal advice. They may be out of date or wrong for your situation, and they cover only part of Canadian and US law. Whether a lawyer reads a site's pages is up to you and your client. Using this doesn't create any professional relationship.

## Not affiliated

This is an independent project, not made or endorsed by HighLevel, Stripe, Anthropic or anyone else named here. Their names belong to their owners.

## Found something out of date?

Open an issue with what you saw and the date. Facts that have changed are the most useful thing you can report.

## License

MIT. See [LICENSE](LICENSE).
