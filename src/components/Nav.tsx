import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/data/nav";
import { useActiveSection } from "@/lib/useActiveSection";
import { useScrollProgress } from "@/lib/useScrollProgress";
import "./nav.css";

const IDS = NAV_LINKS.map((l) => l.id);

export function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const active = useActiveSection(IDS, onHome);
  const progressRef = useScrollProgress<HTMLSpanElement>();
  const [open, setOpen] = useState(false);

  // close menu on route change / Escape; lock page scroll while open
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="nav">
      <div className="wrap nav-row">
        <Link to="/" className="nav-brand" aria-label="pixelvantastudio home" onClick={() => onHome && window.scrollTo({ top: 0 })}>
          <Logo size={28} />
        </Link>

        <nav id="nav-menu" className={`nav-menu${open ? " is-open" : ""}`} aria-label="Main">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} style={{ ["--i" as string]: i }}>
                <Link
                  to={{ pathname: "/", hash: l.id }}
                  className={onHome && active === l.id ? "is-active" : undefined}
                  aria-current={onHome && active === l.id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-num" aria-hidden="true">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to={{ pathname: "/", hash: "contact" }} className="btn btn-primary nav-menu-cta" onClick={() => setOpen(false)}>
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <Link to={{ pathname: "/", hash: "contact" }} className="btn btn-primary nav-cta">
          Start a project <span aria-hidden="true">→</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="nav-burger" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
      <span ref={progressRef} className="nav-progress" aria-hidden="true" />
    </header>
  );
}
