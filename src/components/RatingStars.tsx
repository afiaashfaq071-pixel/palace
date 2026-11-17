import { Star } from "lucide-react";

interface Props {
  /** Rating out of 5. Halves are drawn as a half-filled star. */
  value: number;
  size?: number;
}

/** Decorative stars. The rating is always also written out as text next to it. */
export default function RatingStars({ value, size = 18 }: Props) {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span className="flex gap-0.5 text-gold-deep" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i)); // 0, 0.5 or 1
        return (
          <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
            <Star size={size} strokeWidth={1.5} />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} strokeWidth={1.5} fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
