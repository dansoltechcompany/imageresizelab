import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "PNG to WebP Converter",
  description:
    "PNG to WebP converter in your browser. Often the best way to shrink a PNG while keeping transparency.",
  path: "/png-to-webp",
});

export default function Page() {
  return (
    <ToolPage
      active="/png-to-webp"
      kicker="Convert"
      title="PNG to WebP Converter"
      lede="The practical PNG compressor for the web. Transparency can remain. File never uploads."
      faq={[
        {
          q: "Will my logo stay sharp?",
          a: "At high quality, usually yes. For tiny icons, compare against the original PNG at 1x and 2x.",
        },
        {
          q: "Can I go back to PNG?",
          a: "Yes — WebP to PNG — but you do not get a bit-identical original if WebP was lossy.",
        },
      ]}
    >
      <ConvertTool accept="image/png,.png" output="image/webp" />
    </ToolPage>
  );
}
