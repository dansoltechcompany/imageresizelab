import type { Metadata } from "next";
import { SvgToPngTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "SVG to PNG Converter",
  description:
    "SVG to PNG converter in your browser. Rasterize at a width you choose. Fonts and remote images inside the SVG may not render.",
  path: "/svg-to-png",
});

export default function Page() {
  return (
    <ToolPage
      active="/svg-to-png"
      kicker="Convert"
      title="SVG to PNG Converter"
      lede="Pick an output width. The SVG is drawn on a canvas and saved as PNG."
      faq={[
        {
          q: "Why is my text missing?",
          a: "SVG files that rely on fonts not installed on this device, or on network images, often render incomplete in a canvas.",
        },
        {
          q: "Can I pick height instead?",
          a: "Set width; height follows the SVG aspect. Then crop or resize if you need a specific frame.",
        },
      ]}
    >
      <SvgToPngTool />
    </ToolPage>
  );
}
