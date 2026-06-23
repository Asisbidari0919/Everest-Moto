import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { authenticated } = await apiRequest<{ authenticated: boolean }>("/api/auth/session");
    if (authenticated) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      await router.navigate({ to: "/admin" });
    } catch {
      setError("Invalid password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-luxury">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Everest Moto</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage tour packages, destinations, and inquiries.</p>

        <label className="mt-8 block space-y-2">
          <span className="text-sm font-medium">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            required
          />
        </label>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">Default password: admin123 (change in .env)</p>
      </form>
    </div>
  );
}
