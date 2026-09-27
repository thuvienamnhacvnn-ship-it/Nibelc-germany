import type { Locale } from "@/content/locales";

/**
 * CHỮ CỦA BANNER TRANG CHỦ ("sân khấu đơn hàng") — dựng theo hai ảnh mẫu
 * Sếp gửi 27/09/2026 (`E:\Works\itw\Hub mini`, bản desktop 1672×941 và bản
 * điện thoại 941×1672).
 *
 * Bản mẫu viết bằng tiếng Việt. Web chạy ba thứ tiếng nên chữ ở đây có cả ba;
 * bố cục, cỡ chữ và vị trí thì giữ nguyên theo mẫu.
 *
 * Số liệu trên thẻ KHÔNG nằm ở đây: thẻ đọc thẳng từ `content/jobs-current.ts`
 * (số suất, mức lương, nơi làm việc, giờ/tuần) nên không có chỗ nào bịa số.
 */

export interface StageCopy {
  eyebrow: string;
  /** Hai dòng tiêu đề lớn, dòng dưới là dòng được tô vàng đậm hơn */
  title: [string, string];
  /** Hai dòng phụ đề dưới tiêu đề */
  sub: [string, string];
  cta: string;
  detail: string;
  allJobs: string;
  prev: string;
  next: string;
  pause: string;
  play: string;
  /** Nhãn ba ô số liệu trong thẻ */
  facts: [string, string, string];
  perMonth: string;
  country: string;
  /** Ô tìm kiếm ở bản điện thoại */
  searchCountry: string;
  searchField: string;
  search: string;
  /** Dải hành trình ở bản điện thoại */
  journey: [string, string];
  journeySub: string;
  /** Dải năm ô dưới cùng bản desktop */
  strip: [string, string][];
}

export const STAGE: Record<Locale, StageCopy> = {
  de: {
    eyebrow: "ARBEITEN IN EUROPA",
    title: ["In Deutschland", "und Europa"],
    sub: ["Vietnamesische Fachkräfte und", "geprüfte Betriebe zusammenbringen"],
    cta: "Offene Stellen ansehen",
    detail: "Details ansehen",
    allJobs: "Alle Stellenangebote",
    prev: "Vorheriger Auftrag",
    next: "Nächster Auftrag",
    pause: "Wechsel anhalten",
    play: "Wechsel fortsetzen",
    facts: ["Plätze", "Std./Woche", "Einsatzorte"],
    perMonth: "/ Monat",
    country: "Deutschland",
    searchCountry: "Land",
    searchField: "Branche",
    search: "Suchen",
    journey: ["Ihr Weg nach", "Deutschland und Europa"],
    journeySub: "Jede Etappe erklärt",
    strip: [
      ["Viele Berufsfelder", "Breites Angebot"],
      ["Mehrere Länder", "Deutschland, Griechenland, Albanien, Litauen"],
      ["Geprüfte Betriebe", "Verlässliche Partner"],
      ["Begleitung im ganzen Ablauf", "Von der Bewerbung bis zur Ausreise"],
      ["Beratung 1:1", "Vietnamesisch – Deutsch"],
    ],
  },
  en: {
    eyebrow: "WORKING IN EUROPE",
    title: ["In Germany", "and Europe"],
    sub: ["Connecting Vietnamese workers", "with trusted employers"],
    cta: "Browse open positions",
    detail: "View details",
    allJobs: "All openings",
    prev: "Previous assignment",
    next: "Next assignment",
    pause: "Pause rotation",
    play: "Resume rotation",
    facts: ["Places", "Hrs/week", "Locations"],
    perMonth: "/ month",
    country: "Germany",
    searchCountry: "Country",
    searchField: "Industry",
    search: "Search",
    journey: ["Your path to", "Germany and Europe"],
    journeySub: "Every stage explained",
    strip: [
      ["Many job families", "A broad choice"],
      ["Several countries", "Germany, Greece, Albania, Lithuania"],
      ["Vetted employers", "Reliable partners"],
      ["Support end to end", "From application to departure"],
      ["1:1 guidance", "Vietnamese – German"],
    ],
  },
  vi: {
    eyebrow: "CƠ HỘI VIỆC LÀM",
    title: ["Tại Đức", "và Châu Âu"],
    sub: ["Kết nối lao động Việt Nam", "với doanh nghiệp uy tín"],
    cta: "Khám phá các đơn hàng",
    detail: "Xem chi tiết",
    allJobs: "Tất cả đơn hàng",
    prev: "Đơn hàng trước",
    next: "Đơn hàng sau",
    pause: "Dừng tự chuyển",
    play: "Chạy tiếp",
    facts: ["Chỉ tiêu", "Giờ/tuần", "Nơi làm việc"],
    perMonth: "/ tháng",
    country: "Đức",
    searchCountry: "Quốc gia",
    searchField: "Ngành nghề",
    search: "Tìm kiếm",
    journey: ["Hành trình làm việc", "tại Đức và Châu Âu"],
    journeySub: "Bắt đầu tương lai tốt đẹp hơn",
    strip: [
      ["Nhiều ngành nghề", "Cơ hội đa dạng"],
      ["Quốc gia phong phú", "Đức, Hy Lạp, Albania, Litva"],
      ["Doanh nghiệp uy tín", "Đối tác tin cậy"],
      ["Hỗ trợ toàn diện", "Từ hồ sơ đến xuất cảnh"],
      ["Tư vấn 1:1", "Tiếng Việt – Tiếng Đức"],
    ],
  },
};
