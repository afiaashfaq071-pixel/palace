import { memo, useEffect, useRef, useState } from "react";
import type { ImageAsset } from "../data/site";
import ImagePlaceholder from "./ImagePlaceholder";

export type ImageStatus = "loading" | "loaded" | "error";

interface Props {
  image: ImageAsset;
  /** Size and aspect ratio come from the parent so the layout never shifts or breaks. */
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  placeholderVariant?: "hero" | "tile";
  /** Reports whether the real file loaded, so callers can avoid opening empty placeholders. */
  onStatus?: (status: ImageStatus) => void;
}

/**
 * Renders the real photo from /public/images. If the file is missing or not a valid image,
 * a clearly labelled placeholder fills the same box, so layouts never break and nothing
 * is passed off as a real photograph.
 */
function SmartImage({
  image,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
  placeholderVariant = "tile",
  onStatus,
}: Props) {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const ref = useRef<HTMLImageElement>(null);

  // Handles images that finished loading (or failed) before React attached its listeners.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete) setStatus(el.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  useEffect(() => {
    if (status !== "loading") onStatus?.(status);
  }, [status, onStatus]);

  if (status === "error") {
    return (
      <ImagePlaceholder label={image.label} variant={placeholderVariant} className={className} />
    );
  }

  return (
    <img
      ref={ref}
      src={image.src}
      alt={image.alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      sizes={sizes}
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
      className={`bg-charcoal object-cover ${className}`}
    />
  );
}

export default memo(SmartImage);
