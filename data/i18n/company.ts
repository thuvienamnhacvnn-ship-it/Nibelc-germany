import { LEGAL } from "@/data/company";
import type { Bo } from "@/lib/i18n/dict";
import type { Lang } from "@/lib/i18n/config";

/**
 * ĐỊA CHỈ CÔNG TY — khuôn Sếp chốt 02/10/2026 (theo ảnh mẫu):
 *   dòng 1 (đậm): NIBELC Germany GmbH
 *   dòng 2:       Dietrichstraße 16, 16356 Ahrensfelde-Lindenberg, Germany
 *   điện thoại:   +49 1577 5675555
 *
 * Trụ sở đổi chiều 02/10/2026, bộ cũ là Potsdamer Platz 10, 10785 Berlin,
 * +49 30 263 987 650. Mọi giá trị dưới đây TÍNH TỪ `LEGAL` chứ không chép
 * tay, nên đổi địa chỉ ở data/company.ts là cả ba thứ tiếng đổi theo.
 *
 * Tên nước theo ngôn ngữ trang: vi = "Germany" (đúng ảnh mẫu Sếp gửi),
 * en = "Germany", de = "Deutschland".
 * Impressum / Datenschutz là văn bản pháp lý tiếng Đức → dùng QUOC_GIA.de,
 * KHÔNG dùng hàm này và KHÔNG dùng LEGAL.country (nay là "Germany").
 */
export const QUOC_GIA: Bo<string> = { vi: "Germany", en: "Germany", de: "Deutschland" };

/** "Dietrichstraße 16, 16356 Ahrensfelde-Lindenberg" — không kèm nước */
export const DIA_CHI_NGAN = `${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}`;

/** "Dietrichstraße 16, 16356 Ahrensfelde-Lindenberg, Germany" — dòng chuẩn */
export function diaChiMotDong(lang: Lang): string {
  return `${DIA_CHI_NGAN}, ${QUOC_GIA[lang]}`;
}
