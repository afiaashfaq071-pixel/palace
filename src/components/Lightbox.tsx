import { useCallback, useEffect, useRef } from "react";
import type { RefObject, TouchEvent } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ImageAsset } from "../data/site";

interface Props {
  photos: ImageAsset[];
  /** Indexes into `photos` whose real image file loaded. Placeholders are never shown here. */
  openable: number[];
  /** Index into `photos` currently shown. */
  current: number;
  /** Element that opened the viewer; it gets focus back once the viewer has fully gone. */
  returnFocusTo: RefObject<HTMLElement | null>;
  onChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_DISTANCE = 50;

export default function Lightbox({
  photos,
  openable,
  current,
  returnFocusTo,
  onChange,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const position = openable.indexOf(current);
  const total = openable.length;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (position < 0 || total < 2) return;
      onChange(openable[(position + dir + total) % total]);
    },
    [position, total, openable, onChange],
  );

  // While open: hide the rest of the page from keyboard and screen readers (`inert`),
  // lock background scrolling and put focus in the dialog. When this component is removed,
  // which is after the exit animation has finished, everything is restored in order and
  // focus goes back to the tile that opened it.
  useEffect(() => {
    const root = document.getElementById("root");
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    if (root) root.inert = true;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    closeRef.current?.focus();

    return () => {
      if (root) root.inert = false;
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      returnFocusTo.current?.focus({ preventScroll: true });
    };
  }, [returnFocusTo]);

  // Escape, arrow keys and a Tab focus trap (a safety net on top of `inert`).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!dialog.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > SWIPE_DISTANCE) step(delta < 0 ? 1 : -1);
  };

  const photo = photos[current];

  return createPortal(
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex flex-col overscroll-contain bg-ink/95 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between px-4 py-2 sm:px-6">
        <p className="text-sm text-ivory/70" aria-live="polite">
          {position + 1} / {total}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="icon-btn"
          aria-label="Close photo viewer"
          onClick={onClose}
        >
          <X size={26} aria-hidden="true" />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <m.figure
          key={current}
          className="flex max-h-full max-w-full flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            decoding="async"
            className="max-h-[calc(100svh-12rem)] w-auto max-w-full rounded-xl object-contain"
          />
          <figcaption className="mt-3 text-center text-sm text-ivory/70">{photo.alt}</figcaption>
        </m.figure>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-6 px-4 py-4">
          <button
            type="button"
            className="icon-btn border border-ivory/20"
            aria-label="Previous photo"
            onClick={() => step(-1)}
          >
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn border border-ivory/20"
            aria-label="Next photo"
            onClick={() => step(1)}
          >
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </div>
      )}
    </m.div>,
    document.body,
  );
}
