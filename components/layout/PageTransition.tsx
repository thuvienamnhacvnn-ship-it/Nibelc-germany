"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * CHUYỂN TRANG — CHỮ KÝ CỦA NIBELC
 *
 * Bấm menu không nhảy trang ngay. Hai tấm navy chạy từ mép trái và mép phải
 * vào giữa, gặp nhau thì hiện một vạch sáng champagne mảnh, rồi mở ngược ra
 * hai phía để lộ trang mới.
 *
 * Vì sao tự điều khiển điều hướng thay vì bọc AnimatePresence quanh children:
 * App Router thay children ngay khi route đổi, nên nếu chỉ bọc thì trang mới
 * đã hiện trước lúc tấm che đóng lại. Ở đây nút bấm gọi `chuyenTrang()`, tấm
 * đóng xong mới `router.push`, nên thứ tự luôn đúng kể cả khi route tải rất
 * nhanh.
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

const DONG = 0.42; // giây, hai tấm chạy vào
const MO = 0.5; // giây, hai tấm mở ra

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dangChe, setDangChe] = useState(false);
  const dichRef = useRef<string | null>(null);
  const giamChuyenDong = useRef(false);

  useEffect(() => {
    giamChuyenDong.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const chuyenTrang = useCallback(
    (href: string) => {
      // Bấm đúng trang đang mở: không điều hướng, nhưng phải báo cho trang
      // biết để nó tự đóng những lớp đang che nội dung chính (ví dụ banner
      // đơn hàng trên trang chủ). Không có chỗ này thì người dùng bấm
      // "Trang chủ" mà màn hình không đổi gì — tưởng web hỏng.
      if (href === pathname) {
        window.dispatchEvent(new CustomEvent("nibelc:ve-trang-hien-tai"));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (giamChuyenDong.current) {
        router.push(href as Route);
        return;
      }
      dichRef.current = href;
      setDangChe(true);
    },
    [pathname, router]
  );

  // Tấm đã khép kín thì mới đẩy route — trang mới dựng phía sau tấm che
  function khiDaKhep() {
    if (dichRef.current) {
      router.push(dichRef.current as Route);
      dichRef.current = null;
    }
  }

  // Route đã đổi thì mở tấm ra
  useEffect(() => {
    if (!dangChe) return;
    const t = setTimeout(() => setDangChe(false), 420);
    return () => clearTimeout(t);
  }, [pathname, dangChe]);

  return (
    <Ctx.Provider value={chuyenTrang}>
      {children}

      <AnimatePresence>
        {dangChe && (
          <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
            {/* tấm trái */}
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-[var(--nb-navy-800)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: DONG, ease: [0.76, 0, 0.24, 1] }}
              onAnimationComplete={khiDaKhep}
              style={{ boxShadow: "8px 0 40px rgba(0,0,0,.6)" }}
            />
            {/* tấm phải */}
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-[var(--nb-navy-800)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: DONG, ease: [0.76, 0, 0.24, 1] }}
              style={{ boxShadow: "-8px 0 40px rgba(0,0,0,.6)" }}
            />
            {/* vạch sáng champagne ở đường nối */}
            <motion.span
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: DONG * 0.72 }}
              style={{
                background:
                  "linear-gradient(180deg, transparent, var(--nb-gold-soft) 18%, var(--nb-gold-strong) 50%, var(--nb-gold-soft) 82%, transparent)",
                boxShadow: "0 0 18px 2px rgba(224,172,61,.55)",
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

/** Nội dung trang, mờ dần vào sau khi tấm che mở ra */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MO, ease: [0.22, 0.61, 0.36, 1], delay: 0.06 }}
    >
      {children}
    </motion.div>
  );
}
