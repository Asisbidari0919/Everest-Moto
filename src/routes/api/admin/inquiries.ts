import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/inquiries")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { listInquiries } = await import("@/services/cms.server");
        return Response.json(await listInquiries());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const { id } = (await request.json()) as { id: number };
        const { markInquiryRead } = await import("@/services/cms.server");
        return Response.json(await markInquiryRead(id));
      },
    },
  },
});
