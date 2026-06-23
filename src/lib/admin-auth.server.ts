import { getCookie } from "@tanstack/react-start/server";

const SESSION_COOKIE = "admin_session";

export async function requireAdminRequest() {
  const token = getCookie(SESSION_COOKIE);
  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const { verifySessionToken } = await import("@/services/cms.server");
  const authenticated = await verifySessionToken(token);
  if (!authenticated) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
