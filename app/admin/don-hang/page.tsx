import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { lietKeDonHang } from "@/lib/quan-tri/don-hang";
import { INDUSTRIES } from "@/data/industries";
import { DauTrang } from "../_chung/DauTrang";
import { DUONG } from "../_chung/duong";
import { DanhSachDon } from "./DanhSachDon";

/* Trang quản trị đọc thẳng CSDL mỗi lần mở — không được giữ bản dựng sẵn,
   nếu không nhân viên vừa sửa xong, quay lại danh sách vẫn thấy số cũ. */
export const dynamic = "force-dynamic";

const mot = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x);

export default async function TrangDonHang({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await daVao())) redirect("/admin");
  const [don, tham] = await Promise.all([lietKeDonHang(), searchParams]);
  const hien = don.filter((d) => d.hien).length;
  const tt = mot(tham.tt);
  const loc = mot(tham.loc);

  return (
    <>
      <DauTrang tieuDe="Đơn hàng" phu={`${don.length} đơn · ${hien} đang hiện trên web · ${don.length - hien} đang ẩn`}>
        <Link href={DUONG.donMoi} className="qt-nut qt-chinh">
          <Plus aria-hidden />
          Thêm đơn hàng
        </Link>
      </DauTrang>
      <main className="qt-khung">
        <DanhSachDon
          // đổi tham số lọc trên thanh địa chỉ (bấm từ Tổng quan) thì dựng lại với bộ lọc mới
          key={`${tt ?? ""}|${loc ?? ""}`}
          don={don}
          nganhNghe={INDUSTRIES.map((n) => ({ id: n.id, ten: n.titleVi }))}
          ttDau={tt === "hien" || tt === "an" ? tt : undefined}
          locDau={loc === "chua-anh" || loc === "chua-en" || loc === "chua-de" ? loc : undefined}
        />
      </main>
    </>
  );
}
