import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Banknote, Clock, GraduationCap, Languages } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { NGANH_HOC } from "@/data/ausbildung";
import { industryById } from "@/data/industries";

export const metadata: Metadata = {
  title: "Du học nghề Đức — Học nghề, có lương, xây dựng tương lai tại châu Âu",
  description:
    "Chương trình đào tạo kép tại Đức: học nghề ba năm, nhận trợ cấp hằng tháng, bằng nghề được công nhận toàn EU. Mười ngành đào tạo và bốn bước tham gia.",
};

/** Ảnh minh hoạ cho từng ngành đào tạo, lấy trong kho ảnh nghề đã có */
const ANH: Record<string, string> = {
  "dieu-duong": "/assets/jobs/soziales/02-portrait-work-3x4.jpg",
  "nha-hang-khach-san": "/assets/jobs/gastronomie/02-portrait-work-3x4.jpg",
  "co-khi": "/assets/jobs/mechanik/02-portrait-work-3x4.jpg",
  dien: "/assets/jobs/elektro/02-portrait-work-3x4.jpg",
  "xay-dung": "/assets/jobs/mechanik/04-detail-closeup.jpg",
  logistics: "/assets/jobs/logistik/02-portrait-work-3x4.jpg",
  "thuc-pham": "/assets/jobs/handel/02-portrait-work-3x4.jpg",
  cntt: "/assets/jobs/it/02-portrait-work-3x4.jpg",
};

const BUOC = [
  { so: "01", ten: "Học tiếng", mo: "Đạt trình độ tiếng Đức theo yêu cầu của ngành, thường là B1 hoặc B2." },
  { so: "02", ten: "Chuẩn bị hồ sơ", mo: "Dịch thuật, công nhận bằng cấp và hoàn thiện bộ hồ sơ theo mẫu Đức." },
  { so: "03", ten: "Ký hợp đồng Ausbildung", mo: "Phỏng vấn với doanh nghiệp đào tạo và nhận hợp đồng học nghề." },
  { so: "04", ten: "Sang Đức học và làm", mo: "Nhập học, bắt đầu đào tạo kép và nhận trợ cấp hằng tháng." },
];

const LOI_ICH = [
  { Icon: GraduationCap, ten: "Học lý thuyết + thực hành", mo: "70% thời gian làm thật tại doanh nghiệp, 30% học tại trường nghề công lập." },
  { Icon: Banknote, ten: "Nhận lương hàng tháng", mo: "Doanh nghiệp trả trợ cấp trong suốt thời gian đào tạo, không đóng học phí." },
  { Icon: BadgeCheck, ten: "Bằng nghề Đức", mo: "Chứng chỉ do IHK hoặc HWK cấp, được công nhận trong toàn khối EU." },
  { Icon: Languages, ten: "Cơ hội sau tốt nghiệp", mo: "Ở lại làm việc đúng nghề, thu nhập cao hơn và thuận lợi cho cư trú lâu dài." },
];

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/jobs/elektro/01-hero-16x9.jpg"
        nhan="Ausbildung — đào tạo kép"
        tieuDe={
          <>
            Du học nghề Đức
            <span className="mt-2 block text-[0.52em] font-normal text-[var(--nb-gold-soft)]">
              Học nghề – Có lương – Xây dựng tương lai tại châu Âu
            </span>
          </>
        }
        mo="Đào tạo kép là mô hình riêng của nước Đức: học tại trường nghề công lập và làm thật tại doanh nghiệp, có trợ cấp hằng tháng và bằng nghề được công nhận toàn EU."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <NavLink href="#nganh-nghe" className="nb-btn h-12 px-7 text-[15px]">
            Khám phá ngành nghề
            <ArrowRight size={16} />
          </NavLink>
          <NavLink href="/lien-he" className="nb-btn-ghost h-12 px-7 text-[15px]">
            Kiểm tra điều kiện
          </NavLink>
        </div>
      </PageHero>

      {/* ---------- EXPLORER NGÀNH ---------- */}
      <section id="nganh-nghe" className="nb-wrap py-16">
        <h2 className="nb-display text-[30px] text-white">Khám phá ngành nghề du học nghề Đức</h2>
        <p className="mt-3 max-w-[70ch] text-[15px] text-[var(--nb-text-dim)]">
          Trợ cấp ghi dưới đây là khoảng tham khảo theo mặt bằng ngành, tính theo lương gộp mỗi tháng. Mức thật ghi
          trong hợp đồng học nghề của từng doanh nghiệp.
        </p>

        <ul className="nb-no-scrollbar mt-9 flex gap-5 overflow-x-auto pb-3">
          {NGANH_HOC.map((n) => (
            <li key={n.id} className="w-[268px] shrink-0">
              <NavLink href={`/du-hoc-nghe/${n.id}`} className="nb-card group block h-full overflow-hidden">
                <span className="relative block h-[172px] overflow-hidden">
                  <Image
                    src={ANH[n.id] ?? "/assets/jobs/logistik/01-hero-16x9.jpg"}
                    alt=""
                    fill
                    sizes="268px"
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(7,21,37,.05) 45%, rgba(7,21,37,.9))" }}
                    aria-hidden="true"
                  />
                </span>
                <span className="block p-5">
                  <b className="block text-[17px] font-semibold text-white">{n.ten}</b>
                  <span className="mt-0.5 block text-[12px] text-[var(--nb-text-mute)] italic">{n.tenDuc}</span>

                  <span className="mt-4 space-y-2 border-t border-[var(--nb-line-soft)] pt-3.5 text-[13px]">
                    <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                      <Clock size={13} className="text-[var(--nb-gold)]" />
                      {n.nam}
                    </span>
                    <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                      <Banknote size={13} className="text-[var(--nb-gold)]" />
                      {n.troCap[0].toLocaleString("de-DE")} – {n.troCap[2].toLocaleString("de-DE")} €/tháng
                    </span>
                    <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                      <Languages size={13} className="text-[var(--nb-gold)]" />
                      {n.tieng}
                    </span>
                  </span>

                  <span className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--nb-gold-soft)]">
                    Xem chi tiết
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- BỐN BƯỚC ---------- */}
      <section className="border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-16">
        <div className="nb-wrap">
          <h2 className="nb-display text-[30px] text-white">Du học nghề Đức hoạt động như thế nào?</h2>
          <ol className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {BUOC.map((b) => (
              <li key={b.so} className="nb-panel p-6">
                <b className="nb-gold-text nb-display block text-[30px] leading-none">{b.so}</b>
                <b className="mt-3 block text-[17px] font-semibold text-white">{b.ten}</b>
                <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{b.mo}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- KHỐI SPLIT ---------- */}
      <section className="nb-wrap grid items-center gap-10 py-16 lg:grid-cols-2">
        <span className="relative block aspect-[4/3] overflow-hidden rounded-[16px] border border-[var(--nb-line-soft)]">
          <Image
            src="/assets/jobs/mechanik/03-portrait-team-3x4.jpg"
            alt="Học viên thực hành tại xưởng đào tạo"
            fill
            sizes="(min-width:1024px) 640px, 100vw"
            className="object-cover"
          />
        </span>

        <div>
          <p className="nb-eyebrow">Vì sao chọn đào tạo kép</p>
          <h2 className="nb-display mt-3 text-[30px] text-white">Ba năm học nghề, cả đời có nghề</h2>
          <ul className="mt-7 space-y-5">
            {LOI_ICH.map(({ Icon, ten, mo }) => (
              <li key={ten} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--nb-line)] text-[var(--nb-gold)]">
                  <Icon size={19} />
                </span>
                <span>
                  <b className="block text-[16px] font-semibold text-white">{ten}</b>
                  <span className="mt-1 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{mo}</span>
                </span>
              </li>
            ))}
          </ul>
          <NavLink href="/lien-he" className="nb-btn mt-8 h-12 px-7 text-[15px]">
            Đăng ký tư vấn du học nghề
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </section>
    </div>
  );
}
