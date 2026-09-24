import type { Locale } from "@/content/locales";

/**
 * Chữ của trang 04 — screens/04-branchen (2).png.
 *
 * Khác mẫu, có chủ đích:
 *  - Ngành 07 (Akademische Fachkräfte): mẫu in sẵn "Ingenieure, IT-Spezialisten,
 *    Wirtschaftsexperten". Chưa được duyệt (CẦN ĐIỀN 02) → giữ thẻ, thay dòng
 *    vị trí bằng "In Vorbereitung", không có link.
 *  - Số "8" và "8 Kompetenzfelder" đọc từ registry, không gõ tay.
 */

export interface IndustriesCopy {
  nav: string[];
  contact: string;
  eyebrow: string;
  h1: string;
  sub: string;
  trust: [string, string][];
  panel: { title: [string, string]; sub: [string, string] };
  sectionTitle: string;
  sectionText: string;
  fieldsLabel: string;
  inPrep: string;
  strip: [string, string][];
}

export const INDUSTRIES_PAGE: Record<Locale, IndustriesCopy> = {
  de: {
    nav: ["Startseite", "Branchen", "Für Unternehmen", "Für Fachkräfte", "Prozess", "Wissen"],
    contact: "Kontakt aufnehmen",
    eyebrow: "Menschen verbinden. Zukunft gestalten.",
    h1: "Fachkräfte für acht Branchen",
    sub: "Wir bringen internationale Talente aus Vietnam und Asien\nmit deutschen Unternehmen zusammen – passgenau, verlässlich und langfristig.",
    trust: [
      ["Qualifizierte", "Fachkräfte"],
      ["Rechtssicher", "und transparent"],
      ["Nachhaltige", "Partnerschaften"],
    ],
    panel: { title: ["Talente", "ohne Grenzen."], sub: ["Starke Unternehmen", "in Deutschland."] },
    sectionTitle: "Unsere Branchen",
    sectionText:
      "Ob Handwerk, Industrie, Dienstleistung oder akademische Berufe – wir vermitteln qualifizierte Fachkräfte in acht zukunftsstarke Branchen und schaffen echte Perspektiven für Unternehmen und Talente.",
    fieldsLabel: "Kompetenzfelder",
    inPrep: "In Vorbereitung",
    strip: [
      ["", "Branchen mit Perspektive"],
      ["Internationale Talente", "Insbesondere aus Vietnam und Asien"],
      ["Starke Partner", "Für eine erfolgreiche Zukunft"],
      ["Gemeinsam für Deutschland", "Fachkräfte. Wachstum. Integration."],
    ],
  },
  en: {
    nav: ["Home", "Industries", "For Employers", "For Candidates", "Process", "Knowledge"],
    contact: "Get in touch",
    eyebrow: "Connecting people. Shaping the future.",
    h1: "Skilled workers for eight industries",
    sub: "We bring international talent from Vietnam and Asia\ntogether with German employers – well matched, reliable and long-term.",
    trust: [
      ["Qualified", "workers"],
      ["Lawful", "and transparent"],
      ["Lasting", "partnerships"],
    ],
    panel: { title: ["Talent", "without borders."], sub: ["Strong companies", "in Germany."] },
    sectionTitle: "Our industries",
    sectionText:
      "Crafts, industry, services or academic professions – we place qualified workers in eight future-proof industries and create real prospects for companies and talent.",
    fieldsLabel: "fields of expertise",
    inPrep: "In preparation",
    strip: [
      ["", "Industries with prospects"],
      ["International talent", "Especially from Vietnam and Asia"],
      ["Strong partners", "For a successful future"],
      ["Together for Germany", "Workers. Growth. Integration."],
    ],
  },
  vi: {
    nav: ["Trang chủ", "Ngành nghề", "Doanh nghiệp", "Người lao động", "Lộ trình", "Kiến thức"],
    contact: "Liên hệ ngay",
    eyebrow: "Kết nối con người. Kiến tạo tương lai.",
    h1: "Nhân lực cho tám ngành nghề",
    sub: "Chúng tôi kết nối nhân tài từ Việt Nam và châu Á\nvới doanh nghiệp Đức – đúng người, tin cậy và lâu dài.",
    trust: [
      ["Nhân lực", "có tay nghề"],
      ["Đúng luật", "và minh bạch"],
      ["Hợp tác", "bền vững"],
    ],
    panel: { title: ["Nhân tài", "không biên giới."], sub: ["Doanh nghiệp", "vững mạnh tại Đức."] },
    sectionTitle: "Ngành nghề",
    sectionText:
      "Tay nghề, công nghiệp, dịch vụ hay nghề cần bằng đại học – chúng tôi kết nối lao động có tay nghề trong tám ngành giàu triển vọng, mở ra cơ hội thật cho doanh nghiệp và người lao động.",
    fieldsLabel: "lĩnh vực chuyên môn",
    inPrep: "Đang chuẩn bị",
    strip: [
      ["", "Ngành nghề có triển vọng"],
      ["Nhân tài quốc tế", "Đặc biệt từ Việt Nam và châu Á"],
      ["Đối tác vững mạnh", "Cho một tương lai thành công"],
      ["Cùng nhau vì nước Đức", "Nhân lực. Tăng trưởng. Hội nhập."],
    ],
  },
};
