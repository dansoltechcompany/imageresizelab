import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SeoLink } from "@/components/SeoLink";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "ImageResizeLab terms of use: free browser photo tools, no accounts, files stay on your device. Read the rules before you use the lab.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Terms of use"
      lede="These terms govern your use of ImageResizeLab. Using a tool means you accept them."
    >
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
        <p>
          ImageResizeLab (“the lab”, “we”) is a set of free, browser-based photo
          tools at this website. There is no account. By opening or using a
          tool, you agree to these terms. If you do not agree, do not use the
          site.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">What the lab is</h2>
        <p>
          The tools resize, compress, convert, crop, inspect, and generate
          images in your browser using the Canvas API. Files you drop are not
          uploaded to an ImageResizeLab server. How that works in more detail is
          on <SeoLink href="/privacy">privacy</SeoLink>. What the product is
          for is on <SeoLink href="/about">about</SeoLink>.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">Your files and your rights</h2>
        <p>
          You must only process images you have the right to use. You are
          responsible for copyright, publicity, and privacy in those files, and
          for any file you download and share afterward. Do not use the lab for
          unlawful content. We do not review your photos because we never
          receive them.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">No professional guarantee</h2>
        <p>
          Output is produced by your browser’s image encoder. Quality, color,
          EXIF stripping, passport-photo crops, favicon sizes, and social
          presets are helpers — not a studio, not a print shop, and not
          acceptance by a government, app store, or social network. Always
          check the result before you publish or submit it.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">Availability and changes</h2>
        <p>
          The site is provided as-is, when it is up. Tools, copy, and these
          terms may change without notice. A later visit is use under the terms
          then posted. We may add advertising or measurement later;{" "}
          <SeoLink href="/privacy">privacy</SeoLink> will say so if that happens.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">Disclaimer and liability</h2>
        <p>
          The lab is offered without warranties of any kind, including fitness
          for a particular purpose or that encoding will succeed in every
          browser. To the fullest extent allowed by law, ImageResizeLab and its
          operators are not liable for lost files, metadata that remains in a
          download, a platform rejecting an export, or any indirect or
          consequential loss from using these tools. Your only remedy is to stop
          using the site.
        </p>

        <h2 className="font-display text-2xl text-[var(--ink)]">Contact</h2>
        <p>
          There is no support inbox yet. See{" "}
          <SeoLink href="/contact">contact</SeoLink>. These terms were last
          updated 19 August 2026.
        </p>
      </div>
    </StaticPage>
  );
}
