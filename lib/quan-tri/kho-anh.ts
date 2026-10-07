import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ghiNhatKy, giaoDich, hoi, hoiMot } from "@/lib/db";
import { RE_TEP_KHO, urlKho } from "@/lib/anh";

/**
 * KHO ẢNH — chỉ chạy ở phía MÁY CHỦ.
 *
 * File nằm ở `<NB_KHO>/anh`, NGOÀI thư mục app (VPS: /opt/nibelc-kho/anh). Để
 * trong app là mỗi lần deploy `git reset --hard` xoá sạch ảnh nhân viên đã
 * tải lên. Bảng `anh` chỉ giữ thông tin tra cứu; file thật nằm trên đĩa.
 *
 * CÁC HÀM Ở ĐÂY KHÔNG TỰ KIỂM ĐĂNG NHẬP. Chúng là thư viện; nơi gọi (server
 * action trong app/admin/viec-anh.ts, route trong app/admin/api/anh) mới là
 * điểm vào HTTP và phải chặn cổng ở dòng đầu.
 */

type Q = (sql: string, tham?: unknown[]) => Promise<unknown[]>;

/** Một ảnh trong kho, dạng trả ra cho giao diện. */
export type Anh = {
  id: string;
  /** tên file lúc nhân viên tải lên — chỉ để người đọc, không dùng làm đường dẫn */
  tenGoc: string;
  /** tên file trong kho (sinh ngẫu nhiên) */
  tep: string;
  /** đường dẫn dùng trên web: "/kho/<tep>" — chính là giá trị ghi vào đơn hàng / bài viết / banner */
  url: string;
  /** image/jpeg | image/png | image/webp | image/avif | image/gif */
  loai: string;
  rong: number | null;
  cao: number | null;
  /** byte */
  dungLuong: number;
  nhan: string[];
  /** ISO 8601 */
  taoLuc: string;
};

/** Một chỗ đang dùng ảnh — để hỏi lại trước khi xoá. */
export type NoiDungAnh = {
  bang: "don_hang" | "bai_viet" | "noi_dung";
  /** id đơn hàng / id bài viết / khoá nội dung */
  id: string;
  /** tên cho người đọc: tên đơn, tiêu đề bài, khoá nội dung */
  ten: string;
};

type Dong = {
  id: string;
  ten_goc: string;
  tep: string;
  loai: string;
  rong: number | null;
  cao: number | null;
  dung_luong: number | null;
  nhan: string[];
  tao_luc: Date | string;
};

function raAnh(d: Dong): Anh {
  return {
    id: d.id,
    tenGoc: d.ten_goc,
    tep: d.tep,
    url: urlKho(d.tep),
    loai: d.loai,
    rong: d.rong,
    cao: d.cao,
    dungLuong: d.dung_luong ?? 0,
    nhan: d.nhan ?? [],
    taoLuc: new Date(d.tao_luc).toISOString(),
  };
}

// ──────────────────────────── ổ đĩa ────────────────────────────

/** 15 MB mỗi file. Ảnh máy ảnh 24 MP xuất JPEG thường 8–12 MB, vừa đủ. */
export const DUNG_LUONG_TOI_DA = 15 * 1024 * 1024;

/**
 * Thư mục chứa ảnh. Thiếu NB_KHO ở bản production thì NÉM LỖI chứ không lặng
 * lẽ ghi vào thư mục app: ảnh ghi vào đó vẫn hiện bình thường cho tới lần
 * deploy kế, rồi biến mất sạch — lỗi kiểu đó phải lộ ra ngay ngày đầu.
 * Máy trạm (dev) thì ghi tạm vào `.kho/` trong dự án (đã có trong .gitignore).
 */
export function thuMucAnh(): string {
  const goc = process.env.NB_KHO?.trim();
  if (goc) return path.join(goc, "anh");
  if (process.env.NODE_ENV === "production") {
    throw new Error("Thiếu NB_KHO — đặt trong /opt/nibelc/.env.production.local (vd /opt/nibelc-kho)");
  }
  return path.join(process.cwd(), ".kho", "anh");
}

async function duongDanTep(tep: string): Promise<string> {
  // Chốt chặn cuối: tên file không đúng khuôn thì không bao giờ chạm đĩa, dù
  // nó đến từ CSDL hay từ URL.
  if (!RE_TEP_KHO.test(tep)) throw new Error("Tên file không hợp lệ");
  const thuMuc = thuMucAnh();
  await mkdir(thuMuc, { recursive: true });
  return path.join(thuMuc, tep);
}

async function xoaTep(tep: string) {
  try {
    await unlink(await duongDanTep(tep));
  } catch (e) {
    // File đã mất sẵn thì coi như xong; lỗi khác chỉ ghi lại — dòng CSDL đã
    // xoá rồi, không nên vì một file mồ côi mà báo thất bại cho nhân viên.
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") console.error("[kho-anh] không xoá được file", tep, e);
  }
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/**
 * Đọc một file trong kho để trả ra web (route /kho/[tep]).
 * Trả null khi tên không đúng khuôn hoặc file không có — nơi gọi trả 404.
 */
export async function docTepKho(tep: string): Promise<{ duLieu: Buffer; loai: string } | null> {
  if (!RE_TEP_KHO.test(tep)) return null;
  try {
    const duLieu = await readFile(path.join(thuMucAnh(), tep));
    return { duLieu, loai: MIME[tep.slice(tep.lastIndexOf(".") + 1)] ?? "application/octet-stream" };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") console.error("[kho-anh] không đọc được file", tep, e);
    return null;
  }
}

// ──────────────────────────── kiểm file ────────────────────────────

type ThongTin = { duoi: string; loai: string; rong: number | null; cao: number | null };

/**
 * Xem file có đúng là ảnh không bằng cách ĐỌC NỘI DUNG (sharp), không tin
 * đuôi file hay mime trình duyệt khai — hai thứ đó người gửi tự đặt được.
 * SVG bị loại có chủ ý: SVG chứa được mã script, cho tải lên rồi phục vụ lại
 * từ chính tên miền mình là mở cửa cho XSS.
 */
async function kiemAnh(duLieu: Buffer): Promise<ThongTin | { loi: string }> {
  if (duLieu.length === 0) return { loi: "File rỗng." };
  if (duLieu.length > DUNG_LUONG_TOI_DA) {
    return { loi: `File nặng ${(duLieu.length / 1048576).toFixed(1)} MB — tối đa 15 MB.` };
  }
  let m: sharp.Metadata;
  try {
    m = await sharp(duLieu, { failOn: "error" }).metadata();
  } catch {
    return { loi: "Không đọc được — file này không phải ảnh hoặc đã hỏng." };
  }
  let duoi: string | null = null;
  if (m.format === "jpeg") duoi = "jpg";
  else if (m.format === "png" || m.format === "webp" || m.format === "gif") duoi = m.format;
  // AVIF và HEIC chung một vỏ "heif"; chỉ nhận loại nén AV1 (AVIF) vì HEIC
  // của iPhone thì trình duyệt ngoài Safari không hiện được.
  else if (m.format === "heif" && m.compression === "av1") duoi = "avif";
  if (!duoi) return { loi: "Chỉ nhận ảnh JPEG, PNG, WebP, AVIF hoặc GIF." };

  // Ảnh điện thoại chụp dọc lưu điểm ảnh nằm ngang kèm cờ xoay EXIF (5–8):
  // trình duyệt hiện theo cờ, nên rộng/cao ghi lại cũng phải theo cờ.
  const xoay = (m.orientation ?? 1) >= 5;
  const rong = (xoay ? m.height : m.width) ?? null;
  const cao = (xoay ? m.width : m.height) ?? null;
  return { duoi, loai: MIME[duoi]!, rong, cao };
}

function chuanTenGoc(ten: string): string {
  // chỉ giữ phần tên (bỏ đường dẫn máy người gửi), cắt ngắn, bỏ ký tự điều khiển
  const t = (ten.split(/[\\/]/).pop() ?? "").replace(/[\u0000-\u001f]/g, "").trim();
  return (t || "anh").slice(0, 160);
}

/** Nhãn: cắt khoảng trắng, bỏ trùng, tối đa 12 nhãn × 40 ký tự. */
export function chuanNhan(nhan: unknown): string[] {
  const ds = Array.isArray(nhan) ? nhan : typeof nhan === "string" ? nhan.split(",") : [];
  const ra: string[] = [];
  for (const x of ds) {
    const s = String(x ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
    if (s && !ra.some((y) => y.toLowerCase() === s.toLowerCase())) ra.push(s);
    if (ra.length === 12) break;
  }
  return ra;
}

// ──────────────────────────── ghi ────────────────────────────

export type KetQuaLuuAnh = { ok: true; anh: Anh } | { ok: false; loi: string };

/**
 * Lưu một ảnh mới vào kho: kiểm nội dung → ghi file → ghi bảng `anh` + nhật ký.
 * Ghi file TRƯỚC rồi mới ghi CSDL; CSDL hỏng thì xoá file vừa ghi — thà mất
 * công ghi một file còn hơn có dòng CSDL trỏ vào file không tồn tại.
 */
export async function luuAnhMoi(duLieu: Buffer, tenGoc: string, nhan: unknown = []): Promise<KetQuaLuuAnh> {
  const kt = await kiemAnh(duLieu);
  if ("loi" in kt) return { ok: false, loi: kt.loi };

  const id = `a_${randomBytes(8).toString("hex")}`;
  const tep = `${randomBytes(12).toString("hex")}.${kt.duoi}`;
  await writeFile(await duongDanTep(tep), duLieu, { flag: "wx" });
  try {
    const d = await giaoDich(async (q) => {
      const [dong] = (await q(
        `insert into anh (id, ten_goc, tep, loai, rong, cao, dung_luong, nhan)
         values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
        [id, chuanTenGoc(tenGoc), tep, kt.loai, kt.rong, kt.cao, duLieu.length, chuanNhan(nhan)],
      )) as Dong[];
      await ghiNhatKy(q, "them", "anh", id, null, dong);
      return dong!;
    });
    return { ok: true, anh: raAnh(d) };
  } catch (e) {
    await xoaTep(tep);
    throw e;
  }
}

/** Câu tìm mọi bản ghi có nhắc tới một đường dẫn ảnh. `$1` = "/kho/<tep>". */
const SQL_NOI_DUNG = `
  select 'don_hang' as bang, id, coalesce(du_lieu->>'title', slug) as ten
    from don_hang where position($1 in du_lieu::text) > 0
  union all
  select 'bai_viet', id, coalesce(du_lieu->>'tieuDe', slug)
    from bai_viet where position($1 in du_lieu::text) > 0 or position($1 in dich::text) > 0
  union all
  select 'noi_dung', khoa, khoa
    from noi_dung where khoa not like 'he-thong.%' and position($1 in gia_tri::text) > 0`;

/** Những nơi đang dùng một ảnh (theo id ảnh). Ảnh không có thì trả rỗng. */
export async function noiDungAnh(id: string): Promise<NoiDungAnh[]> {
  const a = await hoiMot<{ tep: string }>("select tep from anh where id = $1", [id]);
  if (!a) return [];
  return hoi<NoiDungAnh>(SQL_NOI_DUNG, [urlKho(a.tep)]);
}

export type KetQuaThayAnh = { ok: true; anh: Anh; soNoiCapNhat: number } | { ok: false; loi: string };

/**
 * Thay file của một ảnh, GIỮ NGUYÊN id.
 *
 * File mới mang TÊN MỚI: /kho/<tep> được phục vụ với cache một năm
 * (`immutable`), ghi đè lên tên cũ thì trình duyệt của khách vẫn giữ ảnh cũ
 * cả năm. Vì tên đổi nên đường dẫn cũ đang nằm trong đơn hàng / bài viết /
 * banner cũng được đổi theo NGAY TRONG CÙNG GIAO DỊCH — nếu không, thay ảnh
 * xong là mọi nơi đang dùng nó thành ảnh vỡ.
 */
export async function thayAnh(id: string, duLieu: Buffer, tenGoc: string): Promise<KetQuaThayAnh> {
  const kt = await kiemAnh(duLieu);
  if ("loi" in kt) return { ok: false, loi: kt.loi };

  const tepMoi = `${randomBytes(12).toString("hex")}.${kt.duoi}`;
  await writeFile(await duongDanTep(tepMoi), duLieu, { flag: "wx" });
  let tepCu: string;
  let kq: { anh: Anh; soNoiCapNhat: number };
  try {
    const r = await giaoDich(async (q) => {
      const cu = (await q("select * from anh where id = $1 for update", [id]))[0] as Dong | undefined;
      if (!cu) return null;
      const [moi] = (await q(
        `update anh set tep = $2, loai = $3, rong = $4, cao = $5, dung_luong = $6, ten_goc = $7
          where id = $1 returning *`,
        [id, tepMoi, kt.loai, kt.rong, kt.cao, duLieu.length, chuanTenGoc(tenGoc)],
      )) as Dong[];

      // Tên file chỉ gồm chữ hex và dấu chấm nên thay chuỗi trên bản JSON dạng
      // chữ là an toàn: không có ký tự nào cần thoát, không thể khớp nhầm khoá.
      const a = urlKho(cu.tep);
      const b = urlKho(tepMoi);
      const noi = (await q(SQL_NOI_DUNG, [a])) as NoiDungAnh[];
      await q("update don_hang set du_lieu = replace(du_lieu::text, $1, $2)::jsonb where position($1 in du_lieu::text) > 0", [a, b]);
      await q(
        `update bai_viet set du_lieu = replace(du_lieu::text, $1, $2)::jsonb, dich = replace(dich::text, $1, $2)::jsonb
          where position($1 in du_lieu::text) > 0 or position($1 in dich::text) > 0`,
        [a, b],
      );
      await q(
        `update noi_dung set gia_tri = replace(gia_tri::text, $1, $2)::jsonb
          where khoa not like 'he-thong.%' and position($1 in gia_tri::text) > 0`,
        [a, b],
      );
      await ghiNhatKy(q, "sua", "anh", id, cu, { ...moi, thayFile: true, noiCapNhat: noi });
      return { cu, moi: moi!, so: noi.length };
    });
    if (!r) {
      await xoaTep(tepMoi);
      return { ok: false, loi: "Ảnh này không còn trong kho." };
    }
    tepCu = r.cu.tep;
    kq = { anh: raAnh(r.moi), soNoiCapNhat: r.so };
  } catch (e) {
    await xoaTep(tepMoi);
    throw e;
  }
  await xoaTep(tepCu);
  return { ok: true, ...kq };
}

export type KetQuaXoaAnh =
  | { ok: true }
  /** ảnh đang được dùng và chưa có cờ `buoc` — KHÔNG xoá gì cả */
  | { ok: false; dangDung: NoiDungAnh[]; loi: string }
  | { ok: false; dangDung?: undefined; loi: string };

/**
 * Xoá ảnh: xoá dòng + xoá file.
 *
 * Ảnh đang được dùng ở đâu đó thì TỪ CHỐI và trả danh sách nơi dùng, trừ khi
 * `buoc = true`. Xoá thẳng tay một ảnh đang làm banner là trang chủ hiện ô
 * ảnh vỡ ngay lập tức, mà nhân viên đứng ở kho ảnh thì không biết điều đó.
 *
 * XOÁ ẢNH KHÔNG KHÔI PHỤC ĐƯỢC: nhật ký giữ lại thông tin dòng, nhưng file
 * thì đã mất khỏi đĩa.
 */
export async function xoaAnh(id: string, buoc = false): Promise<KetQuaXoaAnh> {
  const r = await giaoDich(async (q) => {
    const cu = (await q("select * from anh where id = $1 for update", [id]))[0] as Dong | undefined;
    if (!cu) return { kieu: "khong-co" as const };
    const noi = (await q(SQL_NOI_DUNG, [urlKho(cu.tep)])) as NoiDungAnh[];
    if (noi.length > 0 && !buoc) return { kieu: "dang-dung" as const, noi };
    await q("delete from anh where id = $1", [id]);
    await ghiNhatKy(q, "xoa", "anh", id, cu, noi.length ? { conDungO: noi } : null);
    return { kieu: "xong" as const, tep: cu.tep };
  });
  if (r.kieu === "khong-co") return { ok: false, loi: "Ảnh này không còn trong kho." };
  if (r.kieu === "dang-dung") {
    return { ok: false, dangDung: r.noi, loi: `Ảnh đang được dùng ở ${r.noi.length} nơi.` };
  }
  await xoaTep(r.tep);
  return { ok: true };
}

/** Sửa nhãn và/hoặc tên hiển thị của ảnh. Không đụng tới file. */
export async function suaAnh(
  id: string,
  doi: { nhan?: unknown; tenGoc?: string },
): Promise<{ ok: true; anh: Anh } | { ok: false; loi: string }> {
  const d = await giaoDich(async (q) => {
    const cu = (await q("select * from anh where id = $1 for update", [id]))[0] as Dong | undefined;
    if (!cu) return null;
    const nhan = doi.nhan === undefined ? cu.nhan : chuanNhan(doi.nhan);
    const ten = doi.tenGoc === undefined ? cu.ten_goc : chuanTenGoc(doi.tenGoc);
    const [moi] = (await q("update anh set nhan = $2, ten_goc = $3 where id = $1 returning *", [id, nhan, ten])) as Dong[];
    await ghiNhatKy(q, "sua", "anh", id, cu, moi);
    return moi!;
  });
  return d ? { ok: true, anh: raAnh(d) } : { ok: false, loi: "Ảnh này không còn trong kho." };
}

/**
 * Trả nhãn + tên của ảnh về bản trong nhật ký. Chỉ dùng cho khôi phục; file
 * đã thay hay đã xoá thì không lấy lại được nên từ chối.
 */
export async function khoiPhucNhanAnh(q: Q, truoc: Record<string, unknown>): Promise<void> {
  const nay = (await q("select * from anh where id = $1 for update", [truoc.id]))[0] as Dong | undefined;
  if (!nay) throw new Error("Ảnh đã bị xoá khỏi kho — file không còn nên không khôi phục được.");
  if (nay.tep !== truoc.tep) throw new Error("File ảnh đã được thay — bản cũ không còn trên đĩa nên không khôi phục được.");
  await q("update anh set nhan = $2, ten_goc = $3 where id = $1", [nay.id, chuanNhan(truoc.nhan), chuanTenGoc(String(truoc.ten_goc ?? nay.ten_goc))]);
  await ghiNhatKy(q, "sua", "anh", nay.id, nay, { khoiPhuc: true });
}

// ──────────────────────────── đọc ────────────────────────────

export type LocAnh = {
  /** chỉ lấy ảnh có đúng nhãn này */
  nhan?: string;
  /** tìm trong tên file gốc và trong nhãn, không phân biệt hoa thường */
  tim?: string;
  /** bắt đầu từ 1 */
  trang?: number;
  /** mặc định 48, tối đa 200 */
  moiTrang?: number;
};

export type TrangAnh = { ds: Anh[]; tong: number; trang: number; moiTrang: number; soTrang: number };

function dieuKien(loc: LocAnh): { sql: string; tham: unknown[] } {
  const nhan = loc.nhan?.trim() || null;
  const tim = loc.tim?.trim() || null;
  // thoát % _ \ để chữ nhân viên gõ được tìm ĐÚNG NGUYÊN VĂN, không thành ký tự đại diện
  const mau = tim ? `%${tim.replace(/[\\%_]/g, "\\$&")}%` : null;
  return {
    sql: `($1::text is null or $1 = any(nhan))
      and ($2::text is null or ten_goc ilike $2 or exists (select 1 from unnest(nhan) n where n ilike $2))`,
    tham: [nhan, mau],
  };
}

/** Liệt kê ảnh, mới nhất trước. */
export async function lietKeAnh(loc: LocAnh = {}): Promise<TrangAnh> {
  const moiTrang = Math.min(200, Math.max(1, Math.floor(loc.moiTrang ?? 48) || 48));
  const trang = Math.max(1, Math.floor(loc.trang ?? 1) || 1);
  const { sql, tham } = dieuKien(loc);
  const [ds, dem] = await Promise.all([
    hoi<Dong>(`select * from anh where ${sql} order by tao_luc desc, id limit $3 offset $4`, [
      ...tham,
      moiTrang,
      (trang - 1) * moiTrang,
    ]),
    hoiMot<{ n: string }>(`select count(*)::text as n from anh where ${sql}`, tham),
  ]);
  const tong = Number(dem?.n ?? 0);
  return { ds: ds.map(raAnh), tong, trang, moiTrang, soTrang: Math.max(1, Math.ceil(tong / moiTrang)) };
}

/** Số ảnh (theo cùng bộ lọc với lietKeAnh) và tổng dung lượng tính bằng byte. */
export async function demAnh(loc: LocAnh = {}): Promise<{ so: number; dungLuong: number }> {
  const { sql, tham } = dieuKien(loc);
  const r = await hoiMot<{ so: string; nang: string }>(
    `select count(*)::text as so, coalesce(sum(dung_luong), 0)::text as nang from anh where ${sql}`,
    tham,
  );
  return { so: Number(r?.so ?? 0), dungLuong: Number(r?.nang ?? 0) };
}

/** Một ảnh theo id, hoặc null. */
export async function layAnh(id: string): Promise<Anh | null> {
  const d = await hoiMot<Dong>("select * from anh where id = $1", [id]);
  return d ? raAnh(d) : null;
}

/** Mọi nhãn đang có kèm số ảnh mang nhãn đó — để dựng hàng nút lọc. */
export async function moiNhanAnh(): Promise<{ nhan: string; so: number }[]> {
  const ds = await hoi<{ nhan: string; so: string }>(
    "select n as nhan, count(*)::text as so from anh, unnest(nhan) n group by n order by count(*) desc, n",
  );
  return ds.map((d) => ({ nhan: d.nhan, so: Number(d.so) }));
}
