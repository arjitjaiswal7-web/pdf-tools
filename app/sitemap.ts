import type { MetadataRoute } from "next";

const BASE_URL = "https://tools.thesaasbook.com";

/*
  Add new routes here when new tools go live.
  Sitemap auto-updates on each deployment.
*/

const routes = [
  {
    path: "/pdf-tools",
    priority: 1,
  },
  {
    path: "/pdf-tools/merge-pdf",
    priority: 0.9,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}