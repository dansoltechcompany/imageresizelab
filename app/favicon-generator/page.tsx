import type { Metadata } from "next";
import { FaviconTool } from "@/components/tools/MakeTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Favicon Generator — ICO and PNG Sizes",
  description:
    "Generate favicon.ico plus 16, 32, 48, 180, 192, and 512 PNG from one image. Runs in your browser. Download a zip.",
  path: "/favicon-generator",
});

export default function Page() {
  return (
    <ToolPage
      active="/favicon-generator"
      kicker="Make"
      title="Favicon generator"
      lede="Center-crops to a square, then writes ICO (16–48) and PNG (16–512). Download one zip."
      faq={[
        {
          q: "What sizes are in the zip?",
          a: "favicon.ico plus favicon-16.png through favicon-512.png, including 180 (Apple touch) and 192 (Android).",
        },
        {
          q: "Does it need to be square already?",
          a: "Helpful, not required. Non-square sources are cover-cropped from the center.",
        },
      ]}
    >
      <FaviconTool />
    </ToolPage>
  );
}
