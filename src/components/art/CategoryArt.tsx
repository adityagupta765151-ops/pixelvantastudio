import type { CategoryKind } from "@/data/types";

/** Illustration per museum room. New rooms from the admin get a generic frame (or a camera for galleries). */
export function CategoryArt({ id, kind = "projects" }: { id: string; kind?: CategoryKind }) {
  switch (id) {
    case "websites":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <rect x="10" y="10" width="180" height="130" fill="#F1F2F5" stroke="#0E0F13" />
          <line x1="10" y1="28" x2="190" y2="28" stroke="#0E0F13" />
          <circle cx="20" cy="19" r="3" fill="#0E0F13" /><circle cx="30" cy="19" r="3" fill="#3A4BFF" />
          <rect x="24" y="44" width="70" height="10" fill="#0E0F13" />
          <rect x="24" y="60" width="54" height="5" fill="#B9BECB" />
          <rect x="24" y="72" width="34" height="12" fill="#3A4BFF" />
          <rect x="108" y="42" width="68" height="50" fill="#D7DAE2" />
          <rect x="24" y="102" width="46" height="26" fill="#E8EAF0" />
          <rect x="77" y="102" width="46" height="26" fill="#E8EAF0" />
          <rect x="130" y="102" width="46" height="26" fill="#E8EAF0" />
        </svg>
      );
    case "apps":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <rect x="64" y="8" width="72" height="134" rx="10" fill="#0E0F13" />
          <rect x="70" y="20" width="60" height="110" fill="#F1F2F5" />
          <rect x="76" y="28" width="30" height="6" fill="#0E0F13" />
          <rect x="76" y="42" width="48" height="28" fill="#3A4BFF" />
          <rect x="76" y="76" width="48" height="8" fill="#D7DAE2" />
          <rect x="76" y="88" width="48" height="8" fill="#D7DAE2" />
          <rect x="76" y="100" width="48" height="8" fill="#FF6A3D" />
          <rect x="20" y="40" width="34" height="60" fill="none" stroke="#B9BECB" strokeDasharray="3 3" />
          <rect x="146" y="50" width="34" height="50" fill="none" stroke="#B9BECB" strokeDasharray="3 3" />
        </svg>
      );
    case "games":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <rect x="10" y="10" width="180" height="130" fill="#0E0F13" />
          <g fill="#3A4BFF"><rect x="30" y="110" width="40" height="10" /><rect x="90" y="90" width="30" height="10" /><rect x="140" y="70" width="40" height="10" /></g>
          <rect className="ca-hero" x="98" y="72" width="14" height="18" fill="#F1F2F5" />
          <circle cx="160" cy="54" r="6" fill="#FF6A3D" />
          <circle cx="40" cy="40" r="2" fill="#F1F2F5" /><circle cx="70" cy="28" r="1.5" fill="#F1F2F5" /><circle cx="120" cy="36" r="2" fill="#F1F2F5" />
          <rect x="10" y="120" width="180" height="20" fill="#20232B" />
        </svg>
      );
    case "experiments":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <g fill="none" stroke="#0E0F13">
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx="100" cy="75" r={8 + i * 7} strokeOpacity={1 - i * 0.09} stroke={i % 3 === 0 ? "#3A4BFF" : undefined} />
            ))}
          </g>
          <g className="ca-orbit">
            <line x1="100" y1="75" x2="149" y2="75" stroke="#FF6A3D" />
            <circle cx="149" cy="75" r="4" fill="#FF6A3D" />
          </g>
          <circle cx="100" cy="75" r="4" fill="#0E0F13" />
        </svg>
      );
    case "photography":
      return <PhotoArt />;
    default:
      return kind === "gallery" ? <PhotoArt /> : <GenericArt />;
  }
}

function PhotoArt() {
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <g className="ca-prints">
        <g transform="rotate(-8 70 80)"><rect x="22" y="34" width="84" height="76" fill="#FFFFFF" stroke="#D7DAE2" /><rect x="29" y="41" width="70" height="52" fill="#3A4BFF" /><circle cx="84" cy="54" r="6" fill="#FF6A3D" /><path d="M29 93 52 66 68 82 78 72 99 93z" fill="#0E0F13" /></g>
        <g transform="rotate(6 130 76)"><rect x="92" y="28" width="84" height="76" fill="#FFFFFF" stroke="#D7DAE2" /><rect x="99" y="35" width="70" height="52" fill="#E8EAF0" /><circle cx="134" cy="61" r="16" fill="none" stroke="#0E0F13" strokeWidth="1.5" /><circle cx="134" cy="61" r="7" fill="#0E0F13" /></g>
      </g>
      <rect className="ca-flash" x="0" y="0" width="200" height="150" fill="#FFFFFF" opacity="0" />
    </svg>
  );
}

function GenericArt() {
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <rect x="30" y="20" width="140" height="110" fill="none" stroke="#0E0F13" />
      <g fill="#3A4BFF">
        {[0, 1, 2, 3].map((x) => [0, 1, 2].map((y) => (
          <rect key={`${x}-${y}`} x={52 + x * 26} y={40 + y * 26} width="18" height="18" opacity={(x + y) % 3 === 0 ? 1 : 0.25} />
        )))}
      </g>
      <rect x="130" y="92" width="18" height="18" fill="#FF6A3D" />
    </svg>
  );
}
