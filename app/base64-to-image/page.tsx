import type { Metadata } from "next";
import { Base64DecodeTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Base64 to Image — Paste and Download",
  description:
    "Paste a Base64 string or data URI and download the image. Decodes in your browser.",
  path: "/base64-to-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/base64-to-image"
      kicker="Decode"
      title="Base64 to image"
      lede="Paste a data URI or naked Base64. Preview, then download. Nothing is sent to a server."
      faq={[
        {
          q: "Whitespace in the string?",
          a: "Newlines are stripped. If decode still fails, you probably lost the header or truncated the payload.",
        },
        {
          q: "What filename do I get?",
          a: "decoded-image. Your browser may add an extension from the MIME type.",
        },
      ]}
    >
      <Base64DecodeTool />
    </ToolPage>
  );
}
