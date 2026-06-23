import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({
  loader: () => apiRequest<Record<string, string>>("/api/admin/settings"),
  component: AdminSettingsPage,
});

const fields = [
  { key: "company_name", label: "Company name" },
  { key: "hero_eyebrow", label: "Hero eyebrow" },
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle" },
  { key: "about_title", label: "About title" },
  { key: "about_description", label: "About description", textarea: true },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "whatsapp", label: "WhatsApp number" },
  { key: "stat_years", label: "Years experience stat" },
  { key: "stat_travelers", label: "Happy travelers stat" },
  { key: "stat_packages", label: "Tour packages stat" },
  { key: "stat_support", label: "Support stat" },
];

function AdminSettingsPage() {
  const initialSettings = Route.useLoaderData();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await apiRequest("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Site Settings">
      <form onSubmit={handleSave} className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-4">
          {fields.map((field) => (
            <label key={field.key} className="block space-y-2">
              <span className="text-sm font-medium">{field.label}</span>
              {field.textarea ? (
                <Textarea
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
          {saved && <span className="text-sm text-accent">Settings saved.</span>}
        </div>
      </form>
    </AdminLayout>
  );
}
