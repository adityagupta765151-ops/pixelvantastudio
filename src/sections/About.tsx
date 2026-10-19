import { Link } from "react-router-dom";
import { ABOUT } from "@/data/about";
import { SketchScene } from "@/components/art/SketchScene";
import "./about.css";

export function About() {
  return (
    <section id="about" className="sec about">
      <div className="wrap about-grid">
        <figure className="scene about-scene reveal" aria-label="Illustration of a notebook with wireframe sketches">
          <SketchScene />
          <figcaption>Illustration · planning sketches</figcaption>
        </figure>
        <div className="about-copy reveal">
          <p className="eyebrow">About</p>
          <h2 className="display">Hi, I'm <em>Aditya.</em></h2>
          <div className="about-body">
            {ABOUT.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <ul className="about-traits">
            {ABOUT.traits.map((t, i) => <li key={t}><span>0{i + 1}</span>{t}</li>)}
          </ul>
          <Link to={{ hash: "projects" }} className="btn btn-primary">See the projects <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
