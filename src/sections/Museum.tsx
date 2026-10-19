import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "@/data/ProjectsProvider";
import type { Category, Project } from "@/data/types";
import { ProjectCover } from "@/components/ProjectCover";
import { StatusBadge } from "@/components/StatusBadge";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import "./museum.css";

const pad = (n: number, l = 2) => String(n).padStart(l, "0");
export const photoCount = (p: Project) => (p.cover ? 1 : 0) + (p.images?.length ?? 0);

export function Museum() {
  const location = useLocation();
  const { projects, categories, categoryOf } = useProjects();
  const [filter, setFilter] = useState<string>("all");
  const valid = (v: string | null): v is string => v === "all" || categories.some((c) => c.id === v);

  // Category links elsewhere use ?cat=<id>#projects — sync whenever one is followed.
  useEffect(() => {
    const cat = new URLSearchParams(location.search).get("cat");
    if (valid(cat)) setFilter(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.search, categories]);

  const choose = (f: string) => {
    setFilter(f);
    // keep the URL shareable without a router navigation (no scroll jump)
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", f);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + "#projects");
  };

  const room = categories.find((c) => c.id === filter);
  const inView = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.category === filter)), [filter, projects]);
  const featured = inView.find((p) => p.featured);
  const grid = featured ? inView.filter((p) => p !== featured) : inView;
  const emptyRooms = filter === "all"
    ? categories.filter((c) => !projects.some((p) => p.category === c.id))
    : inView.length ? [] : room ? [room] : [];

  return (
    <section id="projects" className="sec dark museum" aria-labelledby="museum-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="display museum-title" id="museum-title">Digital <em>Museum.</em></h2>
          </div>
          <div className="museum-intro">
            <p>Real projects and photo series, with honest status labels. Open any piece to see the full story.</p>
            <p className="museum-plaque">
              {inView.length} {inView.length === 1 ? "piece" : "pieces"} on display{room ? ` in ${room.name}` : ""} · {categories.length} rooms · {projects.length} in the collection
            </p>
          </div>
        </div>

        <div className="museum-filters" role="group" aria-label="Filter by room">
          {[{ id: "all", name: "All" }, ...categories].map((o) => {
            const n = o.id === "all" ? projects.length : projects.filter((p) => p.category === o.id).length;
            return (
              <button key={o.id} type="button" className="museum-filter" aria-pressed={filter === o.id} onClick={() => choose(o.id)}>
                {o.name} <sup>{n}</sup>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">Showing {inView.length} {room?.name ?? "pieces"}</p>

        {room && room.description && (
          <p className="museum-room" key={`room-${room.id}`}>
            <span>Room {pad(categories.indexOf(room) + 1)}</span>{room.description}
          </p>
        )}

        {featured && <Featured project={featured} category={categoryOf(featured)} key={`f-${filter}`} />}

        <div className="museum-grid" key={filter}>
          {grid.map((p, i) => {
            const cat = categoryOf(p);
            return cat.kind === "gallery"
              ? <PrintCard key={p.slug} project={p} category={cat} index={i} />
              : <ProjectCard key={p.slug} project={p} category={cat} index={i} sized={filter === "all"} />;
          })}
          {emptyRooms.map((c, i) => (
            <div key={c.id} className="museum-slot" style={{ animationDelay: `${(grid.length + i) * 60}ms` }}>
              <span className="status status-concept">Room being prepared</span>
              <h3>{c.name} — coming soon</h3>
              <p>{c.description || "The first piece for this room is on the workbench."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Tilt + spotlight that follows the pointer (mouse only, off for reduced motion). */
function useTilt() {
  const on = hasFinePointer() && !prefersReducedMotion();
  return {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!on) return;
      const el = e.currentTarget, r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.style.setProperty("--rx", "0deg");
      e.currentTarget.style.setProperty("--ry", "0deg");
    },
  };
}

function Featured({ project: p, category }: { project: Project; category: Category }) {
  const tilt = useTilt();
  const gallery = category.kind === "gallery";
  return (
    <Link to={`/projects/${p.slug}`} className="museum-featured">
      <div className={`museum-frame${gallery ? " is-photo" : ""}`} {...tilt}>
        <span className="museum-no">No. {pad(p.id, 3)}</span>
        <ProjectCover project={p} />
      </div>
      <div className="museum-featured-copy">
        <p className="museum-featured-label"><i aria-hidden="true" /> Featured exhibit · {category.name}</p>
        <h3 className="display">{p.title}</h3>
        <p>{p.description}</p>
        <div className="museum-featured-meta">
          {!gallery && <StatusBadge status={p.status} />}
          {p.stack.slice(0, 4).map((t) => <span key={t} className="museum-chip">{t}</span>)}
        </div>
        <span className="museum-view">{gallery ? "View the series" : "Read the case study"} <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

function ProjectCard({ project: p, category, index, sized }: { project: Project; category: Category; index: number; sized: boolean }) {
  const tilt = useTilt();
  return (
    <Link to={`/projects/${p.slug}`} className={`museum-card${sized && p.layout ? ` is-${p.layout}` : ""}`} style={{ animationDelay: `${index * 60}ms` }}>
      <div className="museum-frame" {...tilt}>
        <span className="museum-no">No. {pad(p.id, 3)}</span>
        <StatusBadge status={p.status} className="museum-status" />
        <ProjectCover project={p} />
      </div>
      <div className="museum-meta">
        <h3>{p.title}</h3>
        <span>{category.name}</span>
      </div>
      <p>{p.description}</p>
      <span className="museum-view">View details <span aria-hidden="true">→</span></span>
    </Link>
  );
}

/** Photo series shown as a matted print. */
function PrintCard({ project: p, category, index }: { project: Project; category: Category; index: number }) {
  const n = photoCount(p);
  return (
    <Link to={`/projects/${p.slug}`} className="museum-card is-print" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="museum-print">
        <div className="museum-print-mat">
          {p.cover ? <img src={p.cover} alt={`${p.title} — cover photo`} loading="lazy" decoding="async" /> : <span className="museum-print-empty">Photos coming soon</span>}
        </div>
        {(p.images?.length ?? 0) > 0 && <span className="museum-print-stack" aria-hidden="true" />}
      </div>
      <div className="museum-meta">
        <h3>{p.title}</h3>
        <span>{category.name}</span>
      </div>
      <p>{p.description}</p>
      <span className="museum-print-info">
        {n > 0 && <>{n} {n === 1 ? "photo" : "photos"}</>}
        {n > 0 && p.location && " · "}
        {p.location}
      </span>
    </Link>
  );
}
