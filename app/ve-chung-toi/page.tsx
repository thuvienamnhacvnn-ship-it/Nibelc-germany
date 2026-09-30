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
        anh="/assets/home/hero-anh.jpg"
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

        {/* Bốn nhóm ngành tiêu biểu thay cho một tấm ảnh minh hoạ chung chung.
            Ảnh nào cũng là người Việt đang làm nghề đó tại Đức, đúng thứ công
            ty làm — không phải ảnh doanh nhân mượn tạm. */}
        <ul className="grid grid-cols-2 gap-3.5">
          {[
            { id: "pflege", ten: "Điều dưỡng / Y tế" },
            { id: "gastronomie", ten: "Nhà hàng / Khách sạn" },
            { id: "elektro", ten: "Điện / Điện tử" },
            { id: "bau", ten: "Xây dựng / Nội thất" },
          ].map((x, i) => (
            <li
              key={x.id}
              className={`relative block aspect-[4/3] overflow-hidden rounded-[14px] border border-[var(--nb-line-soft)] ${
                i % 3 === 0 ? "sm:mt-6" : ""
              }`}
            >
              <Image
                src={`/assets/nghe/${x.id}.jpg`}
                alt={x.ten}
                fill
                sizes="(min-width:1024px) 300px, 45vw"
                className="object-cover"
              />
              <span
                className="absolute inset-x-0 bottom-0 h-[58%]"
                style={{ background: "linear-gradient(180deg, transparent, rgba(4,9,18,.9))" }}
                aria-hidden="true"
              />
              <b className="absolute inset-x-0 bottom-0 px-3.5 pb-3 text-[13px] font-semibold text-white">
                {x.ten}
              </b>
            </li>
          ))}
        </ul>
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

      {/* ---------- CHÚNG TÔI LÀM GÌ ---------- */}
      <section className="nb-wrap py-16">
        <h2 className="nb-display text-[28px] text-white">Chúng tôi làm gì</h2>
        <span className="mt-4 mb-9 block h-px w-16 bg-[var(--nb-gold)]" aria-hidden="true" />
        <ul className="grid gap-6 lg:grid-cols-3">
          {[
            {
              anh: "/assets/nghe/logistik.jpg",
              ten: "Đơn hàng việc làm",
              mo: "Tuyển chọn và giới thiệu vị trí tại doanh nghiệp Đức và châu Âu, theo đúng thông báo tuyển dụng của đối tác.",
              href: "/don-hang",
              nut: "Xem đơn hàng",
            },
            {
              anh: "/assets/nghe/pflege.jpg",
              ten: "Du học nghề Ausbildung",
              mo: "Chương trình học nghề kép tại Đức: vừa học vừa làm, có lương đào tạo và bằng nghề được công nhận.",
              href: "/du-hoc-nghe",
              nut: "Tìm hiểu ngành",
            },
            {
              anh: "/assets/nghe/soziales.jpg",
              ten: "Đồng hành trọn hành trình",
              mo: "Từ hồ sơ, tiếng Đức, visa cho tới khi ổn định công việc và cuộc sống tại nước sở tại.",
              href: "/lo-trinh",
              nut: "Xem lộ trình",
            },
          ].map((x) => (
            <li key={x.ten} className="nb-card flex h-full flex-col overflow-hidden">
              <span className="relative block aspect-video overflow-hidden">
                <Image src={x.anh} alt="" fill sizes="(min-width:1024px) 420px, 100vw" className="object-cover" />
                <span
                  className="absolute inset-x-0 bottom-0 h-[52%]"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(4,9,18,.9))" }}
                  aria-hidden="true"
                />
              </span>
              <span className="flex flex-1 flex-col p-6">
                <b className="nb-display block text-[21px] text-white">{x.ten}</b>
                <span className="mt-2.5 block text-[14px] leading-[1.75] text-[var(--nb-text-dim)]">{x.mo}</span>
                <NavLink href={x.href} className="nb-btn-ghost mt-auto h-11 w-fit px-5 pt-0 text-[14px]">
                  {x.nut}
                  <ArrowRight size={15} />
                </NavLink>
              </span>
            </li>
          ))}
        </ul>
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
      <section className="relative isolate overflow-hidden border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]">
        <span className="nb-gold-rule absolute inset-x-0 top-0 opacity-50" aria-hidden="true" />
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
