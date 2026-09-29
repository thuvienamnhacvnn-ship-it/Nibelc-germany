import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Các mảnh dùng chung của bộ KIT navy–vàng cho TRANG PHỤ.
 * Trang chủ không dùng file này.
 */

/** Nút vàng bo tròn — nút gọi hành động chính */
export function GoldBtn({
  href,
  children,
  icon = "arrowRight",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: string | null;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Link
      href={href as Route}
      className={`nb-sub-cta ${size === "lg" ? "h-[54px] px-8 text-[16px]" : "h-12 px-6 text-[15px]"} ${className}`}
    >
      {children}
      {icon && <Icon name={icon} className="h-[18px] w-[18px]" strokeWidth={2.2} />}
    </Link>
  );
}

/** Nút viền vàng, nền trong — hành động phụ */
export function GhostBtn({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href as Route} className={`nb-sub-ghost h-12 px-6 text-[15px] ${className}`}>
      {children}
    </Link>
  );
}

/** Tấm thông tin nền tối, viền vàng mảnh */
export function Panel({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "section" }) {
  return <Tag className={`nb-sub-panel ${className}`}>{children}</Tag>;
}

/** Nhãn nhỏ chữ vàng, có gạch ngang dẫn — mở đầu mỗi khối */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold tracking-[0.26em] text-[var(--nb-gold)] uppercase ${className}`}>
      <span className="h-px w-9 bg-[var(--nb-gold)]/70" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Tiêu đề khối, cỡ lớn kiểu báo chí */
export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-4 text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white lg:text-[40px] ${className}`}>
      {children}
    </h2>
  );
}

/** Ô icon vuông viền vàng */
export function IconBox({ name, size = 46 }: { name: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 text-[var(--nb-gold)]"
      style={{ width: size, height: size }}
    >
      <Icon name={name} style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={1.7} />
    </span>
  );
}

/** Đường dẫn breadcrumb trên đầu trang */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-white/55">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-2">
          {i > 0 && <Icon name="chevronRight" className="h-3 w-3 text-white/30" strokeWidth={2.4} />}
          {it.href ? (
            <Link href={it.href as Route} className="transition hover:text-[var(--nb-gold)]">
              {it.label}
            </Link>
          ) : (
            <span className="text-white/85">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Một dòng có dấu tích vàng */
export function Tick({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.6] text-white/80">
      <Icon name="check" className="mt-[5px] h-4 w-4 shrink-0 text-[var(--nb-gold)]" strokeWidth={2.6} />
      <span>{children}</span>
    </li>
  );
}

/** Ô số liệu: số vàng to, nhãn nhỏ */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block text-[30px] leading-none font-extrabold text-[var(--nb-gold)] lg:text-[38px]">{value}</b>
      <span className="mt-2 block text-[13px] text-white/60">{label}</span>
    </div>
  );
}
