import type { Metadata } from "next";
import { CompressTool } from "@/components/tools/CompressTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Compress Image to Size — Target KB",
  description:
    "Free image compressor that fits a JPEG or WebP into a kilobyte budget. Binary-search quality in your browser. No upload.",
  path: "/compress-image-to-size",
});

export default function Page() {
  return (
    <ToolPage
      active="/compress-image-to-size"
      kicker="Compress"
      title="Compress image to size"
      lede="Type a KB target. The lab walks JPEG or WebP quality until the file fits — or it warns you it cannot."
      faq={[
        {
          q: "Why not PNG?",
          a: "PNG has no quality slider in canvas. Convert to JPEG or WebP first, or shrink dimensions.",
        },
        {
          q: "What if it cannot hit 50 KB?",
          a: "A huge photo has a floor. Resize to a smaller pixel size, then run this tool again.",
        },
      ]}
    >
      <CompressTool allowTarget defaultQuality={0.7} />
    </ToolPage>
  );
}
