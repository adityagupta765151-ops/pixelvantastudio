import { Link } from "react-router-dom";
import { CATEGORIES } from "@/data/categories";
import { PROJECTS } from "@/data/projects";
import { CategoryArt } from "@/components/art/CategoryArt";
import "./categories.css";

export function Categories() {
  return (
    <section className="sec cats-sec" aria-labelledby="cats-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2 className="display" id="cats-title">Four kinds of things <em>I build.</em></h2>
          </div>
          <p>Each collection opens inside the Digital Museum below. Pick one to jump straight to it.</p>
        </div>
        <div className="cats reveal">
          {CATEGORIES.map((c) => {
            const n = PROJECTS.filter((p) => p.category === c.id).length;
            return (
              <Link key={c.id} className={`cat cat-${c.id}`} to={{ search: `?cat=${c.id}`, hash: "projects" }}>
                <div className="cat-art"><CategoryArt id={c.id} /></div>
                <div className="cat-top">
                  <h3>{c.name}</h3>
                  <span className="cat-count">{String(n).padStart(2, "0")} {n === 1 ? "piece" : "pieces"}</span>
                </div>
                <p>{c.description}</p>
                <span className="cat-go">Explore {c.name.toLowerCase()} <span aria-hidden="true">→</span></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
