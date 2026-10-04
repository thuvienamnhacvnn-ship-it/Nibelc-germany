import type { Lang } from "@/lib/i18n/config";
import { khoangTien } from "@/lib/i18n/format";
import { donHang } from "@/lib/i18n/dict/don-hang";

/**
 * NGÔN NGỮ YÊU CẦU CỦA ĐƠN.
 *
 * Sếp hỏi ngày 04/10/2026: "tại sao đơn Hy Lạp lại yêu cầu biết tiếng Đức".
 * Đúng, và lỗi nằm ở giao diện: trường `languageLevel` chỉ ghi MỨC ("A2 – B1")
 * còn tên ngôn ngữ thì mọi thẻ đều in cứng là tiếng Đức. Kho đơn hiện có 10
 * đơn Hy Lạp, 2 Albania, 2 Áo, 1 Litva và đúng 1 đơn Đức — chữ "tiếng Đức"
 * sai ở 13 trên 16 đơn.
 *
 * null = CHƯA BIẾT đơn cần tiếng gì, và giao diện không hiện nhãn nào cả.
 * Đọc lại 16 tờ đơn gốc trong data/jobs-that.json thì phần yêu cầu chung
 * không nhắc tới ngôn ngữ nào; chỉ riêng mấy vị trí "Quản lý" mới ghi
 * "(Biết Tiếng Anh)". Thà thiếu còn hơn ghi sai — không bịa.
 */
export type NgonNguDon = "de" | "en" | null;

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
  /**
   * MỨC ngoại ngữ yêu cầu ("A2 – B1"), KHÔNG kèm tên ngôn ngữ — xem `language`.
   */
  languageLevel: string;
  /**
   * NGÔN NGỮ đơn này cần. Tính MỘT LẦN lúc dựng JOBS trong data/jobs.ts theo
   * nước làm việc, KHÔNG suy lại lúc hiển thị: đơn đi qua getJobs(lang) thì
   * `state` đã thành "Griechenland"/"Greece", tra theo tên tiếng Việt là hỏng.
   */
  language: NgonNguDon;
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
/**
 * Nhãn ngôn ngữ trên thẻ: "Tiếng Đức A2 – B1" / "German A2 – B1" / "Deutsch…".
 * Trả null khi chưa biết đơn cần tiếng gì — nơi gọi phải bỏ hẳn nhãn đi.
 */
export function nhanNgonNgu(j: Job, lang: Lang = "vi"): string | null {
  if (!j.language) return null;
  const tx = donHang[lang];
  return j.language === "de" ? tx.tiengDuc(j.languageLevel) : tx.tiengAnh(j.languageLevel);
}

export function noiLamViec(j: Job): string {
  return j.city === j.state ? j.city : `${j.city}, ${j.state}`;
}
