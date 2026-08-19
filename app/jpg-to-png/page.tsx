import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "JPG to PNG Converter",
  description:
    "JPG to PNG converter in your browser. JPEG artifacts stay; you get a PNG container. No upload.",
  path: "/jpg-to-png",
});

export default function Page() {
  return (
    <ToolPage
      active="/jpg-to-png"
      kicker="Convert"
      title="JPG to PNG Converter"
      lede="Wrap a JPEG in a PNG. Useful when a tool refuses JPEG — it does not restore lost detail."
      faq={[
        {
          q: "Will JPG to PNG fix compression artifacts?",
          a: "No. The pixels are already quantized. PNG only stores them losslessly from this point on.",
        },
        {
          q: "Is the PNG larger?",
          a: "Often yes. PNG is a poor container for photographs. Use it when you need the format, not for smaller files.",
        },
      ]}
    >
      <ConvertTool accept="image/jpeg,image/jpg,.jpg,.jpeg" output="image/png" />
    </ToolPage>
  );
}
