import type { Lang } from "./config";

/**
 * TỪ ĐIỂN — một bộ = cùng một cấu trúc cho đủ 3 ngôn ngữ.
 *
 *   export const lienHe = tuDien({
 *     vi: { tieuDe: "Liên hệ", buoc: (n: string) => `Bước ${n}` },
 *     en: { tieuDe: "Contact", buoc: (n: string) => `Step ${n}` },
 *     de: { tieuDe: "Kontakt", buoc: (n: string) => `Schritt ${n}` },
 *   });
 *
 * Cấu trúc lấy theo bản `vi`; `en` và `de` bị TypeScript bắt phải có ĐÚNG
 * các khoá đó (thiếu khoá → lỗi, thừa khoá → lỗi). Không có đường rơi về
 * tiếng Việt: dịch thiếu là tsc đỏ, không phải trang lẫn tiếng.
 */
export type Bo<T> = { vi: T; en: T; de: T };

export function tuDien<T>(bo: { vi: T; en: NoInfer<T>; de: NoInfer<T> }): Bo<T> {
  return bo;
}

/** Lấy bản theo ngôn ngữ. Server: t(bo, await getLang()); client: useT(bo). */
export function t<T>(bo: Bo<T>, lang: Lang): T {
  return bo[lang];
}
