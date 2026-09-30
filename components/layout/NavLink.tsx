"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode, MouseEvent } from "react";
import { useChuyenTrang } from "@/components/layout/PageTransition";

/**
 * Link nội bộ chạy qua hiệu ứng chuyển trang của NIBELC.
 *
 * Vẫn là thẻ <a> thật với href thật nên chuột giữa, Ctrl+click và bộ máy tìm
 * kiếm đều hoạt động bình thường; chỉ cú click trái thường mới bị chặn để
 * chạy hoạt ảnh trước.
 */
export function NavLink({
  href,
  className,
  children,
  onClick,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}) {
  const chuyenTrang = useChuyenTrang();

  function bam(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    chuyenTrang(href);
  }

  return (
    <Link href={href as Route} className={className} onClick={bam} {...rest}>
      {children}
    </Link>
  );
}
