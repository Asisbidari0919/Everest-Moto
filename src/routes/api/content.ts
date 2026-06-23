import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async () => {
        const { loadSiteContent } = await import("@/services/cms.server");
        return Response.json(await loadSiteContent());
      },
    },
  },
});
