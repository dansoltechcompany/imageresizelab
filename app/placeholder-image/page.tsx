import type { Metadata } from "next";
import { PlaceholderTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Placeholder Image Generator",
  description:
    "Generate a placeholder PNG by width, height, and color. No upload. For mockups and layout tests.",
  path: "/placeholder-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/placeholder-image"
      kicker="Make"
      title="Placeholder image"
      lede="Pick width, height, and colors. Download a PNG with the size printed on it — or your own label."
      faq={[
        {
          q: "Is this like placeholder.com?",
          a: "Same job, generated in your tab instead of a remote URL. Useful when you cannot hotlink a service.",
        },
        {
          q: "Can I use it in production?",
          a: "For mockups and tests. Real product shots belong on the resizer and compressor.",
        },
      ]}
    >
      <PlaceholderTool />
    </ToolPage>
  );
}
