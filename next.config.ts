import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  agentRules: false,
  async redirects() {
    return [
      { source: "/image-resizer", destination: "/", permanent: true },
      { source: "/image-resizer/", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
