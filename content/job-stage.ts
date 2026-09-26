import type { Locale } from "@/content/locales";

/**
 * Chữ cho "sân khấu đơn hàng" ở trang chủ và trang chi tiết đơn hàng.
 * Chỉ là nhãn giao diện — mọi số liệu vẫn đọc từ `content/jobs-current.ts`.
 */
export const STAGE: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    open: string;
    detail: string;
    all: string;
    prev: string;
    next: string;
    pause: string;
    play: string;
    ofLabel: (i: number, n: number) => string;
    back: string;
    related: string;
    country: string;
  }
> = {
  de: {
    eyebrow: "Aktuell im Einsatz",
    title: "Diese Stellen besetzen wir gerade",
    lead: "Laufende Aufträge unserer Partnerbetriebe — mit Plätzen, Einsatzort und Konditionen aus der jeweiligen Ausschreibung.",
    open: "Offene Plätze",
    detail: "Stelle ansehen",
    all: "Alle Stellen",
    prev: "Vorherige Stelle",
    next: "Nächste Stelle",
    pause: "Automatischen Wechsel anhalten",
    play: "Automatisch weiterblättern",
    ofLabel: (i, n) => `${i} von ${n}`,
    back: "Zurück zu allen Stellen",
    related: "Weitere offene Stellen",
    country: "Deutschland",
  },
  en: {
    eyebrow: "Currently hiring",
    title: "Positions we are filling right now",
    lead: "Live assignments at our partner companies — places, location and terms straight from each posting.",
    open: "Open places",
    detail: "View position",
    all: "All positions",
    prev: "Previous position",
    next: "Next position",
    pause: "Pause auto-rotation",
    play: "Resume auto-rotation",
    ofLabel: (i, n) => `${i} of ${n}`,
    back: "Back to all positions",
    related: "More open positions",
    country: "Germany",
  },
  vi: {
    eyebrow: "Đơn hàng đang chạy",
    title: "Các đơn hàng đang tuyển",
    lead: "Đơn hàng đang chạy tại doanh nghiệp đối tác — số suất, nơi làm việc và điều kiện theo từng tin tuyển dụng.",
    open: "Số suất",
    detail: "Xem đơn hàng",
    all: "Tất cả đơn hàng",
    prev: "Đơn trước",
    next: "Đơn sau",
    pause: "Dừng tự chuyển",
    play: "Tự chuyển tiếp",
    ofLabel: (i, n) => `${i} / ${n}`,
    back: "Về tất cả đơn hàng",
    related: "Các đơn hàng khác",
    country: "Đức",
  },
};
