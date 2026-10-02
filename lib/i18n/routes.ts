import { JOBS } from "@/data/jobs";
import { CAM_NANG } from "@/data/articles";
import { NGANH_HOC } from "@/data/ausbildung";

/**
 * DANH SÁCH TRANG (đường dẫn gốc, không tiền tố ngôn ngữ) — một nguồn cho:
 *   - app/sitemap.ts (mỗi trang × 3 ngôn ngữ, kèm hreflang)
 *   - scripts/kiem-ngon-ngu.mjs (tải từng trang ở /, /en, /de để soát lẫn tiếng)
 *
 * Thêm trang mới trong app/ thì thêm vào TRANG_TINH (hoặc tuyenDong()).
 * /impressum và /datenschutz đang noindex nên không vào sitemap,
 * nhưng vẫn được kiểm ngôn ngữ.
 */
export const TRANG_TINH = [
  "/",
  "/don-hang",
  "/du-hoc-nghe",
  "/lo-trinh",
  "/cam-nang",
  "/ve-chung-toi",
  "/lien-he",
] as const;

export const TRANG_KHONG_INDEX = ["/impressum", "/datenschutz"] as const;

export function tuyenDong(): string[] {
  return [
    ...JOBS.map((j) => `/don-hang/${j.slug}`),
    ...CAM_NANG.map((b) => `/cam-nang/${b.id}`),
    ...NGANH_HOC.map((n) => `/du-hoc-nghe/${n.id}`),
  ];
}

/** Mọi trang cần kiểm ngôn ngữ */
export function tatCaTrang(): string[] {
  return [...TRANG_TINH, ...TRANG_KHONG_INDEX, ...tuyenDong()];
}
