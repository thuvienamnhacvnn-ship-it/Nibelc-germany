"use client";

import { MotionGlobalConfig } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDuongDan, useT } from "@/lib/i18n/client";
import { giaoDien } from "@/lib/i18n/dict/giao-dien";
import { congNghe } from "@/lib/i18n/dict/cong-nghe";
import { donHang } from "@/lib/i18n/dict/don-hang";
import { NavLink } from "@/components/layout/NavLink";

const bienChuot = ["--rx", "--ry", "--mx", "--my"];

/**
 * Phần tử đã được React nhận (hydrate) chưa. Trang có khối Suspense (vd
 * /don-hang đọc useSearchParams) thì khối đó hydrate SAU khung web; nếu ta
 * thêm lớp `revealed` / biến style vào HTML máy chủ trước lúc đó, React báo
 * "hydration mismatch" và bỏ không vá thuộc tính. Nên chỉ đụng vào phần tử đã
 * có fiber; chưa có thì để lượt quét sau.
 */
function daHydrate(el: Element) {
  for (const k in el) if (k.startsWith("__reactFiber$")) return true;
  return false;
}

/** Gắn một lần ở khung công khai; quan sát thêm thẻ do bộ lọc và App Router dựng muộn. */
export function HieuUngThamChieu() {
  const duongDan = usePathname();
  const duongDanGoc = useDuongDan();
  const tx = useT(congNghe);
  const txDon = useT(donHang);
  const txUi = useT(giaoDien);
  const nhanChuot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const goc = document.documentElement;
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    const chuot = matchMedia("(min-width: 1024px) and (pointer: fine)");
    let donDep = () => {};
    const boQuaCu = MotionGlobalConfig.skipAnimations;

    function gan() {
      donDep();
      MotionGlobalConfig.skipAnimations = giam.matches;
      const phamVi = document.querySelector("#noi-dung");
      const chanTrang = document.querySelector("footer");
      const daGan = new WeakSet<Element>();
      const daNghieng = new Set<HTMLElement>();
      let khung = 0;
      const quanSat = window.IntersectionObserver ? new IntersectionObserver((muc) => {
        muc.forEach((e) => {
          if (!e.isIntersecting) return;
          if (e.target.matches("[data-mask-title]")) {
            const dong = new Map<number,number>();
            e.target.querySelectorAll<HTMLElement>(".nb-mask-word").forEach(tu => {
              const y = Math.round(tu.getBoundingClientRect().top);
              if (!dong.has(y)) dong.set(y, dong.size);
              tu.style.setProperty("--nb-dong-tre", ((dong.get(y) ?? 0) * 80) + "ms");
            });
          }
          e.target.classList.add("revealed");
          quanSat?.unobserve(e.target);
        });
      }, { threshold: 0.08 }) : null;

      function quet() {
        cuon();
        if (giam.matches || !quanSat) return;
        for (const vung of [phamVi, chanTrang]) {
          vung?.querySelectorAll<HTMLElement>("[data-reveal],[data-mask-title],[data-grid-scan]").forEach((el) => {
            if (daGan.has(el) || !daHydrate(el)) return;
            daGan.add(el);
            // Thẻ đã hiện cả khối thì chữ/ảnh bên trong không cần chạy chồng lần nữa.
            if (el.matches("[data-reveal]") && el.parentElement?.closest("[data-reveal]")) return;
            // So le theo vị trí thẻ, chặn ở 280ms để danh sách dài không phải đợi.
            const the = el.closest("li") ?? el;
            const nhom = the.parentElement;
            if (nhom && getComputedStyle(nhom).display === "grid") {
              const viTri = Array.from(nhom.children).indexOf(the);
              el.style.setProperty("--nb-tre", `${(viTri % 5) * 70}ms`);
            }
            quanSat.observe(el);
          });
        }
      }

      function traLai(el: HTMLElement) {
        bienChuot.forEach((bien) => el.style.removeProperty(bien));
        daNghieng.delete(el);
      }
      function di(e: PointerEvent) {
        if (giam.matches || !chuot.matches || e.pointerType !== "mouse" || !(e.target instanceof Element)) return;
        const anh = e.target.closest(".nb-don-anh,.nb-bai-anh,.nb-guide-anh");
        if (nhanChuot.current) {
          nhanChuot.current.hidden = !anh;
          nhanChuot.current.style.transform = `translate(${Math.min(innerWidth - 90, e.clientX + 16)}px,${Math.min(innerHeight - 40,e.clientY + 16)}px)`;
        }
        // Xử lý cả tấm kính bên ngoài lẫn nút bên trong, tránh tấm bị kẹt khi qua nút.
        let el = e.target.closest<HTMLElement>("[data-tilt],[data-magnetic]");
        while (el) {
          const r = el.getBoundingClientRect();
          if (r.width && r.height) {
            const x = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
            const y = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
            el.style.setProperty("--rx", `${-y * 5}deg`);
            el.style.setProperty("--ry", `${x * 5}deg`);
            el.style.setProperty("--mx", `${x * 5}px`);
            el.style.setProperty("--my", `${y * 5}px`);
            daNghieng.add(el);
          }
          el = el.parentElement?.closest<HTMLElement>("[data-tilt],[data-magnetic]") ?? null;
        }
      }
      function roi(e: PointerEvent) {
        if (nhanChuot.current && (!(e.relatedTarget instanceof Element) || !e.relatedTarget.closest(".nb-don-anh,.nb-bai-anh,.nb-guide-anh"))) nhanChuot.current.hidden = true;
        for (const el of daNghieng) {
          if (!(e.relatedTarget instanceof Node) || !el.contains(e.relatedTarget)) traLai(el);
        }
      }
      function traHet() { daNghieng.forEach(traLai); if (nhanChuot.current) nhanChuot.current.hidden = true; }
      function cuon() {
        if (khung) return;
        khung = requestAnimationFrame(() => {
          const toiDa = goc.scrollHeight - innerHeight;
          goc.style.setProperty("--scroll-progress", String(toiDa > 0 ? Math.max(0, Math.min(1, scrollY / toiDa)) : 0));
          // Cùng một nhịp cuộn cho mạch lộ trình và tiến độ bài; không thêm listener riêng từng trang.
          if (!giam.matches) phamVi?.querySelectorAll<HTMLElement>("[data-mach-cuon]").forEach((mach) => {
            const r = mach.getBoundingClientRect();
            const moc = innerHeight * 0.7;
            mach.style.setProperty("--nb-mach-tien-do", String(Math.max(0, Math.min(1, (moc - r.top) / Math.max(1, r.height)))));
            mach.querySelectorAll<HTMLElement>("[data-chang-mach]").forEach((chang) => {
              chang.classList.toggle("da-toi", chang.getBoundingClientRect().top <= moc);
            });
          });
          // Đây là trạng thái đọc, vẫn cập nhật khi người dùng giảm chuyển động.
          const bai = phamVi?.querySelector<HTMLElement>("[data-bai-doc]");
          const thanh = document.querySelector<HTMLElement>(".nb-doc-tien-do");
          if (bai && thanh) {
            const r = bai.getBoundingClientRect();
            const header = innerWidth >= 1024 ? parseFloat(getComputedStyle(goc).getPropertyValue("--nb-header")) || 72 : 0;
            const tienDo = Math.max(0, Math.min(1, (header - r.top) / Math.max(1, r.height - innerHeight + header)));
            thanh.style.setProperty("--nb-doc-tien-do", String(tienDo));
            thanh.setAttribute("aria-valuenow", String(Math.round(tienDo * 100)));
          }
          khung = 0;
        });
      }

      const thayDoi = new MutationObserver(quet);
      for (const vung of [phamVi, chanTrang]) {
        if (vung) thayDoi.observe(vung, { childList: true, subtree: true });
      }
      quet();
      // Hydrate không làm đổi DOM nên MutationObserver không báo: quét lại vài
      // lần trong 5 giây đầu để bắt các khối Suspense hydrate muộn.
      let lanQuet = 0;
      const quetLai = window.setInterval(() => {
        quet();
        if (++lanQuet >= 16) clearInterval(quetLai);
      }, 300);
      if (!giam.matches) goc.classList.add("nb-motion-ready");
      document.addEventListener("pointermove", di, { passive: true });
      document.addEventListener("pointerout", roi);
      window.addEventListener("scroll", cuon, { passive: true });
      window.addEventListener("resize", cuon);
      window.addEventListener("blur", traHet);
      chuot.addEventListener("change", traHet);
      cuon();
      donDep = () => {
        MotionGlobalConfig.skipAnimations = boQuaCu;
        quanSat?.disconnect();
        thayDoi.disconnect();
        clearInterval(quetLai);
        document.removeEventListener("pointermove", di);
        document.removeEventListener("pointerout", roi);
        window.removeEventListener("scroll", cuon);
        window.removeEventListener("resize", cuon);
        window.removeEventListener("blur", traHet);
        chuot.removeEventListener("change", traHet);
        cancelAnimationFrame(khung);
        traHet();
        goc.classList.remove("nb-motion-ready");
        goc.style.removeProperty("--scroll-progress");
        donDep = () => {};
      };
    }

    // Chờ trình duyệt rảnh rồi mới gắn: khối Suspense (vd bộ lọc /don-hang)
    // hydrate ngay sau khung web; gắn sớm thì quan sát/đổi thuộc tính trên HTML
    // máy chủ chưa hydrate và React báo "hydration mismatch".
    const coRanh = typeof window.requestIdleCallback === "function";
    const cho = coRanh ? window.requestIdleCallback(gan, { timeout: 700 }) : window.setTimeout(gan, 300);
    giam.addEventListener("change", gan);
    return () => {
      if (coRanh) window.cancelIdleCallback(cho);
      else clearTimeout(cho);
      giam.removeEventListener("change", gan);
      donDep();
    };
  }, [duongDan]);

  // Đặt ngoài PageFade: translate của lớp vào trang sẽ giữ fixed theo trang nếu lồng bên trong.
  return <>
    <span ref={nhanChuot} hidden className="nb-cursor-label" aria-hidden="true">{txUi.xem}</span>
    <div className="nb-scroll-progress" aria-hidden="true"><span /></div>
    {/^\/cam-nang\/[^/]+\/?$/.test(duongDanGoc) && <div className="nb-doc-tien-do" role="progressbar" aria-label={tx.tienDo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>}
    {/^\/don-hang\/[^/]+\/?$/.test(duongDanGoc) && <div className="nb-ung-tuyen-day"><NavLink data-magnetic href="/lien-he" className="nb-btn min-h-12 w-full px-5">{txDon.ct.ungTuyen}</NavLink></div>}
  </>;
}
