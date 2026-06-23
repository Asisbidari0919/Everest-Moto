import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/destinations")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { listDestinations } = await import("@/services/cms.server");
        return Response.json(await listDestinations());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const body = await request.json();
        const { saveDestination } = await import("@/services/cms.server");
        return Response.json(await saveDestination(body));
      },
      DELETE: async ({ request }) => {
        await requireAdminRequest();
        const { id } = (await request.json()) as { id: number };
        const { deleteDestination } = await import("@/services/cms.server");
        return Response.json(await deleteDestination(id));
      },
    },
  },
});
