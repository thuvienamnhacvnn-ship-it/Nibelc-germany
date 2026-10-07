"use server";

import { revalidatePath } from "next/cache";
import { canhCong, lamMoiTrang, type KetQua } from "@/lib/quan-tri/chung";
import { chuanNoiDung, laKhoaNoiDung, mucNoiDung, type KhoaNoiDung, type NoiDungLuu } from "@/lib/quan-tri/noi-dung";
import { luuNoiDung } from "@/lib/quan-tri/noi-dung-csdl";

/**
 * VIỆC CỦA NỘI DUNG TRANG — chữ và ảnh banner.
 *
 * Chỉ nhận khoá CÓ TRONG DANH MỤC (lib/quan-tri/noi-dung.ts). Bảng `noi_dung`
 * còn chứa `he-thong.mat-khau`; khoá đó không có trong danh mục nên không
 * form nào ghi đè hay xoá được nó qua đường này.
 */

const LOI_MAY_CHU = "Máy chủ đang trục trặc, chưa làm được. Thử lại sau ít phút.";

function lamMoi(khoa: KhoaNoiDung) {
  const trang = mucNoiDung(khoa).trang;
  lamMoiTrang(trang);
  // banner cẩm nang dùng chung cho mọi trang bài
  if (trang === "/cam-nang") revalidatePath("/cam-nang/[bai]", "page");
}

/**
 * Lưu một mục. `giaTri` THAY HẲN bản đã lưu: trường nào không có trong đó thì
 * web dùng mặc định.
 */
export async function viecLuuNoiDung(khoa: string, giaTri: NoiDungLuu): Promise<KetQua> {
  await canhCong();
  if (!laKhoaNoiDung(khoa)) return { loi: "Mục nội dung này không tồn tại." };
  const sach = chuanNoiDung(khoa, giaTri);
  if (!sach.ok) return { loi: sach.loi };
  try {
    await luuNoiDung(khoa, sach.giaTri);
  } catch (e) {
    console.error("[viec-noi-dung] lưu lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
  lamMoi(khoa);
  return { xong: sach.rong ? "Đã lưu — mục này đang dùng toàn bộ giá trị mặc định." : "Đã lưu." };
}

/** Bỏ mọi sửa đổi của một mục → web về đúng chữ và ảnh mặc định. */
export async function viecMacDinhNoiDung(khoa: string): Promise<KetQua> {
  await canhCong();
  if (!laKhoaNoiDung(khoa)) return { loi: "Mục nội dung này không tồn tại." };
  try {
    await luuNoiDung(khoa, null);
  } catch (e) {
    console.error("[viec-noi-dung] về mặc định lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
  lamMoi(khoa);
  return { xong: "Đã đưa về mặc định. Vẫn khôi phục được bản vừa bỏ ở mục Nhật ký." };
}
