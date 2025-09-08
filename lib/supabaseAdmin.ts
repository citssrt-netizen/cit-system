import { createClient } from "@supabase/supabase-js";

// Localhost for when you’re on your PC
const localUrl = "http://127.0.0.1:54321";

// Tailscale IP for when you’re on your iPhone (replace with your PC’s actual IP)
const tailscaleUrl = "http://100.105.22.33:54321";

// Pick Tailscale if hostname starts with 100.x (Tailscale), otherwise use localhost
const supabaseUrl =
  typeof window !== "undefined" && window.location.hostname.startsWith("100.")
    ? tailscaleUrl
    : localUrl;

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
