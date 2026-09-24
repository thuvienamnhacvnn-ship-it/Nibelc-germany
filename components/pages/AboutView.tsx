import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/ui/Icon";
import { COMPANY_PUBLICATIONS, INDUSTRY_ASSETS } from "@/content/industry-assets";
import { activeIndustries, industryName } from "@/content/industries";
import { LEGAL } from "@/content/legal";
import { ROUTES, industryPath, type Locale } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

const PUB_LABEL: Record<Locale, { title: string; note: string; adsNote?: string }> = {
  de: {
    title: "Aus unseren Veröffentlichungen",
    note: "Unternehmensangaben auf dieser Seite stammen aus diesem offiziellen Aushang.",
  },
  en: {
    title: "From our publications",
    note: "The company details on this page come from this official material.",
  },
  vi: {
    title: "Ấn phẩm của công ty",
    note: "Thông tin doanh nghiệp trên trang này lấy từ ấn phẩm chính thức sau.",
    // Tin tuyển dụng ghi mức lương của riêng đợt đó, nên phải nói rõ.
    adsNote:
      "Các tin tuyển dụng dưới đây là ấn phẩm của từng đợt. Số lượng, mức lương và điều kiện ghi trong tin chỉ áp dụng cho đợt đó, không phải mức chung cho mọi vị trí.",
  },
};

const INDUSTRY_LABEL: Record<Locale, string> = {
  de: "Berufsfelder, in die wir vermitteln",
  en: "Fields we place workers in",
  vi: "Những nhóm nghề chúng tôi kết nối",
};

export function AboutView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].about;
  const pub = PUB_LABEL[locale];

  return (
    <PageShell
      locale={locale}
      page="about"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
      heroFocus="50% 40%"
    >
      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-8 text-[#2a3d58]">
            {t.intro.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>

          <aside className="rounded-xl bg-[#f3f6fb] p-6 ring-1 ring-[#e3e9f1]">
            <h2 className="text-lg font-bold text-[#10284d]">{t.factsTitle}</h2>
            <dl className="mt-4 space-y-3 text-sm text-[#2a3d58]">
              <div>
                <dt className="font-semibold text-[#10284d]">{LEGAL.name}</dt>
                <dd>{LEGAL.rechtsform}</dd>
              </div>
              <div>
                <dt className="sr-only">Adresse</dt>
                <dd>
                  {LEGAL.street}
                  <br />
                  {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.7} />
                <a href={`mailto:${LEGAL.email}`} className="underline hover:text-[#10284d]">
                  {LEGAL.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.7} />
                <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="underline hover:text-[#10284d]">
                  {LEGAL.phone}
                </a>
              </div>
            </dl>
            <p className="mt-4 border-t border-[#dbe4f0] pt-4 text-sm text-[#5b6b80]">{t.groupNote}</p>
          </aside>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {t.principles.map((p) => (
            <li key={p.title} className="rounded-xl bg-white p-6 ring-1 ring-[#e3e9f1]">
              <h2 className="flex items-start gap-3 text-base font-bold text-[#10284d]">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4f9f]" strokeWidth={2.4} />
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#2a3d58]">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f3f6fb] py-14">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="text-2xl font-bold text-[#10284d]">{INDUSTRY_LABEL[locale]}</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {activeIndustries().map((i) => (
              <li key={i.slug}>
                <Link
                  href={industryPath(locale, i.slug) as Route}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#10284d] ring-1 ring-[#dbe4f0] hover:ring-[#1d5fd6]"
                >
                  <Icon name={i.icon} className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.8} />
                  {industryName(i, locale)}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-[#10284d]">{pub.title}</h2>
          <p className="mt-2 max-w-[70ch] text-sm text-[#5b6b80]">{pub.note}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {COMPANY_PUBLICATIONS.filter((p) => p.kind === "poster").map((p) => (
              <li key={p.src} className="overflow-hidden rounded-xl bg-white ring-1 ring-[#e3e9f1]">
                <Image
                  src={p.src}
                  alt={`${LEGAL.name} — Informationsplakat`}
                  width={p.w}
                  height={p.h}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="h-full w-full object-contain"
                />
              </li>
            ))}
          </ul>

          {pub.adsNote && (
            <>
              <p className="mt-10 max-w-[80ch] rounded-lg bg-white p-4 text-sm text-[#5b6b80] ring-1 ring-[#e3e9f1]">{pub.adsNote}</p>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {COMPANY_PUBLICATIONS.filter((p) => p.kind === "anzeige").map((p) => (
                  <li key={p.src} className="overflow-hidden rounded-xl bg-white ring-1 ring-[#e3e9f1]">
                    <Image
                      src={p.src}
                      alt={`${LEGAL.name} — tin tuyển dụng`}
                      width={p.w}
                      height={p.h}
                      sizes="(min-width:1024px) 33vw, 100vw"
                      className="h-full w-full object-contain"
                    />
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-10">
            <Link
              href={ROUTES.contact[locale] as Route}
              className="inline-flex items-center gap-3 rounded-md bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
            >
              {SIMPLE[locale].contact.title}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
