"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NỀN HERO
 *
 * Hai bản: ngang cho desktop, dọc cho điện thoại. Chọn bằng matchMedia rồi
 * mới gắn thẻ, nên máy nào cũng chỉ tải đúng một bản — không nạp cả hai như
 * cách dùng hai thẻ rồi ẩn bằng CSS.
 *
 * `DUNG_ANH` đổi qua lại giữa ẢNH TĨNH và VIDEO. Sếp đang thử ảnh tĩnh; đổi
 * về `false` là quay lại video ngay, không phải sửa gì thêm.
 *
 * Ảnh poster hiện ngay trong lúc video còn tải, và cũng là thứ duy nhất hiện
 * khi người dùng bật "giảm chuyển động": lúc đó không phát video nữa.
 */
const DUNG_ANH = true;

export function HeroVideo() {
  const [dien, setDien] = useState<null | boolean>(null);
  const [imLang, setImLang] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const dat = () => setDien(mq.matches);
    dat();
    mq.addEventListener("change", dat);

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setImLang(rm.matches);

    return () => mq.removeEventListener("change", dat);
  }, []);

  // Chưa biết khổ màn thì chưa tải gì cả, tránh tải nhầm bản nặng
  if (dien === null) return <div className="absolute inset-0 -z-20 bg-[var(--nb-navy-900)]" aria-hidden="true" />;

  const ten = dien ? "hero-mobile" : "hero-desktop";
  const poster = `/assets/home/video/${ten}-poster.jpg`;
  const anhTinh = dien ? "/assets/home/hero-anh-mobile.jpg" : "/assets/home/hero-anh.jpg";

  if (DUNG_ANH) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={anhTinh}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
    );
  }

  if (imLang) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
    );
  }

  return (
    <video
      ref={video}
      className="absolute inset-0 -z-20 h-full w-full object-cover"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={`/assets/home/video/${ten}.webm`} type="video/webm" />
      <source src={`/assets/home/video/${ten}.mp4`} type="video/mp4" />
    </video>
  );
}
