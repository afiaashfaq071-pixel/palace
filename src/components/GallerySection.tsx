import { memo, useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import SmartImage from "./SmartImage";
import type { ImageStatus } from "./SmartImage";
import { IMAGES } from "../data/site";
import type { ImageAsset } from "../data/site";

const photos = IMAGES.gallery;

/**
 * Six tiles fill the grid with no gaps:
 * mobile (2 columns): wide, 2 + 2 squares, wide.  desktop (3 columns): one large tile + 5 squares.
 */
const TILE_CLASSES = [
  "col-span-2 aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto",
  "aspect-square",
  "aspect-square",
  "aspect-square",
  "aspect-square",
  "col-span-2 aspect-[16/9] md:col-span-1 md:aspect-square",
];

interface TileProps {
  photo: ImageAsset;
  index: number;
  ready: boolean;
  className: string;
  onOpen: (index: number, trigger: HTMLElement) => void;
  onStatus: (index: number, status: ImageStatus) => void;
}

const GalleryTile = memo(function GalleryTile({
  photo,
  index,
  ready,
  className,
  onOpen,
  onStatus,
}: TileProps) {
  const handleStatus = useCallback((status: ImageStatus) => onStatus(index, status), [onStatus, index]);

  return (
    <Reveal className={className}>
      {/* Disabled until the real photo has loaded, so an empty placeholder cannot be opened. */}
      <button
        type="button"
        disabled={!ready}
        onClick={(e: MouseEvent<HTMLButtonElement>) => onOpen(index, e.currentTarget)}
        aria-label={ready ? `Open photo: ${photo.alt}` : `Photograph to be added: ${photo.label}`}
        className={`group block h-full w-full overflow-hidden rounded-2xl ${
          ready ? "cursor-zoom-in" : "cursor-default"
        }`}
      >
        <SmartImage
          image={photo}
          sizes="(min-width: 768px) 33vw, 50vw"
          onStatus={handleStatus}
          className={`h-full w-full ${
            ready ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""
          }`}
        />
      </button>
    </Reveal>
  );
});

export default function GallerySection() {
  const [ready, setReady] = useState<boolean[]>(() => photos.map(() => false));
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleStatus = useCallback((index: number, status: ImageStatus) => {
    const isReady = status === "loaded";
    setReady((prev) => (prev[index] === isReady ? prev : prev.map((v, i) => (i === index ? isReady : v))));
  }, []);

  const openable = useMemo(() => photos.map((_, i) => i).filter((i) => ready[i]), [ready]);

  const handleOpen = useCallback((index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(index);
  }, []);

  // Focus returns to the opening tile from inside Lightbox, once its exit animation is done.
  const handleClose = useCallback(() => setActive(null), []);

  return (
    <Section id="gallery" labelledBy="gallery-title" tone="ink">
      <Reveal>
        <SectionHeading id="gallery-title" eyebrow="Gallery" title="Moments Worth Remembering" />
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {photos.map((photo, i) => (
          <GalleryTile
            key={photo.src}
            photo={photo}
            index={i}
            ready={ready[i]}
            className={TILE_CLASSES[i] ?? "aspect-square"}
            onOpen={handleOpen}
            onStatus={handleStatus}
          />
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            photos={photos}
            openable={openable}
            current={active}
            returnFocusTo={triggerRef}
            onChange={setActive}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
