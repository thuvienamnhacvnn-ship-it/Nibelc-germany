import type { ReactNode } from "react";
import { NavLink } from "@/components/layout/NavLink";
import "./page-hero.css";

/**
 * Dải đầu trang con — thấp (360px ở máy tính), KHÔNG phải hero to như trang chủ.
 *
 * TẤM CHỮ ĐỒNG NHẤT (v2, 01/10/2026)
 * Mọi trang con dùng cùng một tấm chữ navy: rộng 640px, mép trái theo lề
 * .nb-wrap, căn giữa dọc trong dải 360px. Chữ không mang bóng/glow — tấm nền
 * riêng (không phải lớp phủ ảnh) lo phần tương phản. Token ở page-hero.css.
 * Ảnh có người ở nửa trái thì chỉnh `viTriAnh` hoặc `latAnh` ở trang đó để
 * tấm không che mặt — KHÔNG dời tấm, giữ vị trí giống nhau giữa các trang.
 *
 * ẢNH RIÊNG CHO ĐIỆN THOẠI
 * Banner desktop là khổ 1920×560 (tỉ lệ 3,43 — rất dẹt). Trên màn 390px,
 * `object-cover` phóng to tới mức chỉ còn 30% bề ngang ảnh gốc lọt vào khung,
 * bố cục ảnh mất sạch. Nên mỗi trang có thêm một bản dọc riêng: đặt cùng tên
 * trong `/assets/banners/mobile/`, thành phần tự chọn bằng `<source>` theo
 * media query — trình duyệt chỉ tải đúng một bản.
 */
export function PageHero({
  anh,
  anhDoc,
  viTriAnh,
  latAnh,
  anhBenPhai,
  chuaThanhTim,
  nhan,
  tieuDe,
  mo,
  loiTat,
  children,
}: {
  anh: string;
  /** bản dọc dùng cho màn hẹp; thiếu thì dùng tạm bản ngang */
  anhDoc?: string;
  /** object-position của ảnh (mặc định "center") — dùng để kéo mặt người ra khỏi vùng tấm chữ */
  viTriAnh?: string;
  /** lật ngang ảnh (ảnh không có chữ) khi người đứng ở nửa trái, đúng chỗ tấm chữ */
  latAnh?: boolean;
  /** máy tính: ảnh chỉ chiếm phần phải banner, nền trái navy đặc — cho ảnh có
   *  mặt người ở giữa/trái (ảnh nghề 16:9) để tấm chữ không bao giờ che mặt */
  anhBenPhai?: boolean;
  /** trang có thanh tìm kéo lên đè đáy banner (/don-hang): chừa đáy để tấm không chạm thanh */
  chuaThanhTim?: boolean;
  nhan: string;
  tieuDe: ReactNode;
  mo?: string;
  /** hàng lối tắt bấm được dưới chân banner, thay cho dãy con số chỉ để ngắm */
  loiTat?: { nhan: string; href: string; so?: number }[];
  children?: ReactNode;
}) {
  return (
    <section className={`relative isolate overflow-hidden ${anhBenPhai ? "lg:bg-[var(--nb-navy-900)]" : ""}`}>
      {/* ẢNH BANNER
          Ở ĐIỆN THOẠI (phiên mobile) đây là một khối riêng cao 220px, KHÔNG có
          chữ nào nằm đè lên: chữ xuống hẳn phía dưới trên nền phẳng — ảnh thật
          nhiều chi tiết, chữ đặt lên dễ rơi trúng mặt người.
          TỪ lg trở lên ảnh quay lại làm NỀN tuyệt đối, chữ nằm trên tấm navy
          (bản desktop của đội W-AGENT). */}
      <div
        className={`relative h-[220px] w-full sm:h-[260px] lg:absolute lg:inset-0 lg:-z-10 lg:h-auto ${anhBenPhai ? "nb-hero-anh-phai" : ""}`}
      >
        <picture>
          {anhDoc && <source media="(max-width: 767px)" srcSet={anhDoc} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anh}
            alt=""
            fetchPriority="high"
            style={viTriAnh ? { objectPosition: viTriAnh } : undefined}
            className={`absolute inset-0 h-full w-full object-cover object-center ${latAnh ? "-scale-x-100" : ""}`}
          />
        </picture>

        {/* KHÔNG phủ lớp màu lên ảnh banner. Chỉ một dải chuyển tiếp mỏng ở
            ĐÁY để ảnh nối liền vào nền trang — CHỈ ở màn hẹp. Desktop bỏ:
            luật cấm phủ lớp lên ảnh (quyết định 01/10). */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] lg:hidden"
          style={{
            // bắt đầu từ CHÍNH màu nền ở độ trong suốt 0 — chép tay rgba(5,11,22,0)
            // thì sau khi nền đổi sang xanh, giữa dải hiện một vệt xám bẩn
            background: "linear-gradient(180deg, rgb(var(--nb-navy-900-rgb) / 0) 0%, var(--nb-navy-900) 94%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Điện thoại: khối chữ trên nền phẳng dưới ảnh (nb-hero-con-chu tắt bóng chữ).
          Máy tính: dải cao 360px, tấm chữ navy căn giữa dọc. min-h chứ không h cứng
          để trang nhiều nội dung không bị cắt. */}
      <div
        className={`nb-wrap nb-hero-khung nb-hero-con-chu py-7 sm:py-9 lg:flex lg:items-center lg:pt-8 ${chuaThanhTim ? "lg:pb-16" : "lg:pb-8"}`}
      >
        <div className="nb-hero-tam lg:px-8 lg:py-6">
          <p className="nb-eyebrow">{nhan}</p>
          {/* Trên điện thoại clamp() rơi về 30px cho MỌI tiêu đề, kể cả câu dài
              như "Du học nghề Đức – Học nghề – Có lương…", nên chữ tràn ra 4–5
              dòng sát mép. Hạ một bậc ở khổ hẹp rồi mới dùng clamp từ sm trở lên. */}
          {/* text-balance ở MỌI khổ, không chỉ lg: ở điện thoại mấy tiêu đề
              này hay rớt đúng MỘT chữ xuống dòng cuối ("… tại châu / Âu"),
              nhìn như lỗi. Tiếng Đức ghép từ dài nên còn dễ rớt hơn. */}
          <h1 className="nb-display mt-3 max-w-[22ch] text-[26px] leading-[1.18] text-balance text-white sm:text-[clamp(30px,3.2vw,46px)] sm:leading-[1.14] lg:max-w-none lg:text-[40px]">
            {tieuDe}
          </h1>
          {mo && (
            /* Trên điện thoại chỉ giữ hai dòng đầu: mô tả dài đẩy phần nội dung
               thật xuống quá sâu, người xem phải cuộn mới thấy việc cần làm.
               Máy tính: hiện đủ, ≤ 2 dòng nhờ cỡ 14.5px trên bề rộng tấm. */
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-[var(--hero-mo)] [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:mt-5 sm:text-[16px] sm:[-webkit-line-clamp:unset] sm:[display:block] lg:mt-4 lg:max-w-none lg:text-[14.5px] lg:leading-[1.6]">
              {mo}
            </p>
          )}

          {/* Hàng LỐI TẮT bấm được: mỗi chip đưa thẳng tới kết quả đã lọc sẵn. */}
          {loiTat && loiTat.length > 0 && (
            <ul className="nb-no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1 sm:mt-7 sm:flex-wrap sm:overflow-x-visible lg:mt-5 lg:pb-0">
              {loiTat.map((t) => (
                <li key={t.nhan} className="shrink-0">
                  <NavLink
                    href={t.href}
                    /* Ở điện thoại chip nằm trên nền trang phẳng chứ không còn
                       trên ảnh, nên nền mờ `navy-900/70` sẽ gần như tàng hình.
                       Dùng bậc KHỐI cho nó nổi lên; từ lg nằm trên tấm navy. */
                    className="flex h-11 items-center gap-2 rounded-full border border-[var(--nb-gold)]/45 bg-[var(--nb-navy-800)] px-4 text-[13.5px] font-medium whitespace-nowrap text-[var(--nb-gold-soft)] transition hover:border-[var(--nb-gold)] hover:bg-[var(--nb-gold)] hover:text-[var(--nb-navy-900)] lg:h-8 lg:bg-[var(--nb-navy-900)]/70 lg:px-3.5 lg:text-[13px]"
                  >
                    {t.nhan}
                    {t.so !== undefined && (
                      <span className="rounded-full bg-[var(--nb-gold)]/20 px-2 py-0.5 text-[12px] font-semibold lg:text-[12.5px]">
                        {t.so}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
