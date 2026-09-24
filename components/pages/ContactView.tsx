import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { LEGAL } from "@/content/legal";
import { ROUTES, type Locale } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";
import { requestLabel } from "@/content/nav-menu";

export function ContactView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].contact;

  return (
    <PageShell
      locale={locale}
      page="contact"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.detail}
      heroAlt=""
      heroFocus="50% 22%"
    >
      <section className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 lg:grid-cols-[1.3fr_1fr] lg:px-10">
        <div>
          <h2 className="text-2xl font-bold text-[#10284d]">{t.formTitle}</h2>
          <div className="mt-6">
            <ContactForm locale={locale} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-[#f3f6fb] p-6 ring-1 ring-[#e3e9f1]">
            <h2 className="text-lg font-bold text-[#10284d]">{t.dataTitle}</h2>
            <address className="mt-4 space-y-3 text-sm text-[#2a3d58] not-italic">
              <p className="font-semibold text-[#10284d]">{LEGAL.name}</p>
              <p>
                {LEGAL.street}
                <br />
                {LEGAL.postalCode} {LEGAL.city}
                <br />
                {LEGAL.country}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                <a href={`mailto:${LEGAL.email}`} className="underline hover:text-[#10284d]">
                  {LEGAL.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="underline hover:text-[#10284d]">
                  {LEGAL.phone}
                </a>
              </p>
            </address>
          </div>

          <div className="rounded-xl border border-[#dbe4f0] p-6">
            <Link
              href={ROUTES.request[locale] as Route}
              className="inline-flex items-center gap-3 font-semibold text-[#1647a8] hover:underline"
            >
              {requestLabel(locale)}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
            <p className="mt-2 text-sm text-[#5b6b80]">{SIMPLE[locale].services.lead}</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
