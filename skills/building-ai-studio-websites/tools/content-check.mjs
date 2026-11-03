// Lists text in a site's code, and optionally on its live pages, that might be
// filler or invented: sample text, made-up reviews and numbers, placeholder
// addresses and links. Needs only Node 22+. It reads files and pages and
// submits nothing.
//
//   node content-check.mjs <repoDir> [baseUrl path...]
//
//   node content-check.mjs ./my-site
//   node content-check.mjs ./my-site https://example.com / /about
//
// With a baseUrl it also fetches each path and scans the page text. That catches
// wording saved in the admin, which the code never shows.
//
// Every result is a candidate, not a verdict: a person decides which are real.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { findFillerCandidates } from "./lib/filler.mjs";

const [repoDir, baseUrl, ...paths] = process.argv.slice(2);
if (!repoDir) {
  console.error("usage: node content-check.mjs <repoDir> [baseUrl path...]");
  process.exit(1);
}

// Reading nothing must never look like finding nothing, so stop on a wrong folder.
const isFolder = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};
if (!isFolder(repoDir)) {
  console.error(`I couldn't find a folder at ${repoDir}. Check the path and try again.`);
  process.exit(1);
}
if (!isFolder(join(repoDir, "src")) && !isFolder(join(repoDir, "public"))) {
  console.error(
    `${repoDir} has no src or public folder, so there is no site content to read. Point this at the top folder of the site's code.`,
  );
  process.exit(1);
}

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".html", ".txt"]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".output"]);
const SKIP_FILES = new Set(["routeTree.gen.ts"]);

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return; // many sites have no public/ folder
    throw err; // anything else (such as no permission) must not look like "nothing found"
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    const rel = relative(repoDir, path);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || rel === join("src", "integrations")) continue;
      yield* walk(path);
    } else if (
      EXTENSIONS.has(extname(entry.name)) &&
      !SKIP_FILES.has(entry.name) &&
      !/\.min\./.test(entry.name)
    ) {
      yield path;
    }
  }
}

const candidates = [];
let filesScanned = 0;
let pagesScanned = 0;
for (const root of ["src", "public"]) {
  for (const file of walk(join(repoDir, root))) {
    filesScanned++;
    candidates.push(...findFillerCandidates(readFileSync(file, "utf8"), relative(repoDir, file)));
  }
}

if (baseUrl) {
  for (const path of paths.length ? paths : ["/"]) {
    const url = new URL(path, baseUrl).href;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`could not read ${url} [${res.status}]`);
        continue;
      }
      // Drop scripts and styles, then break after each tag so lines stay short.
      const html = (await res.text())
        .replace(/<script\b[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[\s\S]*?<\/style>/gi, "")
        .replace(/>/g, ">\n");
      pagesScanned++;
      candidates.push(...findFillerCandidates(html, url));
    } catch (err) {
      console.log(`could not read ${url}: ${err.message}`);
    }
  }
}

const byKind = new Map();
for (const c of candidates) {
  if (!byKind.has(c.kind)) byKind.set(c.kind, []);
  byKind.get(c.kind).push(c);
}
for (const [kind, list] of byKind) {
  console.log(`\n${kind} (${list.length})`);
  for (const c of list) console.log(`  ${c.source}:${c.line}  ${c.excerpt}`);
}
console.log(
  `\nScanned ${filesScanned} ${filesScanned === 1 ? "file" : "files"} and ${pagesScanned} ${pagesScanned === 1 ? "page" : "pages"}.`,
);
console.log(
  `${candidates.length} ${candidates.length === 1 ? "candidate" : "candidates"}. A person decides which are real.`,
);
