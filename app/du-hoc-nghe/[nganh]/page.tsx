import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Languages, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { NGANH_HOC, nganhTheoId } from "@/data/ausbildung";

export const dynamicParams = false;

export function generateStaticParams() {
  return NGANH_HOC.map((n) => ({ nganh: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ nganh: string }> }): Promise<Metadata> {
  const { nganh } = await params;
  const n = nganhTheoId(nganh);
  if (!n) return {};
  return { title: `Du học nghề ${n.ten} (${n.tenDuc})`, description: n.tomTat };
}

const ANH: Record<string, string> = {
  "dieu-duong": "/assets/jobs/soziales/01-hero-16x9.jpg",
  "nha-hang-khach-san": "/assets/jobs/gastronomie/01-hero-16x9.jpg",
  "co-khi": "/assets/jobs/mechanik/01-hero-16x9.jpg",
  dien: "/assets/jobs/elektro/01-hero-16x9.jpg",
  "xay-dung": "/assets/jobs/mechanik/04-detail-closeup.jpg",
  logistics: "/assets/jobs/logistik/01-hero-16x9.jpg",
  "thuc-pham": "/assets/jobs/handel/01-hero-16x9.jpg",
  cntt: "/assets/jobs/it/01-hero-16x9.jpg",
};

export default async function Page({ params }: { params: Promise<{ nganh: string }> }) {
  const { nganh } = await params;
  const n = nganhTheoId(nganh);
  if (!n) notFound();

  const khac = NGANH_HOC.filter((x) => x.id !== n.id).slice(0, 4);
  const caoNhat = n.troCap[2];

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh={ANH[n.id] ?? "/assets/jobs/logistik/01-hero-16x9.jpg"}
        nhan={`Ausbildung · ${n.nam}`}
        tieuDe={`Du học nghề ${n.ten}`}
        mo={n.tomTat}
        loiTat={[
          { nhan: "Xem đơn hàng ngành này", href: `/don-hang?nganh=${n.id}` },
          { nhan: "Đăng ký tư vấn", href: "/lien-he" },
          { nhan: "Các ngành khác", href: "/du-hoc-nghe" },
        ]}
      />

      <section className="nb-wrap py-10 sm:py-14">
        <p className="text-[14px] text-[var(--nb-text-mute)] italic">Tên nghề theo hệ thống Đức: {n.tenDuc}</p>

        <h2 className="nb-display mt-8 text-[22px] text-white sm:text-[26px]">Trợ cấp tăng dần qua từng năm</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {n.troCap.map((v, i) => (
            <li key={i} className="nb-panel p-5 sm:p-6">
              <span className="nb-eyebrow">Năm {i + 1}</span>
              <b className="nb-gold-text nb-display mt-2 block text-[27px] leading-none sm:text-[30px]">
                {v.toLocaleString("de-DE")} €
              </b>
              <span className="mt-1 block text-[12.5px] text-[var(--nb-text-mute)]">mỗi tháng, lương gộp</span>
              <span className="mt-4 block h-2 w-full overflow-hidden rounded-full bg-[var(--nb-navy-900)]" aria-hidden="true">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.round((v / caoNhat) * 100)}%`,
                    background: "linear-gradient(90deg, var(--nb-gold-soft), var(--nb-gold-strong))",
                  }}
                />
              </span>
            </li>
          ))}
        </ol>

        <div className="nb-panel mt-6 flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="shrink-0 text-[var(--nb-gold)]" />
            <div>
              <b className="block text-[15px] font-semibold text-white sm:text-[16px]">
                Sau tốt nghiệp: {n.sauNghe[0].toLocaleString("de-DE")} – {n.sauNghe[1].toLocaleString("de-DE")} € / tháng
              </b>
              <span className="mt-0.5 block text-[13px] text-[var(--nb-text-dim)]">
                Khoảng tham khảo theo mặt bằng ngành, chưa tính phụ cấp ca và thưởng.
              </span>
            </div>
          </div>
          <NavLink href="/lien-he" className="nb-btn h-12 w-full px-6 text-[14px] sm:h-11 sm:w-auto">
            Đăng ký ngành này
            <ArrowRight size={15} />
          </NavLink>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {[
            { ten: "Bạn sẽ học những gì", ds: n.hocGi },
            { ten: "Ra nghề làm ở đâu", ds: n.lamGi },
            { ten: "Nghề này hợp với ai", ds: n.hopVoi },
          ].map((k) => (
            <div key={k.ten} className="nb-panel p-5 sm:p-6">
              <b className="block text-[16px] font-semibold text-white sm:text-[17px]">{k.ten}</b>
              <ul className="mt-4 space-y-2.5">
                {k.ds.map((x) => (
                  <li key={x} className="flex gap-2.5 text-[14px] leading-[1.65] text-[var(--nb-text-dim)]">
                    <Check size={16} className="mt-[3px] shrink-0 text-[var(--nb-gold)]" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="nb-panel mt-6 p-5 sm:p-6">
          <b className="block text-[16px] font-semibold text-white sm:text-[17px]">Học xong rồi đi đâu tiếp</b>
          <p className="mt-2 text-[15px] leading-[1.75] text-[var(--nb-text-dim)]">{n.trienVong}</p>
        </div>
      </section>

      <section className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-14">
        <div className="nb-wrap">
          <h2 className="nb-display text-[21px] text-white sm:text-[24px]">Ngành đào tạo khác</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {khac.map((k) => (
              <li key={k.id}>
                <NavLink href={`/du-hoc-nghe/${k.id}`} className="nb-card group block h-full p-5">
                  <b className="block text-[16px] font-semibold text-white">{k.ten}</b>
                  <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--nb-text-dim)]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[var(--nb-gold)]" />
                      {k.nam}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Languages size={12} className="text-[var(--nb-gold)]" />
                      {k.tieng.split(",")[0]}
                    </span>
                  </span>
                  <span className="nb-gold-text mt-3 block text-[16px] font-bold">
                    từ {k.troCap[0].toLocaleString("de-DE")} €
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
