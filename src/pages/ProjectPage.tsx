import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjects } from "@/data/ProjectsProvider";
import { CATEGORIES } from "@/data/categories";
import { STATUS_LABEL } from "@/data/types";
import { ProjectCover } from "@/components/ProjectCover";
import { StatusBadge } from "@/components/StatusBadge";
import { Lightbox } from "@/components/Lightbox";
import { usePageMeta } from "@/lib/usePageMeta";
import NotFound from "./NotFound";
import "./project.css";

const pad = (n: number) => String(n).padStart(3, "0");

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const { projects: PROJECTS, source } = useProjects();
  const p = PROJECTS.find((x) => x.slug === slug);
  usePageMeta(p?.title, p?.description);
  const [shot, setShot] = useState<number | null>(null);
  if (!p) return source === "live" || source === "offline" ? <NotFound /> : <main className="pj-loading" aria-busy="true" />;

  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const i = PROJECTS.indexOf(p);
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const images = p.images ?? [];
  const links = [
    p.liveUrl && { href: p.liveUrl, label: "Live demo", primary: true },
    p.repoUrl && { href: p.repoUrl, label: "Source code" },
    p.demoUrl && { href: p.demoUrl, label: p.category === "games" ? "Play" : "Watch demo" },
  ].filter(Boolean) as { href: string; label: string; primary?: boolean }[];

  // Shown only while developing, never on the live site.
  const missing = [
    !p.objective && "problem",
    !p.solution && "approach",
    !p.features?.length && "key features",
    !p.cover && "cover screenshot",
    !images.length && "extra screenshots",
    !links.length && "live or GitHub link",
  ].filter(Boolean);

  let count = 0;
  const num = () => ++count; // sequential numbering for sections that exist

  return (
    <main className="pj" key={p.slug}>
      <header className="pj-hero dark">
        <div className="wrap">
          <nav className="pj-crumbs" aria-label="Breadcrumb">
            <Link to={{ pathname: "/", hash: "projects" }}><span aria-hidden="true">←</span> Digital Museum</Link>
            <span aria-hidden="true">/</span>
            <Link to={{ pathname: "/", search: `?cat=${cat.id}`, hash: "projects" }}>{cat.name}</Link>
            <span className="pj-no">No. {pad(p.id)}</span>
          </nav>
          <div className="pj-tags pj-in">
            <StatusBadge status={p.status} />
          </div>
          <h1 className="display pj-title pj-in d1">{p.title}</h1>
          <p className="pj-sum pj-in d2">{p.description}</p>
          {links.length > 0 && (
            <div className="pj-links pj-in d3">
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`btn ${l.primary ? "btn-light" : "btn-outline-light"}`}>
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
          <div className="pj-cover pj-in d3"><ProjectCover project={p} /></div>
        </div>
      </header>

      <div className="wrap pj-body">
        <aside className="pj-side">
          <dl>
            <div><dt>Category</dt><dd>{cat.name}</dd></div>
            <div><dt>Status</dt><dd>{STATUS_LABEL[p.status]}</dd></div>
            {p.role && <div><dt>My role</dt><dd>{p.role}</dd></div>}
            {p.date && <div><dt>Published</dt><dd>{p.date}</dd></div>}
            {p.stack.length > 0 && (
              <div><dt>Stack</dt><dd><ul className="pj-stack">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul></dd></div>
            )}
          </dl>
        </aside>

        <article className="pj-main">
          {p.objective && <Block n={num()} title="The problem"><p>{p.objective}</p></Block>}
          {p.solution && <Block n={num()} title="The approach"><p>{p.solution}</p></Block>}
          {!!p.features?.length && (
            <Block n={num()} title="Key features">
              <ul className="pj-list">{p.features.map((f, k) => <li key={f}><span>{String(k + 1).padStart(2, "0")}</span>{f}</li>)}</ul>
            </Block>
          )}
          {!!p.decisions?.length && (
            <Block n={num()} title="Design decisions">
              <ul className="pj-list">{p.decisions.map((d, k) => <li key={d}><span>{String(k + 1).padStart(2, "0")}</span>{d}</li>)}</ul>
            </Block>
          )}
          {images.length > 0 && (
            <Block n={num()} title="Screenshots">
              <div className="pj-shots">
                {images.map((im, k) => (
                  <button key={im.src} type="button" className="pj-shot" onClick={() => setShot(k)} aria-label={`Open screenshot ${k + 1}${im.caption ? `: ${im.caption}` : ""}`}>
                    <img src={im.src} alt="" loading="lazy" decoding="async" />
                    {im.caption && <span>{im.caption}</span>}
                  </button>
                ))}
              </div>
            </Block>
          )}
          {p.limitations && <Block n={num()} title="Limitations & next steps"><p>{p.limitations}</p></Block>}

          {import.meta.env.DEV && missing.length > 0 && (
            <div className="pj-todo">
              <b>Dev note · hidden on the live site</b>
              Add {missing.join(", ")} for <code>{p.slug}</code> in <code>src/data/projects.ts</code>. Each section appears once it has content.
            </div>
          )}
        </article>
      </div>

      <Link to={`/projects/${next.slug}`} className="pj-next dark">
        <div className="wrap">
          <span className="eyebrow">Next in the collection</span>
          <span className="pj-next-title display">{next.title} <span aria-hidden="true">→</span></span>
        </div>
      </Link>

      <Lightbox images={images} index={shot} onClose={() => setShot(null)} onMove={setShot} title={p.title} />
    </main>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="pj-block reveal-lite">
      <h2><span>{String(n).padStart(2, "0")}</span>{title}</h2>
      {children}
    </section>
  );
}
