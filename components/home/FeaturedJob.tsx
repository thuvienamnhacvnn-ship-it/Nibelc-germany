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
  huong,
}: {
  job: JobFull;
  oTep: ViTriTep | null;
  doiTiep: boolean;
  huong: 1 | -1;
}) {
  const nganh = industryById(job.industryId);

  // Giữ đúng cái tệp đã mở RA thẻ này. Khi bấm sang ngành khác, `oTep` ở hook
  // đã đổi sang tệp mới ngay; đọc thẳng thì thẻ cũ bay về tệp của đơn MỚI.
  const tepCuaToi = useRef<ViTriTep | null>(oTep);
  // Kiểu chuyển cảnh và hướng trượt cũng chốt ở lần dựng đầu, không đổi giữa
  // chừng.
  const lat = useRef(doiTiep);
  const ben = useRef(huong);

  const t = tepCuaToi.current;
  const lech =
    typeof window !== "undefined" && t
      ? {
          x: t.x + t.w / 2 - window.innerWidth / 2,
          y: t.y + t.h / 2 - window.innerHeight * 0.42,
        }
      : { x: 0, y: 320 };

  // ĐỔI ĐƠN: thẻ trượt ngang đúng phía tệp vừa bấm — bấm tệp bên phải thì đơn
  // mới lướt vào từ phải, đơn cũ lùi sang trái. Kèm nghiêng nhẹ và nhấc lên
  // một chút cho ra dáng rút tờ hồ sơ kế tiếp trong tập, không phải lật thẻ.
  const truot = (b: 1 | -1) => ({
    opacity: 0,
    scale: 0.965,
    rotateY: 0,
    rotate: 2.5 * b,
    x: 132 * b,
    y: -14,
  });
  const bayVeTep = { opacity: 0, scale: 0.12, rotateY: 180, rotate: 0, x: lech.x, y: lech.y };
  const moc = lat.current ? truot(ben.current) : bayVeTep;

  return (
    <motion.article
      initial={moc}
      animate={{ opacity: 1, scale: 1, rotateY: 0, rotate: 0, x: 0, y: 0 }}
      // Lúc THOÁT mới biết người xem bấm đóng hay bấm sang đơn khác, nên kiểu
      // thoát phải đọc từ `custom` của AnimatePresence chứ không chốt được ở
      // lần dựng như `initial`. Không có chỗ này thì thẻ đầu tiên vẫn lật và
      // bay về tệp dù Sếp đang đổi sang đơn kế bên.
      exit="ra"
      variants={{
        ra: (c: { doiTiep: boolean; huong: 1 | -1 } | undefined) =>
          c?.doiTiep ? truot((c.huong * -1) as 1 | -1) : bayVeTep,
      }}
      transition={{
        duration: lat.current ? 0.34 : 0.85,
        ease: lat.current ? [0.32, 0.9, 0.28, 1] : [0.22, 0.68, 0.32, 1],
        rotateY: { duration: lat.current ? 0 : 0.7, ease: [0.34, 0.9, 0.3, 1] },
        opacity: { duration: lat.current ? 0.16 : 0.28 },
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1400 }}
      className="w-[min(780px,92vw)] overflow-hidden rounded-[20px] border border-[var(--nb-gold)]/70 bg-[var(--nb-navy-900)] text-left shadow-[0_30px_80px_-14px_rgba(0,0,0,.9),0_0_0_1px_rgba(217,184,120,.22),0_0_44px_-12px_rgba(224,172,61,.5)]"
    >
      {/* Bố cục NẰM NGANG: ảnh bên trái, thông tin bên phải. Xếp dọc thì thẻ
          ra gần vuông (450×412), không còn dáng banner. */}
      <div className="flex items-stretch">
        <div className="relative aspect-video w-[46%] shrink-0 overflow-hidden">
          <Image src={job.image} alt={job.title} fill priority sizes="360px" className="object-cover" />
          {nganh && (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/80 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--nb-gold-soft)] backdrop-blur-sm">
              {nganh.titleVi}
            </span>
          )}
          <span
            className="absolute inset-y-0 right-0 w-[26%]"
            style={{ background: "linear-gradient(90deg, transparent, var(--nb-navy-900))" }}
            aria-hidden="true"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-4">
          <span className="self-start rounded-full bg-[var(--nb-gold)] px-2.5 py-0.5 text-[10.5px] font-bold tracking-[0.05em] text-[var(--nb-navy-900)]">
            ĐANG TUYỂN
          </span>

          <h2 className="nb-display mt-2 text-[clamp(17px,1.35vw,21px)] leading-[1.15] font-bold text-white">
            {job.title}
          </h2>

          <p className="mt-2">
            <span className="nb-display inline-block rounded-lg border border-[var(--nb-gold)]/55 bg-[var(--nb-navy-800)] px-3 py-1 text-[clamp(15px,1.15vw,19px)] leading-none font-bold text-[var(--nb-gold-strong)]">
              {chuoiLuong(job)}
            </span>
          </p>

          <ul className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-[#c9d6e6]">
            <li className="flex items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-[var(--nb-gold)]" />
              <span className="truncate">{noiLamViec(job)}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Users size={13} className="shrink-0 text-[var(--nb-gold)]" />
              {job.vacancies} suất
            </li>
            <li className="rounded-full border border-[var(--nb-line)] px-2 py-0.5 text-[11.5px]">
              Tiếng {job.languageLevel}
            </li>
          </ul>

          <div className="mt-3.5 flex gap-2">
            <NavLink href={`/don-hang/${job.slug}`} className="nb-btn h-10 flex-1 px-4 text-[13.5px]">
              Xem đơn hàng
              <ArrowRight size={14} />
            </NavLink>
            <NavLink href="/lien-he" className="nb-btn-ghost h-10 px-4 text-[13.5px]">
              <Send size={13} />
              Ứng tuyển
            </NavLink>
          </div>
        </div>
      </div>

    </motion.article>
  );
}
