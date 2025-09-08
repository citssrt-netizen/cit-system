import { createClient } from "@supabase/supabase-js";

// ✅ Always use env vars — works locally (.env.local) and in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Anon Key must be provided in env variables");
}

// ✅ Export a single shared client
export const supabase = createClient(supabaseUrl, supabaseKey);
