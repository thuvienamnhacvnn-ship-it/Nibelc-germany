"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { ReactNode, MouseEvent, CSSProperties } from "react";
import { useChuyenTrang } from "@/components/layout/PageTransition";
import { lh } from "@/lib/i18n/config";
import { useLang } from "@/lib/i18n/client";

/**
 * Link nội bộ chạy qua hiệu ứng chuyển trang của NIBELC.
 *
 * Vẫn là thẻ <a> thật với href thật nên chuột giữa, Ctrl+click và bộ máy tìm
 * kiếm đều hoạt động bình thường; chỉ cú click trái thường mới bị chặn để
 * chạy hoạt ảnh trước.
 *
 * ĐA NGÔN NGỮ: `href` là đường dẫn GỐC ("/lien-he"); thẻ <a> nhận href đã có
 * tiền tố của ngôn ngữ đang xem ("/en/lien-he"). Lỡ truyền link đã có tiền tố
 * cũng không sao — lh() không nhân đôi.
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
  /** cho phep ghi de style inline khi lop tien ich cua Tailwind khong thang
      duoc (vd .nb-btn dat white-space: nowrap o @layer components) */
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}) {
  const chuyenTrang = useChuyenTrang();
  const router = useRouter();
  const dich = lh(href, useLang());

  function bam(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    chuyenTrang(dich); // href ĐÃ có tiền tố ngôn ngữ
  }

  return (
    <Link
      href={dich as Route}
      className={className}
      onClick={bam}
      prefetch
      // Rê chuột là nạp trước: tới lúc bấm thì route đã sẵn trong bộ nhớ nên
      // tấm che không phải đứng đợi Next tải trang.
      onMouseEnter={() => router.prefetch(dich as Route)}
      onFocus={() => router.prefetch(dich as Route)}
      {...rest}
    >
      {children}
    </Link>
  );
}
