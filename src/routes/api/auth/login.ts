import { createFileRoute } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";

import { getSessionCookieName } from "@/lib/admin-auth.server";

const SESSION_DAYS = 7;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createToken() {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

function getExpiryDate() {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  return expires.toISOString();
}

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { password } = (await request.json()) as { password: string };
        const expected = await hashPassword(getAdminPassword());
        const provided = await hashPassword(password);

        if (expected !== provided) {
          return new Response("Invalid password", { status: 401 });
        }

        const { createAdminSession } = await import("@/services/cms.server");
        const token = createToken();
        await createAdminSession(token, getExpiryDate());

        setCookie(getSessionCookieName(), token, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_DAYS * 24 * 60 * 60,
        });

        return Response.json({ success: true });
      },
    },
  },
});
