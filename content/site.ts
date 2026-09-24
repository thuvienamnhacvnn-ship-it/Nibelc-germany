/**
 * Cấu hình site.
 *
 * Tên miền chính thức: nibelcgermany.de (đăng ký tại DENIC).
 * Lưu ý: nibelcgroup.de KHÔNG được đăng ký — đừng dùng ở bất kỳ đâu.
 */

export const SITE = {
  name: "NIBELC",
  tagline: "TalentBridge Deutschland",

  /** Dùng cho canonical, sitemap, robots, hreflang, OG. */
  domain: "nibelcgermany.de",

  /**
   * Cho phép đổi khi deploy (preview/staging) mà không phải sửa code.
   * Production mặc định là domain thật, có www.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.nibelcgermany.de",

  /** Ngôn ngữ mặc định là tiếng Đức; tiếng Việt nằm dưới /vi. */
  defaultLocale: "de-DE",
  locales: ["de-DE", "vi-VN"] as const,
  timeZone: "Europe/Berlin",
} as const;

/** URL tuyệt đối cho canonical và sitemap. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}`;
}
