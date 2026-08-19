import type { Metadata } from "next";
import { FilterTool } from "@/components/tools/EditTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Grayscale Image — Black and White Converter",
  description:
    "Convert a photo to grayscale in your browser. Adjust strength and download JPEG, PNG, or WebP.",
  path: "/grayscale-image",
});

export default function Page() {
  return (
    <ToolPage
      active="/grayscale-image"
      kicker="Make"
      title="Grayscale image"
      lede="Black and white with a strength slider. Canvas filter, then a normal download."
      faq={[
        {
          q: "Is this the same as desaturate in Photoshop?",
          a: "Close enough for web. It is the browser grayscale filter, not a lab-grade channel mix.",
        },
        {
          q: "Can I keep one color?",
          a: "Not here. That is a selective-color job for an editor.",
        },
      ]}
    >
      <FilterTool filter="grayscale" label="Grayscale" />
    </ToolPage>
  );
}
