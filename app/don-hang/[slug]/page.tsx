import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Briefcase, CalendarClock, Check, Clock, GraduationCap, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { JobCard } from "@/components/jobs/JobCard";
import { JobGallery } from "@/components/jobs/JobGallery";
import { JOBS, jobBySlug, jobsByIndustry } from "@/data/jobs";
import { industryById } from "@/data/industries";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung } from "@/types/job";
import { LEGAL } from "@/data/company";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = jobBySlug(slug);
  if (!j) return {};
  return {
    title: `${j.title} — ${j.city}`,
    description: `${j.title} tại ${j.city}, ${j.state}. ${chuoiLuong(j)}, ${j.vacancies} suất, tiếng Đức ${j.languageLevel}.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobBySlug(slug);
  if (!job) notFound();

  const nganh = industryById(job.industryId);
  const lienQuan = jobsByIndustry(job.industryId)
    .filter((j) => j.id !== job.id)
    .slice(0, 3);

  const THONG_TIN = [
    { Icon: MapPin, nhan: "Nơi làm việc", gt: noiLamViec(job) },
    { Icon: Users, nhan: "Số lượng", gt: `${job.vacancies} suất` },
    { Icon: GraduationCap, nhan: "Tiếng Đức", gt: job.languageLevel },
    { Icon: Briefcase, nhan: "Chương trình", gt: job.programType },
    { Icon: Clock, nhan: "Giờ làm", gt: job.hours ? `${job.hours} giờ / tuần` : "Theo hợp đồng" },
    { Icon: CalendarClock, nhan: "Hình thức", gt: job.employmentType },
  ];

  return (
    <div className="nb-duoi-header">
      {/* Dưới lg lưới này chỉ có MỘT cột, nhưng để `grid` trần thì cột là
          `auto` = min-content, mà min-content của cột trái bị hàng ảnh thu nhỏ
          cuộn ngang trong JobGallery kéo ra 806px — cả trang rộng 839px trên
          khung 390px, tiêu đề và nút "Ứng tuyển" bị cắt mất nửa.
          `grid-cols-[minmax(0,1fr)]` khoá cột trong khung; `min-w-0` ở article
          chặn luôn đường còn lại (min-width:auto của chính thẻ con). */}
      <div className="nb-wrap grid grid-cols-[minmax(0,1fr)] gap-8 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        {/* ---------------- TRÁI ---------------- */}
        {/* ---------------- TRÁI, PHẦN TRÊN ---------------- */}
        <article className="min-w-0 lg:col-start-1 lg:row-start-1">
          <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-[13px] text-[var(--nb-text-mute)]">
            {/* Chữ 13px cho vùng bấm cao 21px — ngón tay bấm trượt. Nới sàn
                44px ở khổ điện thoại (đúng cách bảng lọc đang làm), desktop
                giữ nguyên dòng mảnh. */}
            <NavLink
              href="/don-hang"
              className="inline-flex min-h-[44px] items-center transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
            >
              Đơn hàng
            </NavLink>
            <span>/</span>
            <span className="truncate text-[var(--nb-text-dim)]">{job.title}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {nganh && (
              <span className="rounded-full border border-[var(--nb-line)] px-3 py-1 text-[12px] text-[var(--nb-gold-soft)]">
                {nganh.titleVi} · {nganh.titleDe}
              </span>
            )}
            <span className="rounded-full border border-[var(--nb-line)] px-3 py-1 text-[12px] text-[var(--nb-text-dim)]">
              Kinh nghiệm: {job.experience}
            </span>
            {job.isSample && (
              <span className="rounded-full bg-[var(--nb-cyan)]/85 px-2.5 py-1 text-[12px] font-bold text-white">
                DỮ LIỆU MẪU
              </span>
            )}
          </div>

          <h1 className="nb-display mt-3 text-[23px] leading-[1.2] text-white sm:text-[clamp(26px,2.6vw,38px)] sm:leading-[1.15]">{job.title}</h1>
          <p className="mt-2 text-[14.5px] text-[var(--nb-text-mute)]">{tenNhaTuyenDung(job)}</p>

          <div className="mt-7">
            <JobGallery anh={job.gallery.length ? job.gallery : [job.image]} ten={job.title} />
          </div>

          {/* HAI cột ngay từ khổ điện thoại. Để một cột thì sáu ô này ngốn
              hơn 900px chiều dọc — gần một màn hình rưỡi chỉ để đọc sáu dòng
              thông tin ngắn, mà thẻ ứng tuyển lại nằm ngay sau. */}
          <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
            {THONG_TIN.map(({ Icon, nhan, gt }) => (
              <li key={nhan} className="nb-panel flex items-center gap-2.5 p-2.5 sm:gap-3 sm:p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--nb-line)] text-[var(--nb-gold)] sm:h-9 sm:w-9">
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] text-[var(--nb-text-mute)]">{nhan}</span>
                  <b className="mt-0.5 block truncate text-[13px] font-semibold text-white sm:text-[14.5px]">{gt}</b>
                </span>
              </li>
            ))}
          </ul>
        </article>

        {/* ---------------- THẺ ỨNG TUYỂN ----------------
            Ở khổ điện thoại thẻ này nằm NGAY sau lưới thông tin, trước phần
            mô tả dài. Trước đây nó là khối cuối cùng của trang: đọc xong tiêu
            đề, lương, nơi làm mà muốn ứng tuyển thì phải vuốt qua hết mô tả,
            vị trí tuyển, yêu cầu, quyền lợi, quy trình mới thấy nút — đo ra
            hơn 2.600px. Ở khổ máy tính nó vẫn là cột phải dính theo trang
            như cũ, nhờ đặt hàng/cột tường minh trong lưới.

            Đã BỎ bảng <dl> 5 dòng trong thẻ này: Nơi làm việc / Số suất /
            Tiếng Đức / Chương trình đã nằm nguyên trong lưới 6 thẻ phía
            trên, đọc hai lần cùng một thông tin cách nhau một màn hình. Dòng
            duy nhất không trùng là Kinh nghiệm, đã đưa lên hàng nhãn cạnh
            tiêu đề. Thẻ này nay chỉ còn việc của nó: tiền và nút bấm. */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-[calc(var(--nb-header)+20px)] lg:h-fit">
          <div className="nb-panel overflow-hidden">
            <div className="nb-gold-rule" aria-hidden="true" />
            <div className="p-5 sm:p-6">
              <p className="text-[12.5px] text-[var(--nb-text-mute)]">Thu nhập</p>
              <b className="nb-gold-text nb-display mt-1 block text-[27px] sm:text-[30px]">{chuoiLuong(job)}</b>

              <span className="mt-1 block text-[13px] text-[var(--nb-text-mute)]">
                {job.vacancies} suất · {noiLamViec(job)}
              </span>

              <NavLink href="/lien-he" className="nb-btn mt-6 h-12 w-full px-6 text-[15px]">
                ỨNG TUYỂN NGAY
                <ArrowRight size={16} />
              </NavLink>

              <a
                href={`tel:${LEGAL.phone.replace(/\s/g, "")}`}
                className="nb-btn-ghost mt-2.5 h-11 w-full px-5 text-[13.5px]"
              >
                Gọi {LEGAL.phone}
              </a>

              <p className="mt-4 text-[12px] leading-[1.6] text-[var(--nb-text-mute)]">
                Thông tin trong trang lấy theo thông báo tuyển dụng của đơn hàng. Điều kiện cuối cùng nằm trong hợp đồng
                lao động bạn ký với chủ sử dụng.
              </p>
            </div>
          </div>
        </aside>

        {/* ---------------- TRÁI, PHẦN DƯỚI ---------------- */}
        {/* section đầu tiên bỏ lề trên, khoảng cách đã do gap của lưới lo */}
        <article className="min-w-0 lg:col-start-1 lg:row-start-2 [&>section:first-of-type]:mt-0">
          {job.description && (
            <Khoi tieuDe="Mô tả công việc">
              <p className="text-[14.5px] leading-[1.8] text-[var(--nb-text-dim)] sm:text-[15px]">{job.description}</p>
            </Khoi>
          )}

          {job.positions.length > 0 && (
            <Khoi tieuDe="Vị trí tuyển dụng">
              <ul className="overflow-hidden rounded-xl border border-[var(--nb-line-soft)]">
                {job.positions.map((v, i) => (
                  <li
                    key={`${v.name}-${i}`}
                    className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-4 py-3 sm:px-5 sm:py-3.5 ${
                      i % 2 ? "bg-white/[.02]" : ""
                    }`}
                  >
                    <span className="min-w-0 flex-1 text-[14.5px] text-[var(--nb-text)]">{v.name}</span>
                    <span className="flex shrink-0 items-center gap-4 text-[13.5px]">
                      {v.count !== null && <span className="text-[var(--nb-text-dim)]">{v.count} suất</span>}
                      {v.salaryFrom !== null && (
                        <b className="nb-gold-text font-semibold">
                          {v.salaryFrom.toLocaleString("de-DE")}
                          {v.salaryTo && v.salaryTo !== v.salaryFrom ? ` – ${v.salaryTo.toLocaleString("de-DE")}` : ""} €
                        </b>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Khoi>
          )}

          {job.requirements.length > 0 && (
            <Khoi tieuDe="Yêu cầu">
              <DanhSach ds={job.requirements} />
            </Khoi>
          )}

          {job.benefits.length > 0 && (
            <Khoi tieuDe="Quyền lợi">
              <DanhSach ds={job.benefits} />
            </Khoi>
          )}

          <Khoi tieuDe="Quy trình tham gia">
            <ol className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {[
                "Gửi hồ sơ và được chuyên viên đánh giá",
                "Học tiếng Đức tới trình độ đơn hàng yêu cầu",
                "Phỏng vấn với chủ sử dụng lao động",
                "Ký hợp đồng, nộp hồ sơ visa và xuất cảnh",
              ].map((b, i) => (
                <li key={b} className="nb-panel flex gap-3 p-3.5 sm:p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--nb-gold)] text-[12px] font-bold text-[var(--nb-navy-900)]">
                    {i + 1}
                  </span>
                  <span className="text-[14px] leading-[1.6] text-[var(--nb-text-dim)]">{b}</span>
                </li>
              ))}
            </ol>
          </Khoi>
        </article>
      </div>

      {lienQuan.length > 0 && (
        <section className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-11 sm:py-16">
          <div className="nb-wrap">
            <h2 className="nb-display text-[22px] text-white sm:text-[26px]">Đơn hàng cùng ngành</h2>
            <ul className="mt-6 grid gap-5 sm:mt-7 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lienQuan.map((j) => (
                <li key={j.id}>
                  <JobCard job={j} />
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
    <section className="mt-9 sm:mt-10">
      <h2 className="nb-display text-[19px] text-white sm:text-[21px]">{tieuDe}</h2>
      <span className="mt-3 mb-5 block h-px w-16 bg-[var(--nb-gold)]" aria-hidden="true" />
      {children}
    </section>
  );
}

function DanhSach({ ds }: { ds: string[] }) {
  return (
    <ul className="space-y-2.5">
      {ds.map((x) => (
        <li key={x} className="flex gap-2.5 text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)] sm:gap-3 sm:text-[15px]">
          <Check size={17} className="mt-[3px] shrink-0 text-[var(--nb-gold)]" />
          {x}
        </li>
      ))}
    </ul>
  );
}
