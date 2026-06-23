import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { CrudTable } from "@/components/admin/CrudTable";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

type BlogPostRow = {
  id: number;
  title: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
};

export const Route = createFileRoute("/admin/blogs")({
  loader: () => apiRequest<BlogPostRow[]>("/api/admin/blogs"),
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const initialRows = Route.useLoaderData();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    sortOrder: "0",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", summary: "", content: "", imageUrl: "", sortOrder: String(rows.length), active: true });
  }

  function openEdit(row: BlogPostRow) {
    setEditing(row);
    setForm({
      title: row.title,
      summary: row.summary,
      content: row.content || "",
      imageUrl: row.imageUrl || "",
      sortOrder: String(row.sortOrder),
      active: row.active,
    });
  }

  async function refresh() {
    setRows(await apiRequest<BlogPostRow[]>("/api/admin/blogs"));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await apiRequest("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify({
          id: editing?.id,
          title: form.title,
          summary: form.summary,
          content: form.content || null,
          imageUrl: form.imageUrl || null,
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

  async function handleDelete(row: BlogPostRow) {
    if (!confirm(`Delete blog post "${row.title}"?`)) return;
    await apiRequest("/api/admin/blogs", {
      method: "DELETE",
      body: JSON.stringify({ id: row.id }),
    });
    await refresh();
  }

  return (
    <AdminLayout title="Blog Posts">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CrudTable
          rows={rows}
          columns={[
            { key: "title", label: "Title" },
            { key: "summary", label: "Summary" },
            {
              key: "active",
              label: "Status",
              render: (row) => (row.active ? "Published" : "Draft"),
            },
          ]}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-serif text-2xl font-semibold">{editing ? "Edit blog post" : "Add blog post"}</h2>
          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Title</span>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Summary</span>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Content</span>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                placeholder="Full blog post content"
              />
            </label>
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              label="Featured Image"
            />
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
              Publish on website
            </label>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Update post" : "Create post"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
