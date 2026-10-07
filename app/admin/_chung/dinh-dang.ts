/**
 * ĐỊNH DẠNG CHỮ SỐ cho trang quản trị — không đụng CSDL, dùng được ở cả máy
 * chủ lẫn trình duyệt.
 *
 * Giờ LUÔN ép múi Asia/Ho_Chi_Minh: máy chủ đặt ở Đức, để mặc định thì nhật
 * ký lệch 5–6 tiếng so với đồng hồ của nhân viên, và máy chủ với trình duyệt
 * dựng ra hai chuỗi khác nhau (lỗi hydrate).
 */

const MUI = "Asia/Ho_Chi_Minh";

/** bỏ dấu + chữ thường: để tìm "da nang" ra "Đà Nẵng" */
export function boDau(s: unknown): string {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/** "Thợ hàn MIG/MAG tại Đức" → "tho-han-mig-mag-tai-duc": đường dẫn gợi ý từ tên, tối đa 80 ký tự */
export function taoSlug(s: string): string {
  return boDau(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

const so1 = (n: number, le: number) => n.toLocaleString("vi-VN", { minimumFractionDigits: le, maximumFractionDigits: le });

/** "412 KB" · "12,4 MB" · "1,25 GB" */
export function dungLuong(byte: number): string {
  if (byte < 1048576) return `${so1(Math.max(1, Math.round(byte / 1024)), 0)} KB`;
  if (byte < 1073741824) return `${so1(byte / 1048576, 1)} MB`;
  return `${so1(byte / 1073741824, 2)} GB`;
}

export const soVN = (n: number) => n.toLocaleString("vi-VN");

function phan(iso: string | Date) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: MUI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
    hour12: false,
  }).formatToParts(new Date(iso));
  const l = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { ngay: l("day"), thang: l("month"), nam: l("year"), gio: l("hour") === "24" ? "00" : l("hour"), phut: l("minute"), giay: l("second"), thu: l("weekday") };
}

/** "14:05" */
export function gio(iso: string | Date): string {
  const p = phan(iso);
  return `${p.gio}:${p.phut}`;
}
/** "06/10/2026" */
export function ngay(iso: string | Date): string {
  const p = phan(iso);
  return `${p.ngay}/${p.thang}/${p.nam}`;
}
/** "06/10/2026 14:05" */
export const ngayGio = (iso: string | Date) => `${ngay(iso)} ${gio(iso)}`;
/** "06/10/2026 14:05:09" — cho thuộc tính title */
export function ngayGioGiay(iso: string | Date): string {
  return `${ngayGio(iso)}:${phan(iso).giay}`;
}

const THU: Record<string, string> = {
  Monday: "Thứ hai",
  Tuesday: "Thứ ba",
  Wednesday: "Thứ tư",
  Thursday: "Thứ năm",
  Friday: "Thứ sáu",
  Saturday: "Thứ bảy",
  Sunday: "Chủ nhật",
};

/** khoá ngày theo giờ Việt Nam ("2026-10-06") — để gom nhật ký theo ngày */
export function khoaNgay(iso: string | Date): string {
  const p = phan(iso);
  return `${p.nam}-${p.thang}-${p.ngay}`;
}

/** "Hôm nay" · "Hôm qua" · "Thứ ba, 06/10/2026" */
export function tieuDeNgay(iso: string | Date, nay: Date = new Date()): string {
  const k = khoaNgay(iso);
  if (k === khoaNgay(nay)) return "Hôm nay";
  if (k === khoaNgay(new Date(nay.getTime() - 86400000))) return "Hôm qua";
  return `${THU[phan(iso).thu] ?? ""}, ${ngay(iso)}`;
}

/** "Vừa xong" · "5 phút trước" · "3 giờ trước" · "Hôm qua, 14:05" · "06/10, 14:05" */
export function tuongDoi(iso: string | Date, nay: Date = new Date()): string {
  const ms = nay.getTime() - new Date(iso).getTime();
  if (ms < 60000) return "Vừa xong";
  if (ms < 3600000) return `${Math.floor(ms / 60000)} phút trước`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)} giờ trước`;
  if (khoaNgay(iso) === khoaNgay(new Date(nay.getTime() - 86400000))) return `Hôm qua, ${gio(iso)}`;
  const p = phan(iso);
  return `${p.ngay}/${p.thang}, ${gio(iso)}`;
}

/** "JPG" · "PNG" · "WebP" từ mime */
export function tenDinhDang(mime: string): string {
  const m: Record<string, string> = { "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WebP", "image/avif": "AVIF", "image/gif": "GIF" };
  return m[mime] ?? mime;
}

/** Lấy lời báo lỗi từ bất cứ thứ gì bị ném ra. */
export function chuLoi(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
