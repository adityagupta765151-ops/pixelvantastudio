/** Category ids are managed in the admin panel (e.g. "websites", "photography"). */
export type CategoryId = string;
/** "projects" = case-study pages; "gallery" = photo series with a picture-first layout. */
export type CategoryKind = "projects" | "gallery";
export type ProjectStatus = "live" | "dev" | "proto" | "concept";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  kind: CategoryKind;
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
  /** extra screenshots: paths under /public with a short caption */
  images?: { src: string; caption?: string }[];
  objective?: string;
  solution?: string;
  /** design decisions worth explaining, one per line */
  decisions?: string[];
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
  /** shown as the large Featured exhibit at the top of the museum */
  featured?: boolean;
  /** for photo series: where it was shot */
  location?: string;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live Project",
  dev: "In Development",
  proto: "Prototype",
  concept: "Concept",
};
