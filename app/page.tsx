import type { Metadata } from "next";
import Link from "next/link";
import { ResizeTool } from "@/components/tools/ResizeTool";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { ToolSeo } from "@/components/ToolSeo";
import { ALL_TOOLS } from "@/lib/tools";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free Image Resizer, JPG Compressor & Photo Tools",
  description:
    "Free image resizer in your browser. Also a free JPG compressor, PNG compressor, WebP converter, cropper, and EXIF viewer. Photos never upload.",
  path: "/",
});

const FAQ = [
  {
    q: "Does this image resizer upload my photo?",
    a: "No. The file is read in your browser and redrawn on a canvas. Close the tab and ImageResizeLab does not keep it.",
  },
  {
    q: "Can I resize without stretching?",
    a: "Yes. Keep aspect ratio locked, or set a longest-side cap so both dimensions scale together.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <SiteHeader active="/" />
      <section className="page-hero">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-12 lg:pb-32 lg:pt-16">
          <p className="eyebrow">No upload · No account</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.6rem] leading-[1.05] text-white sm:text-5xl lg:text-[3.4rem]">
            Free Image Resizer
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Resize any photo without sending it to a server. Pixels, percent,
            or longest side — then compress, convert, or crop in the same
            studio. JPEG, PNG, and WebP stay in this tab.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#resizer" className="btn-primary px-5 py-2.5">
              Resize a photo
            </a>
            <Link
              href="/jpg-compressor"
              className="rounded-[10px] bg-white px-5 py-2.5 font-semibold text-[var(--plum)] hover:bg-[var(--cream)]"
            >
              Compress a JPG
            </Link>
          </div>
        </div>
      </section>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <div id="resizer" className="-mt-20 lg:-mt-24">
          <ResizeTool />
        </div>
        <ToolSeo path="/" />
        <section className="mt-16">
          <h2 className="font-display text-3xl">Free image resizer FAQ</h2>
          <dl className="mt-5 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="font-medium text-[var(--ink)]">{item.q}</dt>
                <dd className="mt-1.5 text-[var(--muted)]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="mt-16 max-w-2xl text-[var(--muted)]">
          <h2 className="font-display text-3xl text-[var(--ink)]">
            A studio of compressors, converters, and croppers
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base">
            ImageResizeLab is a free photo workshop. The front door resizes by
            pixels, percent, or longest side. Around it: JPEG and PNG compression,
            WebP conversion, social crops, EXIF, and favicons — no account.
          </p>
        </section>
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl sm:text-4xl">All tools</h2>
            <p className="hidden max-w-sm text-right text-sm text-[var(--muted)] sm:block">
              Same canvas family. Different jobs. Land on the page you searched for.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_TOOLS.filter((tool) => tool.href !== "/").map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="panel group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-[var(--magenta)]/25"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                  {tool.tag}
                </span>
                <p className="mt-2 font-display text-xl text-[var(--ink)] group-hover:text-[var(--magenta)]">
                  {tool.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{tool.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-16 mb-4 grid gap-8 rounded-2xl bg-[var(--ink)] px-6 py-8 text-white/75 sm:grid-cols-2 sm:px-8">
          <div>
            <h2 className="font-display text-3xl text-white">Why files stay in the tab</h2>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">
              Upload-based image tools are a privacy problem. ImageResizeLab uses
              the Canvas API locally. Close the tab and the photo is gone. PNG
              compression is honest: the browser cannot match TinyPNG lossless
              quantization, so we offer WebP instead of pretending.
            </p>
          </div>
          <ul className="grid content-center gap-3 text-sm">
            <li className="rounded-xl bg-white/6 px-4 py-3">No account. No queue.</li>
            <li className="rounded-xl bg-white/6 px-4 py-3">JPEG, PNG, WebP, SVG in.</li>
            <li className="rounded-xl bg-white/6 px-4 py-3">Download stays on your disk.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
