import type { ReactNode } from "react";

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
  soLieu,
  children,
}: {
  anh: string;
  /** bản dọc dùng cho màn hẹp; thiếu thì dùng tạm bản ngang */
  anhDoc?: string;
  nhan: string;
  tieuDe: ReactNode;
  mo?: string;
  soLieu?: { so: string; nhan: string }[];
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
        {mo && <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-[#d7e2f2] sm:mt-5 sm:text-[16px]">{mo}</p>}

        {soLieu && soLieu.length > 0 && (
          /* gap-x-10 ở khổ 390px làm hai số liệu không đủ chỗ cạnh nhau nên
             mỗi số xuống một dòng; thu khoảng cách lại để chúng xếp thành hàng */
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-4 sm:mt-7 sm:gap-x-10">
            {soLieu.map((s) => (
              <li key={s.nhan}>
                <b className="nb-gold-text nb-display block text-[26px] leading-none sm:text-[28px]">{s.so}</b>
                <span className="mt-1 block text-[12.5px] text-[var(--nb-text-dim)]">{s.nhan}</span>
              </li>
            ))}
          </ul>
        )}

        {children}
      </div>
    </section>
  );
}
