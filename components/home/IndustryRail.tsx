"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { IndustryEnvelope } from "@/components/home/IndustryEnvelope";

/**
 * DẢI PHONG BÌ NGÀNH NGHỀ
 *
 * Nằm sát chân hero, một phần tràn ra ngoài biên hero bằng translateY âm.
 * Nền là dải navy THẲNG + một đường vàng mảnh — không bệ cong, không bàn, không
 * sân khấu (luật ở prompt mục 10 và 35).
 *
 * Cuộn ngang: kéo chuột, trackpad, lăn chuột, nút mũi tên. Vòng lặp liền mạch
 * làm bằng cách nhân ba danh sách rồi nhảy về giữa mỗi khi chạm mép — nhìn là
 * vô tận mà không phải tính toán ảo hoá.
 */

const AUTO_PX = 0.28; // tốc độ tự trôi, pixel mỗi khung hình

export function IndustryRail({
  dangChon,
  onChon,
  onHover,
}: {
  dangChon: string | null;
  onChon: (id: string) => void;
  onHover: (v: boolean) => void;
}) {
  const boc = useRef<HTMLDivElement>(null);
  const [keo, setKeo] = useState(false);
  const keoRef = useRef({ dang: false, batDauX: 0, batDauScroll: 0, daDiChuyen: 0 });
  const treo = useRef(false);

  // ba lượt để cuộn vòng không thấy mép
  const ds = [...INDUSTRIES, ...INDUSTRIES, ...INDUSTRIES];

  /** Giữ thanh cuộn luôn ở lượt giữa */
  const veGiua = useCallback(() => {
    const el = boc.current;
    if (!el) return;
    const mot = el.scrollWidth / 3;
    if (el.scrollLeft < mot * 0.5) el.scrollLeft += mot;
    else if (el.scrollLeft > mot * 1.5) el.scrollLeft -= mot;
  }, []);

  useEffect(() => {
    const el = boc.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / 3;
  }, []);

  // tự trôi rất chậm khi không ai đụng vào
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const chay = () => {
      const el = boc.current;
      if (el && !treo.current && !keoRef.current.dang && !dangChon) {
        el.scrollLeft += AUTO_PX;
        veGiua();
      }
      id = requestAnimationFrame(chay);
    };
    id = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(id);
  }, [dangChon, veGiua]);

  /** Lăn chuột dọc cũng cuộn ngang được */
  function lan(e: React.WheelEvent) {
    const el = boc.current;
    if (!el) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    el.scrollLeft += d;
    veGiua();
  }

  function keoBatDau(e: React.PointerEvent) {
    const el = boc.current;
    if (!el) return;
    keoRef.current = { dang: true, batDauX: e.clientX, batDauScroll: el.scrollLeft, daDiChuyen: 0 };
    setKeo(true);
    el.setPointerCapture(e.pointerId);
  }

  function keoDiChuyen(e: React.PointerEvent) {
    const el = boc.current;
    const k = keoRef.current;
    if (!el || !k.dang) return;
    const dx = e.clientX - k.batDauX;
    k.daDiChuyen = Math.max(k.daDiChuyen, Math.abs(dx));
    el.scrollLeft = k.batDauScroll - dx;
    veGiua();
  }

  function keoKetThuc(e: React.PointerEvent) {
    const el = boc.current;
    keoRef.current.dang = false;
    setKeo(false);
    el?.releasePointerCapture?.(e.pointerId);
  }

  function nhay(huong: -1 | 1) {
    const el = boc.current;
    if (!el) return;
    el.scrollBy({ left: huong * 460, behavior: "smooth" });
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        treo.current = true;
        onHover(true);
      }}
      onMouseLeave={() => {
        treo.current = false;
        onHover(false);
      }}
    >
      {/* nền THẲNG: dải navy + một vạch vàng mảnh */}
      <div className="nb-rail-floor absolute inset-x-0 bottom-0 top-[28%]" aria-hidden="true" />
      <div className="nb-gold-rule absolute inset-x-0 bottom-[10px] opacity-60" aria-hidden="true" />

      <div
        ref={boc}
        onWheel={lan}
        onPointerDown={keoBatDau}
        onPointerMove={keoDiChuyen}
        onPointerUp={keoKetThuc}
        onPointerCancel={keoKetThuc}
        className={`nb-no-scrollbar relative flex items-end gap-3.5 overflow-x-auto overflow-y-visible px-14 pt-4 pb-3 ${
          keo ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="group"
        aria-label="Danh mục ngành nghề"
      >
        {ds.map((ind, i) => (
          <IndustryEnvelope
            key={`${ind.id}-${i}`}
            industry={ind}
            index={i}
            dangChon={dangChon === ind.id}
            moNhat={dangChon !== null && dangChon !== ind.id}
            onChon={() => {
              // kéo rê thì không tính là bấm chọn
              if (keoRef.current.daDiChuyen > 6) return;
              onChon(ind.id);
            }}
          />
        ))}
      </div>

      {/* mờ hai mép để phong bì trôi ra ngoài không bị cắt cứng */}
      <div className="nb-rail-fade-l pointer-events-none absolute inset-y-0 left-0 w-24" aria-hidden="true" />
      <div className="nb-rail-fade-r pointer-events-none absolute inset-y-0 right-0 w-24" aria-hidden="true" />

      {[
        { huong: -1 as const, Icon: ChevronLeft, lop: "left-2", nhan: "Xem ngành phía trước" },
        { huong: 1 as const, Icon: ChevronRight, lop: "right-2", nhan: "Xem ngành tiếp theo" },
      ].map(({ huong, Icon, lop, nhan }) => (
        <button
          key={huong}
          type="button"
          onClick={() => nhay(huong)}
          aria-label={nhan}
          className={`absolute ${lop} top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-800)]/85 text-[var(--nb-gold-soft)] backdrop-blur transition hover:bg-[var(--nb-navy-700)]`}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
