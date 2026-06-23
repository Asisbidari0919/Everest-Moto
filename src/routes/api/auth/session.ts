import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";

import { getSessionCookieName } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async () => {
        const token = getCookie(getSessionCookieName());
        if (!token) return Response.json({ authenticated: false });

        const { verifySessionToken } = await import("@/services/cms.server");
        return Response.json({ authenticated: await verifySessionToken(token) });
      },
    },
  },
});
