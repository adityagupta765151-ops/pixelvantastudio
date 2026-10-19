import { useRef, useState } from "react";
import { supabase, BUCKET } from "@/lib/supabase";
import { compressImage } from "@/lib/image";
import { STATUS_LABEL, type ProjectStatus } from "@/data/types";
import type { CategoryRow, ProjectRow } from "@/data/projectsRemote";
import { storagePath } from "./Dashboard";

export const emptyRow = (sort: number, category = "websites"): ProjectRow => ({
  id: 0, slug: "", title: "", category, status: "concept", description: "",
  cover: null, images: [], objective: "", solution: "", decisions: [], features: [], role: "",
  stack: [], live_url: "", repo_url: "", demo_url: "", limitations: "", date: "", layout: null,
  hue: "#3A4BFF", sort_order: sort, published: false, featured: false, location: "",
});

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const isUrl = (s: string) => !s || /^https?:\/\/\S+\.\S+/.test(s);

export function Editor({ initial, isNew, categories, onCancel, onSaved }: {
  initial: ProjectRow; isNew: boolean; categories: CategoryRow[]; onCancel: () => void; onSaved: (title: string) => void;
}) {
  const [f, setF] = useState(() => ({
    ...initial,
    featuresText: (initial.features ?? []).join("\n"),
    decisionsText: (initial.decisions ?? []).join("\n"),
    stackText: (initial.stack ?? []).join(", "),
  }));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState<"" | "cover" | "gallery" | "save">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  // Storage files are only deleted after a successful save, and fresh uploads are
  // cleaned up on cancel, so the live site never points at a missing image.
  const toRemove = useRef<string[]>([]);
  const uploaded = useRef<string[]>([]);
  const discard = (url?: string | null) => { const p = storagePath(url); if (p) toRemove.current.push(p); };
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const gallery = categories.find((c) => c.id === f.category)?.kind === "gallery";
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  async function upload(file: File): Promise<string> {
    const { blob, ext, type } = await compressImage(file);
    const slug = slugify(f.slug || f.title) || "untitled";
    const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase!.storage.from(BUCKET).upload(path, blob, { contentType: type, cacheControl: "31536000" });
    if (error) throw error;
    uploaded.current.push(path);
    return supabase!.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const onCover = async (file?: File) => {
    if (!file) return;
    setBusy("cover"); setFormError("");
    try {
      const url = await upload(file);
      discard(f.cover);
      set("cover", url);
    } catch (e) { setFormError(`Cover upload failed: ${(e as Error).message}`); }
    setBusy("");
  };

  const onGallery = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy("gallery"); setFormError("");
    try {
      const added: { src: string; caption?: string }[] = [];
      for (const file of Array.from(files)) added.push({ src: await upload(file), caption: "" });
      setF((p) => ({ ...p, images: [...p.images, ...added] }));
    } catch (e) { setFormError(`Upload failed: ${(e as Error).message}`); }
    setBusy("");
  };

  const removeImage = (i: number) => {
    discard(f.images[i].src);
    setF((p) => ({ ...p, images: p.images.filter((_, k) => k !== i) }));
  };
  const cancel = async () => {
    const kept = new Set([initial.cover, ...initial.images.map((i) => i.src)].map(storagePath));
    const orphans = uploaded.current.filter((p) => !kept.has(p));
    if (orphans.length) await supabase!.storage.from(BUCKET).remove(orphans);
    onCancel();
  };
  const moveImage = (i: number, d: -1 | 1) => setF((p) => {
    const imgs = [...p.images]; const j = i + d;
    if (j < 0 || j >= imgs.length) return p;
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    return { ...p, images: imgs };
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(f.slug || f.title);
    const errs: Record<string, string> = {};
    if (!f.title.trim()) errs.title = "Add a project title.";
    if (!slug) errs.slug = "Add a URL slug (letters, numbers, dashes).";
    if (f.description.trim().length < 10) errs.description = "Write a one-line summary (at least 10 characters).";
    (["live_url", "repo_url", "demo_url"] as const).forEach((k) => {
      if (!isUrl((f[k] ?? "").trim())) errs[k] = "Use a full link starting with https://";
    });
    setErrors(errs);
    if (Object.keys(errs).length) { setFormError("Fix the highlighted fields."); return; }

    setBusy("save"); setFormError("");
    const n = (s: string | null) => (s ?? "").trim() || null;
    const row = {
      slug, title: f.title.trim(), category: f.category, status: gallery ? "live" : f.status, description: f.description.trim(),
      cover: f.cover, images: f.images.map((i) => ({ src: i.src, ...(i.caption?.trim() ? { caption: i.caption.trim() } : {}) })),
      objective: n(f.objective), solution: n(f.solution), role: n(f.role), limitations: n(f.limitations), date: n(f.date),
      features: lines(f.featuresText), decisions: lines(f.decisionsText),
      stack: f.stackText.split(",").map((s) => s.trim()).filter(Boolean),
      live_url: n(f.live_url), repo_url: n(f.repo_url), demo_url: n(f.demo_url),
      layout: f.layout || null, hue: f.hue, sort_order: f.sort_order, published: f.published,
      featured: f.featured, location: n(f.location),
    };
    const { error } = isNew
      ? await supabase!.from("projects").insert(row)
      : await supabase!.from("projects").update(row).eq("id", f.id);
    setBusy("");
    if (error) {
      if (error.code === "23505") { setErrors({ slug: "Another project already uses this slug." }); setFormError("Fix the highlighted fields."); }
      else setFormError(`Couldn't save: ${error.message}`);
      return;
    }
    if (toRemove.current.length) await supabase!.storage.from(BUCKET).remove(toRemove.current);
    onSaved(row.title);
  };

  const field = (id: string) => ({ id: `ed-${id}`, "aria-invalid": !!errors[id] || undefined, "aria-describedby": errors[id] ? `ed-${id}-err` : undefined });
  const Err = ({ k }: { k: string }) => (errors[k] ? <span className="adm-ferr" id={`ed-${k}-err`}>{errors[k]}</span> : null);

  return (
    <main className="adm-main">
      <form className="adm-editor" onSubmit={save} noValidate>
        <div className="adm-head">
          <div>
            <button type="button" className="adm-back" onClick={cancel}>← All projects</button>
            <h1>{isNew ? (gallery ? "New photo series" : "New project") : f.title || "Untitled"}</h1>
          </div>
          <div className="adm-head-actions">
            <label className="adm-switch">
              <input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} />
              <span>{f.published ? "Live on site" : "Hidden (draft)"}</span>
            </label>
            <button type="submit" className="adm-btn" disabled={!!busy}>{busy === "save" ? "Saving…" : "Save project"}</button>
          </div>
        </div>
        {formError && <p className="adm-err" role="alert">{formError}</p>}

        <div className="adm-grid">
          <fieldset>
            <legend>Basics</legend>
            <label htmlFor="ed-title">Title</label>
            <input {...field("title")} value={f.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
            <Err k="title" />
            <label htmlFor="ed-slug">URL slug <small>/projects/{slugify(f.slug || f.title) || "…"}</small></label>
            <input {...field("slug")} value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
            <Err k="slug" />
            <div className="adm-two">
              <div>
                <label htmlFor="ed-category">Category</label>
                <select id="ed-category" value={f.category} onChange={(e) => set("category", e.target.value as ProjectRow["category"])}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.kind === "gallery" ? " (photo gallery)" : ""}</option>)}
                </select>
              </div>
              {!gallery && <div>
                <label htmlFor="ed-status">Status</label>
                <select id="ed-status" value={f.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
                  {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>}
              {gallery && <div>
                <label htmlFor="ed-location">Location</label>
                <input id="ed-location" value={f.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Prayagraj, Sangam" />
              </div>}
            </div>
            <label htmlFor="ed-description">One-line summary <small>shown on cards</small></label>
            <textarea {...field("description")} rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} />
            <Err k="description" />
            <div className="adm-two">
              <div>
                <label htmlFor="ed-role">{gallery ? "Credit" : "My role"}</label>
                <input id="ed-role" value={f.role ?? ""} onChange={(e) => set("role", e.target.value)} placeholder={gallery ? "Shot and edited by me" : "Solo developer"} />
              </div>
              <div>
                <label htmlFor="ed-date">{gallery ? "When it was shot" : "Date"}</label>
                <input id="ed-date" value={f.date ?? ""} onChange={(e) => set("date", e.target.value)} placeholder="Oct 2026" />
              </div>
            </div>
            <label htmlFor="ed-stack">{gallery ? "Gear" : "Stack"} <small>comma separated</small></label>
            <input id="ed-stack" value={f.stackText} onChange={(e) => set("stackText", e.target.value)} placeholder={gallery ? "Sony A7 III, 35mm f/1.8, Lightroom" : "React, FastAPI, PostgreSQL"} />
          </fieldset>

          <fieldset>
            <legend>{gallery ? "Photos" : "Images"}</legend>
            <label>{gallery ? "Cover photo" : "Cover"} <small>{gallery ? "first photo on the page and the museum print" : ""}</small></label>
            <div className="adm-cover">
              {f.cover ? <img src={f.cover} alt="Cover preview" /> : <span className="adm-cover-empty" style={{ background: f.hue }}>No cover — placeholder art is shown</span>}
              <div className="adm-cover-actions">
                <button type="button" className="adm-btn ghost sm" onClick={() => coverInput.current?.click()} disabled={!!busy}>
                  {busy === "cover" ? "Uploading…" : f.cover ? "Replace" : "Upload cover"}
                </button>
                {f.cover && <button type="button" className="adm-btn ghost sm" onClick={() => { discard(f.cover); set("cover", null); }}>Remove</button>}
              </div>
              <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => { void onCover(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <p className="adm-hint">Images are resized to 2000px and converted to WebP before upload.</p>

            <label>{gallery ? "More photos" : "Screenshots"}</label>
            <ul className="adm-shots">
              {f.images.map((im, i) => (
                <li key={im.src}>
                  <img src={im.src} alt="" />
                  <input aria-label={`Caption for screenshot ${i + 1}`} placeholder="Caption (optional)" value={im.caption ?? ""}
                    onChange={(e) => setF((p) => ({ ...p, images: p.images.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)) }))} />
                  <div>
                    <button type="button" className="adm-icon" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                    <button type="button" className="adm-icon" onClick={() => moveImage(i, 1)} disabled={i === f.images.length - 1} aria-label="Move down">↓</button>
                    <button type="button" className="adm-icon" onClick={() => removeImage(i)} aria-label="Remove screenshot">✕</button>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="adm-btn ghost sm" onClick={() => galleryInput.current?.click()} disabled={!!busy}>
              {busy === "gallery" ? "Uploading…" : gallery ? "+ Add photos" : "+ Add screenshots"}
            </button>
            <input ref={galleryInput} type="file" accept="image/*" multiple hidden onChange={(e) => { void onGallery(e.target.files); e.target.value = ""; }} />
          </fieldset>

          {gallery ? (
          <fieldset className="adm-span">
            <legend>Story <small>optional</small></legend>
            <label htmlFor="ed-objective">The story behind the series</label>
            <textarea id="ed-objective" rows={4} value={f.objective ?? ""} onChange={(e) => set("objective", e.target.value)} placeholder="Where you were, what caught your eye, how you edited it." />
          </fieldset>
          ) : (<>
          <fieldset className="adm-span">
            <legend>Case study <small>empty sections are hidden on the site</small></legend>
            <label htmlFor="ed-objective">The problem</label>
            <textarea id="ed-objective" rows={3} value={f.objective ?? ""} onChange={(e) => set("objective", e.target.value)} />
            <label htmlFor="ed-solution">The approach</label>
            <textarea id="ed-solution" rows={3} value={f.solution ?? ""} onChange={(e) => set("solution", e.target.value)} />
            <div className="adm-two">
              <div>
                <label htmlFor="ed-features">Key features <small>one per line</small></label>
                <textarea id="ed-features" rows={5} value={f.featuresText} onChange={(e) => set("featuresText", e.target.value)} />
              </div>
              <div>
                <label htmlFor="ed-decisions">Design decisions <small>one per line</small></label>
                <textarea id="ed-decisions" rows={5} value={f.decisionsText} onChange={(e) => set("decisionsText", e.target.value)} />
              </div>
            </div>
            <label htmlFor="ed-limitations">Limitations &amp; next steps</label>
            <textarea id="ed-limitations" rows={2} value={f.limitations ?? ""} onChange={(e) => set("limitations", e.target.value)} />
          </fieldset>

          <fieldset>
            <legend>Links <small>only real, working links</small></legend>
            {([["live_url", "Live demo"], ["repo_url", "Source code (GitHub)"], ["demo_url", "Video or playable demo"]] as const).map(([k, label]) => (
              <div key={k}>
                <label htmlFor={`ed-${k}`}>{label}</label>
                <input {...field(k)} type="url" inputMode="url" placeholder="https://" value={f[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
                <Err k={k} />
              </div>
            ))}
          </fieldset>
          </>)}

          <fieldset>
            <legend>Museum display</legend>
            <label className="adm-switch adm-feature">
              <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
              <span>★ Featured exhibit <small>shown big at the top of the museum</small></span>
            </label>
            {!gallery && <><label htmlFor="ed-layout">Card size in "All" view</label>
            <select id="ed-layout" value={f.layout ?? ""} onChange={(e) => set("layout", (e.target.value || null) as ProjectRow["layout"])}>
              <option value="">Normal (⅓ width)</option>
              <option value="half">Half width</option>
              <option value="wide">Wide (⅔ width)</option>
            </select></>}
            <label htmlFor="ed-hue">Placeholder colour</label>
            <div className="adm-hue">
              <input id="ed-hue" type="color" value={f.hue} onChange={(e) => set("hue", e.target.value)} />
              <code>{f.hue}</code>
            </div>
          </fieldset>
        </div>

        <div className="adm-savebar">
          <button type="button" className="adm-btn ghost" onClick={cancel}>Cancel</button>
          <button type="submit" className="adm-btn" disabled={!!busy}>{busy === "save" ? "Saving…" : "Save project"}</button>
        </div>
      </form>
    </main>
  );
}
