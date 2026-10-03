import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/tools";

function absUrl(path: string) {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "ImageResizeLab — free image resizer and photo tools",
} as const;

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absUrl(path);
  // The root layout template does not apply to app/page.tsx (same segment).
  // Pin the homepage title so the brand is in the SERP, once.
  const fullTitle = path === "/" ? `${title} | ${SITE_NAME}` : title;
  return {
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description:
    "Free image resizer, free JPG compressor, PNG compressor, WebP converter, cropper, favicon generator, and other browser photo tools.",
};
