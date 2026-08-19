import type { Metadata } from "next";
import { ExifTool } from "@/components/tools/InspectTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "EXIF Viewer — Camera, Date, GPS",
  description:
    "Read JPEG EXIF in your browser: camera make, date, orientation, GPS. The file is not uploaded.",
  path: "/exif-viewer",
});

export default function Page() {
  return (
    <ToolPage
      active="/exif-viewer"
      kicker="Inspect"
      title="EXIF viewer"
      lede="JPEG only. See camera, timestamp, orientation, and GPS if the file still has APP1 metadata."
      faq={[
        {
          q: "Why is the table empty?",
          a: "Many messaging apps strip EXIF. Screenshots and most PNGs never had it. Only JPEGs from cameras and some phones keep tags.",
        },
        {
          q: "Is GPS shown exactly?",
          a: "Latitude and longitude are converted from GPS rationals. Treat them as approximate, then strip tags before you share.",
        },
      ]}
    >
      <ExifTool />
    </ToolPage>
  );
}
