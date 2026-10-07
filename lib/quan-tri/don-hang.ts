import { hoi, hoiMot } from "@/lib/db";
import { anhHopLe } from "@/lib/anh";
import type { JobFull } from "@/data/jobs";
import { chuanAnhDon, type BanDichDon } from "@/data/nguon";
import type { LoaiBai } from "@/lib/quan-tri/bai-viet";

/**
 * ĐƠN HÀNG — hàm đọc cho TRANG QUẢN TRỊ + việc sắp thứ tự dùng chung với bài
 * viết. Chỉ chạy ở máy chủ; KHÔNG tự kiểm đăng nhập.
 */

type Q = (sql: string, tham?: unknown[]) => Promise<unknown[]>;

/** Một dòng bảng `don_hang`, dạng trả ra cho giao diện quản trị. */
export type DonHangQT = {
  id: string;
  slug: string;
  nganh: string | null;
  nuoc: string | null;
  hien: boolean;
  noiBat: boolean;
  thuTu: number;
  /** ISO 8601 */
  taoLuc: string;
  suaLuc: string;
  /** bản tiếng Việt, nguyên như trong CSDL (ảnh: image, thumbnail, gallery) */
  duLieu: JobFull;
  dich: Partial<Record<"en" | "de", BanDichDon>>;
  /** đã có TÊN bản dịch — đúng điều kiện để đơn hiện ở /en, /de */
  coEn: boolean;
  coDe: boolean;
  /** ảnh để hiện trong danh sách — luôn là đường dẫn dùng được (đã lùi về ảnh ngành nếu đơn chưa có ảnh) */
  anhBia: string;
  /** số ảnh trong thư viện */
  soAnh: number;
};

type Dong = {
  id: string;
  slug: string;
  nganh: string | null;
  nuoc: string | null;
  hien: boolean;
  noi_bat: boolean;
  thu_tu: number;
  tao_luc: Date | string;
  sua_luc: Date | string;
  du_lieu: JobFull;
  dich: DonHangQT["dich"] | null;
};

function raDon(d: Dong): DonHangQT {
  const dich = d.dich ?? {};
  return {
    id: d.id,
    slug: d.slug,
    nganh: d.nganh,
    nuoc: d.nuoc,
    hien: d.hien,
    noiBat: d.noi_bat,
    thuTu: d.thu_tu,
    taoLuc: new Date(d.tao_luc).toISOString(),
    suaLuc: new Date(d.sua_luc).toISOString(),
    duLieu: { ...d.du_lieu, featured: d.noi_bat },
    dich,
    coEn: !!dich.en?.title?.trim(),
    coDe: !!dich.de?.title?.trim(),
    anhBia: chuanAnhDon(d.du_lieu).image,
    soAnh: Array.isArray(d.du_lieu.gallery) ? d.du_lieu.gallery.filter(anhHopLe).length : 0,
  };
}

/** Mọi đơn (cả đang ẩn), đúng thứ tự web hiển thị. */
export async function lietKeDonHang(): Promise<DonHangQT[]> {
  return (await hoi<Dong>("select * from don_hang order by thu_tu desc, sua_luc desc")).map(raDon);
}

/** Một đơn theo id (kể cả đang ẩn), hoặc null. */
export async function layDonHangDeSua(id: string): Promise<DonHangQT | null> {
  const d = await hoiMot<Dong>("select * from don_hang where id = $1", [id]);
  return d ? raDon(d) : null;
}

/**
 * Dọn ba trường ảnh của đơn trước khi lưu. Trả chuỗi lỗi khi có đường dẫn sai.
 *
 * `thumbnail` LUÔN bằng `image` (chốt 06/10): form chỉ có một ô "ảnh bìa",
 * để hai trường lệch nhau thì thẻ đơn ở danh sách hiện ảnh này mà trang chi
 * tiết hiện ảnh kia, nhân viên không có cách nào sửa.
 */
export function chuanAnhKhiLuu(duLieu: Record<string, unknown>): string | null {
  const gallery: string[] = [];
  if (duLieu.gallery !== undefined && duLieu.gallery !== null) {
    if (!Array.isArray(duLieu.gallery)) return "Thư viện ảnh không đọc được. Tải lại trang rồi thử lại.";
    for (const a of duLieu.gallery) {
      if (!anhHopLe(a)) return "Thư viện ảnh có đường dẫn không hợp lệ — chỉ nhận ảnh trong kho (/kho/…) hoặc /assets/….";
      if (!gallery.includes(a)) gallery.push(a);
    }
  }
  if (gallery.length > 40) return "Thư viện ảnh tối đa 40 tấm.";
  const image = typeof duLieu.image === "string" ? duLieu.image.trim() : "";
  if (image && !anhHopLe(image)) return "Ảnh bìa không hợp lệ — chọn ảnh trong kho (/kho/…) hoặc /assets/….";
  // Chưa chọn ảnh bìa: lấy tấm đầu thư viện; không có nữa thì để rỗng, web tự
  // dùng ảnh chung của nhóm ngành (chuanAnhDon trong data/nguon.ts).
  duLieu.image = image || gallery[0] || "";
  duLieu.thumbnail = duLieu.image;
  duLieu.gallery = gallery;
  return null;
}

/**
 * Sắp lại thứ tự. `ids` = các id theo thứ tự mong muốn, TRÊN CÙNG ĐỨNG ĐẦU.
 *
 * Nhận cả danh sách đầy đủ lẫn một phần (giao diện đang lọc): các bản ghi
 * được gửi đổi chỗ cho nhau trong ĐÚNG NHỮNG VỊ TRÍ chúng đang chiếm, bản ghi
 * không gửi đứng yên. Sau đó đánh số lại cả bảng cách nhau 10 — số cũ có thể
 * trùng nhau (đơn thêm từ trước đều mang 0), đổi chỗ trên số trùng là vô nghĩa.
 *
 * Trả về số bản ghi đổi vị trí. Tự ghi một dòng nhật ký (không khôi phục được:
 * `truoc` để trống có chủ ý, thứ tự cũ nằm trong `sau.truoc`).
 */
export async function sapLai(q: Q, bang: "don_hang" | "bai_viet", ids: string[], loai?: LoaiBai): Promise<number> {
  const ds = (
    bang === "don_hang"
      ? await q("select id, thu_tu from don_hang order by thu_tu desc, sua_luc desc for update")
      : await q("select id, thu_tu from bai_viet where loai = $1 order by thu_tu desc, tao_luc desc for update", [loai])
  ) as { id: string; thu_tu: number }[];

  const hienCo = new Set(ds.map((d) => d.id));
  const muon = [...new Set(ids.map(String))].filter((id) => hienCo.has(id));
  if (muon.length < 2) return 0;

  const trongNhom = new Set(muon);
  const thuTuMoi = ds.map((d) => d.id);
  const cho = thuTuMoi.flatMap((id, i) => (trongNhom.has(id) ? [i] : []));
  cho.forEach((viTri, i) => (thuTuMoi[viTri] = muon[i]!));

  const cu = new Map(ds.map((d) => [d.id, d.thu_tu]));
  const truoc: Record<string, number> = {};
  const sau: Record<string, number> = {};
  for (const [i, id] of thuTuMoi.entries()) {
    const so = (thuTuMoi.length - i) * 10;
    if (cu.get(id) === so) continue;
    truoc[id] = cu.get(id)!;
    sau[id] = so;
    await q(`update ${bang} set thu_tu = $2 where id = $1`, [id, so]);
  }
  const doiCho = thuTuMoi.filter((id, i) => ds[i]!.id !== id).length;
  if (Object.keys(sau).length > 0) {
    await q("insert into nhat_ky (viec, bang, ban_ghi, truoc, sau) values ('sua', $1, null, null, $2)", [
      bang,
      JSON.stringify({ sapXep: true, loai: loai ?? null, truoc, sau }),
    ]);
  }
  return doiCho;
}
