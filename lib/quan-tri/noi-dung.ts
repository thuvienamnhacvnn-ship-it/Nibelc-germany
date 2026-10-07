import { LANGS, type Lang } from "@/lib/i18n/config";
import { anhHopLe } from "@/lib/anh";
import { home } from "@/lib/i18n/dict/home";
import { donHang } from "@/lib/i18n/dict/don-hang";
import { duHocNghe } from "@/lib/i18n/dict/du-hoc-nghe";
import { camNang } from "@/lib/i18n/dict/cam-nang";
import { loTrinh } from "@/lib/i18n/dict/lo-trinh";
import { veChungToi } from "@/lib/i18n/dict/ve-chung-toi";
import { lienHe } from "@/lib/i18n/dict/lien-he";

/**
 * DANH MỤC NỘI DUNG TRANG — chữ và ảnh banner mà nhân viên sửa được.
 *
 * File này KHÔNG đụng CSDL, nên dùng được cả ở client component (form sửa)
 * lẫn máy chủ. Đọc/ghi CSDL nằm ở:
 *   data/nguon-noi-dung.ts          layNoiDung()      — web công khai
 *   lib/quan-tri/noi-dung-csdl.ts   lietKeNoiDung()…  — trang quản trị
 *   app/admin/viec-noi-dung.ts      server action lưu / về mặc định
 *
 * ── MỘT NGUỒN CHO GIÁ TRỊ MẶC ĐỊNH ───────────────────────────────────────
 * Mặc định KHÔNG chép tay vào đây: chữ lấy thẳng từ lib/i18n/dict/*, ảnh là
 * đúng đường dẫn các trang đang dùng. Nên khi bảng `noi_dung` chưa có dòng
 * nào, web hiển thị y hệt lúc chưa có trang quản trị — và sửa từ điển thì
 * mặc định ở đây tự đổi theo.
 *
 * ── DẠNG LƯU TRONG `noi_dung.gia_tri` ────────────────────────────────────
 *   { "chung": { "anh": "/kho/ab12….webp" },        ← trường KHÔNG dịch (ảnh)
 *     "vi":    { "tieuDe": "…", "mo": "…" },        ← trường dịch được
 *     "en":    { "tieuDe": "…" },
 *     "de":    {} }
 * Chỉ lưu những trường ĐÃ SỬA. Trường nào không có trong đó thì dùng mặc định.
 *
 * ── QUY TẮC BẢN DỊCH ─────────────────────────────────────────────────────
 * Nhân viên sửa chữ tiếng Việt mà chưa nhập bản /en /de: hai bản đó GIỮ CHỮ
 * MẶC ĐỊNH CỦA CHÍNH NGÔN NGỮ ĐÓ (từ điển), không bao giờ rơi về tiếng Việt.
 *
 * ── KHOÁ `he-thong.*` ────────────────────────────────────────────────────
 * Bảng `noi_dung` còn chứa `he-thong.mat-khau` (băm mật khẩu quản trị). Khoá
 * đó KHÔNG có trong danh mục này, và mọi hàm đọc/ghi nội dung đều từ chối
 * khoá ngoài danh mục — nên nó không thể lọt ra danh sách hay bị form ghi đè.
 */

export type LoaiTruong = "chu-ngan" | "chu-dai" | "anh";

export interface Truong {
  /** nhãn tiếng Việt hiện cạnh ô nhập */
  nhan: string;
  /** chu-ngan = một dòng (≤ 200 ký tự) · chu-dai = nhiều dòng (≤ 1000) · anh = đường dẫn /kho/… hoặc /assets/… */
  loai: LoaiTruong;
  /** true = mỗi ngôn ngữ một giá trị; false = dùng chung (ảnh) */
  dich: boolean;
  /** true = được phép lưu RỖNG để ẩn hẳn mục đó trên web (vd dòng mô tả) */
  boTrongDuoc?: boolean;
  /** lời nhắc hiện dưới ô nhập */
  goiY?: string;
}

export interface MucNoiDung<T extends string = string> {
  /** tên mục, tiếng Việt, hiện trong danh sách */
  nhan: string;
  /** đường dẫn trang công khai chịu ảnh hưởng (không tiền tố ngôn ngữ) */
  trang: string;
  /** tên trang cho người đọc */
  tenTrang: string;
  truong: Record<T, Truong>;
  /** giá trị đầy đủ theo từng ngôn ngữ khi chưa ai sửa gì */
  macDinh: Record<Lang, Record<T, string>>;
}

const muc = <T extends string>(m: { nhan: string; trang: string; tenTrang: string; truong: Record<T, Truong>; macDinh: Record<Lang, Record<NoInfer<T>, string>> }): MucNoiDung<T> => m;

const baNgon = <R>(f: (l: Lang) => R): Record<Lang, R> => ({ vi: f("vi"), en: f("en"), de: f("de") });

// ── các trường dùng lại giữa các banner ──
const ANH_NGANG: Truong = {
  nhan: "Ảnh nền (máy tính)",
  loai: "anh",
  dich: false,
  goiY: "Ảnh ngang, nên từ 1920 × 560 trở lên. Tấm chữ nằm ở nửa trái — chọn ảnh có chủ thể lệch phải.",
};
const ANH_DOC: Truong = {
  nhan: "Ảnh nền (điện thoại)",
  loai: "anh",
  dich: false,
  goiY: "Ảnh riêng cho màn hẹp, hiện thành khối cao 220px phía trên chữ. Nên từ 800 × 600 trở lên.",
};
const NHAN: Truong = { nhan: "Dòng nhãn nhỏ phía trên", loai: "chu-ngan", dich: true };
const TIEU_DE: Truong = { nhan: "Tiêu đề", loai: "chu-ngan", dich: true, goiY: "Ngắn gọn — tiêu đề dài sẽ xuống 3–4 dòng trên điện thoại." };
const MO: Truong = {
  nhan: "Mô tả",
  loai: "chu-dai",
  dich: true,
  boTrongDuoc: true,
  goiY: "Một, hai câu. Để trống thì web bỏ hẳn dòng mô tả.",
};

const TRUONG_BANNER = { anh: ANH_NGANG, anhDoc: ANH_DOC, nhan: NHAN, tieuDe: TIEU_DE, mo: MO };

const DONG = (so: string, goiY?: string): Truong => ({ nhan: `Tiêu đề — dòng ${so}`, loai: "chu-ngan", dich: true, goiY });

export const DANH_MUC = {
  "trang-chu.banner": muc({
    nhan: "Banner trang chủ",
    trang: "/",
    tenTrang: "Trang chủ",
    truong: {
      anh: { ...ANH_NGANG, goiY: "Ảnh phủ kín màn hình đầu trang chủ ở máy tính. Nên từ 1920 × 1080 trở lên." },
      anhDoc: {
        nhan: "Ảnh nền (điện thoại)",
        loai: "anh",
        dich: false,
        boTrongDuoc: true,
        goiY: "Để trống thì điện thoại chạy video nền như hiện nay. Chọn ảnh dọc (9:16) thì ảnh thay cho video.",
      },
      dong1a: DONG("1, nửa đầu (chữ trắng)"),
      dong1b: DONG("1, nửa sau (chữ vàng)"),
      dong2: DONG("2"),
      dong3: DONG("3 (khẩu hiệu to)", "Chữ quá dài sẽ tự co nhỏ lại cho vừa khung."),
      dong4: DONG("4"),
      dong5: DONG("5"),
    },
    macDinh: baNgon((l) => ({ anh: "/assets/home/hero-anh.jpg", anhDoc: "", ...home[l].hero })),
  }),

  "don-hang.banner": muc({
    nhan: "Banner trang Đơn hàng",
    trang: "/don-hang",
    tenTrang: "Đơn hàng",
    truong: TRUONG_BANNER,
    macDinh: baNgon((l) => ({
      anh: "/assets/banners/don-hang.jpg",
      anhDoc: "/assets/banners/mobile/don-hang.jpg",
      nhan: donHang[l].hero.nhan,
      tieuDe: donHang[l].hero.tieuDe,
      mo: donHang[l].hero.mo,
    })),
  }),

  "du-hoc-nghe.banner": muc({
    nhan: "Banner trang Du học nghề",
    trang: "/du-hoc-nghe",
    tenTrang: "Du học nghề",
    truong: {
      ...TRUONG_BANNER,
      anh: { ...ANH_NGANG, goiY: "Ở máy tính ảnh chỉ chiếm nửa phải banner, nửa trái là nền xanh đặc cho chữ." },
      phuDe: { nhan: "Dòng phụ dưới tiêu đề", loai: "chu-ngan", dich: true, boTrongDuoc: true, goiY: "Để trống thì bỏ dòng này." },
    },
    macDinh: baNgon((l) => ({
      anh: "/assets/banners/du-hoc-nghe.jpg",
      anhDoc: "/assets/banners/mobile/du-hoc-nghe.jpg",
      nhan: duHocNghe[l].hero.nhan,
      tieuDe: duHocNghe[l].hero.tieuDe,
      phuDe: duHocNghe[l].hero.phuDe,
      mo: duHocNghe[l].hero.mo,
    })),
  }),

  "cam-nang.banner": muc({
    nhan: "Banner trang Cẩm nang",
    trang: "/cam-nang",
    tenTrang: "Cẩm nang",
    truong: {
      ...TRUONG_BANNER,
      anh: { ...ANH_NGANG, goiY: `${ANH_NGANG.goiY} Ảnh này cũng là banner của từng bài cẩm nang.` },
    },
    macDinh: baNgon((l) => ({
      anh: "/assets/banners/cam-nang.jpg",
      anhDoc: "/assets/banners/mobile/cam-nang.jpg",
      nhan: camNang[l].hero.nhan,
      tieuDe: camNang[l].hero.tieuDe,
      mo: camNang[l].hero.mo,
    })),
  }),

  "lo-trinh.banner": muc({
    nhan: "Banner trang Lộ trình",
    trang: "/lo-trinh",
    tenTrang: "Lộ trình",
    truong: TRUONG_BANNER,
    macDinh: baNgon((l) => ({
      anh: "/assets/banners/lo-trinh.jpg",
      anhDoc: "/assets/banners/mobile/lo-trinh.jpg",
      nhan: loTrinh[l].hero.nhan,
      tieuDe: loTrinh[l].hero.tieuDe,
      mo: loTrinh[l].hero.mo,
    })),
  }),

  "ve-chung-toi.banner": muc({
    nhan: "Banner trang Về chúng tôi",
    trang: "/ve-chung-toi",
    tenTrang: "Về chúng tôi",
    truong: TRUONG_BANNER,
    macDinh: baNgon((l) => ({
      anh: "/assets/home/hero-anh.jpg",
      anhDoc: "/assets/banners/mobile/ve-chung-toi.jpg",
      nhan: "NIBELC GROUP GERMANY",
      tieuDe: veChungToi[l].hero.tieuDe,
      mo: veChungToi[l].hero.mo,
    })),
  }),

  "lien-he.banner": muc({
    nhan: "Banner trang Liên hệ",
    trang: "/lien-he",
    tenTrang: "Liên hệ",
    truong: {
      ...TRUONG_BANNER,
      anh: { ...ANH_NGANG, goiY: "Ở máy tính ảnh chỉ chiếm nửa phải banner, nửa trái là nền xanh đặc cho chữ." },
    },
    macDinh: baNgon((l) => ({
      anh: "/assets/banners/lien-he.jpg",
      anhDoc: "/assets/banners/mobile/lien-he.jpg",
      nhan: lienHe[l].nhan,
      tieuDe: lienHe[l].tieuDe,
      mo: lienHe[l].mo,
    })),
  }),
} as const satisfies Record<string, MucNoiDung>;

export type KhoaNoiDung = keyof typeof DANH_MUC;

/** Tên các trường của một khoá. */
export type TruongCua<K extends KhoaNoiDung> = keyof (typeof DANH_MUC)[K]["truong"] & string;

/** Giá trị đã ghép (đã lưu đè lên mặc định) của một khoá ở MỘT ngôn ngữ. */
export type GiaTriNoiDung<K extends KhoaNoiDung> = Record<TruongCua<K>, string>;

/** Dạng lưu trong CSDL: chỉ gồm những trường đã sửa. */
export type NoiDungLuu = Partial<Record<"chung" | Lang, Record<string, string>>>;

export const KHOA_NOI_DUNG = Object.keys(DANH_MUC) as KhoaNoiDung[];

export function laKhoaNoiDung(x: unknown): x is KhoaNoiDung {
  return typeof x === "string" && Object.prototype.hasOwnProperty.call(DANH_MUC, x);
}

/** Mục của danh mục dưới dạng không ràng kiểu trường — tiện cho form dựng động. */
export function mucNoiDung(khoa: KhoaNoiDung): MucNoiDung {
  return DANH_MUC[khoa] as unknown as MucNoiDung;
}

/** Giá trị mặc định của một khoá ở một ngôn ngữ. */
export function macDinhNoiDung<K extends KhoaNoiDung>(khoa: K, lang: Lang): GiaTriNoiDung<K> {
  return { ...mucNoiDung(khoa).macDinh[lang] } as GiaTriNoiDung<K>;
}

const DAI_TOI_DA: Record<LoaiTruong, number> = { "chu-ngan": 200, "chu-dai": 1000, anh: 300 };

/** Một giá trị có dùng được cho trường này không. Rỗng chỉ hợp lệ khi `boTrongDuoc`. */
function dungDuoc(t: Truong, v: unknown): v is string {
  if (typeof v !== "string") return false;
  if (v === "") return !!t.boTrongDuoc;
  if (v.length > DAI_TOI_DA[t.loai]) return false;
  return t.loai === "anh" ? anhHopLe(v) : v.trim() !== "";
}

const laVat = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

/**
 * Ghép bản đã lưu lên mặc định → giá trị web dùng.
 *
 * Chịu được MỌI thứ rác trong `luu` (null, sai kiểu, đường dẫn ảnh hỏng,
 * trường lạ): cái gì không dùng được thì bỏ qua, lấy mặc định. Web không được
 * vỡ vì một dòng CSDL xấu.
 */
export function ghepNoiDung<K extends KhoaNoiDung>(khoa: K, luu: unknown, lang: Lang): GiaTriNoiDung<K> {
  const m = mucNoiDung(khoa);
  const ra: Record<string, string> = { ...m.macDinh[lang] };
  if (!laVat(luu)) return ra as GiaTriNoiDung<K>;
  const chung = laVat(luu.chung) ? luu.chung : {};
  const rieng = laVat(luu[lang]) ? (luu[lang] as Record<string, unknown>) : {};
  for (const [ten, t] of Object.entries(m.truong)) {
    const v = (t.dich ? rieng : chung)[ten];
    if (dungDuoc(t, v)) ra[ten] = v;
  }
  return ra as GiaTriNoiDung<K>;
}

/**
 * Kiểm và dọn dữ liệu form gửi lên trước khi lưu.
 *
 * `vao` có dạng NoiDungLuu. Trường nào vắng mặt, null, hoặc TRÙNG mặc định thì
 * không lưu (web dùng mặc định). Trường rỗng "" chỉ được giữ khi trường đó
 * `boTrongDuoc`; còn lại rỗng = về mặc định. Giá trị sai (ảnh không phải
 * /kho/… hay /assets/…, chữ quá dài) thì TỪ CHỐI cả lần lưu kèm lời báo rõ
 * trường nào — không lặng lẽ bỏ, kẻo nhân viên tưởng đã lưu.
 */
export function chuanNoiDung(khoa: KhoaNoiDung, vao: unknown): { ok: true; giaTri: NoiDungLuu; rong: boolean } | { ok: false; loi: string } {
  const m = mucNoiDung(khoa);
  if (!laVat(vao)) return { ok: false, loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };
  const ra: NoiDungLuu = {};
  const TEN_NGON: Record<string, string> = { chung: "", vi: " (tiếng Việt)", en: " (tiếng Anh)", de: " (tiếng Đức)" };

  for (const phan of ["chung", ...LANGS] as const) {
    const o = vao[phan];
    if (o === undefined || o === null) continue;
    if (!laVat(o)) return { ok: false, loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };
    for (const [ten, t] of Object.entries(m.truong)) {
      if (t.dich !== (phan !== "chung")) continue;
      const tho = o[ten];
      if (tho === undefined || tho === null) continue;
      if (typeof tho !== "string") return { ok: false, loi: `“${t.nhan}”${TEN_NGON[phan]}: giá trị không hợp lệ.` };
      const v = t.loai === "anh" ? tho.trim() : tho.replace(/\r\n/g, "\n").trim();
      if (v === "" && !t.boTrongDuoc) continue;
      if (!dungDuoc(t, v)) {
        return {
          ok: false,
          loi:
            t.loai === "anh"
              ? `“${t.nhan}”: phải chọn ảnh trong kho (đường dẫn /kho/… hoặc /assets/…).`
              : `“${t.nhan}”${TEN_NGON[phan]}: dài quá ${DAI_TOI_DA[t.loai]} ký tự.`,
        };
      }
      const macDinh = m.macDinh[phan === "chung" ? "vi" : phan][ten];
      if (v === macDinh) continue;
      (ra[phan] ??= {})[ten] = v;
    }
  }
  return { ok: true, giaTri: ra, rong: Object.keys(ra).length === 0 };
}
