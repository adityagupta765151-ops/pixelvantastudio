import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase, ADMIN_EMAIL } from "@/lib/supabase";
import { Logo } from "@/components/Logo";
import { Dashboard } from "./Dashboard";
import "./admin.css";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    document.title = "Admin · pixelvantastudio";
    const robots = document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    if (!supabase) { setSession(null); return () => robots.remove(); }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); robots.remove(); };
  }, []);

  return (
    <div className="adm">
      <header className="adm-bar">
        <Link to="/" aria-label="Back to site"><Logo size={26} /></Link>
        <span className="adm-tag">Admin</span>
        {session && (
          <div className="adm-bar-right">
            <span className="adm-who">{session.user.email}</span>
            <button type="button" className="adm-btn ghost" onClick={() => supabase!.auth.signOut()}>Sign out</button>
          </div>
        )}
      </header>
      {!supabase ? (
        <Center title="Supabase isn't configured">Add the project URL and publishable key in <code>src/lib/supabase.ts</code>.</Center>
      ) : session === undefined ? (
        <Center title="Checking sign-in…" />
      ) : !session ? (
        <Login />
      ) : session.user.email?.toLowerCase() !== ADMIN_EMAIL ? (
        <Center title="This account can't edit the portfolio">
          You're signed in as {session.user.email}. Sign out and use {ADMIN_EMAIL}.
        </Center>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

function Center({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main className="adm-center">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setState("error"); setMsg("Only the site owner's email can sign in here."); return;
    }
    setState("sending");
    const { error } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) { setState("error"); setMsg(error.message); } else setState("sent");
  };

  return (
    <main className="adm-center">
      <form className="adm-login" onSubmit={submit}>
        <h1>Sign in</h1>
        {state === "sent" ? (
          <p className="adm-ok">Login link sent to <b>{email}</b>. Open it on this device to continue. It may take a minute and can land in spam.</p>
        ) : (
          <>
            <p>We'll email you a one-time login link. No password needed.</p>
            <label htmlFor="adm-email">Email</label>
            <input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            {state === "error" && <p className="adm-err" role="alert">{msg}</p>}
            <button className="adm-btn" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Email me a login link"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
