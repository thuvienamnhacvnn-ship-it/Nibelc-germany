import Image from "next/image";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung } from "@/types/job";
import { industryById } from "@/data/industries";
import type { JobFull } from "@/data/jobs";

/** Đơn hàng ở chế độ danh sách — cùng dữ liệu với JobCard, chỉ đổi bố cục. */
export function JobRow({ job }: { job: JobFull }) {
  const nganh = industryById(job.industryId);
  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="nb-card group flex gap-5 overflow-hidden p-4"
      aria-label={`${job.title} tại ${job.city}`}
    >
      <span className="relative block h-[128px] w-[196px] shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={job.image}
          alt=""
          fill
          sizes="196px"
          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-2">
          {nganh && (
            <span className="rounded-full border border-[var(--nb-line)] px-2.5 py-0.5 text-[11.5px] text-[var(--nb-gold-soft)]">
              {nganh.titleVi}
            </span>
          )}
          {job.isSample && (
            <span className="rounded-full bg-[var(--nb-cyan)]/85 px-2 py-0.5 text-[10.5px] font-bold text-white">MẪU</span>
          )}
        </span>

        <b className="mt-2 block truncate text-[18px] font-semibold text-white">{job.title}</b>
        <span className="mt-0.5 block text-[12.5px] text-[var(--nb-text-mute)]">{tenNhaTuyenDung(job)}</span>

        <span className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-3 text-[13px] text-[var(--nb-text-dim)]">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[var(--nb-gold)]" />
            {job.vacancies} suất
          </span>
          <span>Tiếng {job.languageLevel}</span>
          <span>{job.programType}</span>
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end justify-between py-1 pr-1">
        <b className="nb-gold-text text-[19px] font-bold whitespace-nowrap">{chuoiLuong(job)}</b>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--nb-gold-soft)]">
          Xem chi tiết
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </NavLink>
  );
}
