import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function decodeJwtPayload(token: string) {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    const json = Buffer.from(base64 + pad, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl.pathname;

  console.log(">>> Middleware triggered for:", url);
  console.log(">>> Cookies in middleware:", req.cookies.getAll());

  if (
    url.startsWith("/login") ||
    url.startsWith("/_next") ||
    url.startsWith("/favicon.ico") ||
    url.startsWith("/api/auth")
  ) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const raw = req.cookies.get("sb-supabase-auth-token")?.value;
          if (!raw) return undefined;
          try {
            const parsed = JSON.parse(raw);
            const token = parsed?.[0];
            const payload = token ? decodeJwtPayload(token) : null;
            console.log(">>> Parsed JWT iss from cookie:", payload?.iss || "(no iss)");
            return token || raw;
          } catch {
            return raw;
          }
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(">>> Session in middleware:", session ? "valid" : "null");

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (userError || !userData) {
    console.error(">>> Failed to fetch user data", userError);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const normalizedRole = (userData.role || "").toLowerCase();

  if (url.startsWith("/admin") && normalizedRole !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (url.startsWith("/planner") && normalizedRole !== "planner") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (url.startsWith("/driver") && normalizedRole !== "driver") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/planner/:path*", "/driver/:path*"],
};
