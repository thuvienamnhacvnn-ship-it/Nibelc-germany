"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, MapPin, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec } from "@/types/job";
import type { JobFull } from "@/data/jobs";
import { industryById } from "@/data/industries";

/**
 * THẺ ĐƠN HÀNG NỔI TRÊN HERO
 *
 * Thẻ này mang `layoutId` trùng với thẻ giả đặt trong phong bì, nên Framer
 * Motion tự nối hai vị trí lại: nhìn ra là tờ hồ sơ được RÚT RA khỏi phong bì
 * rồi phóng lên hero, không phải một thẻ mới hiện ra.
 */
export function FeaturedJob({ job }: { job: JobFull }) {
  const nganh = industryById(job.industryId);

  return (
    <motion.article
      layoutId={`job-${job.industryId}`}
      initial={{ opacity: 0, rotate: -3, scale: 0.92 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 2.5, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 210, damping: 26, mass: 0.9 }}
      className="w-[min(420px,86vw)] overflow-hidden rounded-[18px] border border-[var(--nb-line)] bg-[var(--nb-navy-800)]/88 backdrop-blur-md"
      style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,.95), 0 0 0 1px rgba(217,184,120,.12)" }}
    >
      <div className="relative h-[168px]">
        <Image src={job.image} alt="" fill sizes="420px" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(7,21,37,.1), rgba(7,21,37,.92))" }}
          aria-hidden="true"
        />
        {nganh && (
          <span className="absolute top-3 left-3 rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/80 px-3 py-1 text-[11.5px] font-semibold tracking-wide text-[var(--nb-gold-soft)]">
            {nganh.titleVi}
          </span>
        )}
        {job.isSample && (
          <span className="absolute top-3 right-3 rounded-full bg-[var(--nb-cyan)]/85 px-2.5 py-1 text-[10.5px] font-bold text-white">
            DỮ LIỆU MẪU
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-[19px] leading-snug font-semibold text-white">{job.title}</h3>

        <p className="nb-gold-text mt-2 text-[22px] font-bold">{chuoiLuong(job)}</p>

        <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[var(--nb-text-dim)]">
          <li className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </li>
          <li className="flex items-center gap-1.5">
            <Users size={14} className="text-[var(--nb-gold)]" />
            {job.vacancies} suất
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-[var(--nb-gold)]" />
            {job.employmentType}
          </li>
        </ul>

        <div className="mt-5 flex gap-2.5">
          <NavLink href={`/don-hang/${job.slug}`} className="nb-btn h-10 flex-1 px-4 text-[13.5px]">
            Xem chi tiết
            <ArrowRight size={15} />
          </NavLink>
          <NavLink href="/lien-he" className="nb-btn-ghost h-10 px-4 text-[13.5px]">
            Ứng tuyển
          </NavLink>
        </div>
      </div>
    </motion.article>
  );
}
