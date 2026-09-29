import Image from "next/image";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { PROCESS } from "@/content/page-process";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG 08 — QUY TRÌNH, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ (bảng hai làn nền sáng, toạ độ bám ảnh mẫu 06) đã bỏ hẳn. Nay là
 * dòng thời gian điện ảnh: hàng số trên đường kẻ vàng, rồi từng chặng trải ra
 * hai làn "doanh nghiệp" và "người lao động".
 *
 * GIỮ NGUYÊN số bước, thứ tự, tiêu đề và mô tả từ `content/page-process.ts`.
 */
const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];
const ANH = [
  "produktion-maschinen-anlagen",
  "akademische-fachkraefte",
  "elektrotechnik-elektroniker",
  "logistik-fachkraft-lagerlogistik",
  "gartenbau-gaertner",
  "gastronomie-koch",
];

export function ProcessView({ locale }: { locale: Locale }) {
  const t = PROCESS[locale];

  return (
    <SubShell
      locale={locale}
      page="process"
      hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
      heroFocus="66% 44%"
      eyebrow={t.eyebrow}
      title={t.h1[0]!}
      titleGold={t.h1[1]}
      lead={`${t.sub[0]} ${t.sub[1]}`}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.h1.join(" ") },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-3">
          <GoldBtn href={ROUTES.request[locale]}>{t.cta}</GoldBtn>
          <GhostBtn href={ROUTES.candidates[locale]}>{t.tagline}</GhostBtn>
        </div>
      }
    >
      {/* ---------------- BA CAM KẾT ---------------- */}
      <section className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1560px] gap-8 px-6 py-10 sm:grid-cols-3 lg:px-12 lg:py-12">
          {t.trust.map(([a, b], i) => (
            <li key={a} className="flex items-center gap-4">
              <IconBox name={["shield", "scale", "handshake"][i]!} size={48} />
              <span>
                <b className="block text-[16px] font-bold text-white">{a}</b>
                <span className="block text-[14px] text-white/55">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- HÀNG SỐ TRÊN ĐƯỜNG VÀNG ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 pt-14 lg:px-12 lg:pt-20">
        <Eyebrow>{t.side.title.join(" ")}</Eyebrow>
        <H2 className="!text-[26px] lg:!text-[34px]">{t.closing.title.join(" ")}</H2>

        <ol className="relative mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <span
            className="pointer-events-none absolute top-[30px] right-8 left-8 hidden h-px bg-gradient-to-r from-transparent via-[var(--nb-gold)]/55 to-transparent lg:block"
            aria-hidden="true"
          />
          {t.steps.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <span className="relative z-10 mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[var(--nb-gold-line)] bg-[var(--nb-sub-navy)] text-[var(--nb-gold)]">
                <Icon name={STEP_ICON[i]!} className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <b className="mt-4 block text-[13px] font-extrabold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</b>
              <b className="mt-1.5 block text-[15px] leading-snug font-bold text-white">{s.title}</b>
              <span className="mt-1.5 block text-[12.5px] leading-[1.55] text-white/50">{s.sub.join(" ")}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- TỪNG CHẶNG, HAI LÀN ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <ul className="space-y-6">
          {t.steps.map((s, i) => {
            const anh = INDUSTRY_ASSETS[ANH[i] ?? "akademische-fachkraefte"]!;
            const chan = i % 2 === 1;
            return (
              <li key={s.title}>
                <Panel className="overflow-hidden">
                  <div className={`grid lg:grid-cols-[320px_1fr] ${chan ? "lg:[direction:rtl]" : ""}`}>
                    <span className="relative block h-[200px] lg:h-full lg:min-h-[260px]">
                      <Image
                        src={anh.portraitWork}
                        alt=""
                        fill
                        sizes="(min-width:1024px) 320px, 100vw"
                        className="object-cover"
                        style={{ objectPosition: "50% 35%" }}
                      />
                      <span
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(6,23,43,.12), rgba(6,23,43,.75))" }}
                        aria-hidden="true"
                      />
                      <span className="absolute bottom-4 left-5 text-[42px] leading-none font-extrabold text-white/35 lg:text-[56px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <div className="p-6 [direction:ltr] lg:p-8">
                      <b className="flex items-center gap-3 text-[20px] font-bold text-white lg:text-[24px]">
                        <Icon name={STEP_ICON[i]!} className="h-5 w-5 text-[var(--nb-gold)]" strokeWidth={1.9} />
                        {s.title}
                      </b>
                      <p className="mt-1.5 text-[14px] text-white/50">{s.sub.join(" ")}</p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {(
                          [
                            { lan: s.company, nhan: t.lanes.company, icon: "building" },
                            { lan: s.candidate, nhan: t.lanes.candidate, icon: "user" },
                          ] as const
                        ).map((x) => (
                          <div key={x.nhan[0]} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] text-[var(--nb-gold)] uppercase">
                              <Icon name={x.icon} className="h-4 w-4" strokeWidth={1.9} />
                              {x.nhan[0]}
                            </p>
                            <ul className="mt-3.5 space-y-2">
                              {x.lan.bullets.map((b) => (
                                <li key={b} className="flex gap-2.5 text-[14px] leading-[1.6] text-white/75">
                                  <Icon name="check" className="mt-[5px] h-3.5 w-3.5 shrink-0 text-[var(--nb-gold)]" strokeWidth={2.8} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-4 border-t border-white/10 pt-3 text-[12.5px] text-white/45">
                              {t.responsible}: {x.lan.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------- GIÁ TRỊ + KẾT ---------------- */}
      <section className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow>{t.closingClaim}</Eyebrow>
              <H2 className="!text-[26px] lg:!text-[34px]">{t.closing.title.join(" ")}</H2>
              <p className="mt-5 max-w-[54ch] text-[16px] leading-[1.8] text-white/65">{t.closing.text}</p>
              <p className="mt-8">
                <GoldBtn href={ROUTES.request[locale]} size="lg">
                  {t.closingCta}
                </GoldBtn>
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {t.values.map(([a, b], i) => (
                <li key={a} className="nb-sub-panel p-5">
                  <IconBox name={["users", "gear", "shield", "sprout"][i] ?? "check"} size={42} />
                  <b className="mt-3.5 block text-[16px] font-bold text-white">{a}</b>
                  <span className="mt-1.5 block text-[13.5px] leading-[1.65] text-white/60">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SubShell>
  );
}
