import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { ROUTES, type Locale } from "@/content/locales";
import { PROCESS } from "@/content/page-process";
import { SIMPLE } from "@/content/page-simple";
import { shouldShowPlaceholder } from "@/lib/field-gate";

const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];

export function ServicesView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].services;
  const steps = PROCESS[locale].steps;

  return (
    <PageShell
      locale={locale}
      page="services"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam}
      heroFocus="50% 22%"
    >
      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <h2 className="text-2xl font-bold text-[#10284d]">{t.stepsTitle}</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl bg-white p-6 ring-1 ring-[#e3e9f1]">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full font-bold text-white ${i === 0 ? "bg-[var(--nb-orange)]" : "bg-[#0b4ea2]"}`}>
                  {i + 1}
                </span>
                <Icon name={STEP_ICON[i]!} className="h-7 w-7 text-[#1f4f9f]" strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#10284d]">{s.title}</h3>
              <p className="mt-1 text-sm text-[#5b6b80]">
                {s.sub[0]} {s.sub[1]}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#2a3d58]">
                {s.company.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4f9f]" />
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-8">
          <Link href={ROUTES.process[locale] as Route} className="inline-flex items-center gap-2 font-semibold text-[#1647a8] hover:underline">
            {PROCESS[locale].h1.join(" ")}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </p>
      </section>

      <section className="bg-[#f3f6fb] py-14">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-2 lg:px-10">
          <div className="rounded-xl bg-white p-7 ring-1 ring-[#e3e9f1]">
            <h2 className="text-xl font-bold text-[#10284d]">{t.scope.inTitle}</h2>
            <ul className="mt-4 space-y-3 text-[#2a3d58]">
              {t.scope.in.map((x) => (
                <li key={x} className="flex gap-3">
                  <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-[#16a34a]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white p-7 ring-1 ring-[#e3e9f1]">
            <h2 className="text-xl font-bold text-[#10284d]">{t.scope.outTitle}</h2>
            <ul className="mt-4 space-y-3 text-[#2a3d58]">
              {t.scope.out.map((x) => (
                <li key={x} className="flex gap-3">
                  <Icon name="close" className="mt-0.5 h-5 w-5 shrink-0 text-[#b23c3c]" strokeWidth={2} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1400px] px-6 lg:px-10">
          <div className="rounded-xl border border-[#dbe4f0] bg-white p-7">
            <h2 className="text-xl font-bold text-[#10284d]">{t.costTitle}</h2>
            <p className="mt-3 max-w-[80ch] text-[#2a3d58]">{t.costText}</p>
            {shouldShowPlaceholder("07") && (
              <p data-field-gate="07" className="mt-4 rounded border border-dashed border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                CẦN ĐIỀN 07: bảng phí và phạm vi dịch vụ chi tiết — chỉ hiện ở dev.
              </p>
            )}
            <p className="mt-6">
              <Link
                href={ROUTES.request[locale] as Route}
                className="inline-flex items-center gap-3 rounded-md bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
              >
                {SIMPLE[locale].contact.title}
                <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
