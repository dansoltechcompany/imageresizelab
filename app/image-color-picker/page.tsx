import type { Metadata } from "next";
import { ColorPickerTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Image Color Picker — Hex and RGB from a Pixel",
  description:
    "Click a photo to copy the pixel color as hex or RGB. Runs in your browser, no upload.",
  path: "/image-color-picker",
});

export default function Page() {
  return (
    <ToolPage
      active="/image-color-picker"
      kicker="Inspect"
      title="Image color picker"
      lede="Drop a photo, click a pixel, copy hex. Sampling happens on an in-memory canvas."
      faq={[
        {
          q: "Why doesn’t the color match my design tool?",
          a: "Color profiles are not applied. You get the decoded RGB the browser paints, which is enough for most web work.",
        },
        {
          q: "Can I pick from a screenshot of a UI?",
          a: "Yes. PNG screenshots work. Click the preview, then copy hex into CSS.",
        },
      ]}
    >
      <ColorPickerTool />
    </ToolPage>
  );
}
