interface Props {
  label: string;
  /** "hero" hides the caption so it never collides with the hero text. */
  variant?: "hero" | "tile";
  className?: string;
}

/**
 * Shown wherever a real photograph has not been added yet.
 * It is deliberately a drawing and a caption, never a stock or generated photo.
 */
export default function ImagePlaceholder({ label, variant = "tile", className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={`Photograph to be added: ${label}`}
      className={`relative flex items-end justify-center overflow-hidden bg-charcoal ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 35%, rgba(198,164,106,0.14), transparent 65%)",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        className="absolute left-1/2 top-[44%] h-[58%] max-h-[26rem] w-auto -translate-x-1/2 -translate-y-1/2 text-gold/30"
      >
        <path d="M24 104V54a36 36 0 0 1 72 0v50" />
        <path d="M34 104V56a26 26 0 0 1 52 0v48" />
        <path d="M44 104V58a16 16 0 0 1 32 0v46" />
        <path d="M60 18V8M54 12h12" />
        <path d="M14 104h92" />
      </svg>
      {variant === "tile" && (
        <p className="relative px-3 pb-4 text-center text-[0.65rem] uppercase tracking-[0.25em] text-gold/80">
          {label}
        </p>
      )}
    </div>
  );
}
