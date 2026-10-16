"use client";
import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { giaoDien } from "@/lib/i18n/dict/giao-dien";
const doc = () => document.documentElement.dataset.theme === "ngay";
const theoDoi = (doi: () => void) => { window.addEventListener("nb:theme", doi); return () => window.removeEventListener("nb:theme", doi); };
export function DoiChuDe({ dayDu = false }: { dayDu?: boolean }) {
  const tx = useT(giaoDien);
  const ngay = useSyncExternalStore(theoDoi, doc, () => false);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const capNhat = () => {
      let daChon = false;
      try { daChon = ["ngay", "dem"].includes(localStorage.getItem("nb-theme") ?? ""); } catch {}
      if (!daChon) document.documentElement.dataset.theme = mq.matches ? "dem" : "ngay";
      window.dispatchEvent(new Event("nb:theme"));
    };
    const luu = (e: StorageEvent) => {
      if (e.key !== "nb-theme") return;
      if (e.newValue === "ngay" || e.newValue === "dem") document.documentElement.dataset.theme = e.newValue;
      capNhat();
    };
    mq.addEventListener("change", capNhat); window.addEventListener("storage", luu);
    return () => { mq.removeEventListener("change", capNhat); window.removeEventListener("storage", luu); };
  }, []);
  function doi() {
    const h = document.documentElement;
    const moi = h.dataset.theme === "ngay" ? "dem" : "ngay";
    const dat = () => { h.dataset.theme = moi; try { localStorage.setItem("nb-theme", moi); } catch {} window.dispatchEvent(new Event("nb:theme")); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { dat(); return; }
    if (document.startViewTransition) { const chuyen = document.startViewTransition(dat); chuyen.ready.catch(() => {}); }
    else { h.classList.add("nb-theme-changing"); dat(); setTimeout(() => h.classList.remove("nb-theme-changing"), 300); }
  }
  return <button type="button" className="nb-theme-button" onClick={doi} aria-label={ngay ? tx.dem : tx.ngay}>
    <Sun size={18} className="nb-theme-night" aria-hidden="true" /><Moon size={18} className="nb-theme-day" aria-hidden="true" />{dayDu && <span>{tx.chuDe}</span>}
  </button>;
}
