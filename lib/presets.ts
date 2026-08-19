export type SocialPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  group: string;
};

export const SOCIAL_PRESETS: SocialPreset[] = [
  { id: "ig-post", label: "Instagram post", width: 1080, height: 1080, group: "Instagram" },
  { id: "ig-portrait", label: "Instagram portrait", width: 1080, height: 1350, group: "Instagram" },
  { id: "ig-story", label: "Instagram story / Reel", width: 1080, height: 1920, group: "Instagram" },
  { id: "ig-landscape", label: "Instagram landscape", width: 1080, height: 566, group: "Instagram" },
  { id: "yt-thumb", label: "YouTube thumbnail", width: 1280, height: 720, group: "YouTube" },
  { id: "yt-art", label: "YouTube channel art", width: 2560, height: 1440, group: "YouTube" },
  { id: "x-post", label: "X / Twitter post", width: 1600, height: 900, group: "X" },
  { id: "x-header", label: "X / Twitter header", width: 1500, height: 500, group: "X" },
  { id: "fb-post", label: "Facebook post", width: 1200, height: 630, group: "Facebook" },
  { id: "fb-cover", label: "Facebook cover", width: 820, height: 312, group: "Facebook" },
  { id: "li-post", label: "LinkedIn post", width: 1200, height: 627, group: "LinkedIn" },
  { id: "li-banner", label: "LinkedIn banner", width: 1584, height: 396, group: "LinkedIn" },
  { id: "pin", label: "Pinterest pin", width: 1000, height: 1500, group: "Pinterest" },
  { id: "tiktok", label: "TikTok / Shorts", width: 1080, height: 1920, group: "TikTok" },
  { id: "og", label: "Open Graph / link preview", width: 1200, height: 630, group: "Web" },
  { id: "whatsapp", label: "WhatsApp avatar", width: 500, height: 500, group: "Chat" },
];

export const FAVICON_SIZES = [16, 32, 48, 180, 192, 512] as const;
