"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";
import { CO_NUOC, EUR, tenViTri, tongSuat, type DonHang } from "@/content/don-hang";

/**
 * CHI TIẾT MỘT ĐƠN HÀNG.
 *
 * Ảnh là ảnh thật của nơi làm việc, lấy từ kho `QUANG CAO`. Tờ đơn gốc đặt ở
 * cuối trang, tải về được. Mọi con số đọc thẳng từ dữ liệu đơn, không suy diễn.
 */

function Co({ nuoc, size = 22 }: { nuoc: string; size?: number }) {
  const mau = CO_NUOC[nuoc] ?? ["#888", "#aaa", "#888"];
  return (
    <span className="inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-black/10" style={{ width: size, height: size }} aria-hidden="true">
      {mau.map((c, i) => (
        <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
      ))}
    </span>
  );
}

export function DonHangChiTiet({ d, khac }: { d: DonHang; khac: DonHang[] }) {
  const [anhMo, setAnhMo] = useState(0);
  const [tab, setTab] = useState<"vitri" | "quyenloi" | "dieukien">("vitri");
  const suat = tongSuat(d);
  const tel = LEGAL.phone.replace(/\s/g, "");
  const anhChinh = d.anh[anhMo] ?? d.anh[0] ?? d.toDon[0];

  return (
    <>
      {/* ---------------- ĐẦU TRANG ---------------- */}
      <section className="bg-gradient-to-b from-[var(--v2-troi-nhat)] to-white">
        <div className="mx-auto max-w-[1480px] px-5 pt-8 pb-4 lg:px-8">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--v2-chu-nhat)]">
            <Link href={"/" as Route} className="hover:text-[var(--v2-xanh)]">Trang chủ</Link>
            <Icon name="chevronRight" className="h-3 w-3" strokeWidth={2.4} />
            <Link href={"/don-hang" as Route} className="hover:text-[var(--v2-xanh)]">Đơn hàng</Link>
            <Icon name="chevronRight" className="h-3 w-3" strokeWidth={2.4} />
            <span className="text-[var(--v2-xanh)]">{d.tieuDe}</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-[1480px] gap-8 px-5 pb-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8 lg:pb-16">
          {/* thư viện ảnh */}
          <div>
            <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--v2-nen)] ring-1 ring-[var(--v2-vien)]">
              {anhChinh && (
                <Image src={anhChinh} alt={d.tieuDe} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              )}
              <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-white/92 px-3.5 py-2 text-[13.5px] font-bold text-[var(--v2-xanh)] shadow">
                <Co nuoc={d.nuoc} size={18} />
                {d.nuoc}
              </span>
            </span>

            {d.anh.length > 1 && (
              <ul className="mt-3 flex gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {d.anh.map((a, i) => (
                  <li key={a}>
                    <button
                      type="button"
                      onClick={() => setAnhMo(i)}
                      aria-label={`Ảnh ${i + 1}`}
                      className={`relative block h-[68px] w-[92px] shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                        i === anhMo ? "ring-[var(--v2-vang)]" : "ring-transparent hover:ring-[var(--v2-vien)]"
                      }`}
                    >
                      <Image src={a} alt="" fill sizes="92px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* thông tin chính */}
          <div>
            <p className="flex items-center gap-3 text-[11.5px] font-bold tracking-[0.24em] text-[var(--v2-vang)] uppercase">
              <span className="h-[2px] w-9 bg-[var(--v2-vang)]" aria-hidden="true" />
              Mã đơn {d.ma}
            </p>
            <h1 className="mt-4 text-[28px] leading-[1.15] font-extrabold lg:text-[40px]">{d.tieuDe}</h1>

            {d.luong && (
              <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
                <b className="v2-vang text-[34px] leading-none font-extrabold lg:text-[42px]">
                  {EUR(d.luong.tu)} – {EUR(d.luong.den)} €
                </b>
                <span className="text-[15px] text-[var(--v2-chu-nhat)]">mỗi tháng</span>
              </p>
            )}

            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                suat !== null && { icon: "users", nhan: "Số suất", gt: `${suat} người` },
                d.noiLamViec && { icon: "pin", nhan: "Nơi làm việc", gt: d.noiLamViec },
                d.gioLam && { icon: "clock", nhan: "Thời gian làm việc", gt: `${d.gioLam} giờ/tuần` },
                { icon: "briefcase", nhan: "Số vị trí", gt: `${d.viTri.length} vị trí` },
              ]
                .filter(Boolean)
                .map((x) => {
                  const o = x as { icon: string; nhan: string; gt: string };
                  return (
                    <li key={o.nhan} className="flex items-center gap-3.5">
                      <span className="v2-icon-tron h-11 w-11 shrink-0">
                        <Icon name={o.icon} className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] text-[var(--v2-chu-nhat)]">{o.nhan}</span>
                        <b className="block text-[15.5px] font-bold text-[var(--v2-xanh)]">{o.gt}</b>
                      </span>
                    </li>
                  );
                })}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={"/ung-tuyen" as Route} className="v2-nut h-[52px] px-7 text-[15.5px]">
                Ứng tuyển ngay
                <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </Link>
              <a href={`tel:${tel}`} className="v2-nut-vien h-[52px] px-7 text-[15.5px]">
                <Icon name="phone" className="h-[18px] w-[18px]" strokeWidth={1.9} />
                {LEGAL.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TAB NỘI DUNG ---------------- */}
      <section className="mx-auto max-w-[1480px] px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--v2-vien)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              ["vitri", `Vị trí & thu nhập (${d.viTri.length})`],
              ["quyenloi", `Quyền lợi (${d.quyenLoi.length})`],
              ["dieukien", `Điều kiện (${d.dieuKien.length})`],
            ] as const
          ).map(([k, nhan]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`relative shrink-0 px-5 py-3.5 text-[14.5px] font-bold whitespace-nowrap transition ${
                tab === k ? "text-[var(--v2-xanh)]" : "text-[var(--v2-chu-nhat)] hover:text-[var(--v2-chu)]"
              }`}
            >
              {nhan}
              {tab === k && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-[var(--v2-vang)]" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className="pt-8">
          {tab === "vitri" && (
            <ul className="grid gap-4 lg:grid-cols-2">
              {d.viTri.map((v, i) => (
                <li key={v.ten + i} className="v2-the p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <b className="text-[17px] leading-snug font-bold text-[var(--v2-xanh)]">{tenViTri(v.ten)}</b>
                    {v.soNguoi !== null && (
                      <span className="shrink-0 rounded-full bg-[var(--v2-do)] px-3 py-1 text-[12.5px] font-bold text-white">
                        {v.soNguoi} suất
                      </span>
                    )}
                  </div>
                  {v.thuNhap && (
                    <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--v2-chu)]">
                      <span className="font-semibold text-[var(--v2-vang)]">Thu nhập: </span>
                      {v.thuNhap}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {tab === "quyenloi" && (
            <ul className="grid gap-3.5 lg:grid-cols-2">
              {d.quyenLoi.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-[1.7] text-[var(--v2-chu)]">
                  <Icon name="checkCircle" className="mt-[5px] h-[18px] w-[18px] shrink-0 text-[#16a34a]" strokeWidth={2} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "dieukien" && (
            <ul className="grid gap-3.5 lg:grid-cols-2">
              {d.dieuKien.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] leading-[1.7] text-[var(--v2-chu)]">
                  <Icon name="checkSquare" className="mt-[5px] h-[18px] w-[18px] shrink-0 text-[var(--v2-xanh-nhat)]" strokeWidth={2} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ảnh nơi làm việc */}
        {d.anh.length > 1 && (
          <div className="mt-14">
            <h2 className="text-[22px] font-extrabold lg:text-[28px]">Ảnh thật nơi làm việc</h2>
            <p className="mt-2 text-[14px] text-[var(--v2-chu-nhat)]">
              Ảnh do đối tác cung cấp — {d.soAnhGoc} ảnh trong hồ sơ đơn hàng.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {d.anh.map((a) => (
                <li key={a} className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-[var(--v2-vien)]">
                  <Image src={a} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* tờ đơn gốc */}
        {d.toDon.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[22px] font-extrabold lg:text-[28px]">Thông báo tuyển dụng gốc</h2>
            <p className="mt-2 text-[14px] text-[var(--v2-chu-nhat)]">Bấm vào ảnh để mở bản đầy đủ.</p>
            <ul className="mt-6 flex flex-wrap gap-4">
              {d.toDon.map((t, i) => (
                <li key={t}>
                  <a href={t} target="_blank" rel="noopener" className="v2-the v2-the-hover block overflow-hidden">
                    <Image src={t} alt={`Thông báo tuyển dụng ${i + 1}`} width={1400} height={2000} sizes="360px" className="h-auto w-[300px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="v2-the mt-12 p-5 text-[13.5px] leading-[1.75] text-[var(--v2-chu-nhat)]">
          Thông tin trên lấy từ thông báo tuyển dụng của đơn này và chỉ áp dụng cho đơn này, không phải bảng lương chung.
          Doanh nghiệp là bên quyết định nhận người; visa và công nhận bằng cấp do cơ quan có thẩm quyền quyết định.
          Phần chi phí, đặt cọc xin trao đổi trực tiếp qua số điện thoại ở trên.
        </p>
      </section>

      {/* ---------------- ĐƠN KHÁC ---------------- */}
      {khac.length > 0 && (
        <section className="border-t border-[var(--v2-vien)] bg-[var(--v2-nen)]">
          <div className="mx-auto max-w-[1480px] px-5 py-12 lg:px-8 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[22px] font-extrabold lg:text-[30px]">Đơn hàng khác</h2>
              <Link href={"/don-hang" as Route} className="v2-nut-vien h-11 px-6 text-[14.5px]">
                Tất cả đơn hàng
              </Link>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {khac.map((k) => (
                <li key={k.id}>
                  <Link href={`/don-hang/${k.id}` as Route} className="v2-the v2-the-hover block overflow-hidden">
                    <span className="relative block h-[160px] bg-white">
                      {(k.anh[0] ?? k.toDon[0]) && (
                        <Image src={k.anh[0] ?? k.toDon[0]!} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                      )}
                    </span>
                    <span className="block p-5">
                      <span className="flex items-center gap-2">
                        <Co nuoc={k.nuoc} size={15} />
                        <span className="text-[12.5px] text-[var(--v2-chu-nhat)]">{k.nuoc}</span>
                      </span>
                      <b className="mt-2 block text-[16px] leading-snug font-bold text-[var(--v2-xanh)]">{k.tieuDe}</b>
                      {k.luong && (
                        <b className="v2-vang mt-2 block text-[16px] font-extrabold">
                          {EUR(k.luong.tu)} – {EUR(k.luong.den)} €
                        </b>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
