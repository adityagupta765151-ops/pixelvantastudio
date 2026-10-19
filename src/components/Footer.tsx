import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { SITE } from "@/data/site";
import { useProjects } from "@/data/ProjectsProvider";
import "./footer.css";

const listOf = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1].toLowerCase()}`.replace(/(, )([A-Z])/g, (_, a, b) => a + b.toLowerCase());

export function Footer() {
  const { categories: CATEGORIES } = useProjects();
  const socials = SITE.socials.filter((s) => s.url);
  const toTop = () =>
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <footer className="footer dark">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo dark size={34} />
          <p>{SITE.role} studio by {SITE.owner}. {listOf(CATEGORIES.map((c) => c.name))}.</p>
        </div>

        <nav aria-label="Collection">
          <h2 className="footer-h">Collection</h2>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={{ pathname: "/", search: `?cat=${c.id}`, hash: "projects" }}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-h">Contact</h2>
          <ul>
            {SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
            {socials.map((s) => (
              <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </div>

        <button type="button" className="footer-top" onClick={toTop} aria-label="Back to top">
          <span aria-hidden="true">↑</span>
        </button>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.brand}. All rights reserved.</span>
          <span>Designed &amp; built by {SITE.owner}</span>
        </div>
      </div>
      <div className="footer-giant" aria-hidden="true">pixelvanta</div>
    </footer>
  );
}
