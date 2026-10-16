"use client";

import { useRef } from "react";
import { useNetVe } from "./nhipDoHoa";

// Nhiễu giá trị nội suy, xác định hoàn toàn để khung tĩnh không đổi ngẫu nhiên.
function nhieu(x: number, y: number) {
  const hash = (a: number, b: number) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  const a = Math.floor(x), b = Math.floor(y), u = x - a, v = y - b;
  const U = u * u * (3 - 2 * u), V = v * v * (3 - 2 * v);
  return (hash(a, b) * (1 - U) + hash(a + 1, b) * U) * (1 - V) + (hash(a, b + 1) * (1 - U) + hash(a + 1, b + 1) * U) * V;
}
function ve(ctx: CanvasRenderingContext2D, w: number, h: number, giay: number, mau: string) {
  ctx.strokeStyle = mau; ctx.globalAlpha = .15; ctx.lineWidth = 1;
  for (let i = -3; i <= 24; i++) {
    ctx.beginPath();
    for (let x = -8; x <= w + 8; x += 12) {
      const y = h * i / 22 + (nhieu(x / 260 + giay / 160, i / 7) - .5) * Math.min(h * .4, 180);
      if (x === -8) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
export default function TruongDuongNet() {
  const host = useRef<HTMLDivElement>(null); useNetVe(host, ve);
  return <div ref={host} className="nb-truong-net" aria-hidden="true" />;
}
