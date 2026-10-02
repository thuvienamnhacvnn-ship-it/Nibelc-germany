"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { ChonNgonNgu } from "@/components/layout/ChonNgonNgu";
import { MenuDayDu } from "@/components/layout/MenuDayDu";

/**
 * ĐỈNH BANNER — hai nút nổi ở hai góc trên của banner, CHỈ khổ điện thoại.
 *
 * Sếp chốt: ngôn ngữ ở góc TRÁI, ba chấm mở menu ở góc PHẢI.
 *
 * Đây KHÔNG phải header. Nó `absolute` trong banner nên trôi theo trang lúc
 * cuộn, đúng luật Sếp đặt: "bỏ nền và logo ở header khi lướt trang chủ".
 * Không có tấm nền chạy ngang, chỉ hai viên tròn — nền banner vẫn nhìn xuyên
 * qua. Mỗi viên 44px để ngón tay bấm trúng.
 *
 * Dùng chung cho cả trang chủ (Hero) lẫn trang phụ (PageHero), vì menu đáy
 * chỉ chứa được năm mục còn trang thì nhiều hơn thế.
 *
 * NGÔN NGỮ: dùng thẳng <ChonNgonNgu kieu="banner"> — bộ chọn THẬT, đổi tiền
 * tố URL (/, /en, /de) và giữ nguyên trang đang xem. Bản đầu của tệp này có
 * một khay tự chế liệt kê DE/EN kèm chữ "Sắp có" vì lúc đó site chưa có hệ
 * đa ngữ; nay đã có nên khay giả đó bỏ hẳn, không để hai bộ chọn song song
 * mà chỉ một bộ chạy thật.
 */
export function DinhBanner() {
  const [moMenu, setMoMenu] = useState(false);

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between px-3 pt-3 lg:hidden">
        {/* ---------- TRÁI: ngôn ngữ ---------- */}
        <ChonNgonNgu kieu="banner" className="pointer-events-auto" />

        {/* ---------- PHẢI: ba chấm mở menu ---------- */}
        <button
          type="button"
          onClick={() => setMoMenu(true)}
          aria-label="Menu"
          aria-expanded={moMenu}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--nb-gold)]/60 bg-[var(--nb-navy-900)]/55 text-white backdrop-blur-md transition active:scale-95"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <MenuDayDu mo={moMenu} dong={() => setMoMenu(false)} />
    </>
  );
}
