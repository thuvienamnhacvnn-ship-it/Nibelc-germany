import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Banknote, Clock, GraduationCap, Languages } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { getNganhHoc } from "@/data/i18n/ausbildung";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { duHocNghe } from "@/lib/i18n/dict/du-hoc-nghe";
import { khoangTien } from "@/lib/i18n/format";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(duHocNghe, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

/** Ảnh minh hoạ cho từng ngành đào tạo, lấy trong kho ảnh nghề đã có */
const ANH: Record<string, string> = {
  // Dùng bản 16:9 của từng nghề. Bản portrait 3:4 khi ép vào ô ngang sẽ cắt
  // ngang mặt người, nhìn rất xấu.
  // Ảnh điều dưỡng thật (nữ điều dưỡng áo blouse xanh trong viện dưỡng lão) — trước
  // đây trỏ nhầm ảnh nhóm Soziales là đầu bếp cắt thịt.
  "dieu-duong": "/assets/nghe/pflege.jpg",
  "nha-hang-khach-san": "/assets/jobs/gastronomie/01-hero-16x9.jpg",
  "co-khi": "/assets/jobs/mechanik/01-hero-16x9.jpg",
  dien: "/assets/jobs/elektro/01-hero-16x9.jpg",
  "xay-dung": "/assets/jobs/mechanik/04-detail-closeup.jpg",
  logistics: "/assets/jobs/logistik/01-hero-16x9.jpg",
  "thuc-pham": "/assets/jobs/handel/01-hero-16x9.jpg",
  cntt: "/assets/jobs/it/01-hero-16x9.jpg",
};

/** Icon cho 4 lợi ích — chữ ở lib/i18n/dict/du-hoc-nghe.ts (viSao.loiIch), cùng thứ tự */
const ICON_LOI_ICH = [GraduationCap, Banknote, BadgeCheck, Languages];

export default async function Page() {
  const lang = await getLang();
  const tx = t(duHocNghe, lang);
  const NGANH_HOC = getNganhHoc(lang);
  // tenDuc là tên nghề tiếng Đức: ở bản vi/en đánh dấu lang="de"
  const langTenDuc = lang === "de" ? undefined : "de";

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/du-hoc-nghe.jpg"
        anhDoc="/assets/banners/mobile/du-hoc-nghe.jpg"
        anhBenPhai
        nhan={tx.hero.nhan}
        tieuDe={
          <>
            {tx.hero.tieuDe}
            <span className="mt-2 block text-[15px] font-normal text-[var(--nb-gold-soft)] sm:text-[0.52em]">
              {tx.hero.phuDe}
            </span>
          </>
        }
        mo={tx.hero.mo}
      >
        <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 lg:mt-5">
          <NavLink href="#nganh-nghe" className="nb-btn h-12 w-full px-7 text-[15px] sm:w-auto lg:h-11 lg:px-6">
            {tx.hero.khamPha}
            <ArrowRight size={16} />
          </NavLink>
          <NavLink href="/lien-he" className="nb-btn-ghost h-12 w-full px-7 text-[15px] sm:w-auto lg:h-11 lg:px-6">
            {tx.hero.kiemTra}
          </NavLink>
        </div>
      </PageHero>

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* ---------- EXPLORER NGÀNH ---------- */}
        <section id="nganh-nghe" className="nb-wrap py-11 sm:py-16 lg:py-20">
          <h2 className="nb-display text-[24px] text-white sm:text-[30px] lg:text-[32px]">{tx.nganh.tieuDe}</h2>
          <p className="mt-3 max-w-[70ch] text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)] sm:text-[15px]">
            {tx.nganh.ghiChu}
          </p>

          {/* Máy tính: lưới 4 cột x 2 hàng, đủ 8 ngành, không còn hàng cuộn bị cắt mép phải */}
          <ul className="nb-no-scrollbar mt-7 flex gap-4 overflow-x-auto pb-3 sm:mt-9 sm:gap-5 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
            {NGANH_HOC.map((n) => (
              <li key={n.id} className="w-[250px] shrink-0 sm:w-[268px] lg:w-auto lg:min-w-0">
                <NavLink href={`/du-hoc-nghe/${n.id}`} className="nb-card group block h-full overflow-hidden">
                  <span className="relative block h-[172px] overflow-hidden">
                    <Image
                      src={ANH[n.id] ?? "/assets/jobs/logistik/01-hero-16x9.jpg"}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 330px, (min-width:640px) 268px, 250px"
                      className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                    />
                    {/* Dải chuyển tiếp CHỈ Ở ĐÁY, CHỈ Ở ĐIỆN THOẠI (phiên mobile) —
                        máy tính bỏ hẳn theo luật cấm phủ lớp lên ảnh. */}
                    <span
                      className="absolute inset-x-0 bottom-0 h-[55%] lg:hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, rgb(var(--nb-navy-900-rgb) / 0), rgb(var(--nb-navy-900-rgb) / .9))",
                      }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="block p-5">
                    {/* break-words: tên ngành tiếng Đức có từ ghép dài */}
                    <b className="block text-[17px] font-semibold break-words text-white">{n.ten}</b>
                    <span lang={langTenDuc} className="mt-0.5 block text-[12px] text-[var(--nb-text-mute)] italic">
                      {n.tenDuc}
                    </span>

                    <span className="mt-4 space-y-2 border-t border-[var(--nb-line-soft)] pt-3.5 text-[13px]">
                      <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                        <Clock size={13} className="shrink-0 text-[var(--nb-gold)]" />
                        {n.nam}
                      </span>
                      <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                        <Banknote size={13} className="shrink-0 text-[var(--nb-gold)]" />
                        {khoangTien(n.troCap[0], n.troCap[2], lang)}
                      </span>
                      <span className="flex items-center gap-2 text-[var(--nb-text-dim)]">
                        <Languages size={13} className="shrink-0 text-[var(--nb-gold)]" />
                        {n.tieng}
                      </span>
                    </span>

                    <span className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--nb-gold-soft)]">
                      {tx.nganh.xemChiTiet}
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- BỐN BƯỚC ---------- */}
        <section className="border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-16 lg:py-20">
          <div className="nb-wrap">
            <h2 className="nb-display text-[24px] text-white sm:text-[30px] lg:text-[32px]">{tx.buoc.tieuDe}</h2>
            <ol className="mt-7 grid gap-4 sm:mt-9 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
              {tx.buoc.ds.map((b) => (
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
        <section className="nb-wrap grid items-center gap-8 py-11 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <span className="relative block aspect-[4/3] overflow-hidden rounded-[16px] border border-[var(--nb-line-soft)]">
            <Image
              src="/assets/jobs/mechanik/03-portrait-team-3x4.jpg"
              alt={tx.viSao.altAnh}
              fill
              sizes="(min-width:1024px) 640px, 100vw"
              className="object-cover"
            />
          </span>

          <div>
            <p className="nb-eyebrow">{tx.viSao.nhan}</p>
            <h2 className="nb-display mt-3 text-[24px] text-white sm:text-[30px] lg:text-[32px]">{tx.viSao.tieuDe}</h2>
            <ul className="mt-6 space-y-5 sm:mt-7">
              {tx.viSao.loiIch.map(({ ten, mo }, i) => {
                const Icon = ICON_LOI_ICH[i] ?? GraduationCap;
                return (
                  <li key={ten} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--nb-line)] text-[var(--nb-gold)]">
                      <Icon size={19} />
                    </span>
                    <span>
                      <b className="block text-[16px] font-semibold text-white">{ten}</b>
                      <span className="mt-1 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{mo}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <NavLink href="/lien-he" className="nb-btn mt-8 h-12 w-full px-6 text-center text-[15px] sm:w-auto sm:px-7">
              {tx.viSao.nut}
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </section>
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
