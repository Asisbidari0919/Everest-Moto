import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

type BikeRow = {
  id: number;
  title: string;
  price: string;
  features: string;
  sortOrder: number;
  active: boolean;
};

export const Route = createFileRoute("/admin/bikes")({
  loader: () => apiRequest<BikeRow[]>("/api/admin/bikes"),
  component: AdminBikesPage,
});

function AdminBikesPage() {
  const initialRows = Route.useLoaderData();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<BikeRow | null>(null);
  const [form, setForm] = useState({ title: "", price: "", features: "", sortOrder: "0", active: true });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", price: "", features: "", sortOrder: String(rows.length), active: true });
  }

  function openEdit(row: BikeRow) {
    setEditing(row);
    setForm({
      title: row.title,
      price: row.price,
      features: row.features,
      sortOrder: String(row.sortOrder),
      active: row.active,
    });
  }

  async function refresh() {
    setRows(await apiRequest<BikeRow[]>("/api/admin/bikes"));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/api/admin/bikes", {
        method: "POST",
        body: JSON.stringify({
          id: editing?.id,
          title: form.title,
          price: form.price,
          features: form.features,
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

  async function handleDelete(row: BikeRow) {
    if (!confirm(`Delete bike rental "${row.title}"?`)) return;
    await apiRequest("/api/admin/bikes", {
      method: "DELETE",
      body: JSON.stringify({ id: row.id }),
    });
    await refresh();
  }

  return (
    <AdminLayout title="Bike Rentals">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CrudTable
          rows={rows}
          columns={[
            { key: "title", label: "Bike rental" },
            { key: "price", label: "Price" },
            { key: "features", label: "Features" },
          ]}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-serif text-2xl font-semibold">{editing ? "Edit bike rental" : "Add bike rental"}</h2>
          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Title</span>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Price</span>
              <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Features</span>
              <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} required />
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
            {saving ? "Saving..." : editing ? "Update bike rental" : "Create bike rental"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
