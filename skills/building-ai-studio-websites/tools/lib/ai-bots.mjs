// Which AI crawlers a robots.txt lets in. Used by seo-check.mjs.
//
//   import { aiBotAccess } from "./lib/ai-bots.mjs";
//   aiBotAccess(robotsText) -> [{ token, owner, purpose, named, access }]
//   starGroupBlocksAll(robotsText) -> true when "User-agent: *" blocks the whole site
//
// Each token and purpose below was read on AI_BOTS_CHECKED from the vendor's
// own crawler page. Sources:
//   OpenAI      https://developers.openai.com/api/docs/bots
//   Anthropic   https://support.claude.com/en/articles/8896518
//   Google      https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
//   Perplexity  https://docs.perplexity.ai/guides/bots
//   Apple       https://support.apple.com/en-us/119829
//   Meta        https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
// Left out because the vendor's own pages did not confirm them: Bytespider
// (ByteDance publishes no crawler page) and CCBot (Common Crawl's pages name
// the token but never say its data trains AI). Meta describes
// meta-externalagent as training models "or improving products by indexing".
// Vendors say the user-fetch bots (ChatGPT-User, Perplexity-User) may ignore
// robots.txt because a person asked for the page.
export const AI_BOTS_CHECKED = "2026-11-02";
export const AI_BOTS = [
  { token: "GPTBot", owner: "OpenAI", purpose: "training" },
  { token: "OAI-SearchBot", owner: "OpenAI", purpose: "search" },
  { token: "ChatGPT-User", owner: "OpenAI", purpose: "user-fetch" },
  { token: "ClaudeBot", owner: "Anthropic", purpose: "training" },
  { token: "Claude-SearchBot", owner: "Anthropic", purpose: "search" },
  { token: "Claude-User", owner: "Anthropic", purpose: "user-fetch" },
  { token: "Google-Extended", owner: "Google", purpose: "training" },
  { token: "PerplexityBot", owner: "Perplexity", purpose: "search" },
  { token: "Perplexity-User", owner: "Perplexity", purpose: "user-fetch" },
  { token: "Applebot-Extended", owner: "Apple", purpose: "training" },
  { token: "meta-externalagent", owner: "Meta", purpose: "training" },
];

// Reads robots.txt into { "gptbot": [{ allow, path }] }. Consecutive User-agent
// lines share one group; other lines (Sitemap, Crawl-delay) don't end it.
function parseGroups(text) {
  const groups = new Map();
  let agents = [];
  let inRules = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === "user-agent") {
      if (inRules) agents = [];
      inRules = false;
      const name = value.toLowerCase();
      agents.push(name);
      if (!groups.has(name)) groups.set(name, []);
    } else if (field === "allow" || field === "disallow") {
      inRules = true;
      for (const name of agents) groups.get(name).push({ allow: field === "allow", path: value });
    }
  }
  return groups;
}

// RFC 9309: the longest matching rule wins and a tie goes to Allow. So a root
// Allow cancels a root Disallow, a narrower Allow only opens part of the site,
// and any other non-empty Disallow is partial.
function accessFor(rules) {
  const isRoot = (path) => path === "/" || path === "/*";
  const rootAllow = rules.some((r) => r.allow && isRoot(r.path));
  const rootDisallow = rules.some((r) => !r.allow && isRoot(r.path));
  if (rootDisallow && !rootAllow) {
    const narrowAllow = rules.some((r) => r.allow && r.path && !isRoot(r.path));
    return narrowAllow ? "partly blocked" : "blocked";
  }
  const partial = rules.some((r) => !r.allow && r.path && !isRoot(r.path));
  return partial ? "partly blocked" : "allowed";
}

// True only when the `*` group shuts every crawler out of the whole site.
export function starGroupBlocksAll(robotsText) {
  return accessFor(parseGroups(robotsText).get("*") ?? []) === "blocked";
}

export function aiBotAccess(robotsText) {
  const groups = parseGroups(robotsText);
  return AI_BOTS.map((bot) => {
    const own = groups.get(bot.token.toLowerCase());
    const rules = own ?? groups.get("*") ?? [];
    return { ...bot, named: Boolean(own), access: accessFor(rules) };
  });
}
