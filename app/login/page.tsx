"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      // Clear any stale sessions (e.g. issued by localhost)
      await supabase.auth.signOut().catch(() => {});
      await new Promise((r) => setTimeout(r, 120));

      console.log(">>> login using URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      const { data: signInData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        setError(loginError.message || "Login failed");
        setBusy(false);
        return;
      }

      const user = signInData.user;
      if (!user) {
        setError("No user returned from Supabase");
        setBusy(false);
        return;
      }

      // Fetch role and route
      const { data: roleData, error: roleErr } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleErr || !roleData) {
        setError("Could not determine role for this user");
        setBusy(false);
        return;
      }

      const role = (roleData.role || "").toLowerCase();
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "planner") router.push("/planner/dashboard");
      else if (role === "driver") router.push("/driver/dashboard");
      else setError("Unknown role for this account.");
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 border rounded-xl p-6"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>

        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="mt-3 text-xs text-gray-500">
          <a className="underline" href="/auth/debug">Auth debug</a>{" "}
          ·{" "}
          <a className="underline" href="/auth/reset">Reset auth</a>
        </div>
      </form>
    </main>
  );
}
