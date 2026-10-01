import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuDay } from "@/components/layout/MenuDay";
import { PageFade, PageTransition } from "@/components/layout/PageTransition";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://nibelc-germany.de"),
  title: {
    default: "NIBELC GROUP GERMANY — Việc làm & Du học nghề tại Đức",
    template: "%s · NIBELC GROUP",
  },
  description:
    "Nền tảng tuyển dụng và du học nghề tại Đức của NIBELC GROUP GERMANY: đơn hàng đang tuyển, chương trình Ausbildung, lộ trình hồ sơ và visa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${tieuDeHero.variable} ${display.variable}`}>
      <body>
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[110] focus:rounded-lg focus:bg-[var(--nb-gold)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[var(--nb-navy-900)]"
        >
          Tới nội dung
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
      </body>
    </html>
  );
}
