import { redirect } from "next/navigation";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { lietKeNhatKy } from "@/lib/quan-tri/nhat-ky";
import { DauTrang } from "../_chung/DauTrang";
import { banGhiConLai } from "../_chung/con-lai";
import { NhatKyDayDu } from "./DongThoiGian";

export const dynamic = "force-dynamic";

/**
 * NHẬT KÝ THAY ĐỔI.
 *
 * Cả đội dùng chung một tài khoản nên không biết AI sửa. Bù lại ở đây giữ bản
 * TRƯỚC khi sửa, nên xoá nhầm hay gõ sai giá vẫn lấy lại được.
 */
export default async function TrangNhatKy() {
  if (!(await daVao())) redirect("/admin");
  const [ds, conLai] = await Promise.all([lietKeNhatKy(200), banGhiConLai()]);

  return (
    <>
      <DauTrang
        tieuDe="Nhật ký"
        phu="200 thay đổi gần nhất. Cả đội dùng chung một tài khoản nên nhật ký không ghi tên người — chỉ ghi việc gì, ở đâu, lúc nào."
      />
      <main className="qt-khung">
        <NhatKyDayDu ds={ds} conLai={conLai} nay={new Date().toISOString()} />
      </main>
    </>
  );
}
