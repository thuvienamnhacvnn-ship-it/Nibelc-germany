import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { ABROAD_ORDERS, COUNTRY_FLAG, COUNTRY_NAME } from "@/content/jobs-abroad";
import { JOBS_COPY } from "@/content/jobs-current";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * Chín đơn hàng châu Âu trên trang "đơn hàng đang chạy".
 *
 * Mỗi thẻ chỉ hiện những mục tin tuyển dụng có ghi: tin không ghi số chỗ thì
 * không có ô số chỗ, không ghi giờ làm thì không có ô giờ làm. Khoản người lao
 * động phải tự trả (tiền nhà ở Litva) hiện thành một dòng cảnh báo riêng chứ
 * không trộn vào mục quyền lợi.
 */

const EUR = (n: number) => n.toLocaleString("de-DE");

export function AbroadList({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];
  const contractLabel = locale === "vi" ? "Hợp đồng" : locale === "en" ? "Contract" : "Vertrag";

  return (
    <ul className="mt-8 grid gap-6 lg:grid-cols-2">
      {ABROAD_ORDERS.map((j) => (
        <li key={j.id} id={j.id} className="scroll-mt-28 overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1]">
          <div className="relative h-[200px]">
            <Image
              src={j.poster ?? j.image}
              alt=""
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 26%" }}
            />
          </div>

          <div className="p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#5b6b80]">
              <span className="inline-block h-4 w-4 overflow-hidden rounded-full ring-1 ring-[#d8dfe9]" aria-hidden="true">
                {COUNTRY_FLAG[j.country].map((c, k) => (
                  <span key={k} className="block h-1/3 w-full" style={{ background: c }} />
                ))}
              </span>
              {COUNTRY_NAME[j.country][locale]}
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#10284d]">{j.title[locale]}</h2>
            <p className="mt-1 text-[#5b6b80]">{j.summary[locale]}</p>

            <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <b className="text-2xl font-extrabold text-[#10284d]">
                {j.salary.from === j.salary.to
                  ? `${EUR(j.salary.from)} €`
                  : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
              </b>
              <span className="text-sm text-[#5b6b80]">{t.perMonth}</span>
            </p>
            <p className="text-sm text-[#5b6b80]">{j.salaryNote[locale]}</p>

            {j.roles && (
              <ul className="mt-4 space-y-1 text-sm text-[#2a3d58]">
                {j.roles.map((r) => (
                  <li key={r.label[locale]} className="flex justify-between gap-4 border-b border-[#eef2f7] pb-1">
                    <span>{r.label[locale]}</span>
                    <b className="whitespace-nowrap text-[#10284d]">
                      {EUR(r.from)} – {EUR(r.to)} €
                    </b>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{contractLabel}</dt>
                <dd className="font-bold text-[#10284d]">{j.contract[locale]}</dd>
              </div>
              {j.slots !== undefined && (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{t.slotsLabel}</dt>
                  <dd className="font-bold text-[#10284d]">{j.slots}</dd>
                </div>
              )}
              {j.hoursPerWeek !== undefined && (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{t.hoursLabel}</dt>
                  <dd className="font-bold text-[#10284d]">{j.hoursPerWeek} h</dd>
                </div>
              )}
              {j.visa && (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{t.visaLabel}</dt>
                  <dd className="font-bold text-[#10284d]">{j.visa}</dd>
                </div>
              )}
            </dl>

            <h3 className="mt-5 font-bold text-[#10284d]">{t.benefitsLabel}</h3>
            <ul className="mt-2 space-y-2 text-sm text-[#2a3d58]">
              {j.benefits[locale].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Icon name="heart" className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={1.8} />
                  {x}
                </li>
              ))}
            </ul>

            {j.requirements && (
              <>
                <h3 className="mt-5 font-bold text-[#10284d]">{t.reqLabel}</h3>
                <ul className="mt-2 space-y-2 text-sm text-[#2a3d58]">
                  {j.requirements[locale].map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Icon name="checkSquare" className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4f9f]" strokeWidth={1.8} />
                      {x}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {j.costNote && (
              <p className="mt-4 rounded-lg bg-[#fff6e8] p-3 text-sm text-[#7a5410] ring-1 ring-[#f0dcb8]">
                {j.costNote[locale]}
              </p>
            )}

            <Link
              href={ROUTES.contact[locale] as Route}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
            >
              {t.apply}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
