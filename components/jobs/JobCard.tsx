import Image from "next/image";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung } from "@/types/job";
import { industryById } from "@/data/industries";
import type { JobFull } from "@/data/jobs";

/** Thẻ đơn hàng dùng chung cho trang chủ, danh sách và khối đơn liên quan. */
export function JobCard({ job, lon = false }: { job: JobFull; lon?: boolean }) {
  const nganh = industryById(job.industryId);

  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="nb-card group block h-full overflow-hidden"
      aria-label={`${job.title} tại ${job.city}`}
    >
      <span className={`relative block overflow-hidden ${lon ? "h-[260px]" : "h-[188px]"}`}>
        <Image
          src={job.image}
          alt=""
          fill
          sizes={lon ? "(min-width:1280px) 640px, 100vw" : "(min-width:1280px) 420px, 100vw"}
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.05]"
        />
        <span
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(7,21,37,.05) 40%, rgba(7,21,37,.88))" }}
          aria-hidden="true"
        />
        {nganh && (
          <span className="absolute top-3 left-3 rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/78 px-3 py-1 text-[11.5px] font-semibold text-[var(--nb-gold-soft)]">
            {nganh.titleVi}
          </span>
        )}
        {/* cờ Đức + thành phố, góc phải trên ảnh — mô-típ của ảnh mẫu */}
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[var(--nb-navy-900)]/78 px-2.5 py-1 text-[11.5px] font-semibold text-white">
          <span className="nb-co-duc h-[9px] w-[14px]" aria-hidden="true">
            <span style={{ background: "#111" }} />
            <span style={{ background: "#d00" }} />
            <span style={{ background: "#fc0" }} />
          </span>
          {job.city}
        </span>

        {job.isSample ? (
          <span className="absolute top-11 right-3 rounded-full bg-[var(--nb-cyan)]/85 px-2.5 py-1 text-[10.5px] font-bold text-white">
            MẪU
          </span>
        ) : (
          job.featured && (
            <span className="absolute top-11 right-3 rounded-full bg-[var(--nb-gold)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--nb-navy-900)]">
              NỔI BẬT
            </span>
          )
        )}
      </span>

      <span className="block p-5">
        <b className={`block leading-snug font-semibold text-white ${lon ? "text-[21px]" : "text-[17px]"}`}>
          {job.title}
        </b>
        <span className="mt-1 block text-[12.5px] text-[var(--nb-text-mute)]">{tenNhaTuyenDung(job)}</span>

        <b className="nb-gold-text mt-3 block text-[20px] font-bold">{chuoiLuong(job)}</b>

        <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-[var(--nb-text-dim)]">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[var(--nb-gold)]" />
            {job.vacancies} suất
          </span>
        </span>

        <span className="mt-4 flex flex-wrap gap-1.5">
          {[job.programType, `Tiếng ${job.languageLevel}`, job.employmentType].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--nb-line-soft)] px-2.5 py-1 text-[11.5px] text-[var(--nb-text-dim)]"
            >
              {t}
            </span>
          ))}
        </span>

        <span className="mt-5 flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--nb-gold-soft)]">
          Xem chi tiết
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </NavLink>
  );
}
