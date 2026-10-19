import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CategoryRow } from "@/data/projectsRemote";
import type { CategoryKind } from "@/data/types";

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
type Draft = { id: string; name: string; description: string; kind: CategoryKind; published: boolean };
const blank: Draft = { id: "", name: "", description: "", kind: "projects", published: true };

export function CategoriesAdmin({ cats, flash, onChange }: { cats: CategoryRow[]; flash: (m: string) => void; onChange: (m: string) => Promise<void> }) {
  const [editing, setEditing] = useState<{ original: string | null; draft: Draft; idTouched: boolean } | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const startNew = () => { setErr(""); setEditing({ original: null, draft: { ...blank }, idTouched: false }); };
  const startEdit = (c: CategoryRow) => { setErr(""); setEditing({ original: c.id, draft: { id: c.id, name: c.name, description: c.description, kind: c.kind, published: c.published }, idTouched: true }); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const d = editing.draft;
    const id = slugify(d.id || d.name);
    if (!d.name.trim()) { setErr("Give the category a name."); return; }
    if (!id) { setErr("Add a URL id (letters, numbers, dashes)."); return; }
    setBusy(true); setErr("");
    const row = { id, name: d.name.trim(), description: d.description.trim(), kind: d.kind, published: d.published };
    const { error } = editing.original
      ? await supabase!.from("categories").update(row).eq("id", editing.original)
      : await supabase!.from("categories").insert({ ...row, sort_order: (cats.length + 1) * 10 });
    setBusy(false);
    if (error) { setErr(error.code === "23505" ? "Another category already uses this id." : `Couldn't save: ${error.message}`); return; }
    setEditing(null);
    await onChange(`${row.name} saved`);
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= cats.length) return;
    const next = [...cats]; [next[i], next[j]] = [next[j], next[i]];
    const res = await Promise.all(next.map((c, k) => supabase!.from("categories").update({ sort_order: (k + 1) * 10 }).eq("id", c.id)));
    const bad = res.find((r) => r.error);
    if (bad?.error) flash(`Couldn't reorder: ${bad.error.message}`); else await onChange("Order saved");
  };

  const toggle = async (c: CategoryRow) => {
    const { error } = await supabase!.from("categories").update({ published: !c.published }).eq("id", c.id);
    if (error) flash(`Couldn't update: ${error.message}`); else await onChange(c.published ? `${c.name} hidden from site` : `${c.name} is live`);
  };

  const remove = async (c: CategoryRow) => {
    const { error } = await supabase!.from("categories").delete().eq("id", c.id);
    setConfirmDel(null);
    if (error) flash(error.code === "23503" ? `${c.name} still has projects. Move or delete them first.` : `Couldn't delete: ${error.message}`);
    else await onChange(`${c.name} deleted`);
  };

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div>
          <h1>Categories</h1>
          <p>The rooms of your Digital Museum. Order here is the order of the filters on the site.</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn" onClick={startNew}>+ New category</button>
        </div>
      </div>

      {editing && (
        <form className="adm-catform" onSubmit={save} noValidate>
          <h2>{editing.original ? `Edit ${editing.draft.name || "category"}` : "New category"}</h2>
          <div className="adm-two">
            <div>
              <label htmlFor="cat-name">Name</label>
              <input id="cat-name" value={editing.draft.name} placeholder="Photography" autoFocus
                onChange={(e) => setEditing((s) => s && { ...s, draft: { ...s.draft, name: e.target.value, id: s.idTouched ? s.draft.id : slugify(e.target.value) } })} />
            </div>
            <div>
              <label htmlFor="cat-id">URL id <small>?cat={slugify(editing.draft.id || editing.draft.name) || "…"}</small></label>
              <input id="cat-id" value={editing.draft.id}
                onChange={(e) => setEditing((s) => s && { ...s, idTouched: true, draft: { ...s.draft, id: e.target.value } })} />
            </div>
          </div>
          <label htmlFor="cat-desc">Short description <small>shown on the home page card and the room intro</small></label>
          <textarea id="cat-desc" rows={2} value={editing.draft.description}
            onChange={(e) => setEditing((s) => s && { ...s, draft: { ...s.draft, description: e.target.value } })} />
          <fieldset className="adm-kind">
            <legend>Page style for pieces in this room</legend>
            {([["projects", "Case study", "Problem, approach, features, links. For websites, apps, games."],
               ["gallery", "Photo gallery", "Big photos in a masonry wall with location and gear. For photography."]] as const).map(([k, t, d]) => (
              <label key={k} className={editing.draft.kind === k ? "is-on" : ""}>
                <input type="radio" name="cat-kind" value={k} checked={editing.draft.kind === k}
                  onChange={() => setEditing((s) => s && { ...s, draft: { ...s.draft, kind: k } })} />
                <b>{t}</b><span>{d}</span>
              </label>
            ))}
          </fieldset>
          <label className="adm-switch">
            <input type="checkbox" checked={editing.draft.published} onChange={(e) => setEditing((s) => s && { ...s, draft: { ...s.draft, published: e.target.checked } })} />
            <span>{editing.draft.published ? "Visible on site" : "Hidden"}</span>
          </label>
          {err && <p className="adm-err" role="alert">{err}</p>}
          <div className="adm-head-actions">
            <button type="button" className="adm-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="adm-btn" disabled={busy}>{busy ? "Saving…" : "Save category"}</button>
          </div>
        </form>
      )}

      <ul className="adm-list">
        {cats.map((c, i) => (
          <li key={c.id} className={c.published ? "" : "is-hidden"}>
            <div className="adm-thumb adm-kindbadge">{c.kind === "gallery" ? "Photo" : "Case"}</div>
            <div className="adm-info">
              <b>{c.name}</b>
              <span>?cat={c.id} · {c.kind === "gallery" ? "Photo gallery" : "Case study"}{c.description ? ` · ${c.description}` : ""}</span>
            </div>
            <label className="adm-switch">
              <input type="checkbox" checked={c.published} onChange={() => toggle(c)} />
              <span>{c.published ? "Live" : "Hidden"}</span>
            </label>
            <div className="adm-row-actions">
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${c.name} up`}>↑</button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} disabled={i === cats.length - 1} aria-label={`Move ${c.name} down`}>↓</button>
              <button type="button" className="adm-btn ghost sm" onClick={() => startEdit(c)}>Edit</button>
              {confirmDel === c.id ? (
                <span className="adm-confirm">
                  Delete?
                  <button type="button" className="adm-btn danger sm" onClick={() => remove(c)}>Yes, delete</button>
                  <button type="button" className="adm-btn ghost sm" onClick={() => setConfirmDel(null)}>Keep</button>
                </span>
              ) : (
                <button type="button" className="adm-btn ghost sm" onClick={() => setConfirmDel(c.id)}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="adm-hint">Hiding a category also hides every piece inside it. A category with pieces in it can't be deleted.</p>
    </main>
  );
}
