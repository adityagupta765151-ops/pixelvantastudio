/** Illustrated notebook with wireframe sketches. Decorative. */
export function SketchScene() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" fill="#C9CEDA" />
      <g transform="rotate(-4 200 230)">
        <rect x="60" y="70" width="290" height="330" fill="#F1F2F5" stroke="#B4BACA" />
        <line x1="205" y1="70" x2="205" y2="400" stroke="#DDE0E8" />
        <g stroke="#0E0F13" strokeWidth="1.3" fill="none" className="sk-draw">
          <rect x="80" y="100" width="105" height="70" />
          <line x1="80" y1="116" x2="185" y2="116" />
          <line x1="92" y1="132" x2="150" y2="132" />
          <line x1="92" y1="144" x2="130" y2="144" />
          <rect x="92" y="152" width="30" height="10" />
          <rect x="80" y="190" width="48" height="48" />
          <rect x="137" y="190" width="48" height="48" />
          <rect x="80" y="250" width="105" height="40" />
        </g>
        <path d="M100 320c20-14 40 8 60-4s30 10 40 0" stroke="#3A4BFF" strokeWidth="1.5" fill="none" />
        <g fill="#3A4BFF" fontFamily="'JetBrains Mono', monospace" fontSize="11">
          <text x="222" y="112">hero: keep it calm</text>
          <text x="222" y="196">cards × 4</text>
          <text x="222" y="262">museum = dark</text>
        </g>
        <circle cx="300" cy="330" r="26" fill="none" stroke="#0E0F13" strokeWidth="1.3" />
        <path d="M290 330l7 7 14-15" stroke="#FF6A3D" strokeWidth="2" fill="none" />
      </g>
      <rect x="-10" y="430" width="300" height="70" fill="#16181E" transform="rotate(-4 140 465)" />
      <rect x="320" y="40" width="10" height="160" fill="#0E0F13" transform="rotate(18 325 120)" />
    </svg>
  );
}
