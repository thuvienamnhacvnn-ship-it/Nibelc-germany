import type { ReactNode } from "react";
import { NavLink } from "@/components/layout/NavLink";

/**
 * Dải đầu trang con — thấp, khoảng 28% chiều cao màn hình, KHÔNG phải hero to
 * như trang chủ (luật ở prompt mục 19).
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
  nhan,
  tieuDe,
  mo,
  loiTat,
  children,
}: {
  anh: string;
  /** bản dọc dùng cho màn hẹp; thiếu thì dùng tạm bản ngang */
  anhDoc?: string;
  nhan: string;
  tieuDe: ReactNode;
  mo?: string;
  /** hàng lối tắt bấm được dưới chân banner, thay cho dãy con số chỉ để ngắm */
  loiTat?: { nhan: string; href: string; so?: number }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <picture>
          {anhDoc && <source media="(max-width: 767px)" srcSet={anhDoc} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anh}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
      </div>
      {/* KHÔNG phủ lớp màu lên ảnh banner. Ảnh đã được tạo với phần trái
          tối sẵn, và chữ tự mang bóng riêng (.nb-bong-chu). */}

      {/* Dải chuyển tiếp mỏng ở đáy để banner nối liền vào nền trang */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22%]"
        style={{ background: "linear-gradient(180deg, rgba(5,11,22,0) 0%, var(--nb-navy-900) 94%)" }}
        aria-hidden="true"
      />

      <div className="nb-wrap nb-bong-chu py-11 sm:py-16">
        <p className="nb-eyebrow">{nhan}</p>
        {/* Trên điện thoại clamp() rơi về 30px cho MỌI tiêu đề, kể cả câu dài
            như "Du học nghề Đức – Học nghề – Có lương…", nên chữ tràn ra 4–5
            dòng sát mép. Hạ một bậc ở khổ hẹp rồi mới dùng clamp từ sm trở lên. */}
        <h1 className="nb-display mt-3 max-w-[22ch] text-[26px] leading-[1.18] text-white sm:text-[clamp(30px,3.2vw,46px)] sm:leading-[1.14]">
          {tieuDe}
        </h1>
        {mo && (
          /* Trên điện thoại chỉ giữ hai dòng đầu: mô tả dài đẩy phần nội dung
             thật xuống quá sâu, người xem phải cuộn mới thấy việc cần làm. */
          <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-[#d7e2f2] [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:mt-5 sm:text-[16px] sm:[-webkit-line-clamp:unset] sm:[display:block]">
            {mo}
          </p>
        )}

        {/* Dãy con số cũ ("20 đơn hàng · 469 suất tuyển") chỉ để ngắm, bấm
            không ra gì. Thay bằng hàng LỐI TẮT bấm được: mỗi chip đưa thẳng
            tới kết quả đã lọc sẵn, bớt cho người xem một lượt cuộn và một
            lượt chọn trong bảng lọc. */}
        {loiTat && loiTat.length > 0 && (
          <ul className="nb-no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1 sm:mt-7 sm:flex-wrap sm:overflow-x-visible">
            {loiTat.map((t) => (
              <li key={t.nhan} className="shrink-0">
                <NavLink
                  href={t.href}
                  className="flex h-11 items-center gap-2 rounded-full border border-[var(--nb-gold)]/45 bg-[var(--nb-navy-900)]/70 px-4 text-[13.5px] font-medium whitespace-nowrap text-[var(--nb-gold-soft)] backdrop-blur-sm transition hover:border-[var(--nb-gold)] hover:bg-[var(--nb-gold)] hover:text-[var(--nb-navy-900)]"
                >
                  {t.nhan}
                  {t.so !== undefined && (
                    <span className="rounded-full bg-[var(--nb-gold)]/20 px-2 py-0.5 text-[11.5px] font-semibold">
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
    </section>
  );
}
