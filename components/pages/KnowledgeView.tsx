import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { ROUTES, type Locale } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";
import { mainMenu } from "@/content/nav-menu";

export function KnowledgeView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].knowledge;
  const more = mainMenu(locale)
    .filter((m) => [ROUTES.process[locale], ROUTES.industries[locale], ROUTES.services[locale]].includes(m.href))
    .map((m) => ({ label: m.label, href: m.href }));

  return (
    <PageShell
      locale={locale}
      page="knowledge"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["logistik-fachkraft-lagerlogistik"]!.hero}
      heroFocus="30% 38%"
    >
      <section id="faq" className="mx-auto max-w-[1000px] px-6 py-14 lg:px-10">
        <h2 className="text-2xl font-bold text-[#10284d]">{t.faqTitle}</h2>
        <ul className="mt-8 divide-y divide-[#e3e9f1] border-y border-[#e3e9f1]">
          {t.faq.map((f) => (
            <li key={f.title}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start gap-4 text-lg font-semibold text-[#10284d] [&::-webkit-details-marker]:hidden">
                  <Icon
                    name="chevronDown"
                    className="mt-1 h-5 w-5 shrink-0 text-[#1f4f9f] transition group-open:rotate-180"
                    strokeWidth={2}
                  />
                  {f.title}
                </summary>
                <p className="mt-3 pl-9 leading-7 text-[#2a3d58]">{f.text}</p>
              </details>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-xl font-bold text-[#10284d]">{t.moreTitle}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {more.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href as Route}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f6fb] px-5 py-4 font-semibold text-[#10284d] ring-1 ring-[#e3e9f1] hover:ring-[#1d5fd6]"
              >
                {m.label}
                <Icon name="arrowRight" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
