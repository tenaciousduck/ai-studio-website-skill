# Your customer list: a short guide

Your website's forms feed a customer list, called a CRM (customer relationship management tool). Yours is HighLevel, also called GHL or GoHighLevel. This page explains how to keep it tidy so you always know who signed up, what they agreed to, and why.

Last checked October to November 2026, on one HighLevel account. Screens change, so check what you see.

## Four tools, four jobs

- **Fields hold the current value.** A field is one box on a contact, such as "last order". A new value replaces the old one.
- **Tags record what happened.** A tag is a sticker on a contact, such as "signed up for news". Tags only label; in this standard nothing starts from a tag.
- **Workflows do things.** A workflow is a set of automatic steps, such as sending an email or giving you a task. It starts when something happens, such as a form being sent.
- **Notes keep proof.** A note is dated and stays. Notes stack up, so history survives what a field would overwrite.

Quick test: need today's answer? Use a field. What happened? A tag. Should something happen next? A workflow. Need to prove it later? A note.

## Naming things (best practice; any steady scheme works)

- **Tags** are `namespace:thing`, lowercase, with hyphens. The namespace is the kind of label: `event:` for something they did, `consent:` for permission to email, `product:` for what they're interested in, `sys:` for system use. Example: `event:newsletter-signup`. Describe each tag in Settings, Tags.
- **Workflows** are `LANE-NN · Purpose`. The lane is the area: `LEAD` for sign-ups and messages, `ORD` for orders, `CON` for consent, `HLP` for helpers. Example: `LEAD-10 · Welcome a new sign-up`. Edit a workflow in place instead of copying it, so everything pointing at it keeps working.
- **Folders** are numbered so they sort: 10 Sign-ups, 20 Orders, 30 Consent, 50 Item kits, 90 Helpers, 00 Archive. Retire a workflow by renaming it to start with `zz-retired` and setting it to Draft. Don't delete it.
- **Before renaming a tag,** check your workflows. HighLevel doesn't update them for you.

## Consent has three layers (best practice; not legal advice)

1. **A tag** says who may get marketing. Send marketing only to people with the consent tag.
2. **Fields** show the status for filtering: why you may email them, the date, and when it runs out.
3. **A note** is the proof. Each time someone agrees, a dated note records the exact words they saw and where they agreed.

People who were in your list before you set this up have no recorded consent. Don't give them the tag unless they opted in. Rules differ by country, so have someone qualified review your wording.

## Testing without junk contacts

A real form submission creates a real contact, and your workflows run on it, including emails and any task for you. So:

- Test with your own address plus a label, such as `you+sitetest1@your-domain.com`. Replies still reach your inbox.
- Tag the test contact `sys:test-record`.
- Then open the contact and read it: tags, fields, note, source and any task. A saved "ok" proves nothing.
- Delete the test contact afterwards. If it's waiting inside a scheduled step, remove it first, or it will get the real email later.

## "My form isn't in the trigger list"

HighLevel lists a form as a workflow trigger only after it has received one real submission. Send one test (as above), then pick **AI studio form submitted** as the trigger and filter it to that form. New contacts don't set off "Contact changed" triggers, so don't use that one for new sign-ups.
