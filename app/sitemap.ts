import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { activeIndustries } from "@/content/industries";
import { LOCALES, ROUTES, industryPath, type PageKey } from "@/content/locales";

/**
 * Sitemap theo cây route trong DESIGN LOCK.
 *
 * Route công khai là tiếng Đức; hành trình ứng viên nằm dưới `/vi`.
 * Chỉ ngành `active` được vào sitemap — ngành 07 bị khoá tới khi
 * mục CAN DIEN 02 được duyệt.
 * Trang pháp lý chưa đủ dữ liệu nên cũng chưa đưa vào.
 */

/** Mọi trang công khai, cả ba ngôn ngữ. Trang /agent-center là màn hình
 *  nội bộ nên không nằm ở đây. */
const PAGES: PageKey[] = [
  "home",
  "employers",
  "candidates",
  "industries",
  "process",
  "services",
  "about",
  "knowledge",
  "contact",
  "request",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      const path = ROUTES[page][locale];
      entries.push({
        url: absoluteUrl(path),
        lastModified: now,
        changeFrequency: "weekly",
        priority: page === "home" ? 1 : 0.7,
      });
    }
  }

  for (const industry of activeIndustries()) {
    for (const locale of LOCALES) {
      entries.push({
        url: absoluteUrl(industryPath(locale, industry.slug)),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  entries.push({
    url: absoluteUrl("/datenschutz"),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.2,
  });

  return entries;
}
