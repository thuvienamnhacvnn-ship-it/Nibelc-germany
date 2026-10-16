"use client";

import "@/components/tech/cong-nghe.css";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Flame, Search } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import type { BaiCongKhai } from "@/data/nguon-bai-viet";
import { useT } from "@/lib/i18n/client";
import { CHUYEN_MUC, camNang, type ChuyenMuc } from "@/lib/i18n/dict/cam-nang";

/**
 * TRUNG TÂM CẨM NANG
 *
 * Bố cục tạp chí: điều hướng chuyên mục bên trái, thẻ bài ở giữa, cột "Được
 * đọc nhiều nhất" bên phải. Lọc và tìm chạy ngay trên dữ liệu có sẵn.
 */

/** Bài đã dịch theo ngôn ngữ trang + đường dẫn + ảnh bìa + mã chuyên mục (data/nguon-bai-viet.ts) */
export type BaiHub = BaiCongKhai;

/** Ảnh minh hoạ cho bài CHƯA có ảnh bìa riêng, xoay vòng trong kho ảnh nghề đã có.
    Bài nào nhân viên đã chọn ảnh bìa trong trang quản trị (`anhBia`) thì dùng ảnh đó. */
const ANH = [
  "/assets/jobs/handel/01-hero-16x9.jpg",
  "/assets/jobs/gastronomie/04-detail-closeup.jpg",
  "/assets/jobs/it/01-hero-16x9.jpg",
  "/assets/jobs/logistik/01-hero-16x9.jpg",
  "/assets/jobs/elektro/04-detail-closeup.jpg",
  "/assets/jobs/soziales/01-hero-16x9.jpg",
  "/assets/jobs/mechanik/01-hero-16x9.jpg",
  "/assets/jobs/landwirtschaft/01-hero-16x9.jpg",
];

function bo(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function GuideHub({ bai: CAM_NANG }: { bai: BaiHub[] }) {
  const tx = useT(camNang);
  const [muc, setMuc] = useState<ChuyenMuc>(CHUYEN_MUC[0]);
  const [tu, setTu] = useState("");

  const ds = useMemo(() => {
    const q = bo(tu.trim());
    return CAM_NANG.filter((b) => {
      if (muc !== CHUYEN_MUC[0] && !b.muc.includes(muc)) return false;
      if (q && !bo(`${b.tieuDe} ${b.tomTat}`).includes(q)) return false;
      return true;
    });
  }, [CAM_NANG, muc, tu]);

  const docNhieu = CAM_NANG.slice(0, 5);

  return (
    <div className="nb-chi-muc nb-wrap grid grid-cols-[minmax(0,1fr)] gap-7 py-10 sm:gap-8 sm:py-14 lg:grid-cols-[236px_minmax(0,1fr)_280px] lg:py-20">
      {/* ---------- CHUYÊN MỤC ---------- */}
      {/* min-w-0 là BẮT BUỘC: ô của lưới mặc định min-width:auto, nên bề rộng
          max-content của hàng chip kéo ngang (11 chip whitespace-nowrap, ~1500px)
          lọt ra ngoài và nới rộng cả trang. Thiếu dòng này, khung trang phình
          quá 1024px, `lg:` bật lên, hàng chip mất overflow-x và càng phình to. */}
      {/* Máy tính: cùng khung thẻ trắng với cột "Được đọc nhiều nhất" bên phải cho cân
          (viết bằng utility lg: thay vì .nb-panel để khổ điện thoại giữ nguyên). */}
      <aside data-reveal className="h-fit min-w-0 lg:sticky lg:top-[calc(var(--nb-header)+20px)] lg:rounded-[16px] lg:border lg:border-[var(--nb-line-soft)] lg:bg-[var(--nb-surface)] lg:shadow-[0_1px_2px_rgba(7,21,37,.05),0_4px_12px_rgba(7,21,37,.04)] lg:p-5">
        <b className="block text-[15px] font-semibold text-[var(--nb-heading)]">{tx.danhMuc}</b>
        {/* Mười một chuyên mục xếp dọc ở khổ điện thoại chiếm gần 500px, đẩy bài
            viết xuống quá xa. Dưới lg thì cho chúng thành một hàng kéo ngang. */}
        <ul className="nb-no-scrollbar mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:max-w-none lg:space-y-1 lg:overflow-x-visible lg:pb-0">
          {CHUYEN_MUC.map((m) => {
            const so = m === CHUYEN_MUC[0] ? CAM_NANG.length : CAM_NANG.filter((b) => b.muc.includes(m)).length;
            const on = muc === m;
            return (
              <li key={m} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setMuc(m)}
                  aria-pressed={on}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-left text-[13.5px] whitespace-nowrap transition lg:min-h-0 lg:rounded-lg lg:border-0 lg:px-3 lg:whitespace-normal ${
                    on
                      ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-accent-text)]"
                      : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:bg-[var(--nb-surface)]/5"
                  }`}
                >
                  <span className="min-w-0 lg:truncate">{tx.chuyenMuc[m]}</span>
                  <span className="text-[12px] text-[var(--nb-text-mute)] lg:text-[12.5px]">{so}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ---------- BÀI VIẾT ---------- */}
      <div className="min-w-0">
        <div className="flex items-center gap-3 rounded-full border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]/70 px-5 py-2.5 focus-within:border-[var(--nb-gold)] lg:bg-[var(--nb-surface)] lg:shadow-[0_1px_2px_rgba(7,21,37,.05),0_4px_12px_rgba(7,21,37,.04)]">
          <Search size={17} className="shrink-0 text-[var(--nb-accent-text)]" />
          <input
            value={tu}
            onChange={(e) => setTu(e.target.value)}
            placeholder={tx.timGoiY}
            aria-label={tx.timAria}
            className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-[var(--nb-heading)] outline-none placeholder:text-[var(--nb-text-mute)] lg:h-8"
          />
        </div>

        {ds.length === 0 ? (
          <p data-reveal data-tilt className="nb-panel mt-6 p-8 text-center text-[14.5px] text-[var(--nb-text-dim)] sm:p-12">
            {tx.khongCo(tx.chuyenMuc[CHUYEN_MUC[0]])}
          </p>
        ) : (
          <ol className="nb-chi-muc-ds mt-6">
            {ds.map((b, i) => (
              <li key={b.id}>
                <NavLink data-reveal href={`/cam-nang/${b.slug}`} className="nb-bai">
                  <span className="nb-bai-so">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nb-bai-anh">
                    <Image src={b.anhBia ?? ANH[i % ANH.length]!} alt="" fill sizes="(max-width:639px) 90px, 120px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-xs text-[var(--nb-text-mute)]">{tx.chuyenMuc[b.muc[0]!]}</span>
                    <b className="mt-2 block text-base font-semibold text-[var(--nb-heading)]">{b.tieuDe}</b>
                    <span className="mt-2 block text-sm text-[var(--nb-text-dim)]">{b.tomTat}</span>
                    <span className="mt-3 block text-xs text-[var(--nb-text-mute)]">{tx.phutDoc(b.phut)}</span>
                  </span>
                  <ArrowRight className="nb-bai-mui" size={18} />
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* ---------- ĐƯỢC ĐỌC NHIỀU NHẤT ---------- */}
      <aside data-reveal data-tilt className="nb-panel h-fit min-w-0 p-5 lg:sticky lg:top-[calc(var(--nb-header)+20px)]">
        <b className="flex items-center gap-2 text-[15px] font-semibold text-[var(--nb-heading)]">
          <Flame size={16} className="text-[var(--nb-accent-text)]" />
          {tx.docNhieu}
        </b>
        <ol className="mt-4 space-y-3">
          {docNhieu.map((b, i) => (
            <li key={b.id}>
              <NavLink href={`/cam-nang/${b.slug}`} className="group flex min-h-[44px] gap-3 lg:min-h-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[12px] font-bold text-[var(--nb-accent-text)] lg:text-[12.5px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-snug font-medium text-[var(--nb-text)] transition group-hover:text-[var(--nb-accent-text)]">
                    {b.tieuDe}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-[var(--nb-text-mute)] lg:text-[12.5px]">{tx.phutDoc(b.phut)}</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
