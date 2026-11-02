// Works out which optimized copies exist for an image. The copies are made by
// scripts/image-tools and listed in image-manifest.json; anything not listed
// there, such as a photo uploaded through /admin, is shown as it is.

import bundledManifest from "./image-manifest.json";

export type ImageEntry = { width: number; height: number; widths: number[] };
export type ImageManifest = Record<string, ImageEntry>;
// Built file address, keyed by the copy's name, e.g. "hero-640.avif".
export type ImageFiles = Record<string, string>;

export const imageManifest: ImageManifest = bundledManifest;

export type ImageSources = {
  width: number;
  height: number;
  avif: string;
  webp: string;
};

function srcSet(files: ImageFiles, stem: string, widths: number[], format: string) {
  const entries = widths.map((width) => {
    const url = files[`${stem}-${width}.${format}`];
    return url ? `${url} ${width}w` : null;
  });
  return entries.every(Boolean) ? entries.join(", ") : null;
}

// Width divided by height, when the image is one of the optimized ones.
export function imageAspect(src: string): number | undefined {
  const entry = Object.hasOwn(imageManifest, src) ? imageManifest[src] : undefined;
  return entry ? entry.width / entry.height : undefined;
}

// Every listed copy has to be there: a half-filled list could send a browser
// to a size that doesn't exist, so a gap falls back to the original image.
export function imageSources(
  src: string,
  manifest: ImageManifest,
  files: ImageFiles,
): ImageSources | null {
  const entry = Object.hasOwn(manifest, src) ? manifest[src] : undefined;
  if (!entry) return null;
  const stem = src.replace(/^.*\//, "").replace(/\.[^.]+$/, "");
  const avif = srcSet(files, stem, entry.widths, "avif");
  const webp = srcSet(files, stem, entry.widths, "webp");
  if (!avif || !webp) return null;
  return { width: entry.width, height: entry.height, avif, webp };
}

// Width and height attributes only tell the browser the image's shape, so it
// can hold the space before the file arrives. Giving one side must keep the
// original's shape: a mismatched pair reserves the wrong space and the page
// jumps when the image lands.
export function reservedSize(
  natural: { width: number; height: number },
  width: number | undefined,
  height: number | undefined,
): { width: number; height: number } {
  if (width !== undefined && height !== undefined) return { width, height };
  if (width !== undefined) {
    return { width, height: Math.round((width * natural.height) / natural.width) };
  }
  if (height !== undefined) {
    return { width: Math.round((height * natural.width) / natural.height), height };
  }
  return { width: natural.width, height: natural.height };
}
