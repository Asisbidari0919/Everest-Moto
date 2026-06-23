import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    
    try {
      const response = await fetch(
        new URL("/api/auth/session", typeof window !== "undefined" ? window.location.origin : "http://localhost"),
        {
          credentials: "include",
        }
      );
      const { authenticated } = await response.json();
      if (!authenticated) {
        throw redirect({ to: "/admin/login" });
      }
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return <Outlet />;
}
