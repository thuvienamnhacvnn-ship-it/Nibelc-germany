"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { lh, tachNgonNgu, type Lang } from "@/lib/i18n/config";
import { useLang } from "@/lib/i18n/client";

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
 *
 * ĐA NGÔN NGỮ: `href` truyền vào là đường dẫn GỐC ("/lien-he"); hàm tự thêm
 * tiền tố của ngôn ngữ đang xem (/en, /de). Đổi ngôn ngữ: chuyenTrang(duongDan,
 * { lang: "de" }) — cùng hiệu ứng, và trang chỉ mở màn khi khung (Header,
 * Footer, <html lang>) đã dựng lại bằng ngôn ngữ mới.
 */

type Ham = (href: string, tuyChon?: { lang?: Lang }) => void;

const Ctx = createContext<Ham | null>(null);

/** Dùng trong mọi link nội bộ muốn có hiệu ứng chuyển trang */
export function useChuyenTrang(): Ham {
  const f = useContext(Ctx);
  const router = useRouter();
  const lang = useLang();
  return f ?? ((href, tuyChon) => router.push(lh(href, tuyChon?.lang ?? lang) as Route));
}

// Đo trên bản build thật 02/10: nhịp cũ (0.42s, ease [.76,0,.24,1], giữ 2
// khung + 120ms) để màn navy đứng yên 0.3–0.6s giữa lúc kín và lúc mở → Sếp
// thấy "delay". Nay: nhịp mềm hơn, giữ tối thiểu, chỉ chờ ẢNH đang trong màn
// hình (tối đa CHO_ANH) để mở ra không lộ khung ảnh trống.
const DONG = 0.36; // giây, hai tấm chập vào tới khi kín
const GIU = 0.04; // giây, giữ kín sau khi trang mới đã vẽ xong
const MO = 0.4; // giây, hai tấm mở ra
const CHO_ANH = 300; // ms, chờ tối đa ảnh trong màn hình tải xong
const TRAN = 5000; // ms, trang mới chậm quá thì vẫn mở để không kẹt màn
const NHIP_DONG = [0.65, 0, 0.35, 1] as const;
const NHIP_MO = [0.33, 0, 0.2, 1] as const;

/** Đợi ảnh đang nằm trong khung nhìn tải xong (hoặc hết CHO_ANH ms). */
function choAnhTrongManHinh(): Promise<void> {
  const anh = [...document.images].filter((i) => {
    if (i.complete) return false;
    const r = i.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 0;
  });
  if (!anh.length) return Promise.resolve();
  return Promise.race([
    Promise.all(anh.map((i) => new Promise<void>((xong) => {
      i.addEventListener("load", () => xong(), { once: true });
      i.addEventListener("error", () => xong(), { once: true });
    }))).then(() => undefined),
    new Promise<void>((xong) => setTimeout(xong, CHO_ANH)),
  ]);
}

type Pha = "nghi" | "dong" | "cho" | "mo";

const duongDan = (href: string) => href.split(/[?#]/)[0] || "/";
/** đường dẫn gốc, bỏ cả ?query lẫn tiền tố ngôn ngữ */
const goc = (href: string) => tachNgonNgu(duongDan(href)).path;

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang();
  const [pha, setPha] = useState<Pha>("nghi");
  const dich = useRef<string | null>(null);
  const cungTrang = useRef(false);
  /** đích là ngôn ngữ khác (null = cùng ngôn ngữ) */
  const langDich = useRef<Lang | null>(null);
  const daLamMoi = useRef(false);
  const giamChuyenDong = useRef(false);

  useEffect(() => {
    giamChuyenDong.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const chuyenTrang = useCallback<Ham>(
    (href, tuyChon) => {
      // NavLink và nút ngôn ngữ truyền href ĐÃ có tiền tố (/en, /de; không
      // tiền tố = tiếng Việt) → ngôn ngữ đích đọc thẳng từ href.
      const ngonNguDich = tuyChon?.lang ?? tachNgonNgu(duongDan(href)).lang;
      const doiNgonNgu = ngonNguDich !== lang;
      const dayDu = lh(href, ngonNguDich);
      const gocHienTai = tachNgonNgu(pathname).path;
      // Bấm đúng trang đang mở: không điều hướng, chỉ báo trang tự đóng các
      // lớp đang che nội dung chính và cuộn về đầu.
      if (!doiNgonNgu && dayDu === lh(gocHienTai, lang)) {
        window.dispatchEvent(new CustomEvent("nibelc:ve-trang-hien-tai"));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (giamChuyenDong.current) {
        if (doiNgonNgu) window.location.assign(dayDu);
        else router.push(dayDu as Route);
        return;
      }
      if (pha !== "nghi") return; // đang chuyển dở — bỏ cú bấm thứ hai
      dich.current = dayDu;
      langDich.current = doiNgonNgu ? ngonNguDich : null;
      daLamMoi.current = false;
      cungTrang.current = !doiNgonNgu && goc(dayDu) === gocHienTai; // chỉ đổi ?query
      router.prefetch(dayDu as Route);
      setPha("dong");
    },
    [lang, pathname, pha, router]
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
  // Đổi ngôn ngữ: đợi tới khi khung đã nhận ngôn ngữ mới (useLang đổi).
  useEffect(() => {
    if (pha !== "cho" || !dich.current) return;
    let huy = false;
    const mo = () => {
      if (!huy) setPha("mo");
    };
    const tran = setTimeout(mo, TRAN);
    let t: ReturnType<typeof setTimeout> | undefined;
    const veXong = () =>
      requestAnimationFrame(() => {
        choAnhTrongManHinh().then(() => {
          if (!huy) t = setTimeout(mo, GIU * 1000);
        });
      });
    if (langDich.current) {
      if (lang === langDich.current) veXong();
      else if (goc(pathname) === goc(dich.current) && pathname === duongDan(dich.current) && !daLamMoi.current) {
        // URL đã đổi mà khung vẫn ngôn ngữ cũ (router giữ layout gốc vì
        // cây route y hệt) → dựng lại toàn bộ từ layout gốc.
        daLamMoi.current = true;
        router.refresh();
      }
    } else if (cungTrang.current) {
      t = setTimeout(mo, 300 + GIU * 1000);
    } else if (goc(pathname) === goc(dich.current)) {
      veXong();
    }
    return () => {
      huy = true;
      clearTimeout(tran);
      if (t) clearTimeout(t);
    };
  }, [pha, pathname, lang, router]);

  const daMo = useCallback(() => {
    if (pha !== "mo") return;
    dich.current = null;
    langDich.current = null;
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
            transition={{ duration: kin ? DONG : MO, ease: kin ? NHIP_DONG : NHIP_MO }}
            onAnimationComplete={() => (kin ? daKin() : daMo())}
          />
          {/* tấm phải */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[var(--nb-navy-800)]"
            initial={{ x: "100%" }}
            animate={{ x: kin ? 0 : "100%" }}
            transition={{ duration: kin ? DONG : MO, ease: kin ? NHIP_DONG : NHIP_MO }}
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

/**
 * Vỏ nội dung trang. KHÔNG còn mờ dần: trang mới đổi dưới màn che kín, tới
 * lúc màn mở thì nội dung phải đậm 100% ngay. Bản cũ mờ 0→1 trong 0.42s nên
 * lúc màn mở trang còn nhợt rồi mới đậm dần — trông như trễ (Sếp chê "chưa
 * mượt"). Giữ tên PageFade để layout không phải đổi.
 */
export function PageFade({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
