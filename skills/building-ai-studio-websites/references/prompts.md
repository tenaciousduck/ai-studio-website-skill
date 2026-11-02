# Prompts for AI Studio

AI Studio's chat will happily "improve" things. These prompts worked because they narrow its job, ban side effects and demand proof. Keep each as a file in `docs/ai-studio/`, so the builder can copy it, and say what it does in one sentence before they paste it.

## Contents
- First prompt for a new project
- Questions only
- Schema migration
- Register custom fields
- Briefing for a shared decision

## First prompt for a new project

Draft, not yet tried on a real kickoff. The builder pastes it into AI Studio to start.

```text
Build a simple starting version of a website for [business]. A developer will
finish the design and build from the GitHub repo, so keep this version plain.

Please set up:
1. [Only if needed: Cloud, for the database, sign-in and file storage.]
2. [Only if the site needs an admin: /auth and a basic /admin where one editor can change the site's content.]
3. One public home page, plus [page names].
4. [Form tracking for: the forms this site needs, such as a contact form.]
5. [Only if selling: Payments, with the sealed checkout.]

Rules:
- Do NOT invent content. No fake reviews, quotes, statistics, names or sample
  text presented as real. Where content is missing, write [PLACEHOLDER: what's needed].
- Do NOT add images of people, and don't use placeholder links that look real.
- Don't spend effort on visual polish.
- Use the stack and template you normally use.

When you're done, tell me which template you used, every integration you enabled,
which files are generated or must not be edited, and the preview address.
```

## Questions only

```text
Please answer these questions only. Do not change any code, files, settings,
products or prices, and do not publish.

[Two or three lines on what exists.]

1. [Question]
2. [Question]

Where you're relying on code, name the file and line. If something needs a change
on your side, describe it but don't make it. I'll confirm first.
```

## Schema migration

```text
Please apply [one / two] schema migration(s) to this project's Cloud database
using your Cloud migration tool. The SQL was written and reviewed outside
AI Studio, so use it exactly as written.

STRICT RULES (follow all of them):
1. Use the Cloud migration tool, as [one migration / separate migrations in the
   order shown]. Let the tool record the migration file the way it normally does.
2. Use the SQL below exactly as written, character for character, comments
   included. Do NOT rewrite, "improve", reformat, combine or split it. Do NOT add
   other columns, indexes, triggers, functions, policies, seed data or default rows.
3. Only change the database. Do NOT edit any app code: nothing in src/, no
   components, routes, styles, package.json or config files. Code for these fields
   already exists and will be merged separately. If your tool regenerates a file
   (for example src/integrations/supabase/types.ts), don't make any other edit to
   it, and tell me that it changed.
4. Do NOT drop, rename or change any existing table, column, data or policy
   [except: name exactly what this SQL does].
5. If any statement fails, STOP. Do not try a workaround. Reply with the exact
   error message and which statement caused it.
6. Do NOT publish the site.

When you're done, tell me:
- the exact file name the tool recorded in supabase/migrations/;
- every other file that changed (if any).

Then run these READ-ONLY checks and paste the results back to me:
- [select ... information_schema.columns ...]
- [select ... the rows affected ...]
- [select ... from pg_policies ... if policies changed]

----- MIGRATION -----
[SQL. Idempotent where possible: ADD COLUMN IF NOT EXISTS, DROP POLICY IF EXISTS.]
```

**After it replies:** verify read-only yourself, using the publishable key if the data is public. Check AI Studio's commit touched only the migration file and `types.ts`. Merge `origin/main` into your branch, and delete your own draft migration file.

## Register custom fields

```text
Please register these custom contact fields for this project's form-tracking
integration, using your custom-field registration tool. Nothing else may change.

STRICT RULES:
1. Register exactly these fields, with exactly these names and types. Do NOT
   rename, "improve" or merge them. Do NOT add any other field.
2. Do NOT edit any app code, including src/lib/tracking.ts. If your tool changes
   a file, make no other edit to it, and tell me which file changed.
3. Do NOT change the database.
4. Do NOT change any existing form, mapping, tag, workflow or integration setting.
5. If a field with the same name exists, do NOT create a duplicate. Give me its id.
6. If registering any field fails, STOP and give me the exact error.
7. Do NOT publish the site.

THE FIELDS:
1. Name: `[Exact name]`. Type: text. Holds [what].

Reply with a table: field name, id returned, type as registered, files changed.
Then list the project's custom fields so I can confirm only these were added.
```

## Briefing for a shared decision

When a choice spans Claude's code and AI Studio's knowledge, write a briefing file in `docs/ai-studio/` covering:

1. The open topic, in two lines, and "answer and propose only".
2. Who does what in this project.
3. How the flow works today, with file names.
4. What lands in the CRM.
5. Case by case: what happens, and where the gap is.
6. Ideas, none built.
7. What not to change without the builder's say-so.
8. Numbered questions.
9. A short paste-this message at the end.

Merge it first, so AI Studio can read it. Bring the answer back and verify it against the code before deciding.
