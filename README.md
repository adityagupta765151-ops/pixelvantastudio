# pixelvantastudio

Portfolio of Aditya — independent developer studio. Vite + React + TypeScript, deployed on Vercel.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Edit content
- **Projects:** open `/admin`, sign in with the owner email (magic link), then add, edit, reorder, hide or delete projects and upload screenshots. Changes go live instantly.
- `src/data/site.ts` — name, email, WhatsApp, socials, hero copy
- `src/data/projects.ts` — offline fallback only (shown if Supabase can't be reached)

## Backend (Supabase)
- Table `public.projects` with Row Level Security: anyone can read published rows; only `adityagupt667@gmail.com` can write.
- Storage bucket `project-images` (public read, admin-only write). Uploads are resized to 2000px WebP in the browser.
- Auth → URL Configuration must list the site URL and `/admin` redirect URLs.
- `src/styles/tokens.css` — colours, type, spacing, motion

## Levels
- [x] 1 Foundation — setup, tokens, logo, data, routing, Vercel rewrites
- [x] 2 Nav + footer
- [x] 3 Hero, marquee, categories, about
- [x] 4 Digital Museum + filters
- [x] 5 Project detail pages
- [x] 5.5 Admin panel (Supabase)
- [x] 6 Skills, process, contact form (enquiries → /admin inbox)
- [ ] 7 Motion, responsive, accessibility polish
- [ ] 8 SEO, testing, launch
