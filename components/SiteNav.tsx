"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_GROUPS } from "@/lib/tools";

export function SiteNav({ active }: { active?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="hidden items-center gap-0.5 xl:flex">
        {NAV_GROUPS.map((group) => (
          <NavMenu key={group.label} group={group} active={active} />
        ))}
      </nav>
      <button
        type="button"
        className="rounded-lg border border-[var(--rule)] px-3.5 py-2 text-sm font-semibold text-[var(--ink)] xl:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        Menu
      </button>
      {mobileOpen ? (
        <div className="absolute left-0 right-0 top-full max-h-[70vh] overflow-auto border-b border-[var(--rule)] bg-[var(--paper)] px-4 py-3 shadow-[var(--shadow)] xl:hidden">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="border-b border-[var(--rule)] py-2 last:border-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                {group.label}
              </p>
              <div className="mt-1 grid gap-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-md px-2 py-1.5 text-sm ${
                      active === item.href
                        ? "bg-[var(--ink)] text-white"
                        : "text-[var(--ink)] hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function NavMenu({
  group,
  active,
}: {
  group: (typeof NAV_GROUPS)[number];
  active?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const on = group.items.some((item) => item.href === active);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div
      className="relative"
      ref={wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
          on || open
            ? "text-[var(--magenta)]"
            : "text-[var(--ink)]/75 hover:text-[var(--ink)]"
        }`}
      >
        {group.label}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 pt-2">
          <div className="min-w-56 overflow-hidden rounded-xl border border-[var(--rule)] bg-white py-1.5 shadow-[var(--shadow)]">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3.5 py-2 text-sm ${
                  active === item.href
                    ? "bg-[var(--paper)] text-[var(--magenta)]"
                    : "text-[var(--ink)] hover:bg-[var(--paper)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
