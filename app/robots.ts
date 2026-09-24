import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { INDUSTRIES } from "@/content/industries";
import { impressumComplete } from "@/content/legal";

/**
 * robots.txt
 *
 * Chặn tường minh route của ngành chưa duyệt. Trang đó đã có `noindex` trong
 * metadata rồi, nhưng chặn hai lớp thì một lớp hỏng vẫn còn lớp kia — đây là
 * nội dung chưa chốt, không được để lọt ra kết quả tìm kiếm.
 *
 * Impressum chưa đủ dữ liệu theo §5 TMG thì cũng không cho index.
 */
export default function robots(): MetadataRoute.Robots {
  const blocked = INDUSTRIES.filter((i) => i.status !== "active").map(
    (i) => `/branchen/${i.slug}`,
  );

  const legal = impressumComplete() ? [] : ["/impressum"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...blocked,
          ...legal,
          "/agent-center",
          "/app/",
          "/portal/",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
