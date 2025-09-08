"use client";

import { useEffect, useState } from "react";

type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("driver");
  const [error, setError] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) {
      setUsers(data);
    } else {
      setError(data.error || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, name }),
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
    alert("User created successfully!");
    fetchUsers();
  };

  // Update user role
  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role: newRole }),
    });
    if (res.ok) fetchUsers();
  };

  // Deactivate user
  const handleDeactivate = async (userId: string) => {
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin User Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add user form */}
      <form onSubmit={handleCreateUser} className="mb-8 space-y-4">
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
          placeholder="User Email"
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>

      {/* User list */}
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
              <td className="border px-4 py-2">
                {u.active ? "Active" : "Inactive"}
              </td>
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
    </div>
  );
}
