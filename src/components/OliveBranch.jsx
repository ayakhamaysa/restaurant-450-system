// Olive branch drawn with SVG, like the one in the logo.
// Each leaf is the same shape, moved and rotated along the stem.
const leaves = [
  { x: 30, y: 33, angle: -45 },
  { x: 34, y: 34, angle: 30 },
  { x: 62, y: 28, angle: -40 },
  { x: 68, y: 29, angle: 28 },
  { x: 96, y: 22, angle: -35 },
  { x: 102, y: 23, angle: 24 },
  { x: 128, y: 16, angle: -22 },
];

export default function OliveBranch({ className = "" }) {
  return (
    <svg viewBox="0 0 170 50" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Stem */}
      <path d="M8 40 Q 80 30 160 12" strokeLinecap="round" />

      {leaves.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
          <path d="M0 0 C 8 -6 22 -6 30 0 C 22 6 8 6 0 0 Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M2 0 L 27 0" strokeWidth="0.7" />
        </g>
      ))}

      {/* Leaf at the tip */}
      <g transform="translate(152 15) rotate(-20)">
        <path d="M0 0 C 6 -5 16 -5 22 0 C 16 5 6 5 0 0 Z" fill="currentColor" fillOpacity="0.15" />
      </g>
    </svg>
  );
}
