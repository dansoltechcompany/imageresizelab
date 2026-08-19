import type { Metadata } from "next";
import { ConvertTool } from "@/components/tools/ConvertTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "PNG to JPG Converter",
  description:
    "PNG to JPG converter in your browser. Transparent pixels flatten onto a background color you pick. No upload.",
  path: "/png-to-jpg",
});

export default function Page() {
  return (
    <ToolPage
      active="/png-to-jpg"
      kicker="Convert"
      title="PNG to JPG Converter"
      lede="Flatten transparency onto a background, then save JPEG. Photos and screenshots that do not need alpha."
      faq={[
        {
          q: "What happens to transparent pixels?",
          a: "JPEG has no alpha. They are painted with the background color (white by default) before encoding.",
        },
        {
          q: "Should logos be JPEG?",
          a: "Usually no. Sharp edges and type look better as PNG or WebP. Photos are the JPEG use case.",
        },
      ]}
    >
      <ConvertTool accept="image/png,.png" output="image/jpeg" />
    </ToolPage>
  );
}
