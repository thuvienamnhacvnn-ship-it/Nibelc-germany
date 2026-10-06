"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { viecAnHien, viecXoaDonHang } from "./viec";

type Dong = {
  id: string;
  slug: string;
  nganh: string | null;
  nuoc: string | null;
  hien: boolean;
  sua_luc: string;
  du_lieu: { title?: string; city?: string; vacancies?: number };
  co_en: boolean;
  co_de: boolean;
};

export function BangDonHang({ don }: { don: Dong[] }) {
  const [tim, setTim] = useState("");
  const [dangChay, batDau] = useTransition();

  const loc = tim.trim().toLowerCase();
  const ds = loc
    ? don.filter((d) =>
        [d.du_lieu.title, d.du_lieu.city, d.nuoc, d.slug].some((x) => (x ?? "").toLowerCase().includes(loc)),
      )
    : don;

  /* Xoá là việc không lấy lại được bằng một cú bấm, nên hỏi lại. Bản cũ vẫn
     nằm trong nhật ký để khôi phục, nhưng đừng bắt người ta phải biết điều đó
     mới dám dùng trang. */
  function xoa(d: Dong) {
    const ten = d.du_lieu.title ?? d.slug;
    if (!window.confirm(`Xoá đơn "${ten}"?\n\nĐơn sẽ biến mất khỏi web ngay.\nVẫn khôi phục được ở mục Nhật ký.`)) return;
    batDau(() => void viecXoaDonHang(d.id));
  }

  return (
    <>
      <input
        type="search"
        value={tim}
        onChange={(e) => setTim(e.target.value)}
        placeholder="Tìm theo tên đơn, thành phố, nước…"
        aria-label="Tìm đơn hàng"
        style={{ marginBottom: 14 }}
      />

      <div className="qt-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Đơn hàng</th>
              <th>Nơi làm</th>
              <th>Suất</th>
              <th>Bản dịch</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ds.map((d) => (
              <tr key={d.id} style={{ opacity: d.hien ? 1 : 0.55 }}>
                <td style={{ minWidth: 240 }}>
                  <Link href={`/admin/don-hang/${d.id}`} style={{ fontWeight: 600, color: "var(--qt-xanh)" }}>
                    {d.du_lieu.title ?? d.slug}
                  </Link>
                  <div style={{ fontSize: 12, color: "var(--qt-mo)" }}>/{d.slug}</div>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {d.du_lieu.city}
                  {d.nuoc && d.nuoc !== d.du_lieu.city ? `, ${d.nuoc}` : ""}
                </td>
                <td>{d.du_lieu.vacancies ?? "—"}</td>
                <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                  <span className={`qt-nhan ${d.co_en ? "hien" : "an"}`}>EN</span>{" "}
                  <span className={`qt-nhan ${d.co_de ? "hien" : "an"}`}>DE</span>
                </td>
                <td>
                  <span className={`qt-nhan ${d.hien ? "hien" : "an"}`}>{d.hien ? "Đang hiện" : "Đã ẩn"}</span>
                </td>
                <td>
                  <div className="qt-hang-nut" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      disabled={dangChay}
                      onClick={() => batDau(() => void viecAnHien(d.id, !d.hien))}
                      style={{ minHeight: 34, padding: "0 11px", fontSize: 13 }}
                    >
                      {d.hien ? "Ẩn" : "Hiện"}
                    </button>
                    <button
                      type="button"
                      className="qt-nguy"
                      disabled={dangChay}
                      onClick={() => xoa(d)}
                      style={{ minHeight: 34, padding: "0 11px", fontSize: 13 }}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ds.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 28, textAlign: "center", color: "var(--qt-mo)" }}>
                  {loc ? `Không có đơn nào khớp "${tim}".` : "Chưa có đơn hàng nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
