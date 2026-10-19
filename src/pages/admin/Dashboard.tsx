import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { STATUS_LABEL } from "@/data/types";
import type { CategoryRow, ProjectRow } from "@/data/projectsRemote";
import { useProjects } from "@/data/ProjectsProvider";
import { Editor, emptyRow } from "./Editor";
import { CategoriesAdmin } from "./CategoriesAdmin";

export function Dashboard() {
  const [tab, setTab] = useState<"projects" | "categories">("projects");
  const [cats, setCats] = useState<CategoryRow[]>([]);
  const [toast, setToast] = useState("");
  const { reload: reloadSite } = useProjects();

  const loadCats = useCallback(async () => {
    const { data } = await supabase!.from("categories").select("*").order("sort_order").order("name");
    if (data) setCats(data as CategoryRow[]);
  }, []);
  useEffect(() => { void loadCats(); }, [loadCats]);

  const flash = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); }, []);
  const changed = useCallback(async (m: string) => { await loadCats(); void reloadSite(); flash(m); }, [loadCats, reloadSite, flash]);

  return (
    <>
      <nav className="adm-tabs" aria-label="Admin sections">
        <button type="button" aria-current={tab === "projects" ? "page" : undefined} onClick={() => setTab("projects")}>Projects</button>
        <button type="button" aria-current={tab === "categories" ? "page" : undefined} onClick={() => setTab("categories")}>
          Categories <sup>{cats.length}</sup>
        </button>
      </nav>
      {tab === "projects"
        ? <ProjectsAdmin cats={cats} flash={flash} onChange={changed} />
        : <CategoriesAdmin cats={cats} flash={flash} onChange={changed} />}
      {toast && <div className="adm-toast" role="status">{toast}</div>}
    </>
  );
}

function ProjectsAdmin({ cats, flash, onChange }: { cats: CategoryRow[]; flash: (m: string) => void; onChange: (m: string) => Promise<void> }) {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [show, setShow] = useState("all");

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("projects").select("*").order("sort_order").order("id");
    if (error) setError(error.message); else { setRows(data as ProjectRow[]); setError(""); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const after = async (m: string) => { await load(); await onChange(m); };

  const update = async (r: ProjectRow, patch: Partial<ProjectRow>, msg: string) => {
    const { error } = await supabase!.from("projects").update(patch).eq("id", r.id);
    if (error) flash(`Couldn't update: ${error.message}`); else after(msg);
  };

  const move = async (r: ProjectRow, dir: -1 | 1) => {
    if (!rows) return;
    const i = rows.indexOf(r), j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows]; [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    const res = await Promise.all(next.map((x, k) => supabase!.from("projects").update({ sort_order: (k + 1) * 10 }).eq("id", x.id)));
    const bad = res.find((x) => x.error);
    if (bad?.error) flash(`Couldn't reorder: ${bad.error.message}`); else after("Order saved");
  };

  const remove = async (r: ProjectRow) => {
    const paths = [r.cover, ...(r.images ?? []).map((i) => i.src)].map(storagePath).filter(Boolean) as string[];
    const { error } = await supabase!.from("projects").delete().eq("id", r.id);
    if (error) { flash(`Couldn't delete: ${error.message}`); return; }
    if (paths.length) await supabase!.storage.from("project-images").remove(paths);
    setConfirmDel(null);
    after(`${r.title} deleted`);
  };

  if (editing) {
    const start = editing === "new" ? emptyRow((rows?.length ?? 0) * 10 + 10, show !== "all" ? show : cats[0]?.id ?? "websites") : editing;
    return (
      <Editor
        initial={start}
        isNew={editing === "new"}
        categories={cats}
        onCancel={() => setEditing(null)}
        onSaved={async (title) => { setEditing(null); await after(`${title} saved`); }}
      />
    );
  }

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? id;
  const isGallery = (id: string) => cats.find((c) => c.id === id)?.kind === "gallery";
  const visible = rows?.filter((r) => show === "all" || r.category === show) ?? [];

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div>
          <h1>Projects</h1>
          <p>{rows ? `${rows.length} total · ${rows.filter((r) => r.published).length} on the site` : "Loading…"}</p>
        </div>
        <div className="adm-head-actions">
          <label className="sr-only" htmlFor="adm-show">Show category</label>
          <select id="adm-show" className="adm-select" value={show} onChange={(e) => setShow(e.target.value)}>
            <option value="all">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Link className="adm-btn ghost" to="/#projects" target="_blank">View site ↗</Link>
          <button type="button" className="adm-btn" onClick={() => setEditing("new")}>
            + New {show !== "all" && isGallery(show) ? "photo series" : "project"}
          </button>
        </div>
      </div>

      {error && <p className="adm-err" role="alert">Couldn't load projects: {error}</p>}
      {rows && visible.length === 0 && (
        <div className="adm-empty">
          <h2>Nothing here yet</h2>
          <p>{show === "all" ? "Add your first project" : `Add the first piece to ${catName(show)}`} and it appears in the Digital Museum.</p>
        </div>
      )}

      <ul className="adm-list">
        {visible.map((r) => {
          const i = rows!.indexOf(r);
          return (
            <li key={r.id} className={r.published ? "" : "is-hidden"}>
              <div className="adm-thumb">{r.cover ? <img src={r.cover} alt="" /> : <span style={{ background: r.hue }} />}</div>
              <div className="adm-info">
                <b>{r.title} {r.featured && <em className="adm-star" title="Featured exhibit">★ Featured</em>}</b>
                <span>
                  {catName(r.category)} · {isGallery(r.category) ? `${(r.cover ? 1 : 0) + (r.images?.length ?? 0)} photos` : STATUS_LABEL[r.status]} · /{r.slug}
                </span>
              </div>
              <label className="adm-switch" title={r.published ? "Visible on site" : "Hidden"}>
                <input type="checkbox" checked={r.published} onChange={() => update(r, { published: !r.published }, r.published ? `${r.title} hidden from site` : `${r.title} is live on the site`)} />
                <span>{r.published ? "Live" : "Hidden"}</span>
              </label>
              <div className="adm-row-actions">
                {show === "all" && (
                  <>
                    <button type="button" className="adm-icon" onClick={() => move(r, -1)} disabled={i === 0} aria-label={`Move ${r.title} up`}>↑</button>
                    <button type="button" className="adm-icon" onClick={() => move(r, 1)} disabled={i === rows!.length - 1} aria-label={`Move ${r.title} down`}>↓</button>
                  </>
                )}
                <button type="button" className="adm-btn ghost sm" onClick={() => setEditing(r)}>Edit</button>
                {confirmDel === r.id ? (
                  <span className="adm-confirm">
                    Delete?
                    <button type="button" className="adm-btn danger sm" onClick={() => remove(r)}>Yes, delete</button>
                    <button type="button" className="adm-btn ghost sm" onClick={() => setConfirmDel(null)}>Keep</button>
                  </span>
                ) : (
                  <button type="button" className="adm-btn ghost sm" onClick={() => setConfirmDel(r.id)}>Delete</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {show !== "all" && visible.length > 1 && <p className="adm-hint">Switch to "All categories" to change the order.</p>}
    </main>
  );
}

/** Turn a public storage URL into its path inside the bucket (null for external URLs). */
export function storagePath(url?: string | null) {
  if (!url) return null;
  const m = url.match(/\/storage\/v1\/object\/public\/project-images\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}
