import { useRef } from "react";
import { MARQUEE } from "@/data/about";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";
import "./marquee.css";

/** C027 — loops on its own, reverses when you scroll up and speeds up with scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const row = MARQUEE.map((t, i) => (
    <span key={t} className={i % 2 ? "is-outline" : undefined}>{t}<i /></span>
  ));

  useGSAP(() => {
    if (reduced()) return;
    const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    let dir = 1;
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        dir = self.direction;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
        gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true })
          .then(() => gsap.to(loop, { timeScale: dir, duration: 0.8, overwrite: true }));
      },
    });
    const pause = () => loop.pause(), play = () => loop.play();
    root.current?.addEventListener("pointerenter", pause);
    root.current?.addEventListener("pointerleave", play);
    return () => { st.kill(); root.current?.removeEventListener("pointerenter", pause); root.current?.removeEventListener("pointerleave", play); };
  }, { scope: root });

  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="marquee-track">{row}{row}</div>
    </div>
  );
}
