"use server";

import { canhCong, lamMoiTatCa, type KetQua } from "@/lib/quan-tri/chung";
import { lietKeAnh, noiDungAnh, suaAnh, xoaAnh, type Anh, type LocAnh, type NoiDungAnh, type TrangAnh } from "@/lib/quan-tri/kho-anh";

/**
 * VIỆC CỦA KHO ẢNH — phần không mang file (sửa nhãn, xoá, tra nơi dùng).
 * Tải lên và thay file đi qua route /admin/api/anh vì server action chỉ nhận
 * thân yêu cầu tới 1 MB.
 */

const LOI_MAY_CHU = "Máy chủ đang trục trặc, chưa làm được. Thử lại sau ít phút.";

export async function viecSuaAnh(id: string, doi: { nhan?: string[]; tenGoc?: string }): Promise<KetQua<{ anh: Anh }>> {
  await canhCong();
  try {
    const r = await suaAnh(String(id), { nhan: doi?.nhan, tenGoc: doi?.tenGoc === undefined ? undefined : String(doi.tenGoc) });
    return r.ok ? { xong: "Đã lưu.", anh: r.anh } : { loi: r.loi };
  } catch (e) {
    console.error("[viec-anh] sửa lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

/**
 * Xoá ảnh. Ảnh đang được dùng thì KHÔNG xoá mà trả `dangDung` để giao diện
 * hỏi lại; gọi lần hai với `buoc = true` mới xoá thật.
 */
export async function viecXoaAnh(id: string, buoc = false): Promise<{ xong: string } | { loi: string; dangDung?: NoiDungAnh[] }> {
  await canhCong();
  try {
    const r = await xoaAnh(String(id), buoc === true);
    if (!r.ok) return { loi: r.loi, dangDung: r.dangDung };
    lamMoiTatCa();
    return { xong: "Đã xoá ảnh." };
  } catch (e) {
    console.error("[viec-anh] xoá lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

/** Ảnh đang được dùng ở những đâu. */
export async function viecNoiDungAnh(id: string): Promise<NoiDungAnh[]> {
  await canhCong();
  return noiDungAnh(String(id));
}

/** Liệt kê ảnh cho hộp chọn ảnh phía client. */
export async function viecLietKeAnh(loc: LocAnh = {}): Promise<TrangAnh> {
  await canhCong();
  return lietKeAnh({
    nhan: typeof loc?.nhan === "string" ? loc.nhan : undefined,
    tim: typeof loc?.tim === "string" ? loc.tim : undefined,
    trang: Number(loc?.trang) || undefined,
    moiTrang: Number(loc?.moiTrang) || undefined,
  });
}
