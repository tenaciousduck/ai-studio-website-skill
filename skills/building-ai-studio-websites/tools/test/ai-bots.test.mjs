import { test } from "node:test";
import assert from "node:assert/strict";
import { AI_BOTS, AI_BOTS_CHECKED, aiBotAccess, starGroupBlocksAll } from "../lib/ai-bots.mjs";

const find = (rows, token) => rows.find((r) => r.token === token);

test("blocks a named bot", () => {
  const rows = aiBotAccess("User-agent: GPTBot\nDisallow: /");
  assert.equal(find(rows, "GPTBot").named, true);
  assert.equal(find(rows, "GPTBot").access, "blocked");
  assert.equal(find(rows, "ClaudeBot").named, false);
  assert.equal(find(rows, "ClaudeBot").access, "allowed");
});

test("falls back to the star group", () => {
  const rows = aiBotAccess("User-agent: *\nDisallow: /");
  assert.equal(rows.length, AI_BOTS.length);
  for (const row of rows) {
    assert.equal(row.named, false, row.token);
    assert.equal(row.access, "blocked", row.token);
  }
});

test("shared group and case", () => {
  const rows = aiBotAccess(
    "user-agent: gptbot\r\nUser-Agent: ClaudeBot # note\r\nDisallow: /private\r\n",
  );
  for (const token of ["GPTBot", "ClaudeBot"]) {
    assert.equal(find(rows, token).named, true, token);
    assert.equal(find(rows, token).access, "partly blocked", token);
  }
  assert.equal(find(rows, "Claude-User").named, false);
  assert.equal(find(rows, "Claude-User").access, "allowed");
});

test("empty disallow allows", () => {
  const rows = aiBotAccess("User-agent: GPTBot\nDisallow:");
  assert.equal(find(rows, "GPTBot").access, "allowed");
});

test("allow root after disallow root", () => {
  const rows = aiBotAccess("User-agent: GPTBot\nDisallow: /\nAllow: /");
  assert.equal(find(rows, "GPTBot").access, "allowed");
});

test("a named group wins over the star group", () => {
  const rows = aiBotAccess("User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nDisallow:");
  assert.equal(find(rows, "GPTBot").access, "allowed");
  assert.equal(find(rows, "ClaudeBot").access, "blocked");
});

test("list is dated and every entry has an owner and purpose", () => {
  assert.match(AI_BOTS_CHECKED, /^\d{4}-\d{2}-\d{2}$/);
  for (const bot of AI_BOTS) {
    assert.ok(bot.token && bot.owner, bot.token);
    assert.ok(["training", "search", "user-fetch"].includes(bot.purpose), bot.token);
  }
});

test("allow root keeps allowed, but a narrower allow after disallow root is partial", () => {
  const rows = aiBotAccess("User-agent: GPTBot\nDisallow: /\nAllow: /public");
  assert.equal(find(rows, "GPTBot").access, "partly blocked");
  const root = aiBotAccess("User-agent: GPTBot\nDisallow: /\nAllow: /");
  assert.equal(find(root, "GPTBot").access, "allowed");
});

test("starGroupBlocksAll judges only the star group", () => {
  assert.equal(starGroupBlocksAll("User-agent: GPTBot\nDisallow: /"), false);
  assert.equal(starGroupBlocksAll("User-agent: *\nDisallow: /"), true);
  assert.equal(starGroupBlocksAll("User-agent: *\nDisallow: /\nAllow: /"), false);
  assert.equal(starGroupBlocksAll("User-agent: *\nDisallow: /\nAllow: /public"), false);
  assert.equal(starGroupBlocksAll(""), false);
});
