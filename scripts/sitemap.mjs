// Writes dist/sitemap.xml after `vite build`, listing the home page and every published project.
// Reads live projects from Supabase; falls back to the bundled seed slugs if that fails,
// so a build never breaks because of the network.
import { writeFileSync, readFileSync } from "node:fs";

const SITE = "https://pixelvantastudio.vercel.app";
const API = "https://rxyvukuvykwublfltplp.supabase.co/rest/v1";
const KEY = "sb_publishable_KoB7YtqiVg4ogd4v_eYUyg_dK7M8hCy";

async function liveSlugs() {
  const headers = { apikey: KEY };
  const [cats, projects] = await Promise.all([
    fetch(`${API}/categories?select=id&published=eq.true`, { headers }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    fetch(`${API}/projects?select=slug,category,updated_at&published=eq.true`, { headers }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
  ]);
  const visible = new Set(cats.map((c) => c.id));
  return projects.filter((p) => visible.has(p.category)).map((p) => ({ slug: p.slug, lastmod: p.updated_at?.slice(0, 10) }));
}

function seedSlugs() {
  const src = readFileSync(new URL("../src/data/projects.ts", import.meta.url), "utf8");
  return [...src.matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => ({ slug: m[1] }));
}

let entries;
try {
  entries = await liveSlugs();
  console.log(`sitemap: ${entries.length} live projects`);
} catch (e) {
  entries = seedSlugs();
  console.warn(`sitemap: Supabase unreachable (${e}), using ${entries.length} seed projects`);
}

const today = new Date().toISOString().slice(0, 10);
const url = (loc, lastmod = today, priority = "0.7") =>
  `  <url><loc>${SITE}${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[url("/", today, "1.0"), ...entries.map((e) => url(`/projects/${e.slug}`, e.lastmod ?? today))].join("\n")}
</urlset>
`;
writeFileSync(new URL("../dist/sitemap.xml", import.meta.url), xml);
