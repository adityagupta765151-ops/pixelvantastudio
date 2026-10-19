import type { CategoryId } from "@/data/types";

export function CategoryArt({ id }: { id: CategoryId }) {
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
  }
}
