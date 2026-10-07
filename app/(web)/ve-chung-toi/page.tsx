import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { demKho, layDonHang } from "@/data/nguon";
import { layNoiDung } from "@/data/nguon-noi-dung";
import { INDUSTRIES } from "@/data/industries";
import { LEGAL } from "@/data/company";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { veChungToi } from "@/lib/i18n/dict/ve-chung-toi";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(veChungToi, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

export default async function Page() {
  const lang = await getLang();
  const tx = t(veChungToi, lang);
  // Con số đếm trên dữ liệu gốc — giống nhau ở mọi ngôn ngữ.
  /* Đếm trong CSDL chứ không cộng tay: nhân viên thêm hay ẩn đơn là mấy con
     số này tự đúng, không bao giờ lệch với kho. */
  const [dem, dsGoc, b] = await Promise.all([demKho(), layDonHang("vi"), layNoiDung("ve-chung-toi.banner", lang)]);
  const soNuoc = new Set(dsGoc.map((j) => j.state)).size;

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh={b.anh}
        anhDoc={b.anhDoc}
        nhan={b.nhan}
        tieuDe={b.tieuDe}
        mo={b.mo || undefined}
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* ---------- CHÚNG TÔI LÀ AI ---------- */}
        <section className="nb-wrap grid items-center gap-9 py-11 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <h2 className="nb-display text-[25px] text-white sm:text-[32px]">{tx.ai.tieuDe}</h2>
            <span className="mt-4 mb-6 block h-px w-16 bg-[var(--nb-gold)]" aria-hidden="true" />
            <p className="text-[15px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[15.5px] sm:leading-[1.85]">
              {tx.ai.doan1(LEGAL.name)}
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[15.5px] sm:leading-[1.85]">
              {tx.ai.doan2}
            </p>
            {/* `.nb-btn` đặt white-space: nowrap, mà dòng chữ này rộng 311px —
                hơn 256px chỗ trống ở màn 320px nên nó đẩy cả trang rộng ra 343px.
                Cho phép xuống dòng và bỏ chiều cao cứng (h-12 + hai dòng thì chữ
                trào ra ngoài viên thuốc), giữ sàn 48px cho đủ tầm ngón tay.
                PHẢI dùng style nội tuyến, KHÔNG dùng lớp `whitespace-normal`:
                `.nb-btn` trong globals.css nằm NGOÀI mọi @layer nên nó thắng mọi
                lớp tiện ích của Tailwind v4 (vốn ở @layer utilities) — đã thử,
                computed white-space vẫn ra nowrap. */}
            <NavLink
              href="/lien-he"
              style={{ whiteSpace: "normal" }}
              className="nb-btn mt-8 h-auto max-w-full min-h-12 px-7 py-3 text-center text-[15px]"
            >
              {tx.ai.nut}
              <ArrowRight size={16} className="shrink-0" />
            </NavLink>
          </div>

          {/* Bốn nhóm ngành tiêu biểu thay cho một tấm ảnh minh hoạ chung chung.
              Ảnh nào cũng là người Việt đang làm nghề đó tại Đức, đúng thứ công
              ty làm — không phải ảnh doanh nhân mượn tạm. */}
          <ul className="grid grid-cols-2 gap-3.5">
            {[
              { id: "pflege", ten: tx.nganh.pflege },
              { id: "gastronomie", ten: tx.nganh.gastronomie },
              { id: "elektro", ten: tx.nganh.elektro },
              { id: "bau", ten: tx.nganh.bau },
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
                {/* Không phủ lớp tối lên ảnh: tên ngành nằm trên nhãn nền đặc riêng */}
                <b className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-20px)] rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/85 px-3 py-1 text-[12.5px] font-semibold text-white backdrop-blur-sm nb-chip-anh">
                  {x.ten}
                </b>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- CON SỐ ---------- */}
        <section className="border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-14">
          <div className="nb-wrap">
            <h2 className="nb-display text-[24px] text-white sm:text-[28px] lg:text-[32px]">{tx.conSo.tieuDe}</h2>
            <ul className="mt-7 grid gap-7 sm:mt-9 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {[
                { so: String(dem.don), nhan: tx.conSo.don.ten, mo: tx.conSo.don.mo },
                { so: String(dem.suat), nhan: tx.conSo.suat.ten, mo: tx.conSo.suat.mo },
                { so: String(soNuoc), nhan: tx.conSo.nuoc.ten, mo: tx.conSo.nuoc.mo },
                { so: String(INDUSTRIES.length), nhan: tx.conSo.nhomNganh.ten, mo: tx.conSo.nhomNganh.mo },
              ].map((x) => (
                <li key={x.nhan}>
                  <b className="nb-gold-text nb-display block text-[40px] leading-none sm:text-[46px]">{x.so}</b>
                  <b className="mt-2 block text-[15px] font-semibold text-white">{x.nhan}</b>
                  <span className="mt-1 block text-[13px] leading-[1.6] text-[var(--nb-text-dim)]">{x.mo}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- CHÚNG TÔI LÀM GÌ ---------- */}
        <section className="nb-wrap py-11 sm:py-16 lg:py-20">
          <h2 className="nb-display text-[24px] text-white sm:text-[28px] lg:text-[32px]">{tx.lamGi.tieuDe}</h2>
          <span className="mt-4 mb-7 block h-px w-16 bg-[var(--nb-gold)] sm:mb-9" aria-hidden="true" />
          <ul className="grid gap-6 lg:grid-cols-3">
            {[
              { anh: "/assets/nghe/logistik.jpg", ...tx.lamGi.don, href: "/don-hang" },
              { anh: "/assets/nghe/pflege.jpg", ...tx.lamGi.nghe, href: "/du-hoc-nghe" },
              { anh: "/assets/nghe/soziales.jpg", ...tx.lamGi.dongHanh, href: "/lo-trinh" },
            ].map((x) => (
              <li key={x.ten} className="nb-card flex h-full flex-col overflow-hidden">
                <span className="relative block aspect-video overflow-hidden">
                  <Image src={x.anh} alt="" fill sizes="(min-width:1024px) 420px, 100vw" className="object-cover" />
                </span>
                <span className="flex flex-1 flex-col p-5 sm:p-6">
                  <b className="nb-display block text-[19px] text-white sm:text-[21px]">{x.ten}</b>
                  <span className="mt-2.5 block text-[14px] leading-[1.75] text-[var(--nb-text-dim)] lg:mb-6">{x.mo}</span>
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
        {/* Máy tính: dải ngà xen kẽ (trắng / ngà / trắng / ngà / trắng) */}
        <section className="py-11 sm:py-16 lg:bg-[#F6F1E7] lg:py-20">
          <div className="nb-wrap">
            <h2 className="nb-display text-[24px] text-white sm:text-[28px] lg:text-[32px]">{tx.giaTri.tieuDe}</h2>
            <ul className="mt-7 grid gap-6 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
              {tx.giaTri.ds.map((g, i) => (
                <li key={g.ten} className="border-l border-[var(--nb-line)] pl-5">
                  <span className="nb-eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <b className="nb-display mt-2 block text-[21px] text-white sm:text-[24px]">{g.ten}</b>
                  <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{g.mo}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- KẾT NỐI ĐỨC - VIỆT ---------- */}
        <section className="nb-nen-trang relative isolate overflow-hidden border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]">
          <span className="nb-gold-rule absolute inset-x-0 top-0 opacity-50" aria-hidden="true" />
          <div className="nb-wrap py-11 sm:py-16 lg:py-20">
            <h2 className="nb-display max-w-[20ch] text-[25px] text-white sm:text-[30px] lg:max-w-none lg:text-[32px]">{tx.ketNoi.tieuDe}</h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.8] lg:max-w-[72ch] text-[var(--nb-text-dim)] sm:text-[15.5px]">
              {tx.ketNoi.mo}
            </p>
            <ul className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-3 sm:gap-5 lg:gap-6">
              {tx.ketNoi.ds.map(({ ten, mo }) => (
                <li key={ten} className="nb-panel p-5 sm:p-6">
                  <b className="block text-[16px] font-semibold text-[var(--nb-gold-soft)]">{ten}</b>
                  <span className="mt-2 block text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">{mo}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
