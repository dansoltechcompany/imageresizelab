import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "JPG to WebP Converter",
  description:
    "JPG to WebP converter in your browser. Quality slider, no upload. Often smaller than the original JPEG.",
  path: "/jpg-to-webp",
});

export default function Page() {
  return (
    <ToolPage
      active="/jpg-to-webp"
      kicker="Convert"
      title="JPG to WebP Converter"
      lede="Re-encode a JPEG as WebP. Same photo, usually a smaller file for websites."
      faq={[
        {
          q: "Is this lossless?",
          a: "No. Both JPEG and lossy WebP discard data. Use a high quality setting if you are archiving.",
        },
        {
          q: "Safari support?",
          a: "Safari has supported WebP since 14. Older iOS may still need JPEG fallbacks.",
        },
      ]}
    >
      <ConvertTool accept="image/jpeg,image/jpg,.jpg,.jpeg" output="image/webp" />
    </ToolPage>
  );
}
