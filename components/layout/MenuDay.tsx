"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, GraduationCap, Home, Phone } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";

/**
 * MENU ĐÁY — CHỈ CÓ TRÊN ĐIỆN THOẠI
 *
 * Nền champagne đặc, chữ navy. Đây là thanh điều hướng chính của bản mobile,
 * thay cho menu ngang của desktop (màn hẹp không đủ chỗ cho bảy mục).
 *
 * Dùng NavLink chứ không phải <Link> thường, nên bấm mục nào cũng chạy đúng
 * hiệu ứng chập màn của NIBELC y như menu trên desktop.
 *
 * Năm mục là trần: quá số đó thì chữ bị bóp và ngón tay bấm nhầm.
 */

const MUC = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/don-hang", label: "Đơn hàng", Icon: Briefcase },
  { href: "/du-hoc-nghe", label: "Du học nghề", Icon: GraduationCap },
  { href: "/cam-nang", label: "Cẩm nang", Icon: BookOpen },
  { href: "/lien-he", label: "Liên hệ", Icon: Phone },
];

export function MenuDay() {
  const pathname = usePathname();
  const dangMo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Menu chính"
      data-menu-day
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{
        background: "linear-gradient(180deg, var(--nb-gold-soft) 0%, var(--nb-gold) 48%, var(--nb-gold-deep) 100%)",
        boxShadow: "0 -8px 28px rgba(0,0,0,.45)",
        // chừa chỗ cho vạch home của iPhone
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <ul className="flex h-[62px] items-stretch">
        {MUC.map(({ href, label, Icon }) => {
          const on = dangMo(href);
          return (
            <li key={href} className="relative min-w-0 flex-1">
              <NavLink
                href={href}
                aria-current={on ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-1 px-1 text-[var(--nb-navy-900)]"
              >
                {on && (
                  <motion.span
                    layoutId="menu-day-on"
                    className="absolute inset-x-2 inset-y-1.5 -z-10 rounded-xl bg-[var(--nb-navy-900)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon
                  size={19}
                  strokeWidth={on ? 2.2 : 1.9}
                  className={on ? "text-[var(--nb-gold)]" : "text-[var(--nb-navy-900)]"}
                />
                <span
                  className={`w-full truncate text-center text-[10.5px] leading-none font-semibold ${
                    on ? "text-[var(--nb-gold-soft)]" : "text-[var(--nb-navy-900)]"
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
