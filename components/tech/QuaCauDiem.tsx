"use client";

import { useCallback, useRef } from "react";
import { useNetVe } from "./nhipDoHoa";

const RAD = Math.PI / 180;
type Diem = [number, number, number];
function toaDo(vi: number, kinh: number): Diem { return [Math.cos(vi * RAD) * Math.sin(kinh * RAD), Math.sin(vi * RAD), Math.cos(vi * RAD) * Math.cos(kinh * RAD)]; }
const diem: Diem[] = Array.from({ length: 1500 }, (_, i) => {
  const y = 1 - 2 * (i + .5) / 1500, goc = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.sqrt(1 - y * y) * Math.sin(goc), y, Math.sqrt(1 - y * y) * Math.cos(goc)];
});
const thanhPho: [Diem, Diem, Diem, Diem] = [toaDo(21.03, 105.85), toaDo(10.82, 106.63), toaDo(50.11, 8.68), toaDo(52.52, 13.40)];
// Nội suy cung tròn lớn giữa tọa độ thật, nâng cung khỏi mặt cầu.
function cung(a: Diem, b: Diem, t: number): Diem {
  const goc = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  const A = Math.sin((1 - t) * goc) / Math.sin(goc), B = Math.sin(t * goc) / Math.sin(goc);
  const cao = 1 + .13 * Math.sin(Math.PI * t);
  return [(A * a[0] + B * b[0]) * cao, (A * a[1] + B * b[1]) * cao, (A * a[2] + B * b[2]) * cao];
}

export default function QuaCauDiem() {
  const host = useRef<HTMLDivElement>(null);
  const nghieng = useRef({ x: 0, y: 0 });
  const ve = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, giay: number, mau: string, nhan: string) => {
    const r = Math.min(w, h) * .39, xoay = -57 * RAD + giay * Math.PI / 30 + nghieng.current.x;
    const nghiengY = -.12 + nghieng.current.y;
    function chieu([x, y, z]: Diem): Diem {
      const X = x * Math.cos(xoay) + z * Math.sin(xoay), Z = z * Math.cos(xoay) - x * Math.sin(xoay);
      return [w / 2 + r * X, h / 2 - r * (y * Math.cos(nghiengY) - Z * Math.sin(nghiengY)), y * Math.sin(nghiengY) + Z * Math.cos(nghiengY)];
    }
    ctx.strokeStyle = mau; ctx.lineWidth = 1; ctx.globalAlpha = .23;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2); ctx.stroke();
    for (const p of diem) {
      const [x, y, z] = chieu(p); ctx.globalAlpha = z < 0 ? .13 : .36 + z * .5;
      ctx.fillStyle = mau; ctx.beginPath(); ctx.arc(x, y, z < 0 ? .8 : 1.15, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = nhan; ctx.fillStyle = nhan;
    const tuyenBay: [Diem, Diem][] = [[thanhPho[0], thanhPho[2]], [thanhPho[1], thanhPho[3]]];
    for (const [a, b] of tuyenBay) {
      for (let i = 0; i < 80; i++) {
        const p = chieu(cung(a, b, i / 80)), q = chieu(cung(a, b, (i + 1) / 80));
        ctx.globalAlpha = p[2] < 0 ? .18 : .9; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }
    }
    // Một điểm chạy duy nhất, đi lần lượt qua hai tuyến trong 16 giây.
    const tuyen = Math.floor(giay / 8) % 2;
    const [dau, cuoi] = tuyenBay[tuyen]!;
    const p = chieu(cung(dau, cuoi, (giay % 8) / 8));
    ctx.globalAlpha = p[2] < 0 ? .2 : 1; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, Math.PI * 2); ctx.fill();
    thanhPho.forEach(tp => { const [x, y, z] = chieu(tp); ctx.globalAlpha = z < 0 ? .2 : 1; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.stroke(); });
    ctx.globalAlpha = 1;
  }, []);
  useNetVe(host, ve);
  return <div ref={host} className="nb-qua-cau" aria-hidden="true" onPointerMove={e => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    nghieng.current = { x: ((e.clientX - r.left) / r.width - .5) * .16, y: ((e.clientY - r.top) / r.height - .5) * .12 };
  }} onPointerLeave={() => { nghieng.current = { x: 0, y: 0 }; }} />;
}
