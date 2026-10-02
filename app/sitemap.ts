import type { MetadataRoute } from "next";
import { LANGS, urlDayDu } from "@/lib/i18n/config";
import { TRANG_TINH, tuyenDong } from "@/lib/i18n/routes";

/**
 * /sitemap.xml — mỗi trang có đủ 3 bản (vi gốc, /en, /de), mỗi bản khai
 * hreflang tới hai bản kia + x-default (tiếng Việt).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const trang = [...TRANG_TINH, ...tuyenDong()];
  return trang.flatMap((path) => {
    const languages = {
      vi: urlDayDu(path, "vi"),
      en: urlDayDu(path, "en"),
      de: urlDayDu(path, "de"),
      "x-default": urlDayDu(path, "vi"),
    };
    return LANGS.map((lang) => ({
      url: urlDayDu(path, lang),
      changeFrequency: path.startsWith("/don-hang") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages },
    }));
  });
}
