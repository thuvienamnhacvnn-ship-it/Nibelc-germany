import { daVao } from "@/lib/quan-tri/dang-nhap";
import { cungNguon, lamMoiTatCa } from "@/lib/quan-tri/chung";
import { DUNG_LUONG_TOI_DA, thayAnh } from "@/lib/quan-tri/kho-anh";

/**
 * THAY FILE CỦA MỘT ẢNH — POST /admin/api/anh/<id>, multipart, trường `tep`.
 * Giữ nguyên id; file ra tên mới và mọi nơi đang dùng ảnh được trỏ sang tên
 * mới (xem thayAnh). Là route handler vì cùng lý do với tải lên: file > 1 MB.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loi = (ma: number, chu: string) => Response.json({ loi: chu }, { status: ma });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await daVao())) return loi(401, "Chưa đăng nhập.");
  if (!cungNguon(req.headers)) return loi(403, "Yêu cầu không đến từ trang quản trị.");
  // + 1 MB cho phần vỏ multipart
  if (Number(req.headers.get("content-length") ?? 0) > DUNG_LUONG_TOI_DA + 1048576) {
    return loi(413, "File nặng quá 15 MB.");
  }
  const { id } = await params;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return loi(400, "Không đọc được dữ liệu gửi lên.");
  }
  const f = form.get("tep");
  if (!f || typeof f === "string") return loi(400, "Chưa chọn ảnh thay thế.");

  try {
    const r = await thayAnh(id, Buffer.from(await f.arrayBuffer()), f.name);
    if (!r.ok) return loi(r.loi.includes("không còn") ? 404 : 400, r.loi);
    // ảnh này có thể đang nằm ở bất kỳ trang nào
    lamMoiTatCa();
    return Response.json({ anh: r.anh, soNoiCapNhat: r.soNoiCapNhat });
  } catch (e) {
    console.error("[api/anh] thay ảnh lỗi:", id, e);
    return loi(500, "Máy chủ không thay được ảnh. Thử lại sau ít phút.");
  }
}
