"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { noiLamViec } from "@/types/job";
import { luongHienThi } from "@/components/home/luong";
import { useLang, useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";
import type { JobFull } from "@/data/jobs";

/**
 * BĂNG ẢNH ĐƠN HÀNG CHẠY NGANG
 *
 * Thay cho dãy bốn con số trước đây ("20 đơn hàng · 469 suất tuyển · …") —
 * con số chỉ để ngắm, còn băng này cho thấy ĐƠN HÀNG THẬT và bấm được.
 *
 * Chạy bằng CSS animation chứ không phải JS: không tốn khung hình nào của
 * luồng chính, và tự dừng khi máy bật "giảm chuyển động".
 *
 * Mẹo chạy liền mạch: nhân đôi danh sách rồi cho dải trượt đúng -50% bề
 * ngang. Tới cuối bản sao thứ nhất thì khung hình trùng khít điểm đầu, nên
 * vòng lặp không thấy mối nối.
 *
 * Rê chuột hoặc chạm thì dừng, để người xem kịp đọc và bấm.
 */
export function BangChayDonHang({ ds }: { ds: JobFull[] }) {
  const lang = useLang();
  const tx = useT(home);
  if (ds.length === 0) return null;
  const doi = [...ds, ...ds];

  return (
    <section
      aria-label={tx.bang.aria}
      className="relative overflow-hidden border-y border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-5 lg:py-7"
    >
      {/* mờ hai mép để thẻ trôi vào và ra khỏi khung mềm mại */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 lg:w-20"
        style={{ background: "linear-gradient(90deg, var(--nb-navy-800), transparent)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 lg:w-20"
        style={{ background: "linear-gradient(270deg, var(--nb-navy-800), transparent)" }}
      />

      <ul className="nb-bang-chay flex w-max gap-3.5 lg:gap-5">
        {doi.map((j, i) => (
          <li key={`${j.id}-${i}`} className="w-[230px] shrink-0 lg:w-[290px]">
            <NavLink
              href={`/don-hang/${j.slug}`}
              className="nb-card group block overflow-hidden"
              aria-label={i < ds.length ? tx.bang.donTai(j.title, j.city) : undefined}
              aria-hidden={i >= ds.length ? "true" : undefined}
            >
              <span className="relative block aspect-video overflow-hidden">
                <Image
                  src={j.image}
                  alt=""
                  fill
                  sizes="290px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>

              {/* Tiêu đề nằm DƯỚI ảnh, không đè lên.
                  Trước đây tôi phủ một dải navy .94 lên 58% ảnh rồi đặt chữ
                  trắng lên trên — vi phạm hai luật của Sếp cùng lúc: phủ lớp
                  màu lên ảnh, và chữ đè lên mặt người (ảnh đơn hàng nào cũng
                  có người). Ảnh giờ để sạch hoàn toàn. */}
              <span className="block px-3 pt-2.5">
                <b className="nb-display line-clamp-1 block text-[14px] leading-tight font-semibold text-white">
                  {j.title}
                </b>
              </span>

              {/* Giá một dòng RIÊNG, nơi làm một dòng dưới.
                  Bản trước xếp hai thứ chung một hàng: nơi làm là shrink-0 nên
                  nó ăn trước, giá còn lại bao nhiêu thì co vào đó. Với
                  "Berlin và các vùng lân cận" thì giá chỉ còn 25px trên 140px
                  cần thiết — "1.700 – 2.900 €/tháng" hiện ra đúng "1.…".
                  Giá là thứ người ta mở trang để xem, không được phép cắt;
                  nơi làm cắt đuôi thì vẫn đoán ra. Tiếng Đức và tiếng Anh
                  chuỗi còn dài hơn tiếng Việt nên càng không được xếp chung. */}
              <span className="block px-3 pt-1.5 pb-2.5">
                <span className="nb-display block text-[14.5px] font-bold whitespace-nowrap text-[var(--nb-gold-strong)]">
                  {luongHienThi(j, lang, tx.the.thoaThuan)}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[12.5px] text-[#c2d3e8]">
                  <MapPin size={12} className="shrink-0 text-[var(--nb-gold)]" />
                  <span className="truncate">{noiLamViec(j).split(",")[0]}</span>
                </span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
