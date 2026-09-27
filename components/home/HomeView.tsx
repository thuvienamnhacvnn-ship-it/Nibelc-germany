import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { StageDesktop } from "@/components/home/stage/StageDesktop";
import { StageMobile } from "@/components/home/stage/StageMobile";
import { HOME, ROUTES, type Locale } from "@/content/locales";

/**
 * Trang 01 — screens/01-homepage.png. Bố cục bị khoá.
 *
 * Số đo (px ảnh mẫu = 1 --u):
 *   header 0–101 · hero 101–768 (667u) · dải 4 ô 768–941 (173u)
 *   chữ cách mép trái 50u · mảng navy chéo 668u (trên) → 622u (dưới)
 *   H1 cỡ ~79u, khoảng dòng 77u, đỉnh dòng 1 ở y=237 (136u vào hero)
 *   phụ đề ~24u, khoảng dòng 34u · nút cao 69u, bo 12u
 *   4 huy hiệu vòng cung tâm (997,128) (1088,213) (1160,328) (1222,439)
 */

const ICONS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="m9.5 14 2 2 3.5-3.8" /></>,
  plane: <path d="M10.5 3.5a1.5 1.5 0 0 1 3 0v6l7.5 4.2v2.3l-7.5-2.2v4.4l2.5 1.8v1.7L12 20.6l-4 1.1v-1.7l2.5-1.8v-4.4L3 16v-2.3l7.5-4.2Z" />,
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 11.5a3 3 0 1 0-1.8-5.4M18.5 20a5.5 5.5 0 0 0-3-4.9" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.5 7.5 9.5 4.4-1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12.2 2.3 2.3 4.3-4.6" /></>,
  scale: <><path d="M12 4v16M7 20h10M5 8h14" /><path d="m5 8-3 6a3 3 0 0 0 6 0Zm14 0-3 6a3 3 0 0 0 6 0Z" /></>,
  group: <><circle cx="12" cy="7" r="2.8" /><circle cx="5.5" cy="9" r="2.3" /><circle cx="18.5" cy="9" r="2.3" /><path d="M7 20v-2a5 5 0 0 1 10 0v2M1.5 19v-1.2a4 4 0 0 1 5-3.8M22.5 19v-1.2a4 4 0 0 0-5-3.8" /></>,
  hands: <path d="m2 11 4-4 4 3 3-2 3 1 6 5-4 4-3-2-3 3-3-3-3 1-2-3Zm8 3 3 3M13 12l3 3" />,
};

function Svg({ d, cls }: { d: React.ReactNode; cls: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  );
}

/** Tâm 4 huy hiệu theo toạ độ hero (y đã trừ 101 của header) */
const ARC_POINTS = [
  { x: 997, y: 128, icon: ICONS.search },
  { x: 1088, y: 213, icon: ICONS.doc },
  { x: 1160, y: 328, icon: ICONS.plane },
  { x: 1222, y: 439, icon: ICONS.people },
];


/** Bốn chặng trên vòng cung dẫn tới trang tương ứng. */
const ARC_LINKS: ((l: Locale) => string)[] = [
  (l) => ROUTES.industries[l],
  (l) => ROUTES.process[l],
  (l) => ROUTES.process[l],
  (l) => ROUTES.knowledge[l],
];

export function HomeView({ locale }: { locale: Locale }) {

  return (
    <>
      <SiteHeader locale={locale} page="home" variant="stage" />

      <main id="inhalt">
        {/* ---------------- BANNER: SÂN KHẤU ĐƠN HÀNG ---------------- */}
        <StageDesktop locale={locale} />
        <StageMobile locale={locale} />

      </main>
      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page={"home"} />
    </>
  );
}
