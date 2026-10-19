import { useEffect } from "react";
import { prefersReducedMotion } from "./motion";

/** Soft scroll reveal for `.reveal` elements. Content above the fold stays fully visible;
 *  elements below start slightly faded and settle in. Never hides content. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.remove("is-pre"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("is-pre"); io.observe(el); }
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
