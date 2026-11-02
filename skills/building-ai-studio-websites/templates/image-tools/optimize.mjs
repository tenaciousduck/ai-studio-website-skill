// Makes the sized AVIF and WebP copies the site shows, from the originals in
// public/images and the photos listed in uploads.json, plus the small favicons.
// Run it after adding or replacing an image in public/images:
//
//   cd scripts/image-tools && npm install && npm run optimize
//
// uploads.json lists photos uploaded through /admin. A copy only applies to the
// exact address listed, so a new upload shows as it is until its address is added
// here and this is run again. Nothing breaks in the meantime; it's just heavier.
//
// Its output is committed, so the hosted build never needs this tool. The
// originals stay where they are: saved page content points at them, social
// previews need them, and they are what very old browsers fall back to.
import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SOURCE_DIR = path.join(ROOT, "public/images");
const OUTPUT_DIR = path.join(ROOT, "src/assets/images");
const MANIFEST = path.join(ROOT, "src/lib/image-manifest.json");
const UPLOADS = new URL("./uploads.json", import.meta.url);
const WIDTHS = [160, 320, 480, 640, 960, 1440, 2000];
const AVIF = { quality: 62, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 82, effort: 6 };

// The ladder below the original's width, ending on the original itself unless
// it is wider than the top step. Nothing is ever enlarged.
function widthsFor(sourceWidth) {
  const smaller = WIDTHS.filter((width) => width < sourceWidth);
  return sourceWidth > WIDTHS.at(-1) ? smaller : [...smaller, sourceWidth];
}

// Writes one image's copies and returns its manifest entry.
async function makeCopies(source, stem) {
  const { width, height } = (await sharp(source).metadata()).autoOrient;
  const widths = widthsFor(width);

  for (const target of widths) {
    const resized = sharp(source).rotate().resize({ width: target, withoutEnlargement: true });
    await resized
      .clone()
      .avif(AVIF)
      .toFile(path.join(OUTPUT_DIR, `${stem}-${target}.avif`));
    await resized
      .clone()
      .webp(WEBP)
      .toFile(path.join(OUTPUT_DIR, `${stem}-${target}.webp`));
  }

  console.log(`${stem}: ${width}x${height} -> ${widths.join(", ")}`);
  return { width, height, widths };
}

async function main() {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  // A new project may have no images yet: the empty manifest still lets the site build.
  const found = await readdir(SOURCE_DIR).catch(() => []);
  const names = found.filter((n) => /\.(jpe?g|png)$/i.test(n)).sort();
  const manifest = {};

  for (const name of names) {
    const stem = name.replace(/\.[^.]+$/, "");
    manifest[`/images/${name}`] = await makeCopies(path.join(SOURCE_DIR, name), stem);
  }

  for (const url of JSON.parse(await readFile(UPLOADS, "utf8"))) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    const stem = url.replace(/^.*\//, "").replace(/\.[^.]+$/, "");
    manifest[url] = await makeCopies(Buffer.from(await response.arrayBuffer()), stem);
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  // Favicons, drawn from favicon.svg, which is too heavy to serve itself.
  const icon = path.join(ROOT, "public/favicon.svg");
  const hasIcon = await access(icon).then(() => true, () => false);
  if (!hasIcon) return;
  await sharp(icon, { density: 72 })
    .resize(180, 180)
    .png({ palette: true, quality: 90 })
    .toFile(path.join(ROOT, "public/apple-touch-icon.png"));
  await sharp(icon, { density: 72 })
    .resize(48, 48)
    .png({ palette: true, quality: 90 })
    .toFile(path.join(ROOT, "public/favicon-48.png"));
}

await main();
