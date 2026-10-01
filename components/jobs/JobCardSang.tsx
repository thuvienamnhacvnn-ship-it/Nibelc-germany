import Image from "next/image";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec } from "@/types/job";
import { industryById } from "@/data/industries";
import type { JobFull } from "@/data/jobs";

/**
 * THẺ ĐƠN HÀNG NỀN SÁNG — chỉ dùng ở desktop (≥1024px) của /don-hang và
 * /don-hang/[slug]. Khổ điện thoại và trang chủ vẫn dùng JobCard (nền navy).
 *
 * Khung lấy từ hyperui marketing/blog-cards/1.html (ảnh trên, chữ dưới,
 * shadow-sm → hover:shadow-lg), màu demo thay bằng token .dh-sang.
 *
 * Luật: ảnh để trơn — KHÔNG chữ, KHÔNG huy hiệu, KHÔNG lớp phủ đè lên ảnh
 * (ảnh đơn hàng có mặt người ở mọi góc). Nhãn ngành / nổi bật / mẫu nằm
 * dưới ảnh.
 */

/** Có tên công ty thì ghi kèm; không thì chỉ nơi làm việc — tránh lặp
    "Đối tác tại Graz · Graz, Áo". Không bịa tên công ty. */
function diaDiem(job: JobFull) {
  return job.company ? `${job.company} · ${noiLamViec(job)}` : noiLamViec(job);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--s-line)] bg-[var(--s-soft)] px-2.5 py-1 text-[12px] leading-none font-medium whitespace-nowrap text-[var(--s-body)]">
      {children}
    </span>
  );
}

function NhanTren({ job }: { job: JobFull }) {
  const nganh = industryById(job.industryId);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {nganh && (
        <span className="min-w-0 truncate text-[11.5px] font-semibold tracking-[0.08em] text-[var(--s-gold)] uppercase">
          {nganh.titleVi}
        </span>
      )}
      {/* Không gắn "NỔI BẬT": dữ liệu hiện tại đơn nào cũng featured, gắn
          cả lưới thì nhãn mất nghĩa. Chỉ báo đơn MẪU. */}
      {job.isSample && (
        <span className="shrink-0 rounded-full bg-[var(--s-soft)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.05em] text-[var(--s-mute)] ring-1 ring-[var(--s-line)]">
          MẪU
        </span>
      )}
    </span>
  );
}

export function JobCardSang({ job }: { job: JobFull }) {
  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--s-line)] bg-[var(--s-page)] shadow-[var(--s-shadow-rest)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--s-shadow-hover)]"
      aria-label={`${job.title} tại ${job.city}`}
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-[var(--s-soft)]">
        <Image
          src={job.image}
          alt=""
          fill
          sizes="(min-width:1280px) 340px, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </span>

      <span className="flex flex-1 flex-col p-5">
        <NhanTren job={job} />

        <b className="mt-2 block min-h-[2.7em] text-[17px] leading-[1.35] font-semibold text-[var(--s-ink)] [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {job.title}
        </b>
        <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--s-mute)]">
          <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
          <span className="truncate">
            {diaDiem(job)}
          </span>
        </span>

        <span className="mt-4 block">
          <span className="block text-[11.5px] text-[var(--s-mute)]">Thu nhập</span>
          <b className="mt-0.5 block text-[20px] leading-tight font-bold text-[var(--s-ink)]">{chuoiLuong(job)}</b>
        </span>

        <span className="mt-3.5 mb-5 flex flex-wrap gap-1.5">
          <Chip>
            <Users size={12} strokeWidth={1.75} />
            {job.vacancies} người
          </Chip>
          <Chip>Tiếng {job.languageLevel}</Chip>
        </span>

        <span className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--s-line)] pt-4">
          <span className="min-w-0 truncate text-[12.5px] text-[var(--s-mute)]">
            {job.programType} · {job.employmentType}
          </span>
          <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border whitespace-nowrap border-[var(--s-ink)] px-4 text-[13px] font-semibold text-[var(--s-ink)] transition group-hover:bg-[var(--s-ink)] group-hover:text-white">
            Xem chi tiết
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </NavLink>
  );
}

/** Chế độ "Danh sách" — hàng ngang gọn, ảnh nhỏ bên trái. */
export function JobRowSang({ job }: { job: JobFull }) {
  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="group grid grid-cols-[200px_minmax(0,1fr)_auto] items-stretch gap-5 rounded-2xl border border-[var(--s-line)] bg-[var(--s-page)] p-3.5 shadow-[var(--s-shadow-rest)] transition duration-200 ease-out hover:shadow-[var(--s-shadow-hover)]"
      aria-label={`${job.title} tại ${job.city}`}
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-[var(--s-soft)]">
        <Image src={job.image} alt="" fill sizes="200px" className="object-cover" />
      </span>

      <span className="flex min-w-0 flex-col justify-center py-1">
        <NhanTren job={job} />
        <b className="mt-1.5 block truncate text-[17px] leading-snug font-semibold text-[var(--s-ink)]">{job.title}</b>
        <span className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--s-mute)]">
          <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
          <span className="truncate">
            {diaDiem(job)}
          </span>
        </span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          <Chip>
            <Users size={12} strokeWidth={1.75} />
            {job.vacancies} người
          </Chip>
          <Chip>Tiếng {job.languageLevel}</Chip>
          <Chip>{job.employmentType}</Chip>
          <Chip>{job.programType}</Chip>
        </span>
      </span>

      <span className="flex min-w-[190px] flex-col items-end justify-between border-l border-[var(--s-line)] py-1 pr-1.5 pl-5">
        <span className="text-right">
          <span className="block text-[11.5px] text-[var(--s-mute)]">Thu nhập</span>
          <b className="mt-0.5 block text-[18px] leading-tight font-bold whitespace-nowrap text-[var(--s-ink)]">
            {chuoiLuong(job)}
          </b>
        </span>
        <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border whitespace-nowrap border-[var(--s-ink)] px-4 text-[13px] font-semibold text-[var(--s-ink)] transition group-hover:bg-[var(--s-ink)] group-hover:text-white">
          Xem chi tiết
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </span>
    </NavLink>
  );
}
