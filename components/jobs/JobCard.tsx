import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { chuoiLuong, noiLamViec, tenNhaTuyenDung } from "@/types/job";
import { industryById } from "@/data/industries";
import type { JobFull } from "@/data/jobs";

/**
 * THẺ ĐƠN HÀNG — dựng theo đúng ảnh mẫu 02-don-hang.
 *
 * Luật đồng bộ (trước đây hỏng chỗ này, mỗi thẻ một chiều cao):
 *   - ảnh LUÔN 16:9, không đặt chiều cao cứng khác nhau giữa thẻ thường và
 *     thẻ nổi bật;
 *   - thân thẻ là cột co giãn, tiêu đề kẹp đúng hai dòng bằng chiều cao tối
 *     thiểu nên khối dưới luôn bắt đầu cùng một mức;
 *   - hàng nút đẩy xuống đáy bằng mt-auto, nên mọi thẻ trong một hàng kết
 *     thúc thẳng nhau dù chữ dài ngắn khác nhau.
 *
 * Nhãn: NỔI BẬT góc trái, cờ Đức + thành phố góc phải — không chồng hai nhãn
 * lên nhau ở cùng một góc như bản trước.
 */
export function JobCard({ job, lon = false }: { job: JobFull; lon?: boolean }) {
  const nganh = industryById(job.industryId);

  return (
    <NavLink
      href={`/don-hang/${job.slug}`}
      className="nb-card group flex h-full flex-col overflow-hidden"
      aria-label={`${job.title} tại ${job.city}`}
    >
      <span className={`relative block overflow-hidden ${lon ? "aspect-[21/9]" : "aspect-video"}`}>
        <Image
          src={job.image}
          alt=""
          fill
          sizes={lon ? "(min-width:1280px) 840px, 100vw" : "(min-width:1280px) 420px, 100vw"}
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.05]"
        />
        {/* KHÔNG phủ lớp màu lên ảnh — luật của Sếp. Tiêu đề thẻ nằm DƯỚI
            ảnh, còn mấy nhãn góc đều đã có nền viên riêng của chúng, nên dải
            chuyển tiếp phủ 54% tấm ảnh là thừa. */}

        {/* góc trái: trạng thái đơn */}
        {job.isSample ? (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--nb-cyan)]/90 px-2.5 py-1 text-[12px] font-bold text-white">
            MẪU
          </span>
        ) : (
          lon && job.featured && (
            <span className="absolute top-3 left-3 rounded-full bg-[var(--nb-gold)] px-2.5 py-1 text-[12px] font-bold tracking-[0.05em] text-[var(--nb-navy-900)]">
              NỔI BẬT
            </span>
          )
        )}

        {/* góc phải: cờ Đức + thành phố, đúng mô-típ ảnh mẫu */}
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-[var(--nb-navy-900)]/80 px-2.5 py-1 text-[13px] font-semibold text-white backdrop-blur-sm">
          <span className="nb-co-duc h-[9px] w-[14px]" aria-hidden="true">
            <span style={{ background: "#111" }} />
            <span style={{ background: "#d00" }} />
            <span style={{ background: "#fc0" }} />
          </span>
          {job.city}
        </span>

        {nganh && (
          <span className="absolute bottom-3 left-3 rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/78 px-3 py-1 text-[13px] font-semibold text-[var(--nb-gold-soft)] backdrop-blur-sm">
            {nganh.titleVi}
          </span>
        )}
      </span>

      <span className="flex flex-1 flex-col p-5">
        <b
          className={`block leading-snug font-semibold text-white ${
            lon ? "text-[21px]" : "min-h-[2.6em] text-[16.5px]"
          } [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]`}
        >
          {job.title}
        </b>
        <span className="mt-1 block truncate text-[12.5px] text-[var(--nb-text-mute)]">
          {tenNhaTuyenDung(job)}
        </span>

        {/* Mức lương bên trái, số suất bên phải — đúng bố cục ảnh mẫu */}
        <span className="mt-3 flex items-end justify-between gap-3">
          <b className="nb-display block text-[19px] leading-none font-bold text-[var(--nb-gold-strong)]">
            {chuoiLuong(job)}
          </b>
          <span className="shrink-0 text-right leading-tight">
            <span className="block text-[12px] text-[var(--nb-text-mute)] lg:text-[12px]">Số lượng</span>
            <b className="block text-[14px] font-semibold text-white">{job.vacancies} người</b>
          </span>
        </span>

        <span className="mt-2.5 flex items-center gap-1.5 text-[12.5px] text-[var(--nb-text-dim)]">
          <MapPin size={13} className="shrink-0 text-[var(--nb-gold)]" />
          <span className="truncate">{noiLamViec(job)}</span>
        </span>

        {/* Hàng nút luôn ở đáy: các thẻ cùng hàng kết thúc thẳng nhau */}
        <span className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="flex flex-wrap gap-1.5">
            {[`Tiếng ${job.languageLevel}`, job.employmentType].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--nb-line-soft)] px-2.5 py-1 text-[13px] text-[var(--nb-text-dim)]"
              >
                {t}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--nb-gold)]/55 px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--nb-gold-soft)] transition group-hover:bg-[var(--nb-gold)] group-hover:text-[var(--nb-navy-900)]">
            Xem chi tiết
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </NavLink>
  );
}
