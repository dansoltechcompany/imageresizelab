import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "WebP to PNG Converter",
  description:
    "WebP to PNG converter in your browser. Keeps transparency. Useful when an editor still wants PNG.",
  path: "/webp-to-png",
});

export default function Page() {
  return (
    <ToolPage
      active="/webp-to-png"
      kicker="Convert"
      title="WebP to PNG Converter"
      lede="Write a PNG from a WebP. Transparency is kept. Editors and printers that refuse WebP."
      faq={[
        {
          q: "Is the PNG larger?",
          a: "Often. PNG is the interchange format, not the delivery format. Compress again if you publish it.",
        },
        {
          q: "Animated WebP?",
          a: "This page rasterizes a still frame. It is not a GIF animator.",
        },
      ]}
    >
      <ConvertTool accept="image/webp,.webp" output="image/png" />
    </ToolPage>
  );
}
