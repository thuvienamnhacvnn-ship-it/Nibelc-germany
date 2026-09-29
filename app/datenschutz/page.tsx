import type { Metadata } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { ROUTES } from "@/content/locales";
import { DATENSCHUTZ } from "@/content/page-legal";

export const metadata: Metadata = {
  title: DATENSCHUTZ.title,
  description: DATENSCHUTZ.lead,
};

/**
 * Trang bắt buộc theo DSGVO — chỉ tiếng Đức. Dùng chung khung navy–vàng của
 * các trang phụ để không lệch phong cách; chữ giữ nguyên từ `page-legal.ts`.
 */
export default function Page() {
  return (
    <div lang="de">
      <SubShell
        locale="de"
        page="contact"
        eyebrow="Rechtliches"
        title={DATENSCHUTZ.title}
        lead={DATENSCHUTZ.lead}
        hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam}
        heroFocus="50% 30%"
        breadcrumb={[{ label: "Startseite", href: ROUTES.home.de }, { label: DATENSCHUTZ.title }]}
      >
        <div className="mx-auto max-w-[860px] px-6 py-14 lg:py-20">
          {DATENSCHUTZ.sections.map((s) => (
            <section key={s.title} className="mt-12 first:mt-0">
              <h2 className="text-[21px] font-bold text-white lg:text-[24px]">{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3.5 text-[15.5px] leading-[1.85] text-white/70">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] leading-[1.7] text-white/70">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </SubShell>
    </div>
  );
}
