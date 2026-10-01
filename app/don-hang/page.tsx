import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JobMarketplace } from "@/components/jobs/JobMarketplace";
import { JOBS, TONG_SUAT } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Đơn hàng — Cơ hội nghề nghiệp tại Đức",
  description:
    "Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn. Lọc theo ngành, thành phố, mức lương và trình độ tiếng Đức.",
};

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/don-hang.jpg"
        anhDoc="/assets/banners/mobile/don-hang.jpg"
        nhan="Sàn đơn hàng"
        tieuDe="Cơ hội nghề nghiệp tại Đức"
        mo="Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn."
        soLieu={[
          { so: String(JOBS.length), nhan: "đơn hàng" },
          { so: String(TONG_SUAT), nhan: "suất tuyển" },
        ]}
      />
      <Suspense fallback={<div className="nb-wrap py-20 text-[var(--nb-text-dim)]">Đang tải bộ lọc…</div>}>
        <JobMarketplace />
      </Suspense>
    </div>
  );
}
