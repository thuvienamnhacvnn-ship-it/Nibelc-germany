import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BangChayDonHang } from "@/components/home/BangChayDonHang";
import { NavLink } from "@/components/layout/NavLink";
import { JobCard } from "@/components/jobs/JobCard";
import { JOBS } from "@/data/jobs";

export const metadata: Metadata = {
  title: "NIBELC GROUP GERMANY — Việc làm & Du học nghề tại Đức",
};

export default function Page() {
  const noiBat = [...JOBS].sort((a, b) => b.gallery.length - a.gallery.length).slice(0, 6);

  return (
    <>
      <Hero />

      {/* Dãy bốn con số trước đây chỉ để ngắm. Thay bằng băng ảnh đơn hàng
          thật chạy ngang, bấm được, rê chuột thì dừng. */}
      <BangChayDonHang ds={noiBat} />

      {/* ---------- ĐƠN HÀNG NỔI BẬT ---------- */}
      <section className="nb-wrap py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="nb-eyebrow">Đang tuyển</p>
            <h2 className="nb-display mt-3 text-[38px]">Đơn hàng nổi bật</h2>
            <p className="mt-3 max-w-[58ch] text-[15px] text-[var(--nb-text-dim)]">
              Vị trí, thu nhập và số suất lấy đúng theo thông báo tuyển dụng của từng đơn.
            </p>
          </div>
          <NavLink href="/don-hang" className="nb-btn-ghost h-11 px-6 text-[14px]">
            Tất cả đơn hàng
            <ArrowRight size={16} />
          </NavLink>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {noiBat.map((j) => (
            <li key={j.id}>
              <JobCard job={j} />
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- HAI CHƯƠNG TRÌNH ---------- */}
      <section className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-20">
        <div className="nb-wrap grid gap-6 lg:grid-cols-2">
          {[
            {
              nhan: "Đi làm việc",
              tieuDe: "Hợp đồng lao động tại Đức và châu Âu",
              mo: "Có thu nhập ngay, chuẩn bị 4 – 8 tháng, yêu cầu tiếng A2 – B1 tuỳ đơn hàng.",
              href: "/don-hang",
              nut: "Xem đơn hàng",
            },
            {
              nhan: "Du học nghề",
              tieuDe: "Ausbildung — học nghề có lương",
              mo: "Ba năm đào tạo kép, nhận trợ cấp hằng tháng, bằng nghề Đức được công nhận toàn EU.",
              href: "/du-hoc-nghe",
              nut: "Xem ngành đào tạo",
            },
          ].map((c) => (
            <div key={c.nhan} className="nb-panel p-8">
              <p className="nb-eyebrow">{c.nhan}</p>
              <h3 className="nb-display mt-3 text-[26px] text-white">{c.tieuDe}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--nb-text-dim)]">{c.mo}</p>
              <NavLink href={c.href} className="nb-btn mt-7 h-11 px-6 text-[14px]">
                {c.nut}
                <ArrowRight size={16} />
              </NavLink>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
