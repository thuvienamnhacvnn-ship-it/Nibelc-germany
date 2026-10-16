"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
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
    <button ref={button} type="button" className={styles.trigger} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
      <Globe size={16} aria-hidden="true" />
      {websiteNetworkLabels(lang).title}
      <ChevronDown size={15} aria-hidden="true" className={open ? styles.rotated : ""} />
    </button>
    <nav id={panelId} className={styles.panel} data-open={open} inert={!open} aria-hidden={!open} aria-label={websiteNetworkLabels(lang).title}>
      <WebsiteNetworkList lang={lang} />
    </nav>
  </div>;
}
