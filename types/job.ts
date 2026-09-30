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

/** Tên hiển thị của nhà tuyển dụng, không bao giờ bịa tên công ty */
export function tenNhaTuyenDung(j: Job): string {
  return j.company ?? `Đối tác tại ${j.city}`;
}

/**
 * Chuỗi lương hiển thị. Đơn chưa công bố mức lương thì ghi "Theo thoả thuận"
 * chứ KHÔNG hiện "0 €" — người đọc sẽ tưởng là làm không công.
 */
export function chuoiLuong(j: Job): string {
  if (!j.salary.max) return "Theo thoả thuận";
  const f = (n: number) => n.toLocaleString("de-DE");
  return !j.salary.min || j.salary.min === j.salary.max
    ? `${f(j.salary.max)} €/${j.salaryType}`
    : `${f(j.salary.min)} – ${f(j.salary.max)} €/${j.salaryType}`;
}

/** Nơi làm việc; bỏ phần lặp khi thành phố trùng tên nước (ví dụ "Áo, Áo"). */
export function noiLamViec(j: Job): string {
  return j.city === j.state ? j.city : `${j.city}, ${j.state}`;
}
