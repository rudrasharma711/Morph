import type { MetadataRoute } from "next";

const SITE_URL = "https://morph-pearl.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/team"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-06-08"),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
