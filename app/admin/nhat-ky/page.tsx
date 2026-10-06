import { redirect } from "next/navigation";
import { hoi } from "@/lib/db";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { Dinh } from "../Dinh";
import { NutKhoiPhuc } from "./NutKhoiPhuc";

export const dynamic = "force-dynamic";

type Muc = {
  id: string;
  luc: string;
  viec: string;
  bang: string;
  ban_ghi: string | null;
  co_truoc: boolean;
  ten: string | null;
};

/**
 * NHẬT KÝ THAY ĐỔI.
 *
 * Cả đội dùng chung một tài khoản nên không biết AI sửa. Bù lại ở đây giữ bản
 * TRƯỚC khi sửa, nên xoá nhầm hay gõ sai giá vẫn lấy lại được.
 */
export default async function TrangNhatKy() {
  if (!(await daVao())) redirect("/admin");

  const ds = await hoi<Muc>(
    `select id::text, luc, viec, bang, ban_ghi,
            (truoc is not null) as co_truoc,
            coalesce(truoc->'du_lieu'->>'title', truoc->>'slug', sau->>'slug') as ten
       from nhat_ky order by luc desc limit 200`,
  );

  const chu: Record<string, string> = {
    them: "Thêm mới", sua: "Sửa", xoa: "Xoá", hien: "Cho hiện", an: "Ẩn đi",
  };

  return (
    <>
      <Dinh o="nhat-ky" />
      <div className="qt-khung">
        <h1>Nhật ký</h1>
        <p className="qt-phu">200 thay đổi gần nhất. Mục nào có bản cũ thì khôi phục lại được.</p>
        <div className="qt-tam">
          <div className="qt-cuon">
            <table className="qt-bang">
              <thead>
                <tr><th>Lúc</th><th>Việc</th><th>Đối tượng</th><th></th></tr>
              </thead>
              <tbody>
                {ds.map((m) => (
                  <tr key={m.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--qt-mo)" }}>
                      {new Date(m.luc).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{chu[m.viec] ?? m.viec}</td>
                    <td>
                      {m.ten ?? m.ban_ghi ?? "—"}
                      <div style={{ fontSize: 12, color: "var(--qt-mo)" }}>{m.bang}</div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {m.co_truoc && m.bang === "don_hang" && <NutKhoiPhuc id={Number(m.id)} ten={m.ten ?? m.ban_ghi ?? ""} />}
                    </td>
                  </tr>
                ))}
                {ds.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 28, textAlign: "center", color: "var(--qt-mo)" }}>Chưa có thay đổi nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
