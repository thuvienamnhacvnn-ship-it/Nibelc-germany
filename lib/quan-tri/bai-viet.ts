import { hoi, hoiMot } from "@/lib/db";
import { anhHopLe } from "@/lib/anh";
import { NHOM_BAI, type Khoi } from "@/data/articles";

/**
 * BÀI VIẾT (cẩm nang + cộng đồng) — kiểu dữ liệu, bộ kiểm, và hàm đọc cho
 * TRANG QUẢN TRỊ. Chỉ chạy ở máy chủ; KHÔNG tự kiểm đăng nhập.
 *
 * Hình dạng `du_lieu` giữ đúng như 8 bài đã nạp từ data/articles.ts
 * (scripts/xuat-sang-csdl.mjs): { id, nhom, icon, tieuDe, tomTat, phut, khoi }
 * — thêm đúng một trường mới `anhBia` (đường dẫn ảnh, không bắt buộc).
 * `dich` = { en?: { tieuDe, tomTat, khoi }, de?: {…} }.
 */

export const LOAI_BAI = ["cam-nang", "cong-dong"] as const;
export type LoaiBai = (typeof LOAI_BAI)[number];

export function laLoaiBai(x: unknown): x is LoaiBai {
  return typeof x === "string" && (LOAI_BAI as readonly string[]).includes(x);
}

/** Phần nội dung tiếng Việt của một bài — đúng thứ nằm trong cột `du_lieu`. */
export type NoiDungBai = {
  id: string;
  /** cẩm nang: một trong NHOM_BAI ("Chuẩn bị" | "Sống ở Đức" | "Tiền bạc" | "Lâu dài"); cộng đồng: chữ tự do */
  nhom: string;
  icon: string;
  tieuDe: string;
  tomTat: string;
  /** số phút đọc */
  phut: number;
  khoi: Khoi[];
  /** ảnh bìa: "/kho/<tep>" hoặc "/assets/…". Không có thì web dùng ảnh minh hoạ xoay vòng như cũ */
  anhBia?: string;
};

/** Bản dịch của một bài ở một ngôn ngữ. Thiếu `tieuDe` = bài KHÔNG hiện ở ngôn ngữ đó. */
export type BanDichBai = Partial<{ tieuDe: string; tomTat: string; khoi: Khoi[] }>;

/** Một dòng bảng `bai_viet`, dạng trả ra cho giao diện quản trị. */
export type BaiViet = {
  id: string;
  slug: string;
  loai: LoaiBai;
  nhom: string | null;
  hien: boolean;
  thuTu: number;
  /** ISO 8601 */
  taoLuc: string;
  suaLuc: string;
  duLieu: NoiDungBai;
  dich: Partial<Record<"en" | "de", BanDichBai>>;
  /** đã có TIÊU ĐỀ bản dịch — đúng điều kiện để bài hiện ở /en, /de */
  coEn: boolean;
  coDe: boolean;
};

type Dong = {
  id: string;
  slug: string;
  loai: LoaiBai;
  nhom: string | null;
  hien: boolean;
  thu_tu: number;
  tao_luc: Date | string;
  sua_luc: Date | string;
  du_lieu: NoiDungBai;
  dich: BaiViet["dich"] | null;
};

function raBai(d: Dong): BaiViet {
  const dich = d.dich ?? {};
  return {
    id: d.id,
    slug: d.slug,
    loai: d.loai,
    nhom: d.nhom,
    hien: d.hien,
    thuTu: d.thu_tu,
    taoLuc: new Date(d.tao_luc).toISOString(),
    suaLuc: new Date(d.sua_luc).toISOString(),
    duLieu: d.du_lieu,
    dich,
    coEn: !!dich.en?.tieuDe?.trim(),
    coDe: !!dich.de?.tieuDe?.trim(),
  };
}

/** Mọi bài (cả đang ẩn), đã xếp đúng thứ tự web hiển thị. Bỏ `loai` để lấy cả hai loại. */
export async function lietKeBaiViet(loai?: LoaiBai): Promise<BaiViet[]> {
  const ds = await hoi<Dong>(
    `select * from bai_viet where ($1::text is null or loai = $1) order by loai, thu_tu desc, tao_luc desc`,
    [loai ?? null],
  );
  return ds.map(raBai);
}

/** Một bài theo id (kể cả đang ẩn), hoặc null. */
export async function layBaiVietDeSua(id: string): Promise<BaiViet | null> {
  const d = await hoiMot<Dong>("select * from bai_viet where id = $1", [id]);
  return d ? raBai(d) : null;
}

// ──────────────────────────── kiểm dữ liệu ────────────────────────────

/** Đường dẫn: chữ thường không dấu, số, gạch nối. Dùng chung cho đơn hàng và bài viết. */
export const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const laVat = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const chu = (x: unknown) => (typeof x === "string" ? x.replace(/\r\n/g, "\n").trim() : "");
const dsChu = (x: unknown) => (Array.isArray(x) ? x.map(chu).filter(Boolean) : []);

/** Dọn danh sách khối. Trả chuỗi lỗi khi có khối thiếu tiêu đề. */
function chuanKhoi(x: unknown, ten: string): Khoi[] | string {
  if (x === undefined || x === null) return [];
  if (!Array.isArray(x)) return `${ten}: danh sách khối không đọc được.`;
  if (x.length > 40) return `${ten}: tối đa 40 khối nội dung.`;
  const ra: Khoi[] = [];
  for (const [i, k] of x.entries()) {
    if (!laVat(k)) return `${ten}: khối số ${i + 1} không đọc được.`;
    const tieuDe = chu(k.tieuDe);
    const doan = dsChu(k.doan);
    const gach = dsChu(k.gach);
    const luuY = chu(k.luuY);
    // khối trống trơn (nhân viên bấm "thêm khối" rồi bỏ đó) thì lặng lẽ bỏ
    if (!tieuDe && doan.length === 0 && gach.length === 0 && !luuY) continue;
    // Tiêu đề khối là mục lục và là mỏ neo #muc-N của trang bài — không có
    // thì mục lục hiện một dòng trống.
    if (!tieuDe) return `${ten}: khối số ${i + 1} chưa có tiêu đề.`;
    const o: Khoi = { tieuDe };
    if (doan.length) o.doan = doan;
    if (gach.length) o.gach = gach;
    if (luuY) o.luuY = luuY;
    ra.push(o);
  }
  return ra;
}

/** Ước lượng phút đọc khi nhân viên không điền: ~200 chữ một phút, tối thiểu 1. */
function uocPhut(tomTat: string, khoi: Khoi[]): number {
  const tat = [tomTat, ...khoi.flatMap((k) => [k.tieuDe, ...(k.doan ?? []), ...(k.gach ?? []), k.luuY ?? ""])].join(" ");
  return Math.max(1, Math.round(tat.split(/\s+/).filter(Boolean).length / 200));
}

export type BaiDaChuan = { duLieu: NoiDungBai; dich: BaiViet["dich"]; nhom: string | null };

/**
 * Kiểm và dọn dữ liệu một bài trước khi lưu. Trả `{ loi }` với lời báo bằng
 * tiếng Việt cho nhân viên khi có chỗ sai.
 */
export function chuanBaiViet(id: string, loai: LoaiBai, duLieuVao: unknown, dichVao: unknown): BaiDaChuan | { loi: string } {
  if (!laVat(duLieuVao)) return { loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };

  const tieuDe = chu(duLieuVao.tieuDe);
  if (!tieuDe) return { loi: "Chưa có tiêu đề bài viết." };
  if (tieuDe.length > 200) return { loi: "Tiêu đề dài quá 200 ký tự." };
  const tomTat = chu(duLieuVao.tomTat);
  if (tomTat.length > 800) return { loi: "Tóm tắt dài quá 800 ký tự." };

  const khoi = chuanKhoi(duLieuVao.khoi, "Bản tiếng Việt");
  if (typeof khoi === "string") return { loi: khoi };

  let nhom: string | null = chu(duLieuVao.nhom) || null;
  if (loai === "cam-nang") {
    // Nhóm là MÃ tra nhãn ở lib/i18n/dict/cam-nang.ts — nhóm lạ thì trang bài
    // hiện nhãn trống ở cả ba ngôn ngữ.
    if (!nhom) nhom = NHOM_BAI[0];
    else if (!(NHOM_BAI as readonly string[]).includes(nhom)) {
      return { loi: `Nhóm bài phải là một trong: ${NHOM_BAI.join(", ")}.` };
    }
  } else if (nhom && nhom.length > 60) {
    return { loi: "Tên nhóm dài quá 60 ký tự." };
  }

  const phutVao = Number(duLieuVao.phut);
  const phut = Number.isFinite(phutVao) && phutVao >= 1 ? Math.min(120, Math.round(phutVao)) : uocPhut(tomTat, khoi);

  const duLieu: NoiDungBai = { id, nhom: nhom ?? "", icon: chu(duLieuVao.icon) || "chat", tieuDe, tomTat, phut, khoi };

  const anhBia = chu(duLieuVao.anhBia);
  if (anhBia) {
    if (!anhHopLe(anhBia)) return { loi: "Ảnh bìa phải chọn trong kho ảnh (đường dẫn /kho/… hoặc /assets/…)." };
    duLieu.anhBia = anhBia;
  }

  const dich: BaiViet["dich"] = {};
  if (dichVao !== undefined && dichVao !== null && !laVat(dichVao)) {
    return { loi: "Dữ liệu bản dịch không đọc được. Tải lại trang rồi thử lại." };
  }
  for (const l of ["en", "de"] as const) {
    const b = laVat(dichVao) ? dichVao[l] : undefined;
    if (!laVat(b)) continue;
    const ten = l === "en" ? "Bản tiếng Anh" : "Bản tiếng Đức";
    const o: BanDichBai = {};
    const td = chu(b.tieuDe);
    if (td.length > 200) return { loi: `${ten}: tiêu đề dài quá 200 ký tự.` };
    const tt = chu(b.tomTat);
    if (tt.length > 800) return { loi: `${ten}: tóm tắt dài quá 800 ký tự.` };
    const kh = chuanKhoi(b.khoi, ten);
    if (typeof kh === "string") return { loi: kh };
    // Chỉ giữ khoá CÓ nội dung: web dựa vào "có khoá hay không" để quyết định
    // ẩn mục, chuỗi rỗng lưu lại sẽ thành một dòng trắng trên trang.
    if (td) o.tieuDe = td;
    if (tt) o.tomTat = tt;
    if (kh.length) o.khoi = kh;
    if (Object.keys(o).length) dich[l] = o;
  }

  return { duLieu, dich, nhom };
}
