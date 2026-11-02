# Admin area and content

## Contents
- Does this site need an admin?
- Principle
- What goes in the editor
- The data model
- Where prices live
- Traps
- Editing real content safely
- Known weak spots to do better next time
- Unproven additions

## Does this site need an admin?

Don't assume so. An admin adds sign-in, database rules, testing and a claim step at launch. Ask these before scoping one:

1. What will change after launch? List the real items.
2. How often will each change: weekly, monthly, a few times a year?
3. Who makes the change, and how comfortable are they with forms?
4. Could it wait a day for the builder? What's lost if it does?
5. Is there repeating content, such as products, staff, listings or events?
6. Does another tool already hold it, such as the CRM, a booking calendar or Google Business Profile?
7. Who fixes it if an edit breaks a page, and is that in the budget?

| Result | When | Build |
|---|---|---|
| No admin | Changes are rare, and the builder makes them | Content in code. Skip `/auth`, `/admin` and the sign-in toolkit |
| Light | The owner changes a handful of things: hours, an announcement, a few photos, or one short list such as staff bios | One settings page with a few text and photo fields, plus that list |
| Full | Several kinds of repeating items, or the owner edits many pages often | The tabs below |

These are judgment calls. Record the answers and the result in the spec. Starting small is safe: AI Studio's `/admin` can grow later.

## Principle

If the site has an admin, grow the `/auth` → `/admin` editor AI Studio created. No CMS vendor. It's a fill-in-the-blanks editor, not a page builder: text boxes, uploads, on/off switches, ↑↓ ordering.

Leave out drag-and-drop, rich-text toolbars, layout controls, section reordering, and site-wide font or colour pickers. The goal is for the client not to need AI for routine changes, without a complex build.

**Design rule:** on a Full admin, every new section's text and images come from the admin unless there's a reason not to. Add the field in the same task as the section. On a Light admin, only the agreed fields.

## What goes in the editor

| Tab | Holds |
|---|---|
| Items (products, services, staff, listings) | Grouped fields, "View page" link, visibility, ↑↓ order, per-item colours with live preview |
| Pages | Per-page wording, homepage section switches, announcement bar, featured item, images |
| SEO | Per-page title, description, share image |
| Settings | Name, email, social links |

Each field needs a plain label and a help line saying where it appears. Warn on bad input rather than failing, such as an invalid link or colour. Lock the address (slug) after first save, and block duplicates, or "Add" can overwrite an existing item.

Things to keep in code on purpose: the legal sender identity, because it must never be blank where consent is asked; and the terms and privacy wording, because a stray save must never change what a buyer agreed to. Things to keep out of public view: the name of any platform or vendor the client doesn't want shown.

## The data model

- Each item is a row. Lists such as team members, gallery and order options live in `jsonb`.
- A `page_copy` `jsonb` column on items and settings holds optional wording. **Blank always means the built-in default**, so a new field can't break a page and `{}` renders as before.
- Option-style data carries a kind (`buy here`, `store link`, `alert`), so options drive what renders, and more can be added later.
- Every read goes through a cleaner that trims and drops invalid entries. A malformed row must not crash a page. Keep cleaners pure so they can be tested.
- Validate links at render too. A `javascript:` link typed into a field must not become a button.
- Public reads use the site's visibility rule, with row-level security as well as app filtering.
- Writes need both locks: a signed-in server function (`requireSupabaseAuth`) and a database rule (`has_role`). A hidden button is not a lock.
- Pick a product from a dropdown fed by the live catalog. Don't paste price ids. Store the id, show the name, and show a "Saved product (…)" fallback if it disappears.
- Fetch the site's chrome (settings, featured item) once in the root loader. Different loaders picking "the featured item" can disagree.

## Where prices live

Decide this per project, and tell the owner plainly.

- **Sold through the checkout:** the price lives in the catalog, and is changed in HighLevel Payments. The site reads it live, so the admin can show it but not edit it.
- **Shown but not sold online, such as a menu:** the price is ordinary content. Keep it in the database, editable in the admin.
- **Both:** one source per item. Two copies of a price will drift.

## Traps

**Saved wording beats code.** If a box was ever saved, changing the default in code does nothing. Before any copy change, check the latest backup or the admin data. If there's a saved value, it needs an admin edit too.

**Validation strips new keys silently.** A new wording key must be added to the zod schema as well as the cleaner, or the save drops it and looks successful. Keep schema and key list in a tested module with a parity test.

**Saves must refresh the site.** With a long root cache, call `router.invalidate()` next to the query invalidations after every mutation.

**Stale list updates.** Upload callbacks and fast reorders can act on an old list and lose an edit. Disable controls while busy, and capture event values before deferred updates.

**Reporting success on nothing.** A reorder that updates zero rows must not say "Saved". Count the result.

**Fallback then overwrite.** If an admin read falls back to defaults after an error, then a save could write those defaults over real values. Admin reads should show the error instead.

**Sign-out and cached admin data.** Remove admin-only query caches on sign-out, and key them by user.

**Sign-in that seems to do nothing.** It's usually a failed editor check, not bad credentials. Show "Couldn't check editor access", not "not an editor", on technical errors.

**Uploads.** Shrink in the browser (`templates/src/lib/shrink-image.ts`). Never change the file type: PNGs may mean cut-outs, and share previews need a common format. If anything fails, upload the original. The client should never see an upload fail because of optimization. Set a size and type limit on the server as well.

**Uploaded images on public pages.** They miss the build's image copies. See `05-performance-seo.md`.

## Editing real content safely

Edits to the live database are live immediately.

1. Follow the setup file on database changes, which defaults to asking first. The builder signs in themselves.
2. Back up first: read the rows through the app, save them with a date in the git-ignored ledger folder, and store original images too.
3. Save through the app's own server functions, so validation and cleaners run.
4. Read back and diff. Only the intended fields may change. A diff caught harmless side effects last time, and proved only four fields changed in another.
5. Check the page.

Run a local copy pointed at the real database for this, from the commit that's live, and confirm that before saving: an older checkout's validation can strip fields it doesn't know. Say clearly that it's real data. A different port is a different origin, so a saved session won't carry over.

Never use `form_input`-style automation for React checkboxes; real clicks update state.

## Known weak spots to do better next time

From the first build's deferred list:

- `primitives.tsx` passed 1,200 lines. Split list editors early.
- Buttons under 44px, no upload limit on the server, duplicated list inputs.
- No editor for some JSON fields, such as testimonials.
- A claim-the-first-admin race, needing a partial unique index.
- A second editor can't be added from the interface.

A clear "saved, it's live on the site" message matters: nobody should have to guess whether a save worked.

## Unproven additions

Default on a Full admin, not yet built anywhere. Mark them unproven in the spec, and record what you learn here.

- **Needs attention list:** blank required fields, heavy images, missing descriptions.
- **Activity log:** who changed what, and when. Useful once two people edit.

Optional, when the client asks: undo or saved history, a way to invite a second editor, character counters on titles and descriptions, and larger phone-friendly controls. Draft-and-preview isn't recommended by default, because a small owner usually wants a save to go live.
