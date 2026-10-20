import type Lenis from "lenis";

/** The page's single Lenis instance (null when smooth scroll is off, e.g. reduced motion). */
export const lenisRef: { current: Lenis | null } = { current: null };

/** Scroll to an element or y-offset, smoothly when Lenis is running. */
export function scrollToTarget(target: HTMLElement | number, opts: { offset?: number; immediate?: boolean } = {}) {
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.1 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: opts.immediate ? "auto" : "smooth" });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0), behavior: opts.immediate ? "auto" : "smooth" });
}
