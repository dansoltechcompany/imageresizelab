import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "WebP to JPG Converter",
  description:
    "WebP to JPG converter in your browser when a site, printer, or email client will not accept WebP.",
  path: "/webp-to-jpg",
});

export default function Page() {
  return (
    <ToolPage
      active="/webp-to-jpg"
      kicker="Convert"
      title="WebP to JPG Converter"
      lede="Decode WebP locally and write a JPEG. Pick a background if the WebP had transparency."
      faq={[
        {
          q: "Why convert away from WebP?",
          a: "Older printers, some CMS fields, and a few email clients still want JPEG or PNG only.",
        },
        {
          q: "Can I keep transparency?",
          a: "Not in JPEG. Use WebP to PNG instead.",
        },
      ]}
    >
      <ConvertTool accept="image/webp,.webp" output="image/jpeg" />
    </ToolPage>
  );
}
