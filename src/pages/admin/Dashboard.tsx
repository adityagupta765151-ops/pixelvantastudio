import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/data/categories";
import { STATUS_LABEL } from "@/data/types";
import type { ProjectRow } from "@/data/projectsRemote";
import { useProjects } from "@/data/ProjectsProvider";
import { Editor, emptyRow } from "./Editor";

export function Dashboard() {
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const { reload: reloadSite } = useProjects();

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("projects").select("*").order("sort_order").order("id");
    if (error) setError(error.message); else { setRows(data as ProjectRow[]); setError(""); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const after = async (m: string) => { await load(); void reloadSite(); flash(m); };

  const togglePublish = async (r: ProjectRow) => {
    const { error } = await supabase!.from("projects").update({ published: !r.published }).eq("id", r.id);
    if (error) flash(`Couldn't update: ${error.message}`); else after(r.published ? `${r.title} hidden from site` : `${r.title} is live on the site`);
  };

  const move = async (i: number, dir: -1 | 1) => {
    if (!rows) return;
    const j = i + dir; if (j < 0 || j >= rows.length) return;
    const next = [...rows]; [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    const updates = next.map((r, k) => supabase!.from("projects").update({ sort_order: (k + 1) * 10 }).eq("id", r.id));
    const res = await Promise.all(updates);
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
    return (
      <Editor
        initial={editing === "new" ? emptyRow((rows?.length ?? 0) * 10 + 10) : editing}
        isNew={editing === "new"}
        onCancel={() => setEditing(null)}
        onSaved={async (title) => { setEditing(null); await after(`${title} saved`); }}
      />
    );
  }

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div>
          <h1>Projects</h1>
          <p>{rows ? `${rows.length} total · ${rows.filter((r) => r.published).length} on the site` : "Loading…"}</p>
        </div>
        <div className="adm-head-actions">
          <Link className="adm-btn ghost" to="/#projects" target="_blank">View site ↗</Link>
          <button type="button" className="adm-btn" onClick={() => setEditing("new")}>+ New project</button>
        </div>
      </div>

      {error && <p className="adm-err" role="alert">Couldn't load projects: {error}</p>}

      {rows && rows.length === 0 && (
        <div className="adm-empty"><h2>No projects yet</h2><p>Add your first one and it appears in the Digital Museum.</p></div>
      )}

      <ul className="adm-list">
        {rows?.map((r, i) => (
          <li key={r.id} className={r.published ? "" : "is-hidden"}>
            <div className="adm-thumb">{r.cover ? <img src={r.cover} alt="" /> : <span style={{ background: r.hue }} />}</div>
            <div className="adm-info">
              <b>{r.title}</b>
              <span>{CATEGORIES.find((c) => c.id === r.category)?.name} · {STATUS_LABEL[r.status]} · /{r.slug}</span>
            </div>
            <label className="adm-switch" title={r.published ? "Visible on site" : "Hidden"}>
              <input type="checkbox" checked={r.published} onChange={() => togglePublish(r)} />
              <span>{r.published ? "Live" : "Hidden"}</span>
            </label>
            <div className="adm-row-actions">
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${r.title} up`}>↑</button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label={`Move ${r.title} down`}>↓</button>
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
        ))}
      </ul>
      {toast && <div className="adm-toast" role="status">{toast}</div>}
    </main>
  );
}

/** Turn a public storage URL into its path inside the bucket (null for external URLs). */
export function storagePath(url?: string | null) {
  if (!url) return null;
  const m = url.match(/\/storage\/v1\/object\/public\/project-images\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}
