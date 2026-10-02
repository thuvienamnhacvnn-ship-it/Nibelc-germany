"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { IndustryEnvelope } from "@/components/home/IndustryEnvelope";
import type { ViTriTep } from "@/hooks/useHeroJobRotation";
import { useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";

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
  const tx = useT(home).rail;
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
      {/* CHÂN BANNER — chạy SUỐT chiều ngang màn hình, cạnh trên võng cong
          xuống giữa, nền xanh navy, trên đó là các dải vàng uốn lượn.
          Trước đây em dựng thành một hộp bo góc 1640px nằm giữa — sai hẳn
          so với mẫu. */}
      <div className="pointer-events-none absolute inset-x-0 -top-[4px] bottom-0 -z-10 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1920 112" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="nb-nen-xanh" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#123061" />
              <stop offset="34%" stopColor="#0c2247" />
              <stop offset="72%" stopColor="#081833" />
              <stop offset="100%" stopColor="var(--nb-navy-900)" />
            </linearGradient>
            <linearGradient id="nb-line-vang" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(224,172,61,0)" />
              <stop offset="14%" stopColor="rgba(255,228,156,.95)" />
              <stop offset="50%" stopColor="rgba(255,206,98,1)" />
              <stop offset="86%" stopColor="rgba(255,228,156,.95)" />
              <stop offset="100%" stopColor="rgba(224,172,61,0)" />
            </linearGradient>
          </defs>

          {/* nền xanh, cạnh trên võng cong xuống giữa */}
          <path d="M0 14 C 520 59, 1400 59, 1920 14 L1920 112 L0 112 Z" fill="url(#nb-nen-xanh)" />
          {/* viền vàng chạy theo đúng cạnh cong đó */}
          <path
            d="M0 14 C 520 59, 1400 59, 1920 14"
            fill="none"
            stroke="url(#nb-line-vang)"
            strokeWidth="3"
          />

          {/* các dải vàng uốn lượn bên trong nền xanh */}
          <path d="M0 56 C 470 5, 1450 5, 1920 56" fill="none" stroke="url(#nb-line-vang)" strokeWidth="2.6" opacity="1" />
          <path d="M0 72 C 430 21, 1490 21, 1920 72" fill="none" stroke="url(#nb-line-vang)" strokeWidth="2" opacity=".8" />
          <path d="M0 88 C 520 37, 1400 37, 1920 88" fill="none" stroke="url(#nb-line-vang)" strokeWidth="1.5" opacity=".6" />
          <path d="M0 104 C 460 53, 1460 53, 1920 104" fill="none" stroke="url(#nb-line-vang)" strokeWidth="1.2" opacity=".42" />
        </svg>
      </div>

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
        aria-label={tx.aria}
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

      {/* ĐÃ BỎ hai khối "mờ mép": nền của chúng là navy ĐẶC ở 8% đầu rồi mới
          mờ dần, nên hiện ra thành hai mảng chữ nhật tối có mép thẳng, đè lên
          ảnh nhân vật hai bên. Dải tệp nay chỉ một lượt 12 cái nằm gọn giữa
          màn, không còn gì trôi ra ngoài để phải che. */}

      {[
        { huong: -1 as const, Icon: ChevronLeft, lop: "left-[max(6px,calc(50%-568px))]", nhan: tx.truoc },
        { huong: 1 as const, Icon: ChevronRight, lop: "right-[max(6px,calc(50%-568px))]", nhan: tx.sau },
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
