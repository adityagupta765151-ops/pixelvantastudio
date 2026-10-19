import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/data/skills";
import "./process.css";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="sec process">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 className="display">Five steps, <em>no surprises.</em></h2>
          </div>
          <p>Every project follows the same path, so you always know what happens next and what you'll get.</p>
        </div>
        <ol ref={ref} className={`steps${inView ? " is-in" : ""}`}>
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" style={{ ["--i" as string]: i }}>
              <span className="step-dot">0{i + 1}</span>
              <div className="step-txt">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
