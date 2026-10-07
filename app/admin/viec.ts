"use server";

import { redirect } from "next/navigation";
import { giaoDich, ghiNhatKy } from "@/lib/db";
import { datMatKhauLanDau, doiMatKhau, ra, vao } from "@/lib/quan-tri/dang-nhap";
import { canhCong, lamMoiTrang, type KetQua } from "@/lib/quan-tri/chung";
import { RE_SLUG } from "@/lib/quan-tri/bai-viet";
import { chuanAnhKhiLuu, sapLai } from "@/lib/quan-tri/don-hang";
import { LoiKhoiPhuc, khoiPhucTuNhatKy } from "@/lib/quan-tri/nhat-ky";

/**
 * VIỆC CỦA TRANG QUẢN TRỊ — chạy trên máy chủ.
 *
 * MỌI hàm sửa dữ liệu đều gọi `canhCong()` ở dòng đầu. Không dựa vào việc
 * trang đã chặn: server action là một điểm vào HTTP riêng, ai biết tên hàm là
 * gọi thẳng được, trang có chặn cũng không cứu.
 *
 * File này giữ đăng nhập, đơn hàng và khôi phục. Các mảng khác:
 *   viec-anh.ts       kho ảnh (sửa nhãn, xoá)
 *   viec-bai-viet.ts  bài viết
 *   viec-noi-dung.ts  chữ + ảnh banner các trang
 */

const LOI_MAY_CHU = "Máy chủ đang trục trặc, chưa làm được. Thử lại sau ít phút.";

// ──────────────────────────── đăng nhập ────────────────────────────

export async function viecDatMatKhau(_truoc: unknown, form: FormData) {
  const mk = String(form.get("mat_khau") ?? "");
  const lai = String(form.get("nhac_lai") ?? "");
  if (mk !== lai) return { loi: "Hai ô mật khẩu không giống nhau." };
  const r = await datMatKhauLanDau(mk);
  if (!r.ok) return { loi: r.loi! };
  await vao(mk);
  redirect("/admin");
}

export async function viecVao(_truoc: unknown, form: FormData) {
  const r = await vao(String(form.get("mat_khau") ?? ""));
  if (!r.ok) return { loi: r.loi! };
  redirect("/admin");
}

export async function viecRa() {
  await ra();
  redirect("/admin");
}

export async function viecDoiMatKhau(_truoc: unknown, form: FormData) {
  await canhCong();
  const r = await doiMatKhau(String(form.get("cu") ?? ""), String(form.get("moi") ?? ""));
  return r.ok ? { xong: "Đã đổi mật khẩu. Mọi máy đang đăng nhập bị thoát ra." } : { loi: r.loi! };
}

// ──────────────────────────── đơn hàng ────────────────────────────

export async function viecLuuDonHang(_truoc: unknown, form: FormData): Promise<{ loi: string } | { xong: string }> {
  await canhCong();
  const id = String(form.get("id") ?? "").trim();
  if (!id) return { loi: "Thiếu mã đơn hàng." };

  let duLieu: Record<string, unknown>;
  let dich: Record<string, unknown>;
  try {
    duLieu = JSON.parse(String(form.get("du_lieu") ?? "{}"));
    dich = JSON.parse(String(form.get("dich") ?? "{}"));
  } catch {
    return { loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };
  }
  if (!duLieu || typeof duLieu !== "object" || Array.isArray(duLieu) || !dich || typeof dich !== "object" || Array.isArray(dich)) {
    return { loi: "Dữ liệu gửi lên không đọc được. Tải lại trang rồi thử lại." };
  }

  const slug = String(duLieu.slug ?? "").trim();
  if (!slug) return { loi: "Thiếu đường dẫn (slug)." };
  // Đường dẫn có dấu, khoảng trắng hay gạch chéo thì link chia sẻ ra ngoài bị
  // mã hoá thành một chuỗi %C4%91… hoặc trỏ sang route khác.
  if (!RE_SLUG.test(slug)) return { loi: "Đường dẫn chỉ gồm chữ thường không dấu, số và gạch nối (vd: phu-bep-tai-berlin)." };
  if (!String(duLieu.title ?? "").trim()) return { loi: "Chưa có tên đơn hàng." };
  duLieu.id = id;
  duLieu.slug = slug;

  const loiAnh = chuanAnhKhiLuu(duLieu);
  if (loiAnh) return { loi: loiAnh };

  let slugCu: string | undefined;
  try {
    await giaoDich(async (q) => {
      const cu = ((await q("select * from don_hang where id = $1 for update", [id]))[0] ?? null) as
        | { slug: string; noi_bat: boolean }
        | null;
      slugCu = cu?.slug;
      // Cột noi_bat là nguồn chính; `featured` trong du_lieu chép theo nó để
      // hai nơi không lệch. Đơn mới thì lấy theo form.
      const noiBat = cu ? cu.noi_bat : !!duLieu.featured;
      duLieu.featured = noiBat;
      // Đơn mới lên ĐẦU danh sách: nhân viên vừa thêm xong mà phải cuộn xuống
      // cuối mới thấy thì tưởng là chưa lưu.
      await q(
        `insert into don_hang (id, slug, nganh, nuoc, noi_bat, thu_tu, du_lieu, dich)
         values ($1,$2,$3,$4,$5, (select coalesce(max(thu_tu), 0) + 10 from don_hang), $6,$7)
         on conflict (id) do update set
           slug = excluded.slug, nganh = excluded.nganh, nuoc = excluded.nuoc,
           du_lieu = excluded.du_lieu, dich = excluded.dich`,
        [id, slug, duLieu.industryId ?? null, duLieu.state ?? null, noiBat, JSON.stringify(duLieu), JSON.stringify(dich)],
      );
      await ghiNhatKy(q, cu ? "sua" : "them", "don_hang", id, cu, { id, slug, ten: duLieu.title });
    });
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    if (m.includes("don_hang_slug_key")) return { loi: `Đường dẫn "${slug}" đã có đơn khác dùng.` };
    console.error("[viec] lưu đơn hàng lỗi:", e);
    return { loi: "Không lưu được: " + m };
  }

  lamMoiTrang("/", "/don-hang", `/don-hang/${slug}`, ...(slugCu && slugCu !== slug ? [`/don-hang/${slugCu}`] : []));
  return { xong: "Đã lưu." };
}

export async function viecAnHien(id: string, hien: boolean) {
  await canhCong();
  const d = await giaoDich(async (q) => {
    const cu = (await q("select slug, hien from don_hang where id = $1", [id]))[0] as { slug: string } | undefined;
    await q("update don_hang set hien = $2 where id = $1", [id, hien]);
    await ghiNhatKy(q, hien ? "hien" : "an", "don_hang", id, cu, { hien });
    return cu;
  });
  lamMoiTrang("/", "/don-hang", d ? `/don-hang/${d.slug}` : "/don-hang");
}

export async function viecXoaDonHang(id: string) {
  await canhCong();
  const d = await giaoDich(async (q) => {
    const cu = (await q("select * from don_hang where id = $1", [id]))[0] as { slug: string } | undefined;
    await q("delete from don_hang where id = $1", [id]);
    // giữ nguyên bản cũ trong nhật ký — xoá nhầm còn khôi phục được
    await ghiNhatKy(q, "xoa", "don_hang", id, cu, null);
    return cu;
  });
  lamMoiTrang("/", "/don-hang", d ? `/don-hang/${d.slug}` : "/don-hang");
}

/**
 * Sắp lại thứ tự đơn hàng. `ids` = các id theo thứ tự mong muốn, trên cùng
 * đứng đầu; gửi một phần danh sách cũng được (xem sapLai).
 */
export async function viecSapDonHang(ids: string[]): Promise<KetQua> {
  await canhCong();
  if (!Array.isArray(ids)) return { loi: "Danh sách thứ tự không đọc được." };
  try {
    const so = await giaoDich((q) => sapLai(q, "don_hang", ids));
    if (so > 0) lamMoiTrang("/", "/don-hang");
    return { xong: so > 0 ? "Đã lưu thứ tự mới." : "Thứ tự không đổi." };
  } catch (e) {
    console.error("[viec] sắp đơn hàng lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

/** Bật/tắt “nổi bật”. Ghi cả cột `noi_bat` lẫn `du_lieu.featured` để hai nơi không lệch. */
export async function viecNoiBat(id: string, noiBat: boolean): Promise<KetQua> {
  await canhCong();
  const bat = noiBat === true;
  try {
    const cu = await giaoDich(async (q) => {
      const c = (await q("select slug, noi_bat from don_hang where id = $1 for update", [String(id)]))[0] as
        | { slug: string; noi_bat: boolean }
        | undefined;
      if (!c) return null;
      await q("update don_hang set noi_bat = $2, du_lieu = jsonb_set(du_lieu, '{featured}', to_jsonb($2::boolean)) where id = $1", [String(id), bat]);
      await ghiNhatKy(q, "sua", "don_hang", String(id), c, { noi_bat: bat });
      return c;
    });
    if (!cu) return { loi: "Đơn này không còn nữa." };
    lamMoiTrang("/", "/don-hang", `/don-hang/${cu.slug}`);
    return { xong: bat ? "Đã đánh dấu nổi bật." : "Đã bỏ nổi bật." };
  } catch (e) {
    console.error("[viec] đổi nổi bật lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}

// ──────────────────────────── khôi phục ────────────────────────────

/**
 * Trả một bản ghi về bản TRƯỚC thay đổi ghi ở dòng nhật ký `nhatKyId`.
 * Chạy cho đơn hàng, bài viết, nội dung trang và nhãn ảnh — chi tiết ở
 * lib/quan-tri/nhat-ky.ts. File ảnh đã thay/xoá thì không lấy lại được.
 */
export async function viecKhoiPhuc(nhatKyId: number): Promise<KetQua> {
  await canhCong();
  try {
    const trang = await giaoDich((q) => khoiPhucTuNhatKy(q, Number(nhatKyId)));
    lamMoiTrang(...trang);
    return { xong: "Đã khôi phục." };
  } catch (e) {
    if (e instanceof LoiKhoiPhuc) return { loi: e.message };
    const m = e instanceof Error ? e.message : String(e);
    if (m.includes("_slug_key")) return { loi: "Không khôi phục được: đường dẫn của bản cũ nay đã có bản ghi khác dùng." };
    console.error("[viec] khôi phục lỗi:", e);
    return { loi: LOI_MAY_CHU };
  }
}
