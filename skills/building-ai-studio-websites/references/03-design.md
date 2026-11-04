# Design

## Contents
- Taste: ask each client
- Concept rounds
- Mockups before building
- Parity: why the site won't match
- Page patterns
- Motion
- Accessibility floor

## Taste: ask each client

There's no house style. Start with the client: show three sites you like, and say exactly what you like about them. Ask how the brand should feel, who it must not look like, and whether readability or distinctiveness wins when they compete. A starting point in the setup file is only a suggestion, and the client's taste wins.

What held up on the first site, and is worth checking against each client:

- Obvious calls to action beat clever layouts. The client may prefer clear and familiar over distinctive, so ask rather than assume either way.
- Repetition tires people: section after section of the same card on the same background. Vary the sections.
- A subpage must not look like the page before it, or people think nothing changed.
- Avoid large blank areas beside cards, sections that make a buyer scroll past marketing to reach the form, and buttons that scroll to something already on screen.
- Long pop-ups fail on phones. Swap the pop-up's contents with a clear back button; never stack a pop-up on a pop-up.
- Give sections breathing room, especially at the top of focused pages.

**Optional design skills.** These help, and none is required. Each has strong opinions of its own, so the client's stated taste overrides them.

| Skill | Good for | Watch for |
|---|---|---|
| `frontend-design` | General design direction | |
| `design-taste-frontend` | Research and page structure | Its square-corner, no-card and no-glow rules may not suit the client |
| `avoid-ai-design` | Catching generic defaults and invented stats | Applies to generic content, not to a look the client chose |
| `web-design-guidelines` | Interface and accessibility review | |

## Concept rounds

1. Round 1: two or three homepage directions using the client's real assets, in a browser tab. Don't polish.
2. Ask what they like in each, section by section. People often pick parts of several.
3. Include any existing site as a reference. They may prefer something about it, and saying so saves a round.
4. Once a direction is chosen, write the visual system: colours as tokens, type, radii, shadows, motion.
5. For anything multi-brand, separate the **frame** (fixed site identity) from **worlds** (per-item colour themes stored as data).

Fonts: choose licensed fonts that can be self-hosted from the start. See `05-performance-seo.md`.

## Mockups before building

Mock up pages before building them, at the depth chosen in `SKILL.md`, and get approval. Work in plain HTML with real assets, served from a small local server.

- Keep mockups in the repo at `design/concepts/`, add `design/**` to ESLint ignores, and never serve them from the site.
- Mark annotations clearly, such as template notes and placeholder boxes, so nobody mistakes them for content.
- For interactive choices, offer two labelled options and let the client mix them. "B, but move this up" is the usual answer.
- Any words you draft in a mockup are drafts. If real content has rules, check them before showing.

## Parity: why the site won't match

After the first merge the live site looked nothing like the approved mockups. The code was right; the cause was the data.

1. The real database held old AI Studio images and blank fields.
2. Sensible rulings had hidden sections, such as a draft product.
3. Hard-coded wording differed from the mockup.

**Prevent it:**

- Agree the meaning of "identical": layout, function, every word, and which annotations are excluded.
- Put the mockups' exact words into local test data, and build against it.
- Plan content entry as a task, with a backup, before anyone reviews the live site.
- Compare real-data pages with test-data pages, as text and alt text, after entry. Only what's intentionally blank may differ.
- Build the page by page comparison table for parity work: element, exact mockup string, where the site's value comes from.
- Keep accessibility and compliance additions even where mockups omit them: skip links, validation, cookie notice.

Images: built-in site images live in the repo so they can be optimized. Editor uploads live in storage.

## Page patterns

**Template pages:** sections appear only when their fields are filled, so a sparse item still looks complete.

**Item page:** one layout that worked, to adapt to the client's look: dark hero, an overlapping action card near the top, a light story section, a full-bleed art band, tinted detail section, one dark feature panel, a swipeable gallery, then related items and sign-up.

**Primary action:** one action per place. Every button of the same kind behaves the same way. Off the item page, it opens a pop-up with the options. On the page, it scrolls to the order card when that's off-screen.

**Checkout page:** a distinct hero with no competing buttons, then the task. Collect what the checkout can't, such as a name, country or terms agreement, before payment. Show a compact summary row with a Change link once done. Put reassurance below the form.

**Focused landing page:** no nav or footer, for links in social bios. Use a route flag such as `staticData: { chrome: false }`, and give it its own skip link.

**Dates that change labels:** derive state from a real date, not a status field. Separate "visible" from "released". Render with the server's time, then re-check in the browser, so a cached page still flips on the day. Test with a dev-only `?now=` override, including daylight-saving days.

## Motion

- Buttons that jump within a page: eased scroll that lands below the sticky nav. Don't stack `scroll-mt` on `scroll-padding-top`.
- Links to other pages: a quick cross-fade through view transitions. Unsupported browsers switch instantly.
- Use the router for scrolling, so Back and Forward work. A `pushState` bypass broke them.
- Honour reduced motion everywhere.
- Pop-ups sit above the cookie notice. Check z-order at 375px in a fresh browser, with the notice showing.

## Accessibility floor

Contrast meets WCAG AA. Calls to action are real buttons at least 44px tall on phones. Skip link first in tab order. Focus returns to the opener when a pop-up closes. Form errors move focus and use `aria-describedby`. Informative images have real alt text. Decorative ones follow the owner's alt policy: `alt=""` by default, or a short description built from page data if the owner chose that (see `05-performance-seo.md`). No sideways scroll at 360px. To check whether a button label wraps, count lines of text: a fixed-height button measures the same on one line or two. Run an accessibility pass before the whole-branch review; the first found one critical and five important issues the task reviews missed.
