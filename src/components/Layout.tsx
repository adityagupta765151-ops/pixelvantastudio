import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

/** Scrolls to #hash targets after navigation, or to top on a new page. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait a frame so the target section is mounted
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, key]);
  return null;
}

export default function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Nav />
      <div id="main" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
