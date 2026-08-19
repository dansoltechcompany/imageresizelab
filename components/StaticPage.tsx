import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export function StaticPage({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <div className="page-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <p className="eyebrow">{kicker}</p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-[2.6rem]">{title}</h1>
          {lede ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{lede}</p>
          ) : null}
        </div>
      </div>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 text-[var(--muted)]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
