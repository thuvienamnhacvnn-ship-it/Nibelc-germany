/**
 * Ba ngôn ngữ: Đức (mặc định, route gốc theo DESIGN LOCK), Anh (/en), Việt (/vi).
 * Bố cục sáu trang bị khoá; chỉ chữ đổi theo ngôn ngữ.
 * Tên nghề tiếng Đức giữ nguyên ở mọi ngôn ngữ — khớp hợp đồng và hồ sơ cư trú.
 */

export const LOCALES = ["de", "en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  vi: "VI",
};

export type PageKey =
  | "home"
  | "employers"
  | "candidates"
  | "industries"
  | "process"
  | "about"
  | "services"
  | "knowledge"
  | "contact"
  | "request"
  | "agent";

/** Đường dẫn từng trang theo ngôn ngữ. Route tiếng Đức là route bị khoá. */
export const ROUTES: Record<PageKey, Record<Locale, string>> = {
  home: { de: "/", en: "/en", vi: "/vi" },
  employers: {
    de: "/fuer-unternehmen",
    en: "/en/employers",
    vi: "/vi/doanh-nghiep",
  },
  candidates: {
    de: "/fuer-bewerber",
    en: "/en/candidates",
    vi: "/vi/nguoi-lao-dong",
  },
  industries: { de: "/branchen", en: "/en/industries", vi: "/vi/nganh-nghe" },
  process: { de: "/prozess", en: "/en/process", vi: "/vi/lo-trinh" },
  about: { de: "/ueber-uns", en: "/en/about", vi: "/vi/ve-chung-toi" },
  services: { de: "/leistungen", en: "/en/services", vi: "/vi/dich-vu" },
  knowledge: { de: "/wissen", en: "/en/knowledge", vi: "/vi/kien-thuc" },
  contact: { de: "/kontakt", en: "/en/contact", vi: "/vi/lien-he" },
  request: {
    de: "/personalbedarf",
    en: "/en/staffing-request",
    vi: "/vi/nhu-cau-nhan-su",
  },
  // Màn hình nội bộ (bản trình bày), không index — xem components/agent.
  agent: { de: "/agent-center", en: "/agent-center", vi: "/agent-center" },
};

/** Trang chỉ tồn tại bằng tiếng Đức vì là nghĩa vụ pháp lý tại Đức. */
export const LEGAL_ROUTES = {
  impressum: "/impressum",
  datenschutz: "/datenschutz",
} as const;

export function industryPath(locale: Locale, slug: string): string {
  return `${ROUTES.industries[locale]}/${slug}`;
}

/** Chữ dùng chung cho header */
export const NAV: Record<
  Locale,
  {
    employers: string;
    candidates: string;
    industries: string;
    process: string;
    integration: string;
    knowledge: string;
    login: string;
    agent: string;
    search: string;
  }
> = {
  de: {
    employers: "Für Arbeitgeber",
    candidates: "Fachkräfte",
    industries: "Branchen",
    process: "Prozess",
    integration: "Integration",
    knowledge: "Wissen",
    login: "Login",
    agent: "NIBELC Agent fragen",
    search: "Suche",
  },
  en: {
    employers: "For Employers",
    candidates: "Candidates",
    industries: "Industries",
    process: "Process",
    integration: "Integration",
    knowledge: "Knowledge",
    login: "Login",
    agent: "Ask NIBELC Agent",
    search: "Search",
  },
  vi: {
    employers: "Doanh nghiệp",
    candidates: "Người lao động",
    industries: "Ngành nghề",
    process: "Lộ trình",
    integration: "Hội nhập",
    knowledge: "Kiến thức",
    login: "Đăng nhập",
    agent: "Hỏi NIBELC Agent",
    search: "Tìm kiếm",
  },
};

/** Trang 01 — screens/01-homepage.png */
export const HOME: Record<
  Locale,
  {
    eyebrow: string;
    h1a: string;
    h1b: string;
    h1accent: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    arc: [string, string][];
    strip: [string, string][];
  }
> = {
  de: {
    eyebrow: "Globale Talente. Starke Zukunft.",
    h1a: "Internationale",
    h1b: "Fachkräfte.",
    h1accent: "Sicher integriert",
    sub: "Von der Vorauswahl über Anerkennung und Visum bis zum erfolgreichen Arbeitsstart in Deutschland.",
    ctaPrimary: "Personalbedarf melden",
    ctaSecondary: "Beratung vereinbaren",
    arc: [
      ["Talente", "finden"],
      ["Qualifikationen", "prüfen"],
      ["Einreise", "begleiten"],
      ["Erfolgreich", "starten"],
    ],
    // Ô 2 và 3 của mẫu chứa khẳng định pháp lý và con số chưa xác minh;
    // giữ nguyên bố cục bốn ô, bỏ phần khẳng định (policy CẦN ĐIỀN 05).
    strip: [
      ["DSGVO-konform", "Ihre Daten in sicheren Händen"],
      ["§ 18b AufenthG", "Klarer rechtlicher Rahmen"],
      ["Partnerinstitutionen", "Universitäten, Kammern, Netzwerke"],
      ["End-to-End Begleitung", "Ein Partner. Alle Schritte."],
    ],
  },
  en: {
    eyebrow: "Global talent. Strong future.",
    h1a: "International",
    h1b: "skilled workers.",
    h1accent: "Safely integrated",
    sub: "From pre-selection through recognition and visa to a successful start at work in Germany.",
    ctaPrimary: "Report staffing needs",
    ctaSecondary: "Book a consultation",
    arc: [
      ["Find", "talent"],
      ["Check", "qualifications"],
      ["Support", "the arrival"],
      ["Start", "successfully"],
    ],
    strip: [
      ["GDPR compliant", "Your data in safe hands"],
      ["§ 18b AufenthG", "A clear legal framework"],
      ["Partner institutions", "Universities, chambers, networks"],
      ["End-to-end support", "One partner. Every step."],
    ],
  },
  vi: {
    eyebrow: "Nhân tài toàn cầu. Tương lai vững chắc.",
    h1a: "Nhân lực",
    h1b: "quốc tế.",
    h1accent: "Hội nhập an toàn",
    sub: "Từ sơ tuyển, công nhận bằng cấp và visa đến ngày bắt đầu làm việc thành công tại Đức.",
    ctaPrimary: "Gửi nhu cầu nhân sự",
    ctaSecondary: "Đặt lịch tư vấn",
    arc: [
      ["Tìm", "nhân tài"],
      ["Kiểm tra", "bằng cấp"],
      ["Đồng hành", "nhập cảnh"],
      ["Khởi đầu", "thành công"],
    ],
    strip: [
      ["Tuân thủ GDPR", "Dữ liệu của bạn được bảo vệ"],
      ["§ 18b AufenthG", "Khung pháp lý rõ ràng"],
      ["Đối tác đào tạo", "Trường, phòng nghề, mạng lưới"],
      ["Đồng hành trọn gói", "Một đối tác. Mọi bước."],
    ],
  },
};
