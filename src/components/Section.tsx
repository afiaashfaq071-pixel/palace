import type { ReactNode } from "react";

const TONES = {
  ink: "bg-ink text-ivory",
  charcoal: "bg-charcoal text-ivory",
  ivory: "bg-ivory text-ink",
} as const;

interface Props {
  id: string;
  /** id of the section's h2, for aria-labelledby. */
  labelledBy: string;
  tone: keyof typeof TONES;
  children: ReactNode;
}

/** Shared wrapper so every section has identical spacing, width and landmark labelling. */
export default function Section({ id, labelledBy, tone, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={`${TONES[tone]} py-16 focus:outline-none sm:py-28`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
