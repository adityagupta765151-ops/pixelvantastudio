import type { Project } from "./types";

/* Replace TODO fields with real details. Any empty field is hidden on the site.
   Screenshots go in /public/projects/<slug>/ */
export const PROJECTS: Project[] = [
  { id: 1, slug: "fieldops", title: "FieldOps", category: "apps", status: "dev", layout: "wide", hue: "#3A4BFF",
    description: "India-first field service management SaaS for teams that send technicians out on jobs.",
    objective: "Small service businesses still run jobs on phone calls and WhatsApp. FieldOps gives them one place to schedule work, track technicians and close jobs.",
    role: "Founder and full-stack developer.", stack: ["SaaS", "Full-stack"] },
  { id: 2, slug: "quantdesk", title: "QuantDesk", category: "apps", status: "dev", hue: "#8C97FF",
    description: "Paper-trading system for testing strategies without risking real money.",
    objective: "Practise and evaluate trading strategies on simulated orders.",
    role: "Solo developer.", stack: ["FastAPI", "React", "Python"] },
  { id: 3, slug: "bloodbridge-ai", title: "BloodBridge AI", category: "apps", status: "proto", hue: "#FF6A3D",
    description: "Blood-donation platform that connects donors and requesters, with an ML layer on top.",
    objective: "Make it faster to find a matching donor when blood is needed.",
    role: "Team member on a college team project at UCER.", stack: ["React", "Node.js", "PostgreSQL", "Machine Learning"] },
  { id: 4, slug: "prince-fitness", title: "Prince Fitness", category: "websites", status: "concept", layout: "half", hue: "#FFB08F",
    description: "Gym website with an admin panel, designed as a client proposal for a local gym.",
    objective: "Give the gym a proper online presence and a simple panel to manage members and content.",
    role: "Designer and developer.", stack: ["Website", "Admin panel"] },
  { id: 5, slug: "shopos", title: "ShopOS", category: "apps", status: "dev", layout: "half", hue: "#8E9AA6",
    description: "Multi-tenant commerce platform so small shops can run their own online store.",
    role: "Founder and developer.", stack: ["FastAPI", "PostgreSQL", "Next.js"] },
  { id: 6, slug: "medicine-reminder", title: "Medicine Reminder", category: "apps", status: "proto", hue: "#A9C4D6",
    description: "Medicine reminders plus a personal health-record system in one app.",
    role: "Solo developer.", stack: ["MongoDB", "Express", "React", "Node.js", "TypeScript"] },
  { id: 7, slug: "workflow-automation", title: "Flow Builder", category: "apps", status: "proto", hue: "#C9C3D6",
    description: "Low-code SaaS for building and running workflow automations.",
    role: "Solo developer.", stack: ["Next.js 15", "SaaS"] },
  { id: 8, slug: "lets-grind", title: "Let's Grind", category: "apps", status: "dev", hue: "#FFB08F",
    description: "Exam-preparation platform for students.",
    role: "Founder and developer.", stack: ["Web app"] },
];

// Dev-time guard: catches duplicate slugs or ids early.
if (import.meta.env.DEV) {
  const slugs = new Set<string>(), ids = new Set<number>();
  for (const p of PROJECTS) {
    if (slugs.has(p.slug) || ids.has(p.id)) console.error(`Duplicate project slug/id: ${p.slug} (${p.id})`);
    slugs.add(p.slug); ids.add(p.id);
  }
}

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
