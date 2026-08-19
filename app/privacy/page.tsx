import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SeoLink } from "@/components/SeoLink";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description:
    "ImageResizeLab privacy: image tools run in your browser. No accounts. Photos are not uploaded to an ImageResizeLab server.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StaticPage
      kicker="Data"
      title="Privacy"
      lede="No accounts. Photos stay in this tab. Close it and they are gone from the lab."
    >
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
        <p>
          ImageResizeLab does not create accounts and does not ask you to log in.
          Files you drop into a tool are read with the browser File API and
          drawn on a canvas. They are not posted to an ImageResizeLab backend.
        </p>
        <p>
          If you download a result, that new file is saved by your browser to
          wherever you choose. We do not keep a copy. EXIF tags are parsed in
          the tab for the viewer; stripping EXIF means writing a new file
          without those tags.
        </p>
        <h2 className="font-display text-2xl text-[var(--ink)]">Cookies and ads</h2>
        <p>
          This site does not set analytics or advertising cookies today. If ads
          or measurement are added later, this page will be updated to say so.
        </p>
        <h2 className="font-display text-2xl text-[var(--ink)]">Questions</h2>
        <p>
          There is no user database to access or delete. See{" "}
          <SeoLink href="/about">about</SeoLink>,{" "}
          <SeoLink href="/terms">terms of use</SeoLink>, and{" "}
          <SeoLink href="/contact">contact</SeoLink>.
        </p>
      </div>
    </StaticPage>
  );
}
