import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";

/** C001 — Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // async content (projects from Supabase, images) changes the page height — re-measure triggers
    let t: number | undefined;
    const ro = new ResizeObserver(() => { window.clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 150); });
    ro.observe(document.body);

    return () => {
      ro.disconnect(); window.clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  return <>{children}</>;
}
