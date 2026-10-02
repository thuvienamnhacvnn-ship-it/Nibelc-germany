import { headers } from "next/headers";
import { HEADER_LANG, HEADER_PATH, LANG_MAC_DINH, isLang, type Lang } from "./config";

/**
 * Ngôn ngữ của request đang dựng — CHỈ dùng trong server component,
 * generateMetadata, route handler. Client component dùng useLang().
 *
 * proxy.ts luôn ghi đè header này (kể cả với URL tiếng Việt), nên người
 * ngoài không tự gửi header giả để đổi ngôn ngữ được.
 *
 * Gọi headers() làm route dựng động theo từng request — đó là cái giá của
 * việc không chuyển file sang app/[lang] (xem _w-agent/02_i18n-khung.md).
 */
export async function getLang(): Promise<Lang> {
  const v = (await headers()).get(HEADER_LANG);
  return isLang(v) ? v : LANG_MAC_DINH;
}

/** Đường dẫn gốc (không tiền tố ngôn ngữ) của request, vd "/lien-he" */
export async function getPath(): Promise<string> {
  return (await headers()).get(HEADER_PATH) || "/";
}
