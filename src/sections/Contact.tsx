import { useState, type FormEvent } from "react";
import { SITE } from "@/data/site";
import { BUDGETS, PROJECT_TYPES } from "@/data/skills";
import { supabase } from "@/lib/supabase";
import "./contact.css";

type Fields = { name: string; email: string; project_type: string; budget: string; message: string; website: string };
const empty: Fields = { name: "", email: "", project_type: PROJECT_TYPES[0], budget: BUDGETS[0], message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Contact() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter an email like name@example.com.";
    if (f.message.trim().length < 15) e.message = "Add a few more details (at least 15 characters).";
    if (f.message.length > 4000) e.message = "Please keep it under 4,000 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!validate()) {
      ev.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    // honeypot: real people never see or fill this field
    if (f.website) { setState("sent"); setSentTo({ name: f.name, email: f.email }); return; }
    if (!supabase) { setState("error"); setServerMsg("The form isn't connected right now."); return; }

    setState("sending");
    const { error } = await supabase.from("enquiries").insert({
      name: f.name.trim(), email: f.email.trim(), project_type: f.project_type,
      budget: f.budget === BUDGETS[0] ? null : f.budget, message: f.message.trim(),
    });
    if (error) {
      setState("error");
      setServerMsg(error.code === "P0001" ? error.message : "Your message couldn't be sent.");
      return;
    }
    setSentTo({ name: f.name.trim(), email: f.email.trim() });
    setF(empty);
    setState("sent");
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* select manually */ }
  };
  const socials = SITE.socials.filter((s) => s.url);
  const field = (k: keyof Fields) => ({
    id: `c-${k}`, value: f[k], onChange: set(k),
    "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `c-${k}-err` : undefined,
  });

  return (
    <section id="contact" className="sec dark contact">
      <div className="wrap contact-grid">
        <div className="contact-copy reveal">
          <p className="eyebrow">Contact</p>
          <h2 className="display contact-title">Let's build something <em>great.</em></h2>
          <p className="contact-intro">Have a website, app or idea in mind? Tell me what you're trying to do. I'll reply with questions, a rough plan and an honest estimate.</p>
          <ul className="contact-channels">
            {SITE.email && (
              <li>
                <div><span>Email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
                <button type="button" className="contact-copy-btn" onClick={copyEmail}>{copied ? "Copied" : "Copy"}</button>
              </li>
            )}
            {SITE.whatsapp && (
              <li><div><span>WhatsApp</span><a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">+{SITE.whatsapp}</a></div><span aria-hidden="true">↗</span></li>
            )}
            {socials.map((s) => (
              <li key={s.label}><div><span>{s.label}</span><a href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\/(www\.)?/, "")}</a></div><span aria-hidden="true">↗</span></li>
            ))}
          </ul>
        </div>

        <div className="contact-card reveal">
          {state === "sent" ? (
            <div className="contact-sent" role="status">
              <span className="contact-sent-px" aria-hidden="true"><i /><i /><i /></span>
              <h3>Message received{sentTo.name ? `, ${sentTo.name.split(" ")[0]}` : ""}.</h3>
              <p>It's in my inbox now. I'll reply to <b>{sentTo.email}</b> as soon as I've read it properly.</p>
              <button type="button" className="btn btn-light" onClick={() => setState("idle")}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate aria-labelledby="contact-form-title">
              <h3 id="contact-form-title">Project enquiry</h3>
              <div className="contact-row">
                <div className="cf">
                  <label htmlFor="c-name">Your name</label>
                  <input {...field("name")} autoComplete="name" maxLength={100} />
                  {errors.name && <span className="cf-err" id="c-name-err">{errors.name}</span>}
                </div>
                <div className="cf">
                  <label htmlFor="c-email">Email</label>
                  <input {...field("email")} type="email" autoComplete="email" inputMode="email" maxLength={200} />
                  {errors.email && <span className="cf-err" id="c-email-err">{errors.email}</span>}
                </div>
              </div>
              <div className="contact-row">
                <div className="cf">
                  <label htmlFor="c-project_type">Project type</label>
                  <select {...field("project_type")}>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div className="cf">
                  <label htmlFor="c-budget">Budget <small>optional</small></label>
                  <select {...field("budget")}>{BUDGETS.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
              </div>
              <div className="cf">
                <label htmlFor="c-message">What are you building?</label>
                <textarea {...field("message")} rows={5} maxLength={4000} placeholder="A few lines about the goal, timeline and anything you already have." />
                <div className="cf-foot">
                  {errors.message ? <span className="cf-err" id="c-message-err">{errors.message}</span> : <span />}
                  <span className="cf-count">{f.message.length}/4000</span>
                </div>
              </div>
              <div className="cf-hp" aria-hidden="true">
                <label htmlFor="c-website">Website</label>
                <input id="c-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
              </div>
              {state === "error" && (
                <p className="contact-error" role="alert">
                  {serverMsg} You can also email me directly at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              )}
              <button type="submit" className="btn btn-light contact-submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : <>Send message <span aria-hidden="true">→</span></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
