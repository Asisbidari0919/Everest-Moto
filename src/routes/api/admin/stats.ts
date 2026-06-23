import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { getAdminStats } = await import("@/services/cms.server");
        return Response.json(await getAdminStats());
      },
    },
  },
});
