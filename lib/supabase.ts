import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Do not throw at import-time; Vercel may import during build. Missing values will surface at runtime.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
