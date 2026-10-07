"use client";

import { useEffect, useState } from "react";

/**
 * LOGO NIBELC 3D ĐỘNG TRONG BANNER
 *
 * Sếp: "xuất webM trong suốt để đưa vào trang chủ, ở Banner trên Title cả 2
 * bản Mobile và desktop". Video là VP9 có kênh alpha, 6 giây, lặp liền mạch
 * (logo nghiêng trái-phải). Quyết định cũ của Sếp vẫn giữ nguyên: chữ trắng,
 * cánh cung đen-đỏ-vàng, KHÔNG nền, không bộ lọc, không bóng, không tấm lót —
 * nên thẻ video ở đây không có lấy một thuộc tính trang trí nào.
 *
 * ── LẦN VẼ ĐẦU LÀ ẢNH TĨNH, video chỉ thay vào khi ĐÃ PHÁT ĐƯỢC ───────────
 * Ảnh tĩnh `nibelc-logo-3d-still.png` cắt từ chính khung hình của video
 * (cùng 1200x380, logo cùng chỗ, cùng cỡ). Vì thế chọn nó làm bản tĩnh chứ
 * không dùng nibelc-logo-trang.svg: SVG khít sát mép hình và có tỉ lệ khác,
 * lúc video thay vào logo sẽ giật sang cỡ khác.
 * Hộp giữ tỉ lệ 1200/380 từ phía server nên đổi qua lại không xê dịch gì.
 *
 * Ảnh tĩnh ở lại luôn trong ba trường hợp:
 *   1. Safari và mọi trình duyệt trên iPhone/iPad (đều là WebKit): WebKit
 *      phát được WebM nhưng KHÔNG hiện kênh alpha, logo sẽ nằm trong một hộp
 *      đen. Nên với WebKit không gắn thẻ video — khỏi tải 1,6 MB vô ích.
 *   2. Người dùng bật "giảm chuyển động".
 *   3. Video lỗi hoặc bị chặn tự phát (chế độ tiết kiệm pin…): sự kiện
 *      `playing` không bao giờ tới, nên ảnh tĩnh cứ thế đứng đó.
 *
 * Hai bản video: chọn bằng matchMedia rồi mới gắn thẻ, nên máy nào cũng chỉ
 * tải đúng một bản — cùng cách với HeroVideo.
 *
 * Khung video rộng hơn hình: phần logo chiếm ~91% bề ngang, ~80% chiều cao,
 * nằm giữa. Muốn hình logo cao X thì hộp phải cao 1,25·X — nơi gọi đặt bề
 * NGANG của hộp qua `className`, chiều cao tự ra theo tỉ lệ.
 */
const TINH = "/assets/brand/nibelc-logo-3d-still.png";

export function LogoDong({ className = "" }: { className?: string }) {
  /** null = chưa biết khổ màn, hoặc máy này chỉ dùng ảnh tĩnh */
  const [nguon, setNguon] = useState<null | string>(null);
  const [daPhat, setDaPhat] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // WebKit = có AppleWebKit mà không phải họ Chromium. Chrome/Firefox trên
    // iPhone (CriOS, FxiOS) cũng là WebKit và rơi đúng vào nhánh này.
    const ua = navigator.userAgent;
    const webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Android/.test(ua);
    if (webkit) return;
    if (!document.createElement("video").canPlayType('video/webm; codecs="vp9"')) return;

    const mq = window.matchMedia("(max-width: 1023px)");
    const dat = () => {
      // đổi bản thì quay về ảnh tĩnh cho tới khi bản mới phát được
      setDaPhat(false);
      setNguon(`/assets/brand/nibelc-logo-3d-${mq.matches ? "mobile" : "desktop"}.webm`);
    };
    dat();
    mq.addEventListener("change", dat);
    return () => mq.removeEventListener("change", dat);
  }, []);

  return (
    <span data-logo-dong className={`relative block aspect-[1200/380] ${className}`}>
      {/* Trình đọc màn hình đọc dòng này; ảnh và video chỉ là hình. */}
      <span className="sr-only">NIBELC GERMANY</span>

      {/* Ảnh tĩnh và video KHÔNG bao giờ cùng hiện: video trong suốt, để cả
          hai thì mặt trước đứng yên lộ ra sau logo đang nghiêng. */}
      {!daPhat && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={TINH}
          alt=""
          aria-hidden="true"
          width={1200}
          height={380}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full"
        />
      )}

      {nguon && (
        <video
          key={nguon}
          src={nguon}
          poster={TINH}
          // Chưa phát được thì ẩn bằng opacity (không gỡ khỏi trang) để nó
          // vẫn tải và tự phát; `playing` tới mới đổi chỗ với ảnh tĩnh.
          className={`absolute inset-0 h-full w-full ${daPhat ? "" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setDaPhat(true)}
          onError={() => setDaPhat(false)}
        />
      )}
    </span>
  );
}
