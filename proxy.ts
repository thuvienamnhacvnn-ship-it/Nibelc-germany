import { NextResponse, type NextRequest } from "next/server";
import { HEADER_LANG, HEADER_PATH, tachNgonNgu } from "@/lib/i18n/config";

/**
 * PROXY (Next 16 đổi tên middleware → proxy, chạy Node runtime).
 *
 * Định tuyến ngôn ngữ mà KHÔNG chuyển file trong app/:
 *   /en/lien-he  → rewrite về /lien-he, gắn x-nb-lang: en
 *   /de          → rewrite về /,        gắn x-nb-lang: de
 *   /lien-he     → giữ nguyên,          gắn x-nb-lang: vi
 *   /vi/...      → 308 về URL gốc không tiền tố (tiếng Việt không có /vi)
 *
 * Header luôn được GHI ĐÈ, kể cả ở URL tiếng Việt — header giả từ ngoài gửi
 * vào không đổi được ngôn ngữ.
 *
 * Proxy chạy cả với request RSC khi điều hướng phía client (Link/router.push),
 * nên trang con dựng lại đúng ngôn ngữ của URL.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { lang, path } = tachNgonNgu(pathname);

  if (pathname === "/vi" || pathname.startsWith("/vi/")) {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  }

  const h = new Headers(req.headers);
  h.set(HEADER_LANG, lang);
  h.set(HEADER_PATH, path);

  if (path !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.rewrite(url, { request: { headers: h } });
  }
  return NextResponse.next({ request: { headers: h } });
}

export const config = {
  matcher: [
    /* Bỏ qua tài nguyên tĩnh, ảnh tối ưu, file có đuôi (ảnh, svg, xml, txt…),
       và BỎ QUA CẢ /quan-tri: trang quản trị chỉ có tiếng Việt, cho nó đi qua
       bộ định tuyến ngôn ngữ thì mọi đường dẫn bên trong bị thêm tiền tố và
       form gửi về sai chỗ. */
    "/((?!_next/|api/|assets/|quan-tri|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
