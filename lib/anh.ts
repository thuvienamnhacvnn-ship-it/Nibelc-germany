/**
 * ĐƯỜNG DẪN ẢNH — dùng được ở cả máy chủ lẫn trình duyệt (không đụng CSDL,
 * không đụng ổ đĩa).
 *
 * Ảnh trên web đến từ đúng HAI chỗ:
 *   /assets/...   ảnh tĩnh đi theo mã nguồn (public/assets)
 *   /kho/<tep>    ảnh nhân viên tải lên, nằm ở kho NGOÀI thư mục app
 *
 * Mọi giá trị ảnh nhân viên nhập đều đi qua `anhHopLe`. Không kiểm thì một
 * đường dẫn gõ sai ("anh.jpg" thiếu gạch chéo đầu, hay một link ngoài) lọt
 * xuống `next/image` — nó ném lỗi lúc dựng trang và cả trang trả 500.
 */

export const TIEN_TO_KHO = "/kho/";

const RE_ANH = /^\/(kho|assets)\/[A-Za-z0-9][A-Za-z0-9._/-]*\.(jpe?g|png|webp|avif|gif)$/;

/** true khi `s` là đường dẫn ảnh nội bộ dùng được (kho hoặc assets). */
export function anhHopLe(s: unknown): s is string {
  return typeof s === "string" && s.length <= 300 && RE_ANH.test(s) && !s.includes("..");
}

/** Tên file trong kho: 24 ký tự hex sinh ngẫu nhiên + đuôi theo loại ảnh. */
export const RE_TEP_KHO = /^[a-f0-9]{24}\.(jpg|png|webp|avif|gif)$/;

/** URL công khai của một file trong kho. */
export function urlKho(tep: string): string {
  return `${TIEN_TO_KHO}${tep}`;
}
