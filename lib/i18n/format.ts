import { LOCALE, type Lang } from "./config";

/**
 * Số / tiền / ngày theo locale — KHÔNG tự nối chuỗi "€" hay dấu chấm nghìn.
 *   tien(1874, "vi") → "1.874 €"   tien(1874, "en") → "€1,874"   tien(1874, "de") → "1.874 €"
 *   tienTheoKy(1874, lang) → "1.874 €/tháng" · "€1,874/month" · "1.874 €/Monat"
 */

export function so(n: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang]).format(n);
}

export function tien(n: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

const KY = {
  vi: { thang: "tháng", gio: "giờ", nam: "năm" },
  en: { thang: "month", gio: "hour", nam: "year" },
  de: { thang: "Monat", gio: "Stunde", nam: "Jahr" },
} as const;

export type KyLuong = keyof (typeof KY)["vi"];

/** "1.874 €/tháng" — ky: "thang" | "gio" | "nam" */
export function tienTheoKy(n: number, lang: Lang, ky: KyLuong = "thang"): string {
  return `${tien(n, lang)}/${KY[lang][ky]}`;
}

/** Khoảng lương: "1.800 € – 2.400 €/tháng"; min === max thì một số */
export function khoangTien(min: number, max: number, lang: Lang, ky: KyLuong = "thang"): string {
  if (min === max) return tienTheoKy(min, lang, ky);
  return `${tien(min, lang)} – ${tienTheoKy(max, lang, ky)}`;
}

/** Ngày: "03/07/2026" (vi), "3 Jul 2026" (en), "03.07.2026" (de) */
export function ngay(iso: string | Date, lang: Lang): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const opt: Intl.DateTimeFormatOptions =
    lang === "en"
      ? { day: "numeric", month: "short", year: "numeric" }
      : { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Intl.DateTimeFormat(LOCALE[lang], { ...opt, timeZone: "Europe/Berlin" }).format(d);
}
