import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JobMarketplace } from "@/components/jobs/JobMarketplace";
import { JOBS } from "@/data/jobs";
import { INDUSTRIES } from "@/data/industries";
import "./don-hang-sang.css";

export const metadata: Metadata = {
  title: "Đơn hàng — Cơ hội nghề nghiệp tại Đức",
  description:
    "Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn. Lọc theo ngành, thành phố, mức lương và trình độ tiếng Đức.",
};

/* Bốn nhóm ngành đang có nhiều đơn nhất — bấm là ra ngay kết quả đã lọc,
   thay cho hai con số trước đây chỉ để ngắm. */
const LOI_TAT = [
  { nhan: "Tất cả đơn hàng", href: "/don-hang" },
  ...INDUSTRIES.map((n) => ({
    nhan: n.titleVi,
    href: `/don-hang?nganh=${n.id}`,
    so: JOBS.filter((j) => j.industryId === n.id).length,
  }))
    .filter((x) => x.so > 0)
    .sort((a, b) => b.so - a.so)
    .slice(0, 4),
];

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/don-hang.jpg"
        anhDoc="/assets/banners/mobile/don-hang.jpg"
        nhan="Sàn đơn hàng"
        tieuDe="Cơ hội nghề nghiệp tại Đức"
        mo="Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn."
        loiTat={LOI_TAT}
        chuaThanhTim
      />
      <Suspense fallback={<div className="nb-wrap py-20 text-[var(--nb-text-dim)]">Đang tải bộ lọc…</div>}>
        <JobMarketplace />
      </Suspense>
    </div>
  );
}
