import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { JobBrowser } from "@/components/jobs/JobBrowser";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { activeIndustries, industryName } from "@/content/industries";
import { JOBS_COPY, JOB_ORDERS } from "@/content/jobs-current";
import type { Locale } from "@/content/locales";

/**
 * Trang "đơn hàng đang chạy" — các vị trí đang tuyển, đọc từ
 * `content/jobs-current.ts`. Ảnh tin gốc chỉ hiện ở bản tiếng Việt: tin in
 * kèm giới hạn tuổi và giới tính, thứ mà tin tuyển dụng ở Đức không được nêu.
 */
export function JobsView({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];

  return (
    <PageShell
      locale={locale}
      page="jobs"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero}
      heroFocus="55% 40%"
    >
      <Suspense fallback={null}>
      <JobBrowser
        locale={locale}
        jobs={JOB_ORDERS}
        industries={activeIndustries().map((i) => ({ slug: i.slug, name: industryName(i, locale) }))}
      />
      </Suspense>

      <p className="mx-auto max-w-[1400px] px-5 pb-12 text-sm leading-6 text-[#5b6b80] lg:px-10">{t.note}</p>

    </PageShell>
  );
}
