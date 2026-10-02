import { JOBS, featuredJobOf, type JobFull } from "@/data/jobs";
import { INDUSTRIES, industryById } from "@/data/industries";
import { getJobs } from "@/data/i18n/jobs";
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

const RE_VIET = /[ăâđêôơưĂÂĐÊÔƠƯĩũỳĨŨỲẠ-ỹàáèéìíòóùúýÀÁÈÉÌÍÒÓÙÚÝ]/;

/** Tên nước trong dữ liệu gốc (vi) → en/de. Chỉ dùng cho bản tạm thời. */
const NUOC: Record<string, { en: string; de: string }> = {
  "Đức": { en: "Germany", de: "Deutschland" },
  "Áo": { en: "Austria", de: "Österreich" },
  "Hy Lạp": { en: "Greece", de: "Griechenland" },
  "Litva": { en: "Lithuania", de: "Litauen" },
  Albania: { en: "Albania", de: "Albanien" },
};

/**
 * Bản tạm khi chưa có bản dịch đơn: tên đơn = tên ngành, nơi làm việc =
 * thành phố nếu tên không có chữ Việt, không thì lấy tên nước. KHÔNG hiện
 * chữ Việt, KHÔNG tự dịch tiêu đề đơn (việc của nhóm B).
 */
function tamThoi(lang: "en" | "de"): JobFull[] {
  return JOBS.map((j) => {
    const nganh = industryById(j.industryId);
    const nuoc = NUOC[j.state]?.[lang] ?? j.state;
    return {
      ...j,
      title: nganh ? tenNganh(nganh, lang) : j.title,
      state: nuoc,
      city: RE_VIET.test(j.city) ? nuoc : j.city,
    };
  });
}

export function donHangTheoNgonNgu(lang: Lang): JobFull[] {
  if (lang === "vi") return JOBS;
  try {
    return getJobs(lang);
  } catch {
    return tamThoi(lang);
  }
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
