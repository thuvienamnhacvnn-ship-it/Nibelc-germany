import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { COMPANY_PUBLICATIONS, INDUSTRY_ASSETS } from "@/content/industry-assets";
import { activeIndustries, industryName } from "@/content/industries";
import { LEGAL } from "@/content/legal";
import { SIMPLE } from "@/content/page-simple";
import { ROUTES, industryPath, type Locale } from "@/content/locales";

/**
 * TRANG VỀ CHÚNG TÔI, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ nền trắng đã bỏ. Nay: banner điện ảnh, phần giới thiệu hai cột
 * kèm khối pháp nhân, bốn nguyên tắc, các nhóm nghề và ấn phẩm công ty.
 *
 * Giữ nguyên mọi câu chữ và ảnh ấn phẩm; thông tin pháp nhân vẫn lấy từ
 * `content/legal.ts`, không gõ tay.
 */
const PUB_LABEL: Record<Locale, { title: string; note: string }> = {
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
    <SubShell
      locale={locale}
      page="about"
      heroTall
      hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
      heroFocus="52% 36%"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-3">
          <GoldBtn href={ROUTES.contact[locale]}>{SIMPLE[locale].contact.title}</GoldBtn>
          <GhostBtn href={ROUTES.services[locale]}>{SIMPLE[locale].services.title}</GhostBtn>
        </div>
      }
    >
      {/* ---------------- GIỚI THIỆU + PHÁP NHÂN ---------------- */}
      <section className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:px-12 lg:py-20">
        <div className="space-y-5">
          {t.intro.map((p) => (
            <p key={p.slice(0, 24)} className="text-[16.5px] leading-[1.9] text-white/75">
              {p}
            </p>
          ))}
        </div>

        <Panel className="h-fit p-7 lg:p-8">
          <Eyebrow>{t.factsTitle}</Eyebrow>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-[17px] font-bold text-white">{LEGAL.name}</dt>
              <dd className="mt-1 text-[14.5px] text-white/60">{LEGAL.rechtsform}</dd>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="pin" className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[var(--nb-gold)]" strokeWidth={1.8} />
              <dd className="text-[14.5px] leading-[1.6] text-white/70">
                {LEGAL.street}
                <br />
                {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="mail" className="h-[18px] w-[18px] shrink-0 text-[var(--nb-gold)]" strokeWidth={1.8} />
              <dd>
                <a href={`mailto:${LEGAL.email}`} className="text-[14.5px] text-white/80 transition hover:text-[var(--nb-gold)]">
                  {LEGAL.email}
                </a>
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="phone" className="h-[18px] w-[18px] shrink-0 text-[var(--nb-gold)]" strokeWidth={1.8} />
              <dd>
                <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="text-[14.5px] text-white/80 transition hover:text-[var(--nb-gold)]">
                  {LEGAL.phone}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-6 border-t border-white/10 pt-5 text-[13.5px] leading-[1.7] text-white/50">{t.groupNote}</p>
        </Panel>
      </section>

      {/* ---------------- NGUYÊN TẮC ---------------- */}
      <section className="border-y border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <ul className="grid gap-5 sm:grid-cols-2">
            {t.principles.map((p) => (
              <li key={p.title} className="nb-sub-panel p-6 lg:p-7">
                <IconBox name="check" size={46} />
                <b className="mt-4 block text-[18px] font-bold text-white">{p.title}</b>
                <p className="mt-2.5 text-[15px] leading-[1.75] text-white/65">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- NHÓM NGHỀ + ẤN PHẨM ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <Eyebrow>{INDUSTRY_LABEL[locale]}</Eyebrow>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {activeIndustries().map((i) => (
            <li key={i.slug}>
              <Link
                href={industryPath(locale, i.slug) as Route}
                className="flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[14px] font-semibold text-white/80 transition hover:border-[var(--nb-gold)]/60 hover:text-white"
              >
                <Icon name={i.icon} className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                {industryName(i, locale)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <Eyebrow>{pub.title}</Eyebrow>
          <H2 className="!text-[24px] lg:!text-[30px]">{pub.title}</H2>
          <p className="mt-3 max-w-[70ch] text-[14.5px] leading-[1.7] text-white/55">{pub.note}</p>

          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {COMPANY_PUBLICATIONS.filter((p) => p.kind === "poster").map((p) => (
              <li key={p.src} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
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
        </div>

        <p className="mt-12">
          <GoldBtn href={ROUTES.contact[locale]} size="lg">
            {SIMPLE[locale].contact.title}
          </GoldBtn>
        </p>
      </section>
    </SubShell>
  );
}
