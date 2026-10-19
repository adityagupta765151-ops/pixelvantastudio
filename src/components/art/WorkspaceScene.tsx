/** Illustrated desk: laptop typing code, notebook, mug, swaying plant. Decorative. */
const CODE: [number, number, number, string][] = [
  [130, 198, 30, "#3A4BFF"], [165, 198, 50, "#3A3F4B"],
  [138, 210, 44, "#8C97FF"], [186, 210, 30, "#3A3F4B"],
  [138, 222, 70, "#3A3F4B"],
  [146, 234, 38, "#FF6A3D"], [188, 234, 40, "#3A3F4B"],
  [146, 246, 60, "#8C97FF"],
  [138, 258, 24, "#3A3F4B"],
  [130, 270, 16, "#3A4BFF"],
];

export function WorkspaceScene() {
  return (
    <svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ws-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="440" fill="#E3E6ED" />
      {/* window */}
      <rect x="230" y="30" width="140" height="190" fill="#F7F8FB" stroke="#CDD1DB" />
      <line x1="300" y1="30" x2="300" y2="220" stroke="#CDD1DB" />
      <line x1="230" y1="125" x2="370" y2="125" stroke="#CDD1DB" />
      <polygon points="230,30 370,30 200,440 0,440 0,330" fill="url(#ws-light)" />
      {/* shelf */}
      <rect x="30" y="120" width="150" height="4" fill="#B7BCC9" />
      <rect x="40" y="76" width="12" height="44" fill="#3A4BFF" />
      <rect x="54" y="84" width="10" height="36" fill="#0E0F13" />
      <rect x="66" y="80" width="14" height="40" fill="#FF6A3D" />
      <rect x="82" y="88" width="9" height="32" fill="#8790A8" transform="rotate(8 86 104)" />
      <circle cx="150" cy="106" r="12" fill="#D3D7E0" />
      <rect x="138" y="106" width="24" height="14" fill="#D3D7E0" />
      {/* desk */}
      <rect x="0" y="300" width="400" height="140" fill="#C9CEDA" />
      <rect x="0" y="300" width="400" height="6" fill="#B4BACA" />
      {/* laptop */}
      <polygon points="95,300 305,300 285,180 115,180" fill="#0E0F13" />
      <polygon points="103,294 297,294 280,188 120,188" fill="#16181E" />
      <g className="ws-code">
        {CODE.map(([x, y, w, c], i) => (
          <rect key={i} x={x} y={y} width={w} height="4" fill={c} style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
        <rect className="ws-caret" x="152" y="270" width="2" height="8" fill="#F1F2F5" />
      </g>
      <rect x="70" y="300" width="260" height="10" fill="#1A1C22" />
      {/* notebook */}
      <g transform="rotate(-8 300 360)">
        <rect x="250" y="335" width="110" height="78" fill="#F1F2F5" />
        <line x1="262" y1="352" x2="340" y2="352" stroke="#CDD1DB" />
        <line x1="262" y1="366" x2="330" y2="366" stroke="#CDD1DB" />
        <line x1="262" y1="380" x2="345" y2="380" stroke="#CDD1DB" />
        <path d="M265 350c10-6 20 4 32-3" stroke="#3A4BFF" fill="none" strokeWidth="1.3" />
        <rect x="345" y="330" width="4" height="80" fill="#0E0F13" transform="rotate(20 347 370)" />
      </g>
      {/* mug */}
      <rect x="40" y="320" width="34" height="40" fill="#F1F2F5" />
      <path d="M74 328c14 0 14 22 0 22" stroke="#F1F2F5" strokeWidth="5" fill="none" />
      {/* plant */}
      <rect x="330" y="250" width="40" height="50" fill="#FF6A3D" />
      <g className="ws-leaf" fill="#2F8F6B">
        <path d="M350 252c-20-30-40-30-46-46 20 2 36 18 46 46z" />
        <path d="M350 252c6-40 22-56 34-60-2 22-14 44-34 60z" />
        <path d="M350 252c-4-40-2-60 4-76 8 20 6 50-4 76z" fill="#24745A" />
      </g>
    </svg>
  );
}
