"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Cau = dynamic(() => import("./QuaCauDiem"), { ssr: false });
const Net = dynamic(() => import("./TruongDuongNet"), { ssr: false });

export function DoHoaCongNghe({ loai }: { loai: "cau" | "net" }) {
  const host = useRef<HTMLDivElement>(null);
  const [gan, setGan] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const quanSat = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setGan(true); quanSat.disconnect(); } }, { rootMargin: "120px" });
    quanSat.observe(el); return () => quanSat.disconnect();
  }, []);
  return <div ref={host} className={loai === "cau" ? "nb-do-hoa-cau" : "nb-do-hoa-net"} aria-hidden="true">{gan && (loai === "cau" ? <Cau /> : <Net />)}</div>;
}
