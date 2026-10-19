import { useEffect } from "react";
import { SITE } from "@/data/site";

/** Sets document title + meta description for the current page. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const base = `${SITE.brand} — ${SITE.role} Studio`;
    document.title = title ? `${title} · ${SITE.brand}` : base;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prev = meta?.content;
    if (meta && description) meta.content = description;
    return () => { if (meta && prev) meta.content = prev; };
  }, [title, description]);
}
