interface Point {
  x: number;
  y: number;
}

export function LineChart({
  points,
  width = 600,
  height = 220,
  zeroLine = true,
  xLabel,
  yFormatter = (v: number) => String(v),
}: {
  points: Point[];
  width?: number;
  height?: number;
  zeroLine?: boolean;
  xLabel?: string;
  yFormatter?: (value: number) => string;
}) {
  if (points.length === 0) return null;

  const padding = { top: 16, right: 16, bottom: 28, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(0, ...ys);
  const maxY = Math.max(0, ...ys);

  const scaleX = (x: number) =>
    padding.left +
    (maxX === minX ? 0 : ((x - minX) / (maxX - minX)) * innerWidth);
  const scaleY = (y: number) =>
    padding.top +
    innerHeight -
    (maxY === minY ? 0 : ((y - minY) / (maxY - minY)) * innerHeight);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(p.x)},${scaleY(p.y)}`)
    .join(" ");

  const areaPath = `${linePath} L${scaleX(maxX)},${scaleY(0)} L${scaleX(
    minX
  )},${scaleY(0)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={xLabel ?? "잔고 변화 그래프"}
    >
      {zeroLine && minY < 0 && maxY > 0 && (
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={scaleY(0)}
          y2={scaleY(0)}
          stroke="#d4d4d8"
          strokeDasharray="4 4"
        />
      )}
      <path d={areaPath} fill="#0d948820" stroke="none" />
      <path d={linePath} fill="none" stroke="#0d9488" strokeWidth={2.5} />
      <text x={padding.left} y={14} className="fill-zinc-500 text-[10px]">
        {yFormatter(maxY)}
      </text>
      <text
        x={padding.left}
        y={height - 6}
        className="fill-zinc-500 text-[10px]"
      >
        {yFormatter(minY)}
      </text>
    </svg>
  );
}
