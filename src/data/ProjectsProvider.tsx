import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { PROJECTS as SEED } from "./projects";
import { CATEGORIES as SEED_CATS } from "./categories";
import type { Category, Project } from "./types";
import { rowToCategory, rowToProject, type CategoryRow, type ProjectRow } from "./projectsRemote";
import { supabase } from "@/lib/supabase";

type Source = "seed" | "cache" | "live" | "offline";
type Data = { projects: Project[]; categories: Category[]; source: Source };
type Ctx = Data & { reload: () => Promise<void>; categoryOf: (p: Project) => Category };

const fallbackCat = (id: string): Category => ({ id, name: id, description: "", kind: "projects" });
const ProjectsCtx = createContext<Ctx>({
  projects: SEED, categories: SEED_CATS, source: "seed", reload: async () => {},
  categoryOf: (p) => SEED_CATS.find((c) => c.id === p.category) ?? fallbackCat(p.category),
});
const CACHE_KEY = "pv:museum:v2";

function readCache(): Omit<Data, "source"> | null {
  try { const raw = localStorage.getItem(CACHE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/** Live categories + projects from Supabase. Renders instantly from the last cached copy
 *  (or the bundled seed), then swaps in fresh data. Falls back silently if the API is down. */
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const cached = readCache();
  const [data, setData] = useState<Data>(
    cached ? { ...cached, source: "cache" } : { projects: SEED, categories: SEED_CATS, source: "seed" }
  );

  const reload = useCallback(async () => {
    if (!supabase) { setData((s) => ({ ...s, source: "offline" })); return; }
    const [cats, projs] = await Promise.all([
      supabase.from("categories").select("*").eq("published", true).order("sort_order").order("name"),
      supabase.from("projects").select("*").eq("published", true).order("sort_order").order("id"),
    ]);
    if (cats.error || projs.error || !cats.data || !projs.data) {
      setData((s) => ({ ...s, source: s.source === "live" ? "live" : "offline" }));
      return;
    }
    const categories = (cats.data as CategoryRow[]).map(rowToCategory);
    const visible = new Set(categories.map((c) => c.id));
    // projects inside a hidden category stay hidden too
    const projects = (projs.data as ProjectRow[]).map(rowToProject).filter((p) => visible.has(p.category));
    setData({ projects, categories, source: "live" });
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ projects, categories })); } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const categoryOf = useCallback(
    (p: Project) => data.categories.find((c) => c.id === p.category) ?? fallbackCat(p.category),
    [data.categories]
  );
  return <ProjectsCtx.Provider value={{ ...data, reload, categoryOf }}>{children}</ProjectsCtx.Provider>;
}

export const useProjects = () => useContext(ProjectsCtx);
