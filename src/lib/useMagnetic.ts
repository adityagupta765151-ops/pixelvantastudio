import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "./motion";

/** Button drifts slightly toward the cursor. Mouse only, off for reduced motion. */
export function useMagnetic<T extends HTMLElement>(strength = 0.2) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength * 1.4}px)`;
    };
    const leave = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return ref;
}
