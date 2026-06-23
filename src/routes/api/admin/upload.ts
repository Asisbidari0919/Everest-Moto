import { createFileRoute } from "@tanstack/react-router";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

import { requireAdminRequest } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await requireAdminRequest();

        try {
          const formData = await request.formData();
          const file = formData.get("file") as File;

          if (!file || !file.size) {
            return Response.json({ error: "No file provided" }, { status: 400 });
          }

          // Validate file type
          const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
          if (!allowedTypes.includes(file.type)) {
            return Response.json({ error: "Invalid file type. Only JPEG, PNG, WebP, and GIF allowed" }, { status: 400 });
          }

          // Max file size: 5MB
          const maxSize = 5 * 1024 * 1024;
          if (file.size > maxSize) {
            return Response.json({ error: "File too large. Max 5MB allowed" }, { status: 400 });
          }

          // Read file buffer
          const buffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);

          // Create uploads directory
          const uploadsDir = join(process.cwd(), "public", "uploads");
          try {
            mkdirSync(uploadsDir, { recursive: true });
          } catch {
            // Directory might already exist
          }

          // Generate unique filename
          const ext = file.name.split(".").pop() || "jpg";
          const uniqueName = `${randomBytes(8).toString("hex")}-${Date.now()}.${ext}`;
          const filePath = join(uploadsDir, uniqueName);

          // Save file
          writeFileSync(filePath, uint8Array);

          // Return URL path
          const url = `/uploads/${uniqueName}`;
          return Response.json({ url, success: true });
        } catch (error) {
          console.error("Upload error:", error);
          return Response.json(
            { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
          );
        }
      },
    },
  },
});
