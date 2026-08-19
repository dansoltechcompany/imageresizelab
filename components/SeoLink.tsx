import type { ReactNode } from "react";
import Link from "next/link";

export function SeoLink({
  href,
  children,
  tone = "ink",
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "hero";
}) {
  const className =
    tone === "hero"
      ? "font-semibold text-[#f5a524] underline underline-offset-2"
      : "seo-link";
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
