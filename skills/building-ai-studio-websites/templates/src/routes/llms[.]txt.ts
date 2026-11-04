import { createFileRoute } from "@tanstack/react-router";

import { llmsText } from "@/lib/llms-txt";

// /llms.txt, built from the database like the sitemap, sent as plain text.
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        // REPLACE: load settings and published items; use approved fields only.
        const { fetchPublishedItems, fetchSiteSettings } = await import("@/lib/items.server");
        const [items, settings] = await Promise.all([fetchPublishedItems(), fetchSiteSettings()]);
        const text = llmsText({
          name: settings.name,
          tagline: settings.tagline,
          itemsHeading: "Services",
          items: items.map((item) => ({
            title: item.title,
            path: `/items/${item.slug}`,
            summary: item.shortDescription,
          })),
          pages: [
            { title: "About", path: "/about" },
            { title: "Contact", path: "/contact" },
          ],
          links: [],
        });
        return new Response(text, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
