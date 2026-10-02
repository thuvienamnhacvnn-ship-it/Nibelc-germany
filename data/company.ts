/**
 * (Chuyển sang từ dự án nibel-de — cùng một pháp nhân.)
 *
 * ĐỊA CHỈ, EMAIL, ĐIỆN THOẠI: Sếp chốt ngày 02/10/2026, thay cho bộ cũ lấy
 * từ poster (Potsdamer Platz 10, 10785 Berlin, +49 30 263 987 650). Trụ sở
 * nay ở Ahrensfelde-Lindenberg thuộc Brandenburg, KHÔNG còn là Berlin — mọi
 * chỗ chép tay chữ "Berlin" đã bỏ hết.
 * Số điện thoại Sếp gửi liền một mạch "+49 15775675555"; ở đây tách nhóm
 * theo cách Đức hay viết cho số di động (đầu số 1577). Link tel: tự bỏ dấu
 * cách nên bấm vẫn ra đúng số.
 *
 * Phần còn lại (tên pháp nhân, khẩu hiệu) vẫn lấy từ ấn phẩm chính thức
 * (E:\Works\itw\Nibelc DE\3fc212dc-…jpg — poster "Arbeiten in Deutschland
 * mit Nibelc Germany GmbH", và ba tin tuyển dụng cùng bộ).
 *
 * QUAN TRỌNG: mục CAN DIEN 01 vẫn CHƯA đủ để publish Impressum.
 * §5 TMG bắt buộc phải có thêm Handelsregister + HRB, người đại diện
 * (Geschäftsführer) và USt-IdNr. Ba thứ đó không có trên poster, nên
 * `impressumComplete` để false và trang /impressum chưa publish.
 */

export interface LegalEntity {
  /** Tên pháp nhân đầy đủ */
  name: string;
  /** Loại hình — đã có trong tên */
  rechtsform: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  /** Website nhóm công ty (Việt Nam) */
  groupWebsite: string;

  /** Chưa có — cần cho Impressum hợp lệ */
  handelsregister: null;
  hrb: null;
  geschaeftsfuehrer: null;
  ustIdNr: null;
}

export const LEGAL: LegalEntity = {
  name: "NIBELC Germany GmbH",
  rechtsform: "Gesellschaft mit beschränkter Haftung (GmbH)",
  street: "Dietrichstraße 16",
  postalCode: "16356",
  city: "Ahrensfelde-Lindenberg",
  country: "Germany",
  email: "info@nibelcgermany.de",
  phone: "+49 1577 5675555",
  groupWebsite: "https://www.nibelcgroup.com.vn",

  handelsregister: null,
  hrb: null,
  geschaeftsfuehrer: null,
  ustIdNr: null,
};

/**
 * TOẠ ĐỘ TRỤ SỞ — để ở ĐÂY, ngay cạnh địa chỉ, không rải trong component.
 *
 * Toạ độ là SỐ TRẦN: đổi địa chỉ xong grep chữ sạch bong mà bản đồ vẫn chỉ
 * sang chỗ cũ, vì trong chuỗi bbox không có chữ "Berlin" hay "Potsdamer" nào
 * để mà bắt. Đã dính đúng một lần ngày 02/10/2026: mọi chữ đã đổi sang
 * Ahrensfelde-Lindenberg nhưng bản đồ /lien-he vẫn cắm cờ ở Potsdamer Platz.
 *
 * Tra từ OpenStreetMap Nominatim, way 397158792 — "16, Dietrichstraße,
 * Lindenberg, Ahrensfelde, Barnim, Brandenburg, 16356". KHÔNG tự đoán.
 * Đổi địa chỉ thì phải tra lại cả hai hằng số dưới đây.
 */
export const TOA_DO = { lat: 52.5970657, lon: 13.5587157 } as const;

/** Khung bản đồ "tây,nam,đông,bắc" ôm quanh trụ sở. */
export const KHUNG_BAN_DO = "13.5527,52.5941,13.5647,52.6001";

/** Khẩu hiệu trên ấn phẩm chính thức. */
export const BRAND_CLAIMS = {
  groupTagline: "Dynamic Manpower for Creative Desires",
  motto: "People Connecting Opportunities",
} as const;

/**
 * Impressum chỉ được publish khi đủ cả bốn trường bắt buộc còn thiếu.
 * Hàm này là thứ duy nhất được phép quyết định điều đó.
 */
export function impressumComplete(): boolean {
  return (
    LEGAL.handelsregister !== null &&
    LEGAL.hrb !== null &&
    LEGAL.geschaeftsfuehrer !== null &&
    LEGAL.ustIdNr !== null
  );
}

/** Liệt kê chính xác những gì còn thiếu, dùng cho admin và cho báo cáo. */
export function impressumMissing(): string[] {
  const missing: string[] = [];
  if (LEGAL.handelsregister === null)
    missing.push("Handelsregistergericht (toà đăng ký thương mại)");
  if (LEGAL.hrb === null) missing.push("HRB-Nummer (số đăng ký)");
  if (LEGAL.geschaeftsfuehrer === null)
    missing.push("Geschäftsführer / người đại diện theo pháp luật");
  if (LEGAL.ustIdNr === null)
    missing.push("USt-IdNr. (mã số thuế GTGT, nếu có)");
  return missing;
}
