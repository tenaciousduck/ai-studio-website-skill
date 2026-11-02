// Shrinks a photo in the browser before it is uploaded, so a straight-from-the-
// camera file can't slow the site down. If anything goes wrong, the original is
// uploaded instead: the owner should never see an upload fail because of this step.

const LONGEST_SIDE = 1600;
const QUALITY = 0.84;
// Below this, a small enough image is left exactly as it was given.
const ALREADY_SMALL_BYTES = 300 * 1024;

export function fitWithin(width: number, height: number, longest = LONGEST_SIDE) {
  const scale = Math.min(1, longest / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

// Only ever shrinks: a file keeps its type, because other parts of the site rely
// on it. A PNG is shown as a cut-out figure, and social previews need a type
// every site understands. Anything else (SVG, GIF, HEIC) is left alone.
const SHRINKABLE = ["image/jpeg", "image/png", "image/webp"];

function encode(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

export async function shrinkImage(file: File): Promise<File> {
  if (!SHRINKABLE.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const size = fitWithin(bitmap.width, bitmap.height);
    const unchanged = size.width === bitmap.width && size.height === bitmap.height;
    if (unchanged && file.size <= ALREADY_SMALL_BYTES) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, size.width, size.height);
    bitmap.close();

    // A browser that can't write the type (Safari with WebP) hands back another
    // one. That result, or one that came out larger, loses to the original.
    const blob = await encode(canvas, file.type);
    if (!blob || blob.type !== file.type || blob.size >= file.size) return file;
    return new File([blob], file.name, { type: file.type });
  } catch {
    return file;
  }
}
