import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SITE_JSON_LD } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imageresizelab.com"),
  title: {
    default: "Free Image Resizer, JPG Compressor & Photo Tools | ImageResizeLab",
    template: "%s | ImageResizeLab",
  },
  description:
    "Free image resizer, free JPG compressor, PNG compressor, WebP converter, cropper, favicon generator, and other photo tools. Files stay in your browser.",
  openGraph: {
    siteName: "ImageResizeLab",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ImageResizeLab — free image resizer and photo tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "p:domain_verify": "dd08d2d64554947d24b9c7bc9cbcae2d",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={SITE_JSON_LD} />
        {children}
      </body>
    </html>
  );
}
