import { createFileRoute } from "@tanstack/react-router";
import { Bike, MapPin, MessageSquare, Package } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  loader: () =>
    apiRequest<{
      packages: number;
      destinations: number;
      bikes: number;
      inquiries: number;
      unreadInquiries: number;
    }>("/api/admin/stats"),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  const cards = [
    { label: "Tour Packages", value: stats.packages, icon: Package },
    { label: "Destinations", value: stats.destinations, icon: MapPin },
    { label: "Bike Rentals", value: stats.bikes, icon: Bike },
    { label: "Inquiries", value: stats.inquiries, icon: MessageSquare, note: `${stats.unreadInquiries} unread` },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="mt-4 font-serif text-4xl font-semibold">{card.value}</p>
            {card.note && <p className="mt-2 text-sm text-accent">{card.note}</p>}
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-serif text-2xl font-semibold">Quick actions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the sidebar to update tour package pricing, destinations, bike rentals, contact inquiries, and site settings.
        </p>
      </div>
    </AdminLayout>
  );
}
