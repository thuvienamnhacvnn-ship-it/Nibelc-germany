"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Send, Users } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec } from "@/types/job";
import type { JobFull } from "@/data/jobs";
import type { ViTriTep } from "@/hooks/useHeroJobRotation";
import { industryById } from "@/data/industries";

/**
 * THẺ ĐƠN HÀNG TRÊN HERO
 *
 * Kích thước vừa phải, đứng đúng chỗ tiêu đề banner và ngay trên thanh tìm
 * kiếm. Video nền và hai nhóm nhân vật GIỮ NGUYÊN — chỉ phần tiêu đề nhường
 * chỗ cho thẻ này.
 *
 * Hiệu ứng: thẻ xuất phát từ đúng vị trí tệp vừa bấm, ở kích thước rất nhỏ và
 * lật úp (rotateY 180°), rồi vừa bay lên vừa xoay lại vừa to dần — nhìn ra là
 * tờ đơn được rút khỏi tệp, lật mặt lên và phóng to.
 *
 * Toạ độ xuất phát tính bằng tay chứ không dùng layoutId: layoutId đòi phải có
 * một phần tử thật nằm sẵn trong tệp, mà phần tử đó lại hiện ra trên miệng tệp
 * mỗi khi đóng thẻ, nhìn rất xấu.
 */
export function FeaturedJob({ job, oTep }: { job: JobFull; oTep: ViTriTep | null }) {
  const nganh = industryById(job.industryId);

  // Độ lệch từ tâm thẻ (giữa màn, ngang tầm tiêu đề) tới tâm tệp vừa bấm
  const lech =
    typeof window !== "undefined" && oTep
      ? {
          x: oTep.x + oTep.w / 2 - window.innerWidth / 2,
          y: oTep.y + oTep.h / 2 - window.innerHeight * 0.42,
        }
      : { x: 0, y: 320 };

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.12, rotateY: 180, x: lech.x, y: lech.y }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.12, rotateY: 180, x: lech.x, y: lech.y }}
      transition={{
        duration: 0.85,
        ease: [0.22, 0.68, 0.32, 1],
        rotateY: { duration: 0.7, ease: [0.34, 0.9, 0.3, 1] },
        opacity: { duration: 0.28 },
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      className="w-[min(560px,80vw)] overflow-hidden rounded-[18px] border border-[var(--nb-line)] bg-[var(--nb-navy-800)]/90 text-left backdrop-blur-md"
    >
      {/* KHUNG ẢNH 16:9 — đúng tỉ lệ ảnh quảng cáo. Tiêu đề lớn và mức lương
          nằm ĐÈ lên phần ba dưới của ảnh (chỗ ảnh được tạo tối hơn hẳn), nên
          thẻ đọc ra là một banner hoàn chỉnh mà chữ vẫn là chữ thật. */}
      <div className="relative aspect-video">
        <Image src={job.image} alt={job.title} fill priority sizes="560px" className="object-cover" />

        {nganh && (
          <span className="absolute top-3 left-3 rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/78 px-3 py-1 text-[11.5px] font-semibold text-[var(--nb-gold-soft)] backdrop-blur-sm">
            {nganh.titleVi}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-[var(--nb-gold)] px-2.5 py-1 text-[11px] font-bold text-[var(--nb-navy-900)]">
          ĐANG TUYỂN
        </span>

        {/* chỉ một dải chuyển tiếp ở đáy để chữ tách khỏi ảnh — không phủ màu
            lên toàn khung hình */}
        <span
          className="absolute inset-x-0 bottom-0 h-[72%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(5,11,22,.55) 34%, rgba(5,11,22,.88) 62%, rgba(5,11,22,.97) 100%)" }}
          aria-hidden="true"
        />

        <div className="nb-bong-chu absolute inset-x-0 bottom-0 px-5 pb-4">
          <h2 className="nb-display text-[clamp(19px,1.6vw,25px)] leading-[1.14] font-semibold text-white">
            {job.title}
          </h2>
          <p className="nb-display mt-1 text-[clamp(22px,1.9vw,30px)] leading-none font-semibold text-[var(--nb-gold-strong)]">
            {chuoiLuong(job)}
          </p>
        </div>
      </div>

      <div className="px-5 pt-3.5 pb-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-[#c3d1e2]">
          <li className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </li>
          <li className="flex items-center gap-1.5">
            <Users size={14} className="text-[var(--nb-gold)]" />
            {job.vacancies} suất
          </li>
          <li>Tiếng {job.languageLevel}</li>
        </ul>

        <div className="mt-3.5 flex gap-2.5">
          <NavLink href={`/don-hang/${job.slug}`} className="nb-btn h-11 flex-1 px-5 text-[14px]">
            Xem đơn hàng
            <ArrowRight size={15} />
          </NavLink>
          <NavLink href="/lien-he" className="nb-btn-ghost h-11 px-5 text-[14px]">
            <Send size={14} />
            Ứng tuyển
          </NavLink>
        </div>
      </div>
    </motion.article>
  );
}
