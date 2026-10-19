import type { Category } from "./types";

/** Offline fallback only — the live list is edited in /admin → Categories. */
export const CATEGORIES: Category[] = [
  { id: "websites", name: "Websites", kind: "projects", description: "Business sites and landing pages that load fast and turn visitors into enquiries." },
  { id: "apps", name: "Apps", kind: "projects", description: "Full-stack web and SaaS applications with real data, auth and dashboards." },
  { id: "games", name: "Games", kind: "projects", description: "Small, playable browser games built around one satisfying mechanic." },
  { id: "experiments", name: "Experiments", kind: "projects", description: "Creative coding, AI prototypes and ideas tested in code." },
  { id: "photography", name: "Photography", kind: "gallery", description: "Photo series — places, people and light, shot and edited by me." },
];
