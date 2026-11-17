interface Props {
  id: string;
  eyebrow: string;
  title: string;
  /** Use the darker gold eyebrow on ivory backgrounds so it stays readable. */
  onLight?: boolean;
  align?: "left" | "center";
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  onLight = false,
  align = "left",
}: Props) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p
        className={`text-xs font-medium uppercase tracking-[0.3em] ${
          onLight ? "text-gold-deep" : "text-gold"
        }`}
      >
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
