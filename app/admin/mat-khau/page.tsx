import { redirect } from "next/navigation";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { DauTrang } from "../_chung/DauTrang";
import { FormMatKhau } from "./FormMatKhau";

export const dynamic = "force-dynamic";

/** ĐỔI MẬT KHẨU — việc ở máy chủ có từ trước, trang này chỉ là form cho nó. */
export default async function TrangMatKhau() {
  if (!(await daVao())) redirect("/admin");
  return (
    <>
      <DauTrang tieuDe="Đổi mật khẩu" phu="Mật khẩu này cả đội dùng chung. Đổi xong, mọi máy đang đăng nhập sẽ bị thoát ra." />
      <main className="qt-khung">
        <FormMatKhau />
      </main>
    </>
  );
}
