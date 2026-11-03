import { test } from "node:test";
import assert from "node:assert/strict";
import { isPlainTextFile, missingSecurityHeaders } from "../lib/http-checks.mjs";

test("an HTML page is not a plain-text file", () => {
  assert.equal(isPlainTextFile("text/html", "<!doctype html><html></html>"), false);
  assert.equal(isPlainTextFile(null, "  <html>"), false);
});

test("a plain-text file is one", () => {
  assert.equal(isPlainTextFile("text/plain; charset=utf-8", "User-agent: *"), true);
});

test("lists the security headers that are missing", () => {
  const headers = new Headers({ "x-content-type-options": "nosniff" });
  assert.deepEqual(missingSecurityHeaders(headers), [
    "strict-transport-security",
    "referrer-policy",
    "x-frame-options",
  ]);
});

test("frame-ancestors in the content security policy stands in for x-frame-options", () => {
  const headers = new Headers({
    "x-content-type-options": "nosniff",
    "strict-transport-security": "max-age=1",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'self'; frame-ancestors 'none'",
  });
  assert.deepEqual(missingSecurityHeaders(headers), []);
  const noAncestors = new Headers({ "content-security-policy": "default-src 'self'" });
  assert.ok(missingSecurityHeaders(noAncestors).includes("x-frame-options"));
});
