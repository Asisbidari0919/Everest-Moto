import { createFileRoute } from "@tanstack/react-router";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/blogs")({
  server: {
    handlers: {
      GET: async () => {
        await requireAdminRequest();
        const { listBlogPosts } = await import("@/services/cms.server");
        return Response.json(await listBlogPosts());
      },
      POST: async ({ request }) => {
        await requireAdminRequest();
        const body = await request.json();
        const { saveBlogPost } = await import("@/services/cms.server");
        return Response.json(await saveBlogPost(body));
      },
      DELETE: async ({ request }) => {
        await requireAdminRequest();
        const { id } = (await request.json()) as { id: number };
        const { deleteBlogPost } = await import("@/services/cms.server");
        return Response.json(await deleteBlogPost(id));
      },
    },
  },
});
