import { SKILLS } from "@/data/skills";
import "./skills.css";

export function Skills() {
  return (
    <section id="skills" className="sec">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Skills & capabilities</p>
            <h2 className="display">What I can <em>take on.</em></h2>
          </div>
          <p>Grouped by the kind of work, with the tools I actually use. No percentage bars.</p>
        </div>
        <div className="skills reveal">
          {SKILLS.map((s, i) => (
            <article key={s.title} className="skill" style={{ ["--i" as string]: i }}>
              <span className="skill-px" aria-hidden="true" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="skill-tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
