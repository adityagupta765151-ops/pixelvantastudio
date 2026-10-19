import { useState } from "react";
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

function CoverPlaceholder({ project, label }: { project: Project; label: boolean }) {
  const h = project.hue;
  const web = project.category === "websites";
  return (
    <svg className="cover-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${project.title} — placeholder artwork`}>
      <rect width="400" height="300" fill="#13151A" />
      <rect width="400" height="300" fill={h} opacity=".08" />
      <g opacity=".92">
        <rect x="60" y="54" width="280" height={web ? 210 : 200} fill="#1B1E25" stroke="#2E323C" />
        <rect x="60" y="54" width="280" height="16" fill="#20232B" />
        <circle cx="70" cy="62" r="2.5" fill={h} />
        <circle cx="80" cy="62" r="2.5" fill="#3A3F4B" />
        {web ? (
          <>
            <rect x="78" y="90" width="120" height="14" fill="#F1F2F5" opacity=".85" />
            <rect x="78" y="112" width="90" height="6" fill="#646875" />
            <rect x="78" y="128" width="54" height="16" fill={h} />
            <rect x="214" y="86" width="110" height="80" fill={h} opacity=".35" />
            {[78, 162, 246].map((x) => <rect key={x} x={x} y="182" width="78" height="60" fill="#20232B" />)}
          </>
        ) : (
          <>
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
        )}
      </g>
      {label && (
        <text x="20" y="288" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#646875" letterSpacing="1">
          PLACEHOLDER · SCREENSHOT COMING SOON
        </text>
      )}
    </svg>
  );
}
