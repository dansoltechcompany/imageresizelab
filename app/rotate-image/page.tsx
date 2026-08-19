import type { Metadata } from "next";
import { RotateTool } from "@/components/tools/MakeTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Rotate Image — 90°, 180°, Flip",
  description:
    "Rotate a photo 90°, 180°, or 270°, and flip horizontal or vertical. Download JPEG, PNG, or WebP from your browser.",
  path: "/rotate-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/rotate-image"
      kicker="Make"
      title="Rotate image"
      lede="Quarter turns and mirrors. The new file bakes the pixels so EXIF orientation is not required."
      faq={[
        {
          q: "My phone photo looks sideways until I rotate?",
          a: "Some JPEGs store rotation in EXIF only. This tool writes upright pixels. Pair with Remove EXIF if you are sharing.",
        },
        {
          q: "Arbitrary angles?",
          a: "Not on this page. 90° steps cover scanners, phones, and screenshots.",
        },
      ]}
    >
      <RotateTool />
    </ToolPage>
  );
}
