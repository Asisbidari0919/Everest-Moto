import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/packages")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { listPackages } = await import("@/services/cms.server");
        return Response.json(await listPackages());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const body = await request.json();
        const { savePackage } = await import("@/services/cms.server");
        return Response.json(await savePackage(body));
      },
      DELETE: async ({ request }) => {
        await requireAdminRequest();
        const { id } = (await request.json()) as { id: number };
        const { deletePackage } = await import("@/services/cms.server");
        return Response.json(await deletePackage(id));
      },
    },
  },
});
