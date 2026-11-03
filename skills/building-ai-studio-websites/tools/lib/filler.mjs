// Finds text that might be filler or invented: sample text, made-up reviews and
// numbers, placeholder addresses and links. Used by content-check.mjs.
//
//   findFillerCandidates(text, source)  a list of { source, line, kind, excerpt }
//
// These are candidates, never verdicts. A business really can be called "Example
// Bakery", so each hit carries a short excerpt for a person to judge.

// One pattern per kind. Counts like {0,12} are bounded on purpose, so a
// 50,000-character line from a minified file can't make a pattern crawl.
const PATTERNS = [
  {
    kind: "sample text",
    re: /lorem ipsum|dolor sit amet|consectetur adipiscing|(?:your|insert|placeholder|sample) text (?:here|goes here)/i,
  },
  {
    // "— Sarah M." (a first name and one initial) or a "verified" label with no real name.
    kind: "unnamed reviewer",
    re: /(?:^|\s)[—–-]\s*[A-Z][a-z]{1,20}\s+[A-Z]\.(?![a-z])|verified (?:buyer|customer|purchase|reviewer)/,
  },
  {
    kind: "star rating",
    re: /[★⭐]{2,}|[★☆]{5}|\b[1-5](?:\.\d)?\s?(?:\/\s?5|out of 5)\b|\b(?:5|five)[- ]stars?\b/i,
  },
  {
    // Round figures like "10,000+ customers" or "98% satisfaction" are often invented.
    kind: "round-number claim",
    re: /\b\d[\d,]{0,12}\+(?=\s+[A-Za-z]|\s*(?:[)<.'"\]]|$))|\b(?:over|more than)\s+\d[\d,]{2,12}\b|\b\d{2,3}%\s+(?:satisf|of (?:customers|clients|users)|success|recommend|happy)/i,
  },
  {
    kind: "placeholder address",
    re: /@example\.(?:com|org|net)\b|\b(?:your|name|email|test)@(?:your)?(?:domain|company|email|website)\.\w+|\byour(?:email|name)@|\b555[-. ]\d{4}\b|\(555\)|\b(?:123|1234) (?:main|anywhere|street)\b|\b123-456-7890\b/i,
  },
  {
    kind: "placeholder link",
    re: /\b(?:href|to|src)\s*=\s*\{?["']\s*#?\s*["']|href\s*=\s*["']javascript:/i,
  },
  {
    kind: "placeholder name",
    re: /\b(?:your|my) (?:company|business|brand|site|website|store|logo)\b|\bexample (?:bakery|company|business|inc|corp|co|shop|store|site)\b|\bacme\b|\b(?:john|jane) doe\b|\b(?:company|business|brand) name\b|\bcompany logo\b/i,
  },
];

const EXCERPT_MAX = 120;

// A window of at most 120 characters centered on the match, whitespace tidied.
function excerptAround(line, index, length) {
  const middle = index + Math.floor(length / 2);
  const start = Math.max(0, middle - EXCERPT_MAX / 2);
  const slice = line.slice(start, start + EXCERPT_MAX + 40).replace(/\s+/g, " ");
  const trimmed = slice.length > EXCERPT_MAX ? slice.slice(0, EXCERPT_MAX) : slice;
  return trimmed.trim();
}

export function findFillerCandidates(text, source) {
  const found = [];
  text.split("\n").forEach((line, i) => {
    for (const { kind, re } of PATTERNS) {
      const m = re.exec(line);
      if (m) found.push({ source, line: i + 1, kind, excerpt: excerptAround(line, m.index, m[0].length) });
    }
  });
  return found;
}
