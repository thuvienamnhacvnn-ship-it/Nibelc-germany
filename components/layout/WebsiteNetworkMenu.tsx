"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLang } from "@/lib/i18n/client";
import { websiteNetworkLabels } from "@/lib/website-network";
import { WebsiteNetworkList } from "./WebsiteNetwork";
import styles from "./website-network.module.css";

export function WebsiteNetworkMenu() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return <div ref={root} className={styles.menu} data-website-network="header"
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        button.current?.focus();
      }
    }}>
    {/* Sếp 17/10: dùng đúng nút của Viet-Duc-group — icon lưới 4 ô, chỉ icon, nằm trên thanh menu. */}
    <button ref={button} type="button" className={styles.trigger} aria-label={websiteNetworkLabels(lang).title} title={websiteNetworkLabels(lang).title} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="6" height="6" rx="1.3" />
        <rect x="15" y="3" width="6" height="6" rx="1.3" />
        <rect x="3" y="15" width="6" height="6" rx="1.3" />
        <rect x="15" y="15" width="6" height="6" rx="1.3" />
      </svg>
    </button>
    <nav id={panelId} className={styles.panel} data-open={open} inert={!open} aria-hidden={!open} aria-label={websiteNetworkLabels(lang).title}>
      <WebsiteNetworkList lang={lang} gon />
    </nav>
  </div>;
}
