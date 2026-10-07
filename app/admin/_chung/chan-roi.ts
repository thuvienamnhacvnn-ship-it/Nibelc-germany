"use client";

import { useEffect } from "react";
import { useHoi } from "./HopXacNhan";

/**
 * CHẶN RỜI TRANG KHI FORM CHƯA LƯU.
 *
 * Một biến dùng chung thay vì context: nơi đặt cờ (form) và nơi đọc cờ (thanh
 * bên trong khung) không cùng nhánh cây, mà cờ đổi cũng không cần vẽ lại gì.
 *
 * Ba đường rời trang, ba cách chặn:
 *   - bấm liên kết trong admin  → Khung.tsx bắt cú bấm, hỏi lại
 *   - đóng / tải lại tab        → `beforeunload`, trình duyệt tự hỏi
 *   - nút LÙI của trình duyệt   → "mốc giữ chân" trong lịch sử (dưới đây)
 */
let chuaLuu = false;
/** đã cắm mốc giữ chân vào lịch sử cho trang hiện tại chưa */
let daCamMoc = false;

export const coChuaLuu = () => chuaLuu;
export const datChuaLuu = (b: boolean) => {
  chuaLuu = b;
};

/**
 * Cắm thêm MỘT mục lịch sử trùng địa chỉ trang hiện tại. Trình duyệt không cho
 * huỷ cú bấm Lùi, nhưng Lùi từ mốc này chỉ rơi về chính trang đang đứng — form
 * vẫn nguyên — và ta kịp hỏi lại. Giữ nguyên `history.state` vì Next cất trạng
 * thái bộ định tuyến ở đó; thay bằng thứ khác là Next tải lại cả trang.
 */
function camMoc() {
  if (daCamMoc) return;
  window.history.pushState(window.history.state, "", window.location.href);
  daCamMoc = true;
}

/** Form gọi cái này với `true` khi đang có thay đổi chưa lưu. */
export function useChanRoi(doi: boolean) {
  const hoi = useHoi();

  useEffect(() => {
    chuaLuu = doi;
    if (!doi) return;
    camMoc();
    // đóng / tải lại tab: trình duyệt tự hiện hộp hỏi của nó
    const truocKhiRoi = (e: BeforeUnloadEvent) => e.preventDefault();
    const lui = () => {
      // vừa lùi khỏi mốc giữ chân, vẫn đang ở đúng trang này
      daCamMoc = false;
      if (!chuaLuu) return;
      camMoc(); // cắm lại ngay: bấm Lùi lần nữa trong lúc hộp đang mở cũng không lọt
      hoi({
        tieuDe: "Rời trang mà chưa lưu?",
        moTa: "Những thay đổi vừa nhập sẽ mất.",
        nutHuy: "Ở lại",
        nutXacNhan: "Rời trang, bỏ thay đổi",
        onXacNhan: () => {
          chuaLuu = false;
          daCamMoc = false;
          // lùi hai bước: một bước qua mốc giữ chân, một bước mới thật sự rời trang
          window.history.go(-2);
        },
      });
    };
    window.addEventListener("beforeunload", truocKhiRoi);
    window.addEventListener("popstate", lui);
    return () => {
      window.removeEventListener("beforeunload", truocKhiRoi);
      window.removeEventListener("popstate", lui);
      chuaLuu = false;
    };
  }, [doi, hoi]);

  // rời hẳn form (chuyển trang) thì mốc của trang cũ không còn nghĩa
  useEffect(
    () => () => {
      daCamMoc = false;
    },
    [],
  );
}
