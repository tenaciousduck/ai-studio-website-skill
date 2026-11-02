# Commerce and payments

Observed with AI Studio Payments (HighLevel native payments over Stripe) on one fixed-price item. Last checked: October to November 2026. Run the capability questions in `01-kickoff.md` first.

**Reported in HighLevel's changelog, not tested here:** Payments works only on TanStack Start apps, and other projects need migrating. It uses existing HighLevel products and payment providers. It lists one fixed price, selected variations or a full catalog, plus subscriptions, coupon codes, PayPal express and one-click upsells after payment. The changelog doesn't mention shipping, tax or quantity.

## Contents
- How the checkout works
- What it can't do
- Designing around it
- Choosing the route
- Recurring payments and memberships
- After payment
- Testing
- Going live

## How the checkout works

- AI Studio installs a sealed block in `src/integrations/payments/`. Never edit it; it's regenerated.
- The block stays on the site's domain, while a few redirect payment methods leave and return.
- To open it, write `{ items: [{ priceId, quantity: 1 }] }` to localStorage key `vibe.checkout.selection.v1`, then mount `<PaymentCheckoutBlock fields onSuccess />` on a page or in a pop-up.
- `onSuccess(order)` gives the order id, buyer and lines. After a redirect payment, the buyer isn't included; use `readCheckoutOrder()`, which reads session storage and may be empty in a fresh tab.
- The public catalog (`listCatalogProducts`, `getCatalogProduct`) gives names, prices and `sold_out`. Show live prices from it, and fetch it once per page.
- The order and buyer contact land in GHL Payments, not through the site's forms.
- The checkout's Cloudflare security check won't load on localhost, and failed in the built-in browser. Only a person on the hosted site can place a test order.

## What it can't do

As found on the first project:

| Need | Reality | What worked |
|---|---|---|
| Add shipping | No shipping step, even with rates on the product. Billing address only | Shipping included in the price |
| Separate shipping address | Not available | Ship to billing address, and say so on the page |
| Custom question | Not available | Collect before payment on our page, send after |
| Terms box | Not available | Required tick box on our page before the block mounts (`09-legal.md`) |
| Limit quantity | No setting. The stepper is the block's | Hide with one CSS rule, and check for it after updates |
| Collect less | The optional phone box shows by default | Hide it in the block's `fields` setting unless the carrier needs a number |
| Limit orders per buyer | Not available | Handle by hand |
| Block countries | Not available; the billing form allows any | Soft gate before payment, plus a workflow catch |
| Remaining stock | `sold_out` only, no count | Stock in GHL, manual badge, no live "N left" |
| Tax | Nothing added on the one test order; the setting can't be read from code | Decide with the client's accountant, and check the setting matches the page |
| Duties | Nothing on the page or in the checkout | State who pays beside the country choice and in the terms |

A live "N left" counter would drift, and a false scarcity claim is a risk. Keep scarcity wording manual and true.

## Designing around it

- **Collect first, pay second.** Our page takes the extra details and saves them per item in session storage. Then the block mounts.
- **Name the workaround in words.** The page must match reality: "Shipping included to Canada and the mainland US. The billing address is where it ships."
- **Catch what the page can't stop.** A workflow's first step checks the country before any confirmation email. If outside the area: refund email, refund task for the client, no consent, no packing task. Check every other workflow that fires on the order too. Treat an empty country as in-area, because a wrong refund email to a real buyer is worse than a missed catch.
- **Plan the safety net.** If a required detail doesn't arrive within 15 minutes, tag `sys:needs-details`, email the buyer, and task the client. A check on a contact field can't catch a repeat buyer's lost detail, because the old value is still there.
- **Hidden elements are not locked.** Say so and accept it, or choose another route.
- **Agreement comes first too.** Step 1 holds the tick box, step 2 the seller line and the block. A buyer returning from a redirect payment skips step 1. Check the block still opens after any change to step 1.

## Choosing the route

| Situation | Route |
|---|---|
| One or a few simple products, one price | AI Studio block on our page |
| Needs shipping rates, or tax, or real inventory rules | GHL funnel checkout page (judgment call; untested so far), or a commerce platform |
| Subscriptions, variations | Reported as supported, untested. Test before quoting |
| Bookings, deposits | Unknown. Run capability questions first |
| Selling through a marketplace | External links with placement tags |
| A product not orderable yet | Email alert with one-time consent |

Decide this before mockups. It decides the page.

**Not yet tried: deposits and custom orders.** The checkout sold one fixed-price item. Before promising a deposit, find out whether a deposit can be its own product, how the balance is collected, and what triggers the second payment's workflow. Also settle the business rules: lead time, daily capacity, ready-by date, deposit refunds and any regulated wording, such as allergens. Record what works here.

## Recurring payments and memberships

HighLevel reports subscriptions work, but none has been tested here. Before quoting one, ask AI Studio and then test on the hosted site:

- Can the buyer see and cancel a plan themselves, or does the client do it in HighLevel?
- What happens on a failed renewal? Are there retries, and who's told?
- Do renewals fire a workflow, and can it tell a first payment from a renewal?
- Can a price change or a pause be applied to an existing plan?

**Test list:** first payment, a renewal, a failed card, a cancellation, and access or status updating after each.

**Terms:** the price and billing cycle, the renewal date, how to cancel, any notice period, refunds on cancelling, and price changes. Say these beside the button as well as in the terms. Membership contracts may have local rules, so see the country notes.

## After payment

1. `onSuccess` fires. Mark the order, so a refresh won't resend.
2. Send details through the server with the order id and the item slug.
3. A workflow writes a note: details plus order number. The client works from notes and order numbers, not the contact field.
4. Create a task for the client, not just a tag.
5. Handle: a paid order with no details, paying in another tab, a second order in the same tab, closing the tab mid-send.

The thank-you page shows what happens next and how to reach a person.

## Testing

Test mode first, on the hosted site, with a person at the keyboard. Stripe test cards work; `4000 0025 0000 3220` triggers the bank "is this you?" check.

- [ ] Happy path, including order, contact, tags, note, task and emails
- [ ] Terms version reaches the CRM, read back from the contact or audit log
- [ ] Price and currency on the page, in the checkout and on the receipt
- [ ] Declined card
- [ ] 3D Secure check
- [ ] Redirect return, including a return in a different tab
- [ ] Reopened checkout after payment finished elsewhere doesn't offer to charge again
- [ ] Out-of-area address
- [ ] Missing-detail safety net
- [ ] Stock of 1: the page flips to sold out, and an open checkout is refused
- [ ] Reply to the confirmation reaches an inbox someone reads
- [ ] Refund path, and whether card fees are kept
- [ ] Reset stock afterwards, since test orders lower it
- [ ] For recurring plans, the test list in "Recurring payments and memberships"

## Going live

Switching mode is a Payments setting and needs no code. Only the builder or client does it. Product and price ids should survive, but verify.

- [ ] Payout account correct
- [ ] Live price correct
- [ ] Admin's product dropdown still resolves
- [ ] Card statement name recognisable, because an unfamiliar name causes disputes
- [ ] Tax position confirmed with whoever does the books
- [ ] Terms and privacy published first, because new terms can't bind orders already placed
- [ ] Privacy page approved for current flows
- [ ] Stock reset; test contacts removed
- [ ] Publish once, and confirm the checkout loads

Best practice: the builder or client places one real order and refunds it; Claude never does. It's the only proof that payouts, the live price and the workflows work together. Afterwards, reset the stock and clear that contact and its tasks.
