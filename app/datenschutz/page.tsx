import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DATENSCHUTZ } from "@/content/page-legal";

export const metadata: Metadata = {
  title: DATENSCHUTZ.title,
  description: DATENSCHUTZ.lead,
};

export default function Page() {
  return (
    <div lang="de">
      <SiteHeader locale="de" page="contact" />

      <main id="inhalt" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-14 lg:py-20">
          <h1 className="text-4xl font-extrabold tracking-[-0.02em] text-[#10284d]">{DATENSCHUTZ.title}</h1>
          <p className="mt-3 text-lg text-[#5b6b80]">{DATENSCHUTZ.lead}</p>

          {DATENSCHUTZ.sections.map((s) => (
            <section key={s.title} className="mt-10">
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
      </main>

      <SiteFooter locale="de" />
    </div>
  );
}
