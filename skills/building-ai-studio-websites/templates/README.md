# Templates

Working code from one live AI Studio site (TanStack Start, October to November 2026). Copy what the project needs and adapt it. The tests weren't copied, so write a test for each file you bring over.

Check the stack is the same first; these assume the first project's template.

| File | Does | Adapt | Needs |
|---|---|---|---|
| `image-tools/` | Makes sized AVIF and WebP copies, manifest and favicons | Goes to `scripts/image-tools/`. Add upload addresses to `uploads.json`. Run `npm install && npm run optimize`. Missing images or favicon are skipped | `sharp`, kept out of the site's dependencies |
| `src/components/responsive-image.tsx` | Every public image | Update the import paths | `image-sources.ts`, manifest at `src/lib/image-manifest.json` |
| `src/lib/image-sources.ts` | Picks copies, reserves space | Run the image tool once first so the manifest exists | |
| `src/lib/shrink-image.ts` | Shrinks uploads in the browser | Limits at the top of the file | Call it from the upload helper |
| `src/lib/request-memo.ts` | One database read per request | Use the request object as the key | |
| `src/lib/saved-session.ts` | Detects a saved sign-in or an email link | Key pattern assumes Supabase | Used by the next file and the root route |
| `src/lib/attach-admin-auth.ts` | Sends the editor's token without loading the sign-in toolkit for visitors | Swap into `src/start.ts` for the generated attacher | Also change the root route to start the session watcher only when needed. The root route must skip the session watcher for visitors with no saved session |
| `src/lib/site.ts` | Official address, canonical and absolute addresses | Set `SITE_URL` | |
| `src/lib/ghl-submit.ts`, `ghl.functions.ts` | Server-side form sending | Replace the three ids from the project's `src/lib/tracking.ts` | A `src/lib/ghl-fields.ts` exporting `GHL_FIELD_IDS`. Callers send `sessionId: getTrackingSessionId()`, from `tracking.ts` |
| `src/lib/admin-gate.ts` | Editor access states, failing closed | Reword messages | |
| `src/lib/sender.ts` | Legal sender and seller, and the sender line | Replace every `REPLACE_` value | Used by the terms and sign-up forms |
| `src/lib/terms.ts` | Terms of Sale as data, with its version | Every `REPLACE_` is the client's decision. Read `references/09-legal.md` first | `sender.ts` |
| `src/components/terms-content.tsx`, `terms-dialog.tsx` | Terms words, and the pop-up before payment | Colour classes such as `text-frame-plum` and the `INK_BUTTON` import are the first site's. Replace them. Phone shows in the seller section | `terms.ts`, shadcn dialog |
| `src/lib/security-headers.ts` | HSTS, nosniff and Referrer-Policy on every app response | Wrap both returns in `src/server.ts` with `withSecurityHeaders`. Read the comments before adding `includeSubDomains` or `X-Frame-Options` | |
| `src/lib/sitemap.ts`, `src/routes/sitemap[.]xml.ts` | Sitemap built from fixed pages plus published items, sent as XML | Set `PAGES`; replace the item loader and paths. Delete `public/sitemap.xml`. Keep `Sitemap:` in `robots.txt` | `site.ts` |
| `src/lib/llms-txt.ts`, `src/routes/llms[.]txt.ts` | Optional `/llms.txt` for AI tools, as plain text | Replace the loader; approved fields only; pages by name only | `site.ts` |
| `src/lib/cookie-notice.ts`, `src/components/cookie-notice.tsx` | Small no-choice notice | Check the words against `tools/cookie-check.mjs`. Only for sites with no ad pixels | `NewTabNote` and colour classes from the first site. Replace or remove them |

**Not included, build them when needed:** a required tick box before the checkout (`references/09-legal.md`), structured data in one tested file, a date-driven release hook, and copy tests that fail if legal pages name the platform or lose a required section. `github/ci.yml` is a starting test workflow, unproven on AI Studio.

**Before relying on any template:** run the type check and tests, then check `AGENTS.md` and `vite.config.ts` in the new project for changes.
