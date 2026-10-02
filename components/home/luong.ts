import type { Job } from "@/types/job";
import type { Lang } from "@/lib/i18n/config";
import { khoangTien, tienTheoKy } from "@/lib/i18n/format";

/**
 * Lương hiển thị trên trang chủ. "Theo thoả thuận" khi đơn chưa công bố mức
 * lương (không hiện "0 €").
 * TODO(nhóm B): khi chuoiLuong() ở types/job.ts nhận `lang` thì dùng lại nó.
 */
export function luongHienThi(j: Job, lang: Lang, thoaThuan: string): string {
  if (!j.salary.max) return thoaThuan;
  const ky = j.salaryType === "giờ" ? "gio" : "thang";
  return !j.salary.min || j.salary.min === j.salary.max
    ? tienTheoKy(j.salary.max, lang, ky)
    : khoangTien(j.salary.min, j.salary.max, lang, ky);
}
