import type { Metadata } from "next";
import { PassportTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Passport Photo Maker — 2×2 in and 35×45 mm",
  description:
    "Crop a photo to US 2×2 inch or 35×45 mm passport size at 300 dpi. Browser-only helper, not an official studio.",
  path: "/passport-photo-maker",
});

export default function Page() {
  return (
    <ToolPage
      active="/passport-photo-maker"
      kicker="Make"
      title="Passport photo maker"
      lede="US 2×2 in (600×600) or 35×45 mm, white or custom background. A crop helper — not a guarantee of acceptance."
      faq={[
        {
          q: "Will this pass a passport office?",
          a: "Maybe not. Lighting, expression, and print quality matter. Use this for size, then follow the country’s photo rules.",
        },
        {
          q: "What is 300 dpi here?",
          a: "Pixel counts that print at 2×2 in or 35×45 mm at 300 dpi. The JPEG itself does not embed a DPI tag you can trust everywhere.",
        },
      ]}
    >
      <PassportTool />
    </ToolPage>
  );
}
