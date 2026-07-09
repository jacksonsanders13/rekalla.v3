"use client";

export interface RingSpec {
  /** 0..1 completion. */
  progress: number;
  /** Stroke color (ring track renders at 20% opacity). */
  color: string;
  label: string;
}

const STROKE = 16;
const GAP = 5;

/**
 * Apple Fitness-style concentric progress rings. Purely decorative SVG —
 * the accessible reading lives in the legend next to it.
 */
export function ActivityRings({
  rings,
  size = 200,
}: {
  /** Outer ring first. */
  rings: RingSpec[];
  size?: number;
}) {
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="shrink-0"
    >
      {rings.map((ring, index) => {
        const radius = center - STROKE / 2 - index * (STROKE + GAP);
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(Math.max(ring.progress, 0), 1);
        // A dot of progress even at zero, like the Fitness app.
        const dash = Math.max(progress, 0.005) * circumference;
        return (
          <g key={ring.label} transform={`rotate(-90 ${center} ${center})`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeOpacity={0.2}
              strokeWidth={STROKE}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-[stroke-dasharray] duration-700 ease-out"
            />
          </g>
        );
      })}
    </svg>
  );
}
