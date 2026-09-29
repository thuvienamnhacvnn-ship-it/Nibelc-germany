import Image from "next/image";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { SIMPLE } from "@/content/page-simple";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG KIẾN THỨC, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ (nền trắng, danh sách câu hỏi xếp dọc) đã bỏ. Nay là trang chuyên
 * mục: banner điện ảnh, mục lục câu hỏi bên trái, từng câu trả lời là một tấm
 * tối bên phải, kết bằng ba lối đi tiếp.
 *
 * Toàn bộ câu hỏi và câu trả lời giữ nguyên từ `content/page-simple.ts`.
 */
export function KnowledgeView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].knowledge;

  return (
    <SubShell
      locale={locale}
      page="knowledge"
      hero={INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.hero}
      heroFocus="55% 38%"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title },
      ]}
    >
      <section id="faq" className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[300px_1fr] lg:gap-14 lg:px-12 lg:py-20">
        {/* ---------------- MỤC LỤC ---------------- */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <Eyebrow>{t.faqTitle}</Eyebrow>
          <ol className="mt-6 space-y-1">
            {t.faq.map((f, i) => (
              <li key={f.title}>
                <a
                  href={`#faq-${i}`}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-[14px] leading-[1.5] text-white/65 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="mt-[2px] text-[12px] font-extrabold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</span>
                  {f.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        {/* ---------------- CÂU HỎI ---------------- */}
        <div className="min-w-0">
          <H2 className="!mt-0 !text-[26px] lg:!text-[34px]">{t.faqTitle}</H2>
          <ul className="mt-9 space-y-5">
            {t.faq.map((f, i) => (
              <li key={f.title} id={`faq-${i}`} className="scroll-mt-28">
                <Panel className="p-6 lg:p-8">
                  <b className="flex items-start gap-4 text-[18px] leading-snug font-bold text-white lg:text-[21px]">
                    <span className="mt-[3px] shrink-0 text-[13px] font-extrabold text-[var(--nb-gold)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.title}
                  </b>
                  <p className="mt-4 pl-[34px] text-[15.5px] leading-[1.8] text-white/70">{f.text}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- BA LỐI ĐI TIẾP ---------------- */}
      <section className="relative isolate overflow-hidden border-t border-white/10">
        <Image
          src={INDUSTRY_ASSETS["logistik-fachkraft-lagerlogistik"]!.portraitTeam}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[55%_30%]"
        />
        <span
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(90deg, rgba(6,23,43,.97) 0, rgba(6,23,43,.9) 55%, rgba(6,23,43,.65) 100%)" }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <Eyebrow>{t.moreTitle}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[34px]">{t.moreTitle}</H2>

          <ul className="mt-9 grid gap-5 sm:grid-cols-3">
            {[
              { icon: "doc", label: SIMPLE[locale].services.title, href: ROUTES.services[locale] },
              { icon: "grid", label: SIMPLE[locale].about.title, href: ROUTES.about[locale] },
              { icon: "chat", label: SIMPLE[locale].contact.title, href: ROUTES.contact[locale] },
            ].map((x) => (
              <li key={x.label}>
                <a href={x.href} className="nb-sub-panel nb-sub-panel-hover flex items-center gap-4 p-5">
                  <IconBox name={x.icon} size={46} />
                  <span className="min-w-0 flex-1 text-[16px] font-bold text-white">{x.label}</span>
                  <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-[var(--nb-gold)]" strokeWidth={2} />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <GoldBtn href={ROUTES.jobs[locale]} size="lg">
              {SIMPLE[locale].services.title}
            </GoldBtn>
            <GhostBtn href={ROUTES.process[locale]}>{SIMPLE[locale].about.title}</GhostBtn>
          </div>
        </div>
      </section>
    </SubShell>
  );
}
