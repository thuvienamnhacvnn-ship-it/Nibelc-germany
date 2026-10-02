/**
 * ĐA NGÔN NGỮ — CẤU HÌNH CHUNG (dùng được cả server, client lẫn proxy.ts)
 *
 * Tiếng Việt giữ nguyên URL gốc (/, /lien-he ...). Tiếng Anh và tiếng Đức có
 * tiền tố /en, /de. KHÔNG có thư mục app/[lang]: proxy.ts viết lại (rewrite)
 * /en/... và /de/... về đúng route gốc, kèm request header `x-nb-lang` để
 * server component biết đang dựng bản nào (xem lib/i18n/server.ts).
 */

export const LANGS = ["vi", "en", "de"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_MAC_DINH: Lang = "vi";

/** Request header proxy.ts gắn vào — server đọc qua headers() */
export const HEADER_LANG = "x-nb-lang";
/** Đường dẫn "gốc" (đã bỏ tiền tố ngôn ngữ) — dùng cho canonical/hreflang */
export const HEADER_PATH = "x-nb-path";

export const SITE_URL = "https://www.nibelcgermany.de";

/** Thẻ locale cho Intl (số, tiền, ngày) và og:locale */
export const LOCALE: Record<Lang, string> = { vi: "vi-VN", en: "en-GB", de: "de-DE" };

/** Tên ngôn ngữ viết bằng CHÍNH ngôn ngữ đó (endonym) — khi hiển thị phải bọc lang="..." */
export const TEN_NGON_NGU: Record<Lang, { ma: string; ten: string }> = {
  vi: { ma: "VI", ten: "Tiếng Việt" },
  en: { ma: "EN", ten: "English" },
  de: { ma: "DE", ten: "Deutsch" },
};

export function isLang(x: unknown): x is Lang {
  return typeof x === "string" && (LANGS as readonly string[]).includes(x);
}

const RE_TIEN_TO = /^\/(vi|en|de)(?=\/|$)/;

/**
 * Tách tiền tố ngôn ngữ khỏi một pathname (không kèm ?query).
 *   "/en/lien-he" → { lang: "en", path: "/lien-he" }
 *   "/en"         → { lang: "en", path: "/" }
 *   "/lien-he"    → { lang: "vi", path: "/lien-he" }
 */
export function tachNgonNgu(pathname: string): { lang: Lang; path: string } {
  const m = RE_TIEN_TO.exec(pathname);
  if (!m) return { lang: LANG_MAC_DINH, path: pathname || "/" };
  const conLai = pathname.slice(m[0].length);
  return { lang: m[1] as Lang, path: conLai === "" ? "/" : conLai };
}

/**
 * Link nội bộ theo ngôn ngữ: lh("/lien-he", "en") → "/en/lien-he".
 * - Link ngoài (http:, mailto:, tel:, #, //) trả nguyên.
 * - Gọi nhiều lần không bị nhân đôi tiền tố (đã có /en|/de thì thay).
 * - Giữ ?query và #hash: lh("/?q=a", "de") → "/de?q=a".
 */
export function lh(href: string, lang: Lang): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cat = href.search(/[?#]/);
  const duong = cat === -1 ? href : href.slice(0, cat);
  const duoi = cat === -1 ? "" : href.slice(cat);
  const { path } = tachNgonNgu(duong);
  if (lang === LANG_MAC_DINH) return `${path}${duoi}`;
  return `${path === "/" ? `/${lang}` : `/${lang}${path}`}${duoi}`;
}

/** URL tuyệt đối của một đường dẫn gốc ở ngôn ngữ cho trước (canonical, hreflang, sitemap) */
export function urlDayDu(path: string, lang: Lang): string {
  return `${SITE_URL}${lh(path, lang)}`;
}
