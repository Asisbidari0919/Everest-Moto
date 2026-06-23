import { createFileRoute } from "@tanstack/react-router";
import { getCookie, setCookie } from "@tanstack/react-start/server";

import { getSessionCookieName } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        const token = getCookie(getSessionCookieName());
        if (token) {
          const { deleteAdminSession } = await import("@/services/cms.server");
          await deleteAdminSession(token);
        }

        setCookie(getSessionCookieName(), "", {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });

        return Response.json({ success: true });
      },
    },
  },
});
