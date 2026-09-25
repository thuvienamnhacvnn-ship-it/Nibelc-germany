import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { DATENSCHUTZ } from "@/content/page-legal";

export const metadata: Metadata = {
  title: DATENSCHUTZ.title,
  description: DATENSCHUTZ.lead,
};

/**
 * Trang bắt buộc theo DSGVO — chỉ tiếng Đức. Dùng chung khung với các trang
 * khác để banner, header và chân trang không lệch phong cách.
 */
export default function Page() {
  return (
    <div lang="de">
      <PageShell
        locale="de"
        page="contact"
        eyebrow="Rechtliches"
        title={DATENSCHUTZ.title}
        lead={DATENSCHUTZ.lead}
        hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam}
        heroFocus="50% 30%"
      >
        <div className="mx-auto max-w-[820px] px-6 py-12 lg:py-16">
          {DATENSCHUTZ.sections.map((s) => (
            <section key={s.title} className="mt-10 first:mt-0">
              <h2 className="text-xl font-bold text-[#10284d]">{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 leading-7 text-[#2a3d58]">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-[#2a3d58]">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </PageShell>
    </div>
  );
}
