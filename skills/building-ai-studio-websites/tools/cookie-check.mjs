// Lists what a site really sets in a fresh browser: cookies, browser storage and
// outside hosts, so the privacy page and cookie wording can be checked against
// fact. Each run starts with an empty profile, like a first-time visitor.
//
//   node cookie-check.mjs https://example.com <outDir> / /contact
//   node cookie-check.mjs https://example.com <outDir> --press "Essential only" /
//
// --press clicks the first button with that exact text after the first page,
// then reloads and lists again. Run once per button: each run starts fresh.
// Accept and Decline must end with different cookies, and nothing non-essential
// may load before a choice. A working Decline can match the first list.
//
// Needs Node 22+ and Google Chrome (set CHROME_PATH outside macOS). Nothing is
// submitted. It doesn't open a
// checkout, so payment cookies need a person to open one and read them in
// Chrome's developer tools.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const pressAt = args.indexOf("--press");
const press = pressAt >= 0 ? args.splice(pressAt, 2)[1] : "";
const [base, out, ...pages] = args;
if (!base || !out || !pages.length) {
  console.error('usage: node cookie-check.mjs <baseUrl> <outDir> [--press "Label"] <path> [path...]');
  process.exit(1);
}
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9500 + (process.pid % 200);
const AD_HOSTS =
  /facebook|fbcdn|doubleclick|googletagmanager|google-analytics|googleadservices|tiktok|hotjar|clarity\.ms|linkedin|pinterest|snapchat/;

const profile = path.resolve(out, `.chrome-${Date.now()}`);
await mkdir(profile, { recursive: true });
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
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
const hosts = new Set();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  } else if (d.method === "Network.requestWillBeSent") {
    const url = d.params.request.url;
    if (url.startsWith("http")) hosts.add(new URL(url).host);
  }
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

async function visit(page) {
  await send("Page.navigate", { url: base + page });
  await sleep(4000);
}

async function snapshot() {
  const { cookies } = await send("Network.getAllCookies");
  return cookies.map((c) => {
    const minutes = c.expires > 0 ? Math.round((c.expires - Date.now() / 1000) / 60) : null;
    return `${c.name} (${c.domain}, ${minutes === null ? "session" : `${minutes} min`})`;
  });
}

function report(title, cookies, storage) {
  console.log(`\n${title}`);
  console.log(`  cookies: ${cookies.length ? "" : "none"}`);
  for (const c of cookies.toSorted()) console.log(`    ${c}`);
  console.log(`  storage: ${storage.length ? storage.join(", ") : "none"}`);
}

const STORAGE = "JSON.stringify([...Object.keys(localStorage), ...Object.keys(sessionStorage)])";
const before = {};
for (const page of pages) {
  await visit(page);
  before.cookies = await snapshot();
  before.storage = JSON.parse(await evaluate(STORAGE));
  report(`After ${page}`, before.cookies, before.storage);
}

if (press) {
  await visit(pages[0]);
  const pressed = await evaluate(`(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === ${JSON.stringify(press)});
    if (b) b.click();
    return !!b;
  })()`);
  console.log(`\nPressed "${press}": ${pressed ? "yes" : "NOT FOUND"}`);
  await sleep(1500);
  await visit(pages[0]);
  const cookies = await snapshot();
  report("After pressing and reloading", cookies, JSON.parse(await evaluate(STORAGE)));
  const same = [...cookies].map((c) => c.split(" ")[0]).toSorted().join() ===
    [...before.cookies].map((c) => c.split(" ")[0]).toSorted().join();
  console.log(same ? "  Same cookies as before pressing" : "  Cookies changed");
}

const own = new URL(base).host;
const outside = [...hosts].filter((h) => h !== own).toSorted();
console.log(`\nOutside hosts: ${outside.length ? outside.join(", ") : "none"}`);
const ads = outside.filter((h) => AD_HOSTS.test(h));
console.log(ads.length ? `AD OR TRACKING HOSTS: ${ads.join(", ")}` : "No common ad or tracking hosts");

ws.close();
chrome.kill();
process.exit(0);
