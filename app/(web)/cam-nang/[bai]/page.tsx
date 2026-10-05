import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { PageHero } from "@/components/ui/PageHero";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { CAM_NANG } from "@/data/articles";
import { getArticle, getArticles } from "@/data/i18n/articles";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { camNang } from "@/lib/i18n/dict/cam-nang";
import "../../trang-sang.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return CAM_NANG.map((b) => ({ bai: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ bai: string }> }): Promise<Metadata> {
  const { bai } = await params;
  const b = getArticle(bai, await getLang());
  return b ? { title: b.tieuDe, description: b.tomTat } : {};
}

/**
 * Bài cẩm nang — cùng khuôn với mọi trang con: banner PageHero (tấm chữ navy),
 * thân SÁNG ở máy tính (.nb-sang, app/trang-sang.css), điện thoại giữ nền cũ.
 * Máy tính: cột đọc 720px (17px / 1.75) + cột phải mục lục và "Đọc tiếp",
 * CTA navy cuối trang.
 */
export default async function Page({ params }: { params: Promise<{ bai: string }> }) {
  const { bai } = await params;
  const lang = await getLang();
  const tx = t(camNang, lang);
  const b = getArticle(bai, lang);
  if (!b) notFound();
  const khac = getArticles(lang).filter((x) => x.id !== b.id).slice(0, 4);

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/cam-nang.jpg"
        anhDoc="/assets/banners/mobile/cam-nang.jpg"
        nhan={tx.nhom[b.nhom]}
        tieuDe={b.tieuDe}
      >
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-[var(--hero-mo)]">
          <NavLink
            href="/cam-nang"
            className="inline-flex min-h-[44px] items-center gap-2 transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
          >
            <ArrowLeft size={15} />
            {tx.bai.quayLai}
          </NavLink>
          <span className="inline-flex items-center gap-2">
            <Clock size={14} />
            {tx.phutDoc(b.phut)}
          </span>
        </div>
      </PageHero>

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        <div className="nb-wrap grid gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,720px)_minmax(0,300px)] lg:justify-between lg:gap-16 lg:py-20">
          <article className="min-w-0">
            <p className="text-[16.5px] leading-[1.75] text-[var(--nb-text-dim)] sm:text-[17px] lg:text-[19px] lg:leading-[1.7] lg:text-[var(--nb-text)]">
              {b.tomTat}
            </p>

            {b.khoi.map((k, i) => (
              <section key={k.tieuDe} id={`muc-${i + 1}`} className="mt-11 scroll-mt-24 lg:mt-14">
                <h2 className="nb-display text-[20px] leading-snug text-white sm:text-[23px] lg:text-[26px]">{k.tieuDe}</h2>
                <span className="mt-3 mb-5 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />

                {k.doan?.map((d) => (
                  <p
                    key={d}
                    className="mt-4 text-[15.5px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[16px] sm:leading-[1.85] lg:text-[17px] lg:leading-[1.75]"
                  >
                    {d}
                  </p>
                ))}

                {k.gach && (
                  <ul className="mt-5 space-y-2.5">
                    {k.gach.map((g) => (
                      <li
                        key={g}
                        className="flex gap-3 text-[15.5px] leading-[1.75] text-[var(--nb-text-dim)] lg:text-[17px]"
                      >
                        <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />
                        {g}
                      </li>
                    ))}
                  </ul>
                )}

                {k.luuY && (
                  <p className="mt-6 flex gap-3 rounded-[14px] border border-[var(--nb-line)] bg-[var(--nb-navy-700)] p-4 text-[15px] leading-[1.75] text-[var(--nb-text-dim)] sm:gap-3.5 sm:p-5 lg:border-[var(--s-line-warm)] lg:bg-[var(--s-alt)] lg:px-6 lg:text-[16px]">
                    <Lightbulb size={19} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
                    <span>
                      <b className="mr-1.5 font-semibold text-[var(--nb-gold-soft)]">{tx.bai.luuY}</b>
                      {k.luuY}
                    </span>
                  </p>
                )}
              </section>
            ))}

            {/* Điện thoại: "Đọc tiếp" ở cuối bài như cũ (máy tính nằm ở cột phải). */}
            <div className="mt-14 border-t border-[var(--nb-line-soft)] pt-8 lg:hidden">
              <b className="block text-[17px] font-semibold text-white">{tx.bai.docTiep}</b>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {khac.map((x) => (
                  <li key={x.id}>
                    <NavLink href={`/cam-nang/${x.id}`} className="nb-card block p-4">
                      <b className="block text-[14.5px] leading-snug font-medium text-white">{x.tieuDe}</b>
                      <span className="mt-1 block text-[12px] text-[var(--nb-text-mute)]">
                        {tx.nhom[x.nhom]} · {tx.phut(x.phut)}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Máy tính: cột phải dính khi cuộn — mục lục (từ tiêu đề các khối) + đọc tiếp */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--nb-header)+24px)] space-y-6">
              <nav className="nb-panel p-6" aria-label={tx.bai.mucLuc}>
                <b className="nb-eyebrow block">{tx.bai.mucLuc}</b>
                <ol className="mt-4 space-y-1">
                  {b.khoi.map((k, i) => (
                    <li key={k.tieuDe}>
                      <a
                        href={`#muc-${i + 1}`}
                        className="flex gap-3 rounded-[8px] px-2 py-2 text-[14.5px] leading-snug text-[var(--nb-text-dim)] transition hover:bg-[var(--s-alt)] hover:text-[var(--nb-text)]"
                      >
                        <span className="w-5 shrink-0 font-semibold text-[var(--nb-gold-soft)] tabular-nums">{i + 1}</span>
                        {k.tieuDe}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="nb-panel p-6">
                <b className="nb-eyebrow block">{tx.bai.docTiep}</b>
                <ul className="mt-3 divide-y divide-[var(--s-line)]">
                  {khac.map((x) => (
                    <li key={x.id}>
                      <NavLink href={`/cam-nang/${x.id}`} className="group block py-3.5">
                        <b className="block text-[14.5px] leading-snug font-medium text-[var(--nb-text)] group-hover:text-[var(--nb-gold-soft)]">
                          {x.tieuDe}
                        </b>
                        <span className="mt-1 block text-[12.5px] text-[var(--nb-text-mute)]">
                          {tx.nhom[x.nhom]} · {tx.phut(x.phut)}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <NavLink
                  href="/cam-nang"
                  className="mt-2 inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--nb-gold-soft)] hover:underline"
                >
                  {tx.bai.quayLai}
                  <ArrowRight size={14} />
                </NavLink>
              </div>
            </div>
          </aside>
        </div>

        <CtaCuoiTrang />
      </div>
    </div>
  );
}
