import type { Metadata } from "next";
import { StripExifTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Remove EXIF — Strip Photo Metadata",
  description:
    "Remove EXIF and GPS from a photo by re-encoding in your browser. Download a clean JPEG, PNG, or WebP.",
  path: "/remove-exif",
});

export default function Page() {
  return (
    <ToolPage
      active="/remove-exif"
      kicker="Inspect"
      title="Remove EXIF"
      lede="Re-encode so camera and GPS tags are not copied into the new file. Preview tags first on the EXIF viewer."
      faq={[
        {
          q: "Is this lossless?",
          a: "No. Canvas export writes new pixels. Use high JPEG quality if you care about the photo, not a bit-identical file.",
        },
        {
          q: "Does PNG have EXIF?",
          a: "Rarely. Re-encoding still drops other ancillary chunks the browser does not round-trip.",
        },
      ]}
    >
      <StripExifTool />
    </ToolPage>
  );
}
