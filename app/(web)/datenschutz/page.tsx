import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { getLang } from "@/lib/i18n/server";
import { lh } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/dict";
import { datenschutz } from "@/lib/i18n/dict/phap-ly";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(datenschutz, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa, robots: { index: false } };
}

export default async function Page() {
  const tx = t(datenschutz, await getLang());
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
                href={lh("/datenschutz", "de")}
                hrefLang="de"
                lang="de"
                className="font-medium text-[var(--nb-gold-soft)] hover:underline"
              >
                {tx.ghiChu.link}
              </a>
            </p>
          )}
          {tx.muc.map((m, i) => (
            <section key={m.h} className={i > 0 ? "mt-9" : ""}>
              <h2 className="nb-display text-[21px] text-white">{m.h}</h2>
              <span className="mt-3 mb-4 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />
              {m.p.map((p) => (
                <p key={p} className="mt-3.5 text-[15.5px] leading-[1.9] text-[var(--nb-text-dim)]">
                  {p}
                </p>
              ))}
              {m.ul && (
                <ul className="mt-4 space-y-2">
                  {m.ul.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] leading-[1.8] text-[var(--nb-text-dim)]">
                      <span
                        className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]"
                        aria-hidden="true"
                      />
                      {x}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </section>
      </div>
    </div>
  );
}
