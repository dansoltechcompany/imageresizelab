import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "WebP Converter — JPG, PNG, or GIF to WebP",
  description:
    "Free WebP converter. Turn JPEG, PNG, or GIF into WebP in your browser. Quality slider, no upload.",
  path: "/webp-converter",
});

export default function Page() {
  return (
    <ToolPage
      active="/webp-converter"
      kicker="Convert"
      title="WebP Converter"
      lede="Drop JPEG, PNG, GIF, or BMP. Download a WebP. Smaller files for the modern web."
      faq={[
        {
          q: "Does every browser open WebP?",
          a: "Current Chrome, Edge, Firefox, and Safari do. Some old email clients and printers do not — use WebP to JPG for those.",
        },
        {
          q: "Is WebP always smaller than JPEG?",
          a: "Usually at a similar look, not as a law. Preview the size on this page before you replace a library of photos.",
        },
      ]}
      related={[
        { href: "/jpg-to-webp", title: "JPG to WebP", blurb: "JPEG-only entry." },
        { href: "/png-to-webp", title: "PNG to WebP", blurb: "Keep transparency when you can." },
        { href: "/webp-to-jpg", title: "WebP to JPG", blurb: "When a site refuses WebP." },
      ]}
    >
      <ConvertTool
        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
        output="image/webp"
        hint="Any common raster in. WebP out. File stays in this tab."
      />
    </ToolPage>
  );
}
