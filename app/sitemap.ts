import type { MetadataRoute } from "next";
import { ALL_TOOLS, SITE_URL } from "@/lib/tools";

export const dynamic = "force-static";

function loc(path: string) {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...new Set(["/", "/about", "/privacy", "/terms", "/contact", ...ALL_TOOLS.map((tool) => tool.href)])];
  return paths.map((path) => ({
    url: loc(path),
    lastModified: "2026-10-03",
    changeFrequency: "weekly" as const,
    priority:
      path === "/"
        ? 1
        : path === "/about" || path === "/privacy" || path === "/terms" || path === "/contact"
          ? 0.4
          : 0.8,
  }));
}
