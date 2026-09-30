"use client";

import { useRef } from "react";
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
 * Đứng đúng chỗ tiêu đề banner, ngay trên thanh tìm kiếm. Video nền và hai
 * nhóm nhân vật GIỮ NGUYÊN.
 *
 * Hai kiểu chuyển cảnh:
 *   - MỞ lần đầu từ một tệp: thẻ xuất phát từ đúng vị trí tệp vừa bấm, rất
 *     nhỏ và lật úp, rồi vừa bay lên vừa xoay lại vừa to dần.
 *   - ĐỔI sang đơn khác khi thẻ đang mở: chỉ LẬT tại chỗ. Bay về tệp rồi bay
 *     lên lại vừa chậm vừa rối mắt.
 *
 * Toạ độ xuất phát tính bằng tay chứ không dùng layoutId: layoutId đòi phải
 * có một phần tử thật nằm sẵn trong tệp, mà phần tử đó lại hiện ra trên miệng
 * tệp mỗi khi đóng thẻ, nhìn rất xấu.
 */
export function FeaturedJob({
  job,
  oTep,
  doiTiep,
}: {
  job: JobFull;
  oTep: ViTriTep | null;
  doiTiep: boolean;
}) {
  const nganh = industryById(job.industryId);

  // Giữ đúng cái tệp đã mở RA thẻ này. Khi bấm sang ngành khác, `oTep` ở hook
  // đã đổi sang tệp mới ngay; đọc thẳng thì thẻ cũ bay về tệp của đơn MỚI.
  const tepCuaToi = useRef<ViTriTep | null>(oTep);
  // Kiểu chuyển cảnh cũng chốt ở lần dựng đầu, không đổi giữa chừng.
  const lat = useRef(doiTiep);

  const t = tepCuaToi.current;
  const lech =
    typeof window !== "undefined" && t
      ? {
          x: t.x + t.w / 2 - window.innerWidth / 2,
          y: t.y + t.h / 2 - window.innerHeight * 0.42,
        }
      : { x: 0, y: 320 };

  // Lật tại chỗ: giữ nguyên vị trí và cỡ, chỉ xoay nửa vòng.
  const moc = lat.current
    ? { opacity: 0, scale: 0.94, rotateY: 180, x: 0, y: 0 }
    : { opacity: 0, scale: 0.12, rotateY: 180, x: lech.x, y: lech.y };

  return (
    <motion.article
      initial={moc}
      animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0, y: 0 }}
      exit={moc}
      transition={{
        duration: lat.current ? 0.42 : 0.85,
        ease: [0.22, 0.68, 0.32, 1],
        rotateY: { duration: lat.current ? 0.42 : 0.7, ease: [0.34, 0.9, 0.3, 1] },
        opacity: { duration: lat.current ? 0.18 : 0.28 },
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1400 }}
      className="w-[min(760px,88vw)] overflow-hidden rounded-[20px] border border-[var(--nb-gold)]/70 bg-[var(--nb-navy-900)] text-left shadow-[0_30px_80px_-14px_rgba(0,0,0,.9),0_0_0_1px_rgba(217,184,120,.22),0_0_44px_-12px_rgba(224,172,61,.5)]"
    >
      {/* ---------- KHUNG ẢNH 16:9 ---------- */}
      <div className="relative aspect-video">
        <Image src={job.image} alt={job.title} fill priority sizes="760px" className="object-cover" />

        {nganh && (
          <span className="absolute top-3.5 left-3.5 rounded-full border border-[var(--nb-gold)]/60 bg-[var(--nb-navy-900)]/80 px-3.5 py-1 text-[12px] font-semibold text-[var(--nb-gold-soft)] backdrop-blur-sm">
            {nganh.titleVi}
          </span>
        )}
        <span className="absolute top-3.5 right-3.5 rounded-full bg-[var(--nb-gold)] px-3 py-1 text-[11.5px] font-bold tracking-[0.06em] text-[var(--nb-navy-900)]">
          ĐANG TUYỂN
        </span>

        {/* dải chuyển tiếp ở đáy để tiêu đề tách khỏi ảnh — không phủ màu lên
            toàn khung hình */}
        <span
          className="absolute inset-x-0 bottom-0 h-[64%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(4,9,18,.6) 38%, rgba(4,9,18,.92) 72%, var(--nb-navy-900) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-4">
          <h2 className="nb-display text-[clamp(24px,2.2vw,34px)] leading-[1.06] font-bold tracking-[-0.015em] text-white [text-shadow:0_2px_10px_rgba(4,9,18,.9)]">
            {job.title}
          </h2>
        </div>
      </div>

      {/* ---------- DẢI THÔNG TIN ---------- */}
      {/* Mức lương KHÔNG dùng chữ đen trên nền vàng nữa: chữ đen nằm trong
          khối có bóng chữ nên nhận cả bốn lớp bóng tối, nhìn nhoè bệt. Giờ là
          chữ vàng đặc trên nền navy, viền vàng mảnh — tương phản cao mà nét. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--nb-gold)]/25 px-6 py-4">
        <span className="inline-flex items-baseline gap-2 rounded-xl border border-[var(--nb-gold)]/55 bg-[var(--nb-navy-800)] px-4 py-2">
          <span className="nb-display text-[clamp(22px,1.9vw,30px)] leading-none font-bold text-[var(--nb-gold-strong)]">
            {chuoiLuong(job)}
          </span>
        </span>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13.5px] text-[#c9d6e6]">
          <li className="flex items-center gap-1.5">
            <MapPin size={15} className="text-[var(--nb-gold)]" />
            {noiLamViec(job)}
          </li>
          <li className="flex items-center gap-1.5">
            <Users size={15} className="text-[var(--nb-gold)]" />
            {job.vacancies} suất
          </li>
          <li className="rounded-full border border-[var(--nb-line)] px-2.5 py-0.5 text-[12.5px]">
            Tiếng {job.languageLevel}
          </li>
        </ul>
      </div>

      <div className="flex gap-3 px-6 pb-5">
        <NavLink href={`/don-hang/${job.slug}`} className="nb-btn h-12 flex-1 px-6 text-[15px]">
          Xem đơn hàng
          <ArrowRight size={16} />
        </NavLink>
        <NavLink href="/lien-he" className="nb-btn-ghost h-12 px-6 text-[15px]">
          <Send size={15} />
          Ứng tuyển
        </NavLink>
      </div>
    </motion.article>
  );
}
