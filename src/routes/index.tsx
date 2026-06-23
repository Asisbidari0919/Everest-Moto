import { createFileRoute } from "@tanstack/react-router";

import { EverestHome } from "../components/travel/EverestHome";
import { apiRequest } from "@/lib/api";
import type { SiteContent } from "@/types/content";

export const Route = createFileRoute("/")({
  loader: () => apiRequest<SiteContent>("/api/content"),
  head: () => ({
    meta: [
      { title: "Everest Moto Tours & Travels | Nepal Tours" },
      {
        name: "description",
        content:
          "Premium Nepal trekking, motorcycle rentals, helicopter tours, jungle safaris and luxury Himalayan travel packages.",
      },
      { property: "og:title", content: "Everest Moto Tours & Travels | Nepal Tours" },
      {
        property: "og:description",
        content:
          "Explore Nepal beyond limits with luxury treks, bike adventures, helicopter tours and custom holidays.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  return <EverestHome content={content} />;
}
