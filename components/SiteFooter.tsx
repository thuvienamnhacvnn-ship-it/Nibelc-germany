import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { LEGAL, impressumComplete } from "@/content/legal";
import { LEGAL_ROUTES, ROUTES, type Locale } from "@/content/locales";
import { mainMenu } from "@/content/nav-menu";

/**
 * Chân trang chung cho mọi trang.
 *
 * Liên kết Impressum chỉ xuất hiện khi dữ liệu pháp nhân đã đủ (CẦN ĐIỀN 01),
 * vì §5 TMG đòi Handelsregister, HRB và người đại diện — hiện chưa có.
 */

const WORDS: Record<Locale, { nav: string; legal: string; contact: string; impressum: string; privacy: string; group: string }> = {
  de: { nav: "Navigation", legal: "Rechtliches", contact: "Kontakt", impressum: "Impressum", privacy: "Datenschutz", group: "Teil der NIBELC GROUP" },
  en: { nav: "Navigation", legal: "Legal", contact: "Contact", impressum: "Imprint", privacy: "Privacy", group: "Part of NIBELC GROUP" },
  vi: { nav: "Điều hướng", legal: "Pháp lý", contact: "Liên hệ", impressum: "Thông tin pháp lý", privacy: "Bảo mật dữ liệu", group: "Thuộc NIBELC GROUP" },
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const w = WORDS[locale];
  const menu = mainMenu(locale).filter((m) => m.href !== ROUTES.home[locale]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a2748] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Image src="/nibelc-logo.svg" alt="NIBELC GmbH" width={1201} height={376} className="h-10 w-auto brightness-0 invert" />
          <p className="mt-4 text-sm leading-6 text-white/80">
            NIBELC TalentBridge Deutschland
            <br />
            {w.group}
          </p>
          <a href={LEGAL.groupWebsite} rel="noreferrer noopener" target="_blank" className="mt-3 inline-block text-sm text-white/70 underline hover:text-white">
            nibelcgroup.com.vn
          </a>
        </div>

        <nav aria-label={w.nav}>
          <h2 className="text-sm font-bold text-white">{w.nav}</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {menu.map((m) => (
              <li key={m.href}>
                <Link href={m.href as Route} className="hover:text-white hover:underline">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-white">{w.contact}</h2>
          <address className="mt-4 space-y-3 text-sm text-white/80 not-italic">
            <p>
              {LEGAL.name}
              <br />
              {LEGAL.street}
              <br />
              {LEGAL.postalCode} {LEGAL.city}
              <br />
              {LEGAL.country}
            </p>
            <p className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 shrink-0" strokeWidth={1.7} />
              <a href={`mailto:${LEGAL.email}`} className="hover:text-white hover:underline">
                {LEGAL.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 shrink-0" strokeWidth={1.7} />
              <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="hover:text-white hover:underline">
                {LEGAL.phone}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{w.legal}</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {impressumComplete() && (
              <li>
                <Link href={LEGAL_ROUTES.impressum as Route} className="hover:text-white hover:underline">
                  {w.impressum}
                </Link>
              </li>
            )}
            <li>
              <Link href={LEGAL_ROUTES.datenschutz as Route} className="hover:text-white hover:underline">
                {w.privacy}
              </Link>
            </li>
            <li>
              <Link href={ROUTES.contact[locale] as Route} className="hover:text-white hover:underline">
                {w.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[1400px] px-6 py-5 text-xs text-white/60 lg:px-10">
          © {year} {LEGAL.name}
        </p>
      </div>
    </footer>
  );
}
