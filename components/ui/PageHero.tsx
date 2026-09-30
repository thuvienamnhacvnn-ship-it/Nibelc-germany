import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Dải đầu trang con — thấp, khoảng 28% chiều cao màn hình, KHÔNG phải hero to
 * như trang chủ (luật ở prompt mục 19).
 */
export function PageHero({
  anh,
  nhan,
  tieuDe,
  mo,
  soLieu,
  children,
}: {
  anh: string;
  nhan: string;
  tieuDe: ReactNode;
  mo?: string;
  soLieu?: { so: string; nhan: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={anh} alt="" fill priority quality={85} sizes="100vw" className="object-cover object-center" />
      </div>
      {/* KHÔNG phủ lớp màu lên ảnh banner. Ảnh đã được tạo với phần trái
          tối sẵn, và chữ tự mang bóng riêng (.nb-bong-chu). */}

      {/* Dải chuyển tiếp mỏng ở đáy để banner nối liền vào nền trang */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22%]"
        style={{ background: "linear-gradient(180deg, rgba(5,11,22,0) 0%, var(--nb-navy-900) 94%)" }}
        aria-hidden="true"
      />

      <div className="nb-wrap nb-bong-chu py-16">
        <p className="nb-eyebrow">{nhan}</p>
        <h1 className="nb-display mt-3 max-w-[22ch] text-[clamp(30px,3.2vw,46px)] text-white">{tieuDe}</h1>
        {mo && <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-[#d7e2f2]">{mo}</p>}

        {soLieu && soLieu.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
            {soLieu.map((s) => (
              <li key={s.nhan}>
                <b className="nb-gold-text nb-display block text-[28px] leading-none">{s.so}</b>
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
