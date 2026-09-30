"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { Industry } from "@/types/industry";

/**
 * MỘT PHONG BÌ NGÀNH NGHỀ
 *
 * Tám ngành đầu dùng đúng ảnh phong bì Sếp gửi (đã tách từ sprite). Bốn ngành
 * chưa có ảnh thì dựng phong bì bằng CSS theo ĐÚNG dáng của tám cái kia —
 * nắp cong, thân vàng kem hoặc navy, viền champagne — chứ không đổi sang kiểu
 * khác.
 *
 * Rê chuột: nâng 8–12px, viền vàng sáng hơn, mấy tờ hồ sơ bên trong nhô lên.
 * Không phóng to nhiều.
 */

export function IndustryEnvelope({
  industry,
  dangChon,
  moNhat,
  onChon,
  index,
}: {
  industry: Industry;
  dangChon: boolean;
  moNhat: boolean;
  onChon: () => void;
  index: number;
}) {
  const Icon = (Icons[industry.icon as keyof typeof Icons] ?? Icons.Briefcase) as Icons.LucideIcon;
  const navyChan = index % 2 === 0; // xen kẽ navy / kem đúng như dải Sếp gửi

  return (
    <motion.button
      type="button"
      onClick={onChon}
      aria-pressed={dangChon}
      aria-label={`Ngành ${industry.titleVi}`}
      className="group relative block w-[96px] shrink-0 cursor-pointer text-left focus-visible:outline-none 2xl:w-[104px]"
      animate={{
        opacity: moNhat ? 0.62 : 1,
        y: dangChon ? -14 : 0,
      }}
      whileHover={{ y: dangChon ? -14 : -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      {/* quầng vàng khi được chọn */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[28px]"
        animate={{ opacity: dangChon ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "radial-gradient(60% 50% at 50% 65%, rgba(224,172,61,.32), transparent 72%)",
        }}
      />

      {industry.envelope ? (
        <span className="relative block">
          <Image
            src={industry.envelope}
            alt=""
            width={260}
            height={286}
            sizes="212px"
            className="h-auto w-full drop-shadow-[0_18px_28px_rgba(0,0,0,.55)] transition-[filter] duration-300 group-hover:drop-shadow-[0_24px_34px_rgba(0,0,0,.7)]"
          />
          {/* viền champagne sáng lên khi rê hoặc khi được chọn */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[6%] bottom-[6%] h-[62%] rounded-[14px] ring-1 ring-[var(--nb-gold)]"
            animate={{ opacity: dangChon ? 0.95 : 0 }}
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.25 }}
          />
        </span>
      ) : (
        <PhongBiCss ten={industry.titleVi} anh={industry.cover} Icon={Icon} navy={navyChan} dangChon={dangChon} />
      )}

      <span className="sr-only">{industry.titleDe}</span>
    </motion.button>
  );
}

/**
 * Phong bì dựng bằng CSS cho ngành chưa có ảnh riêng.
 *
 * Xếp lớp đúng thứ tự của phong bì thật: mấy tờ hồ sơ nằm SAU thân, chỉ nhô
 * phần trên ra khỏi miệng. Lần trước để giấy đè lên thân nên cái phong bì
 * nhìn thành một mảng trắng, lạc hẳn khỏi tám cái dùng ảnh.
 *
 * Tỉ lệ 255×284 lấy đúng theo ảnh Sếp gửi để cả dải nhìn đồng nhất.
 */
function PhongBiCss({
  ten,
  anh,
  Icon,
  navy,
  dangChon,
}: {
  ten: string;
  anh: string | null;
  Icon: Icons.LucideIcon;
  navy: boolean;
  dangChon: boolean;
}) {
  return (
    <span className="relative block" style={{ aspectRatio: "255 / 284" }}>
      {/* ---- lớp 1: hồ sơ bên trong, nhô lên khỏi miệng phong bì ---- */}
      <span className="absolute inset-x-[14%] top-0 z-0 h-[46%]" aria-hidden="true">
        {[-8, -1, 6].map((xoay, i) => (
          <span
            key={xoay}
            className="absolute inset-0 overflow-hidden rounded-[5px] border border-black/15 bg-white shadow-[0_3px_8px_rgba(0,0,0,.35)] transition-transform duration-300 group-hover:-translate-y-[6px]"
            style={{
              transform: `rotate(${xoay}deg) translateX(${i * 6 - 6}px)`,
              zIndex: i,
              transitionDelay: `${i * 45}ms`,
            }}
          >
            {i === 2 && anh && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={anh} alt="" className="h-full w-full object-cover opacity-95" />
            )}
          </span>
        ))}
      </span>

      {/* ---- lớp 2: thân phong bì, nằm TRÊN hồ sơ ---- */}
      <span
        className="absolute inset-x-0 bottom-0 z-10 h-[72%] overflow-hidden rounded-[13px] shadow-[0_18px_28px_rgba(0,0,0,.55)]"
        style={{
          background: navy
            ? "linear-gradient(168deg, #24508f 0%, #12305c 52%, #08182c 100%)"
            : "linear-gradient(168deg, #fdf7e8 0%, #f2e4c4 52%, #dfcba0 100%)",
          border: `1px solid ${dangChon ? "var(--nb-gold)" : "rgba(217,184,120,.5)"}`,
        }}
      >
        {/* Nắp phong bì hình chữ V — đúng dáng tám phong bì ảnh Sếp gửi.
            Dùng clip-path chứ không bo tròn, vì bo tròn cho ra nắp vòm và
            nhìn lạc hẳn khỏi cả dải. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[54%]"
          style={{
            background: navy
              ? "linear-gradient(180deg, #2c5ea6 0%, #1b3f72 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f0e2c0 100%)",
            clipPath: "polygon(0 0, 100% 0, 100% 34%, 50% 100%, 0 34%)",
            filter: "drop-shadow(0 3px 4px rgba(0,0,0,.28))",
          }}
        />
        {/* viền vàng chạy theo mép nắp */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[54%]"
          style={{
            background: "linear-gradient(180deg, transparent 30%, var(--nb-gold) 33%, transparent 36%)",
            clipPath: "polygon(0 0, 100% 0, 100% 34%, 50% 100%, 0 34%)",
            opacity: 0.55,
          }}
        />
        {/* dải cờ Đức nhỏ ở góc phải, mô-típ có trên cả tám phong bì ảnh */}
        <span className="absolute top-[10%] right-[7%] z-10 flex h-[8px] w-[28px] overflow-hidden rounded-[2px] shadow-sm" aria-hidden="true">
          <span className="h-full flex-1 bg-[#111]" />
          <span className="h-full flex-1 bg-[#d00]" />
          <span className="h-full flex-1 bg-[#fc0]" />
        </span>

        <span className="absolute inset-x-0 bottom-[11%] flex flex-col items-center gap-1.5 px-2.5">
          <Icon size={22} className={navy ? "text-[var(--nb-gold)]" : "text-[var(--nb-gold-deep)]"} strokeWidth={1.9} />
          <span
            className={`text-center text-[12.5px] leading-tight font-semibold ${navy ? "text-white" : "text-[#3a2c10]"}`}
          >
            {ten}
          </span>
        </span>
      </span>
    </span>
  );
}
