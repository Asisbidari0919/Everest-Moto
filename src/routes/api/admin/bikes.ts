import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/bikes")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { listBikes } = await import("@/services/cms.server");
        return Response.json(await listBikes());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const body = await request.json();
        const { saveBike } = await import("@/services/cms.server");
        return Response.json(await saveBike(body));
      },
      DELETE: async ({ request }) => {
        await requireAdminRequest();
        const { id } = (await request.json()) as { id: number };
        const { deleteBike } = await import("@/services/cms.server");
        return Response.json(await deleteBike(id));
      },
    },
  },
});
