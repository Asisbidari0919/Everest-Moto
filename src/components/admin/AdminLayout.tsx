import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, MapPin, MessageSquare, Package, Settings, Bike, LogOut, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/packages", label: "Tour Packages", icon: Package },
  { to: "/admin/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/bikes", label: "Bike Rentals", icon: Bike },
  { to: "/admin/blogs", label: "Blog Posts", icon: BookOpen },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();

  async function handleLogout() {
    await apiRequest("/api/auth/logout", { method: "POST" });
    await router.navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-6 lg:block">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Everest Moto</p>
            <h1 className="mt-2 font-serif text-2xl font-semibold">Admin Panel</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={item.exact ? { exact: true } : undefined}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-2 border-t border-border pt-6">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">
              View website
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
              <h1 className="font-serif text-2xl font-semibold">{title}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <div className="mb-8 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Control Panel</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
