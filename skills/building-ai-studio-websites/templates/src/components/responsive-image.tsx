import type { ComponentProps } from "react";
import { imageManifest, imageSources, reservedSize, type ImageFiles } from "@/lib/image-sources";

// Importing the copies gives them fingerprinted /assets addresses, which the
// host tells browsers to keep for a year. "no-inline" keeps small ones as real
// files: Vite would otherwise embed them, and an embedded image breaks a srcset.
const BUILT = import.meta.glob<string>("/src/assets/images/*.{avif,webp}", {
  eager: true,
  query: "?no-inline",
  import: "default",
});
const FILES: ImageFiles = Object.fromEntries(
  Object.entries(BUILT).map(([path, url]) => [path.replace(/^.*\//, ""), url]),
);

type Props = Omit<ComponentProps<"img">, "src" | "alt" | "srcSet" | "sizes" | "fetchPriority"> & {
  src: string;
  alt: string;
  /** How wide the image shows on the page, e.g. "(min-width: 900px) 340px, 200px". */
  sizes: string;
  /** The main image at the top of a page: load it first, never lazily. */
  priority?: boolean;
};

// Every image on the site. Browsers take the smallest copy that stays sharp, in
// the newest format they understand (AVIF, then WebP), and fall back to the
// original file. Images load as they near the screen unless marked otherwise.
export function ResponsiveImage({
  src,
  alt,
  sizes,
  priority = false,
  loading,
  width,
  height,
  ...rest
}: Props) {
  const sources = imageSources(src, imageManifest, FILES);
  const timing = priority
    ? ({ fetchPriority: "high" } as const)
    : { loading: loading ?? "lazy", decoding: "async" as const };

  if (!sources) {
    return <img src={src} alt={alt} width={width} height={height} {...timing} {...rest} />;
  }

  return (
    // "contents" takes the wrapper out of the layout, so the image still sits
    // directly in its grid, flex box or positioned parent. The sources need
    // "hidden" for the same reason: they'd otherwise become empty grid cells.
    <picture className="contents">
      <source className="hidden" type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source className="hidden" type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        {...reservedSize(sources, numeric(width), numeric(height))}
        {...timing}
        {...rest}
      />
    </picture>
  );
}

function numeric(value: number | string | undefined) {
  return value === undefined ? undefined : Number(value);
}
