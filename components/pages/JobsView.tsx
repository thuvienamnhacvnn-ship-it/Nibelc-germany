import { SubShell } from "@/components/sub/SubShell";
import { JobExplorer, type ExplorerCopy } from "@/components/jobs/JobExplorer";
import { Stat } from "@/components/sub/bits";
import { activeIndustries, industryName } from "@/content/industries";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG 02 — "Danh sách đơn hàng" theo bộ KIT navy–vàng.
 *
 * Bố cục cũ (thẻ dọc nền trắng, xổ hết nội dung từng đơn) đã bỏ hẳn. Nay là
 * giao diện tìm việc: banner điện ảnh + số liệu thật, hàng bộ lọc, cột đếm
 * bên trái và danh sách thẻ ngang dẫn sang trang chi tiết từng đơn.
 */

const COPY: Record<Locale, ExplorerCopy> = {
  de: {
    locTatCa: "Alle Länder",
    quocGia: "Land",
    nganhNghe: "Branche",
    mucLuong: "Vergütung",
    tim: "Suchen",
    xemChiTiet: "Details ansehen",
    khongCo: "Für diese Auswahl gibt es derzeit keinen Auftrag.",
    ketQua: "Aufträge",
    moiMuc: "Auftrag",
    khac: "Weitere",
  },
  en: {
    locTatCa: "All countries",
    quocGia: "Country",
    nganhNghe: "Industry",
    mucLuong: "Pay",
    tim: "Search",
    xemChiTiet: "View details",
    khongCo: "No assignment matches this selection right now.",
    ketQua: "assignments",
    moiMuc: "assignment",
    khac: "Other",
  },
  vi: {
    locTatCa: "Tất cả quốc gia",
    quocGia: "Quốc gia",
    nganhNghe: "Ngành nghề",
    mucLuong: "Mức lương",
    tim: "Tìm kiếm",
    xemChiTiet: "Xem chi tiết",
    khongCo: "Hiện chưa có đơn hàng nào khớp lựa chọn này.",
    ketQua: "đơn hàng",
    moiMuc: "đơn hàng",
    khac: "Khác",
  },
};

export function JobsView({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];
  const jobs = allJobs(locale);
  const nganhs = activeIndustries().map((i) => [i.slug, industryName(i, locale)] as [string, string]);
  const soNuoc = new Set(jobs.map((j) => j.country)).size;
  const soSuat = jobs.reduce((n, j) => n + (j.slots ?? 0), 0);

  return (
    <SubShell
      locale={locale}
      page="jobs"
      hero={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.hero}
      heroFocus="55% 40%"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-x-14 gap-y-6">
          <Stat value={String(jobs.length)} label={COPY[locale].ketQua} />
          <Stat value={String(soNuoc)} label={COPY[locale].quocGia} />
          <Stat value={String(soSuat)} label={t.slots} />
        </div>
      }
    >
      <JobExplorer locale={locale} jobs={jobs} nganhs={nganhs} copy={COPY[locale]} perMonth={t.perMonth} slotsLabel={t.slots} />

      <section className="border-t border-white/10">
        <p className="mx-auto max-w-[1560px] px-6 py-10 text-[13.5px] leading-[1.75] text-white/45 lg:px-12">{t.note}</p>
      </section>
    </SubShell>
  );
}
