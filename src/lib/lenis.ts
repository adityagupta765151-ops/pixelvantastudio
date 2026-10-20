import type Lenis from "lenis";

/** The page's single Lenis instance (null when smooth scroll is off, e.g. reduced motion). */
export const lenisRef: { current: Lenis | null } = { current: null };

/** Height of the sticky nav; matches `section[id] { scroll-margin-top }` in base.css. */
const NAV = 72;

/** Scroll to an element (its top lands just under the nav) or to a y-offset. */
export function scrollToTarget(target: HTMLElement | number, opts: { immediate?: boolean } = {}) {
  const y = typeof target === "number"
    ? target
    : target.getBoundingClientRect().top + window.scrollY - NAV;
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.resize(); // the page may have just grown (new route, data, images); don't clamp to the old height
    lenis.scrollTo(Math.max(0, y), { immediate: opts.immediate, duration: 1.1, force: true });
    return;
  }
  window.scrollTo({ top: Math.max(0, y), behavior: opts.immediate ? "auto" : "smooth" });
}
