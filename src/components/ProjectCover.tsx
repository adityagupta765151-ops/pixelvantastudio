import { useState, type ReactElement } from "react";
import type { Project } from "@/data/types";

/** Real screenshot when `cover` is set (falls back if it fails to load),
 *  otherwise a clearly labelled abstract placeholder in the project's hue. */
export function ProjectCover({ project, label = true }: { project: Project; label?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (project.cover && !failed) {
    return (
      <img
        className="cover-img"
        src={project.cover}
        alt={`${project.title} — screenshot`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }
  return <CoverPlaceholder project={project} label={label} />;
}

type Variant = "landing" | "dashboard" | "mobile" | "kanban" | "editor" | "game" | "lab";
const APP_VARIANTS: Variant[] = ["dashboard", "mobile", "kanban", "editor"];

/** Abstract interface art. The shape varies by category and project so the museum doesn't repeat itself. */
function pickVariant(p: Project): Variant {
  if (p.category === "websites") return "landing";
  if (p.category === "games") return "game";
  if (p.category === "experiments") return "lab";
  return APP_VARIANTS[p.id % APP_VARIANTS.length];
}

function CoverPlaceholder({ project, label }: { project: Project; label: boolean }) {
  const h = project.hue;
  const v = pickVariant(project);
  return (
    <svg className="cover-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${project.title} — placeholder artwork`}>
      <rect width="400" height="300" fill="#13151A" />
      <rect width="400" height="300" fill={h} opacity=".08" />
      <g opacity=".92">{ART[v](h)}</g>
      {label && (
        <text x="20" y="288" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#646875" letterSpacing="1">
          PLACEHOLDER · SCREENSHOT COMING SOON
        </text>
      )}
    </svg>
  );
}

const windowChrome = (h: string, x = 60, y = 54, w = 280, hh = 200) => (
  <>
    <rect x={x} y={y} width={w} height={hh} fill="#1B1E25" stroke="#2E323C" />
    <rect x={x} y={y} width={w} height="16" fill="#20232B" />
    <circle cx={x + 10} cy={y + 8} r="2.5" fill={h} />
    <circle cx={x + 20} cy={y + 8} r="2.5" fill="#3A3F4B" />
  </>
);

const ART: Record<Variant, (h: string) => ReactElement> = {
  landing: (h) => (
    <>
      {windowChrome(h, 60, 54, 280, 210)}
      <rect x="78" y="90" width="120" height="14" fill="#F1F2F5" opacity=".85" />
      <rect x="78" y="112" width="90" height="6" fill="#646875" />
      <rect x="78" y="128" width="54" height="16" fill={h} />
      <rect x="214" y="86" width="110" height="80" fill={h} opacity=".35" />
      {[78, 162, 246].map((x) => <rect key={x} x={x} y="182" width="78" height="60" fill="#20232B" />)}
    </>
  ),
  dashboard: (h) => (
    <>
      {windowChrome(h)}
      <rect x="60" y="70" width="54" height="184" fill="#16181E" />
      <rect x="70" y="84" width="34" height="5" fill={h} />
      {[98, 110, 122].map((y, i) => <rect key={y} x="70" y={y} width={28 + (i % 2) * 2} height="4" fill="#3A3F4B" />)}
      {[126, 196, 266].map((x, i) => (
        <g key={x}>
          <rect x={x} y="84" width="62" height="38" fill="#20232B" />
          <rect x={x + 8} y="92" width="22" height="4" fill="#646875" />
          <rect x={x + 8} y="104" width={[34, 28, 40][i]} height="9" fill={i === 0 ? h : "#F1F2F5"} opacity={i === 0 ? 1 : 0.8} />
        </g>
      ))}
      <rect x="126" y="132" width="202" height="110" fill="#16181E" />
      <polyline className="cover-line" points="136,226 166,206 196,214 226,180 256,190 286,158 318,166" fill="none" stroke={h} strokeWidth="2" />
      <polyline points="136,226 166,206 196,214 226,180 256,190 286,158 318,166 318,236 136,236" fill={h} opacity=".12" />
    </>
  ),
  mobile: (h) => (
    <>
      {[[96, 40, -6], [168, 30, 0], [240, 40, 6]].map(([x, y, r], i) => (
        <g key={x} transform={`rotate(${r} ${x + 32} ${y + 110})`}>
          <rect x={x} y={y} width="64" height="220" rx="10" fill="#0E0F13" stroke="#2E323C" />
          <rect x={x + 6} y={y + 14} width="52" height="192" fill="#1B1E25" />
          <rect x={x + 12} y={y + 24} width="28" height="5" fill="#F1F2F5" opacity=".8" />
          <rect x={x + 12} y={y + 38} width="40" height={i === 1 ? 50 : 30} fill={i === 1 ? h : "#20232B"} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 12} y={y + (i === 1 ? 98 : 78) + k * 16} width="40" height="10" fill="#20232B" />)}
          <rect x={x + 22} y={y + 190} width="20" height="4" rx="2" fill="#3A3F4B" />
        </g>
      ))}
    </>
  ),
  kanban: (h) => (
    <>
      {windowChrome(h)}
      {[0, 1, 2, 3].map((c) => (
        <g key={c}>
          <rect x={72 + c * 66} y="80" width="58" height="6" fill={c === 1 ? h : "#3A3F4B"} />
          {Array.from({ length: [3, 2, 4, 1][c] }, (_, k) => (
            <rect key={k} x={72 + c * 66} y={94 + k * 36} width="58" height="30" fill="#20232B" stroke={c === 1 && k === 0 ? h : "none"} />
          ))}
        </g>
      ))}
    </>
  ),
  editor: (h) => (
    <>
      {windowChrome(h)}
      <rect x="60" y="70" width="70" height="184" fill="#16181E" />
      {[84, 96, 108, 120, 132].map((y, i) => <rect key={y} x={i === 2 ? 76 : 68} y={y} width={[44, 38, 30, 46, 34][i]} height="4" fill={i === 2 ? h : "#3A3F4B"} />)}
      {[[0, 40, 1], [1, 90, 0], [1, 60, 2], [2, 110, 0], [2, 50, 1], [1, 80, 0], [0, 30, 2], [1, 120, 0], [2, 70, 1], [1, 44, 0]].map(([ind, w, c], i) => (
        <rect key={i} x={146 + ind * 14} y={84 + i * 16} width={w} height="5" fill={c === 1 ? h : c === 2 ? "#FF6A3D" : "#3A3F4B"} opacity={c ? 0.9 : 1} />
      ))}
      <rect className="cover-caret" x="196" y="243" width="2" height="9" fill="#F1F2F5" />
    </>
  ),
  game: (h) => (
    <>
      <rect x="40" y="40" width="320" height="220" fill="#0E0F13" stroke="#2E323C" />
      {[[60, 220, 80], [170, 190, 60], [260, 160, 80]].map(([x, y, w]) => <rect key={x} x={x} y={y} width={w} height="10" fill={h} />)}
      <rect x="186" y="164" width="16" height="22" fill="#F1F2F5" />
      <circle cx="300" cy="130" r="7" fill="#FF6A3D" />
      {[[80, 70], [140, 92], [230, 64], [320, 84]].map(([x, y]) => <rect key={x} x={x} y={y} width="3" height="3" fill="#F1F2F5" />)}
    </>
  ),
  lab: (h) => (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx="200" cy="150" r={18 + i * 14} fill="none" stroke={i % 3 === 0 ? h : "#2E323C"} />
      ))}
      <circle cx="200" cy="150" r="5" fill="#F1F2F5" />
      <circle cx="270" cy="150" r="5" fill="#FF6A3D" />
    </>
  ),
};
