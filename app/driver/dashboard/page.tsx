"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // ✅ fixed import

type RunRecord = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function DriverDashboard() {
  const router = useRouter();
  // ❌ removed "const supabase = supabase();" (already imported above)

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [runs, setRuns] = useState<RunRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setCurrentUserName(profile.name);
        setCurrentRole(profile.role);
      }

      const { data: runsData } = await supabase
        .from("runs")
        .select("id, title, description, created_at")
        .eq("driver_id", user.id) // ✅ only this driver’s runs
        .order("created_at", { ascending: false });

      if (runsData) setRuns(runsData);
    };

    fetchData();
  }, [router]); // ✅ removed supabase from deps (static import, doesn’t change)

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Driver Dashboard</h1>
      <p className="mb-6">
        Welcome, <span className="font-semibold">{currentUserName}</span>. You are logged in as{" "}
        <span className="italic">{currentRole}</span>.
      </p>

      <h2 className="text-xl font-semibold mb-4">Your Assigned Runs</h2>
      {runs.length === 0 ? (
        <p>No runs assigned to you yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td className="border px-4 py-2">{r.title}</td>
                <td className="border px-4 py-2">{r.description}</td>
                <td className="border px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
