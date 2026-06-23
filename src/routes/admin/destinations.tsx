import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

type DestinationRow = {
  id: number;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
};

export const Route = createFileRoute("/admin/destinations")({
  loader: () => apiRequest<DestinationRow[]>("/api/admin/destinations"),
  component: AdminDestinationsPage,
});

function AdminDestinationsPage() {
  const initialRows = Route.useLoaderData();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<DestinationRow | null>(null);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: "0", active: true });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "Premium treks, lodges, permits and local expertise.",
      sortOrder: String(rows.length),
      active: true,
    });
  }

  function openEdit(row: DestinationRow) {
    setEditing(row);
    setForm({
      name: row.name,
      description: row.description,
      sortOrder: String(row.sortOrder),
      active: row.active,
    });
  }

  async function refresh() {
    setRows(await apiRequest<DestinationRow[]>("/api/admin/destinations"));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/api/admin/destinations", {
        method: "POST",
        body: JSON.stringify({
          id: editing?.id,
          name: form.name,
          description: form.description,
          sortOrder: Number(form.sortOrder),
          active: form.active,
        }),
      });
      await refresh();
      setEditing(null);
      openCreate();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: DestinationRow) {
    if (!confirm(`Delete destination "${row.name}"?`)) return;
    await apiRequest("/api/admin/destinations", {
      method: "DELETE",
      body: JSON.stringify({ id: row.id }),
    });
    await refresh();
  }

  return (
    <AdminLayout title="Destinations">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CrudTable
          rows={rows}
          columns={[
            { key: "name", label: "Destination" },
            { key: "description", label: "Description" },
            {
              key: "active",
              label: "Status",
              render: (row) => (row.active ? "Active" : "Hidden"),
            },
          ]}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-serif text-2xl font-semibold">{editing ? "Edit destination" : "Add destination"}</h2>
          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Name</span>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Description</span>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Sort order</span>
              <Input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active on website
            </label>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Update destination" : "Create destination"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
