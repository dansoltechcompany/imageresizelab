import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SeoLink } from "@/components/SeoLink";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "ImageResizeLab has no accounts and no support inbox yet. Image tools run in your browser.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage
      kicker="Reach us"
      title="Contact"
      lede="No accounts, no ticket form. The tools run in your browser."
    >
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
        <p>
          ImageResizeLab is a set of client-side image tools. There is no login and
          no support inbox attached to this site yet. If a file will not decode,
          try another format page or a different browser — Safari, Chrome, and
          Firefox all implement canvas slightly differently (WebP especially).
        </p>
        <p>
          How data is handled is on <SeoLink href="/privacy">privacy</SeoLink>.
          The rules for using the tools are on{" "}
          <SeoLink href="/terms">terms of use</SeoLink>. What the lab is is on{" "}
          <SeoLink href="/about">about</SeoLink>.
        </p>
      </div>
    </StaticPage>
  );
}
