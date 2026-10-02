"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Route as RouteIcon,
  Search,
  X,
} from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { LEGAL } from "@/data/company";
import { DIA_CHI_NGAN } from "@/data/i18n/company";
import { INDUSTRIES } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { JOBS, TONG_SUAT } from "@/data/jobs";
import { NGANH_HOC } from "@/data/ausbildung";
import { CAM_NANG } from "@/data/articles";
import { useDuongDan, useLang, useLh, useT } from "@/lib/i18n/client";
import { common } from "@/lib/i18n/dict/common";

/**
 * MENU ĐẦY ĐỦ — mở từ nút ba chấm ở góc phải banner, CHỈ ở khổ điện thoại.
 *
 * ── Vì sao cần nó, khi đã có menu đáy ──────────────────────────────────────
 * Menu đáy chỉ chứa được NĂM mục (quá số đó thì chữ bị bóp và ngón tay bấm
 * nhầm), mà trang chủ có BẢY trang chính cộng hai trang pháp lý. Lộ trình và
 * Về chúng tôi vì thế không có đường nào tới được ở bản điện thoại — vào
 * được chỉ nhờ link rải trong bài. Tấm này là chỗ chứa trọn bộ.
 *
 * ── "Gọn gàng" nghĩa là gì ở đây ───────────────────────────────────────────
 * KHÔNG liệt kê phẳng chín dòng. Chia ba nhóm theo việc người ta định làm:
 *   1. Việc làm & học nghề — thứ 90% khách vào để tìm
 *   2. Ngành nghề — gấp lại, mở ra mới thấy; đi thẳng vào bộ lọc đơn hàng
 *   3. Tìm hiểu — đọc thêm, quyết định sau
 * rồi mới tới khối liên hệ và dòng pháp lý ở chân.
 *
 * ── "Thông minh" nghĩa là gì ở đây ─────────────────────────────────────────
 * Mỗi mục kèm CON SỐ THẬT đếm từ dữ liệu (`JOBS.length`, `TONG_SUAT`,
 * `NGANH_HOC.length`, `CAM_NANG.length`) — không ai bịa ra "hàng nghìn đơn".
 * Số tự đổi theo kho, nên không bao giờ lệch. Ô tìm ở đầu tấm đi thẳng tới
 * kết quả thay vì bắt người ta vào trang đơn hàng rồi gõ lại.
 *
 * ── Đa ngữ ────────────────────────────────────────────────────────────────
 * Nhãn trang lấy từ `data/nav.ts`, cùng nguồn với header và menu đáy — sửa
 * tên trang một chỗ là ba nơi đổi theo, không bao giờ lệch nhau. Chữ riêng
 * của tấm này nằm ở `common.menuDayDu`. Đường dẫn đi qua `useLh()` nên bấm
 * trong bản /de thì sang trang vẫn ở /de.
 *
 * Ngôn ngữ KHÔNG đặt trong tấm này: nó đã là một nút riêng ở góc trái banner,
 * để trong đây nữa là lặp.
 */

/** tra nhãn trang theo href, dùng chung nguồn với header và menu đáy */
const nhanTrang = (href: string) => NAV.find((m) => m.href === href)?.label;

export function MenuDayDu({ mo, dong }: { mo: boolean; dong: () => void }) {
  const pathname = useDuongDan();
  const lang = useLang();
  const tx = useT(common).menuDayDu;
  const lh = useLh();
  const router = useRouter();

  /* Gắn thẳng vào <body> bằng portal, KHÔNG để nằm nguyên chỗ trong cây.
     Lý do đo được: banner bọc tấm này có class `isolate`, mà `isolate` tạo
     một TẦNG XẾP mới — z-index bên trong chỉ so với nhau, không so được với
     phần còn lại của trang. Hậu quả là menu đáy (z-50, nằm ở layout gốc) vẫn
     đè lên tấm menu z-[61] này, che mất khối liên hệ ở chân tấm. Portal đưa
     tấm ra ngoài tầng xếp đó nên z-index mới có tác dụng thật.
     `gan` để tránh lệch giữa bản dựng trên máy chủ và trên trình duyệt:
     máy chủ không có document. */
  const [gan, setGan] = useState(false);
  useEffect(() => setGan(true), []);
  const [moNganh, setMoNganh] = useState(false);
  const [tu, setTu] = useState("");

  const dangMo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const NHOM = [
    {
      ten: tx.nhomViec,
      muc: [
        { href: "/don-hang", Icon: Briefcase, phu: tx.soDon(JOBS.length, TONG_SUAT) },
        { href: "/du-hoc-nghe", Icon: GraduationCap, phu: tx.soNganh(NGANH_HOC.length) },
        { href: "/lo-trinh", Icon: RouteIcon, phu: tx.moLoTrinh },
      ],
    },
    {
      ten: tx.nhomHieu,
      muc: [
        { href: "/cam-nang", Icon: BookOpen, phu: tx.soBai(CAM_NANG.length) },
        { href: "/ve-chung-toi", Icon: Building2, phu: LEGAL.name },
      ],
    },
  ];

  /* Khoá cuộn nền khi tấm mở.
     PHẢI khoá cả <html>, không chỉ <body>: thuộc tính overflow của khung nhìn
     lấy từ thẻ GỐC, nên đặt mỗi `body.style.overflow = "hidden"` thì body chỉ
     tự thành khung cuộn riêng cao đúng bằng nội dung và trang vẫn cuộn như
     thường. Đã dính đúng lỗi này ở tấm lọc /don-hang, đo ra scrollY nhảy từ 0
     lên 600. Trên máy tính khoá <html> làm mất thanh cuộn nên bù lại bằng
     padding-right, điện thoại thì bề rộng đó bằng 0. */
  useEffect(() => {
    if (!mo) return;
    const html = document.documentElement;
    const cuHtml = html.style.overflow;
    const cuBody = document.body.style.overflow;
    const cuPad = html.style.paddingRight;
    const bu = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (bu > 0) html.style.paddingRight = `${bu}px`;

    const phim = (e: KeyboardEvent) => {
      if (e.key === "Escape") dong();
    };
    window.addEventListener("keydown", phim);
    return () => {
      html.style.overflow = cuHtml;
      document.body.style.overflow = cuBody;
      html.style.paddingRight = cuPad;
      window.removeEventListener("keydown", phim);
    };
  }, [mo, dong]);

  /* Đổi trang thì đóng tấm. Không có cái này, bấm một mục xong tấm vẫn nằm
     che trang mới. */
  useEffect(() => {
    dong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function tim(e: React.FormEvent) {
    e.preventDefault();
    const q = tu.trim();
    dong();
    router.push(lh(q ? `/don-hang?q=${encodeURIComponent(q)}` : "/don-hang") as Route);
  }

  if (!gan) return null;

  return createPortal(
    <AnimatePresence>
      {mo && (
        <>
          {/* Nền mờ. Bấm vào là đóng. */}
          <motion.button
            type="button"
            aria-label={tx.dong}
            className="fixed inset-0 z-[60] bg-[#030c18]/70 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={dong}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={tx.nhan}
            className="fixed inset-y-0 right-0 z-[61] flex w-[min(86vw,360px)] flex-col bg-[var(--nb-navy-900)] lg:hidden"
            style={{ boxShadow: "-24px 0 60px -20px rgba(3,12,26,.9)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            {/* ---------- ĐẦU TẤM ---------- */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--nb-line-soft)] px-4 py-3">
              <NavLink href="/" aria-label={nhanTrang("/")?.[lang]} onClick={dong}>
                <Image
                  src="/assets/brand/nibelc-logo-trang.svg"
                  alt="NIBELC GERMANY"
                  width={132}
                  height={29}
                  className="h-9 w-auto"
                />
              </NavLink>
              <button
                type="button"
                onClick={dong}
                aria-label={tx.dong}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--nb-line-soft)] text-white transition active:scale-95"
              >
                <X size={19} />
              </button>
            </div>

            {/* ---------- THÂN: vùng cuộn riêng ---------- */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-5">
              {/* Ô tìm: đi THẲNG tới kết quả, không bắt vào trang rồi gõ lại */}
              <form
                onSubmit={tim}
                role="search"
                className="flex items-center gap-2.5 rounded-full border border-[var(--nb-gold)]/55 bg-[var(--nb-navy-800)] py-1.5 pr-1.5 pl-4 focus-within:border-[var(--nb-gold)]"
              >
                <Search size={17} className="shrink-0 text-white/85" />
                <input
                  value={tu}
                  onChange={(e) => setTu(e.target.value)}
                  placeholder={tx.goiY}
                  aria-label={tx.goiY}
                  className="h-10 min-w-0 flex-1 bg-transparent text-[14.5px] text-white outline-none placeholder:text-[#dbe6f5]"
                />
                <button
                  type="submit"
                  aria-label={tx.goiY}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                >
                  <ArrowRight size={17} />
                </button>
              </form>

              {/* ---------- HAI NHÓM MỤC CHÍNH ---------- */}
              {NHOM.map((nhom, i) => (
                <div key={nhom.ten} className={i === 0 ? "mt-5" : "mt-6"}>
                  <p className="nb-eyebrow px-1">{nhom.ten}</p>
                  <ul className="mt-2.5 space-y-1.5">
                    {nhom.muc.map(({ href, Icon, phu }) => {
                      const on = dangMo(href);
                      const label = nhanTrang(href)?.[lang] ?? href;
                      return (
                        <li key={href}>
                          <NavLink
                            href={lh(href)}
                            onClick={dong}
                            aria-current={on ? "page" : undefined}
                            className={`flex min-h-[56px] items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition ${
                              on
                                ? "border-[var(--nb-gold)]/55 bg-[var(--nb-navy-700)]"
                                : "border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]"
                            }`}
                          >
                            <span
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                                on
                                  ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                                  : "bg-[var(--nb-navy-700)] text-[var(--nb-gold)]"
                              }`}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <b
                                className={`block text-[15px] leading-[1.35] font-semibold ${
                                  on ? "text-[var(--nb-gold-strong)]" : "text-white"
                                }`}
                              >
                                {label}
                              </b>
                              {/* leading-[1.4] chứ không leading-none: ô cao
                                  đúng 1em thì `truncate` xén mất dấu tiếng
                                  Việt ở chữ hoa. */}
                              <span className="mt-0.5 block truncate text-[12.5px] leading-[1.4] text-[var(--nb-text-mute)]">
                                {phu}
                              </span>
                            </span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Ngành nghề gấp lại, nằm ngay sau nhóm việc làm */}
                  {i === 0 && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => setMoNganh((v) => !v)}
                        aria-expanded={moNganh}
                        className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-2xl border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] px-3.5 text-left"
                      >
                        <span className="text-[14px] font-medium text-[var(--nb-text-dim)]">{tx.theoNganh}</span>
                        <span className="flex shrink-0 items-center gap-2 text-[12.5px] text-[var(--nb-text-mute)]">
                          {INDUSTRIES.length}
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${moNganh ? "rotate-180" : ""}`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {moNganh && (
                          <motion.ul
                            className="flex flex-wrap gap-1.5 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
                          >
                            {INDUSTRIES.map((n) => (
                              <li key={n.id}>
                                <NavLink
                                  href={lh(`/don-hang?nganh=${n.id}`)}
                                  onClick={dong}
                                  className="flex min-h-[38px] items-center rounded-full border border-[var(--nb-line-soft)] px-3 text-[12.5px] text-[var(--nb-text-dim)]"
                                >
                                  {tenNganh(n, lang)}
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}

              {/* ---------- LIÊN HỆ ---------- */}
              <div className="mt-6">
                <p className="nb-eyebrow px-1">{tx.nhomLienHe}</p>
                <ul className="mt-2.5 space-y-1.5 text-[14px]">
                  <li>
                    <a
                      href={`tel:${LEGAL.phone.replace(/\s/g, "")}`}
                      className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] px-3.5 text-[var(--nb-text-dim)]"
                    >
                      <Phone size={16} className="shrink-0 text-[var(--nb-gold)]" />
                      <span className="truncate">{LEGAL.phone}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${LEGAL.email}`}
                      className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] px-3.5 text-[var(--nb-text-dim)]"
                    >
                      <Mail size={16} className="shrink-0 text-[var(--nb-gold)]" />
                      <span className="truncate">{LEGAL.email}</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3 px-3.5 py-2 text-[12.5px] leading-[1.6] text-[var(--nb-text-mute)]">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
                    <span>{DIA_CHI_NGAN}</span>
                  </li>
                </ul>

                <NavLink
                  href={lh("/lien-he")}
                  onClick={dong}
                  className="nb-btn mt-3 h-12 w-full px-5 text-[14.5px]"
                >
                  {tx.dangKy}
                  <ArrowRight size={16} />
                </NavLink>
              </div>
            </div>

            {/* ---------- CHÂN ----------
                Nền đặt ở CHÍNH thẻ mang padding safe-area, không ở thẻ con:
                để nền ở trong thì vùng vạch home của iPhone (~34px) trong
                suốt, nhìn ra là tấm menu hở đáy. */}
            <div
              className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] px-4 pt-3"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
            >
              <ul className="flex flex-wrap items-center gap-x-5 text-[12.5px] text-[var(--nb-text-mute)]">
                <li>
                  <NavLink href={lh("/impressum")} onClick={dong} className="flex min-h-[40px] items-center">
                    Impressum
                  </NavLink>
                </li>
                <li>
                  <NavLink href={lh("/datenschutz")} onClick={dong} className="flex min-h-[40px] items-center">
                    Datenschutz
                  </NavLink>
                </li>
                <li className="ml-auto">© {new Date().getFullYear()} NIBELC</li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
