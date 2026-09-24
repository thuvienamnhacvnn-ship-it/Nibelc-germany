import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";
import { ROUTES, type Locale } from "@/content/locales";
import { contactLabel, requestLabel } from "@/content/nav-menu";

/**
 * Thanh hành động dưới màn hình, chỉ có trên điện thoại — kiểu ứng dụng:
 * gọi điện, gửi yêu cầu, nhắn tin. Luôn trong tầm ngón cái, không phải cuộn
 * lên đầu trang tìm nút.
 *
 * Chiều cao thanh được trừ vào đáy trang bằng `--nb-actionbar` (xem
 * globals.css) để không che mất nội dung cuối cùng.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  const tel = LEGAL.phone.replace(/\s/g, "");

  return (
    <nav
      aria-label={contactLabel(locale)}
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-[var(--nb-line)] bg-white/95 px-3 py-2 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={`tel:${tel}`}
        className="flex h-12 flex-1 flex-col items-center justify-center rounded-xl text-[11px] font-semibold text-[#10284d] active:bg-[var(--nb-strip)]"
      >
        <Icon name="phone" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
        {LEGAL.phone.split(" ")[0]}
      </a>

      <Link
        href={ROUTES.request[locale] as Route}
        className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-[var(--nb-orange)] font-semibold text-white active:bg-[var(--nb-orange-dark)]"
      >
        {requestLabel(locale)}
        <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
      </Link>

      <Link
        href={ROUTES.contact[locale] as Route}
        className="flex h-12 flex-1 flex-col items-center justify-center rounded-xl text-[11px] font-semibold text-[#10284d] active:bg-[var(--nb-strip)]"
      >
        <Icon name="mail" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
        {contactLabel(locale)}
      </Link>
    </nav>
  );
}
