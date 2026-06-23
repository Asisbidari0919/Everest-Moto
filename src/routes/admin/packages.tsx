import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

type PackageRow = {
  id: number;
  title: string;
  details: string;
  price: string;
  originalPrices: string[];
  sortOrder: number;
  active: boolean;
};

export const Route = createFileRoute("/admin/packages")({
  loader: () => apiRequest<PackageRow[]>("/api/admin/packages"),
  component: AdminPackagesPage,
});

function AdminPackagesPage() {
  const initialRows = Route.useLoaderData();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<PackageRow | null>(null);
  const [form, setForm] = useState({
    title: "",
    details: "",
    price: "",
    originalPrices: "",
    sortOrder: "0",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", details: "", price: "", originalPrices: "", sortOrder: String(rows.length), active: true });
  }

  function openEdit(row: PackageRow) {
    setEditing(row);
    setForm({
      title: row.title,
      details: row.details,
      price: row.price,
      originalPrices: row.originalPrices.join(", "),
      sortOrder: String(row.sortOrder),
      active: row.active,
    });
  }

  async function refresh() {
    setRows(await apiRequest<PackageRow[]>("/api/admin/packages"));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await apiRequest("/api/admin/packages", {
        method: "POST",
        body: JSON.stringify({
          id: editing?.id,
          title: form.title,
          details: form.details,
          price: form.price,
          originalPrices: form.originalPrices
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
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

  async function handleDelete(row: PackageRow) {
    if (!confirm(`Delete package "${row.title}"?`)) return;
    await apiRequest("/api/admin/packages", {
      method: "DELETE",
      body: JSON.stringify({ id: row.id }),
    });
    await refresh();
  }

  return (
    <AdminLayout title="Tour Packages">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CrudTable
          rows={rows}
          columns={[
            { key: "title", label: "Tour" },
            { key: "details", label: "Details" },
            { key: "price", label: "Price" },
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
          <h2 className="font-serif text-2xl font-semibold">{editing ? "Edit package" : "Add package"}</h2>
          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Tour name</span>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Duration / details</span>
              <Textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Price</span>
              <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Original prices (comma separated)</span>
              <Input
                value={form.originalPrices}
                onChange={(e) => setForm({ ...form, originalPrices: e.target.value })}
                placeholder="$1,600, $1,599"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Sort order</span>
              <Input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active on website
            </label>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Update package" : "Create package"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
