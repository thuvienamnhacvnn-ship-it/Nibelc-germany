"use server";

import { giaoDich, ghiNhatKy } from "@/lib/db";
import { canhCong, lamMoiTrang, type KetQua } from "@/lib/quan-tri/chung";
import { RE_SLUG, chuanBaiViet, laLoaiBai, type LoaiBai } from "@/lib/quan-tri/bai-viet";
import { sapLai } from "@/lib/quan-tri/don-hang";

/**
 * VIỆC CỦA BÀI VIẾT (cẩm nang + cộng đồng). Mọi hàm chặn cổng ở dòng đầu, ghi
 * nhật ký trong cùng giao dịch với dữ liệu.
 */

const LOI_MAY_CHU = "Máy chủ đang trục trặc, chưa làm được. Thử lại sau ít phút.";

/** Trang công khai chịu ảnh hưởng. Hiện chỉ cẩm nang có trang; cộng đồng chưa có route. */
function lamMoiBai(loai: string, ...slug: (string | undefined)[]) {
  if (loai !== "cam-nang") return;
  lamMoiTrang("/cam-nang", ...slug.filter((s): s is string => !!s).map((s) => `/cam-nang/${s}`));
}

/**
 * Thêm hoặc sửa một bài. Dùng với useActionState.
 * Trường form: id, moi ("1" khi thêm mới), loai, slug, du_lieu (JSON), dich (JSON).
 */
export async function viecLuuBaiViet(_truoc: unknown, form: FormData): Promise<{ loi: string } | { xong: string; id: string; slug: string }> {
  await canhCong();
  const moi = String(form.get("moi") ?? "") === "1";
  const loai = String(form.get("loai") ?? "");
  if (!laLoaiBai(loai)) return { loi: "Loại bài không hợp lệ." };

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return { loi: "Thiếu đường dẫn (slug)." };
  if (!RE_SLUG.test(slug) || slug.length > 120) {
    return { loi: "Đường dẫn chỉ gồm chữ thường không dấu, số và gạch nối (vd: hoc-tieng-duc-bao-lau)." };
  }
  // Bài mới không cần nhân viên nghĩ thêm một mã riêng: lấy luôn đường dẫn.
  const id = String(form.get("id") ?? "").trim() || (moi ? slug : "");
  if (!id) return { loi: "Thiếu mã bài viết." };

  let duLieuVao: unknown;
  let dichVao: unknown;
  try {
    duLieuVao = JSON.parse(String(form.get("du_lieu") ?? "{}"));
    dichVao = JSON.parse(String(form.get("dich") ?? "{}"));
  } catch {
    return { loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };
  }
  const sach = chuanBaiViet(id, loai, duLieuVao, dichVao);
  if ("loi" in sach) return { loi: sach.loi };

  let slugCu: string | undefined;
  try {
    const kq = await giaoDich(async (q) => {
      const cu = ((await q("select * from bai_viet where id = $1 for update", [id]))[0] ?? null) as { slug: string; loai: string } | null;
      if (moi && cu) return "trung" as const;
      if (!moi && !cu) return "mat" as const;
      slugCu = cu?.slug;
      if (cu) {
        await q("update bai_viet set slug = $2, loai = $3, nhom = $4, du_lieu = $5, dich = $6 where id = $1", [
          id,
          slug,
          loai,
          sach.nhom,
          JSON.stringify(sach.duLieu),
          JSON.stringify(sach.dich),
        ]);
      } else {
        // bài mới lên ĐẦU danh sách của loại đó
        await q(
          `insert into bai_viet (id, slug, loai, nhom, thu_tu, du_lieu, dich)
           values ($1,$2,$3,$4, (select coalesce(max(thu_tu), 0) + 10 from bai_viet where loai = $3), $5,$6)`,
          [id, slug, loai, sach.nhom, JSON.stringify(sach.duLieu), JSON.stringify(sach.dich)],
        );
      }
      await ghiNhatKy(q, cu ? "sua" : "them", "bai_viet", id, cu, { id, slug, ten: sach.duLieu.tieuDe });
      return "xong" as const;
    });
    if (kq === "trung") return { loi: `Đã có bài mang mã "${id}". Đổi đường dẫn khác.` };
    if (kq === "mat") return { loi: "Bài này không còn nữa (có thể vừa bị xoá). Quay lại danh sách." };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    if (m.includes("bai_viet_slug_key")) return { loi: `Đường dẫn "${slug}" đã có bài khác dùng.` };
    console.error("[viec-bai-viet] lưu lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }

  lamMoiBai(loai, slug, slugCu !== slug ? slugCu : undefined);
  return { xong: "Đã lưu.", id, slug };
}

export async function viecAnHienBaiViet(id: string, hien: boolean): Promise<KetQua> {
  await canhCong();
  const bat = hien === true;
  try {
    const cu = await giaoDich(async (q) => {
      const c = (await q("select slug, loai, hien from bai_viet where id = $1 for update", [String(id)]))[0] as
        | { slug: string; loai: string; hien: boolean }
        | undefined;
      if (!c) return null;
      await q("update bai_viet set hien = $2 where id = $1", [String(id), bat]);
      await ghiNhatKy(q, bat ? "hien" : "an", "bai_viet", String(id), { slug: c.slug, hien: c.hien }, { hien: bat });
      return c;
    });
    if (!cu) return { loi: "Bài này không còn nữa." };
    lamMoiBai(cu.loai, cu.slug);
    return { xong: bat ? "Bài đã hiện trên web." : "Đã ẩn bài khỏi web." };
  } catch (e) {
    console.error("[viec-bai-viet] ẩn/hiện lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

export async function viecXoaBaiViet(id: string): Promise<KetQua> {
  await canhCong();
  try {
    const cu = await giaoDich(async (q) => {
      const c = (await q("select * from bai_viet where id = $1 for update", [String(id)]))[0] as { slug: string; loai: string } | undefined;
      if (!c) return null;
      await q("delete from bai_viet where id = $1", [String(id)]);
      // giữ nguyên bản cũ trong nhật ký — xoá nhầm còn khôi phục được
      await ghiNhatKy(q, "xoa", "bai_viet", String(id), c, null);
      return c;
    });
    if (!cu) return { loi: "Bài này không còn nữa." };
    lamMoiBai(cu.loai, cu.slug);
    return { xong: "Đã xoá bài. Vẫn khôi phục được ở mục Nhật ký." };
  } catch (e) {
    console.error("[viec-bai-viet] xoá lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

/** Sắp lại thứ tự bài trong MỘT loại. `ids` trên cùng đứng đầu; gửi một phần cũng được. */
export async function viecSapBaiViet(loai: LoaiBai, ids: string[]): Promise<KetQua> {
  await canhCong();
  if (!laLoaiBai(loai) || !Array.isArray(ids)) return { loi: "Danh sách thứ tự không đọc được." };
  try {
    const so = await giaoDich((q) => sapLai(q, "bai_viet", ids, loai));
    if (so > 0) lamMoiBai(loai);
    return { xong: so > 0 ? "Đã lưu thứ tự mới." : "Thứ tự không đổi." };
  } catch (e) {
    console.error("[viec-bai-viet] sắp thứ tự lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}
