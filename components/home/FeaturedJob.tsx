"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, MapPin, Send, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec } from "@/types/job";
import type { JobFull } from "@/data/jobs";
import { industryById } from "@/data/industries";

/**
 * BANNER ĐƠN HÀNG TRÊN HERO
 *
 * Khi bấm một tệp ngành, video nền và hai nhóm nhân vật nhường chỗ cho banner
 * này: ảnh đơn hàng phủ kín khung, tiêu đề lớn, bốn thông tin chính và hai
 * nút hành động. Dải tệp ngành vẫn nằm nguyên dưới chân banner.
 *
 * `layoutId` trùng với thẻ hồ sơ nhỏ nằm trong tệp, nên Framer Motion nối hai
 * vị trí lại: nhìn ra là tờ đơn được RÚT RA khỏi tệp rồi mở rộng thành banner,
 * chứ không phải một khối mới hiện ra.
 */
export function FeaturedJob({ job }: { job: JobFull }) {
  const nganh = industryById(job.industryId);

  const TIN = [
    { Icon: MapPin, nhan: "Nơi làm việc", gt: noiLamViec(job) },
    { Icon: Users, nhan: "Số lượng", gt: `${job.vacancies} suất` },
    { Icon: GraduationCap, nhan: "Tiếng Đức", gt: job.languageLevel },
    { Icon: Briefcase, nhan: "Hình thức", gt: job.employmentType },
  ];

  return (
    <motion.article
      layoutId={`job-${job.industryId}`}
      transition={{ type: "spring", stiffness: 190, damping: 26, mass: 0.9 }}
      className="absolute inset-0 overflow-hidden"
    >
      {/* ---- ảnh đơn hàng phủ kín ---- */}
      <Image src={job.image} alt={job.title} fill priority sizes="100vw" className="object-cover object-center" />

      {/* Dải tối chỉ ở nửa trái, nơi đặt chữ — phần ảnh bên phải giữ nguyên */}
      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,11,22,.92) 0%, rgba(5,11,22,.72) 38%, rgba(5,11,22,.15) 68%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        className="nb-wrap relative flex h-full flex-col justify-center pb-[210px]"
      >
        <div className="max-w-[720px]">
          <span className="flex flex-wrap items-center gap-2.5">
            {nganh && (
              <span className="rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/70 px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--nb-gold-soft)]">
                {nganh.titleVi}
              </span>
            )}
            <span className="rounded-full bg-[var(--nb-gold)] px-3 py-1.5 text-[12px] font-bold text-[var(--nb-navy-900)]">
              ĐANG TUYỂN
            </span>
            {job.isSample && (
              <span className="rounded-full bg-[var(--nb-cyan)]/85 px-2.5 py-1.5 text-[11px] font-bold text-white">
                DỮ LIỆU MẪU
              </span>
            )}
          </span>

          <h2 className="nb-display nb-bong-chu mt-4 text-[clamp(30px,3.4vw,50px)] leading-[1.08] text-white">
            {job.title}
          </h2>

          <p className="nb-gold-text nb-display mt-3 text-[clamp(26px,2.6vw,40px)]">{chuoiLuong(job)}</p>

          <ul className="mt-7 flex flex-wrap gap-x-9 gap-y-4">
            {TIN.map(({ Icon, nhan, gt }) => (
              <li key={nhan} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/55 text-[var(--nb-gold)]">
                  <Icon size={17} />
                </span>
                <span>
                  <span className="block text-[11.5px] tracking-wide text-[#a8b8cc] uppercase">{nhan}</span>
                  <b className="mt-0.5 block text-[15px] font-semibold text-white">{gt}</b>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <NavLink href={`/don-hang/${job.slug}`} className="nb-btn h-[52px] px-8 text-[15.5px]">
              Xem đơn hàng
              <ArrowRight size={17} />
            </NavLink>
            <NavLink href="/lien-he" className="nb-btn-ghost h-[52px] px-8 text-[15.5px]">
              <Send size={16} />
              Ứng tuyển ngay
            </NavLink>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
