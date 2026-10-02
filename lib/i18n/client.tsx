"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LANG_MAC_DINH, lh, tachNgonNgu, type Lang } from "./config";
import type { Bo } from "./dict";

const Ctx = createContext<Lang>(LANG_MAC_DINH);

/** Đặt một lần ở app/layout.tsx, giá trị lấy từ getLang() phía server */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

/** Ngôn ngữ đang xem — trong client component */
export function useLang(): Lang {
  return useContext(Ctx);
}

/** Bản dịch của một bộ từ điển theo ngôn ngữ đang xem */
export function useT<T>(bo: Bo<T>): T {
  return bo[useContext(Ctx)];
}

/**
 * Hàm thêm tiền tố ngôn ngữ đang xem — dùng trước MỌI router.push /
 * chuyenTrang() tự gọi (chuyenTrang nhận href ĐÃ có tiền tố):
 *   const lhx = useLh();  chuyen(lhx(`/don-hang?q=${q}`));
 */
export function useLh(): (href: string) => string {
  const lang = useContext(Ctx);
  return (href: string) => lh(href, lang);
}

/**
 * Đường dẫn GỐC đang xem, đã bỏ tiền tố /en|/de: "/en/lien-he" → "/lien-he".
 * Dùng thay usePathname() khi so mục menu đang mở — sau rewrite, server và
 * trình duyệt có thể thấy pathname khác nhau (có/không tiền tố); bỏ tiền tố
 * đi thì hai bên luôn khớp, không lệch hydrate.
 */
export function useDuongDan(): string {
  return tachNgonNgu(usePathname() || "/").path;
}
