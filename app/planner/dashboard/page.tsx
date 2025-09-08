"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // ✅ fixed import

type RunRecord = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  driver_id: string | null;
};

type DriverRecord = {
  id: string;
  name: string;
  email: string;
};

export default function PlannerDashboard() {
  const router = useRouter();
  // ❌ removed "const supabase = supabase();" (already imported above)

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [driverId, setDriverId] = useState("");
  const [error, setError] = useState("");

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
        .select("id, title, description, created_at, driver_id")
        .order("created_at", { ascending: false });
      if (runsData) setRuns(runsData);

      const { data: driversData } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("role", "driver")
        .eq("active", true);

      if (driversData) setDrivers(driversData);
    };

    fetchData();
  }, [router]); // ✅ removed supabase from deps

  const handleCreateRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase
      .from("runs")
      .insert({ title, description, driver_id: driverId || null });

    if (error) {
      setError(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setDriverId("");

    const { data: runsData } = await supabase
      .from("runs")
      .select("id, title, description, created_at, driver_id")
      .order("created_at", { ascending: false });
    if (runsData) setRuns(runsData);
  };

  const handleDeleteRun = async (runId: string) => {
    await supabase.from("runs").delete().eq("id", runId);

    const { data: runsData } = await supabase
      .from("runs")
      .select("id, title, description, created_at, driver_id")
      .order("created_at", { ascending: false });

    if (runsData) setRuns(runsData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Planner Dashboard</h1>
      <p className="mb-6">
        Welcome, <span className="font-semibold">{currentUserName}</span>. You are logged in as{" "}
        <span className="italic">{currentRole}</span>.
      </p>

      {/* Create Run Form */}
      <form onSubmit={handleCreateRun} className="mb-8 space-y-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Create New Run</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Run Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Assign Driver --</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.email})
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Run
        </button>
      </form>

      {/* Runs Table */}
      <h2 className="text-xl font-semibold mb-4">Existing Runs</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Driver</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => {
            const driver = drivers.find((d) => d.id === r.driver_id);
            return (
              <tr key={r.id}>
                <td className="border px-4 py-2">{r.title}</td>
                <td className="border px-4 py-2">{r.description}</td>
                <td className="border px-4 py-2">{driver ? driver.name : "Unassigned"}</td>
                <td className="border px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteRun(r.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
