"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { lh, tachNgonNgu, type Lang } from "@/lib/i18n/config";
import { useLang } from "@/lib/i18n/client";

type Ham = (href: string, tuyChon?: { lang?: Lang }) => void;

const Ctx = createContext<Ham | null>(null);

/** Dùng trong mọi link nội bộ muốn có hiệu ứng chuyển trang */
export function useChuyenTrang(): Ham {
  const f = useContext(Ctx);
  const router = useRouter();
  const lang = useLang();
  return f ?? ((href, tuyChon) => router.push(lh(href, tuyChon?.lang ?? lang) as Route));
}

// Mẫu giữ kín 62% của 1,15s rồi quét hết sang phải; chờ route/ảnh trước khi mở.
const DONG = 0;
const GIU = 1.15 * 0.62;
const MO = 1.15 * 0.38;
const CHO_ANH = 300;
const TRAN = 5000;
const NHIP_DONG = [0.7, 0, 0.2, 1] as const;
const NHIP_MO = NHIP_DONG;

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
    const truyVan = window.matchMedia("(prefers-reduced-motion: reduce)");
    const doi = () => {
      giamChuyenDong.current = truyVan.matches;
      if (truyVan.matches && dich.current) {
        router.push(dich.current as Route);
        dich.current = null;
        setPha("nghi");
      }
    };
    truyVan.addEventListener("change", doi);
    return () => truyVan.removeEventListener("change", doi);
  }, [router]);

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
        window.scrollTo({ top: 0, behavior: giamChuyenDong.current ? "instant" : "smooth" });
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

  useEffect(() => {
    if (pha !== "dong") return;
    // Đợi màn che thật sự được vẽ dù không còn nhịp hai tấm chập vào.
    const khung = requestAnimationFrame(daKin);
    return () => cancelAnimationFrame(khung);
  }, [pha, daKin]);

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
        <div className="nb-chuyen-trang fixed inset-0 z-[100]" aria-hidden="true">
          <motion.div
            className="absolute inset-0 overflow-hidden bg-[var(--nb-navy-800)]"
            initial={{ clipPath: "inset(0 0 0 0)" }}
            animate={{ clipPath: kin ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
            transition={{ duration: kin ? DONG : MO, ease: kin ? NHIP_DONG : NHIP_MO }}
            onAnimationComplete={() => { if (!kin) daMo(); }}
          >
            <span className="nb-chuyen-luoi" />
            <span className="nb-chuyen-quet" />
            <span className="nb-chuyen-nhip"><b /></span>
          </motion.div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Trang chủ giữ nguyên hero đã duyệt; trang con dùng nhịp vào 300ms của mẫu. */
export function PageFade({ children }: { children: ReactNode }) {
  const duongDan = usePathname();
  if (tachNgonNgu(duongDan).path === "/") return <>{children}</>;
  return <div key={duongDan} className="nb-route-main">{children}</div>;
}
