import type { Metadata } from "next";
import { BorderTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Add Image Border — Solid Frame",
  description:
    "Add a solid color border around a photo. Choose thickness and color. Download JPEG, PNG, or WebP from your browser.",
  path: "/add-image-border",
});

export default function Page() {
  return (
    <ToolPage
      active="/add-image-border"
      kicker="Make"
      title="Add image border"
      lede="Expand the canvas by a thickness you pick and fill the new strip with a color."
      faq={[
        {
          q: "Is the border inside or outside?",
          a: "Outside. Original pixels stay the same size; the file grows by twice the thickness on each axis.",
        },
        {
          q: "Rounded corners?",
          a: "Not on this page. Use Round image for a circle, or crop first.",
        },
      ]}
    >
      <BorderTool />
    </ToolPage>
  );
}
