"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { mainMenu } from "@/content/nav-menu";
import { LOCALES, type Locale } from "@/content/locales";

/**
 * Menu cho điện thoại. Trước đây nav chỉ hiện từ 1024px trở lên, nghĩa là
 * trên điện thoại web KHÔNG có menu nào — đây là bản vá cho chỗ đó.
 */
export function MobileMenu({
  locale,
  navy,
  langHrefs,
  cta,
}: {
  locale: Locale;
  navy?: boolean;
  langHrefs: Record<Locale, string>;
  cta?: { label: string; href: string };
}) {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const menu = mainMenu(locale);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Menü"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-10 items-center justify-center rounded-md ${navy ? "text-white" : "text-[var(--nb-ink)]"}`}
      >
        <Icon name={open ? "close" : "burger"} className="h-6 w-6" strokeWidth={2} />
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 top-16 z-50 overflow-y-auto bg-white px-4 pb-10 text-[var(--nb-ink)]">
          {cta && (
            <Link
              href={cta.href as Route}
              onClick={() => setOpen(false)}
              className="mt-4 mb-2 flex items-center justify-center gap-2 rounded-lg bg-[var(--nb-orange)] px-5 py-3 font-semibold text-white"
            >
              {cta.label}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          )}

          <nav aria-label="Hauptnavigation">
            <ul className="divide-y divide-[var(--nb-line)]">
              {menu.map((m) => (
                <li key={m.label} className="py-1">
                  <div className="flex items-center">
                    <Link href={m.href as Route} onClick={() => setOpen(false)} className="flex-1 py-3 font-semibold">
                      {m.label}
                    </Link>
                    {m.children && (
                      <button
                        type="button"
                        aria-label={m.label}
                        aria-expanded={sub === m.label}
                        onClick={() => setSub(sub === m.label ? null : m.label)}
                        className="p-3 text-[var(--nb-muted)]"
                      >
                        <Icon name="chevronDown" className={`h-5 w-5 transition ${sub === m.label ? "rotate-180" : ""}`} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                  {m.children && sub === m.label && (
                    <ul className="pb-3 pl-3">
                      {m.children.map((c) => (
                        <li key={c.label + c.href}>
                          <Link href={c.href as Route} onClick={() => setOpen(false)} className="block py-2 text-sm">
                            {c.label}
                            {c.desc && <span className="block text-xs text-[var(--nb-muted)]">{c.desc}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-6 flex gap-2">
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href={langHrefs[l] as Route}
                  hrefLang={l}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md border px-4 py-2 text-sm ${
                    l === locale ? "border-[var(--nb-blue-dark)] font-bold text-[var(--nb-blue-dark)]" : "border-[var(--nb-line)]"
                  }`}
                >
                  {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                </Link>
              </li>
            ))}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
