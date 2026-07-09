"use client";

import { useId, useMemo, useState } from "react";
import { fromDateKey } from "@/lib/utils";

export interface TrendPoint {
  dateKey: string;
  value: number;
}

const WIDTH = 560;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

function shortDate(dateKey: string): string {
  return fromDateKey(dateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * A single-series trend line with an area fill, hover tooltip, and a
 * screen-reader table. The title on the surrounding card names the series,
 * so no legend is needed.
 */
export function TrendChart({
  title,
  unit,
  points,
  color,
  domain,
  formatValue = (v) => String(v),
}: {
  title: string;
  unit: string;
  points: TrendPoint[];
  color: string;
  /** Fixed y-domain, e.g. [1, 5] for mood. */
  domain: [number, number];
  formatValue?: (value: number) => string;
}) {
  const chartId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const { path, area, coords, ticks } = useMemo(() => {
    const [min, max] = domain;
    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = (v: number) =>
      PAD.top + innerH - ((Math.min(Math.max(v, min), max) - min) / (max - min)) * innerH;

    const coords = points.map((p, i) => ({ x: x(i), y: y(p.value), point: p }));
    const path = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(" ");
    const area =
      coords.length > 1
        ? `${path} L${coords[coords.length - 1].x.toFixed(1)},${PAD.top + innerH} L${coords[0].x.toFixed(1)},${PAD.top + innerH} Z`
        : "";

    const mid = (min + max) / 2;
    const ticks = [min, mid, max].map((v) => ({ value: v, y: y(v) }));
    return { path, area, coords, ticks };
  }, [points, domain]);

  if (points.length === 0) {
    return (
      <p className="flex h-44 items-center justify-center text-base text-label-3">
        No check-ins yet — trends appear after your first one.
      </p>
    );
  }

  const hovered = hover !== null ? coords[hover] : null;
  const last = coords[coords.length - 1];

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let best = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - px);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover(nearest);
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-labelledby={`${chartId}-label`}
        onPointerMove={handleMove}
        onPointerLeave={() => setHover(null)}
      >
        <title id={`${chartId}-label`}>
          {title} over the last {points.length} check-ins
        </title>

        {/* Recessive gridlines with axis labels */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#3a3a3c"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              fontSize={12}
              fill="#8e8e93"
            >
              {formatValue(tick.value)}
            </text>
          </g>
        ))}

        {/* First / last date labels */}
        <text
          x={coords[0].x}
          y={HEIGHT - 8}
          textAnchor="start"
          fontSize={12}
          fill="#8e8e93"
        >
          {shortDate(points[0].dateKey)}
        </text>
        {points.length > 1 && (
          <text
            x={last.x}
            y={HEIGHT - 8}
            textAnchor="end"
            fontSize={12}
            fill="#8e8e93"
          >
            {shortDate(points[points.length - 1].dateKey)}
          </text>
        )}

        {area && <path d={area} fill={color} opacity={0.08} />}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Latest point gets a marker + direct label; others appear on hover */}
        <circle
          cx={last.x}
          cy={last.y}
          r={4.5}
          fill={color}
          stroke="#1c1c1e"
          strokeWidth={2}
        />

        {hovered && (
          <g>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              stroke="#636366"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r={5}
              fill={color}
              stroke="#1c1c1e"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {hovered && hover !== null && (
        <div
          role="status"
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-elev-3 px-3 py-1.5 text-sm font-medium text-label ring-1 ring-white/10"
          style={{ left: `${(hovered.x / WIDTH) * 100}%` }}
        >
          {shortDate(points[hover].dateKey)} ·{" "}
          {formatValue(points[hover].value)} {unit}
        </div>
      )}

      {/* Data table for screen readers */}
      <table className="sr-only">
        <caption>{title} by day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">{title}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.dateKey}>
              <td>{shortDate(p.dateKey)}</td>
              <td>
                {formatValue(p.value)} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
