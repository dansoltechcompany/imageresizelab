import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SeoLink } from "@/components/SeoLink";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About ImageResizeLab",
  description:
    "ImageResizeLab is a free browser lab: image resizer, JPG compressor, PNG compressor, WebP converter, cropper, and favicon generator. Photos never upload.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage
      kicker="The lab"
      title="About ImageResizeLab"
      lede="Photo tools that run in your browser. Same canvas, different jobs."
    >
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
        <p>
          ImageResizeLab is a free image toolkit. The front door is the{" "}
          <SeoLink href="/">image resizer</SeoLink>. Around it:{" "}
          <SeoLink href="/jpg-compressor">JPG compressor</SeoLink>, format
          converters, croppers, an EXIF viewer, and a favicon generator.
        </p>
        <p>
          Every tool uses the Canvas API in your tab. There is no ImageResizeLab
          server that stores photos, and there is no account system. PNG
          “compression” is honest about browser limits — we would rather send
          you to WebP than pretend we are TinyPNG.
        </p>
        <p>
          How files are handled is on <SeoLink href="/privacy">privacy</SeoLink>.
          The rules are on <SeoLink href="/terms">terms of use</SeoLink>. How to
          reach us is on <SeoLink href="/contact">contact</SeoLink>.
        </p>
      </div>
    </StaticPage>
  );
}
