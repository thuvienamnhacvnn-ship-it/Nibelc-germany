import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";
import { LEGAL_ROUTES, type Locale } from "@/content/locales";
import { mainMenu, contactLabel } from "@/content/nav-menu";

/**
 * Chân trang tối của bộ KIT, tách riêng để các trang tự dựng bố cục (không đi
 * kèm banner khuôn mẫu của SubShell) vẫn dùng được.
 */
export function SubFooter({ locale }: { locale: Locale }) {
  const menu = mainMenu(locale);

  return (
    <footer className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
      <div className="mx-auto grid max-w-[1560px] gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-12 lg:py-16">
        <div>
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} className="h-9 w-auto" />
          <p className="mt-5 max-w-[42ch] text-[14px] leading-[1.7] text-white/55">{LEGAL.name}</p>
          <p className="mt-1 text-[14px] leading-[1.7] text-white/55">
            {LEGAL.street}
            <br />
            {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
          </p>
        </div>

        <nav aria-label="Menu chân trang">
          <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">NIBELC</p>
          <ul className="mt-5 space-y-2.5">
            {menu.map((m) => (
              <li key={m.label}>
                <Link href={m.href as Route} className="text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">{contactLabel(locale)}</p>
          <ul className="mt-5 space-y-3">
            <li>
              <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                <Icon name="phone" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                {LEGAL.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${LEGAL.email}`} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                <Icon name="mail" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                {LEGAL.email}
              </a>
            </li>
            <li>
              <Link href={LEGAL_ROUTES.datenschutz as Route} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                <Icon name="shield" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1560px] px-6 py-5 text-[12.5px] text-white/40 lg:px-12">
          © {new Date().getFullYear()} {LEGAL.name}
        </p>
      </div>
    </footer>

  );
}
