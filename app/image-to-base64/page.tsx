import type { Metadata } from "next";
import { Base64EncodeTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Image to Base64 — Data URI Encoder",
  description:
    "Encode an image to Base64 or a data URI in your browser. Copy for CSS, HTML, or JSON. No upload.",
  path: "/image-to-base64",
});

export default function Page() {
  return (
    <ToolPage
      active="/image-to-base64"
      kicker="Encode"
      title="Image to Base64"
      lede="Drop an icon or small photo. Copy a data URI or raw Base64. Large photos will bloat HTML."
      faq={[
        {
          q: "Should I inline a hero photo as Base64?",
          a: "No. Data URIs skip caching and inflate HTML. This is for tiny icons and email-sized assets.",
        },
        {
          q: "Is the string the original bytes?",
          a: "Yes for this page — it encodes the file you dropped, it does not re-compress first.",
        },
      ]}
    >
      <Base64EncodeTool />
    </ToolPage>
  );
}
