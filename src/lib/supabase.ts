import { createClient } from "@supabase/supabase-js";

// Public values (safe in the browser — access is enforced by Row Level Security).
// Override with VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY if you ever switch projects.
const URL = import.meta.env.VITE_SUPABASE_URL || "https://rxyvukuvykwublfltplp.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_KoB7YtqiVg4ogd4v_eYUyg_dK7M8hCy";

export const supabase = URL.startsWith("http") ? createClient(URL, KEY) : null;
export const ADMIN_EMAIL = "adityagupt667@gmail.com";
export const BUCKET = "project-images";
