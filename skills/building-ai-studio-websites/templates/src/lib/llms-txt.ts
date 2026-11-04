// Builds /llms.txt: a plain-text summary of the site for AI tools, in the format
// proposed at llmstxt.org. Optional: offer it, don't require it.
//
// Use only copy the site already shows or already sends in structured data, so
// it can't add claims or spoilers. List pages by name and link only: page
// descriptions can be saved in the admin or built from other fields, so a copy
// here drifts from what the page says. Credit people accurately: a contributor to
// a collection is never its author.

import { canonicalUrl } from "./site";

export type LlmsItem = { title: string; path: string; summary?: string };
export type LlmsInput = {
  name: string;
  /** One line from the site, e.g. the tagline. Blank skips the quote. */
  tagline: string;
  /** e.g. "Books", "Services", "Products". */
  itemsHeading: string;
  items: LlmsItem[];
  pages: { title: string; path: string }[];
  /** Real profiles, e.g. Instagram. */
  links: { title: string; url: string }[];
};

const link = (title: string, url: string, summary = "") =>
  `- [${title}](${url})${summary.trim() ? `: ${summary.trim()}` : ""}`;

export function llmsText(input: LlmsInput): string {
  return [
    `# ${input.name}`,
    "",
    ...(input.tagline.trim() ? [`> ${input.tagline.trim()}`, ""] : []),
    `## ${input.itemsHeading}`,
    "",
    ...input.items.map((item) => link(item.title, canonicalUrl(item.path), item.summary)),
    "",
    "## Pages",
    "",
    ...input.pages.map((page) => link(page.title, canonicalUrl(page.path))),
    "",
    ...(input.links.length
      ? ["## Optional", "", ...input.links.map((l) => link(l.title, l.url)), ""]
      : []),
  ].join("\n");
}
