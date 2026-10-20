import { Link } from "react-router-dom";
import { useProjects } from "@/data/ProjectsProvider";
import { CategoryArt } from "@/components/art/CategoryArt";
import { useRef } from "react";
import { gsap, useGSAP, DESKTOP } from "@/lib/gsap";
import "./categories.css";

export function Categories() {
  const { projects: PROJECTS, categories: CATEGORIES } = useProjects();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // C051: on desktop the room cards slide sideways while the section is pinned; phones get a normal stack
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
      if (distance() < 40) return;
      gsap.to(el.querySelectorAll(".cat"), {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: root.current, start: "top top", end: () => "+=" + distance(),
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      root.current?.classList.add("is-horizontal");
      return () => root.current?.classList.remove("is-horizontal");
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [CATEGORIES.length], revertOnUpdate: true });
  return (
    <section ref={root} className="sec cats-sec" aria-labelledby="cats-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2 className="display" id="cats-title">What I <em>make.</em></h2>
          </div>
          <p>Each collection opens inside the Digital Museum below. Pick one to jump straight to it.</p>
        </div>
        <div ref={track} className="cats">
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
        <p className="cats-hint" aria-hidden="true">Keep scrolling <i /></p>
      </div>
    </section>
  );
}
