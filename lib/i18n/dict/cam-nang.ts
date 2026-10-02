import { tuDien } from "../dict";
import type { NhomBai } from "@/data/articles";

/**
 * CẨM NANG — trang /cam-nang (GuideHub) và trang bài /cam-nang/[bai].
 * Nội dung bài ở data/i18n/articles.*.ts. Nhóm bài (`nhom` trong
 * data/articles.ts) là MÃ tiếng Việt → nhãn qua `nhom`.
 */
/**
 * CHUYÊN MỤC của trung tâm cẩm nang (mười chuyên mục theo KIT + "tất cả").
 * Lưu MÃ; nhãn hiển thị qua camNang.chuyenMuc. Bài thuộc mục nào: chuyenMucCuaBai() (data/i18n/articles.ts).
 * Đặt ở đây (không ở data/i18n/articles.ts) để GuideHub phía client không kéo cả bản dịch bài vào bundle.
 */
export const CHUYEN_MUC = [
  "tat-ca",
  "visa",
  "tieng",
  "hoc-nghe",
  "viec-lam",
  "cuoc-song",
  "nha-o",
  "bao-hiem",
  "thue-luong",
  "van-hoa",
  "phong-van",
] as const;
export type ChuyenMuc = (typeof CHUYEN_MUC)[number];

export const camNang = tuDien<{
  meta: { tieuDe: string; moTa: string };
  hero: { nhan: string; tieuDe: string; mo: string };
  danhMuc: string;
  chuyenMuc: Record<ChuyenMuc, string>;
  nhom: Record<NhomBai, string>;
  timGoiY: string;
  timAria: string;
  khongCo: (tatCa: string) => string;
  phutDoc: (n: number) => string;
  phut: (n: number) => string;
  docNhieu: string;
  bai: {
    quayLai: string;
    mucLuc: string;
    docTiep: string;
    luuY: string;
  };
}>({
  vi: {
    meta: {
      tieuDe: "Cẩm nang Đức — Kiến thức cần thiết trước và sau khi sang Đức",
      moTa: "Visa, hồ sơ, học tiếng, bảng lương, nhà ở, bảo hiểm và văn hoá làm việc — những gì cần biết trước và sau khi sang Đức.",
    },
    hero: {
      nhan: "Cẩm nang kiến thức",
      tieuDe: "Cẩm nang Đức",
      mo: "Kiến thức cần thiết trước và sau khi sang Đức: thủ tục, tiếng, bảng lương, nhà ở và văn hoá làm việc.",
    },
    danhMuc: "Danh mục chủ đề",
    chuyenMuc: {
      "tat-ca": "Tất cả bài viết",
      visa: "Visa & hồ sơ",
      tieng: "Học tiếng Đức",
      "hoc-nghe": "Du học nghề",
      "viec-lam": "Việc làm tại Đức",
      "cuoc-song": "Cuộc sống tại Đức",
      "nha-o": "Nhà ở",
      "bao-hiem": "Bảo hiểm",
      "thue-luong": "Thuế & lương",
      "van-hoa": "Văn hóa Đức",
      "phong-van": "Kinh nghiệm phỏng vấn",
    },
    nhom: { "Chuẩn bị": "Chuẩn bị", "Sống ở Đức": "Sống ở Đức", "Tiền bạc": "Tiền bạc", "Lâu dài": "Lâu dài" },
    timGoiY: "Tìm kiếm trong cẩm nang...",
    timAria: "Tìm kiếm trong cẩm nang",
    khongCo: (tatCa) => `Không có bài viết nào khớp. Thử từ khoá khác hoặc chọn “${tatCa}”.`,
    phutDoc: (n) => `${n} phút đọc`,
    phut: (n) => `${n} phút`,
    docNhieu: "Được đọc nhiều nhất",
    bai: { quayLai: "Cẩm nang", mucLuc: "Mục lục", docTiep: "Đọc tiếp", luuY: "Lưu ý:" },
  },
  en: {
    meta: {
      tieuDe: "Germany Guide — What you need to know before and after moving to Germany",
      moTa: "Visas, applications, learning German, payslips, housing, insurance and working culture — what you need to know before and after moving to Germany.",
    },
    hero: {
      nhan: "Knowledge base",
      tieuDe: "Germany Guide",
      mo: "What you need to know before and after moving to Germany: formalities, language, payslips, housing and working culture.",
    },
    danhMuc: "Topics",
    chuyenMuc: {
      "tat-ca": "All articles",
      visa: "Visas & documents",
      tieng: "Learning German",
      "hoc-nghe": "Vocational training",
      "viec-lam": "Working in Germany",
      "cuoc-song": "Living in Germany",
      "nha-o": "Housing",
      "bao-hiem": "Insurance",
      "thue-luong": "Tax & pay",
      "van-hoa": "German culture",
      "phong-van": "Interview tips",
    },
    nhom: { "Chuẩn bị": "Preparation", "Sống ở Đức": "Living in Germany", "Tiền bạc": "Money", "Lâu dài": "Long term" },
    timGoiY: "Search the guide…",
    timAria: "Search the guide",
    khongCo: (tatCa) => `No matching articles. Try another search term or choose “${tatCa}”.`,
    phutDoc: (n) => `${n} min read`,
    phut: (n) => `${n} min`,
    docNhieu: "Most read",
    bai: { quayLai: "Germany Guide", mucLuc: "Contents", docTiep: "Read next", luuY: "Note:" },
  },
  de: {
    meta: {
      tieuDe: "Ratgeber Deutschland – Wissenswertes vor und nach dem Umzug nach Deutschland",
      moTa: "Visum, Bewerbungsunterlagen, Deutsch lernen, Gehaltsabrechnung, Wohnen, Versicherungen und Arbeitskultur – was Sie vor und nach dem Umzug nach Deutschland wissen sollten.",
    },
    hero: {
      nhan: "Wissen kompakt",
      tieuDe: "Ratgeber Deutschland",
      mo: "Was Sie vor und nach dem Umzug nach Deutschland wissen sollten: Formalitäten, Sprache, Gehaltsabrechnung, Wohnen und Arbeitskultur.",
    },
    danhMuc: "Themen",
    chuyenMuc: {
      "tat-ca": "Alle Beiträge",
      visa: "Visum & Unterlagen",
      tieng: "Deutsch lernen",
      "hoc-nghe": "Ausbildung",
      "viec-lam": "Arbeiten in Deutschland",
      "cuoc-song": "Leben in Deutschland",
      "nha-o": "Wohnen",
      "bao-hiem": "Versicherungen",
      "thue-luong": "Steuern & Gehalt",
      "van-hoa": "Kultur in Deutschland",
      "phong-van": "Vorstellungsgespräch",
    },
    nhom: { "Chuẩn bị": "Vorbereitung", "Sống ở Đức": "Leben in Deutschland", "Tiền bạc": "Finanzen", "Lâu dài": "Langfristig" },
    timGoiY: "Im Ratgeber suchen …",
    timAria: "Im Ratgeber suchen",
    khongCo: (tatCa) => `Keine passenden Beiträge. Versuchen Sie einen anderen Suchbegriff oder wählen Sie „${tatCa}“.`,
    phutDoc: (n) => `${n} Min. Lesezeit`,
    phut: (n) => `${n} Min.`,
    docNhieu: "Meistgelesen",
    bai: { quayLai: "Ratgeber", mucLuc: "Inhalt", docTiep: "Weiterlesen", luuY: "Hinweis:" },
  },
});

