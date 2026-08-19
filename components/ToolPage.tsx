import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { ALL_TOOLS, SITE_NAME, SITE_URL } from "@/lib/tools";
import { ToolSeo, toolSeoLinks } from "@/components/ToolSeo";

export function ToolPage({
  active,
  kicker,
  title,
  lede,
  children,
  faq,
  related,
}: {
  active: string;
  kicker: string;
  title: string;
  lede: ReactNode;
  children: ReactNode;
  faq?: { q: string; a: string }[];
  related?: { href: string; title: string; blurb: string }[];
}) {
  const used = new Set([active, ...toolSeoLinks(active)]);
  const relatedCards = (related ?? []).filter((item) => !used.has(item.href));
  const extra = ALL_TOOLS.filter(
    (tool) => !used.has(tool.href) && !relatedCards.some((item) => item.href === tool.href),
  ).map((tool) => ({ href: tool.href, title: tool.title, blurb: tool.blurb }));
  const uniqueRelated = [...relatedCards, ...extra].slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: SITE_NAME,
              item: `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: `${SITE_URL}${active === "/" ? "" : active}/`,
            },
          ],
        }}
      />
      {faq ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
      ) : null}
      <SiteHeader active={active} />
      <div className="page-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <p className="eyebrow">{kicker}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl text-white sm:text-[2.6rem] sm:leading-[1.08]">
            {title}
          </h1>
          <div className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {lede}
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
        <ToolSeo path={active} />
        {faq ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl">{title} FAQ</h2>
            <dl className="mt-5 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {faq.map((item) => (
                <div key={item.q} className="py-5">
                  <dt className="font-medium text-[var(--ink)]">{item.q}</dt>
                  <dd className="mt-1.5 text-[var(--muted)]">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
        {uniqueRelated.length ? (
          <section className="mt-14">
            <h2 className="font-display text-3xl">Related image tools</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {uniqueRelated.map((item) => (
                <Link key={item.href} href={item.href} className="panel rounded-2xl p-5">
                  <p className="font-display text-lg">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
