import { useState } from "react";
import { Link } from "react-router-dom";
import type { Category, Project } from "@/data/types";
import { Lightbox } from "@/components/Lightbox";
import "./gallery.css";

/** Picture-first page for photo series (categories of kind "gallery"). */
export function GalleryView({ project: p, category, next }: { project: Project; category: Category; next: Project }) {
  const [shot, setShot] = useState<number | null>(null);
  const photos = [
    ...(p.cover ? [{ src: p.cover, caption: p.title }] : []),
    ...(p.images ?? []),
  ];

  return (
    <main className="gv" key={p.slug}>
      <header className="gv-head dark">
        <div className="wrap">
          <nav className="pj-crumbs" aria-label="Breadcrumb">
            <Link to={{ pathname: "/", hash: "projects" }}><span aria-hidden="true">←</span> Digital Museum</Link>
            <span aria-hidden="true">/</span>
            <Link to={{ pathname: "/", search: `?cat=${category.id}`, hash: "projects" }}>{category.name}</Link>
          </nav>
          <div className="gv-title-row">
            <h1 className="display gv-title pj-in">{p.title}</h1>
            <dl className="gv-facts pj-in d1">
              <div><dt>Photos</dt><dd>{photos.length}</dd></div>
              {p.location && <div><dt>Location</dt><dd>{p.location}</dd></div>}
              {p.date && <div><dt>Shot</dt><dd>{p.date}</dd></div>}
              {p.stack.length > 0 && <div><dt>Gear</dt><dd>{p.stack.join(", ")}</dd></div>}
            </dl>
          </div>
          {p.description && <p className="pj-sum pj-in d2">{p.description}</p>}
          {p.objective && <p className="gv-story pj-in d2">{p.objective}</p>}
        </div>
      </header>

      <div className="gv-wall dark">
        <div className="wrap">
          {photos.length === 0 ? (
            <p className="gv-empty">Photos for this series are being edited. Check back soon.</p>
          ) : (
            <div className="gv-masonry">
              {photos.map((ph, i) => (
                <button key={ph.src} type="button" className="gv-photo" style={{ animationDelay: `${Math.min(i, 12) * 70}ms` }}
                  onClick={() => setShot(i)} aria-label={`Open photo ${i + 1}${ph.caption ? `: ${ph.caption}` : ""}`}>
                  <img src={ph.src} alt={ph.caption || `${p.title}, photo ${i + 1}`} loading={i < 4 ? "eager" : "lazy"} decoding="async" />
                  {ph.caption && <span>{ph.caption}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Link to={`/projects/${next.slug}`} className="pj-next dark">
        <div className="wrap">
          <span className="eyebrow">Next in the collection</span>
          <span className="pj-next-title display">{next.title} <span aria-hidden="true">→</span></span>
        </div>
      </Link>

      <Lightbox images={photos} index={shot} onClose={() => setShot(null)} onMove={setShot} title={p.title} />
    </main>
  );
}
