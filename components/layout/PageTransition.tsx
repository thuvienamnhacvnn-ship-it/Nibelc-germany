"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * CHUYỂN TRANG — CHỮ KÝ CỦA NIBELC
 *
 * Quy trình Sếp chốt 02/10/2026, BA NHỊP NỐI TIẾP, không chồng lên nhau:
 *   1. CHẬP VÀO — hai tấm navy chạy từ hai mép vào giữa, phủ KÍN 100% màn
 *      hình đang xem (đục hoàn toàn, không nhìn xuyên).
 *   2. ĐỔI TRANG — chỉ khi đã phủ kín mới router.push; đợi trang mới thật sự
 *      vẽ xong (pathname đổi + 2 khung hình) rồi giữ thêm một nhịp ngắn.
 *   3. MỞ RA — hai tấm rút ngược ra hai mép, lộ trang mới.
 *
 * Bản cũ push route NGAY khi bấm (để giảm trễ) và mở tấm theo giờ cố định,
 * nên trang mới lộ ra trước khi màn chập kín — trái quy trình trên.
 * Trễ tải được bù bằng prefetch (NavLink nạp trước khi rê chuột).
 *
 * Người dùng bật "giảm chuyển động" thì bỏ qua hoạt ảnh, điều hướng thẳng.
 */

type Ham = (href: string) => void;

const Ctx = createContext<Ham | null>(null);

/** Dùng trong mọi link nội bộ muốn có hiệu ứng chuyển trang */
export function useChuyenTrang(): Ham {
  const f = useContext(Ctx);
  const router = useRouter();
  return f ?? ((href: string) => router.push(href as Route));
}

const DONG = 0.42; // giây, hai tấm chập vào tới khi kín
const GIU = 0.12; // giây, giữ kín sau khi trang mới đã vẽ xong
const MO = 0.42; // giây, hai tấm mở ra
const TRAN = 5000; // ms, trang mới chậm quá thì vẫn mở để không kẹt màn
const NHIP = [0.76, 0, 0.24, 1] as const;

type Pha = "nghi" | "dong" | "cho" | "mo";

const duongDan = (href: string) => href.split(/[?#]/)[0] || "/";

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pha, setPha] = useState<Pha>("nghi");
  const dich = useRef<string | null>(null);
  const cungTrang = useRef(false);
  const giamChuyenDong = useRef(false);

  useEffect(() => {
    giamChuyenDong.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const chuyenTrang = useCallback(
    (href: string) => {
      // Bấm đúng trang đang mở: không điều hướng, chỉ báo trang tự đóng các
      // lớp đang che nội dung chính và cuộn về đầu.
      if (href === pathname) {
        window.dispatchEvent(new CustomEvent("nibelc:ve-trang-hien-tai"));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (giamChuyenDong.current) {
        router.push(href as Route);
        return;
      }
      if (pha !== "nghi") return; // đang chuyển dở — bỏ cú bấm thứ hai
      dich.current = href;
      cungTrang.current = duongDan(href) === pathname; // chỉ đổi ?query
      router.prefetch(href as Route);
      setPha("dong");
    },
    [pathname, pha, router]
  );

  // Nhịp 1 xong (tấm đã kín) → nhịp 2: đổi trang dưới màn che.
  const daKin = useCallback(() => {
    if (pha !== "dong" || !dich.current) return;
    setPha("cho");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    router.push(dich.current as Route);
  }, [pha, router]);

  // Nhịp 2 → 3: trang mới đã vẽ (pathname khớp đích + 2 khung hình) thì giữ
  // thêm GIU rồi mở. Đổi mỗi ?query thì pathname không đổi → đợi cố định.
  useEffect(() => {
    if (pha !== "cho" || !dich.current) return;
    let huy = false;
    const mo = () => {
      if (!huy) setPha("mo");
    };
    const tran = setTimeout(mo, TRAN);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (cungTrang.current) {
      t = setTimeout(mo, 300 + GIU * 1000);
    } else if (pathname === duongDan(dich.current)) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        t = setTimeout(mo, GIU * 1000);
      }));
    }
    return () => {
      huy = true;
      clearTimeout(tran);
      if (t) clearTimeout(t);
    };
  }, [pha, pathname]);

  const daMo = useCallback(() => {
    if (pha !== "mo") return;
    dich.current = null;
    setPha("nghi");
  }, [pha]);

  const kin = pha === "dong" || pha === "cho";

  return (
    <Ctx.Provider value={chuyenTrang}>
      {children}

      {pha !== "nghi" && (
        // Chặn bấm trong lúc chuyển để không có cú điều hướng chen ngang.
        <div className="fixed inset-0 z-[100]" aria-hidden="true">
          {/* tấm trái — đục 100% */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[var(--nb-navy-800)]"
            initial={{ x: "-100%" }}
            animate={{ x: kin ? 0 : "-100%" }}
            transition={{ duration: kin ? DONG : MO, ease: NHIP }}
            onAnimationComplete={() => (kin ? daKin() : daMo())}
          />
          {/* tấm phải */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[var(--nb-navy-800)]"
            initial={{ x: "100%" }}
            animate={{ x: kin ? 0 : "100%" }}
            transition={{ duration: kin ? DONG : MO, ease: NHIP }}
          />
          {/* vạch vàng mảnh ở đường nối — chỉ hiện khi đã kín, KHÔNG glow */}
          <motion.span
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--nb-gold)]"
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={pha === "cho" ? { opacity: 0.9, scaleY: 1 } : { opacity: 0, scaleY: 0.3 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Nội dung trang, mờ dần vào sau khi tấm che mở ra */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MO, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
