import { useState } from "react";

const chartData = [
  { label: "Mon", value: 1200, lessons: 320 },
  { label: "Tue", value: 1350, lessons: 410 },
  { label: "Wed", value: 1250, lessons: 380 },
  { label: "Thu", value: 1420, lessons: 490 },
  { label: "Fri", value: 1580, lessons: 610 },
  { label: "Sat", value: 1300, lessons: 450 },
  { label: "Sun", value: 1480, lessons: 530 },
];

export function DashboardChart() {
  const [activeIdx, setActiveIdx] = useState(null);

  const width = 600;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...chartData.map((d) => d.value)) * 1.1; // 10% headroom

  // Calculate coordinates for the line chart (Active Users)
  const points = chartData.map((d, index) => {
    const x = paddingLeft + (index / (chartData.length - 1)) * chartWidth;
    const y = height - paddingBottom - (d.value / maxVal) * chartHeight;
    return { x, y, ...d, index };
  });

  // Create path command
  const linePath = points.reduce((path, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  // Create fill path command (goes down to bottom axis)
  const fillPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  return (
    <div className="relative w-full rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-white text-lg">App Usage Trends</h3>
          <p className="text-sm text-gray-400">Daily Active Users & Lesson Progress</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-gray-400">Active Users</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB5607" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FB5607" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={idx} className="opacity-60">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-500 text-[10px] font-semibold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bottom Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-gray-400 text-[10px] font-bold"
            >
              {p.label}
            </text>
          ))}

          {/* Gradient Area Fill */}
          <path d={fillPath} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#FB5607"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Vertical Bar */}
          {activeIdx !== null && (
            <line
              x1={points[activeIdx].x}
              y1={paddingTop}
              x2={points[activeIdx].x}
              y2={height - paddingBottom}
              stroke="#FB5607"
              strokeOpacity="0.3"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Interactive Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Invisible interactive area */}
              <circle
                cx={p.x}
                cy={p.y}
                r="18"
                className="fill-transparent cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={activeIdx === idx ? "7" : "5"}
                className={`transition-all duration-150 pointer-events-none ${
                  activeIdx === idx
                    ? "fill-primary stroke-[#080B11] stroke-[2.5px] shadow-sm"
                    : "fill-[#080B11] stroke-primary stroke-[2.5px]"
                }`}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Popup */}
        {activeIdx !== null && (
          <div
            className="absolute z-10 bg-black/80 text-white rounded-lg p-3 shadow-xl border border-white/[0.08] backdrop-blur-md text-xs pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
            style={{
              left: `${(points[activeIdx].x / width) * 100}%`,
              top: `${(points[activeIdx].y / height) * 100 - 32}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="font-semibold border-b border-white/[0.06] pb-1 mb-1 text-gray-300">
              {points[activeIdx].label}day Status
            </div>
            <div className="flex justify-between gap-4">
              <span>Active Users:</span>
              <span className="font-bold text-primary-soft">{points[activeIdx].value}</span>
            </div>
            <div className="flex justify-between gap-4 mt-0.5">
              <span>Lessons Finished:</span>
              <span className="font-bold text-emerald-400">{points[activeIdx].lessons}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
