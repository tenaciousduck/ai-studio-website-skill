import { test } from "node:test";
import assert from "node:assert/strict";
import { findFillerCandidates } from "../lib/filler.mjs";

const kinds = (text) => findFillerCandidates(text, "a.tsx").map((c) => c.kind);

test("finds each kind of filler", () => {
  assert.ok(kinds("Lorem ipsum dolor").includes("sample text"));
  assert.ok(kinds("— Sarah M., verified buyer").includes("unnamed reviewer"));
  assert.ok(kinds("★★★★★").includes("star rating"));
  assert.ok(kinds("Over 10,000+ happy customers").includes("round-number claim"));
  assert.ok(kinds("98% satisfaction").includes("round-number claim"));
  assert.ok(kinds("mailto:hello@example.com").includes("placeholder address"));
  assert.ok(kinds('href="#"').includes("placeholder link"));
  assert.ok(kinds("Your Company Name").includes("placeholder name"));
});

test("a real link to a section is not a placeholder link", () => {
  assert.ok(!kinds('<a href="#main">Skip</a>').includes("placeholder link"));
});

test("line numbers start at 1 and the source is passed through", () => {
  const found = findFillerCandidates("fine\nfine\nLorem ipsum", "src/a.tsx");
  assert.equal(found.length, 1);
  assert.equal(found[0].line, 3);
  assert.equal(found[0].source, "src/a.tsx");
  assert.equal(found[0].kind, "sample text");
});

test("the excerpt is at most 120 characters, even for one huge line", () => {
  const huge = "x".repeat(25000) + " Lorem ipsum " + "y".repeat(25000);
  const found = findFillerCandidates(huge, "bundle.js");
  assert.equal(found.length, 1);
  assert.ok(found[0].excerpt.length <= 120);
  assert.ok(found[0].excerpt.includes("Lorem ipsum"));
});

test("a long line of digits does not hang the scan", () => {
  const started = Date.now();
  findFillerCandidates("1".repeat(50000), "x.js");
  assert.ok(Date.now() - started < 1000);
});

test("a business that really is called Example Bakery is a candidate, not a verdict", () => {
  const found = findFillerCandidates("Example Bakery opened in 1998", "about.md");
  assert.ok(found.some((c) => c.kind === "placeholder name"));
  assert.ok(found[0].excerpt.includes("Example Bakery"));
});

test("arithmetic in code is not a round-number claim", () => {
  assert.ok(!kinds("const next = page+1;").includes("round-number claim"));
  assert.ok(kinds("500+ clients").includes("round-number claim"));
});

test("ordinary text has no candidates", () => {
  assert.deepEqual(findFillerCandidates("Hello world", "a.tsx"), []);
});
