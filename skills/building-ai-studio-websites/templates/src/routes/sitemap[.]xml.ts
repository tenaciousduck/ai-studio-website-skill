import { createFileRoute } from "@tanstack/react-router";

import { sitemapXml } from "@/lib/sitemap";

// /sitemap.xml. Delete public/sitemap.xml, or the static file is served instead.
// Server modules load inside the handler so they never reach the browser bundle;
// a route whose only option is `server` is left out of the client entirely.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // REPLACE: load the published items and turn each into its page path(s).
        const { fetchPublishedItems } = await import("@/lib/items.server");
        const items = await fetchPublishedItems();
        const paths = items.map((item) => `/items/${item.slug}`);
        return new Response(sitemapXml(paths), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
