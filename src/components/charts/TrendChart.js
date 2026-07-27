import { useMemo, useRef, useState } from "react";

// Fixed drawing surface — the SVG scales responsively via width:100%/height:auto
// while keeping this aspect ratio, so pointer math only needs one scale factor.
const VIEW_W = 640;
const VIEW_H = 240;
const PAD = { top: 24, right: 16, bottom: 28, left: 52 };
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;

const INK_PRIMARY = "#0b0b0b";
const INK_MUTED = "#898781";
const GRIDLINE = "#e1e0d9";
const BASELINE = "#c3c2b7";
const SURFACE = "#fcfcfb";

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Rounds a max value up to a "clean" step (1/2/5/10 * 10^k) so axis ticks
// read as round numbers instead of arbitrary decimals.
function niceCeil(value) {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = Math.pow(10, exponent);
  const residual = value / magnitude;
  let niceResidual;
  if (residual <= 1) niceResidual = 1;
  else if (residual <= 2) niceResidual = 2;
  else if (residual <= 5) niceResidual = 5;
  else niceResidual = 10;
  return niceResidual * magnitude;
}

/**
 * Single-series trend chart (line + area) for "change over time" data —
 * orders/month, revenue/month, etc. One hue, no legend (the title names the
 * series), direct label on the last point, hover crosshair + tooltip, and a
 * "View as table" fallback so every value is reachable without the chart.
 */
export default function TrendChart({
  title,
  subtitle,
  points,
  color,
  formatValue = (v) => String(Math.round(v)),
  valueLabel = "Value",
}) {
  const wrapperRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const n = points.length;
  const maxValue = useMemo(
    () => niceCeil(Math.max(...points.map((p) => p.value), 0)),
    [points]
  );

  const xAt = (i) => (n <= 1 ? PAD.left + PLOT_W / 2 : PAD.left + (i / (n - 1)) * PLOT_W);
  const yAt = (v) => PAD.top + PLOT_H - (v / maxValue) * PLOT_H;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(p.value)}`)
    .join(" ");

  const areaPath = n
    ? `${linePath} L ${xAt(n - 1)} ${PAD.top + PLOT_H} L ${xAt(0)} ${PAD.top + PLOT_H} Z`
    : "";

  const yTicks = [0, maxValue / 2, maxValue];

  // Show every label when there's room; thin them out once buckets crowd the axis.
  const labelStep = n > 6 ? 2 : 1;

  const handlePointerMove = (e) => {
    if (!wrapperRef.current || n === 0) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const scale = rect.width / VIEW_W;
    const localX = (e.clientX - rect.left) / scale;
    const fraction = n <= 1 ? 0 : (localX - PAD.left) / PLOT_W;
    const idx = Math.min(n - 1, Math.max(0, Math.round(fraction * (n - 1))));
    setHoverIdx(idx);
  };

  const clearHover = () => setHoverIdx(null);

  const scale = wrapperRef.current
    ? wrapperRef.current.getBoundingClientRect().width / VIEW_W
    : 0;

  const hovered = hoverIdx != null ? points[hoverIdx] : null;
  const hoverPxX = hoverIdx != null ? xAt(hoverIdx) * scale : 0;
  const hoverPxY = hoverIdx != null ? yAt(hovered.value) * scale : 0;
  const tooltipAlign = hoverIdx == null ? "center" : hoverIdx < n * 0.15 ? "left" : hoverIdx > n * 0.85 ? "right" : "center";
  const tooltipTransform =
    tooltipAlign === "left" ? "translate(0, -115%)" : tooltipAlign === "right" ? "translate(-100%, -115%)" : "translate(-50%, -115%)";

  const lastPoint = n ? points[n - 1] : null;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {n === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
          Not enough order data yet.
        </div>
      ) : (
        <>
          <div ref={wrapperRef} className="relative mt-2">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              style={{ width: "100%", height: "auto", display: "block" }}
              role="img"
              aria-label={`${title}: ${points.map((p) => `${p.label} ${formatValue(p.value)}`).join(", ")}`}
              onMouseMove={handlePointerMove}
              onMouseLeave={clearHover}
            >
              {/* Gridlines (mid + top) and baseline */}
              {yTicks.map((tick, i) => (
                <line
                  key={i}
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={yAt(tick)}
                  y2={yAt(tick)}
                  stroke={tick === 0 ? BASELINE : GRIDLINE}
                  strokeWidth={1}
                />
              ))}

              {/* Y-axis tick labels */}
              {yTicks.map((tick, i) => (
                <text
                  key={i}
                  x={PAD.left - 8}
                  y={yAt(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill={INK_MUTED}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatValue(tick)}
                </text>
              ))}

              {/* X-axis labels */}
              {points.map((p, i) =>
                i % labelStep === 0 || i === n - 1 ? (
                  <text
                    key={p.label + i}
                    x={xAt(i)}
                    y={VIEW_H - 8}
                    textAnchor="middle"
                    fontSize={11}
                    fill={INK_MUTED}
                  >
                    {p.label}
                  </text>
                ) : null
              )}

              {/* Area + line */}
              {n > 1 && <path d={areaPath} fill={hexToRgba(color, 0.1)} stroke="none" />}
              {n > 1 && (
                <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              )}

              {/* End marker with surface ring */}
              {lastPoint && (
                <>
                  <circle cx={xAt(n - 1)} cy={yAt(lastPoint.value)} r={6} fill={SURFACE} />
                  <circle cx={xAt(n - 1)} cy={yAt(lastPoint.value)} r={4} fill={color} />
                </>
              )}

              {/* Direct label on the last point */}
              {lastPoint && (
                <text
                  x={xAt(n - 1)}
                  y={yAt(lastPoint.value) - 12}
                  textAnchor="end"
                  fontSize={12}
                  fontWeight={600}
                  fill={INK_PRIMARY}
                >
                  {formatValue(lastPoint.value)}
                </text>
              )}

              {/* Hover crosshair + point */}
              {hoverIdx != null && (
                <>
                  <line
                    x1={xAt(hoverIdx)}
                    x2={xAt(hoverIdx)}
                    y1={PAD.top}
                    y2={PAD.top + PLOT_H}
                    stroke={BASELINE}
                    strokeWidth={1}
                  />
                  <circle cx={xAt(hoverIdx)} cy={yAt(hovered.value)} r={6} fill={SURFACE} />
                  <circle cx={xAt(hoverIdx)} cy={yAt(hovered.value)} r={4} fill={color} />
                </>
              )}
            </svg>

            {hovered && (
              <div
                className="pointer-events-none absolute z-10 rounded-lg bg-gray-900 text-white text-xs px-3 py-2 shadow-lg whitespace-nowrap"
                style={{
                  left: hoverPxX,
                  top: hoverPxY,
                  transform: tooltipTransform,
                }}
              >
                <div className="text-gray-300">{hovered.label}</div>
                <div className="font-semibold">
                  <span className="inline-block w-2 h-0.5 align-middle mr-1.5" style={{ backgroundColor: color }} />
                  {formatValue(hovered.value)} <span className="font-normal text-gray-300">{valueLabel}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-3"
          >
            {showTable ? "Hide table" : "View as table"}
          </button>

          {showTable && (
            <div className="table-shell mt-2">
              <table className="min-w-full text-xs">
                <thead className="table-head-row">
                  <tr>
                    <th className="table-cell py-2">Month</th>
                    <th className="table-cell py-2">{valueLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((p) => (
                    <tr key={p.label} className="table-row">
                      <td className="table-cell py-1.5">{p.label}</td>
                      <td className="table-cell py-1.5">{formatValue(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
