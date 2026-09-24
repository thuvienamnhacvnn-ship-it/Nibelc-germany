import Link from "next/link";
import type { Route } from "next";
import { LEGAL, impressumComplete } from "@/content/legal";
import { LEGAL_ROUTES, ROUTES, type Locale } from "@/content/locales";
import { contactLabel } from "@/content/nav-menu";

/**
 * Dải pháp lý mảnh ở cuối các trang KHÔNG phải "Über uns".
 *
 * Chân trang đầy đủ chỉ còn ở trang Über uns. Nhưng luật Đức đòi trang bảo mật
 * dữ liệu phải với tới được từ mọi trang, nên mỗi trang vẫn giữ một dòng gọn
 * gồm: tên pháp nhân, Datenschutz và Kontakt (Impressum sẽ tự hiện khi CẦN
 * ĐIỀN 01 đủ dữ liệu).
 */

const PRIVACY: Record<Locale, string> = {
  de: "Datenschutz",
  en: "Privacy",
  vi: "Bảo mật dữ liệu",
};

export function LegalStrip({ locale }: { locale: Locale }) {
  return (
    <div className="border-t border-[var(--nb-line)] bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-5 text-xs text-[var(--nb-muted)] lg:justify-between lg:px-10">
        <p>
          © {new Date().getFullYear()} {LEGAL.name}
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {impressumComplete() && (
            <Link href={LEGAL_ROUTES.impressum as Route} className="hover:text-[var(--nb-ink)] hover:underline">
              Impressum
            </Link>
          )}
          <Link href={LEGAL_ROUTES.datenschutz as Route} className="hover:text-[var(--nb-ink)] hover:underline">
            {PRIVACY[locale]}
          </Link>
          <Link href={ROUTES.contact[locale] as Route} className="hover:text-[var(--nb-ink)] hover:underline">
            {contactLabel(locale)}
          </Link>
          <Link href={ROUTES.about[locale] as Route} className="hover:text-[var(--nb-ink)] hover:underline">
            {ABOUT[locale]}
          </Link>
        </p>
      </div>
    </div>
  );
}

const ABOUT: Record<Locale, string> = {
  de: "Über uns",
  en: "About us",
  vi: "Về chúng tôi",
};
