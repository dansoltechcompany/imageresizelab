import Link from "next/link";
import { ALL_TOOLS } from "@/lib/tools";
import { SiteNav } from "@/components/SiteNav";

function Mark() {
  return (
    <span className="grid size-9 place-items-center rounded-lg bg-[var(--magenta)] text-white shadow-[0_8px_18px_-10px_rgba(225,29,116,0.9)]">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M3 6V3h3M12 3h3v3M15 12v3h-3M6 15H3v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="5.5" y="5.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--rule)] bg-[rgba(250,244,238,0.88)] backdrop-blur-md">
      <div className="h-0.5 bg-[linear-gradient(90deg,#e11d74,#f5a524)]" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="ImageResizeLab home">
          <Mark />
          <span className="font-display text-lg leading-none text-[var(--ink)] sm:text-[1.35rem]">
            ImageResize<span className="text-[var(--magenta)]">Lab</span>
          </span>
        </Link>
        <SiteNav active={active} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[var(--deep)] text-[#e8d5cc]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-white">ImageResizeLab</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Browser photo tools. Resize first, then compress, convert, crop, and
            inspect — files never leave this device.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--amber)]">
            Tools
          </p>
          <ul className="mt-3 columns-2 gap-8 text-sm text-white/80">
            {ALL_TOOLS.map((tool) => (
              <li key={tool.href} className="mb-1.5">
                <Link href={tool.href} className="hover:text-white">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-white/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--amber)]">
            Notes
          </p>
          <p className="mt-3 leading-relaxed">
            Processing uses the Canvas API in your tab. No accounts. Not affiliated
            with Adobe, Google, or Apple.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-white/90">
            <Link href="/about" className="hover:text-[var(--amber)]">
              About
            </Link>
            <Link href="/privacy" className="hover:text-[var(--amber)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--amber)]">
              Terms of use
            </Link>
            <Link href="/contact" className="hover:text-[var(--amber)]">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
