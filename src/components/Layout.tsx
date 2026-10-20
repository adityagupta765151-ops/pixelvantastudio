import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { Preloader } from "./Preloader";
import { scrollToTarget } from "@/lib/lenis";
import { ScrollTrigger } from "@/lib/gsap";

/** Scrolls to #hash targets after navigation, or to top on a new page. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!hash) document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait for the target section (and any pins above it) to be laid out
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const el = document.getElementById(id);
        if (el) scrollToTarget(el);
      }));
    } else {
      scrollToTarget(0, { immediate: true });
    }
  }, [pathname, hash, key]);
  return null;
}

export default function Layout() {
  return (
    <SmoothScroll>
      <Preloader />
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Nav />
      {/* C098: the page sits above the footer and lifts away to reveal it */}
      <div id="main" className="page-main" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </SmoothScroll>
  );
}
