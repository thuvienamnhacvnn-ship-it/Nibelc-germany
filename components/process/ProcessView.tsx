import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { LEGAL } from "@/content/legal";
import { ROUTES, type Locale } from "@/content/locales";
import { PROCESS } from "@/content/page-process";

/**
 * Trang quy trình — dựng theo màn 04 của bộ mẫu: sáu bước trên một đường
 * ngang đánh số 01…06, bên dưới là từng bước chi tiết kèm ảnh.
 *
 * Nội dung sáu bước vẫn là dữ liệu cũ trong `content/page-process.ts`
 * (tiêu đề, mô tả, phần việc của doanh nghiệp và của người lao động);
 * ảnh lấy từ bộ KIT sẵn có, không thêm ảnh mới.
 *
 * Bản dựng theo ảnh mẫu cũ (bảng hai làn 6×2 thẻ, trạng thái minh hoạ và nút
 * in PDF) đã bỏ — đó là thứ khiến trang trông như bản cũ.
 */

const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];

const STEP_IMAGE = [
  INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero,
  INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam,
  INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.detail,
  INDUSTRY_ASSETS["logistik-fachkraft-lagerlogistik"]!.portraitWork,
  INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam,
  INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero,
];

const LANE_LABEL: Record<Locale, { company: string; candidate: string; detail: string }> = {
  de: { company: "Unternehmen", candidate: "Bewerber", detail: "Die Schritte im Einzelnen" },
  en: { company: "Employer", candidate: "Candidate", detail: "The steps in detail" },
  vi: { company: "Doanh nghiệp", candidate: "Người lao động", detail: "Các bước chi tiết" },
};

export function ProcessView({ locale }: { locale: Locale }) {
  const t = PROCESS[locale];
  const l = LANE_LABEL[locale];
  const tel = LEGAL.phone.replace(/\s/g, "");

  return (
    <>
      <SiteHeader locale={locale} page="process" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- ĐẦU TRANG + SÁU BƯỚC ---------------- */}
        <section className="bg-[var(--nb-navy-deep)] text-white">
          <div className="mx-auto max-w-[1400px] px-5 py-12 text-center lg:px-10 lg:py-16">
            <p className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase lg:text-xs">
              <span className="h-px w-8 bg-[var(--nb-gold)]" aria-hidden="true" />
              {t.eyebrow}
              <span className="h-px w-8 bg-[var(--nb-gold)]" aria-hidden="true" />
            </p>
            <h1 className="mx-auto mt-4 max-w-[22ch] text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-white lg:text-[48px]">
              {t.h1[0]} {t.h1[1]}
            </h1>
            <p className="mx-auto mt-4 max-w-[70ch] text-white/75">
              {t.sub[0]} {t.sub[1]}
            </p>

            <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
              {t.steps.map((s, i) => (
                <li key={s.title} className="relative flex flex-col items-center">
                  {i < t.steps.length - 1 && (
                    <span className="absolute top-[26px] left-1/2 hidden h-px w-full bg-white/25 lg:block" aria-hidden="true" />
                  )}
                  <span className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--nb-navy-card)] ring-2 ring-[var(--nb-gold)]">
                    <Icon name={STEP_ICON[i]!} className="h-6 w-6 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 text-xs font-bold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 text-[13px] leading-[1.25] font-semibold">{s.title}</span>
                  <span className="mt-1 text-[11px] leading-[1.3] text-white/60">{s.sub[0]}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- CÁC BƯỚC CHI TIẾT ---------------- */}
        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{l.detail}</h2>

          <ol className="mt-8 space-y-6">
            {t.steps.map((s, i) => (
              <li
                key={s.title}
                className="grid overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1] md:grid-cols-[minmax(0,1fr)_280px]"
              >
                <div className="p-6 lg:p-8">
                  <p className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--nb-gold)] text-lg font-extrabold text-[#231a05]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl font-bold text-[#10284d]">{s.title}</span>
                  </p>
                  <p className="mt-3 text-[#5b6b80]">
                    {s.sub[0]} {s.sub[1]}
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {(["company", "candidate"] as const).map((k) => (
                      <div key={k}>
                        <p
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                            k === "company" ? "bg-[#e7eefb] text-[#0b3a80]" : "bg-[#fdf1d8] text-[#8a5a06]"
                          }`}
                        >
                          <Icon name={k === "company" ? "building" : "user"} className="h-3.5 w-3.5" strokeWidth={1.9} />
                          {k === "company" ? l.company : l.candidate}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-[#2a3d58]">
                          {s[k].bullets.map((b) => (
                            <li key={b} className="flex gap-2">
                              <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4f9f]" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative order-first h-44 md:order-last md:h-auto">
                  <Image src={STEP_IMAGE[i]!} alt="" fill sizes="(min-width:768px) 280px, 100vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- KẾT ---------------- */}
        <section className="bg-[var(--nb-navy-deep)] py-12 text-white lg:py-16">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-5 text-center lg:px-10">
            <h2 className="max-w-[24ch] text-2xl font-bold text-white lg:text-3xl">
              {t.closing.title[0]} {t.closing.title[1]}
            </h2>
            <p className="max-w-[70ch] text-white/75">{t.closing.text}</p>
            <p className="flex flex-wrap justify-center gap-3">
              <Link
                href={ROUTES.request[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
              >
                {t.closingCta}
                <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <a
                href={`tel:${tel}`}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/35 px-7 font-semibold hover:bg-white/10"
              >
                <Icon name="phone" className="h-4 w-4" strokeWidth={1.9} />
                {LEGAL.phone}
              </a>
            </p>
            <p className="text-sm text-white/55">{t.closingClaim}</p>
          </div>
        </section>
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page="process" />
    </>
  );
}
