import { ghiNhatKy, hoi } from "@/lib/db";
import { khoiPhucNhanAnh } from "@/lib/quan-tri/kho-anh";
import { laKhoaNoiDung, mucNoiDung } from "@/lib/quan-tri/noi-dung";
import { ghiNoiDung } from "@/lib/quan-tri/noi-dung-csdl";

/**
 * NHẬT KÝ — đọc để hiển thị, và khôi phục một bản ghi về bản trước thay đổi.
 * Chỉ chạy ở máy chủ; KHÔNG tự kiểm đăng nhập.
 *
 * Cả đội dùng chung một tài khoản nên không biết AI sửa. Bù lại nhật ký giữ
 * bản TRƯỚC khi sửa, nên xoá nhầm hay gõ sai vẫn lấy lại được.
 */

type Q = (sql: string, tham?: unknown[]) => Promise<unknown[]>;

export type MucNhatKy = {
  id: number;
  /** ISO 8601 */
  luc: string;
  /** them | sua | xoa | hien | an */
  viec: string;
  /** don_hang | bai_viet | noi_dung | anh | nap-ban-dau */
  bang: string;
  banGhi: string | null;
  /** tên cho người đọc: tên đơn, tiêu đề bài, nhãn mục nội dung, tên file ảnh */
  ten: string | null;
  /** câu tiếng Việt mô tả việc đã làm */
  moTa: string;
  /** chỉ hiện nút Khôi phục khi true */
  khoiPhucDuoc: boolean;
};

const TEN_BANG: Record<string, string> = {
  don_hang: "đơn hàng",
  bai_viet: "bài viết",
  noi_dung: "banner",
  anh: "ảnh",
};
const TEN_VIEC: Record<string, string> = { them: "Thêm", sua: "Sửa", xoa: "Xoá", hien: "Cho hiện", an: "Ẩn" };

type DongLietKe = {
  id: string;
  luc: Date | string;
  viec: string;
  bang: string;
  ban_ghi: string | null;
  ten: string | null;
  du_ban: boolean;
  mot_phan: boolean;
  la_noi_dung: boolean;
  noi_bat_moi: string;
  ve_mac_dinh: boolean;
  nhan_anh: boolean;
  sap_xep: boolean;
  thay_file: boolean;
  khoi_phuc: boolean;
};

/** Các dòng nhật ký gần nhất, mới trước. Không kéo `truoc`/`sau` ra — chúng có thể rất nặng. */
export async function lietKeNhatKy(gioiHan = 200): Promise<MucNhatKy[]> {
  const n = Math.min(500, Math.max(1, Math.floor(gioiHan) || 200));
  const ds = await hoi<DongLietKe>(
    `select id::text, luc, viec, bang, ban_ghi,
            coalesce(truoc->'du_lieu'->>'title', truoc->'du_lieu'->>'tieuDe', sau->>'ten',
                     truoc->>'ten_goc', sau->>'ten_goc',
                     -- dòng ẩn/hiện/nổi bật chỉ giữ vài cột, không có tên: tra tên ĐANG CÓ của bản ghi,
                     -- hết cách mới dùng slug (bản ghi đã xoá)
                     case when bang = 'don_hang' then (select d.du_lieu->>'title' from don_hang d where d.id = nhat_ky.ban_ghi)
                          when bang = 'bai_viet' then (select b.du_lieu->>'tieuDe' from bai_viet b where b.id = nhat_ky.ban_ghi) end,
                     truoc->>'slug', sau->>'slug') as ten,
            coalesce(sau->>'noi_bat', '') as noi_bat_moi,
            coalesce(sau ? 'khoa' and sau->'gia_tri' = 'null'::jsonb, false) as ve_mac_dinh,
            coalesce(truoc ? 'du_lieu', false) as du_ban,
            coalesce(truoc ? 'hien' or truoc ? 'noi_bat', false) as mot_phan,
            coalesce(truoc ? 'khoa', false) as la_noi_dung,
            coalesce(truoc->>'tep' = sau->>'tep', false) as nhan_anh,
            coalesce(sau ? 'sapXep', false) as sap_xep,
            coalesce(sau ? 'thayFile', false) as thay_file,
            coalesce(sau ? 'khoiPhucTu' or sau ? 'khoiPhuc', false) as khoi_phuc
       from nhat_ky order by luc desc, id desc limit $1`,
    [n],
  );
  return ds.map((d) => {
    const laBanGhi = d.bang === "don_hang" || d.bang === "bai_viet";
    const bang = TEN_BANG[d.bang] ?? d.bang;
    let moTa = `${TEN_VIEC[d.viec] ?? d.viec} ${bang}`;
    if (d.sap_xep) moTa = `Sắp lại thứ tự ${bang}`;
    else if (d.thay_file) moTa = "Thay file ảnh";
    else if (d.khoi_phuc) moTa = `Khôi phục ${bang}`;
    else if (d.bang === "nap-ban-dau") moTa = "Nạp dữ liệu ban đầu";
    else if (laBanGhi && d.viec === "sua" && d.mot_phan && !d.du_ban) {
      moTa = d.noi_bat_moi === "true" ? `Bật nổi bật ${bang}` : d.noi_bat_moi === "false" ? `Tắt nổi bật ${bang}` : `Đổi “nổi bật” của ${bang}`;
    }
    // banner: lần lưu đầu là "them" trong CSDL nhưng với nhân viên vẫn là SỬA banner có sẵn
    else if (d.bang === "noi_dung") moTa = d.ve_mac_dinh ? "Khôi phục mặc định banner" : "Sửa banner";
    return {
      id: Number(d.id),
      luc: new Date(d.luc).toISOString(),
      viec: d.viec,
      bang: d.bang,
      banGhi: d.ban_ghi,
      ten: d.bang === "noi_dung" && laKhoaNoiDung(d.ban_ghi) ? mucNoiDung(d.ban_ghi).tenTrang.replace(/^(?!Trang )/, "Trang ") : d.ten,
      moTa,
      khoiPhucDuoc:
        (laBanGhi && (d.du_ban || d.mot_phan)) ||
        (d.bang === "noi_dung" && d.la_noi_dung && laKhoaNoiDung(d.ban_ghi)) ||
        (d.bang === "anh" && d.viec === "sua" && d.nhan_anh),
    };
  });
}

type DongNhatKy = { id: string; viec: string; bang: string; ban_ghi: string | null; truoc: Record<string, unknown> | null };

/** Ném lỗi này khi mục không khôi phục được — thông điệp hiện thẳng cho nhân viên. */
export class LoiKhoiPhuc extends Error {}

const js = (x: unknown) => JSON.stringify(x ?? {});

/**
 * Trả một bản ghi về bản TRƯỚC thay đổi ghi ở dòng nhật ký `id`, trong giao
 * dịch `q`. Trả về các đường dẫn công khai cần dựng lại.
 *
 * `truoc` có hai dạng:
 *   - cả dòng (sau khi sửa/xoá): ghi đè lại toàn bộ, bản ghi đã xoá thì tạo lại;
 *   - vài cột (sau khi ẩn/hiện, bật/tắt nổi bật): chỉ trả đúng mấy cột đó.
 * Lần khôi phục nào cũng ghi một dòng nhật ký mới kèm bản đang có, nên chính
 * việc khôi phục cũng hoàn tác được.
 */
export async function khoiPhucTuNhatKy(q: Q, id: number): Promise<string[]> {
  const n = (await q("select id::text, viec, bang, ban_ghi, truoc from nhat_ky where id = $1", [id]))[0] as DongNhatKy | undefined;
  const t = n?.truoc;
  if (!n || !t) throw new LoiKhoiPhuc("Mục nhật ký này không có bản cũ để khôi phục.");

  if (n.bang === "noi_dung") {
    const khoa = t.khoa;
    // chặn cứng: không bao giờ ghi vào khoá ngoài danh mục (he-thong.mat-khau)
    if (!laKhoaNoiDung(khoa)) throw new LoiKhoiPhuc("Mục nhật ký này không khôi phục được.");
    await ghiNoiDung(q, khoa, (t.gia_tri as Record<string, Record<string, string>> | null) ?? null);
    const trang = mucNoiDung(khoa).trang;
    return trang === "/cam-nang" ? [trang, "/cam-nang/[bai]"] : [trang];
  }

  if (n.bang === "anh") {
    if (n.viec !== "sua") throw new LoiKhoiPhuc("Ảnh đã xoá không khôi phục được — file không còn trên đĩa.");
    try {
      await khoiPhucNhanAnh(q, t);
    } catch (e) {
      throw new LoiKhoiPhuc(e instanceof Error ? e.message : "Không khôi phục được ảnh này.");
    }
    return [];
  }

  if (n.bang !== "don_hang" && n.bang !== "bai_viet") throw new LoiKhoiPhuc("Mục nhật ký này không khôi phục được.");
  const laDon = n.bang === "don_hang";
  const maBanGhi = String(t.id ?? n.ban_ghi ?? "");
  const nay = (await q(`select * from ${n.bang} where id = $1 for update`, [maBanGhi]))[0] as Record<string, unknown> | undefined;
  const tenCua = (d: Record<string, unknown> | undefined) => {
    const dl = d?.du_lieu as Record<string, unknown> | undefined;
    return String(dl?.title ?? dl?.tieuDe ?? d?.slug ?? maBanGhi);
  };
  let slug: string;

  if (t.du_lieu) {
    // ── cả dòng ──
    slug = String(t.slug);
    if (laDon) {
      await q(
        `insert into don_hang (id, slug, nganh, nuoc, hien, noi_bat, thu_tu, du_lieu, dich)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         on conflict (id) do update set
           slug=excluded.slug, nganh=excluded.nganh, nuoc=excluded.nuoc, hien=excluded.hien,
           noi_bat=excluded.noi_bat, thu_tu=excluded.thu_tu, du_lieu=excluded.du_lieu, dich=excluded.dich`,
        [t.id, t.slug, t.nganh ?? null, t.nuoc ?? null, t.hien ?? true, t.noi_bat ?? false, t.thu_tu ?? 0, js(t.du_lieu), js(t.dich)],
      );
    } else {
      await q(
        `insert into bai_viet (id, slug, loai, nhom, hien, thu_tu, du_lieu, dich)
         values ($1,$2,$3,$4,$5,$6,$7,$8)
         on conflict (id) do update set
           slug=excluded.slug, loai=excluded.loai, nhom=excluded.nhom, hien=excluded.hien,
           thu_tu=excluded.thu_tu, du_lieu=excluded.du_lieu, dich=excluded.dich`,
        [t.id, t.slug, t.loai, t.nhom ?? null, t.hien ?? true, t.thu_tu ?? 0, js(t.du_lieu), js(t.dich)],
      );
    }
    await ghiNhatKy(q, nay ? "sua" : "them", n.bang, maBanGhi, nay ?? null, { id: maBanGhi, slug, ten: tenCua(t), khoiPhucTu: id });
  } else {
    // ── vài cột (ẩn/hiện, nổi bật) ──
    if (!nay) throw new LoiKhoiPhuc("Bản ghi này đã bị xoá. Tìm dòng “Xoá” của nó trong nhật ký rồi khôi phục từ dòng đó.");
    slug = String(nay.slug);
    let co = false;
    if (typeof t.hien === "boolean") {
      await q(`update ${n.bang} set hien = $2 where id = $1`, [maBanGhi, t.hien]);
      co = true;
    }
    if (laDon && typeof t.noi_bat === "boolean") {
      await q("update don_hang set noi_bat = $2, du_lieu = jsonb_set(du_lieu, '{featured}', to_jsonb($2::boolean)) where id = $1", [maBanGhi, t.noi_bat]);
      co = true;
    }
    if (!co) throw new LoiKhoiPhuc("Mục nhật ký này không khôi phục được.");
    await ghiNhatKy(q, "sua", n.bang, maBanGhi, { slug, hien: nay.hien, ...(laDon ? { noi_bat: nay.noi_bat } : {}) }, { id: maBanGhi, slug, ten: tenCua(nay), khoiPhucTu: id });
  }

  const cu = nay && nay.slug !== slug ? [laDon ? `/don-hang/${String(nay.slug)}` : `/cam-nang/${String(nay.slug)}`] : [];
  return laDon ? ["/", "/don-hang", `/don-hang/${slug}`, ...cu] : ["/cam-nang", `/cam-nang/${slug}`, ...cu];
}
