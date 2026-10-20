import { useEffect, useState } from "react";

/** Returns the id of the section currently in the middle of the viewport. */
export function useActiveSection(ids: readonly string[], enabled = true) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (!enabled || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    // at the very bottom the last section may never reach the middle of the screen
    const onScroll = () => {
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [ids, enabled]);
  return active;
}
