import { revalidatePath } from "next/cache";
import { daVao } from "@/lib/quan-tri/dang-nhap";

/**
 * ĐỒ DÙNG CHUNG CỦA MỌI VIỆC GHI DỮ LIỆU (server action + route handler).
 *
 * Tách ra khỏi app/admin/viec.ts vì file "use server" chỉ được export hàm
 * async chạy như một điểm vào HTTP — để `canhCong` ở đó thì các file
 * viec-*.ts khác không dùng lại được, mỗi file lại chép một bản.
 */

/**
 * Kết quả chung của server action: hoặc báo lỗi, hoặc báo xong.
 * Phân nhánh bằng `if (r.loi)` — hai nhánh khai chéo khoá của nhau là
 * `undefined` để đọc thẳng `r.loi` / `r.xong` được mà không cần `in`.
 */
export type KetQua<T extends object = object> = { loi: string; xong?: undefined } | ({ xong: string; loi?: undefined } & T);

/**
 * Chặn cổng. MỌI hàm ghi dữ liệu gọi cái này ở DÒNG ĐẦU: server action là một
 * điểm vào HTTP riêng, ai biết tên hàm là gọi thẳng được, trang có chặn cũng
 * không cứu.
 */
export async function canhCong() {
  if (!(await daVao())) throw new Error("Chưa đăng nhập");
}

/** Sau khi sửa dữ liệu phải dựng lại trang công khai, nếu không web vẫn trả
    bản cũ đã lưu sẵn và nhân viên tưởng mình sửa hụt. Dựng cho cả ba ngôn ngữ. */
export function lamMoiTrang(...duongDan: string[]) {
  for (const d of duongDan) {
    for (const tien of ["", "/en", "/de"]) {
      revalidatePath(`${tien}${d}`);
    }
  }
}

/**
 * Dựng lại TOÀN BỘ web. Dùng khi một thay đổi có thể ló ra ở bất kỳ trang nào
 * — thay hay xoá một ảnh trong kho là vậy: ảnh đó có thể đang nằm ở banner,
 * ở đơn hàng, ở bài viết, không đáng đi dò từng trang.
 */
export function lamMoiTatCa() {
  revalidatePath("/", "layout");
}

/**
 * Yêu cầu có đến từ chính trang mình không (chống giả mạo yêu cầu từ trang
 * khác). Server action được Next kiểm sẵn kiểu này; route handler thì KHÔNG,
 * nên các route ghi dữ liệu phải tự gọi.
 *
 * So `Origin` với `x-forwarded-host` (nginx gắn) rồi mới tới `host` — đúng
 * cách Next so cho server action, nên cấu hình nginx nào đang chạy được server
 * action thì cũng chạy được route này. Trình duyệt luôn gửi `Origin` với POST;
 * thiếu hẳn header (curl, script nội bộ) thì cho qua vì đã có cookie phiên
 * `sameSite=lax` chặn đường giả mạo từ trang ngoài.
 */
export function cungNguon(h: Headers): boolean {
  const origin = h.get("origin");
  if (!origin || origin === "null") return origin !== "null";
  let may: string;
  try {
    may = new URL(origin).host;
  } catch {
    return false;
  }
  const chuyenTiep = (h.get("x-forwarded-host") ?? "").split(",")[0]?.trim();
  return may === (chuyenTiep || h.get("host"));
}
