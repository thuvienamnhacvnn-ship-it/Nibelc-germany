"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { IndustryEnvelope } from "@/components/home/IndustryEnvelope";
import type { ViTriTep } from "@/hooks/useHeroJobRotation";

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
  onChon: (id: string, tep: ViTriTep) => void;
  onHover: (v: boolean) => void;
}) {
  const boc = useRef<HTMLDivElement>(null);
  const [keo, setKeo] = useState(false);
  const keoRef = useRef({ dang: false, batDauX: 0, batDauScroll: 0, daDiChuyen: 0 });
  const treo = useRef(false);

  // Chỉ một lượt: Sếp muốn cụm phong bì gọn ở giữa chân banner, không trải
  // kín hai bên. Vẫn cuộn ngang được bên trong khung hẹp.
  const ds = INDUSTRIES;

  /** Danh sách chỉ còn một lượt nên không phải kéo về giữa nữa */
  const veGiua = useCallback(() => {}, []);



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

  const NGUONG_KEO = 6; // px, dưới mức này coi là bấm chứ không phải kéo

  function keoBatDau(e: React.PointerEvent) {
    const el = boc.current;
    if (!el) return;
    keoRef.current = { dang: true, batDauX: e.clientX, batDauScroll: el.scrollLeft, daDiChuyen: 0 };
    // KHÔNG gọi setPointerCapture ở đây: bắt pointer ngay lúc nhấn sẽ chuyển
    // hết sự kiện về div rail và nút phong bì bên trong không nhận được click.
  }

  function keoDiChuyen(e: React.PointerEvent) {
    const el = boc.current;
    const k = keoRef.current;
    if (!el || !k.dang) return;
    const dx = e.clientX - k.batDauX;
    k.daDiChuyen = Math.max(k.daDiChuyen, Math.abs(dx));
    if (k.daDiChuyen <= NGUONG_KEO) return; // vẫn còn là một cú bấm
    if (!keo) {
      setKeo(true);
      el.setPointerCapture(e.pointerId); // giờ mới thật sự là kéo
    }
    el.scrollLeft = k.batDauScroll - dx;
    veGiua();
  }

  function keoKetThuc(e: React.PointerEvent) {
    const el = boc.current;
    keoRef.current.dang = false;
    setKeo(false);
    if (el?.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
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
      {/* CHÂN BANNER — dải sáng cong hai góc, có các vệt ánh sáng uốn chạy
          ngang phía sau các tệp, đúng như ảnh mẫu. Bản trước chỉ là một dải
          mờ nên nhìn như không có gì. */}
      <div
        className="pointer-events-none absolute top-[6%] bottom-0 left-1/2 w-[1640px] max-w-[94vw] -translate-x-1/2 overflow-hidden rounded-t-[42px]"
        aria-hidden="true"
      >
        {/* nền dải */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,246,222,.62) 0%, rgba(243,201,108,.5) 22%, rgba(190,140,52,.34) 44%, rgba(14,34,62,.78) 74%, var(--nb-navy-900) 100%)",
          }}
        />
        {/* vệt sáng uốn — ba đường cong champagne chạy ngang */}
        <svg
          viewBox="0 0 1640 220"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-full w-full"
        >
          <defs>
            <linearGradient id="nb-vet" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,238,190,0)" />
              <stop offset="22%" stopColor="rgba(255,238,190,.95)" />
              <stop offset="50%" stopColor="rgba(255,214,120,1)" />
              <stop offset="78%" stopColor="rgba(255,238,190,.95)" />
              <stop offset="100%" stopColor="rgba(255,238,190,0)" />
            </linearGradient>
          </defs>
          <path d="M0 150 C 380 60, 1260 60, 1640 150" fill="none" stroke="url(#nb-vet)" strokeWidth="3" opacity="1" />
          <path d="M0 176 C 420 92, 1220 92, 1640 176" fill="none" stroke="url(#nb-vet)" strokeWidth="2" opacity=".8" />
          <path d="M0 126 C 340 44, 1300 44, 1640 126" fill="none" stroke="url(#nb-vet)" strokeWidth="1.6" opacity=".6" />
        </svg>
        {/* mép trên sáng champagne */}
        <span
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,243,210,.95) 18%, rgba(255,243,210,.95) 82%, transparent)" }}
        />
      </div>

      <div className="nb-gold-rule absolute bottom-[10px] left-1/2 w-[1080px] max-w-[92vw] -translate-x-1/2 opacity-60" aria-hidden="true" />

      <div
        ref={boc}
        onWheel={lan}
        onPointerDown={keoBatDau}
        onPointerMove={keoDiChuyen}
        onPointerUp={keoKetThuc}
        onPointerCancel={keoKetThuc}
        className={`nb-no-scrollbar relative mx-auto flex max-w-[1080px] items-end gap-2.5 overflow-x-auto overflow-y-visible px-4 pt-4 pb-3 ${
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
            onChon={(tep) => {
              // kéo rê thì không tính là bấm chọn
              if (keoRef.current.daDiChuyen > 6) return;
              // DOMRect -> ViTriTep: chỉ giữ 4 số thẻ đơn cần để biết bay ra từ đâu
              onChon(ind.id, { x: tep.left, y: tep.top, w: tep.width, h: tep.height });
            }}
          />
        ))}
      </div>

      {/* mờ hai mép để phong bì trôi ra ngoài không bị cắt cứng */}
      <div className="nb-rail-fade-l pointer-events-none absolute inset-y-0 left-1/2 w-16 -translate-x-[560px]" aria-hidden="true" />
      <div className="nb-rail-fade-r pointer-events-none absolute inset-y-0 left-1/2 w-16 translate-x-[480px]" aria-hidden="true" />

      {[
        { huong: -1 as const, Icon: ChevronLeft, lop: "left-[max(6px,calc(50%-568px))]", nhan: "Xem ngành phía trước" },
        { huong: 1 as const, Icon: ChevronRight, lop: "right-[max(6px,calc(50%-568px))]", nhan: "Xem ngành tiếp theo" },
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
