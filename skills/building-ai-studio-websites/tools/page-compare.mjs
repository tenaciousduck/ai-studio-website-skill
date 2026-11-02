// Compares two page-audit.mjs runs and reports anything that moved, went missing
// or broke. This is how "the site looks the same" becomes a checked claim.
//
//   node page-compare.mjs out/before out/after
//
// Expect a few text mismatches on countdowns and other live numbers.
import { readFileSync } from "node:fs";

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error("usage: node page-compare.mjs <beforeDir> <afterDir>");
  process.exit(1);
}
const load = (dir) => JSON.parse(readFileSync(`${dir}/results.json`));
const before = load(beforeDir);
const after = load(afterDir);
const TOLERANCE = 1.5;
const moved = (a, b) =>
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.w - b.w), Math.abs(a.h - b.h)) >
  TOLERANCE;

let problems = 0;
let imagesOk = 0;
let textOk = 0;
const report = (...line) => {
  problems++;
  console.log(...line);
};

for (const key of Object.keys(before)) {
  const b = before[key];
  const a = after[key];
  if (!a) {
    report("MISSING PAGE", key);
    continue;
  }
  if (Math.abs(b.docH - a.docH) > 2) report("PAGE HEIGHT", key, b.docH, "->", a.docH);
  if (a.overflow) report("SIDEWAYS SCROLL", key);
  for (const failure of a.failed) report("FAILED REQUEST", key, failure);
  if (Math.abs(a.earlyH - a.docH) > 2)
    console.log(`note: height moved while loading ${key}: ${a.earlyH} -> ${a.docH}`);

  const images = [...a.imgs];
  for (const i of b.imgs) {
    const n = images.findIndex((j) => j.src === i.src);
    if (n < 0) {
      report("IMAGE GONE", key, i.src);
      continue;
    }
    const [j] = images.splice(n, 1);
    if (moved(i, j))
      report("IMAGE MOVED", key, i.src, `${i.x},${i.y} ${i.w}x${i.h} -> ${j.x},${j.y} ${j.w}x${j.h}`);
    else imagesOk++;
    if (i.done && !j.done) report("IMAGE NOT LOADED", key, i.src);
  }
  for (const extra of images) report("IMAGE ADDED", key, extra.src);

  const texts = [...a.text];
  for (const t of b.text) {
    const n = texts.findIndex((u) => u.t === t.t && !moved(t, u));
    if (n >= 0) {
      const [u] = texts.splice(n, 1);
      if (u.font !== t.font || u.size !== t.size)
        report("FONT CHANGED", key, t.t, `${t.font} ${t.size} -> ${u.font} ${u.size}`);
      else textOk++;
      continue;
    }
    const same = texts.find((u) => u.t === t.t);
    report(same ? "TEXT MOVED" : "TEXT CHANGED", key, JSON.stringify(t.t));
  }
}

console.log(`\nimages unchanged: ${imagesOk}\ntext items unchanged: ${textOk}\nproblems: ${problems}`);
console.log("\nKB downloaded, before -> after:");
for (const key of Object.keys(before)) {
  if (!after[key]) continue;
  console.log(
    " ",
    key.padEnd(44),
    Math.round(before[key].total / 1024),
    "->",
    Math.round(after[key].total / 1024),
  );
}
