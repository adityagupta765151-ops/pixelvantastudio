import { Hero } from "@/sections/Hero";
import { Marquee } from "@/sections/Marquee";
import { Categories } from "@/sections/Categories";
import { About } from "@/sections/About";
import { useReveal } from "@/lib/useReveal";
import "./home-stubs.css";

// Sections still to come — replaced in Levels 4 and 6.
const STUBS = [
  ["projects", "Digital Museum", "Level 4", true],
  ["skills", "Skills", "Level 6", false],
  ["process", "How I work", "Level 6", false],
  ["contact", "Let's build something great", "Level 6", true],
] as const;

export default function Home() {
  useReveal();
  return (
    <main>
      <Hero />
      <Marquee />
      <Categories />
      <About />
      {STUBS.map(([id, title, level, dark]) => (
        <section key={id} id={id} className={`stub${dark ? " dark" : ""}`}>
          <div className="wrap">
            <p className="eyebrow">{level}</p>
            <h2 className="display">{title}</h2>
          </div>
        </section>
      ))}
    </main>
  );
}
