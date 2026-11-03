import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const script = join(dirname(fileURLToPath(import.meta.url)), "..", "content-check.mjs");
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
const makeTemp = () => mkdtempSync(join(tmpdir(), "content-check-"));

test("a folder that doesn't exist is an error, not a clean result", () => {
  const result = run("/nonexistent/typo-folder");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /couldn't find/i);
  assert.doesNotMatch(result.stdout, /0 candidates/);
});

test("a folder with neither src nor public is an error", () => {
  const dir = makeTemp();
  try {
    const result = run(dir);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /src.*public/i);
    assert.doesNotMatch(result.stdout, /0 candidates/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("says how many files were scanned, so 0 candidates differs from 0 files", () => {
  const dir = makeTemp();
  try {
    mkdirSync(join(dir, "src"));
    writeFileSync(join(dir, "src", "a.tsx"), "export const a = 'Hello world';\n");
    writeFileSync(join(dir, "src", "b.tsx"), "export const b = 'Hi';\n");
    const result = run(dir);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Scanned 2 files and 0 pages\./);
    assert.match(result.stdout, /0 candidates\./);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a src folder that has filler reports it", () => {
  const dir = makeTemp();
  try {
    mkdirSync(join(dir, "src"));
    writeFileSync(join(dir, "src", "a.tsx"), "Lorem ipsum\n");
    const result = run(dir);
    assert.match(result.stdout, /sample text/);
    assert.match(result.stdout, /Scanned 1 file and 0 pages\./);
    assert.match(result.stdout, /1 candidate\./);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
