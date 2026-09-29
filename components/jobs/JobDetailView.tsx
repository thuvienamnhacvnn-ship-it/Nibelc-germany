import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { Tabs } from "@/components/sub/Tabs";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel, Tick } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { industryBySlug, industryName } from "@/content/industries";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs, type JobFull } from "@/content/jobs-all";
import { LEGAL } from "@/content/legal";
import { ROUTES, industryPath, jobPath, type Locale } from "@/content/locales";
import { PROCESS } from "@/content/page-process";

/**
 * TRANG 03 — CHI TIẾT ĐƠN HÀNG (mới hoàn toàn, trước đây web không có).
 *
 * Bố cục theo KIT: banner điện ảnh dùng chính ảnh của đơn hàng, cột phải là
 * tấm "Ứng tuyển ngay" kèm cam kết hỗ trợ, dưới là dải tab. Mọi con số đều
 * đọc từ dữ liệu đơn hàng; tin nào không khai mục nào thì mục đó không hiện.
 */

const NHAN: Record<Locale, Record<string, string>> = {
  de: {
    tongQuan: "Überblick",
    congViec: "Aufgaben",
    yeuCau: "Voraussetzungen",
    quyenLoi: "Leistungen",
    quyTrinh: "Ablauf",
    lienHe: "Kontakt",
    ungTuyen: "Jetzt bewerben",
    tongQuanTitle: "Überblick zum Auftrag",
    viTri: "Positionen und Vergütung",
    hopDong: "Vertrag",
    donKhac: "Weitere offene Stellen",
    tuVan: "Kostenlose 1:1-Beratung",
    hoSo: "Hilfe beim Zusammenstellen der Unterlagen",
    daoTao: "Vorbereitung vor der Ausreise",
    dongHanh: "Begleitung vor Ort",
    goiDien: "Anrufen",
    tinGoc: "",
  },
  en: {
    tongQuan: "Overview",
    congViec: "Tasks",
    yeuCau: "Requirements",
    quyenLoi: "Benefits",
    quyTrinh: "Process",
    lienHe: "Contact",
    ungTuyen: "Apply now",
    tongQuanTitle: "About this assignment",
    viTri: "Positions and pay",
    hopDong: "Contract",
    donKhac: "Other open positions",
    tuVan: "Free 1:1 guidance",
    hoSo: "Help preparing your documents",
    daoTao: "Training before departure",
    dongHanh: "Support after arrival",
    goiDien: "Call us",
    tinGoc: "",
  },
  vi: {
    tongQuan: "Tổng quan",
    congViec: "Công việc",
    yeuCau: "Yêu cầu",
    quyenLoi: "Quyền lợi",
    quyTrinh: "Quy trình",
    lienHe: "Liên hệ",
    ungTuyen: "Ứng tuyển ngay",
    tongQuanTitle: "Tổng quan đơn hàng",
    viTri: "Các vị trí và mức lương",
    hopDong: "Hợp đồng",
    donKhac: "Các đơn hàng khác",
    tuVan: "Tư vấn 1:1 miễn phí",
    hoSo: "Hỗ trợ chuẩn bị hồ sơ",
    daoTao: "Đào tạo trước xuất cảnh",
    dongHanh: "Đồng hành tại nước sở tại",
    goiDien: "Gọi điện",
    tinGoc: "Tin tuyển dụng gốc của đơn hàng này:",
  },
};

const EUR = (n: number) => n.toLocaleString("de-DE");

function Fact({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <IconBox name={icon} size={44} />
      <div className="min-w-0">
        <b className="block text-[19px] leading-tight font-bold text-white">{value}</b>
        <span className="block text-[12.5px] text-white/55">{label}</span>
      </div>
    </div>
  );
}

export function JobDetailView({ locale, job }: { locale: Locale; job: JobFull }) {
  const t = JOBS_COPY[locale];
  const n = NHAN[locale];
  const tel = LEGAL.phone.replace(/\s/g, "");
  const nganh = job.industry ? industryBySlug(job.industry) : undefined;
  const khac = allJobs(locale)
    .filter((j) => j.id !== job.id)
    .slice(0, 3);

  const luong =
    job.salary.from === job.salary.to ? `${EUR(job.salary.from)} €` : `${EUR(job.salary.from)} – ${EUR(job.salary.to)} €`;

  const facts: { icon: string; value: string; label: string }[] = [];
  if (job.slots !== undefined) facts.push({ icon: "users", value: String(job.slots), label: t.slotsLabel });
  if (job.contract) facts.push({ icon: "doc", value: job.contract, label: n.hopDong! });
  if (job.hoursPerWeek !== undefined) facts.push({ icon: "clock", value: `${job.hoursPerWeek} h`, label: t.hoursLabel });
  if (job.locations?.length) facts.push({ icon: "pin", value: job.locations.join(" · "), label: t.locationLabel });
  if (job.visa) facts.push({ icon: "badge", value: job.visa, label: t.visaLabel });

  const heroExtra = (
    <div className="max-w-[760px]">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/40" aria-hidden="true">
            {job.flag.map((c, i) => (
              <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
            ))}
          </span>
          <span className="text-[15px] font-semibold text-white/80">{job.countryName}</span>
        </span>
      </p>
      <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
        <b className="nb-sub-gold text-[34px] leading-none font-extrabold lg:text-[42px]">{luong}</b>
        <span className="text-[16px] text-white/65">{t.perMonth}</span>
      </p>
      {job.salaryNote && <p className="mt-2 text-[14px] text-white/50">{job.salaryNote}</p>}

      {facts.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/12 pt-7">
          {facts.slice(0, 4).map((f) => (
            <Fact key={f.label} {...f} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SubShell
      locale={locale}
      page="jobs"
      heroTall
      hero={job.image}
      heroFocus={job.imageFocus}
      eyebrow={t.eyebrow}
      title={job.title}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title, href: ROUTES.jobs[locale] },
        { label: job.title },
      ]}
      heroExtra={heroExtra}
    >
      {/* ---------------- THÂN: TAB + CỘT PHẢI ---------------- */}
      <section className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[1fr_380px] lg:px-12 lg:py-20">
        <div className="min-w-0">
          <Tabs
            items={[
              {
                key: "tq",
                label: n.tongQuan!,
                body: (
                  <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
                    <div>
                      <H2 className="!mt-0 !text-[26px] lg:!text-[30px]">{n.tongQuanTitle}</H2>
                      <p className="mt-5 text-[16px] leading-[1.8] text-white/75">{job.summary}</p>
                      {job.roles && (
                        <>
                          <p className="mt-8 text-[13px] font-bold tracking-[0.18em] text-[var(--nb-gold)] uppercase">{n.viTri}</p>
                          <ul className="mt-4 divide-y divide-white/10">
                            {job.roles.map((r) => (
                              <li key={r.label[locale]} className="flex items-center justify-between gap-6 py-3">
                                <span className="text-[15px] text-white/80">{r.label[locale]}</span>
                                <b className="whitespace-nowrap text-[15px] text-[var(--nb-gold)]">
                                  {EUR(r.from)} – {EUR(r.to)} €
                                </b>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {job.costNote && (
                        <p className="mt-7 rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 p-4 text-[14px] leading-[1.65] text-[var(--nb-sub-ivory)]">
                          {job.costNote}
                        </p>
                      )}
                    </div>
                    {job.gallery[1] && (
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <Image src={job.gallery[1]} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                      </span>
                    )}
                  </div>
                ),
              },
              ...(job.tasks
                ? [
                    {
                      key: "cv",
                      label: n.congViec!,
                      body: (
                        <ul className="grid gap-4 sm:grid-cols-2">
                          {job.tasks.map((x) => (
                            <Tick key={x}>{x}</Tick>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              ...(job.requirements
                ? [
                    {
                      key: "yc",
                      label: n.yeuCau!,
                      body: (
                        <ul className="grid gap-4 sm:grid-cols-2">
                          {job.requirements.map((x) => (
                            <Tick key={x}>{x}</Tick>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              ...(job.benefits
                ? [
                    {
                      key: "ql",
                      label: n.quyenLoi!,
                      body: (
                        <ul className="grid gap-4 sm:grid-cols-2">
                          {job.benefits.map((x) => (
                            <Tick key={x}>{x}</Tick>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              {
                key: "qt",
                label: n.quyTrinh!,
                body: (
                  <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PROCESS[locale].steps.map((s, i) => (
                      <li key={s.title} className="nb-sub-panel p-5">
                        <b className="block text-[13px] font-extrabold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</b>
                        <b className="mt-2 block text-[15px] font-bold text-white">{s.title}</b>
                        <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-white/60">{s.sub.join(" ")}</span>
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                key: "lh",
                label: n.lienHe!,
                body: (
                  <div className="flex flex-wrap items-center gap-4">
                    <GoldBtn href={ROUTES.contact[locale]}>{t.apply}</GoldBtn>
                    <a href={`tel:${tel}`} className="nb-sub-ghost h-12 px-6 text-[15px]">
                      <Icon name="phone" className="h-[18px] w-[18px]" strokeWidth={1.9} />
                      {LEGAL.phone}
                    </a>
                    <a href={`mailto:${LEGAL.email}`} className="nb-sub-ghost h-12 px-6 text-[15px]">
                      <Icon name="mail" className="h-[18px] w-[18px]" strokeWidth={1.9} />
                      {LEGAL.email}
                    </a>
                  </div>
                ),
              },
            ]}
          />

          {/* Tin tuyển dụng gốc — chỉ bản tiếng Việt, đúng nơi nó được phát hành */}
          {locale === "vi" && job.poster && (
            <div className="mt-14 border-t border-white/10 pt-10">
              <p className="text-[13px] font-semibold text-white/55">{n.tinGoc}</p>
              <Image
                src={job.poster}
                alt={job.title}
                width={1254}
                height={1254}
                sizes="(min-width:1024px) 460px, 100vw"
                className="mt-4 w-full max-w-[460px] rounded-2xl ring-1 ring-white/12"
              />
            </div>
          )}

          <p className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-[13.5px] leading-[1.7] text-white/50">
            {t.note}
          </p>
        </div>

        {/* ---------------- CỘT PHẢI: ỨNG TUYỂN ---------------- */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <Panel className="p-7">
            <GoldBtn href={ROUTES.contact[locale]} size="lg" className="w-full">
              {n.ungTuyen}
            </GoldBtn>
            <ul className="mt-7 space-y-5">
              {[
                { icon: "chat", text: n.tuVan! },
                { icon: "doc", text: n.hoSo! },
                { icon: "cap", text: n.daoTao! },
                { icon: "handshake", text: n.dongHanh! },
              ].map((x) => (
                <li key={x.text} className="flex items-center gap-4">
                  <IconBox name={x.icon} size={40} />
                  <span className="text-[14.5px] leading-[1.5] text-white/80">{x.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 border-t border-white/10 pt-6">
              <a href={`tel:${tel}`} className="flex items-center gap-3 text-[15px] font-semibold text-white/80 transition hover:text-[var(--nb-gold)]">
                <Icon name="phone" className="h-[18px] w-[18px] text-[var(--nb-gold)]" strokeWidth={1.9} />
                {LEGAL.phone}
              </a>
            </div>
          </Panel>

          {nganh && (
            <Panel className="mt-6 p-6">
              <Eyebrow>{t.industryLink}</Eyebrow>
              <Link
                href={industryPath(locale, nganh.slug) as Route}
                className="mt-4 flex items-center justify-between gap-4 text-[16px] font-bold text-white transition hover:text-[var(--nb-gold)]"
              >
                {industryName(nganh, locale)}
                <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-[var(--nb-gold)]" strokeWidth={2} />
              </Link>
            </Panel>
          )}
        </aside>
      </section>

      {/* ---------------- ĐƠN HÀNG KHÁC ---------------- */}
      <section className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <H2 className="!text-[26px] lg:!text-[34px]">{n.donKhac}</H2>
            </div>
            <GhostBtn href={ROUTES.jobs[locale]}>{t.tickerCta}</GhostBtn>
          </div>

          <ul className="mt-9 grid gap-6 md:grid-cols-3">
            {khac.map((j) => (
              <li key={j.id}>
                <Link href={jobPath(locale, j.id) as Route} className="nb-sub-panel nb-sub-panel-hover block overflow-hidden">
                  <span className="relative block h-[170px]">
                    <Image src={j.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: j.imageFocus }} />
                  </span>
                  <span className="block p-5">
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 overflow-hidden rounded-full ring-1 ring-white/30" aria-hidden="true">
                        {j.flag.map((c, i) => (
                          <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
                        ))}
                      </span>
                      <span className="text-[12.5px] text-white/55">{j.countryName}</span>
                    </span>
                    <b className="mt-2 block text-[16px] leading-snug font-bold text-white">{j.title}</b>
                    <b className="mt-2 block text-[15px] font-bold text-[var(--nb-gold)]">
                      {j.salary.from === j.salary.to ? `${EUR(j.salary.from)} €` : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
                      <span className="font-normal text-white/50"> {t.perMonth}</span>
                    </b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SubShell>
  );
}
