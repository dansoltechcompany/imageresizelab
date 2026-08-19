import type { Metadata } from "next";
import { CropTool } from "@/components/tools/CropTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Round Image — Circle Crop PNG",
  description:
    "Circle-crop a photo to a transparent PNG in your browser. No upload. For avatars and stickers.",
  path: "/round-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/round-image"
      kicker="Make"
      title="Round image"
      lede="Clip to a circle and download a transparent PNG. Drag to choose which part of the photo sits in the disc."
      faq={[
        {
          q: "Why PNG?",
          a: "JPEG cannot store transparent corners. The circle would sit on a white box.",
        },
        {
          q: "Can I pick the diameter?",
          a: "The crop box sets it. Resize after if you need a specific pixel size.",
        },
      ]}
    >
      <CropTool circle lockedAspect={1} filenameSuffix="round" />
    </ToolPage>
  );
}
