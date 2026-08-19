import type { Metadata } from "next";
import { WatermarkTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Watermark Image — Text Overlay",
  description:
    "Add a text watermark to a photo in your browser. Position, size, opacity, and color. No upload.",
  path: "/watermark-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/watermark-image"
      kicker="Make"
      title="Watermark image"
      lede="Stamp text on a photo — corner or center, with opacity. Not a rights-management system, just a visible mark."
      faq={[
        {
          q: "Can I use a logo file?",
          a: "This version is text only. Composite a logo in an editor, or flatten two images elsewhere.",
        },
        {
          q: "Does a watermark stop theft?",
          a: "No. It marks provenance. Croppers can still cut it off. Use it as a reminder, not a lock.",
        },
      ]}
    >
      <WatermarkTool />
    </ToolPage>
  );
}
