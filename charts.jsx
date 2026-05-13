// charts.jsx — hand-rolled SVG charts for Pupuk HR dashboard.
// Style: smooth area lines, soft fills, dashed gridlines.

// ───────── Sparkline (small, in KPI cards) ─────────
const Sparkline = ({ data, w = 120, h = 40, color = 'var(--primary)', filled = true }) => {
  if (!data || !data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, h - ((v - min) / range) * (h - 6) - 3]);

  // smooth curve via cubic bezier
  const path = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const prev = points[i - 1];
    const cx = (prev[0] + p[0]) / 2;
    return `${acc} C ${cx} ${prev[1]}, ${cx} ${p[1]}, ${p[0]} ${p[1]}`;
  }, '');

  const fillPath = `${path} L ${w} ${h} L 0 ${h} Z`;
  const id = React.useId();
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={color} stopOpacity="0.32"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {filled && <path d={fillPath} fill={`url(#spk-${id})`}/>}
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ───────── Area chart (headcount trend) ─────────
const AreaChart = ({ data, height = 280 }) => {
  const W = 720;
  const H = height;
  const padL = 48, padR = 16, padT = 24, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const min = Math.min(...data.map(d => d.v));
  const max = Math.max(...data.map(d => d.v));
  const padding = (max - min) * 0.15;
  const yMin = Math.floor((min - padding) / 50) * 50;
  const yMax = Math.ceil((max + padding) / 50) * 50;
  const range = yMax - yMin;

  const stepX = innerW / (data.length - 1);
  const xy = data.map((d, i) => [
    padL + i * stepX,
    padT + innerH - ((d.v - yMin) / range) * innerH,
  ]);

  // smooth path
  const linePath = xy.reduce((acc, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const prev = xy[i - 1];
    const cx = (prev[0] + p[0]) / 2;
    return `${acc} C ${cx} ${prev[1]}, ${cx} ${p[1]}, ${p[0]} ${p[1]}`;
  }, '');
  const fillPath = `${linePath} L ${padL + innerW} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  // Y ticks
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (range * i / yTicks));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--primary)" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Y grid */}
      {ticks.map((t, i) => {
        const y = padT + innerH - ((t - yMin) / range) * innerH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={padL + innerW} y2={y}
                  stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" opacity="0.7"/>
            <text x={padL - 10} y={y + 4} textAnchor="end"
                  fontSize="11" fill="var(--text-secondary)" style={{ fontFamily: 'inherit' }}>
              {(t/1000).toFixed(1)}k
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={xy[i][0]} y={H - 14} textAnchor="middle"
              fontSize="11" fill="var(--text-secondary)" style={{ fontFamily: 'inherit' }}>
          {d.m}
        </text>
      ))}

      {/* Area + line */}
      <path d={fillPath} fill="url(#area-fill)"/>
      <path d={linePath} stroke="var(--primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Dots — last only */}
      {(() => {
        const p = xy[xy.length - 1];
        return (<g>
          <circle cx={p[0]} cy={p[1]} r="6" fill="white" stroke="var(--primary)" strokeWidth="2.5"/>
          <circle cx={p[0]} cy={p[1]} r="2.5" fill="var(--primary)"/>
          <g transform={`translate(${p[0] - 50},${p[1] - 44})`}>
            <rect width="100" height="32" rx="8" fill="var(--text)"/>
            <text x="50" y="13" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" style={{ fontFamily: 'inherit', letterSpacing: '0.04em' }}>MEI 2026</text>
            <text x="50" y="26" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" style={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }}>
              {data[data.length-1].v.toLocaleString('id-ID')}
            </text>
          </g>
        </g>);
      })()}
    </svg>
  );
};

// ───────── Hire vs Exit (paired bars) ─────────
const HireExitChart = ({ data, height = 200 }) => {
  const W = 480, H = height;
  const padL = 32, padR = 12, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...data.flatMap(d => [d.hire, d.exit]));
  const yMax = Math.ceil(max / 25) * 25 + 25;
  const groupW = innerW / data.length;
  const barW = 14;
  const gap = 4;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((p, i) => {
        const y = padT + innerH * (1 - p);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={padL + innerW} y2={y}
                  stroke="var(--border)" strokeDasharray="3 4" opacity="0.7"/>
            <text x={padL - 8} y={y + 4} textAnchor="end"
                  fontSize="10" fill="var(--text-secondary)">
              {Math.round(yMax * p)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const hireH = (d.hire / yMax) * innerH;
        const exitH = (d.exit / yMax) * innerH;
        return (
          <g key={i}>
            <rect x={cx - barW - gap/2} y={padT + innerH - hireH}
                  width={barW} height={hireH} rx="3"
                  fill="var(--primary)"/>
            <rect x={cx + gap/2} y={padT + innerH - exitH}
                  width={barW} height={exitH} rx="3"
                  fill="var(--text-disabled)" opacity="0.55"/>
            <text x={cx} y={H - 8} textAnchor="middle"
                  fontSize="11" fill="var(--text-secondary)">{d.m}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ───────── Donut (anak perusahaan distribution) ─────────
const Donut = ({ data, size = 220, strokeW = 28, total }) => {
  const sum = total ?? data.reduce((s, d) => s + d.headcount, 0);
  const r = (size - strokeW) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r}
              stroke="var(--hover)" strokeWidth={strokeW} fill="none"/>
      {data.map((d, i) => {
        const frac = d.headcount / sum;
        const dash = c * frac;
        const offset = -acc * c;
        acc += frac;
        return (
          <circle key={d.id} cx={size/2} cy={size/2} r={r}
                  stroke={d.color} strokeWidth={strokeW} fill="none"
                  strokeDasharray={`${dash - 2} ${c - dash + 2}`}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${size/2} ${size/2})`}
                  strokeLinecap="butt"/>
        );
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle"
            fontSize="11" fill="var(--text-secondary)"
            style={{ fontFamily: 'inherit', letterSpacing: '0.06em' }}>TOTAL</text>
      <text x={size/2} y={size/2 + 22} textAnchor="middle"
            fontSize="28" fontWeight="700" fill="var(--text)"
            style={{ fontFamily: 'Barlow, inherit', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
        {sum.toLocaleString('id-ID')}
      </text>
    </svg>
  );
};

window.Sparkline = Sparkline;
window.AreaChart = AreaChart;
window.HireExitChart = HireExitChart;
window.Donut = Donut;
