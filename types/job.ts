import type { Lang } from "@/lib/i18n/config";
import { khoangTien } from "@/lib/i18n/format";
import { donHang } from "@/lib/i18n/dict/don-hang";

/** Loại chương trình: đi làm việc hay du học nghề */
export type ProgramType = "Lao động" | "Du học nghề";

/** Hình thức làm việc */
export type EmploymentType = "Toàn thời gian" | "Thời vụ" | "Ca kíp";

export interface Job {
  id: string;
  /** Dùng cho /don-hang/[slug] */
  slug: string;
  /** Khớp với Industry.id */
  industryId: string;
  title: string;
  /**
   * Tên doanh nghiệp. Để undefined khi chưa được cung cấp — KHÔNG bịa tên
   * công ty. Giao diện tự hiển thị "Đối tác tại <thành phố>".
   */
  company?: string;
  city: string;
  state: string;
  /** Khoảng lương gộp, EUR */
  salary: { min: number; max: number };
  salaryType: "tháng" | "giờ";
  vacancies: number;
  employmentType: EmploymentType;
  programType: ProgramType;
  /** Trình độ tiếng Đức yêu cầu */
  languageLevel: string;
  /** Yêu cầu kinh nghiệm, rút gọn */
  experience: string;
  image: string;
  thumbnail: string;
  description: string;
  requirements: string[];
  benefits: string[];
  featured: boolean;
  createdAt: string;
}

/**
 * Tên hiển thị của nhà tuyển dụng, không bao giờ bịa tên công ty.
 * `lang` mặc định "vi" chỉ để mã cũ (trang chủ) chưa truyền ngôn ngữ vẫn biên
 * dịch được — chỗ nào hiển thị ở /en, /de PHẢI truyền lang.
 */
export function tenNhaTuyenDung(j: Job, lang: Lang = "vi"): string {
  return j.company ?? donHang[lang].doiTacTai(j.city);
}

/**
 * Chuỗi lương hiển thị theo ngôn ngữ (lib/i18n/format): "1.874 € – 2.500 €/tháng",
 * "€1,874 – €2,500/month", "1.874 € – 2.500 €/Monat". Đơn chưa công bố mức
 * lương thì ghi "Theo thoả thuận" chứ KHÔNG hiện "0 €" — người đọc sẽ tưởng
 * là làm không công.
 */
export function chuoiLuong(j: Job, lang: Lang = "vi"): string {
  if (!j.salary.max) return donHang[lang].theoThoaThuan;
  const ky = j.salaryType === "giờ" ? "gio" : "thang";
  const min = j.salary.min || j.salary.max;
  return khoangTien(min, j.salary.max, lang, ky);
}

/**
 * Nơi làm việc; bỏ phần lặp khi thành phố trùng tên nước (ví dụ "Áo, Áo").
 * Đơn đã qua getJobs(lang) thì city/state đã là bản dịch.
 */
export function noiLamViec(j: Job): string {
  return j.city === j.state ? j.city : `${j.city}, ${j.state}`;
}
