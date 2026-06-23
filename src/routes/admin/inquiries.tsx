import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import type { ContactInquiry } from "@/types/content";

export const Route = createFileRoute("/admin/inquiries")({
  loader: () => apiRequest<ContactInquiry[]>("/api/admin/inquiries"),
  component: AdminInquiriesPage,
});

function AdminInquiriesPage() {
  const initialRows = Route.useLoaderData();
  const [rows, setRows] = useState(initialRows);

  async function refresh() {
    setRows(await apiRequest<ContactInquiry[]>("/api/admin/inquiries"));
  }

  async function handleMarkRead(id: number) {
    await apiRequest("/api/admin/inquiries", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    await refresh();
  }

  return (
    <AdminLayout title="Contact Inquiries">
      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-soft">
            No inquiries yet.
          </div>
        ) : (
          rows.map((inquiry) => (
            <article key={inquiry.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{inquiry.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(inquiry.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!inquiry.read && (
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">New</span>
                  )}
                  {!inquiry.read && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkRead(inquiry.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">{inquiry.message}</p>
            </article>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
