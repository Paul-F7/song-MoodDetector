interface MoodPlotProps {
  valence: number;
  arousal: number;
}

// Constants mirror backend/services/visualization.py exactly.
const IMG_SIZE = 2379;
const PLOT_LEFT = 125;
const PLOT_RIGHT = 1975;
const PLOT_TOP = 312;
const PLOT_BOTTOM = 2162;
const DOT_RADIUS = 25;
const LABEL_OFFSET = 120;
const ARROW_SIZE = 20;
const ARROW_ANGLE = Math.PI / 6;
const FONT_SIZE = 36;
const TEXT_PADDING = 10;

export default function MoodPlot({ valence, arousal }: MoodPlotProps) {
  const x = PLOT_LEFT + valence * (PLOT_RIGHT - PLOT_LEFT);
  const y = PLOT_BOTTOM - arousal * (PLOT_BOTTOM - PLOT_TOP);

  const textX = valence > 0.7 ? x - LABEL_OFFSET : x + LABEL_OFFSET;
  const textY = arousal > 0.7 ? y + LABEL_OFFSET : y - LABEL_OFFSET;

  const angle = Math.atan2(y - textY, x - textX);
  const x1 = x - ARROW_SIZE * Math.cos(angle - ARROW_ANGLE);
  const y1 = y - ARROW_SIZE * Math.sin(angle - ARROW_ANGLE);
  const x2 = x - ARROW_SIZE * Math.cos(angle + ARROW_ANGLE);
  const y2 = y - ARROW_SIZE * Math.sin(angle + ARROW_ANGLE);

  const label = 'YOUR SONG';
  const textWidth = label.length * FONT_SIZE * 0.55;
  const textHeight = FONT_SIZE;
  const rectX = textX - textWidth / 2 - TEXT_PADDING;
  const rectY = textY - textHeight / 2 - TEXT_PADDING;
  const rectW = textWidth + TEXT_PADDING * 2;
  const rectH = textHeight + TEXT_PADDING * 2;

  return (
    <svg
      viewBox={`0 0 ${IMG_SIZE} ${IMG_SIZE}`}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image href="/valence_arousal_base.png" x="0" y="0" width={IMG_SIZE} height={IMG_SIZE} />

      {/* Arrow line */}
      <line x1={textX} y1={textY} x2={x} y2={y} stroke="darkred" strokeWidth="4" />

      {/* Arrowhead */}
      <polygon points={`${x},${y} ${x1},${y1} ${x2},${y2}`} fill="darkred" />

      {/* Dot */}
      <circle cx={x} cy={y} r={DOT_RADIUS} fill="red" stroke="darkred" strokeWidth="3" />

      {/* Label background */}
      <rect
        x={rectX}
        y={rectY}
        width={rectW}
        height={rectH}
        rx="8"
        ry="8"
        fill="white"
        stroke="darkred"
        strokeWidth="2"
      />

      {/* Label text */}
      <text
        x={textX}
        y={textY}
        fontFamily="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        fontSize={FONT_SIZE}
        fontWeight="bold"
        fill="darkred"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </svg>
  );
}
