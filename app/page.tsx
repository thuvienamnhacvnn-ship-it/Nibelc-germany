import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BangChayDonHang } from "@/components/home/BangChayDonHang";
import { NavLink } from "@/components/layout/NavLink";
import { JobCard } from "@/components/jobs/JobCard";
import { INDUSTRIES } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { donGoiY, donHangTheoNgonNgu, donHeroTheoNganh } from "@/components/home/du-lieu";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { home } from "@/lib/i18n/dict/home";

// Tiêu đề trang chủ KHÔNG khai ở đây: layout đã đặt title.default theo ngôn
// ngữ (common.meta.tieuDe) — trang gốc cùng đoạn route với layout nên
// template "%s · NIBELC GROUP" không áp vào, ra đúng chuỗi cũ.

const HREF_CHUONG_TRINH = ["/don-hang", "/du-hoc-nghe"];

export default async function Page() {
  const lang = await getLang();
  const tx = t(home, lang);
  const ds = donHangTheoNgonNgu(lang);
  const noiBat = [...ds].sort((a, b) => b.gallery.length - a.gallery.length).slice(0, 6);

  return (
    <>
      <Hero
        donTheoNganh={donHeroTheoNganh(ds)}
        goiYDon={donGoiY(ds)}
        nganh={INDUSTRIES.map((n) => ({ id: n.id, ten: tenNganh(n, lang), tenVi: n.titleVi, tenDe: n.titleDe }))}
      />

      {/* Dãy bốn con số trước đây chỉ để ngắm. Thay bằng băng ảnh đơn hàng
          thật chạy ngang, bấm được, rê chuột thì dừng. */}
      <BangChayDonHang ds={noiBat} />

      {/* ---------- ĐƠN HÀNG NỔI BẬT ---------- */}
      <section className="nb-wrap py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="nb-eyebrow">{tx.noiBat.nhan}</p>
            <h2 className="nb-display mt-3 text-[38px]">{tx.noiBat.tieuDe}</h2>
            <p className="mt-3 max-w-[58ch] text-[15px] text-[var(--nb-text-dim)]">{tx.noiBat.mo}</p>
          </div>
          <NavLink href="/don-hang" className="nb-btn-ghost h-11 px-6 text-[14px]">
            {tx.noiBat.tatCa}
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
          {tx.chuongTrinh.map((c, i) => (
            <div key={HREF_CHUONG_TRINH[i]} className="nb-panel p-8">
              <p className="nb-eyebrow">{c.nhan}</p>
              <h3 className="nb-display mt-3 text-[26px] text-white">{c.tieuDe}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--nb-text-dim)]">{c.mo}</p>
              <NavLink href={HREF_CHUONG_TRINH[i] ?? "/"} className="nb-btn mt-7 h-11 px-6 text-[14px]">
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
