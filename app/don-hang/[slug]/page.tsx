import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Briefcase, CalendarClock, Check, Clock, GraduationCap, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { JobCard } from "@/components/jobs/JobCard";
import { JobCardSang } from "@/components/jobs/JobCardSang";
import { JobGallery } from "@/components/jobs/JobGallery";
import { JOBS } from "@/data/jobs";
import { getJobBySlug, getJobs, NHAN_DON_HANG } from "@/data/i18n/jobs";
import { industryById } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung } from "@/types/job";
import { LEGAL } from "@/data/company";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { donHang } from "@/lib/i18n/dict/don-hang";
import { tien } from "@/lib/i18n/format";
import "../don-hang-sang.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang();
  const j = getJobBySlug(slug, lang);
  if (!j) return {};
  const tx = t(donHang, lang);
  return {
    title: tx.meta.chiTietTieuDe(j.title, j.city),
    description: tx.meta.chiTietMoTa(j.title, noiLamViec(j), chuoiLuong(j, lang), j.vacancies, j.languageLevel),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const job = getJobBySlug(slug, lang);
  if (!job) notFound();
  const tx = t(donHang, lang);
  const nhanMa = t(NHAN_DON_HANG, lang);

  const nganh = industryById(job.industryId);
  const lienQuan = getJobs(lang)
    .filter((j) => j.industryId === job.industryId && j.id !== job.id)
    .slice(0, 3);

  const THONG_TIN = [
    { Icon: MapPin, nhan: tx.ct.noiLamViec, gt: noiLamViec(job) },
    { Icon: Users, nhan: tx.ct.soLuong, gt: tx.soSuat(job.vacancies) },
    { Icon: GraduationCap, nhan: tx.ct.tiengDuc, gt: job.languageLevel },
    { Icon: Briefcase, nhan: tx.ct.chuongTrinh, gt: nhanMa.chuongTrinh[job.programType] },
    { Icon: Clock, nhan: tx.ct.gioLam, gt: job.hours ? tx.ct.gioTuan(job.hours) : tx.ct.theoHopDong },
    { Icon: CalendarClock, nhan: tx.ct.hinhThuc, gt: nhanMa.hinhThuc[job.employmentType] },
  ];

  return (
    <div className="nb-duoi-header dh-sang lg:[background:linear-gradient(var(--s-ink)_var(--nb-header),var(--s-page)_0)]">
      {/* Dưới lg lưới này chỉ có MỘT cột, nhưng để `grid` trần thì cột là
          `auto` = min-content, mà min-content của cột trái bị hàng ảnh thu nhỏ
          cuộn ngang trong JobGallery kéo ra 806px — cả trang rộng 839px trên
          khung 390px, tiêu đề và nút "Ứng tuyển" bị cắt mất nửa.
          `grid-cols-[minmax(0,1fr)]` khoá cột trong khung; `min-w-0` ở article
          chặn luôn đường còn lại (min-width:auto của chính thẻ con). */}
      <div className="nb-wrap grid grid-cols-[minmax(0,1fr)] gap-8 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:pt-10 lg:pb-20">
        {/* ---------------- TRÁI ---------------- */}
        <article className="min-w-0">
          <nav aria-label={tx.ct.duongDan} className="flex items-center gap-2 text-[13px] text-[var(--nb-text-mute)] lg:text-[var(--s-mute)]">
            {/* Chữ 13px cho vùng bấm cao 21px — ngón tay bấm trượt. Nới sàn
                44px ở khổ điện thoại (đúng cách bảng lọc đang làm), desktop
                giữ nguyên dòng mảnh. */}
            <NavLink
              href="/don-hang"
              className="inline-flex min-h-[44px] items-center transition hover:text-[var(--nb-gold-soft)] lg:min-h-0 lg:font-medium lg:text-[var(--s-gold)] lg:hover:text-[var(--s-ink)]"
            >
              {tx.ct.donHang}
            </NavLink>
            <span>/</span>
            <span className="truncate text-[var(--nb-text-dim)] lg:text-[var(--s-body)]">{job.title}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nganh && (
              <span className="rounded-full border border-[var(--nb-line)] px-3 py-1 text-[12px] text-[var(--nb-gold-soft)] lg:border-[var(--s-line-warm)] lg:bg-[var(--s-alt)] lg:font-semibold lg:text-[var(--s-gold)]">
                {lang === "vi" ? (
                  <>
                    {nganh.titleVi} · <span lang="de">{nganh.titleDe}</span>
                  </>
                ) : (
                  tenNganh(nganh, lang)
                )}
              </span>
            )}
            {job.isSample && (
              <span className="rounded-full bg-[var(--nb-navy-800)] px-2.5 py-1 text-[12px] font-bold tracking-[0.04em] text-[var(--nb-gold)] ring-1 ring-[var(--nb-gold)]/40 lg:text-[12px]">
                {tx.ct.duLieuMau}
              </span>
            )}
          </div>

          <h1 className="nb-display mt-3 text-[23px] leading-[1.2] text-white sm:text-[clamp(26px,2.6vw,38px)] sm:leading-[1.15] lg:text-[38px] lg:text-balance lg:text-[var(--s-ink)]">{job.title}</h1>
          <p className="mt-2 text-[14.5px] text-[var(--nb-text-mute)] lg:text-[15px] lg:text-[var(--s-mute)]">{tenNhaTuyenDung(job, lang)}</p>

          <div className="mt-7">
            <JobGallery anh={job.gallery.length ? job.gallery : [job.image]} ten={job.title} />
          </div>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {THONG_TIN.map(({ Icon, nhan, gt }) => (
              <li key={nhan} className="nb-panel flex items-center gap-2.5 p-3 sm:gap-3 sm:p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--nb-line)] text-[var(--nb-gold)] lg:h-10 lg:w-10 lg:rounded-xl lg:border-0 lg:bg-[var(--s-alt)] lg:text-[var(--s-gold)]">
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] text-[var(--nb-text-mute)] lg:text-[var(--s-mute)]">{nhan}</span>
                  <b className="mt-0.5 block truncate text-[13.5px] font-semibold text-white sm:text-[14.5px] lg:text-[var(--s-ink)]">{gt}</b>
                </span>
              </li>
            ))}
          </ul>

          {job.description && (
            <Khoi tieuDe={tx.ct.moTa}>
              <p className="text-[14.5px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[15px] lg:max-w-[72ch] lg:text-[16px] lg:text-[var(--s-body)]">{job.description}</p>
            </Khoi>
          )}

          {job.positions.length > 0 && (
            <Khoi tieuDe={tx.ct.viTri}>
              <ul className="overflow-hidden rounded-xl border border-[var(--nb-line-soft)] lg:border-[var(--s-line)]">
                {job.positions.map((v, i) => (
                  <li
                    key={`${v.name}-${i}`}
                    className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-4 py-3 sm:px-5 sm:py-3.5 ${
                      i % 2 ? "bg-white/[.02] lg:bg-[var(--s-soft)]" : ""
                    }`}
                  >
                    <span className="min-w-0 flex-1 basis-full text-[14.5px] text-[var(--nb-text)] sm:basis-0 lg:text-[15px] lg:text-[var(--s-ink)]">{v.name}</span>
                    <span className="flex shrink-0 items-center gap-4 text-[13.5px]">
                      {v.count !== null && <span className="text-[var(--nb-text-dim)] lg:text-[var(--s-body)]">{tx.soSuat(v.count)}</span>}
                      {v.salaryFrom !== null && (
                        <b className="nb-gold-text font-semibold">
                          {v.salaryTo && v.salaryTo !== v.salaryFrom
                            ? `${tien(v.salaryFrom, lang)} – ${tien(v.salaryTo, lang)}`
                            : tien(v.salaryFrom, lang)}
                        </b>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Khoi>
          )}

          {job.requirements.length > 0 && (
            <Khoi tieuDe={tx.ct.yeuCau}>
              <DanhSach ds={job.requirements} />
            </Khoi>
          )}

          {job.benefits.length > 0 && (
            <Khoi tieuDe={tx.ct.quyenLoi}>
              <DanhSach ds={job.benefits} />
            </Khoi>
          )}

          <Khoi tieuDe={tx.ct.quyTrinh}>
            <ol className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {tx.ct.buoc.map((b, i) => (
                <li key={b} className="nb-panel flex gap-3 p-3.5 sm:p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--nb-gold)] text-[12px] font-bold text-[var(--nb-navy-900)] lg:bg-[var(--s-ink)] lg:text-white">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-[1.6] text-[var(--nb-text-dim)] lg:text-[14.5px] lg:text-[var(--s-body)]">{b}</span>
                </li>
              ))}
            </ol>
          </Khoi>
        </article>

        {/* ---------------- PHẢI ---------------- */}
        <aside className="lg:sticky lg:top-[calc(var(--nb-header)+24px)] lg:h-fit">
          <div className="nb-panel overflow-hidden">
            <div className="nb-gold-rule lg:hidden" aria-hidden="true" />
            <div className="p-5 sm:p-6 lg:p-7">
              <p className="text-[12.5px] text-[var(--nb-text-mute)] lg:text-[13px] lg:text-[var(--s-mute)]">{tx.thuNhap}</p>
              <b className="nb-gold-text nb-display mt-1 block text-[27px] sm:text-[30px] lg:text-[28px] lg:leading-tight">{chuoiLuong(job, lang)}</b>

              <dl className="mt-5 space-y-3 border-t border-[var(--nb-line-soft)] pt-5 text-[14px] lg:border-[var(--s-line)]">
                {[
                  [tx.ct.noiLamViec, noiLamViec(job)],
                  [tx.ct.soSuat, `${job.vacancies}`],
                  [tx.ct.tiengDuc, job.languageLevel],
                  [tx.ct.kinhNghiem, job.experience],
                  [tx.ct.chuongTrinh, nhanMa.chuongTrinh[job.programType]],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-[var(--nb-text-mute)] lg:text-[var(--s-mute)]">{k}</dt>
                    <dd className="text-right font-medium text-white lg:text-[var(--s-ink)]">{v}</dd>
                  </div>
                ))}
              </dl>

              <NavLink href="/lien-he" className="nb-btn mt-6 h-12 w-full px-6 text-[15px]">
                {tx.ct.ungTuyen}
                <ArrowRight size={16} />
              </NavLink>

              <a
                href={`tel:${LEGAL.phone.replace(/\s/g, "")}`}
                className="nb-btn-ghost mt-2.5 h-11 w-full px-5 text-[13.5px]"
              >
                {tx.ct.goi(LEGAL.phone)}
              </a>

              <p className="mt-4 text-[12px] leading-[1.6] text-[var(--nb-text-mute)] lg:text-[var(--s-mute)]">
                {tx.ct.ghiChu}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {lienQuan.length > 0 && (
        <section className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-16 lg:border-[var(--s-line-warm)] lg:bg-[var(--s-alt)] lg:py-20">
          <div className="nb-wrap">
            <h2 className="nb-display text-[22px] text-white sm:text-[26px] lg:text-[32px] lg:text-[var(--s-ink)]">{tx.ct.cungNganh}</h2>
            <ul className="mt-6 grid gap-5 sm:mt-7 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 lg:hidden">
              {lienQuan.map((j) => (
                <li key={j.id}>
                  <JobCard job={j} />
                </li>
              ))}
            </ul>
            <ul className="hidden lg:mt-8 lg:grid lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-6">
              {lienQuan.map((j) => (
                <li key={j.id}>
                  <JobCardSang job={j} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function Khoi({ tieuDe, children }: { tieuDe: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 sm:mt-10 lg:mt-12">
      <h2 className="nb-display text-[19px] text-white sm:text-[21px] lg:text-[24px] lg:text-[var(--s-ink)]">{tieuDe}</h2>
      <span className="mt-3 mb-5 block h-px w-16 bg-[var(--nb-gold)] lg:h-[2px] lg:w-12 lg:bg-[var(--s-gold-brand)]" aria-hidden="true" />
      {children}
    </section>
  );
}

function DanhSach({ ds }: { ds: string[] }) {
  return (
    <ul className="space-y-2.5">
      {ds.map((x) => (
        <li key={x} className="flex gap-2.5 text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)] sm:gap-3 sm:text-[15px] lg:text-[16px] lg:text-[var(--s-body)]">
          <Check size={17} className="mt-[3px] shrink-0 text-[var(--nb-gold)] lg:mt-1 lg:text-[var(--s-gold)]" />
          {x}
        </li>
      ))}
    </ul>
  );
}
