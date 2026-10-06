import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/i18n/config";
import { getLang } from "@/lib/i18n/server";

/**
 * KHUNG GỐC — chỉ dựng <html> và <body>, nạp phông và biến CSS.
 *
 * Header, Footer, menu đáy và hiệu ứng chuyển trang KHÔNG nằm ở đây mà ở
 * `app/(web)/layout.tsx`. Lý do: trang quản trị /admin cũng đi qua khung
 * gốc, mà nó không được mang header của web công khai — để chung thì thanh
 * menu navy đè lên form đăng nhập, đúng lỗi nhìn thấy khi dựng xong chặng 1.
 *
 * `(web)` là route group: có dấu ngoặc nên KHÔNG xuất hiện trong đường dẫn —
 * trang chủ vẫn là "/", không phải "/web".
 */

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

/** Chỉ phần dùng chung. Tiêu đề, mô tả và hreflang theo ngôn ngữ ở (web). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function KhungGoc({ children }: Readonly<{ children: React.ReactNode }>) {
  /* Trang quản trị không đi qua bộ định tuyến ngôn ngữ nên không có header
     x-nb-lang; getLang() trả "vi", đúng cho cả hai nhánh. */
  const lang = await getLang();
  return (
    <html lang={lang} className={`${inter.variable} ${tieuDeHero.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
