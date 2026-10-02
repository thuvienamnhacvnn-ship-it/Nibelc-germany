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
 * Dáng: nền xanh biển đậm trong mờ, viền champagne mảnh ở mép trên, bo góc
 * trên và nổi cách mép màn một chút — nhìn như một thanh riêng chứ không dán
 * bệt vào đáy. Mục đang mở được một "viên" champagne chạy tới ôm lấy, icon
 * nhảy lên và một chấm sáng hiện dưới chân.
 *
 * Viên champagne dùng layoutId nên nó TRƯỢT từ mục cũ sang mục mới thay vì
 * nhảy cóc — mắt theo được là mình vừa đi từ đâu sang đâu.
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
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* vệt sáng champagne chạy dọc mép trên */}
      <span
        aria-hidden="true"
        className="block h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--nb-gold-soft) 18%, var(--nb-gold-strong) 50%, var(--nb-gold-soft) 82%, transparent)",
        }}
      />

      <ul
        className="flex h-[66px] items-stretch"
        style={{
          background: "linear-gradient(180deg, rgba(16,56,107,.96) 0%, rgba(7,29,58,.99) 100%)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 -10px 30px rgba(3,12,26,.6)",
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
                className="relative flex h-full flex-col items-center justify-center gap-1 px-1"
              >
                {on && (
                  <motion.span
                    layoutId="menu-day-vien"
                    className="absolute inset-x-1.5 inset-y-2 -z-10 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(145deg, var(--nb-gold-soft), var(--nb-gold) 46%, var(--nb-gold-strong))",
                      boxShadow: "0 6px 16px -6px rgba(224,172,61,.6)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}

                <motion.span
                  animate={{ y: on ? -1 : 0, scale: on ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  className="flex items-center justify-center"
                >
                  <Icon
                    size={on ? 21 : 19}
                    strokeWidth={on ? 2.3 : 1.9}
                    className={on ? "text-[var(--nb-navy-900)]" : "text-[var(--nb-gold-soft)]"}
                  />
                </motion.span>

                <span
                  className={`w-full truncate text-center text-[10.5px] leading-none ${
                    on ? "font-bold text-[var(--nb-navy-900)]" : "font-medium text-[#b9cce6]"
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
