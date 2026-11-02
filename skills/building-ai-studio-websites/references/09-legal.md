# Legal pages, cookies and checkout wording

Not legal advice. This chapter is a process for finding gaps and writing plain, honest pages. It was worked out for one small seller in November 2026. Country notes are in `legal-canada.md` and `legal-us.md`; read the one that applies. For anywhere else, or if the client's sales are large, say the notes don't cover it. Whether a lawyer reads the pages is the client's decision. Ask, and record their answer in writing.

## Contents
- When to do this
- Gap review first
- Decisions the client must make
- Terms page
- Agreeing before payment
- Privacy page
- Cookies
- Naming providers
- Order confirmation
- Checks

## When to do this

Ask the questions in discovery, and publish the pages before Payments goes live. On the first site the checkout went live with no terms, and new terms can't bind orders already placed.

## Gap review first

Read-only. Trace every piece of personal data, then compare what the pages say with what the site does. Report it as a doc the client can read, and keep verified facts apart from legal judgment calls.

| Where | What's collected | Where it goes | Kept how long |
|---|---|---|---|

Rows: each form, the page before payment, the checkout, after payment, every visit, website security, editor sign-in. Forms also send page address, browser details and a visit ID, so include them.

The first review found a cookie choice that changed nothing, an "Accept all" button that saved "no marketing", a public compliance claim, no refund or delay wording anywhere, nothing on cross-border duties, and no seller details at checkout.

## Decisions the client must make

Claude drafts from these answers and never invents them.

1. Who is the legal seller? Is there a registered business, and whose name is on the payment account? Is the public name a trade name?
2. Is the checkout live? Have any orders come in?
3. Which phone and address can be public, and where?
4. What's the refund and cancellation rule? What happens if an order can't be filled?
5. If shipping goods: which carrier, is it tracked, and who pays duties?
6. Is the seller registered for tax, and is the checkout's tax setting off or on?
7. What will the card statement show?
8. Will a lawyer read the pages?
9. Will anyone under 18 order? Which regions are excluded, if any?

A site that sells nothing needs no terms of sale. Services, bookings and memberships need different terms from the sample, so write them from the client's rules. For recurring payments, see `07-commerce.md`. Every site with forms or visit statistics still needs a privacy page, whatever its size.

## Terms page

- Add `/terms` to the footer and sitemap, in the privacy page's style. Use a one-line summary, "Last updated", and question-style headings. `templates/src/lib/terms.ts` is a labelled sample for one fixed-price physical product. Every `REPLACE_` is the client's decision, and the rest is a draft to check.
- **Keep the wording in code, not `/admin`.** A stray save must never change what a buyer agreed to. One shared component feeds the page and the pop-up, so they can't differ.
- Change `TERMS_VERSION` and `TERMS_UPDATED` together whenever the terms change.
- Cover: seller and contact, what's covered, the order, payment, refunds, content, liability, legal rights, governing law and changes. For physical goods, add shipping, duties, and damage and loss.

**Wording that protects better:**

- "All sales final" can't stand alone in many places, because product warranties often can't be signed away. Add a legal-rights section, and a full refund for orders that can't be filled.
- Say delivery problems go to the carrier "as far as the law allows". The real protection is tracked shipping with proof of delivery.
- Show the no-refund rule openly. A buried rule loses a card dispute.
- Never claim legal compliance or a lawyer's review. Don't disclaim data handling either: a business generally stays responsible for its helpers.
- A date in the terms goes stale. Point to "the dates on the order page when you ordered", and keep those dates accurate.

## Agreeing before payment

The sealed checkout had no terms box on the first site, so agreement went in our own step before it mounts.

- A required tick box, unticked, naming the headline rules. Stripe's dispute guidance warns that a box with only a link may not be enough, so the terms open in full in a pop-up.
- Keep the terms button outside the `<label>`, so reading them never ticks the box.
- Continue is blocked with a clear message, after the other checks in page order. The tick survives "Change".
- A buyer returning from a redirect payment must skip the box, or they get stuck.
- Above the checkout: "Sold by <seller>", Terms and Privacy links in a new tab so the checkout isn't lost, and any news-by-email line.
- Send the terms version with the order, as a registered custom field, then read it back from the first test order. On the first site it was a plain field, and whether GHL keeps those is still unproven.

## Privacy page

Written in code. It needs: who runs the site; everything in the gap table, including IP addresses and third-party names such as a gift recipient; why; who helps; where data may go and who may reach it there; email open and click tracking if used; how long data is kept; access, correction and deletion; a privacy contact; how to complain; age; changes; and "Last updated". The country notes add what's specific.

Leave out a retention period you can't confirm. Stating an unknown as fact is worse than a gap.

## Cookies

Measured on the first site on 2026-11-02, with `tools/cookie-check.mjs` and a hand check of the checkout:

| Cookie | From | Who gets it | Lasts |
|---|---|---|---|
| `__vibe_sid` | AI Studio's visit statistics (`/__vibe/analytics.js`) | Every visitor, before any choice | 30 minutes |
| `__cf_bm` | Cloudflare security | Every visitor | 30 minutes |
| `__stripe_mid`, `__stripe_sid` | Stripe | Anyone who opens the checkout | Stripe's own timing |

AI Studio's statistics show IP addresses. No off switch was found, so an Accept or Decline banner would promise something the site can't do. Ask AI Studio whether an off switch exists and how long it keeps visit statistics, because the answer may have changed.

- **Default (judgment call):** a small notice with no choice, a Privacy link and an OK button, from `templates/src/components/cookie-notice.tsx`. It's reasonable only while the site has no advertising cookies or pixels.
- **Adding an ad pixel, session replay or outside embed** makes "no advertising cookies" false. Update the page and add a real opt-in, and don't load the pixel before a yes (best practice).
- **EU, UK or similar visitors:** this default wasn't checked against their rules, which generally require consent for non-essential cookies. Get it checked before relying on it.
- For analytics, start with AI Studio's statistics if they show what the client needs. An outside tool adds cookies and changes the privacy page.
- Run `tools/cookie-check.mjs` on the live site. If a banner offers a choice, run it once per button with `--press`. Accept and Decline must end with different cookies, and nothing non-essential may load before a choice.

## Naming providers

Naming HighLevel publicly is the simplest truthful route. If an agency white-labels it, describe it truthfully, using the setup file's wording: "Example Digital Ltd. and its technology partners". Name the payment processor, and use categories for the rest, such as "a website security service" and "the carrier". Add a test that fails if the copy names a platform it shouldn't. Whoever handles client data should have a written agreement with the client (best practice).

## Order confirmation

It should carry the seller's name, address, phone and email; buyer and date; itemized price, tax and total; delivery window; the refund rule; and the terms link. It lives in GHL, so give the builder the wording. Update the CRM business name so email footers match the sender line.

## Checks

- [ ] Tests: required sections exist, no banned names, and the box blocks Continue
- [ ] Pop-up opens and closes without ticking the box
- [ ] `/terms` in the sitemap, with a test that keeps it there
- [ ] `tools/cookie-check.mjs` matches the privacy page
- [ ] Checkout's tax setting matches the page
- [ ] Card statement name matches the terms
- [ ] Confirmation email and CRM business name updated
- [ ] One real order: tick box, payment, terms version in the CRM
