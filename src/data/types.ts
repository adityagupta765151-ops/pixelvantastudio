export type CategoryId = "websites" | "apps" | "games" | "experiments";
export type ProjectStatus = "live" | "dev" | "proto" | "concept";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: CategoryId;
  status: ProjectStatus;
  /** one-line summary shown on cards */
  description: string;
  /** path under /public, e.g. "/projects/quantdesk/cover.webp". Empty = placeholder art */
  cover?: string;
  images?: string[];
  objective?: string;
  solution?: string;
  features?: string[];
  role?: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
  limitations?: string;
  date?: string;
  /** museum grid size when "All" is selected */
  layout?: "wide" | "half";
  /** accent hue for placeholder art */
  hue: string;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live Project",
  dev: "In Development",
  proto: "Prototype",
  concept: "Concept",
};
