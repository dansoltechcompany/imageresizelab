import type { Metadata } from "next";
import { CompressTool } from "@/components/tools/CompressTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free JPG Compressor — Shrink JPEG in Your Browser",
  description:
    "Free JPG compressor and free image compressor in your browser. Re-encode JPEG with a quality slider. Preview the new file size. Nothing uploads.",
  path: "/jpg-compressor",
});

export default function Page() {
  return (
    <ToolPage
      active="/jpg-compressor"
      kicker="Compress"
      title="Free JPG compressor"
      lede="Quality slider, live preview, download a smaller JPEG. A free image compressor — the original never leaves this tab."
      faq={[
        {
          q: "Will compressing JPEG make it look worse?",
          a: "Yes, below a point. JPEG is lossy. Stay near 70–85% for web photos; drop lower only when size matters more than edges.",
        },
        {
          q: "Is this the same as TinyJPG?",
          a: "No. TinyJPG uses server-side encoders. This page uses the browser’s JPEG encoder. It is private and good enough for most web use.",
        },
      ]}
      related={[
        { href: "/compress-image-to-size", title: "Compress to size", blurb: "Hit a kilobyte budget." },
        { href: "/png-compressor", title: "PNG compressor", blurb: "When the file is PNG, not JPEG." },
        { href: "/webp-converter", title: "WebP converter", blurb: "Often smaller than JPEG." },
      ]}
    >
      <CompressTool forceFormat="image/jpeg" accept="image/jpeg,image/jpg,.jpg,.jpeg" />
    </ToolPage>
  );
}
