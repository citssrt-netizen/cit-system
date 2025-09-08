"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log(">>> Attempting login with:", email);

    const {
      data: { user, session },
      error: loginError,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      console.error(">>> Login error:", loginError.message);
      setError(loginError.message);
      return;
    }
    if (!session || !user) {
      console.error(">>> Login failed: no session returned");
      setError("Login failed: no session returned");
      return;
    }

    console.log(">>> Login success, user id:", user.id);

    const { data: roleData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || !roleData) {
      console.error(">>> Unable to fetch user role", roleError);
      setError("Unable to fetch user role");
      return;
    }

    const normalizedRole = roleData.role?.toLowerCase();
    console.log(">>> Fetched role:", normalizedRole);

    if (normalizedRole === "admin") router.push("/admin/dashboard");
    else if (normalizedRole === "planner") router.push("/planner/dashboard");
    else if (normalizedRole === "driver") router.push("/driver/dashboard");
    else setError("Invalid role, please contact administrator.");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
