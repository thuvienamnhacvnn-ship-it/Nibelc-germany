import { ghiNhatKy, giaoDich, hoi } from "@/lib/db";
import { LANGS, type Lang } from "@/lib/i18n/config";
import {
  KHOA_NOI_DUNG,
  chuanNoiDung,
  ghepNoiDung,
  laKhoaNoiDung,
  mucNoiDung,
  type KhoaNoiDung,
  type MucNoiDung,
  type NoiDungLuu,
} from "@/lib/quan-tri/noi-dung";

/**
 * NỘI DUNG TRANG — phần đọc/ghi CSDL cho TRANG QUẢN TRỊ. Chỉ chạy ở máy chủ.
 * Các hàm ở đây KHÔNG tự kiểm đăng nhập; nơi gọi phải chặn cổng trước.
 *
 * Mọi câu truy vấn đều lọc theo danh sách khoá của danh mục, nên dòng
 * `he-thong.mat-khau` nằm chung bảng không bao giờ bị kéo ra.
 */

type Q = (sql: string, tham?: unknown[]) => Promise<unknown[]>;

/** Một mục nội dung kèm mọi thứ form sửa cần. */
export type NoiDungDeSua = {
  khoa: KhoaNoiDung;
  /** định nghĩa: nhãn, trang, các trường */
  muc: MucNoiDung;
  /** những gì ĐÃ SỬA (dạng lưu). Trường không có ở đây = đang dùng mặc định */
  daLuu: NoiDungLuu;
  /** giá trị web đang hiển thị, theo từng ngôn ngữ (đã lưu đè lên mặc định) */
  hienTai: Record<Lang, Record<string, string>>;
  /** giá trị mặc định theo từng ngôn ngữ — để hiện nút "về mặc định" từng ô */
  macDinh: Record<Lang, Record<string, string>>;
  /** true khi có ít nhất một trường đã sửa */
  daSua: boolean;
  /** ISO 8601, null khi chưa sửa lần nào */
  suaLuc: string | null;
};

function dung(khoa: KhoaNoiDung, giaTri: unknown, suaLuc: Date | string | null): NoiDungDeSua {
  const muc = mucNoiDung(khoa);
  // đi qua chuanNoiDung để form không bao giờ nhận lại rác đang nằm trong CSDL
  const sach = chuanNoiDung(khoa, giaTri ?? {});
  const daLuu = sach.ok ? sach.giaTri : {};
  const hienTai = {} as Record<Lang, Record<string, string>>;
  for (const l of LANGS) hienTai[l] = ghepNoiDung(khoa, giaTri, l);
  return {
    khoa,
    muc,
    daLuu,
    hienTai,
    macDinh: muc.macDinh,
    daSua: Object.keys(daLuu).length > 0,
    suaLuc: suaLuc ? new Date(suaLuc).toISOString() : null,
  };
}

/** Mọi mục trong danh mục, theo đúng thứ tự khai báo. */
export async function lietKeNoiDung(): Promise<NoiDungDeSua[]> {
  const ds = await hoi<{ khoa: string; gia_tri: unknown; sua_luc: Date }>(
    "select khoa, gia_tri, sua_luc from noi_dung where khoa = any($1)",
    [KHOA_NOI_DUNG],
  );
  const theoKhoa = new Map(ds.map((d) => [d.khoa, d]));
  return KHOA_NOI_DUNG.map((k) => dung(k, theoKhoa.get(k)?.gia_tri, theoKhoa.get(k)?.sua_luc ?? null));
}

/** Một mục theo khoá. Trả null khi khoá không có trong danh mục. */
export async function layNoiDungDeSua(khoa: string): Promise<NoiDungDeSua | null> {
  if (!laKhoaNoiDung(khoa)) return null;
  const [d] = await hoi<{ gia_tri: unknown; sua_luc: Date }>("select gia_tri, sua_luc from noi_dung where khoa = $1", [khoa]);
  return dung(khoa, d?.gia_tri, d?.sua_luc ?? null);
}

/**
 * Ghi một mục (đã qua chuanNoiDung) + nhật ký, trong giao dịch `q`.
 * `giaTri` rỗng = không còn trường nào khác mặc định → XOÁ dòng, để bảng chỉ
 * chứa những gì thật sự đã sửa.
 */
export async function ghiNoiDung(q: Q, khoa: KhoaNoiDung, giaTri: NoiDungLuu | null): Promise<void> {
  const cu = (await q("select gia_tri from noi_dung where khoa = $1 for update", [khoa]))[0] as { gia_tri: unknown } | undefined;
  const rong = !giaTri || Object.keys(giaTri).length === 0;
  if (rong) {
    if (!cu) return; // vốn đang mặc định — không có gì để ghi, không ghi nhật ký thừa
    await q("delete from noi_dung where khoa = $1", [khoa]);
  } else {
    await q(
      "insert into noi_dung (khoa, gia_tri) values ($1, $2) on conflict (khoa) do update set gia_tri = excluded.gia_tri",
      [khoa, JSON.stringify(giaTri)],
    );
  }
  // `truoc` luôn mang đủ {khoa, gia_tri} — gia_tri null nghĩa là "trước đó là
  // mặc định", khôi phục về mục này tức là xoá dòng.
  await ghiNhatKy(q, cu ? "sua" : "them", "noi_dung", khoa, { khoa, gia_tri: cu?.gia_tri ?? null }, { khoa, gia_tri: rong ? null : giaTri });
}

/** Lưu một mục trong giao dịch riêng. */
export async function luuNoiDung(khoa: KhoaNoiDung, giaTri: NoiDungLuu | null): Promise<void> {
  await giaoDich((q) => ghiNoiDung(q, khoa, giaTri));
}
