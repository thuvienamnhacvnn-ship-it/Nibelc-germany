"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    const goc = document.documentElement;
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    const chuot = matchMedia("(min-width: 1024px) and (pointer: fine)");
    let donDep = () => {};

    function gan() {
      donDep();
      if (giam.matches || !window.IntersectionObserver) return;
      const phamVi = document.querySelector("#noi-dung");
      const chanTrang = document.querySelector("footer");
      const daGan = new WeakSet<Element>();
      const daNghieng = new Set<HTMLElement>();
      let khung = 0;
      const quanSat = new IntersectionObserver((muc) => {
        muc.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("revealed");
          quanSat.unobserve(e.target);
        });
      }, { threshold: 0.08 });

      function quet() {
        for (const vung of [phamVi, chanTrang]) {
          vung?.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            if (daGan.has(el) || !daHydrate(el)) return;
            daGan.add(el);
            // Thẻ đã hiện cả khối thì chữ/ảnh bên trong không cần chạy chồng lần nữa.
            if (el.parentElement?.closest("[data-reveal]")) return;
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
        if (!chuot.matches || e.pointerType !== "mouse" || !(e.target instanceof Element)) return;
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
        for (const el of daNghieng) {
          if (!(e.relatedTarget instanceof Node) || !el.contains(e.relatedTarget)) traLai(el);
        }
      }
      function traHet() { daNghieng.forEach(traLai); }
      function cuon() {
        if (khung) return;
        khung = requestAnimationFrame(() => {
          const toiDa = goc.scrollHeight - innerHeight;
          goc.style.setProperty("--scroll-progress", String(toiDa > 0 ? Math.max(0, Math.min(1, scrollY / toiDa)) : 0));
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
      goc.classList.add("nb-motion-ready");
      document.addEventListener("pointermove", di, { passive: true });
      document.addEventListener("pointerout", roi);
      window.addEventListener("scroll", cuon, { passive: true });
      window.addEventListener("resize", cuon);
      window.addEventListener("blur", traHet);
      chuot.addEventListener("change", traHet);
      cuon();
      donDep = () => {
        quanSat.disconnect();
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

    gan();
    giam.addEventListener("change", gan);
    return () => { giam.removeEventListener("change", gan); donDep(); };
  }, [duongDan]);

  return <div className="nb-scroll-progress" aria-hidden="true" />;
}
