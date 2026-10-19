import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { PROJECTS as SEED } from "./projects";
import type { Project } from "./types";
import { rowToProject, type ProjectRow } from "./projectsRemote";
import { supabase } from "@/lib/supabase";

type Ctx = { projects: Project[]; source: "seed" | "cache" | "live" | "offline"; reload: () => Promise<void> };
const ProjectsCtx = createContext<Ctx>({ projects: SEED, source: "seed", reload: async () => {} });
const CACHE_KEY = "pv:projects:v1";

function readCache(): Project[] | null {
  try { const raw = localStorage.getItem(CACHE_KEY); return raw ? (JSON.parse(raw) as Project[]) : null; } catch { return null; }
}

/** Live projects from Supabase. Renders instantly from the last cached copy (or the
 *  bundled seed), then swaps in fresh data. Falls back silently if the API is down. */
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const cached = readCache();
  const [state, setState] = useState<Omit<Ctx, "reload">>({ projects: cached ?? SEED, source: cached ? "cache" : "seed" });

  const reload = useCallback(async () => {
    if (!supabase) { setState((s) => ({ ...s, source: "offline" })); return; }
    const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("sort_order").order("id");
    if (error || !data) { setState((s) => ({ ...s, source: s.source === "live" ? "live" : "offline" })); return; }
    const projects = (data as ProjectRow[]).map(rowToProject);
    setState({ projects, source: "live" });
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(projects)); } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  return <ProjectsCtx.Provider value={{ ...state, reload }}>{children}</ProjectsCtx.Provider>;
}

export const useProjects = () => useContext(ProjectsCtx);
