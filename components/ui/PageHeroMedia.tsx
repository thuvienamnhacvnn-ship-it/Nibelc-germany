"use client";

import { useEffect, useRef, useState } from "react";

/** SSR luôn là ảnh. Chỉ gắn nguồn video sau mount và khi màn hình <1024px. */
export function PageHeroMedia({ anh, anhDoc, video, viTriAnh, latAnh }: {
  anh: string; anhDoc?: string; video?: string; viTriAnh?: string; latAnh?: boolean;
}) {
  const [mobile, datMobile] = useState(false);
  const [giam, datGiam] = useState(true);
  const [loi, datLoi] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const manHinh = matchMedia("(max-width: 1023px)");
    const chuyenDong = matchMedia("(prefers-reduced-motion: reduce)");
    const capNhat = () => { datMobile(manHinh.matches); datGiam(chuyenDong.matches); };
    capNhat();
    manHinh.addEventListener("change", capNhat);
    chuyenDong.addEventListener("change", capNhat);
    return () => { manHinh.removeEventListener("change", capNhat); chuyenDong.removeEventListener("change", capNhat); };
  }, []);
  useEffect(() => { datLoi(false); }, [video]);
  useEffect(() => {
    const el = player.current;
    if (!el || !host.current || giam || !mobile || !video || loi) return;
    el.pause();
    if (!window.IntersectionObserver) return;
    let thay = false;
    const capNhat = () => {
      if (thay && !document.hidden) void el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(entries => { thay = entries[0]?.isIntersecting ?? false; capNhat(); }, { threshold: .05 });
    io.observe(host.current);
    document.addEventListener("visibilitychange", capNhat);
    return () => { io.disconnect(); el.pause(); document.removeEventListener("visibilitychange", capNhat); };
  }, [mobile, giam, video, loi]);
  const coVideo = mobile && !!video;
  const base = `/assets/banners/video/${video}`;
  const classAnh = `absolute inset-0 h-full w-full object-cover object-center ${!coVideo && latAnh ? "-scale-x-100" : ""}`;
  return <div ref={host} className="absolute inset-0" aria-hidden="true">
    {coVideo && !giam && !loi ? <video ref={player} className={classAnh} muted loop playsInline autoPlay preload="metadata" poster={`${base}-poster.jpg`} onError={() => datLoi(true)}>
      <source src={`${base}.webm`} type="video/webm" />
      <source src={`${base}.mp4`} type="video/mp4" />
    </video> : <picture>
      {!coVideo && anhDoc && <source media="(max-width: 767px)" srcSet={anhDoc} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coVideo ? `${base}-poster.jpg` : anh} alt="" fetchPriority="high" className={classAnh}
        style={!coVideo && viTriAnh ? { objectPosition: viTriAnh } : undefined}
        onError={event => {
          const fallback = anhDoc || anh;
          if (coVideo && event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback;
        }} />
    </picture>}
  </div>;
}
