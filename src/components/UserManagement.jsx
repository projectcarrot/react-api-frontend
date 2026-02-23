import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    status: "ACTIVE",
  });

  const getId = (u) => (typeof u._id === "string" ? u._id : u._id?.$oid);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function startEdit(user) {
    setEditingId(getId(user));
    setForm({
      username: user.username || "",
      email: user.email || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      status: user.status || "ACTIVE",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      status: "ACTIVE",
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/user/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      await loadUsers();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    setError("");
    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      if (editingId === id) resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-800">User Management</h1>
            <button
              onClick={loadUsers}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-slate-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-3">Username</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const id = getId(u);
                    return (
                      <tr key={id} className="border-b last:border-0">
                        <td className="py-2 pr-3">{u.username}</td>
                        <td className="py-2 pr-3">{u.email}</td>
                        <td className="py-2 pr-3">{`${u.firstname || ""} ${u.lastname || ""}`.trim()}</td>
                        <td className="py-2 pr-3">{u.status}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(u)}
                              className="rounded bg-amber-500 px-2 py-1 text-white hover:bg-amber-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              className="rounded bg-rose-600 px-2 py-1 text-white hover:bg-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingId ? "Edit User" : "Select a user"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-3">
            <input
              className="w-full rounded-lg border p-2"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={!editingId}
            />
            <input
              className="w-full rounded-lg border p-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!editingId}
            />
            <input
              className="w-full rounded-lg border p-2"
              placeholder="First name"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              disabled={!editingId}
            />
            <input
              className="w-full rounded-lg border p-2"
              placeholder="Last name"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              disabled={!editingId}
            />
            <select
              className="w-full rounded-lg border p-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              disabled={!editingId}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              type="submit"
              disabled={!editingId || saving}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? "Saving..." : "Update User"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
