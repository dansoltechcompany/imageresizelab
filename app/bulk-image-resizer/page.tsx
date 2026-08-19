import type { Metadata } from "next";
import { BulkResizeTool } from "@/components/tools/MakeTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Bulk Image Resizer — Many Files, One Zip",
  description:
    "Resize a batch of photos to one longest-side size and download a zip. All processing stays in your browser.",
  path: "/bulk-image-resizer",
});

export default function Page() {
  return (
    <ToolPage
      active="/bulk-image-resizer"
      kicker="Resize"
      title="Bulk image resizer"
      lede="Drop many files. Cap the longest side. Download a zip. Huge batches can strain RAM — keep it reasonable."
      faq={[
        {
          q: "Is there a file limit?",
          a: "The browser’s memory is the limit. Dozens of large photos can freeze a tab. Split big folders.",
        },
        {
          q: "Do originals get overwritten?",
          a: "No. You download new files in a zip. The originals stay where you picked them from.",
        },
      ]}
    >
      <BulkResizeTool />
    </ToolPage>
  );
}
