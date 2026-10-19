import { MARQUEE } from "@/data/about";
import "./marquee.css";

export function Marquee() {
  const row = MARQUEE.map((t, i) => (
    <span key={t} className={i % 2 ? "is-outline" : undefined}>{t}<i /></span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{row}{row}</div>
    </div>
  );
}
