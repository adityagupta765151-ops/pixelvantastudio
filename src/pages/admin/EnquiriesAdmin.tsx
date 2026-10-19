import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface EnquiryRow {
  id: number; name: string; email: string; project_type: string; budget: string | null;
  message: string; read: boolean; created_at: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function EnquiriesAdmin({ flash, onUnread }: { flash: (m: string) => void; onUnread: (n: number) => void }) {
  const [rows, setRows] = useState<EnquiryRow[] | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) { setError(error.message); return; }
    const list = data as EnquiryRow[];
    setRows(list); setError("");
    onUnread(list.filter((r) => !r.read).length);
  }, [onUnread]);
  useEffect(() => { void load(); }, [load]);

  const setRead = async (r: EnquiryRow, read: boolean) => {
    if (r.read === read) return;
    const { error } = await supabase!.from("enquiries").update({ read }).eq("id", r.id);
    if (error) flash(`Couldn't update: ${error.message}`); else void load();
  };
  const toggleOpen = (r: EnquiryRow) => {
    setOpen((o) => (o === r.id ? null : r.id));
    void setRead(r, true);
  };
  const remove = async (r: EnquiryRow) => {
    const { error } = await supabase!.from("enquiries").delete().eq("id", r.id);
    setConfirmDel(null);
    if (error) flash(`Couldn't delete: ${error.message}`); else { flash("Enquiry deleted"); void load(); }
  };
  const replyHref = (r: EnquiryRow) =>
    `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(`Re: your ${r.project_type.toLowerCase()} enquiry`)}&body=${encodeURIComponent(`Hi ${r.name.split(" ")[0]},\n\n\n\n— Aditya\npixelvantastudio\n\n> ${r.message.split("\n").join("\n> ")}`)}`;

  const unread = rows?.filter((r) => !r.read).length ?? 0;

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div>
          <h1>Enquiries</h1>
          <p>{rows ? `${rows.length} total · ${unread} unread` : "Loading…"}</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn ghost" onClick={() => void load()}>Refresh</button>
        </div>
      </div>
      {error && <p className="adm-err" role="alert">Couldn't load enquiries: {error}</p>}
      {rows && rows.length === 0 && (
        <div className="adm-empty"><h2>No messages yet</h2><p>When someone sends the contact form on your site, it shows up here.</p></div>
      )}
      <ul className="adm-inbox">
        {rows?.map((r) => (
          <li key={r.id} className={`${r.read ? "" : "is-unread"}${open === r.id ? " is-open" : ""}`}>
            <button type="button" className="adm-inbox-head" onClick={() => toggleOpen(r)} aria-expanded={open === r.id}>
              <span className="adm-inbox-dot" aria-label={r.read ? undefined : "Unread"} />
              <b>{r.name}</b>
              <span className="adm-inbox-meta">{r.project_type}{r.budget ? ` · ${r.budget}` : ""}</span>
              <span className="adm-inbox-preview">{r.message}</span>
              <time dateTime={r.created_at}>{fmt(r.created_at)}</time>
            </button>
            {open === r.id && (
              <div className="adm-inbox-body">
                <p className="adm-inbox-from"><a href={`mailto:${r.email}`}>{r.email}</a></p>
                <p className="adm-inbox-msg">{r.message}</p>
                <div className="adm-row-actions">
                  <a className="adm-btn sm" href={replyHref(r)}>Reply by email</a>
                  <button type="button" className="adm-btn ghost sm" onClick={() => { void setRead(r, false); setOpen(null); }}>Mark unread</button>
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
