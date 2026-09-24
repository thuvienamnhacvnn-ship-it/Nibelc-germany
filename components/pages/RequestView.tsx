import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { RequestForm, type Option } from "@/components/forms/RequestForm";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { activeIndustries, industryName, industryRoles } from "@/content/industries";
import { LEGAL } from "@/content/legal";
import { LEGAL_ROUTES, ROUTES, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { REQUEST } from "@/content/page-request";

/**
 * Trang 08 — screens/08-personalbedarf-formular.png.
 * Bố cục: hero sáng + ảnh phải, form bốn bước bên trái, cột phải là hộp
 * tư vấn, hộp bảo mật dữ liệu và ba bước tiếp theo.
 */
export function RequestView({ locale }: { locale: Locale }) {
  const t = REQUEST[locale];
  const branchen: Option[] = activeIndustries().map((i) => ({ value: i.slug, label: industryName(i, locale) }));
  const berufe: Option[] = activeIndustries().flatMap((i) =>
    [...new Set([i.berufDe, ...industryRoles(i, locale)])].map((r) => ({ value: `${i.slug}:${r}`, label: r, group: i.slug })),
  );

  return (
    <>
      <SiteHeader locale={locale} page="request" variant="light" />

      <main id="inhalt" className="bg-[#f3f6fb]">
        <section className="relative overflow-hidden bg-[#eef3f9]">
          <div className="nb-photo-right absolute inset-y-0 hidden w-[52%] lg:block">
            <Image
              src={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam}
              alt=""
              fill
              priority
              sizes="55vw"
              className="object-cover"
              style={{ objectPosition: "60% 35%" }}
            />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg,#eef3f9 0,rgba(238,243,249,.75) 12%,rgba(238,243,249,0) 35%)" }}
              aria-hidden="true"
            />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#1f3a60] uppercase">{t.eyebrow}</p>
            <h1 className="mt-3 max-w-[16ch] text-4xl font-extrabold tracking-[-0.02em] text-[#10284d] lg:text-5xl lg:leading-[1.08]">
              {t.h1[0]}
              <br />
              {t.h1[1]}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg text-[#2a3d58]">{t.lead}</p>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {t.trust.map(([a, b], i) => (
                <li key={a} className="flex items-center gap-3">
                  <Icon name={["users", "shield", "chart"][i]!} className="h-8 w-8 shrink-0 text-[#1f4f9f]" strokeWidth={1.6} />
                  <span className="text-sm text-[#2a3d58]">
                    <b className="block font-semibold text-[#10284d]">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-8 px-6 py-12 lg:grid-cols-[1.55fr_1fr] lg:px-10">
          <div className="rounded-2xl bg-white p-7 ring-1 ring-[#e3e9f1] lg:p-9">
            <RequestForm locale={locale} branchen={branchen} berufe={berufe} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-[#eaf1fa] p-6 ring-1 ring-[#dbe4f0]">
              <h2 className="text-lg font-bold text-[#10284d]">{t.advice.title}</h2>
              <p className="mt-2 text-sm text-[#2a3d58]">{t.advice.text}</p>
              <address className="mt-4 space-y-2 text-sm text-[#2a3d58] not-italic">
                <p className="font-semibold text-[#10284d]">{LEGAL.name}</p>
                <p className="flex items-center gap-2">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                  <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="underline hover:text-[#10284d]">
                    {LEGAL.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                  <a href={`mailto:${LEGAL.email}`} className="underline hover:text-[#10284d]">
                    {LEGAL.email}
                  </a>
                </p>
              </address>
            </div>

            <div className="flex gap-4 rounded-2xl bg-white p-6 ring-1 ring-[#e3e9f1]">
              <Icon name="shield" className="h-9 w-9 shrink-0 text-[#1f4f9f]" strokeWidth={1.6} />
              <div>
                <h2 className="text-base font-bold text-[#10284d]">{t.safety.title}</h2>
                <p className="mt-1 text-sm text-[#2a3d58]">
                  {t.safety.text}{" "}
                  <Link href={LEGAL_ROUTES.datenschutz as Route} className="underline hover:text-[#10284d]">
                    {t.safety.link}
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-[#e3e9f1]">
              <h2 className="text-lg font-bold text-[#10284d]">{t.nextSteps.title}</h2>
              <ol className="mt-4 space-y-4">
                {t.nextSteps.items.map(([title, text], i) => (
                  <li key={title} className="flex gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${i === 0 ? "bg-[#1450b0]" : "bg-[#8ea6c8]"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#2a3d58]">
                      <b className="block font-semibold text-[#10284d]">{title}</b>
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-[#e3e9f1] pt-4 text-sm font-semibold text-[var(--nb-orange)] italic">{t.claim}</p>
            </div>
          </aside>
        </section>
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page={"request"} />
    </>
  );
}
