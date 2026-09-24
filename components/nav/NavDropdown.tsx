"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { MenuLink } from "@/content/nav-menu";

/**
 * Một mục nav có menu xổ xuống (mẫu 08 vẽ mũi tên ⌄ ở bốn mục).
 *
 * Mở bằng chuột (hover), bằng bàn phím (Enter / Space / mũi tên xuống) và
 * đóng bằng Esc hoặc khi con trỏ rời khỏi. Bản thân mục vẫn là link thật,
 * nên bấm vào vẫn sang trang cha.
 */
export function NavDropdown({
  label,
  href,
  items,
  columns = 1,
  active,
  navy,
  fontSize,
  underlineGap,
}: {
  label: string;
  href: string;
  items: MenuLink[];
  columns?: 1 | 2;
  active?: boolean;
  navy?: boolean;
  fontSize: number;
  underlineGap: number;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={box}
      className="relative flex h-full items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={href as Route}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-controls={id}
        style={{ fontSize: `calc(${fontSize} * var(--u))` }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            box.current?.querySelector<HTMLAnchorElement>("[data-sub] a")?.focus();
          }
        }}
        className={`relative flex h-full items-center gap-[calc(6*var(--u))] whitespace-nowrap ${
          active ? (navy ? "text-white" : "text-[var(--nb-blue-dark)]") : navy ? "text-white/90 hover:text-white" : "hover:text-[var(--nb-blue-dark)]"
        }`}
      >
        {label}
        <Icon name="chevronDown" className="h-[calc(13*var(--u))] w-[calc(13*var(--u))]" strokeWidth={2} />
        {active && (
          <span
            style={{ top: `calc(50% + ${underlineGap} * var(--u))` }}
            className={`absolute inset-x-[calc(-4*var(--u))] h-[calc(3*var(--u))] rounded-full ${
              navy ? "bg-[var(--nb-orange)]" : "bg-[var(--nb-blue-dark)]"
            }`}
            aria-hidden="true"
          />
        )}
      </Link>

      <div
        id={id}
        data-sub
        hidden={!open}
        className={`absolute top-full left-[calc(-16*var(--u))] z-50 rounded-[calc(10*var(--u))] bg-white p-[calc(12*var(--u))] text-[var(--nb-ink)] shadow-[0_18px_40px_-18px_rgba(15,35,64,.55)] ring-1 ring-[#e3e9f1] ${
          columns === 2 ? "w-[calc(560*var(--u))]" : "w-[calc(330*var(--u))]"
        }`}
      >
        <ul className={columns === 2 ? "grid grid-cols-2 gap-x-[calc(8*var(--u))]" : ""}>
          {items.map((it) => (
            <li key={it.label + it.href}>
              <Link
                href={it.href as Route}
                className="block rounded-[calc(7*var(--u))] px-[calc(12*var(--u))] py-[calc(8*var(--u))] hover:bg-[var(--nb-strip)]"
              >
                <span className="block text-[calc(14*var(--u))] leading-[calc(19*var(--u))] font-semibold">{it.label}</span>
                {it.desc && (
                  <span className="block text-[calc(12*var(--u))] leading-[calc(16*var(--u))] text-[var(--nb-muted)]">{it.desc}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
