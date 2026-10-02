import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { LEGAL, impressumComplete } from "@/data/company";
import { getLang } from "@/lib/i18n/server";
import { lh } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/dict";
import { impressum, type TruongThieu } from "@/lib/i18n/dict/phap-ly";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(impressum, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa, robots: { index: false } };
}

// Cổng chặn giữ nguyên: impressumComplete() là thứ duy nhất quyết định có hiện
// mục đăng ký hay không. Danh sách thiếu suy từ cùng các trường null trong LEGAL
// (cùng thứ tự với impressumMissing()), nhãn theo ngôn ngữ.
const TRUONG: TruongThieu[] = ["handelsregister", "hrb", "geschaeftsfuehrer", "ustIdNr"];

export default async function Page() {
  const tx = t(impressum, await getLang());
  const du = impressumComplete();
  const thieu = TRUONG.filter((k) => LEGAL[k] === null).map((k) => tx.thieu[k]);

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/lien-he.jpg"
        nhan={tx.hero.nhan}
        tieuDe={tx.hero.tieuDe}
        mo={tx.hero.mo}
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* Máy tính: cùng mép trái với banner (khung .nb-wrap 1400/32, >1440 là 1600/40)
            thay vì một cột 820px căn giữa lệch khỏi chữ banner; dòng chữ vẫn giới hạn 820px. */}
        <section className="mx-auto max-w-[820px] px-8 py-14 lg:max-w-[1400px] lg:py-20 lg:[&>*]:max-w-[820px] min-[1441px]:max-w-[1600px] min-[1441px]:px-10">
          {tx.ghiChu && (
            <p className="mb-9 rounded-[12px] border border-[var(--nb-line)] px-4 py-3 text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)]">
              {tx.ghiChu.mo}{" "}
              {/* Sang bản tiếng Đức: <a> thường (tải lại trang) vì NavLink luôn giữ ngôn ngữ đang xem */}
              <a
                href={lh("/impressum", "de")}
                hrefLang="de"
                lang="de"
                className="font-medium text-[var(--nb-gold-soft)] hover:underline"
              >
                {tx.ghiChu.link}
              </a>
            </p>
          )}
          <Muc tieuDe={tx.anbieter}>
            <address className="text-[16px] leading-[1.9] not-italic text-[var(--nb-text-dim)]">
              {LEGAL.name}
              <br />
              {LEGAL.street}
              <br />
              {LEGAL.postalCode} {LEGAL.city}
              <br />
              {LEGAL.country}
            </address>
          </Muc>

          <Muc tieuDe={tx.kontakt}>
            <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
              {tx.telefon}: {LEGAL.phone}
              <br />
              {tx.email}: {LEGAL.email}
            </p>
          </Muc>

          <Muc tieuDe={tx.rechtsform}>
            <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">{tx.rechtsformWert}</p>
          </Muc>

          {du ? (
            <>
              <Muc tieuDe={tx.register}>
                <p className="text-[16px] text-[var(--nb-text-dim)]">
                  {LEGAL.handelsregister} · {LEGAL.hrb}
                </p>
              </Muc>
              <Muc tieuDe={tx.vertretung}>
                <p className="text-[16px] text-[var(--nb-text-dim)]">{LEGAL.geschaeftsfuehrer}</p>
              </Muc>
              <Muc tieuDe={tx.ust}>
                <p className="text-[16px] text-[var(--nb-text-dim)]">{LEGAL.ustIdNr}</p>
              </Muc>
            </>
          ) : (
            <div className="nb-panel mt-9 p-6">
              <b className="flex items-center gap-2.5 text-[15.5px] font-semibold text-[var(--nb-gold-soft)]">
                <AlertTriangle size={18} />
                {tx.ergaenzt.tieuDe}
              </b>
              <p className="mt-3 text-[14.5px] leading-[1.8] text-[var(--nb-text-dim)]">
                {tx.ergaenzt.mo}
              </p>
              <ul className="mt-3 space-y-1.5">
                {thieu.map((x) => (
                  <li key={x} className="flex gap-2.5 text-[14.5px] text-[var(--nb-text-dim)]">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Muc tieuDe={tx.haftung.tieuDe}>
            <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
              {tx.haftung.mo}
            </p>
          </Muc>

          <Muc tieuDe={tx.datenschutz.tieuDe}>
            <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
              {tx.datenschutz.truoc}{" "}
              <NavLink href="/datenschutz" className="font-medium text-[var(--nb-gold-soft)] hover:underline">
                {tx.datenschutz.link}
              </NavLink>
              {tx.datenschutz.sau}
            </p>
          </Muc>
        </section>
      </div>
    </div>
  );
}

function Muc({ tieuDe, children }: { tieuDe: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 first-of-type:mt-0">
      <h2 className="nb-display text-[21px] text-white">{tieuDe}</h2>
      <span className="mt-3 mb-4 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />
      {children}
    </section>
  );
}
