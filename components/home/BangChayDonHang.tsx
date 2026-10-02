"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec } from "@/types/job";
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
  if (ds.length === 0) return null;
  const doi = [...ds, ...ds];

  return (
    <section
      aria-label="Đơn hàng đang tuyển"
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
              aria-label={i < ds.length ? `${j.title} tại ${j.city}` : undefined}
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
                <span
                  className="absolute inset-x-0 bottom-0 h-[58%]"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(6,22,46,.94))" }}
                  aria-hidden="true"
                />
                <b className="nb-display absolute inset-x-0 bottom-0 px-3 pb-2 text-[14px] leading-tight font-semibold text-white">
                  <span className="line-clamp-1">{j.title}</span>
                </b>
              </span>

              <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="nb-display truncate text-[14.5px] font-bold text-[var(--nb-gold-strong)]">
                  {chuoiLuong(j)}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[11.5px] text-[#c2d3e8]">
                  <MapPin size={12} className="text-[var(--nb-gold)]" />
                  {noiLamViec(j).split(",")[0]}
                </span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
