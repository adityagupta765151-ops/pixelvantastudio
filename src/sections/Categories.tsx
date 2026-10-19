import { Link } from "react-router-dom";
import { useProjects } from "@/data/ProjectsProvider";
import { CategoryArt } from "@/components/art/CategoryArt";
import "./categories.css";

export function Categories() {
  const { projects: PROJECTS, categories: CATEGORIES } = useProjects();
  return (
    <section className="sec cats-sec" aria-labelledby="cats-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2 className="display" id="cats-title">What I <em>make.</em></h2>
          </div>
          <p>Each collection opens inside the Digital Museum below. Pick one to jump straight to it.</p>
        </div>
        <div className="cats reveal">
          {CATEGORIES.map((c) => {
            const n = PROJECTS.filter((p) => p.category === c.id).length;
            return (
              <Link key={c.id} className={`cat cat-${c.id}`} to={{ search: `?cat=${c.id}`, hash: "projects" }}>
                <div className="cat-art"><CategoryArt id={c.id} kind={c.kind} /></div>
                <div className="cat-top">
                  <h3>{c.name}</h3>
                  <span className="cat-count">{String(n).padStart(2, "0")} {c.kind === "gallery" ? (n === 1 ? "series" : "series") : n === 1 ? "piece" : "pieces"}</span>
                </div>
                <p>{c.description}</p>
                <span className="cat-go">{c.kind === "gallery" ? "View" : "Explore"} {c.name.toLowerCase()} <span aria-hidden="true">→</span></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
