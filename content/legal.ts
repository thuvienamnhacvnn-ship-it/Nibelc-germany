/**
 * Dữ liệu pháp nhân, lấy từ ấn phẩm chính thức của công ty
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
  street: "Potsdamer Platz 10",
  postalCode: "10785",
  city: "Berlin",
  country: "Deutschland",
  email: "info@nibelc-germany.de",
  phone: "+49 30 263 987 650",
  groupWebsite: "https://www.nibelcgroup.com.vn",

  handelsregister: null,
  hrb: null,
  geschaeftsfuehrer: null,
  ustIdNr: null,
};

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
