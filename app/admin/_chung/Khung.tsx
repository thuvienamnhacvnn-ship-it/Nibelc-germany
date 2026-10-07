"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  ClipboardList,
  ExternalLink,
  History,
  Images,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelsTopLeft,
  X,
  type LucideIcon,
} from "lucide-react";
import { viecRa } from "../viec";
import { VungThongBao } from "./ThongBao";
import { VungXacNhan, useHoi } from "./HopXacNhan";
import { coChuaLuu, datChuaLuu } from "./chan-roi";
import { DUONG } from "./duong";

/**
 * KHUNG TRANG QUẢN TRỊ sau khi đăng nhập: thanh bên + vùng nội dung.
 *
 * Thanh bên thay cho thanh ngang cũ: chín mục không xếp vừa một hàng ngang,
 * và nhân viên cần thấy mình đang ở mục nào khi cuộn một form dài.
 * Điện thoại (< 900px): thanh bên thành ngăn kéo mở bằng nút menu.
 */

type Muc = { nhan: string; duong: Route; icon: LucideIcon };

const MUC: Muc[] = [
  { nhan: "Tổng quan", duong: DUONG.tongQuan, icon: LayoutDashboard },
  { nhan: "Đơn hàng", duong: DUONG.donHang, icon: ClipboardList },
  { nhan: "Bài viết", duong: DUONG.baiViet, icon: Newspaper },
  { nhan: "Thư viện ảnh", duong: DUONG.anh, icon: Images },
  { nhan: "Banner & nội dung", duong: DUONG.noiDung, icon: PanelsTopLeft },
  { nhan: "Nhật ký", duong: DUONG.nhatKy, icon: History },
];

/** Mục "Đơn hàng" sáng cho cả /admin/don-hang/*; riêng Tổng quan phải khớp đúng. */
const dangO = (duong: string, m: string) => (m === "/admin" ? duong === "/admin" : duong === m || duong.startsWith(m + "/"));

function tenTrang(duong: string): string {
  if (duong.startsWith("/admin/don-hang/")) return duong.endsWith("/moi") ? "Thêm đơn hàng" : "Sửa đơn hàng";
  if (duong.startsWith("/admin/bai-viet/")) return duong.endsWith("/moi") ? "Thêm bài viết" : "Sửa bài viết";
  if (duong === "/admin/mat-khau") return "Đổi mật khẩu";
  return MUC.find((m) => dangO(duong, m.duong))?.nhan ?? "Quản trị";
}

function ThanhBen({ duong, dong }: { duong: string; dong?: () => void }) {
  return (
    <aside className="qt-nav">
      <div className="qt-nav-dau">
        <div>
          <img src="/assets/brand/nibelc-logo-trang.svg" alt="NIBELC" />
          <span>Quản trị</span>
          <b className="qt-nav-n" aria-hidden>
            N
          </b>
        </div>
        {dong && (
          <button type="button" className="qt-nut-nav" aria-label="Đóng menu" onClick={dong}>
            <X aria-hidden />
          </button>
        )}
      </div>

      <nav className="qt-nav-muc" aria-label="Mục quản trị">
        {MUC.map((m) => (
          <Link
            key={m.duong}
            href={m.duong}
            title={m.nhan}
            aria-label={m.nhan}
            aria-current={dangO(duong, m.duong) ? "page" : undefined}
            onClick={dong}
          >
            <m.icon aria-hidden />
            <span className="qt-an-chu">{m.nhan}</span>
          </Link>
        ))}
      </nav>

      <div className="qt-nav-chan">
        <a href="/" target="_blank" rel="noreferrer" title="Xem web" aria-label="Xem web (mở tab mới)">
          <ExternalLink aria-hidden />
          <span className="qt-an-chu">Xem web</span>
        </a>
        <Link
          href={DUONG.matKhau}
          title="Đổi mật khẩu"
          aria-label="Đổi mật khẩu"
          aria-current={duong === "/admin/mat-khau" ? "page" : undefined}
          onClick={dong}
        >
          <KeyRound aria-hidden />
          <span className="qt-an-chu">Đổi mật khẩu</span>
        </Link>
        <form action={viecRa}>
          <button type="submit" title="Thoát" aria-label="Thoát">
            <LogOut aria-hidden />
            <span className="qt-an-chu">Thoát</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

function Trong({ children }: { children: React.ReactNode }) {
  const duong = usePathname() ?? "/admin";
  const router = useRouter();
  const hoi = useHoi();
  const nganKeo = useRef<HTMLDialogElement>(null);
  const nutMo = useRef<HTMLButtonElement>(null);

  /* Bấm một liên kết nội bộ khi form đang sửa dở → hỏi lại trước khi rời.
     Bắt ở pha CAPTURE trên document: `preventDefault` ở đây chạy trước
     onClick của <Link>, và Link tự bỏ qua khi sự kiện đã bị chặn. */
  useEffect(() => {
    function bat(e: MouseEvent) {
      if (!coChuaLuu() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.origin !== window.location.origin) return;
      if (a.pathname === window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      nganKeo.current?.close();
      const dich = a.pathname + a.search + a.hash;
      hoi({
        tieuDe: "Rời trang mà chưa lưu?",
        moTa: <p>Những thay đổi vừa nhập sẽ mất.</p>,
        nutHuy: "Ở lại",
        nutXacNhan: "Rời trang, bỏ thay đổi",
        onXacNhan: () => {
          datChuaLuu(false);
          router.push(DUONG.tu(dich));
        },
      });
    }
    document.addEventListener("click", bat, true);
    return () => document.removeEventListener("click", bat, true);
  }, [hoi, router]);

  // đổi trang xong thì ngăn kéo phải đóng (kể cả khi đi bằng nút Lùi)
  useEffect(() => {
    nganKeo.current?.close();
  }, [duong]);

  const dong = () => nganKeo.current?.close();

  return (
    <div className="qt-app">
      <ThanhBen duong={duong} />

      <div className="qt-chinh-vung">
        <div className="qt-dinh-dt">
          <button
            type="button"
            ref={nutMo}
            className="qt-nut-nav"
            aria-label="Mở menu"
            aria-haspopup="dialog"
            aria-expanded={false}
            onClick={(e) => {
              nganKeo.current?.showModal();
              e.currentTarget.setAttribute("aria-expanded", "true");
            }}
          >
            <Menu aria-hidden />
          </button>
          <strong>{tenTrang(duong)}</strong>
        </div>
        {children}
      </div>

      <dialog
        ref={nganKeo}
        className="qt-ngan-keo"
        aria-label="Menu quản trị"
        onClose={() => nutMo.current?.setAttribute("aria-expanded", "false")}
        onClick={(e) => {
          if (e.target === nganKeo.current) dong(); // bấm ra nền
        }}
      >
        <ThanhBen duong={duong} dong={dong} />
      </dialog>
    </div>
  );
}

export function Khung({ children }: { children: React.ReactNode }) {
  return (
    <VungThongBao>
      <VungXacNhan>
        <Trong>{children}</Trong>
      </VungXacNhan>
    </VungThongBao>
  );
}
