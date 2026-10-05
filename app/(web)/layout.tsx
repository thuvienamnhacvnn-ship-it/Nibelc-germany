import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DinhBanner } from "@/components/layout/DinhBanner";
import { MenuDay } from "@/components/layout/MenuDay";
import { PageFade, PageTransition } from "@/components/layout/PageTransition";
import { LANGS, LOCALE, SITE_URL, urlDayDu } from "@/lib/i18n/config";
import { getLang, getPath } from "@/lib/i18n/server";
import { demKho } from "@/data/nguon";
import { LangProvider } from "@/lib/i18n/client";
import { t } from "@/lib/i18n/dict";
import { common } from "@/lib/i18n/dict/common";

/**
 * KHUNG WEB CÔNG KHAI — header, chân trang, menu đáy, hiệu ứng chuyển trang.
 * Trang quản trị KHÔNG đi qua đây (nó nằm ngoài route group này).
 */

/**
 * Metadata gốc theo ngôn ngữ của request (proxy.ts gắn x-nb-lang / x-nb-path).
 *
 * canonical + hreflang tính ở ĐÂY cho mọi trang: trang con chỉ khai title /
 * description, KHÔNG tự khai `alternates` (khai ở trang là đè mất bộ này).
 */
export async function generateMetadata(): Promise<Metadata> {
  const [lang, path] = await Promise.all([getLang(), getPath()]);
  const tx = t(common, lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: tx.meta.tieuDe,
      template: "%s · NIBELC GROUP",
    },
    description: tx.meta.moTa,
    alternates: {
      canonical: urlDayDu(path, lang),
      languages: {
        vi: urlDayDu(path, "vi"),
        en: urlDayDu(path, "en"),
        de: urlDayDu(path, "de"),
        "x-default": urlDayDu(path, "vi"),
      },
    },
    openGraph: {
      locale: LOCALE[lang].replace("-", "_"),
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LOCALE[l].replace("-", "_")),
    },
  };
}

export default async function KhungWeb({ children }: Readonly<{ children: React.ReactNode }>) {
  const [lang, dem] = await Promise.all([getLang(), demKho()]);
  const tx = t(common, lang);
  return (    <>
        <LangProvider lang={lang}>
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[110] focus:rounded-lg focus:bg-[var(--nb-gold)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[var(--nb-navy-900)]"
        >
          {tx.toiNoiDung}
        </a>

        <PageTransition>
          <Header />
          {/* KHÔNG chừa chỗ cho header ở đây: hero trang chủ phải chạy full
              viewport và header nằm đè lên nó. Trang phụ tự chừa bằng lớp
              .nb-duoi-header. */}
          {/* `relative` để hai nút ở đỉnh banner neo được vào đây.
              Đặt DinhBanner ở ĐÂY chứ không trong Hero/PageHero: ba trang
              (/lien-he, chi tiết đơn hàng, chi tiết bài cẩm nang) không có
              banner nào cả, để trong banner thì đúng ba trang đó mất sạch
              đường vào menu — mà menu đáy lại chỉ chứa nổi năm mục.
              Nằm NGOÀI PageFade nên lúc chuyển trang hai nút đứng yên thay vì
              nhấp nháy theo nội dung. */}
          <main id="noi-dung" className="relative">
            <DinhBanner dem={dem} />
            <PageFade>{children}</PageFade>
          </main>
          <Footer />
          <MenuDay />
        </PageTransition>
        </LangProvider>    </>
  );
}
