import { LEGAL } from "@/data/company";
import type { Bo } from "@/lib/i18n/dict";
import type { Lang } from "@/lib/i18n/config";

/**
 * ĐỊA CHỈ CÔNG TY — khuôn Sếp chốt 02/10/2026 (theo ảnh mẫu):
 *   dòng 1 (đậm): NIBELC Germany GmbH
 *   dòng 2:       Potsdamer Platz 10, 10785 Berlin, Germany   ← MỘT dòng, có tên nước
 *   điện thoại:   +49 30 263 987 650
 *
 * Tên nước theo ngôn ngữ trang: vi = "Germany" (đúng ảnh mẫu Sếp gửi),
 * en = "Germany", de = "Deutschland".
 * Impressum / Datenschutz là văn bản pháp lý tiếng Đức → vẫn dùng LEGAL.country
 * ("Deutschland"), KHÔNG dùng hàm này.
 */
export const QUOC_GIA: Bo<string> = { vi: "Germany", en: "Germany", de: "Deutschland" };

/** "Potsdamer Platz 10, 10785 Berlin" — không kèm nước (bản đồ, mô tả ngắn) */
export const DIA_CHI_NGAN = `${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}`;

/** "Potsdamer Platz 10, 10785 Berlin, Germany" — dòng địa chỉ chuẩn */
export function diaChiMotDong(lang: Lang): string {
  return `${DIA_CHI_NGAN}, ${QUOC_GIA[lang]}`;
}
