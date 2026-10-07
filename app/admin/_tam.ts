"use server";

import { hoiMot } from "@/lib/db";
import { canhCong, type KetQua } from "@/lib/quan-tri/chung";
import { viecKhoiPhuc } from "./viec";

/**
 * LỚP TẠM của dev giao diện — những việc giao diện cần mà hợp đồng
 * `_w-agent/01_api.md` CHƯA có. Mỗi hàm ghi rõ TODO; khi dev hệ thống bổ sung
 * hàm chính thức thì đổi nơi gọi sang hàm đó rồi xoá hàm ở đây.
 */

/**
 * Hoàn tác một lần XOÁ vừa xong (nút "Hoàn tác" trên toast).
 *
 * TODO(dev hệ thống): `viecXoaDonHang` / `viecXoaBaiViet` nên trả về
 * `nhatKyId` của dòng nhật ký vừa sinh để giao diện gọi thẳng `viecKhoiPhuc`.
 * Hiện chúng không trả, nên ở đây phải tra lại dòng "xoa" mới nhất của đúng
 * bản ghi đó rồi mới khôi phục. Không tự ghi gì vào CSDL — việc khôi phục vẫn
 * do `viecKhoiPhuc` làm.
 */
export async function viecHoanTacXoa(bang: "don_hang" | "bai_viet", id: string): Promise<KetQua> {
  await canhCong();
  if (bang !== "don_hang" && bang !== "bai_viet") return { loi: "Mục này không hoàn tác được." };
  const n = await hoiMot<{ id: string }>(
    "select id::text from nhat_ky where viec = 'xoa' and bang = $1 and ban_ghi = $2 order by luc desc, id desc limit 1",
    [bang, String(id)],
  );
  if (!n) return { loi: "Không tìm thấy bản đã xoá trong nhật ký." };
  const r = await viecKhoiPhuc(Number(n.id));
  // bản cũ của viecKhoiPhuc không trả gì khi thành công
  return r && "loi" in r && r.loi ? { loi: r.loi } : { xong: "Đã khôi phục." };
}
