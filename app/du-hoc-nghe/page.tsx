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
  // Dùng bản 16:9 của từng nghề. Bản portrait 3:4 khi ép vào ô ngang sẽ cắt
  // ngang mặt người, nhìn rất xấu.
  "dieu-duong": "/assets/jobs/soziales/01-hero-16x9.jpg",
  "nha-hang-khach-san": "/assets/jobs/gastronomie/01-hero-16x9.jpg",
  "co-khi": "/assets/jobs/mechanik/01-hero-16x9.jpg",
  dien: "/assets/jobs/elektro/01-hero-16x9.jpg",
  "xay-dung": "/assets/jobs/mechanik/04-detail-closeup.jpg",
  logistics: "/assets/jobs/logistik/01-hero-16x9.jpg",
  "thuc-pham": "/assets/jobs/handel/01-hero-16x9.jpg",
  cntt: "/assets/jobs/it/01-hero-16x9.jpg",
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
        anh="/assets/banners/du-hoc-nghe.jpg"
        anhDoc="/assets/banners/mobile/du-hoc-nghe.jpg"
        nhan="Ausbildung — đào tạo kép"
        tieuDe={
          <>
            Du học nghề Đức
            <span className="mt-2 block text-[15px] font-normal text-[var(--nb-gold-soft)] sm:text-[0.52em]">
              Học nghề – Có lương – Xây dựng tương lai tại châu Âu
            </span>
          </>
        }
        mo="Đào tạo kép là mô hình riêng của nước Đức: học tại trường nghề công lập và làm thật tại doanh nghiệp, có trợ cấp hằng tháng và bằng nghề được công nhận toàn EU."
      >
        <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
          <NavLink href="#nganh-nghe" className="nb-btn h-12 w-full px-7 text-[15px] sm:w-auto">
            Khám phá ngành nghề
            <ArrowRight size={16} />
          </NavLink>
          <NavLink href="/lien-he" className="nb-btn-ghost h-12 w-full px-7 text-[15px] sm:w-auto">
            Kiểm tra điều kiện
          </NavLink>
        </div>
      </PageHero>

      {/* ---------- EXPLORER NGÀNH ---------- */}
      <section id="nganh-nghe" className="nb-wrap py-11 sm:py-16">
        <h2 className="nb-display text-[24px] text-white sm:text-[30px]">Khám phá ngành nghề du học nghề Đức</h2>
        <p className="mt-3 max-w-[70ch] text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)] sm:text-[15px]">
          Trợ cấp ghi dưới đây là khoảng tham khảo theo mặt bằng ngành, tính theo lương gộp mỗi tháng. Mức thật ghi
          trong hợp đồng học nghề của từng doanh nghiệp.
        </p>

        <ul className="nb-no-scrollbar mt-7 flex gap-4 overflow-x-auto pb-3 sm:mt-9 sm:gap-5">
          {NGANH_HOC.map((n) => (
            <li key={n.id} className="w-[250px] shrink-0 sm:w-[268px]">
              <NavLink href={`/du-hoc-nghe/${n.id}`} className="nb-card group block h-full overflow-hidden">
                <span className="relative block h-[172px] overflow-hidden">
                  <Image
                    src={ANH[n.id] ?? "/assets/jobs/logistik/01-hero-16x9.jpg"}
                    alt=""
                    fill
                    sizes="(min-width:640px) 268px, 250px"
                    className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                  />
                  {/* Dải chuyển tiếp CHỈ Ở ĐÁY, không phủ cả tấm ảnh — xem
                      lý do giống JobCard. */}
                  <span
                    className="absolute inset-x-0 bottom-0 h-[55%]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgb(var(--nb-navy-900-rgb) / 0), rgb(var(--nb-navy-900-rgb) / .9))",
                    }}
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
      <section className="border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-16">
        <div className="nb-wrap">
          <h2 className="nb-display text-[24px] text-white sm:text-[30px]">Du học nghề Đức hoạt động như thế nào?</h2>
          <ol className="mt-7 grid gap-4 sm:mt-9 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {BUOC.map((b) => (
              <li key={b.so} className="nb-panel p-5 sm:p-6">
                <b className="nb-gold-text nb-display block text-[27px] leading-none sm:text-[30px]">{b.so}</b>
                <b className="mt-3 block text-[17px] font-semibold text-white">{b.ten}</b>
                <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{b.mo}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- KHỐI SPLIT ---------- */}
      <section className="nb-wrap grid items-center gap-8 py-11 sm:gap-10 sm:py-16 lg:grid-cols-2">
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
          <h2 className="nb-display mt-3 text-[24px] text-white sm:text-[30px]">Ba năm học nghề, cả đời có nghề</h2>
          <ul className="mt-6 space-y-5 sm:mt-7">
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
          <NavLink href="/lien-he" className="nb-btn mt-8 h-12 w-full px-6 text-center text-[15px] sm:w-auto sm:px-7">
            Đăng ký tư vấn du học nghề
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </section>
    </div>
  );
}
