import { featuredJobOf, type JobFull } from "@/data/jobs";
import { layDonHang } from "@/data/nguon";
import { INDUSTRIES, industryById } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import type { Lang } from "@/lib/i18n/config";

/**
 * DỮ LIỆU ĐƠN HÀNG CHO TRANG CHỦ — chỉ chạy phía server (app/page.tsx), rồi
 * truyền xuống client component dưới dạng props đã dịch sẵn.
 *
 * Nguồn: getJobs(lang) (bản dịch 20 đơn ở data/i18n/jobs.*.json — nhóm B).
 * TODO(nhóm B): khi jobs.en.json / jobs.de.json đã đủ 20 đơn thì nhánh
 * `tamThoi()` không còn chạy nữa — xoá đi được.
 */

/* Bản dịch tạm (đoán tên nước, lấy tên ngành thay tên đơn) ĐÃ BỎ.
   Luật nay là THIẾU THÌ ẨN (Sếp chốt 05/10/2026): đoán chữ hộ nhân viên chỉ
   tổ đẻ ra bản dịch sai mà không ai biết để sửa. */

/**
 * Đơn hàng cho trang chủ, đọc thẳng CSDL.
 *
 * CHỈ GỌI Ở PHÍA MÁY CHỦ (app/(web)/page.tsx) rồi truyền xuống client bằng
 * props. Hàm cũ đọc mảng JOBS tĩnh nên nhân viên sửa trong trang quản trị
 * thì trang chủ vẫn trả nội dung cũ.
 *
 * Nhánh dự phòng `tamThoi()` đã bỏ: nó dịch máy mấy tên nước khi bản dịch
 * còn thiếu. Nay luật là THIẾU THÌ ẨN (Sếp chốt 05/10/2026), đoán chữ hộ
 * nhân viên chỉ tổ đẻ ra bản dịch sai mà không ai biết để sửa.
 */
export async function donHangTheoNgonNgu(lang: Lang): Promise<JobFull[]> {
  return layDonHang(lang);
}

/**
 * Đơn hiện trên thẻ hero của từng ngành (đơn nổi bật đầu tiên, ảnh banner 16:9
 * của ngành — giữ đúng logic featuredJobOf), đã thay chữ theo ngôn ngữ.
 */
export function donHeroTheoNganh(ds: JobFull[]): Record<string, JobFull> {
  const theoId = new Map(ds.map((j) => [j.id, j]));
  const ra: Record<string, JobFull> = {};
  for (const n of INDUSTRIES) {
    const goc = featuredJobOf(n.id);
    const dich = goc && theoId.get(goc.id);
    if (goc && dich) ra[n.id] = { ...dich, image: goc.image };
  }
  return ra;
}

/** Gói nhẹ cho ô tìm kiếm (client) — không gửi cả mô tả/yêu cầu xuống trình duyệt */
export interface DonGoiY {
  slug: string;
  title: string;
  city: string;
  state: string;
}

export function donGoiY(ds: JobFull[]): DonGoiY[] {
  return ds.map(({ slug, title, city, state }) => ({ slug, title, city, state }));
}
