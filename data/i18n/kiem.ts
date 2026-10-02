import { choThieuDonHang } from "./jobs";
import { choThieuNganh } from "./industries";

/**
 * Sổ đăng ký mọi bộ bản dịch dữ liệu. Thêm bộ mới (articles, ausbildung,
 * journey...) thì thêm hàm choThieu*() của nó vào đây — scripts/kiem-ban-dich.mjs
 * (chạy tự động trước `npm run build`) sẽ đỏ nếu còn thiếu.
 */
export function kiemTatCaBanDich(): { bo: string; thieu: string[] }[] {
  return [
    { bo: "industries", thieu: choThieuNganh() },
    { bo: "jobs", thieu: choThieuDonHang() },
  ];
}
