import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          name: string;
          email: string;
          phone?: string;
          message: string;
        };
        const { submitContactInquiry } = await import("@/services/cms.server");
        await submitContactInquiry(body);
        return Response.json({ success: true });
      },
    },
  },
});
