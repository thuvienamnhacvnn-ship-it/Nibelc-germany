import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { JOBS, TONG_SUAT } from "@/data/jobs";
import { INDUSTRIES } from "@/data/industries";
import { LEGAL } from "@/data/company";

export const metadata: Metadata = {
  title: "Về NIBELC — Kết nối con người, kiến tạo cơ hội",
  description:
    "NIBELC GROUP GERMANY đồng hành cùng người Việt trên hành trình học tập và làm việc tại Đức, châu Âu.",
};

const GIA_TRI = [
  { ten: "Uy tín", mo: "Đặt lợi ích của học viên và người lao động lên hàng đầu." },
  { ten: "Minh bạch", mo: "Thông tin rõ ràng, quy trình chuyên nghiệp, không hứa suông." },
  { ten: "Đồng hành", mo: "Hỗ trợ tận tâm trước, trong và sau khi sang Đức." },
  { ten: "Phát triển bền vững", mo: "Kiến tạo tương lai lâu dài cho mỗi cá nhân." },
];

export default function Page() {
  const soNuoc = new Set(JOBS.map((j) => j.state)).size;

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/ve-chung-toi.jpg"
        nhan="NIBELC GROUP GERMANY"
        tieuDe="Kết nối con người – Kiến tạo cơ hội"
        mo="Đồng hành cùng người Việt trên hành trình học tập và làm việc tại Đức, châu Âu."
      />

      {/* ---------- CHÚNG TÔI LÀ AI ---------- */}
      <section className="nb-wrap grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="nb-display text-[32px] text-white">Chúng tôi là ai</h2>
          <span className="mt-4 mb-6 block h-px w-16 bg-[var(--nb-gold)]" aria-hidden="true" />
          <p className="text-[15.5px] leading-[1.85] text-[var(--nb-text-dim)]">
            {LEGAL.name} là cầu nối giữa người Việt và thị trường lao động, giáo dục nghề nghiệp tại Đức và châu Âu.
          </p>
          <p className="mt-4 text-[15.5px] leading-[1.85] text-[var(--nb-text-dim)]">
            Chúng tôi mang đến cơ hội việc làm, du học nghề và phát triển sự nghiệp bền vững thông qua mạng lưới đối tác
            uy tín, quy trình chuyên nghiệp và đội ngũ giàu kinh nghiệm. Với sự am hiểu văn hoá, luật pháp và thị trường
            địa phương, NIBELC đồng hành cùng học viên và người lao động trên toàn bộ hành trình — từ Việt Nam đến khi
            ổn định cuộc sống và công việc tại Đức.
          </p>
          <NavLink href="/lien-he" className="nb-btn mt-8 h-12 px-7 text-[15px]">
            Bắt đầu hành trình cùng NIBELC
            <ArrowRight size={16} />
          </NavLink>
        </div>

        <span className="relative block aspect-[4/3] overflow-hidden rounded-[16px] border border-[var(--nb-line-soft)]">
          <Image
            src="/assets/jobs/it/03-portrait-team-3x4.jpg"
            alt="Đội ngũ NIBELC"
            fill
            sizes="(min-width:1024px) 640px, 100vw"
            className="object-cover"
          />
        </span>
      </section>

      {/* ---------- CON SỐ ---------- */}
      <section className="border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-14">
        <div className="nb-wrap">
          <h2 className="nb-display text-[28px] text-white">Những con số tạo nên niềm tin</h2>
          <ul className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { so: String(JOBS.length), nhan: "đơn hàng đang tuyển", mo: "Cập nhật theo thông báo tuyển dụng thật" },
              { so: String(TONG_SUAT), nhan: "suất tuyển", mo: "Tổng số suất của các đơn đang mở" },
              { so: String(soNuoc), nhan: "quốc gia", mo: "Đức và các nước châu Âu lân cận" },
              { so: String(INDUSTRIES.length), nhan: "nhóm ngành nghề", mo: "Từ điều dưỡng tới công nghệ thông tin" },
            ].map((x) => (
              <li key={x.nhan}>
                <b className="nb-gold-text nb-display block text-[46px] leading-none">{x.so}</b>
                <b className="mt-2 block text-[15px] font-semibold text-white">{x.nhan}</b>
                <span className="mt-1 block text-[13px] leading-[1.6] text-[var(--nb-text-dim)]">{x.mo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- GIÁ TRỊ CỐT LÕI ---------- */}
      <section className="nb-wrap py-16">
        <h2 className="nb-display text-[28px] text-white">Giá trị cốt lõi</h2>
        <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GIA_TRI.map((g, i) => (
            <li key={g.ten} className="border-l border-[var(--nb-line)] pl-5">
              <span className="nb-eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <b className="nb-display mt-2 block text-[24px] text-white">{g.ten}</b>
              <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{g.mo}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- KẾT NỐI ĐỨC - VIỆT ---------- */}
      <section className="relative isolate overflow-hidden border-t border-[var(--nb-line-soft)]">
        <Image
          src="/assets/home/hero/germany-panorama.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div className="nb-wrap py-16">
          <h2 className="nb-display max-w-[20ch] text-[30px] text-white">Kết nối Việt Nam – Đức và hoà nhập châu Âu</h2>
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.8] text-[var(--nb-text-dim)]">
            Chúng tôi xây dựng cầu nối vững chắc giữa người Việt và thị trường Đức, mở ra cơ hội học tập, làm việc và
            phát triển sự nghiệp tại châu Âu.
          </p>
          <ul className="mt-9 grid gap-5 sm:grid-cols-3">
            {[
              ["Con người là trung tâm", "Mỗi hồ sơ là một con người, không phải một con số."],
              ["Cơ hội toàn cầu", "Mạng lưới đối tác tại Đức và các nước châu Âu."],
              ["Tương lai vững chắc", "Từ tri thức và nghề nghiệp, không phải may rủi."],
            ].map(([t, m]) => (
              <li key={t} className="nb-panel p-6">
                <b className="block text-[16px] font-semibold text-[var(--nb-gold-soft)]">{t}</b>
                <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
