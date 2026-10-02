"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, GraduationCap, Home, Phone } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { mucMenu } from "@/data/nav";
import { useDuongDan, useLang, useT } from "@/lib/i18n/client";
import { common } from "@/lib/i18n/dict/common";

/**
 * MENU ĐÁY — CHỈ CÓ TRÊN ĐIỆN THOẠI
 *
 * Đây là thanh điều hướng DUY NHẤT của bản điện thoại: trang phụ đã bỏ hẳn
 * header, nên mọi đường đi đều qua đây.
 *
 * Dáng: một thanh NỔI, bo 24px, cách hai mép 10px và cách đáy 8px — không dán
 * bệt vào cạnh dưới như tab bar mặc định của điện thoại. Nền xanh đặc một bậc
 * sáng hơn nền trang, viền champagne mảnh quanh thanh.
 *
 * Mục đang mở: một VẠCH champagne 3px ở mép trên ô, chữ và icon chuyển vàng.
 * KHÔNG dùng viên champagne đặc và KHÔNG đổ bóng vàng — bản trước có
 * `box-shadow: 0 6px 16px -6px rgba(224,172,61,.6)` là một quầng sáng, trái
 * luật "không glow" của Sếp.
 *
 * Vạch dùng layoutId nên nó TRƯỢT từ mục cũ sang mục mới thay vì nhảy cóc —
 * mắt theo được là mình vừa đi từ đâu sang đâu.
 *
 * Năm mục là trần: quá số đó thì chữ bị bóp và ngón tay bấm nhầm.
 */

// Nhãn lấy từ data/nav.ts (trường `ngan` — bản ngắn cho ô hẹp, đủ 3 ngôn ngữ).
const MUC = [
  { ...mucMenu("/"), Icon: Home },
  { ...mucMenu("/don-hang"), Icon: Briefcase },
  { ...mucMenu("/du-hoc-nghe"), Icon: GraduationCap },
  { ...mucMenu("/cam-nang"), Icon: BookOpen },
  { ...mucMenu("/lien-he"), Icon: Phone },
];

export function MenuDay() {
  const pathname = useDuongDan();
  const lang = useLang();
  const tx = useT(common);
  const dangMo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label={tx.menuChinh}
      data-menu-day
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{
        /* NỀN đặt ở ĐÂY chứ không ở <ul>, và phủ luôn vùng safe-area.
           Trước đây nav chỉ có padding-bottom bằng safe-area còn nền nằm ở
           <ul> bên trong, nên trên iPhone có vạch home (safe-area ~34px) cả
           dải đó trong suốt — nhìn ra là thanh menu BAY lên, hở nền trang
           bên dưới. Máy tính không có safe-area nên không lộ, phải mở trên
           điện thoại thật mới thấy. */
        background: "#1a4f93",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -10px 28px -8px rgba(3,12,26,.75)",
      }}
    >
      {/* vạch champagne mảnh ở mép trên, tách thanh khỏi nội dung */}
      <span
        aria-hidden="true"
        className="block h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--nb-gold-soft) 16%, var(--nb-gold-strong) 50%, var(--nb-gold-soft) 84%, transparent)",
        }}
      />
      <ul
        className="flex h-[62px] items-stretch"
        style={{
        }}
      >
        {MUC.map(({ href, ngan, Icon }) => {
          const label = ngan[lang];
          const on = dangMo(href);
          return (
            <li key={href} className="relative min-w-0 flex-1">
              <NavLink
                href={href}
                aria-current={on ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-1"
              >
                {on && (
                  <motion.span
                    layoutId="menu-day-vach"
                    aria-hidden="true"
                    className="absolute inset-x-3.5 top-0 h-[3px] rounded-b-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--nb-gold-soft), var(--nb-gold-strong) 50%, var(--nb-gold-soft))",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}

                <Icon
                  size={22}
                  strokeWidth={on ? 2.2 : 1.8}
                  className={on ? "text-[var(--nb-gold-strong)]" : "text-[#b9cce6]"}
                />

                {/* leading-[1.4] chứ KHÔNG leading-none: `truncate` kèm
                    overflow:hidden, ô dòng cao đúng 1em thì dấu tiếng Việt
                    ("ề" của "Du học nghề") bị xén mất. */}
                <span
                  className={`w-full truncate text-center text-[12px] leading-[1.4] tracking-[-0.01em] ${
                    on ? "font-bold text-[var(--nb-gold-strong)]" : "font-medium text-[#b9cce6]"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
