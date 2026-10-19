// Level 1 foundation page. Sections replace this in Levels 2–6.
import { Link } from "react-router-dom";
import { Logo, PixelMark } from "@/components/Logo";
import { SITE } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import { CATEGORIES } from "@/data/categories";
import { STATUS_LABEL } from "@/data/types";
import "./foundation.css";

const SWATCHES = [
  ["Fog", "--fog"], ["Vanta", "--vanta"], ["Cobalt", "--cobalt"],
  ["Coral", "--coral"], ["Stone", "--stone"], ["Muted", "--muted"],
] as const;

export default function Home() {
  return (
    <main className="foundation">
      <section className="wrap fd-hero">
        <Logo size={40} />
        <p className="eyebrow">Level 1 · Foundation</p>
        <h1 className="display">
          {SITE.hero.lines.map((l, i) => (
            <span key={l} style={{ display: "block" }}>{i === SITE.hero.accentLine ? <em>{l}</em> : l}</span>
          ))}
        </h1>
        <p className="fd-lead">{SITE.hero.lead}</p>
      </section>

      <section className="wrap fd-grid">
        <div>
          <h2 className="fd-h">Palette</h2>
          <ul className="fd-swatches">
            {SWATCHES.map(([n, v]) => (
              <li key={v}><span style={{ background: `var(${v})` }} />{n}<code>{v}</code></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="fd-h">Mark</h2>
          <div className="fd-marks">
            <PixelMark size={96} title="pixelvantastudio mark" />
            <PixelMark size={48} />
            <PixelMark size={24} />
            <div className="dark fd-darkchip"><Logo dark size={28} /></div>
          </div>
        </div>
        <div>
          <h2 className="fd-h">Data loaded</h2>
          <ul className="fd-data">
            {CATEGORIES.map((c) => (
              <li key={c.id}>{c.name}<b>{PROJECTS.filter((p) => p.category === c.id).length}</b></li>
            ))}
          </ul>
          <ul className="fd-routes">
            {PROJECTS.map((p) => (
              <li key={p.slug}><Link to={`/projects/${p.slug}`}>{p.title}</Link><small>{STATUS_LABEL[p.status]}</small></li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
