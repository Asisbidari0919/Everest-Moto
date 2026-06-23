import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { authenticated } = await apiRequest<{ authenticated: boolean }>("/api/auth/session");
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return <Outlet />;
}
