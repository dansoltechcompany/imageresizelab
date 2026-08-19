import type { Metadata } from "next";
import { CompressTool } from "@/components/tools/CompressTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free PNG Compressor — Shrink PNG or Convert Format",
  description:
    "Free PNG compressor in the browser. Reduce dimensions or convert PNG to WebP or JPEG. Honest about what canvas cannot do.",
  path: "/png-compressor",
});

export default function Page() {
  return (
    <ToolPage
      active="/png-compressor"
      kicker="Compress"
      title="Free PNG compressor"
      lede="Canvas cannot TinyPNG a file. Shrink by converting to WebP or JPEG, or keep PNG and lower the pixel count."
      faq={[
        {
          q: "Why didn’t my PNG get much smaller?",
          a: "The browser PNG encoder is not a lossless optimizer. Switch output to WebP or JPEG, or resize the image first.",
        },
        {
          q: "Will I lose transparency?",
          a: "JPEG yes — pick a background color on PNG to JPG. WebP can keep alpha in browsers that support it.",
        },
      ]}
      related={[
        { href: "/png-to-webp", title: "PNG to WebP", blurb: "The usual win for web PNGs." },
        { href: "/png-to-jpg", title: "PNG to JPG", blurb: "Flatten onto a background." },
        { href: "/jpg-compressor", title: "JPG compressor", blurb: "Photos without alpha." },
      ]}
    >
      <CompressTool accept="image/png,.png" defaultQuality={0.8} defaultFormat="image/webp" />
    </ToolPage>
  );
}
