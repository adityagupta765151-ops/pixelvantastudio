import { Link } from "react-router-dom";
import { ABOUT } from "@/data/about";
import { useRef } from "react";
import { gsap, useGSAP, reduced } from "@/lib/gsap";
import "./about.css";

export function About() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const fig = root.current!.querySelector(".about-scene")!;
    if (fig.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen: leave it as is
    gsap.fromTo(fig, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out",
      scrollTrigger: { trigger: fig, start: "top 85%" },
    });
    gsap.fromTo(fig.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: fig, start: "top 85%" } });
  }, { scope: root });

  return (
    <section ref={root} id="about" className="sec about">
      <div className="wrap about-grid">
        <figure className="scene about-scene">
          <img
            src="/images/about-sketching.webp"
            alt="A hand sketching app wireframes on paper with a fine-tip pen"
            width={800}
            height={1000}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Photo · Unsplash</figcaption>
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
