# Report template

The owner's report, written after the checks in `audit-checklist.md`. The reader is a business owner, not a developer. Save it where `SKILL.md` says.

## Contents

- Rules for writing it
- Words to explain on first use
- Severity
- One finding
- The report, in order
- Single-area version
- Worked example

## Rules for writing it

- **Plain English, short.** Every finding says why it matters to the business. If a finding runs past about six short lines, cut it.
- **Translate, never paste.** Tool output stays in the session scratchpad. Turn each result into a sentence using "Reading tool output" in `audit-checklist.md`. No raw lines, flag names or file dumps in the report.
- **Mark every result** Measured, Estimated or Unverified, and every recommendation Best practice or Judgment call. A lesson from another site is Unverified until a check here confirms it. Never say where a lesson came from beyond "an earlier full AI Studio build".
- **Say what can't be measured.** A size or speed that code can't show (an image stand-in, a live delay) goes under "What we couldn't check", not in as a number.
- **Don't pad.** If you saw only part of the project, say so once under "What we couldn't check". Don't list missing tests, notes or lock files as findings.
- **No internal detail** (ids, tag names, workflow settings) unless the owner asked.
- **Don't assume a country.** Where the country matters and isn't known, say which checks wait on it.
- **Legal items** carry "Best practice" or "Judgment call" and "not legal advice" beside them. Never claim compliance.
- **Platform facts** are written "AI Studio, as last checked", never "AI Studio can't".

## Words to explain on first use

Use these glosses, or something as plain, the first time a word appears:

| Word | Say |
|---|---|
| CRM, GHL | The customer list your forms feed; here HighLevel (GHL, GoHighLevel) |
| Sitemap | The list of pages you give Google |
| robots.txt | The file that tells search engines what they may read |
| Search Console | Google's free tool showing whether your pages are listed |
| Structured data | Hidden business details written for search engines |
| Lighthouse | Google's speed test |
| SPF, DKIM, DMARC | Records that prove email from your domain is really yours |
| Repair session | A working session where we fix one area, which you approve first |

## Severity

Each finding gets one word:

- **Urgent:** costing leads, money or trust now, or legal exposure now. Examples: forms not reaching the CRM; a checkout with no terms; invented reviews; an unclaimed admin; a cookie choice that changes nothing. If an Urgent finding is Unverified, still list it Urgent and say what test settles it.
- **Important:** a real weakness that isn't costing anything yet.
- **Nice to have:** worth doing when the rest is done.

An area's scorecard status follows its worst finding: any Urgent is **Urgent**, any Important is **Needs work**. With only Nice to have or none, it's **Good** if most of its checks ran. If most couldn't (no live site, an answer still missing, part of the project not seen), it's **Not checked**, and its line says what would settle it: Good means checked and fine. An area that doesn't apply is **Not applicable**.

## One finding

Every finding has these, in this order. Start with the severity and a plain title.

- **What we found:** one or two sentences, in words the owner would use.
- **Why it matters to your business:** the cost in leads, money, trust or time.
- **How sure we are:** Measured, Estimated or Unverified, with a few words on why.
- **Effort:** Small (a quick change), Medium (most of a repair session) or Large (a session or more).
- **Who fixes it:** a repair session; you, in GHL or AI Studio; or your accountant or lawyer.
- **Best practice or judgment call:** pick one.

## The report, in order

Use these headings, in this order, with these names. Replace everything in angle brackets.

```markdown
# Website check: <business or site name>
<date, YYYY-MM-DD> · <live address>

## Summary
<Three to five sentences: the state of the site, the most important fix, and what is going well.
Say what an audit is not: nothing on the site was changed.>

## Scorecard
| Area | Status | In one line |
|---|---|---|
| Speed | Good / Needs work / Urgent / Not checked / Not applicable | <plain line> |
<one row for each of the ten areas, in the order under "Findings by area">

## Fix first
<Up to five findings, Urgent first, then the most valuable. One line each: what, and why it matters.
If nothing is Urgent, say so.>

## Findings by area
<One heading per area, in this order: Speed; Design and usability; SEO and AI crawlers;
Truthful content; Forms and CRM; Selling and checkout; Legal and privacy; Platform health;
Admin; Launch and care. Findings inside an area go Urgent first.>

### <Area>
<A Good area: one line on what was checked. A Not checked area: one line on what couldn't run
and what would settle it. A Not applicable area: one line on why.
Anything checked in code only says so.>

**<Severity>: <plain title>**
- What we found: …
- Why it matters to your business: …
- How sure we are: …
- Effort: …
- Who fixes it: …
- Best practice or judgment call: …

## Only you can do these
<Settings, accounts and decisions outside the code. Each: what to do, in a short step or two,
and why it matters. Include the owner's own decisions (never answered for them), and any check
only they can run, such as confirming the editor claim.>

## What we couldn't check
<Each: what, why (needs the live site, a permission wasn't given, needs your login), and what
would settle it. A form test that wasn't allowed reads "Forms: checked in code only".>

## Today's numbers
| Measure | Today | Target | How we know | After repairs |
|---|---|---|---|---|
<Fill from the checks. Leave "After repairs" empty: the re-check fills it.
Say how many test runs the phone numbers come from (one if lighter checks).>

## Repair plan
<Suggested order, with the default from `sessions.md`. Say why an Urgent area jumped the queue.
Number only phases that have work. Never call a Not checked area "no work": say it waits on a check.
Keep it suggested until the owner agrees the order.>
1. <Area>: <what it fixes, one line>
   `Start a new session and say: "Continue the AI Studio audit: repair phase 1, <area>."`
<…>
Last: `Start a new session and say: "Continue the AI Studio audit: re-check."`

## Footer
- Report date, and platform facts last checked (October to November 2026). The AI bot list was last checked <date from the tool>.
- Lighter checks were used: <what was skipped>. (Only if they were.)
- Not legal advice. This report never says the site is compliant.
```

**Today's numbers rows** (use the ones that apply; add a row for any other number the report relies on):

| Measure | Target |
|---|---|
| Home page download on a phone (KB) | Under 500 KB |
| Google's speed score, phone | 90 or more |
| Time until the biggest thing appears | Under 2.5 s |
| How much the page jumps while loading | Under 0.1 |
| How long the page is frozen to taps | Under 200 ms |
| How fast the server starts answering | Under 0.6 s |
| Other companies' code before the page appears | None |
| Pages with no description | 0 |
| Text that may be filler, still awaiting your decision | 0 |
| Cookies set before any choice (if a banner offers one) | Essential only |
| Test enquiry arrived with everything | Passed, Failed or Not tested |
| Open findings: Urgent / Important / Nice to have | 0 / 0 / 0 |

Targets are judgment-call starting points from `../building-ai-studio-websites/references/05-performance-seo.md`.

**Repair phases** use the default order in `../../shared/sessions.md`: Speed and SEO; Truthful content; Design and usability; Forms and CRM; Selling and legal; Platform and care (Platform health, Admin, Launch and care). Skip a phase with no work.

## Single-area version

When the owner named one problem or area, write the same sections for that one area, shorter:

- **Summary:** what was checked and the answer. Add one line for each Urgent item seen outside the area, and don't audit it.
- **No Scorecard.** Skip it.
- **Fix first, Findings by area** (that area only), **Only you can do these**, **What we couldn't check**: as above.
- **Today's numbers:** only that area's rows.
- **Repair plan:** one repair line, then an offer of a full audit afterwards.
- **Footer:** as above.

## Worked example

One finding, for a fictional business, to show the plain-English level. Don't copy its wording or numbers.

### Forms and CRM

**Urgent: The contact form says thank you even when sending fails**
- What we found: After someone presses Send, the page shows "Thanks, we'll be in touch" straight away. It doesn't wait to hear whether the message reached your customer list (CRM).
- Why it matters to your business: If sending ever fails, the visitor believes you have their enquiry and you never see it. That is a lost customer, with no way to know.
- How sure we are: Measured in the code, which shows the thank-you appears first. Unverified whether any real enquiry has been lost: that needs a test enquiry.
- Effort: Small.
- Who fixes it: A repair session.
- Best practice or judgment call: Best practice.
