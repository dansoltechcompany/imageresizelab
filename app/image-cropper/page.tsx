import type { Metadata } from "next";
import { CropTool } from "@/components/tools/CropTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Image Cropper — Free, 1:1, 4:3, 16:9",
  description:
    "Crop an image in your browser. Freehand or lock 1:1, 4:3, 16:9, 9:16. Download JPEG, PNG, or WebP. No upload.",
  path: "/image-cropper",
});

export default function Page() {
  return (
    <ToolPage
      active="/image-cropper"
      kicker="Crop"
      title="Image cropper"
      lede="Drag the box, lock an aspect if you want, download the cut. File stays in this tab."
      faq={[
        {
          q: "Can I crop to a circle?",
          a: "Use Round image for a transparent PNG circle. This page is rectangular crops.",
        },
        {
          q: "Does crop reduce file size?",
          a: "Usually, because fewer pixels remain. Pair with the JPG compressor if you still need a smaller file.",
        },
      ]}
    >
      <CropTool />
    </ToolPage>
  );
}
