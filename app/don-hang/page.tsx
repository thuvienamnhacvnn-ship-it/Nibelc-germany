import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { Shell } from "@/components/v2/Shell";
import { DonHangList } from "@/components/v2/DonHangList";
import { Icon } from "@/components/ui/Icon";
import { DON_HANG, cacNuoc, tongSuat } from "@/content/don-hang";

export const metadata: Metadata = {
  title: "Đơn hàng đang tuyển — làm việc tại Đức và châu Âu",
  description:
    "Các đơn hàng NIBELC đang tuyển tại Đức, Áo, Hy Lạp, Albania và Litva — kèm vị trí, mức thu nhập, số suất và điều kiện theo từng thông báo tuyển dụng.",
};

export default function Page() {
  const tongDon = DON_HANG.length;
  const nuocs = cacNuoc();
  const tongSuatTatCa = DON_HANG.map(tongSuat).filter((n): n is number => n !== null).reduce((a, b) => a + b, 0);

  return (
    <Shell trang="don-hang">
      {/* ---------------- ĐẦU TRANG ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--v2-troi-nhat)] to-white">
        <span
          className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, var(--v2-troi) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-[1480px] px-5 py-12 lg:px-8 lg:py-16">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[13px] text-[var(--v2-chu-nhat)]">
            <Link href={"/" as Route} className="hover:text-[var(--v2-xanh)]">Trang chủ</Link>
            <Icon name="chevronRight" className="h-3 w-3" strokeWidth={2.4} />
            <span className="text-[var(--v2-xanh)]">Đơn hàng</span>
          </nav>

          <p className="mt-6 flex items-center gap-3 text-[11.5px] font-bold tracking-[0.24em] text-[var(--v2-vang)] uppercase">
            <span className="h-[2px] w-9 bg-[var(--v2-vang)]" aria-hidden="true" />
            Đang tuyển
          </p>
          <h1 className="mt-4 max-w-[18ch] text-[34px] leading-[1.1] font-extrabold lg:text-[52px]">
            Đơn hàng <span className="v2-vang">đang tuyển</span>
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-[var(--v2-chu-nhat)] lg:text-[18px]">
            Toàn bộ vị trí, mức thu nhập, số suất và điều kiện lấy đúng theo thông báo tuyển dụng của từng đơn.
          </p>

          <ul className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
            <li>
              <b className="block text-[32px] leading-none font-extrabold text-[var(--v2-xanh)] lg:text-[40px]">{tongDon}</b>
              <span className="mt-1.5 block text-[13.5px] text-[var(--v2-chu-nhat)]">đơn hàng</span>
            </li>
            <li>
              <b className="block text-[32px] leading-none font-extrabold text-[var(--v2-xanh)] lg:text-[40px]">{nuocs.length}</b>
              <span className="mt-1.5 block text-[13.5px] text-[var(--v2-chu-nhat)]">quốc gia</span>
            </li>
            <li>
              <b className="block text-[32px] leading-none font-extrabold text-[var(--v2-xanh)] lg:text-[40px]">{tongSuatTatCa}</b>
              <span className="mt-1.5 block text-[13.5px] text-[var(--v2-chu-nhat)]">suất tuyển</span>
            </li>
          </ul>
        </div>
      </section>

      <DonHangList />
    </Shell>
  );
}
