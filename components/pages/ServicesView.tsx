import Image from "next/image";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel, Tick } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { PROCESS } from "@/content/page-process";
import { SIMPLE } from "@/content/page-simple";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG DỊCH VỤ, dựng lại theo bộ KIT navy–vàng.
 *
 * Giữ nguyên toàn bộ chữ: phạm vi bao gồm / không bao gồm, phần chi phí và
 * các bước. Bố cục cũ nền trắng đã bỏ; nay là hai cột đối chiếu rõ "việc
 * chúng tôi làm" và "việc không thuộc phạm vi".
 */
export function ServicesView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].services;
  const p = PROCESS[locale];

  return (
    <SubShell
      locale={locale}
      page="services"
      hero={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.detail}
      heroFocus="50% 45%"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-3">
          <GoldBtn href={ROUTES.request[locale]}>{p.cta}</GoldBtn>
          <GhostBtn href={ROUTES.process[locale]}>{p.tagline}</GhostBtn>
        </div>
      }
    >
      {/* ---------------- HAI CỘT ĐỐI CHIẾU ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="p-7 lg:p-9">
            <b className="flex items-center gap-3 text-[19px] font-bold text-white">
              <Icon name="checkCircle" className="h-6 w-6 text-[var(--nb-gold)]" strokeWidth={1.9} />
              {t.scope.inTitle}
            </b>
            <ul className="mt-6 space-y-3.5">
              {t.scope.in.map((x) => (
                <Tick key={x}>{x}</Tick>
              ))}
            </ul>
          </Panel>

          <Panel className="p-7 lg:p-9">
            <b className="flex items-center gap-3 text-[19px] font-bold text-white">
              <Icon name="circleOpen" className="h-6 w-6 text-white/45" strokeWidth={1.9} />
              {t.scope.outTitle}
            </b>
            <ul className="mt-6 space-y-3.5">
              {t.scope.out.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-[1.6] text-white/60">
                  <Icon name="circleOpen" className="mt-[5px] h-4 w-4 shrink-0 text-white/35" strokeWidth={2} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* ---------------- CHI PHÍ ---------------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
          <Panel className="p-7 lg:p-9">
            <Eyebrow>{t.costTitle}</Eyebrow>
            <p className="mt-5 max-w-[70ch] text-[16px] leading-[1.85] text-white/72">{t.costText}</p>
          </Panel>
          <span className="relative block min-h-[220px] overflow-hidden rounded-[18px] ring-1 ring-white/10">
            <Image
              src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitWork}
              alt=""
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(6,23,43,.1), rgba(6,23,43,.75))" }}
              aria-hidden="true"
            />
          </span>
        </div>
      </section>

      {/* ---------------- SÁU BƯỚC ---------------- */}
      <section className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <Eyebrow>{t.stepsTitle}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[34px]">{t.stepsTitle}</H2>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.steps.map((s, i) => (
              <li key={s.title} className="nb-sub-panel flex gap-4 p-5">
                <IconBox name={["users", "search", "doc", "shield", "plane", "home"][i]!} size={44} />
                <span className="min-w-0">
                  <b className="block text-[13px] font-extrabold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</b>
                  <b className="mt-1 block text-[16px] font-bold text-white">{s.title}</b>
                  <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-white/60">{s.sub.join(" ")}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <GoldBtn href={ROUTES.request[locale]} size="lg">
              {p.closingCta}
            </GoldBtn>
            <GhostBtn href={ROUTES.contact[locale]}>{SIMPLE[locale].contact.title}</GhostBtn>
          </div>
        </div>
      </section>
    </SubShell>
  );
}
