import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/v2/Shell";
import { DonHangChiTiet } from "@/components/v2/DonHangChiTiet";
import { DON_HANG, donTheoId, tongSuat } from "@/content/don-hang";

export const dynamicParams = false;

export function generateStaticParams() {
  return DON_HANG.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = donTheoId(id);
  if (!d) return {};
  const suat = tongSuat(d);
  return {
    title: `${d.tieuDe} — tuyển ${suat ?? ""} người`.trim(),
    description: [
      d.tieuDe,
      d.noiLamViec && `Nơi làm việc: ${d.noiLamViec}`,
      d.luong && `Thu nhập ${d.luong.tu}–${d.luong.den} €/tháng`,
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = donTheoId(id);
  if (!d) notFound();
  // ưu tiên đơn cùng nước, rồi tới đơn có ảnh
  const khac = DON_HANG.filter((x) => x.id !== d.id)
    .sort((a, b) => (b.nuoc === d.nuoc ? 1 : 0) - (a.nuoc === d.nuoc ? 1 : 0) || b.anh.length - a.anh.length)
    .slice(0, 3);

  return (
    <Shell trang="don-hang">
      <DonHangChiTiet d={d} khac={khac} />
    </Shell>
  );
}
