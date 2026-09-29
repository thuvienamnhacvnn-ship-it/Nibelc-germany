import duLieu from "@/content/don-hang.json";

/**
 * ĐƠN HÀNG — kho dữ liệu thật, sinh từ `E:\Works\itw\QUANG CAO` bằng
 * `scripts/nap-don-hang.mjs`. Đổi kho thì chạy lại script, không sửa tay.
 *
 * Những gì KHÔNG có ở đây vì không được đăng: phí, cọc, chứng minh tài chính,
 * số điện thoại nhân viên, và điều kiện tuổi / giới tính / chiều cao / cân
 * nặng (luật AGG của Đức cấm nêu trong tin tuyển dụng).
 */

export interface ViTri {
  ten: string;
  soNguoi: number | null;
  thuNhap: string | null;
  tu: number | null;
  den: number | null;
}

export interface DonHang {
  id: string;
  ma: string;
  nuoc: string;
  tieuDe: string;
  soLuong: string | null;
  noiLamViec: string | null;
  gioLam: number | null;
  luong: { tu: number; den: number } | null;
  viTri: ViTri[];
  congViec: string[];
  quyenLoi: string[];
  dieuKien: string[];
  anh: string[];
  toDon: string[];
  soAnhGoc: number;
}

export const DON_HANG = duLieu as DonHang[];

/** Cờ ba dải của từng nước, vẽ bằng CSS nên không cần thêm file ảnh */
export const CO_NUOC: Record<string, string[]> = {
  "Đức": ["#111111", "#dd0000", "#ffce00"],
  "Áo": ["#ed2939", "#ffffff", "#ed2939"],
  "Hy Lạp": ["#0d5eaf", "#ffffff", "#0d5eaf"],
  "Albania": ["#e41e20", "#b91719", "#e41e20"],
  "Litva": ["#fdb913", "#006a44", "#c1272d"],
};

/**
 * Tên vị trí bỏ phần ghi giới tính.
 * Tin gốc tiếng Việt có ghi "(Nữ)", "(Nam/ Nữ/ Cặp VC)"; tin tuyển dụng ở Đức
 * không được nêu giới tính nên cắt ở mọi bản ngôn ngữ cho nhất quán.
 */
export function tenViTri(ten: string): string {
  return ten
    .replace(/\(\s*(nam|nữ)[^)]*\)/gi, "")
    .replace(/\s*[-–]\s*(nam|nữ)\b[^,]*/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.)])/g, "$1")
    .trim();
}

/** Tổng số suất của một đơn, cộng từ các vị trí có khai số người */
export function tongSuat(d: DonHang): number | null {
  const s = d.viTri.map((v) => v.soNguoi).filter((n): n is number => typeof n === "number");
  return s.length ? s.reduce((a, b) => a + b, 0) : null;
}

/** Các nước đang có đơn, kèm số đơn */
export function cacNuoc(): { ten: string; co: string[]; soDon: number }[] {
  const m = new Map<string, number>();
  for (const d of DON_HANG) m.set(d.nuoc, (m.get(d.nuoc) ?? 0) + 1);
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ten, soDon]) => ({ ten, co: CO_NUOC[ten] ?? ["#888", "#aaa", "#888"], soDon }));
}

/** Nhóm nghề suy ra từ tiêu đề đơn — dùng cho bộ lọc */
export const NHOM_NGHE: { ma: string; ten: string; tu: RegExp }[] = [
  { ma: "nha-hang", ten: "Nhà hàng, khách sạn, bếp", tu: /bếp|nhà hàng|khách sạn|spa/i },
  { ma: "thuc-pham", ten: "Chế biến thực phẩm", tu: /thịt|sữa|gà|bánh|gia vị|thực phẩm|đóng gói/i },
  { ma: "nong-nghiep", ten: "Nông nghiệp, nhà kính", tu: /nhà kính|rau|dâu|mâm xôi|trồng|thu hoạch|nông nghiệp/i },
  { ma: "co-khi-dien", ten: "Cơ khí, điện, kỹ thuật", tu: /cơ khí|điện|sơn|cáp quang|kính|xây dựng|hàn/i },
  { ma: "may-mac", ten: "May mặc, thủ công", tu: /may|nệm|bọc nội thất/i },
  { ma: "dich-vu", ten: "Dịch vụ, vệ sinh", tu: /vệ sinh|lau dọn|hút bụi|ô tô/i },
];

export function nhomCuaDon(d: DonHang): string[] {
  const chuoi = `${d.tieuDe} ${d.viTri.map((v) => v.ten).join(" ")}`;
  const ra = NHOM_NGHE.filter((n) => n.tu.test(chuoi)).map((n) => n.ma);
  return ra.length ? ra : ["khac"];
}

export function donTheoId(id: string): DonHang | undefined {
  return DON_HANG.find((d) => d.id === id);
}

/** Đơn có ảnh thật đứng trước — trang danh sách nhìn mới đẹp */
export function donSapXep(): DonHang[] {
  return [...DON_HANG].sort((a, b) => b.anh.length - a.anh.length);
}

export const EUR = (n: number) => n.toLocaleString("de-DE");
