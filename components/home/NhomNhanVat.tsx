"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * MỘT NHÓM NHÂN VẬT PNG + BỆ NỔI
 *
 * Ảnh PNG Sếp gửi bị cắt ngang ở ngang hông, nên nếu đặt trần lên nền video
 * sẽ thấy rõ đường cắt. Bệ nổi là một vệt sáng hình elip đặt ngay dưới mép
 * ảnh: nó vừa che đường cắt, vừa làm nhân vật trông như đang đứng trên một
 * mặt phẳng có ánh sáng hắt lên.
 *
 * Bệ gồm ba lớp, xếp từ dưới lên:
 *   1. bóng đổ tối, rộng nhất — tạo cảm giác có mặt sàn
 *   2. vành sáng champagne mảnh — mép bệ
 *   3. quầng sáng mờ ôm sát chân ảnh — xoá hẳn đường cắt
 */
export function NhomNhanVat({
  src,
  ben,
  rong,
  mo,
  dich,
  w,
  h,
}: {
  src: string;
  ben: "trai" | "phai";
  /** class Tailwind cho bề ngang */
  rong: string;
  /** độ mờ khi hero chuyển sang giới thiệu đơn hàng */
  mo: number;
  /** dịch ngang khi hero chuyển chế độ */
  dich: number;
  w: number;
  h: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: mo, x: dich }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      // Ẩn hẳn trên điện thoại: màn hẹp thì hai nhóm chồng vào giữa và chữ
      // hero đè lên mặt nhân vật — đúng thứ Sếp cấm. Bản dọc đã có video 9:16
      // với người thật rồi.
      className={`pointer-events-none absolute bottom-[58px] z-0 hidden lg:block ${
        ben === "trai" ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right"
      } ${rong}`}
    >
      {/* ---- BỆ NỔI ---- */}
      {/* lớp 1: bóng đổ rộng, đặt thấp nhất */}
      <span
        className="nb-be-noi bottom-[-26px] h-[62px] w-[128%]"
        style={{
          background: "radial-gradient(closest-side, rgba(5,11,22,.72), rgba(5,11,22,.28) 62%, transparent 100%)",
          filter: "blur(10px)",
        }}
      />
      {/* lớp 2: vành sáng champagne — mép bệ */}
      <span
        className="nb-be-noi bottom-[-8px] h-[26px] w-[104%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(240,220,180,.55), rgba(217,184,120,.3) 55%, transparent 100%)",
          filter: "blur(6px)",
        }}
      />
      {/* lớp 3: quầng sáng champagne ôm sát chân, cho cảm giác ánh sáng hắt lên */}
      <span
        className="nb-be-noi bottom-[-2px] h-[34px] w-[86%]"
        style={{
          background: "radial-gradient(closest-side, rgba(255,240,210,.5), rgba(217,184,120,.2) 60%, transparent 100%)",
          filter: "blur(7px)",
        }}
      />

      <span
        className="relative block"
        style={{
          // Mờ dần 18% cuối ảnh: chỗ PNG bị cắt ngang tan vào nền thay vì
          // để lại một đường thẳng.
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 82%, rgba(0,0,0,.45) 93%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 82%, rgba(0,0,0,.45) 93%, transparent 100%)",
        }}
      >
        <Image
          src={src}
          alt=""
          width={w}
          height={h}
          priority
          quality={92}
          sizes="610px"
          className="h-auto w-full drop-shadow-[0_30px_46px_rgba(0,0,0,.55)]"
        />
      </span>
    </motion.div>
  );
}
