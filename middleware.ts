import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl.pathname;

  console.log(">>> Middleware triggered for:", url);
  console.log(">>> Cookies in middleware:", req.cookies.getAll());

  if (
    url.startsWith("/login") ||
    url.startsWith("/_next") ||
    url.startsWith("/favicon.ico")
  ) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get("sb-supabase-auth-token")?.value;

          // ✅ Fix: parse cookie array and return only the token
          try {
            const parsed = JSON.parse(cookie || "[]");
            return parsed[0]; // JWT token only
          } catch (err) {
            console.warn(">>> Failed to parse auth cookie", err);
            return cookie;
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

  const normalizedRole = userData.role?.toLowerCase() || "";

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
