import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lightbulb } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { CAM_NANG, baiTheoId } from "@/data/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return CAM_NANG.map((b) => ({ bai: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ bai: string }> }): Promise<Metadata> {
  const { bai } = await params;
  const b = baiTheoId(bai);
  return b ? { title: b.tieuDe, description: b.tomTat } : {};
}

export default async function Page({ params }: { params: Promise<{ bai: string }> }) {
  const { bai } = await params;
  const b = baiTheoId(bai);
  if (!b) notFound();
  const khac = CAM_NANG.filter((x) => x.id !== b.id).slice(0, 4);

  return (
    <div className="nb-duoi-header">
      <article className="mx-auto max-w-[860px] px-5 py-10 sm:px-8 sm:py-14">
        <NavLink
          href="/cam-nang"
          className="inline-flex min-h-[44px] items-center gap-2 text-[13.5px] text-[var(--nb-text-mute)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
        >
          <ArrowLeft size={15} />
          Cẩm nang
        </NavLink>

        <p className="nb-eyebrow mt-6">{b.nhom}</p>
        <h1 className="nb-display mt-3 text-[25px] leading-[1.18] text-white sm:text-[clamp(28px,3vw,42px)] sm:leading-[1.15]">{b.tieuDe}</h1>
        <p className="mt-2 flex items-center gap-2 text-[13px] text-[var(--nb-text-mute)]">
          <Clock size={13} />
          {b.phut} phút đọc
        </p>
        <p className="mt-6 text-[16.5px] leading-[1.75] text-[var(--nb-text-dim)] sm:text-[17px]">{b.tomTat}</p>

        {b.khoi.map((k, i) => (
          <section key={k.tieuDe} className={i > 0 ? "mt-11" : "mt-11"}>
            <h2 className="nb-display text-[20px] leading-snug text-white sm:text-[23px]">{k.tieuDe}</h2>
            <span className="mt-3 mb-5 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />

            {k.doan?.map((d) => (
              <p key={d} className="mt-4 text-[15.5px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[16px] sm:leading-[1.85]">
                {d}
              </p>
            ))}

            {k.gach && (
              <ul className="mt-5 space-y-2.5">
                {k.gach.map((g) => (
                  <li key={g} className="flex gap-3 text-[15.5px] leading-[1.75] text-[var(--nb-text-dim)]">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />
                    {g}
                  </li>
                ))}
              </ul>
            )}

            {k.luuY && (
              <p className="nb-panel mt-6 flex gap-3 p-4 text-[15px] leading-[1.75] text-[var(--nb-text-dim)] sm:gap-3.5 sm:p-5">
                <Lightbulb size={19} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
                <span>
                  <b className="mr-1.5 font-semibold text-[var(--nb-gold-soft)]">Lưu ý:</b>
                  {k.luuY}
                </span>
              </p>
            )}
          </section>
        ))}

        <div className="mt-14 border-t border-[var(--nb-line-soft)] pt-8">
          <b className="block text-[17px] font-semibold text-white">Đọc tiếp</b>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {khac.map((x) => (
              <li key={x.id}>
                <NavLink href={`/cam-nang/${x.id}`} className="nb-card block p-4">
                  <b className="block text-[14.5px] leading-snug font-medium text-white">{x.tieuDe}</b>
                  <span className="mt-1 block text-[12px] text-[var(--nb-text-mute)]">
                    {x.nhom} · {x.phut} phút
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
