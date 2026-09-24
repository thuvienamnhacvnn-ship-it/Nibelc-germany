import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  // Cần cho canonical và OG ra URL tuyệt đối.
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "vi-VN": "/vi/nguoi-lao-dong",
    },
  },
  description:
    "Internationale Fachkräfte für den deutschen Arbeitsmarkt — von der Vorauswahl über Anerkennung und Visum bis zur Integration im Betrieb.",
  // Structured data pháp nhân chỉ được thêm khi muc CAN DIEN 01 đã duyệt.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Mặc định là tiếng Đức. Các khối tiếng Việt tự khai lang="vi" tại chỗ
    // để trình đọc màn hình đọc đúng giọng.
    <html lang="de" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-[var(--radius-btn)] focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--color-navy-950)]"
        >
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
