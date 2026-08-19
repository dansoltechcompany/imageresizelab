import type { Metadata } from "next";
import { FilterTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blur Image — Soft Focus in the Browser",
  description:
    "Blur a photo for backgrounds or privacy. Adjust strength and download JPEG, PNG, or WebP. No upload.",
  path: "/blur-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/blur-image"
      kicker="Make"
      title="Blur image"
      lede="Soft-focus a photo. Strong blur on huge images can be slow — the work is still local."
      faq={[
        {
          q: "Is this Gaussian blur?",
          a: "It uses the browser canvas blur filter, which is Gaussian-like. Fine for backgrounds, not a forensics tool.",
        },
        {
          q: "Will blur hide a face for GDPR?",
          a: "Heavy blur helps. Cropping the person out is safer. Do not rely on light blur.",
        },
      ]}
    >
      <FilterTool filter="blur" label="Blur" />
    </ToolPage>
  );
}
