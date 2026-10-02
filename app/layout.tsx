import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuDay } from "@/components/layout/MenuDay";
import { PageFade, PageTransition } from "@/components/layout/PageTransition";
import { LANGS, LOCALE, SITE_URL, urlDayDu } from "@/lib/i18n/config";
import { getLang, getPath } from "@/lib/i18n/server";
import { LangProvider } from "@/lib/i18n/client";
import { t } from "@/lib/i18n/dict";
import { common } from "@/lib/i18n/dict/common";

/**
 * Hai kiểu chữ theo prompt mục 02: serif cao cấp cho tiêu đề hero, sans hiện
 * đại cho giao diện. Cả hai đều phải có subset "vietnamese", nếu không dấu
 * tiếng Việt rơi sang font dự phòng và tiêu đề nhìn lệch hẳn.
 */
const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Cụm tiêu đề hero dùng Montserrat 800/900 — ảnh mẫu Sếp gửi là chữ KHÔNG
 * CHÂN rất đậm, không phải serif. Dùng Playfair cho cụm đó thì nhìn lệch hẳn
 * khỏi mẫu ngay từ nét chữ.
 */
const tieuDeHero = Montserrat({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-hero",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  const tx = t(common, lang);
  return (
    <html lang={lang} className={`${inter.variable} ${tieuDeHero.variable} ${display.variable}`}>
      <body>
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
          <main id="noi-dung">
            <PageFade>{children}</PageFade>
          </main>
          <Footer />
          <MenuDay />
        </PageTransition>
        </LangProvider>
      </body>
    </html>
  );
}
