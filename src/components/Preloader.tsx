import { useEffect, useRef, useState } from "react";
import { PixelMark } from "./Logo";
import { gsap, reduced } from "@/lib/gsap";
import "./preloader.css";

const KEY = "pv:preloaded";

/** C008 — short counter intro, once per browser session, home page only. Content renders underneath. */
export function Preloader() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined" || reduced() || window.location.pathname !== "/") return false;
    try { return !sessionStorage.getItem(KEY); } catch { return false; }
  });
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show || !root.current) return;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
    const count = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setShow(false) });
    tl.to(count, { v: 100, duration: 0.9, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(count.v)).padStart(3, "0"); } })
      .to(".pre-mark, .pre-count", { opacity: 0, y: -12, duration: 0.25, stagger: 0.05 }, "+=0.05")
      .to(root.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.05");
    return () => { tl.kill(); };
  }, [show]);

  if (!show) return null;
  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="pre-mark"><PixelMark size={64} /></div>
      <span className="pre-count"><span ref={num}>000</span><i>%</i></span>
    </div>
  );
}
