"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Clock } from "lucide-react";
import { CHANG } from "@/data/journey";

/**
 * TIMELINE LỘ TRÌNH — có tương tác, không phải ảnh infographic chết.
 *
 * Chọn một chặng thì bảng chi tiết bên dưới đổi nội dung. Cột phải là bộ chọn
 * "Bạn đang ở bước nào?" — chọn ở đâu cũng đồng bộ với timeline.
 */
export function JourneyTimeline() {
  const [mo, setMo] = useState(0);
  const chang = CHANG[mo]!;

  return (
    <>
      {/* ---------- DẢI CHẶNG ---------- */}
      {/* Điện thoại: hàng cuộn ngang như cũ. Máy tính: lưới 9 cột vừa khung,
          trước đây hàng cuộn bị cắt mất chặng 7–9 ở mép phải. */}
      <ol className="nb-no-scrollbar flex gap-3 overflow-x-auto pb-3 lg:grid lg:grid-cols-9 lg:overflow-visible lg:pb-0">
        {CHANG.map((c, i) => {
          const on = i === mo;
          const daQua = i < mo;
          return (
            <li key={c.so} className="shrink-0 lg:min-w-0">
              <button
                type="button"
                onClick={() => setMo(i)}
                aria-pressed={on}
                className={`nb-card group block w-[188px] overflow-hidden p-0 text-left transition lg:flex lg:h-full lg:w-full lg:flex-col ${
                  on ? "border-[var(--nb-gold)]" : ""
                }`}
              >
                <span className="flex items-center gap-2.5 px-4 pt-4 lg:min-h-[96px] lg:flex-col lg:items-start lg:gap-2 lg:px-3 lg:pt-3 xl:min-h-[82px]">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12.5px] font-bold transition ${
                      on
                        ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                        : daQua
                          ? "bg-[var(--nb-navy-500)] text-[var(--nb-gold-soft)]"
                          : "border border-[var(--nb-line-soft)] text-[var(--nb-text-mute)]"
                    }`}
                  >
                    {daQua ? <Check size={14} /> : c.so}
                  </span>
                  <span
                    className={`text-[13.5px] leading-tight font-semibold lg:text-[13px] ${on ? "text-white" : "text-[var(--nb-text-dim)]"}`}
                  >
                    {c.ten}
                  </span>
                </span>

                <span className="relative mt-3 block h-[88px] overflow-hidden lg:mt-2">
                  <Image
                    src={c.anh}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 150px, 188px"
                    className={`object-cover transition duration-500 ${on ? "" : "grayscale-[35%] brightness-75"}`}
                  />
                </span>

                <span className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] text-[var(--nb-text-mute)] lg:mt-auto lg:items-start lg:px-3 lg:text-[11.5px] lg:leading-snug">
                  <Clock size={12} className="shrink-0 text-[var(--nb-gold)] lg:mt-[2px]" />
                  {c.thoiGian}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ---------- BẢNG CHI TIẾT ---------- */}
      {/* Dưới lg lưới này chỉ có MỘT cột, nhưng để `grid` trần thì cột tự nở
          theo min-content của thẻ con (đo được 292,7px) trong khi khung chỉ
          rộng 256px ở màn 320px — cả trang bị đẩy rộng ra 325px.
          Khai `grid-cols-[minmax(0,1fr)]` để cột không bao giờ vượt khung. */}
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={chang.so}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="nb-panel overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--nb-line-soft)] px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--nb-gold)] text-[16px] font-bold text-[var(--nb-navy-900)] sm:h-12 sm:w-12">
                  {chang.so}
                </span>
                <div className="min-w-0">
                  <h3 className="nb-display text-[19px] text-white sm:text-[22px] lg:text-[26px]">{chang.ten}</h3>
                  <p className="mt-0.5 text-[13.5px] text-[var(--nb-text-dim)]">{chang.mo}</p>
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-[var(--nb-line)] px-3.5 py-1.5 text-[12.5px] text-[var(--nb-gold-soft)]">
                <Clock size={13} />
                {chang.thoiGian}
              </span>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
              {[
                { ten: "Công việc cần làm", ds: chang.viec },
                { ten: "Giấy tờ cần chuẩn bị", ds: chang.giay },
                { ten: "NIBELC hỗ trợ", ds: chang.hoTro },
                { ten: "Kết quả của bước này", ds: chang.ketQua },
              ].map((k) => (
                <div key={k.ten}>
                  <b className="block text-[14px] font-semibold text-[var(--nb-gold-soft)]">{k.ten}</b>
                  <ul className="mt-3 space-y-2">
                    {k.ds.map((x) => (
                      <li key={x} className="flex gap-2.5 text-[13.5px] leading-[1.6] text-[var(--nb-text-dim)]">
                        <Check size={15} className="mt-[3px] shrink-0 text-[var(--nb-gold)]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ---------- BẠN ĐANG Ở BƯỚC NÀO ---------- */}
        <aside className="nb-panel h-fit p-5 lg:sticky lg:top-[calc(var(--nb-header)+20px)]">
          <b className="block text-[15.5px] font-semibold text-white">Bạn đang ở bước nào?</b>
          <ul className="mt-4 space-y-1">
            {CHANG.map((c, i) => (
              <li key={c.so}>
                <button
                  type="button"
                  onClick={() => setMo(i)}
                  aria-pressed={i === mo}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition lg:min-h-0 ${
                    i === mo
                      ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]"
                      : "text-[var(--nb-text-dim)] hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold lg:text-[11px] ${
                      i === mo
                        ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                        : "border border-[var(--nb-line-soft)] text-[var(--nb-text-mute)]"
                    }`}
                  >
                    {c.so}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{c.ten}</span>
                  {i === mo && <ChevronRight size={14} />}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
