import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "@/data/categories";
import { PROJECTS } from "@/data/projects";
import type { CategoryId, Project } from "@/data/types";
import { ProjectCover } from "@/components/ProjectCover";
import { StatusBadge } from "@/components/StatusBadge";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import "./museum.css";

type Filter = "all" | CategoryId;
const isFilter = (v: string | null): v is Filter => v === "all" || CATEGORIES.some((c) => c.id === v);
const pad = (n: number, l = 2) => String(n).padStart(l, "0");

export function Museum() {
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>("all");

  // Category links elsewhere use ?cat=<id>#projects — sync whenever one is followed.
  useEffect(() => {
    const cat = new URLSearchParams(location.search).get("cat");
    if (isFilter(cat)) setFilter(cat);
  }, [location.key, location.search]);

  const choose = (f: Filter) => {
    setFilter(f);
    // keep the URL shareable without triggering a router navigation (no scroll jump)
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", f);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + "#projects");
  };

  const list = useMemo(() => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)), [filter]);
  const emptyCats = filter === "all"
    ? CATEGORIES.filter((c) => !PROJECTS.some((p) => p.category === c.id))
    : list.length ? [] : CATEGORIES.filter((c) => c.id === filter);
  const catName = CATEGORIES.find((c) => c.id === filter)?.name;

  return (
    <section id="projects" className="sec dark museum" aria-labelledby="museum-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="display museum-title" id="museum-title">Digital <em>Museum.</em></h2>
          </div>
          <div className="museum-intro">
            <p>Real projects, shown with honest status labels. Open any piece for the problem, the approach and the stack.</p>
            <p className="museum-plaque">
              {list.length} {list.length === 1 ? "piece" : "pieces"} on display{catName ? ` in ${catName}` : ""} · {PROJECTS.length} in the collection
            </p>
          </div>
        </div>

        <div className="museum-filters" role="group" aria-label="Filter projects by category">
          {([{ id: "all", name: "All" }, ...CATEGORIES] as { id: Filter; name: string }[]).map((o) => {
            const n = o.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === o.id).length;
            return (
              <button key={o.id} type="button" className="museum-filter" aria-pressed={filter === o.id} onClick={() => choose(o.id)}>
                {o.name} <sup>{n}</sup>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">Showing {list.length} {catName ?? "projects"}</p>

        <div className="museum-grid" key={filter}>
          {list.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} featured={filter === "all"} />)}
          {emptyCats.map((c, i) => (
            <div key={c.id} className="museum-slot" style={{ animationDelay: `${(list.length + i) * 60}ms` }}>
              <span className="status status-concept">Gallery space reserved</span>
              <h3>{c.name} — coming soon</h3>
              <p>{c.description} The first piece for this room is on the workbench.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index, featured }: { project: Project; index: number; featured: boolean }) {
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const interactive = hasFinePointer() && !prefersReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      to={`/projects/${p.slug}`}
      className={`museum-card${featured && p.layout ? ` is-${p.layout}` : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="museum-frame" onPointerMove={onMove} onPointerLeave={onLeave}>
        <span className="museum-no">No. {pad(p.id, 3)}</span>
        <StatusBadge status={p.status} className="museum-status" />
        <ProjectCover project={p} />
      </div>
      <div className="museum-meta">
        <h3>{p.title}</h3>
        <span>{cat.name}</span>
      </div>
      <p>{p.description}</p>
      <span className="museum-view">View details <span aria-hidden="true">→</span></span>
    </Link>
  );
}
