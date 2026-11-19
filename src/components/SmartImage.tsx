
import { memo, useEffect, useRef, useState } from "react";
import type { ImageAsset } from "../data/site";
import ImagePlaceholder from "./ImagePlaceholder";

export type ImageStatus = "loading" | "loaded" | "error";

/** Phones: portrait image is used below this width. */
const MOBILE_QUERY = "(max-width: 767px)";

interface Props {
  image: ImageAsset;
  /** Size and aspect ratio come from the parent. */
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  placeholderVariant?: "hero" | "tile";
  /** Reports whether the real image loaded. */
  onStatus?: (status: ImageStatus) => void;
}

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
  const [mobileFailed, setMobileFailed] = useState(false);

  const ref = useRef<HTMLImageElement>(null);

  const useMobileSource = Boolean(image.mobileSrc) && !mobileFailed;

  // Check images that loaded before React attached event listeners.
  useEffect(() => {
    const el = ref.current;

    if (el?.complete) {
      setStatus(el.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  // Notify the parent when image status changes.
  useEffect(() => {
    if (status !== "loading") {
      onStatus?.(status);
    }
  }, [status, onStatus]);

  // Check whether the mobile image exists.
  useEffect(() => {
    const mobileSrc = image.mobileSrc;

    if (!mobileSrc || mobileFailed) return;

    const query = window.matchMedia(MOBILE_QUERY);
    let probe: HTMLImageElement | null = null;

    const check = () => {
      if (!query.matches || probe) return;

      probe = new Image();

      probe.onload = () => {
        probe = null;
      };

      probe.onerror = () => {
        setMobileFailed(true);
      };

      probe.src = mobileSrc;
    };

    check();

    query.addEventListener("change", check);

    return () => {
      query.removeEventListener("change", check);

      if (probe) {
        probe.onload = null;
        probe.onerror = null;
      }
    };
  }, [image.mobileSrc, mobileFailed]);

  // Handle image loading errors.
  const handleError = () => {
    if (
      useMobileSource &&
      window.matchMedia(MOBILE_QUERY).matches
    ) {
      setMobileFailed(true);
      setStatus("loading");
      return;
    }

    setStatus("error");
  };

  // Display a placeholder if the image fails.
  if (status === "error") {
    return (
      <ImagePlaceholder
        label={image.label}
        variant={placeholderVariant}
        className={className}
      />
    );
  }

  const img = (
    <img
      ref={ref}
      src={image.src}
      alt={image.alt}
      loading={loading}
      fetchpriority={fetchPriority}
      decoding="async"
      sizes={sizes}
      onLoad={() => setStatus("loaded")}
      onError={handleError}
      className={`bg-charcoal object-cover ${className}`}
    />
  );

  // Desktop image or mobile fallback.
  if (!useMobileSource) {
    return img;
  }

  // Serve a separate portrait image on mobile.
  return (
    <picture className="block h-full w-full">
      <source
        media={MOBILE_QUERY}
        srcSet={image.mobileSrc}
      />
      {img}
    </picture>
  );
}

export default memo(SmartImage);
