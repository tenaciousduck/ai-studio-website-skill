// One line per Lighthouse run, plus what the largest paint is and the heaviest
// downloads. Run Lighthouse three times: scores move between runs.
//
//   npx lighthouse https://example.com --form-factor=mobile --output=json \
//     --output-path=out/run1.json --quiet --chrome-flags="--headless=new"
//   node lighthouse-summary.mjs out/run1.json out/run2.json out/run3.json
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node lighthouse-summary.mjs <run.json> [more.json...]");
  process.exit(1);
}
for (const file of files) {
  const report = JSON.parse(readFileSync(file));
  const audit = (id) => report.audits[id];
  const show = (id) => audit(id)?.displayValue ?? "?";
  console.log(
    file.split("/").pop().padEnd(16),
    "score",
    Math.round(report.categories.performance.score * 100),
    "FCP",
    show("first-contentful-paint"),
    "LCP",
    show("largest-contentful-paint"),
    "TBT",
    show("total-blocking-time"),
    "CLS",
    show("cumulative-layout-shift"),
    "KB",
    Math.round((audit("total-byte-weight")?.numericValue ?? 0) / 1024),
  );
}

const last = JSON.parse(readFileSync(files.at(-1)));
const element = last.audits["largest-contentful-paint-element"]?.details?.items ?? [];
const node = JSON.stringify(element).match(/"snippet":"(.{0,200})/);
console.log("\nlargest paint element:", node ? node[1] : "not reported");
const requests = last.audits["network-requests"]?.details?.items ?? [];
console.log("heaviest downloads:");
for (const r of [...requests].sort((a, b) => b.transferSize - a.transferSize).slice(0, 12)) {
  console.log(
    `  ${String(Math.round(r.transferSize / 1024)).padStart(5)} KB  ${r.resourceType.padEnd(11)} ${r.url.replace(/^https?:\/\//, "").slice(0, 90)}`,
  );
}
