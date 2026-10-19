import type { Project, CategoryId, ProjectStatus } from "./types";

/** Row shape of public.projects in Supabase. */
export interface ProjectRow {
  id: number;
  slug: string;
  title: string;
  category: CategoryId;
  status: ProjectStatus;
  description: string;
  cover: string | null;
  images: { src: string; caption?: string }[];
  objective: string | null;
  solution: string | null;
  decisions: string[];
  features: string[];
  role: string | null;
  stack: string[];
  live_url: string | null;
  repo_url: string | null;
  demo_url: string | null;
  limitations: string | null;
  date: string | null;
  layout: "wide" | "half" | null;
  hue: string;
  sort_order: number;
  published: boolean;
}

const u = <T,>(v: T | null | undefined) => (v === null || v === "" ? undefined : v ?? undefined);

export function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id, slug: r.slug, title: r.title, category: r.category, status: r.status,
    description: r.description, cover: u(r.cover), images: r.images ?? [],
    objective: u(r.objective), solution: u(r.solution), decisions: r.decisions ?? [],
    features: r.features ?? [], role: u(r.role), stack: r.stack ?? [],
    liveUrl: u(r.live_url), repoUrl: u(r.repo_url), demoUrl: u(r.demo_url),
    limitations: u(r.limitations), date: u(r.date), layout: u(r.layout), hue: r.hue || "#3A4BFF",
  };
}
