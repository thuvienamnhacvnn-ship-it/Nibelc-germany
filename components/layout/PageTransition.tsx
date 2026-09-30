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

// Sếp chốt: màn chuyển trang phải NHANH và phải thấy được trang phía sau.
// Tấm che để 60% đục, và cả chu kỳ rút từ ~1,3 giây xuống dưới 0,7 giây.
const DONG = 0.2; // giây, hai tấm chạy vào
const MO = 0.24; // giây, nội dung trang mới hiện ra
const DUC = 0.6; // độ đục của tấm che

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dangChe, setDangChe] = useState(false);
  // Đường dẫn lúc bắt đầu che. Chỉ mở tấm ra khi đường dẫn đã KHÁC cái này,
  // tức trang mới thật sự đã vào.
  const tuRef = useRef<string | null>(null);
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
      tuRef.current = pathname;
      setDangChe(true);
      // Đẩy route NGAY, không đợi tấm khép. Trước đây phải đợi hết hoạt ảnh
      // rồi mới push, nên thời gian tải trang nối tiếp sau thời gian hoạt
      // ảnh — cộng lại thành cái "delay khá nặng". Giờ hai việc chạy song
      // song: tấm đang khép thì Next đã tải trang rồi.
      router.push(href as Route);
    },
    [pathname, router]
  );

  // Route đã đổi thì mở tấm ra.
  //
  // Phải so với đường dẫn lúc bắt đầu che, KHÔNG được chỉ nhìn `dangChe`:
  // hiệu ứng này cũng chạy ngay lúc `dangChe` vừa bật (đường dẫn chưa đổi),
  // nên nếu hẹn giờ ngắn hơn thời gian tấm chạy vào thì tấm quay ngược ra khi
  // mới đi được một phần ba — đúng lỗi "hai tấm không chập vào nhau".
  useEffect(() => {
    if (!dangChe || pathname === tuRef.current) return;
    const t = setTimeout(() => setDangChe(false), 30);
    return () => clearTimeout(t);
  }, [pathname, dangChe]);

  // Trần thời gian che. Next không báo được lúc nào trang mới vẽ xong, nên
  // nếu cứ đợi `pathname` đổi thì gặp trang nặng là màn navy đứng im cả giây
  // — đúng chỗ Sếp thấy "delay khá nặng". Quá mức này thì mở tấm ra luôn;
  // trang mới chậm vài khung hình thì cũng chỉ thoáng thấy trang cũ.
  useEffect(() => {
    if (!dangChe) return;
    const t = setTimeout(() => setDangChe(false), DONG * 1000 + 260);
    return () => clearTimeout(t);
  }, [dangChe]);

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
              style={{ opacity: DUC, boxShadow: "8px 0 28px rgba(0,0,0,.45)" }}
            />
            {/* tấm phải */}
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-[var(--nb-navy-800)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: DONG, ease: [0.76, 0, 0.24, 1] }}
              style={{ opacity: DUC, boxShadow: "-8px 0 28px rgba(0,0,0,.45)" }}
            />
            {/* vạch sáng champagne ở đường nối */}
            <motion.span
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: DONG * 0.7 }}
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MO, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
