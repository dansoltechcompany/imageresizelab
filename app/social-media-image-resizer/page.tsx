import type { Metadata } from "next";
import { SocialTool } from "@/components/tools/MakeTools";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Social Media Image Resizer — Instagram, YouTube, LinkedIn",
  description:
    "Resize photos for Instagram, YouTube, Facebook, X, LinkedIn, Pinterest, and TikTok. Cover-crop in your browser, no upload.",
  path: "/social-media-image-resizer",
});

export default function Page() {
  return (
    <ToolPage
      active="/social-media-image-resizer"
      kicker="Resize"
      title="Social media image resizer"
      lede="Pick a preset. The photo is cover-cropped to that frame so it is not stretched."
      faq={[
        {
          q: "Will the edges get cut off?",
          a: "Cover-crop fills the frame, so extra on the long side is trimmed. Use the image cropper if you need to choose the cut.",
        },
        {
          q: "Are these official platform sizes?",
          a: "They are the common pixel sizes those networks recommend. Platforms change specs; check if a launch is critical.",
        },
      ]}
    >
      <SocialTool />
    </ToolPage>
  );
}
