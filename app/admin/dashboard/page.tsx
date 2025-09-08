"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("driver");
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

      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    };

    fetchData();
  }, [router]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create user");
      return;
    }

    setEmail("");
    setPassword("");
    setName("");
    setRole("driver");

    const refresh = await fetch("/api/admin/users");
    if (refresh.ok) setUsers(await refresh.json());
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  };

  const handleDeactivate = async (userId: string) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="mb-6">
        Welcome, <span className="font-semibold">{currentUserName}</span>. You are logged in as{" "}
        <span className="italic">{currentRole}</span>.
      </p>

      {/* Add User Form */}
      <form onSubmit={handleCreateUser} className="mb-8 space-y-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Add New User</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="driver">Driver</option>
          <option value="planner">Planner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </button>
      </form>

      {/* Users Table */}
      <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="driver">Driver</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border px-4 py-2">{u.active ? "Active" : "Inactive"}</td>
              <td className="border px-4 py-2">
                {u.active && (
                  <button
                    onClick={() => handleDeactivate(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
