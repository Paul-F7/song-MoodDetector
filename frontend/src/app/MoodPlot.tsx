interface PlotPoint {
  valence: number;
  arousal: number;
  label: string;
  emoji: string;
  color: string;
  size: 'large' | 'small';
}

interface MoodPlotProps {
  points: PlotPoint[];
}

export default function MoodPlot({ points }: MoodPlotProps) {
  const W = 400;
  const H = 400;
  const PAD = 50;
  const PW = W - 2 * PAD;
  const PH = H - 2 * PAD;

  const toX = (v: number) => PAD + v * PW;
  const toY = (a: number) => PAD + (1 - a) * PH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="quadTopRight" cx="100%" cy="0%" r="100%">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.35)" />
          <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
        </radialGradient>
        <radialGradient id="quadTopLeft" cx="0%" cy="0%" r="100%">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.35)" />
          <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
        </radialGradient>
        <radialGradient id="quadBottomLeft" cx="0%" cy="100%" r="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.35)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </radialGradient>
        <radialGradient id="quadBottomRight" cx="100%" cy="100%" r="100%">
          <stop offset="0%" stopColor="rgba(34, 197, 94, 0.35)" />
          <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Plot background */}
      <rect x={PAD} y={PAD} width={PW} height={PH} fill="rgba(15, 23, 42, 0.6)" rx="8" />

      {/* Quadrant tints */}
      <rect x={PAD + PW / 2} y={PAD} width={PW / 2} height={PH / 2} fill="url(#quadTopRight)" rx="4" />
      <rect x={PAD} y={PAD} width={PW / 2} height={PH / 2} fill="url(#quadTopLeft)" rx="4" />
      <rect x={PAD} y={PAD + PH / 2} width={PW / 2} height={PH / 2} fill="url(#quadBottomLeft)" rx="4" />
      <rect x={PAD + PW / 2} y={PAD + PH / 2} width={PW / 2} height={PH / 2} fill="url(#quadBottomRight)" rx="4" />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={`grid-${t}`} stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          <line x1={toX(t)} y1={PAD} x2={toX(t)} y2={PAD + PH} />
          <line x1={PAD} y1={toY(t)} x2={PAD + PW} y2={toY(t)} />
        </g>
      ))}

      {/* Center axes */}
      <line x1={toX(0.5)} y1={PAD} x2={toX(0.5)} y2={PAD + PH} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 4" />
      <line x1={PAD} y1={toY(0.5)} x2={PAD + PW} y2={toY(0.5)} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 4" />

      {/* Outer border */}
      <rect x={PAD} y={PAD} width={PW} height={PH} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" rx="8" />

      {/* Quadrant labels */}
      <g fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.55)">
        <text x={toX(0.78)} y={toY(0.96)} textAnchor="middle">EXCITED</text>
        <text x={toX(0.22)} y={toY(0.96)} textAnchor="middle">TENSE</text>
        <text x={toX(0.22)} y={toY(0.04) + 8} textAnchor="middle">SAD</text>
        <text x={toX(0.78)} y={toY(0.04) + 8} textAnchor="middle">CALM</text>
      </g>

      {/* Axis titles */}
      <text x={W / 2} y={H - 14} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.7)">
        VALENCE  →
      </text>
      <text
        x={18}
        y={H / 2}
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="12"
        fontWeight="700"
        fill="rgba(255,255,255,0.7)"
        transform={`rotate(-90 18 ${H / 2})`}
      >
        AROUSAL  →
      </text>

      {/* Endpoint labels */}
      <g fontFamily="system-ui, sans-serif" fontSize="9" fill="rgba(255,255,255,0.4)">
        <text x={PAD - 4} y={H - 28} textAnchor="end">negative</text>
        <text x={PAD + PW + 4} y={H - 28} textAnchor="start">positive</text>
        <text x={32} y={PAD} textAnchor="middle">high</text>
        <text x={32} y={PAD + PH + 4} textAnchor="middle">low</text>
      </g>

      {/* Mood points */}
      {points.map((p, i) => {
        const r = p.size === 'large' ? 14 : 8;
        const cx = toX(p.valence);
        const cy = toY(p.arousal);
        return (
          <g key={`${p.label}-${i}`}>
            <circle cx={cx} cy={cy} r={r + 8} fill={p.color} opacity="0.4" filter="url(#glow)" />
            <circle cx={cx} cy={cy} r={r} fill={p.color} stroke="white" strokeWidth={p.size === 'large' ? 2 : 1.5} />
            <text
              x={cx}
              y={cy + (p.size === 'large' ? 5 : 4)}
              textAnchor="middle"
              fontSize={p.size === 'large' ? 14 : 9}
            >
              {p.emoji}
            </text>
            <text
              x={cx}
              y={cy + r + 14}
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize={p.size === 'large' ? 12 : 10}
              fontWeight={p.size === 'large' ? 700 : 500}
              fill="white"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
