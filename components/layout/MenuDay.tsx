"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Briefcase, GraduationCap, Home, Phone } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { mucMenu } from "@/data/nav";
import { useDuongDan, useLang, useT } from "@/lib/i18n/client";
import { common } from "@/lib/i18n/dict/common";

// Giữ nguyên năm đường dẫn và bộ nhãn vi/en/de của menu đáy.
const MUC = [
  { ...mucMenu("/"), Icon: Home },
  { ...mucMenu("/don-hang"), Icon: Briefcase },
  { ...mucMenu("/du-hoc-nghe"), Icon: GraduationCap },
  { ...mucMenu("/cam-nang"), Icon: BookOpen },
  { ...mucMenu("/lien-he"), Icon: Phone },
];

type Ripple = { id: number; x: number; y: number; href: string };

export function MenuDay() {
  const pathname = useDuongDan();
  const lang = useLang();
  const tx = useT(common);
  const reduced = useReducedMotion();
  const dock = useRef<HTMLElement>(null);
  const rippleId = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let previous = Math.max(0, window.scrollY);
    let direction = 0;
    let distance = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - previous;
      previous = y;
      // MenuDayDu hiện khoá cuộn html khi mở; theo dõi trạng thái đó,
      // không sửa tấm menu hoặc nơi mở nó trong banner.
      const menuOpen = document.documentElement.style.overflow === "hidden";
      const nearEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 96;
      if (menuOpen || nearEnd || y < 24 || dock.current?.querySelector(":focus-visible")) {
        distance = 0;
        setHidden(false);
        return;
      }
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
      direction = nextDirection;
      if (distance >= 8) {
        setHidden(direction > 0);
        distance = 0;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  function ripple(e: PointerEvent<HTMLLIElement>, href: string) {
    if (reduced || e.button !== 0) return;
    const box = e.currentTarget.getBoundingClientRect();
    const item = { id: ++rippleId.current, x: e.clientX - box.left, y: e.clientY - box.top, href };
    setRipples((current) => [...current.slice(-4), item]);
  }

  return (
    <nav ref={dock} aria-label={tx.menuChinh} data-menu-day data-hidden={hidden}
      className="nb-mobile-dock fixed z-50 lg:hidden" onFocusCapture={() => setHidden(false)}>
      <ul className="flex h-full items-stretch">
        {MUC.map(({ href, ngan, Icon }) => {
          const on = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="nb-dock-item relative min-w-0 flex-1" onPointerDown={(e) => ripple(e, href)}>
              <NavLink href={href} aria-current={on ? "page" : undefined} aria-label={ngan[lang]}
                className="nb-dock-link relative flex h-full flex-col items-center justify-center gap-1">
                {on && <motion.span layoutId="menu-day-pill" aria-hidden="true" className="nb-dock-pill"
                  initial={false} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }} />}
                <Icon size={22} strokeWidth={on ? 2.2 : 1.8} className="nb-dock-icon" />
                <span className="nb-dock-label w-full text-center text-[12px] leading-[1.4] tracking-[-0.01em]">{ngan[lang]}</span>
                {ripples.filter((r) => r.href === href).map((r) => (
                  <span key={r.id} aria-hidden="true" className="nb-dock-ripple" style={{ left: r.x, top: r.y }}
                    onAnimationEnd={() => setRipples((current) => current.filter((item) => item.id !== r.id))} />
                ))}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
