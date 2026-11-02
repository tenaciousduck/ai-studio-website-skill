# Forms, CRM and consent

Not legal advice. Canada's anti-spam law, CASL, was the first site's basis, and it's strict enough to be a safe default. Check the rules for each client's country: `legal-canada.md`, `legal-us.md`. Have someone qualified review privacy wording. CRM behaviour was observed on one GHL account in October 2026, so read back every field the site sends.

## Contents
- Sending forms
- CRM triggers
- Standard tags and workflows
- Consent
- Attribution
- Testing without creating junk
- Editing GHL through a browser

## Sending forms

**Send every form from the server,** using `templates/src/lib/ghl-submit.ts` and `ghl.functions.ts`:

- The event type must be `external_form_submission`, with an underscore. AI Studio's `tracking.ts` uses a space; GHL answers "ok" and never creates a contact. All sign-ups were silently lost until a live check found this.
- Show success only after the server confirms. Fire-and-forget forms said "You're on the list" whatever happened.
- Retry once on a network error, timeout or 5xx, never on a 4xx. Use an 8 second timeout.
- Log failures with the form id and status only, never personal details.
- Keep long context fields, such as page address and browser name, from rejecting a submission: cut them, don't refuse.
- Stop double submits. For orders, use a per-order marker so a refresh can't send twice.
- Allow a `GHL_TRACKING_ENDPOINT` override, so a local stub can stand in.
- Add spam protection. The first site had none, so a bot could create contacts and client tasks. Default on new sites, unproven: a hidden trap field plus a basic server limit per visitor. Test that real sign-ups still pass.

**Custom fields:** ids live in one file. Send by id. Never rename, retype or recreate a field the site writes to. A contact field holds one value, so a repeat customer overwrites it. Keep history in notes.

**Turn off "Allow Duplicate Contact"** (match by email, then phone), or a form can create a second contact beside the one holding the order.

**The mapping source of truth:** a form appears in GHL's trigger list only after one real submission.

## CRM triggers

- New contacts don't fire "Contact changed" triggers. Start form workflows on **AI studio form submitted**, filtered to the form.
- "Contact changed" on a field does fire for an existing contact, such as a field set after checkout created them.
- Order flows start on **Order submitted**, filtered to the product. It fires for AI Studio's checkout.
- GHL's If/else can't read order address fields, but the checkout copies the billing address onto the contact. Check Country and State there. Values may be codes.
- When inserting an If/else mid-workflow, GHL hangs existing steps under the **first** branch. Make the normal path the first branch.
- If/else branches don't rejoin. Use a Go to step.
- "Today + 2 years" is an Update field step, then a Math operation.
- A date-based workflow uses Custom date reminder, with "match on the year" ticked.
- Renaming a tag doesn't update workflows that use it.
- Default sources show `ai_studio` (GHL's name for its form tool). Set source to "Website" with a helper workflow; let tags carry detail.
- Refunds live in Payments → Transactions, not Orders.
- Replies: GHL has no per-email reply-to. Set the forwarding address. Check whether a sending domain and DMARC are set.
- Audit log trick: Settings → Audit Logs → row's eye icon → Modified Details shows exactly what GHL received. This found that one consent field never saved, though the site sent it by id. The cause is still unknown, so a workflow writes that field now.

## Standard tags and workflows

**Tags are `namespace:thing`, lowercase with hyphens.** They record what happened. No workflow starts on a tag. Describe each tag in Settings → Tags.

| Namespace | Meaning | Examples |
|---|---|---|
| `event:` | Something the contact did | `event:newsletter-signup`, `event:order-<slug>` |
| `consent:` | The switch for sending | `consent:news` |
| `<type>:` | Item of interest | `product:<slug>`, `service:<slug>` |
| `sys:` | System states | `sys:needs-details`, `sys:test-record` |

**Workflows are `LANE-NN · Purpose`,** edited in place so ids stay stable:

| Lane | Purpose |
|---|---|
| `LEAD` | Sign-ups, messages |
| `ORD` | Orders |
| `CON` | Consent |
| `HLP` | Helpers such as contact source |
| `<ITEM>` | One item's kit, guarded by a slug check so forms can be reused |

Folders: 10 Sign-ups · 20 Orders · 30 Consent · 50 Item kits · 90 Helpers · 00 Archive. Retire by renaming to `zz-retired`, set to Draft, not deleting.

Reuse by slug instead of copying workflows. Send a `slug` field with forms, so one workflow can serve future items. Document every workflow in `docs/ghl-setup.md`: name, id, trigger, re-entry, steps. Give the client tasks, not just tags. Tasks are what get done.

## Consent

**Three layers:**

- **Tag** (`consent:news`): who may receive marketing. Send only to this tag.
- **Fields:** status for filtering: basis, date, expiry.
- **Note:** the proof. Every consent event writes a timestamped note with the exact wording, source and workflow. Several consents stack up, and a note survives what a field can't.

**On Canadian law, as used on the first project:**

- Express: a ticked box with clear wording. It lasts until unsubscribe.
- Implied by purchase: 2 years. Set an expiry and remove the tag when it passes, unless the basis has become express. A purchase never overwrites express consent.
- Memberships and subscriptions: the 2 years starts when the relationship ends, so don't expire a current member.
- An inquiry doesn't get a marketing tag in this standard, even though the law allows a limited window. Offer an optional box.
- A one-off alert sign-up gets that alert and nothing else.

Contacts that existed before the standard carry no consent. Don't add `consent:news` to them unless they opted in.

**On the page:**

- Boxes start unticked. Keep exact wording in one constant and send that wording with the form.
- Show the sender line under every sign-up: name, business name, mailing address, contact email, unsubscribe. Fix this in code (`templates/src/lib/sender.ts`). If buyers may get news, say so beside the checkout too, because that page has no sign-up form.
- Age: ask each client. Use an 18+ line on anything sold, and an age check on sign-ups only where minors are likely. US rules treat a simple tick box differently: see `legal-us.md`.
- Cookies: don't copy a generic Accept or Decline banner. The first site's choice changed nothing. See `09-legal.md`.
- Emails need a footer address and unsubscribe link. GHL adds the link; check the address.

**Privacy page:** contents, cookies and how to describe providers are in `09-legal.md`. Keep it accurate as flows change, and get client sign-off on each change.

## Attribution

- Tag outgoing order links with `utm_source`, `utm_medium` and `utm_content=<placement>` (nav, home, item page).
- Marketplace links need their own tools, such as Amazon Attribution.
- Form tracking creates CRM contacts, so never use it for click or reading analytics.

## Testing without creating junk

- While building, stub `fetch` or point the endpoint at a local stub. Real submissions create real contacts.
- Live tests use `name+sitetestN@…`, tag `sys:test-record`, and a list for the builder to delete. Remove them from any scheduled wait, or they'll get the real email.
- A contact-form test creates a real task for the client, so ask first.
- Test each workflow by reading the contact afterwards: tags, fields, note, email, source. A stored "ok" proves nothing.

## Editing GHL through a browser

GHL's editor fights automation. Claude can build workflows with the builder signed in, but expect:

- Clicks that only hover, so click twice and verify with a zoom. Screenshots lag by about one action, so wait 2 seconds.
- `cmd+a` then Backspace on the canvas can trigger a delete prompt. Cancel it. Use End and repeated Backspace.
- Pick merge fields from the picker; typed ones can vanish.
- Use the action search box, because recent lists reorder.
- A set From Name requires a From Email.
- Viewport emulation breaks clicks, so reset to desktop.
- Tags: reload between creates.
- If a GHL connector is available, prefer it.
