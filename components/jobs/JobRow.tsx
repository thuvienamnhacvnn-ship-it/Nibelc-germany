"use client";

import Image from "next/image";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung, nhanNgonNgu } from "@/types/job";
import { industryById } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { NHAN_DON_HANG } from "@/data/i18n/jobs";
import { useLang, useT } from "@/lib/i18n/client";
import { donHang } from "@/lib/i18n/dict/don-hang";
import type { JobFull } from "@/data/jobs";

/** Đơn hàng ở chế độ danh sách — cùng dữ liệu với JobCard, chỉ đổi bố cục. */
export function JobRow({ job }: { job: JobFull }) {
  const nganh = industryById(job.industryId);
  const lang = useLang();
  const tx = useT(donHang);
  const nhanMa = useT(NHAN_DON_HANG);
  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="nb-card group flex flex-col gap-4 overflow-hidden p-4 sm:flex-row sm:gap-5"
      aria-label={tx.tai(job.title, job.city)}
    >
      {/* Ảnh cố định 196px cộng cột giá bên phải làm hàng rộng hơn cả màn hình
          điện thoại. Dưới sm thì xếp dọc: ảnh trải hết chiều ngang. */}
      <span className="relative block h-[168px] w-full shrink-0 overflow-hidden rounded-[10px] sm:h-[128px] sm:w-[196px]">
        <Image
          src={job.image}
          alt=""
          fill
          sizes="(min-width:640px) 196px, 100vw"
          className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-2">
          {/* 12,5px chứ không 11,5px: dưới 12px là dưới sàn đọc được, QA bắt
              ở vòng 2. Tên ngành lấy theo ngôn ngữ đang xem. */}
          {nganh && (
            <span className="rounded-full border border-[var(--nb-line)] px-2.5 py-0.5 text-[12.5px] text-[var(--nb-gold-soft)]">
              {tenNganh(nganh, lang)}
            </span>
          )}
          {job.isSample && (
            <span className="rounded-full bg-[var(--nb-cyan)]/85 px-2 py-0.5 text-[12px] font-bold text-white">{tx.mau}</span>
          )}
        </span>

        {/* truncate cắt tên đơn còn một nửa trên màn hẹp; cho xuống hai dòng */}
        <b className="mt-2 text-[17px] leading-snug font-semibold text-white [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:truncate sm:text-[18px] sm:[display:block]">
          {job.title}
        </b>
        <span className="mt-0.5 block text-[12.5px] text-[var(--nb-text-mute)]">{tenNhaTuyenDung(job, lang)}</span>

        <span className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-3 text-[13px] text-[var(--nb-text-dim)]">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[var(--nb-gold)]" />
            {tx.soSuat(job.vacancies)}
          </span>
          {/* ẩn khi chưa biết đơn cần tiếng gì — xem nhanNgonNgu() */}
          {nhanNgonNgu(job, lang) && <span>{nhanNgonNgu(job, lang)}</span>}
          <span>{nhanMa.chuongTrinh[job.programType]}</span>
        </span>
      </span>

      {/* Dưới sm cột giá nằm thành một hàng ngang dưới nội dung: giá bên trái,
          nút xem bên phải — không còn chen ngang làm thẻ rộng quá màn hình. */}
      <span className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--nb-line-soft)] pt-3 sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:py-1 sm:pr-1 sm:pt-0">
        <b className="nb-gold-text text-[19px] font-bold whitespace-nowrap">{chuoiLuong(job, lang)}</b>
        <span className="flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-[var(--nb-gold-soft)] sm:min-h-0">
          {tx.xemChiTiet}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </NavLink>
  );
}
