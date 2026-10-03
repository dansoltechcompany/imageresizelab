import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: { absolute: "Page not found | ImageResizeLab" },
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", title: "Image resizer" },
  { href: "/jpg-compressor", title: "JPG compressor" },
  { href: "/png-to-jpg", title: "PNG to JPG" },
  { href: "/webp-converter", title: "WebP converter" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="page-hero">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl text-white">
            That page is not in the studio.
          </h1>
          <p className="mt-3 max-w-xl text-white/75">
            The URL does not match a tool. Head home, or open a compressor or
            converter.
          </p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-primary px-5 py-2.5">
            Home
          </Link>
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[10px] border border-[var(--rule)] bg-white px-5 py-2.5 font-semibold text-[var(--ink)]"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
