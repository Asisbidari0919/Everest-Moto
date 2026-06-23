import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/settings")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { getSettings } = await import("@/services/cms.server");
        return Response.json(await getSettings());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const body = (await request.json()) as Record<string, string>;
        const { saveSettings } = await import("@/services/cms.server");
        return Response.json(await saveSettings(body));
      },
    },
  },
});
