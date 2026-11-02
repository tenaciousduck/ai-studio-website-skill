// Records how a site really behaves in Chrome: where every image and piece of
// text sits, what loaded, what it weighed and whether anything scrolls sideways.
// Run it on a baseline and on your change, then compare with page-compare.mjs.
//
//   node page-audit.mjs https://example.com out/before / /about /contact
//   node page-audit.mjs http://localhost:8097 out/after / /about /contact
//
// Needs Node 22+ and Google Chrome (set CHROME_PATH outside macOS). Nothing is submitted: it only opens pages and
// scrolls. Compare like with like: a dev server's weights mean nothing against a
// live host's, so use a production build (vite preview) or the live site.
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [base, out, ...pages] = process.argv.slice(2);
if (!base || !out || !pages.length) {
  console.error("usage: node page-audit.mjs <baseUrl> <outDir> <path> [path...]");
  process.exit(1);
}
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9300 + (process.pid % 200);
// name, width, height, pixel ratio, touch. "edge" sits on a common breakpoint.
const VIEWS = [
  ["small", 360, 740, 3, true],
  ["phone", 375, 812, 3, true],
  ["tablet", 820, 1100, 2, true],
  ["desktop", 1280, 800, 2, false],
  ["wide", 1920, 1080, 1, false],
  ["edge", 900, 900, 1, false],
];

await mkdir(out, { recursive: true });
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.resolve(out, ".chrome")}`,
    "--no-first-run",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let targets;
for (let i = 0; i < 60; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    if (targets.find((t) => t.type === "page")) break;
  } catch {}
  await sleep(250);
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const events = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  } else events.push(d);
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result
    .value;

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

const COLLECT = `JSON.stringify((() => {
  const round = (n) => Math.round(n * 10) / 10;
  const box = (r) => ({ x: round(r.left), y: round(r.top + scrollY), w: round(r.width), h: round(r.height) });
  const imgs = [...document.images]
    .filter((i) => i.offsetParent !== null || getComputedStyle(i).position === "fixed")
    .map((i) => ({ src: i.getAttribute("src"), cur: i.currentSrc, nat: [i.naturalWidth, i.naturalHeight],
      fit: getComputedStyle(i).objectFit, done: i.complete && i.naturalWidth > 0, ...box(i.getBoundingClientRect()) }));
  const text = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.textContent.trim();
    const parent = node.parentElement;
    if (!value || !parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const r = range.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const s = getComputedStyle(parent);
    text.push({ t: value.slice(0, 80), font: s.fontFamily.split(",")[0], size: s.fontSize, ...box(r) });
  }
  return { docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > innerWidth, imgs, text };
})())`;

const results = {};
for (const [view, width, height, dpr, mobile] of VIEWS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: dpr,
    mobile,
  });
  for (const page of pages) {
    events.length = 0;
    await send("Page.navigate", { url: base + page });
    await sleep(2600);
    const earlyH = await evaluate("document.documentElement.scrollHeight");
    // Scroll to the bottom and back so lazy images load.
    await evaluate(`(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += Math.round(innerHeight * 0.7)) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 1500));
    })()`);
    const data = JSON.parse(await evaluate(COLLECT));

    const bytes = {};
    const seen = {};
    for (const e of events) {
      if (e.method === "Network.responseReceived")
        seen[e.params.requestId] = {
          url: e.params.response.url,
          type: e.params.response.mimeType,
          status: e.params.response.status,
        };
      if (e.method === "Network.loadingFinished")
        bytes[e.params.requestId] = e.params.encodedDataLength;
    }
    const requests = Object.entries(seen).map(([k, r]) => ({ ...r, bytes: bytes[k] ?? 0 }));
    data.earlyH = earlyH;
    data.total = requests.reduce((a, r) => a + r.bytes, 0);
    data.failed = requests.filter((r) => r.status >= 400).map((r) => `${r.status} ${r.url}`);
    data.thirdParty = [
      ...new Set(
        requests
          .map((r) => new URL(r.url).host)
          .filter((host) => host !== new URL(base).host),
      ),
    ];
    // Hosts can send images with no type label, so a type-based image total can
    // undercount AVIF. Trust `total` or Lighthouse for weight.
    data.requests = requests.map((r) => [r.url.split("/").pop().split("?")[0], r.bytes, r.status, r.type]);
    results[`${view} ${page}`] = data;

    const shot = await send("Page.captureScreenshot", {
      format: "jpeg",
      quality: 72,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height: Math.min(data.docH, 6000), scale: 1 },
    });
    await writeFile(
      path.join(out, `${view}${page.replace(/[/?&=]/g, "_")}.jpg`),
      Buffer.from(shot.data, "base64"),
    );
    console.log(
      view.padEnd(8),
      page.padEnd(36),
      `${Math.round(data.total / 1024)} KB`,
      `${data.imgs.length} images`,
      `${data.text.length} text items`,
      data.overflow ? "SIDEWAYS SCROLL" : "",
      data.failed.length ? `${data.failed.length} FAILED` : "",
    );
  }
}
await writeFile(path.join(out, "results.json"), JSON.stringify(results, null, 1));
ws.close();
chrome.kill();
process.exit(0);
