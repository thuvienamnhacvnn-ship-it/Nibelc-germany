import { ABROAD_ORDERS, COUNTRY_FLAG, COUNTRY_NAME, type AbroadRole, type CountryCode } from "@/content/jobs-abroad";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOB_ORDERS } from "@/content/jobs-current";
import type { Locale } from "@/content/locales";

/**
 * MỘT DANH SÁCH ĐƠN HÀNG DUY NHẤT cho trang "Đơn hàng" và trang chi tiết.
 *
 * Gộp hai nguồn có sẵn, KHÔNG thêm bớt dữ liệu:
 *   - `jobs-current.ts`  : các đơn nhà kính ở Đức (có đủ việc làm, yêu cầu,
 *                          quyền lợi, ảnh tin gốc)
 *   - `jobs-abroad.ts`   : các đơn châu Âu (có hợp đồng, quyền lợi, ảnh tin)
 *
 * Trường nào nguồn không có thì để trống — trang phải tự ẩn mục đó, tuyệt đối
 * không bịa số.
 */

export interface JobFull {
  id: string;
  country: CountryCode;
  countryName: string;
  flag: string[];
  /** Ngành trong registry, chỉ có khi khớp thật */
  industry?: string;
  title: string;
  summary: string;
  /** Ảnh dùng cho thẻ và banner */
  image: string;
  imageFocus: string;
  /** Ảnh phụ, lấy từ bộ ảnh ngành nếu có */
  gallery: string[];
  /** Ảnh tin tuyển dụng gốc — chỉ hiện ở bản tiếng Việt */
  poster?: string;
  salary: { from: number; to: number };
  salaryNote?: string;
  slots?: number;
  hoursPerWeek?: number;
  locations?: string[];
  visa?: string;
  contract?: string;
  tasks?: string[];
  requirements?: string[];
  benefits?: string[];
  roles?: AbroadRole[];
  costNote?: string;
}

function anhNganh(slug: string | undefined): string[] {
  const a = slug ? INDUSTRY_ASSETS[slug] : undefined;
  if (!a) return [];
  return [a.hero, a.portraitWork, a.portraitTeam, a.detail];
}

export function allJobs(locale: Locale): JobFull[] {
  const nha: JobFull[] = JOB_ORDERS.map((j) => {
    const a = INDUSTRY_ASSETS[j.industry];
    return {
      id: j.id,
      country: "de",
      countryName: COUNTRY_NAME.de[locale],
      flag: COUNTRY_FLAG.de,
      industry: j.industry,
      title: j.title[locale],
      summary: j.summary[locale],
      image: a?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero,
      imageFocus: "50% 42%",
      gallery: anhNganh(j.industry),
      poster: j.poster.src,
      salary: { from: j.salary.from, to: j.salary.to },
      slots: j.slots,
      hoursPerWeek: j.hoursPerWeek,
      locations: j.locations,
      visa: j.visa,
      tasks: j.tasks[locale],
      requirements: j.requirements[locale],
      benefits: j.benefits[locale],
    };
  });

  const ngoai: JobFull[] = ABROAD_ORDERS.map((j) => ({
    id: j.id,
    country: j.country,
    countryName: COUNTRY_NAME[j.country][locale],
    flag: COUNTRY_FLAG[j.country],
    industry: j.industry,
    title: j.title[locale],
    summary: j.summary[locale],
    image: j.image,
    imageFocus: j.imageFocus,
    gallery: anhNganh(j.industry),
    poster: j.poster,
    salary: j.salary,
    salaryNote: j.salaryNote[locale],
    slots: j.slots,
    hoursPerWeek: j.hoursPerWeek,
    visa: j.visa,
    contract: j.contract[locale],
    benefits: j.benefits[locale],
    requirements: j.requirements?.[locale],
    roles: j.roles,
    costNote: j.costNote?.[locale],
  }));

  // Đơn ở Đức đứng trước, rồi tới các nước khác — cùng thứ tự với trang chủ.
  return [...ngoai.filter((x) => x.country === "de"), ...nha, ...ngoai.filter((x) => x.country !== "de")];
}

export function jobById(locale: Locale, id: string): JobFull | undefined {
  return allJobs(locale).find((j) => j.id === id);
}

/** Mọi mã đơn hàng — dùng cho generateStaticParams */
export function allJobIds(): string[] {
  return [...ABROAD_ORDERS.map((j) => j.id), ...JOB_ORDERS.map((j) => j.id)];
}

/** Đếm số đơn theo quốc gia, để dựng cột lọc bên trái */
export function demTheoNuoc(locale: Locale): { code: CountryCode; name: string; flag: string[]; count: number }[] {
  const js = allJobs(locale);
  const ma = [...new Set(js.map((j) => j.country))];
  return ma.map((code) => ({
    code,
    name: COUNTRY_NAME[code][locale],
    flag: COUNTRY_FLAG[code],
    count: js.filter((j) => j.country === code).length,
  }));
}
