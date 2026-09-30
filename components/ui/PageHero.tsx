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
      {/* Chữ trắng nằm trên ảnh nên cần nền tối; đây là dải đầu trang nhỏ,
          không phải ảnh nội dung. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,11,22,.96) 0%, rgba(5,11,22,.82) 42%, rgba(5,11,22,.45) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="nb-wrap py-16">
        <p className="nb-eyebrow">{nhan}</p>
        <h1 className="nb-display mt-3 max-w-[22ch] text-[clamp(30px,3.2vw,46px)] text-white">{tieuDe}</h1>
        {mo && <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-[var(--nb-text-dim)]">{mo}</p>}

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
