import type { Metadata } from "next";
import { CropTool } from "@/components/tools/CropTool";
import { ToolPage } from "@/components/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Profile Picture Resizer — 400×400 and 800×800",
  description:
    "Crop a square avatar and export 400×400 or 800×800. Browser-only profile picture resizer.",
  path: "/profile-picture-resizer",
});

export default function Page() {
  return (
    <ToolPage
      active="/profile-picture-resizer"
      kicker="Resize"
      title="Profile picture resizer"
      lede="Square crop, then 400×400 output — large enough for most avatars. Use round image if you need a circle PNG."
      faq={[
        {
          q: "What size should I use?",
          a: "400×400 covers most chat and social avatars. Export 800×800 if the platform shows a retina crop.",
        },
        {
          q: "LinkedIn vs Instagram?",
          a: "Both want squares for profile photos. Feed posts use the social media resizer instead.",
        },
      ]}
    >
      <CropTool lockedAspect={1} outSizes={[400, 800]} filenameSuffix="avatar" />
    </ToolPage>
  );
}
