import { redirect } from "next/navigation";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { lietKeNoiDung } from "@/lib/quan-tri/noi-dung-csdl";
import { DauTrang } from "../_chung/DauTrang";
import { DanhSachNoiDung } from "./DanhSachNoiDung";

export const dynamic = "force-dynamic";

export default async function TrangNoiDung() {
  if (!(await daVao())) redirect("/admin");
  const ds = await lietKeNoiDung();
  return (
    <>
      <DauTrang tieuDe="Banner & nội dung" phu="Ảnh và chữ ở đầu mỗi trang của web. Sửa xong bấm Lưu là web đổi ngay." />
      <main className="qt-khung">
        <DanhSachNoiDung ds={ds} />
      </main>
    </>
  );
}
