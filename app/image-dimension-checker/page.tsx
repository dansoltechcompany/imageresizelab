import type { Metadata } from "next";
import { DimensionTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Image Dimension Checker — Width, Height, Size",
  description:
    "Check image width, height, megapixels, aspect ratio, type, and file size in your browser. Nothing is uploaded or resized.",
  path: "/image-dimension-checker",
});

export default function Page() {
  return (
    <ToolPage
      active="/image-dimension-checker"
      kicker="Inspect"
      title="Image dimension checker"
      lede="Drop a file. Read pixels, megapixels, aspect, MIME type, and bytes. No export unless you switch tools."
      faq={[
        {
          q: "Is this EXIF width or pixel width?",
          a: "Decoded pixel width and height from the image itself. Camera tags are on the EXIF viewer.",
        },
        {
          q: "Are screenshots PNG?",
          a: "Often. The type row shows the MIME the browser reports for the file you dropped.",
        },
      ]}
    >
      <DimensionTool />
    </ToolPage>
  );
}
