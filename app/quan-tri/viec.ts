"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { giaoDich, ghiNhatKy, hoi, hoiMot } from "@/lib/db";
import { daVao, datMatKhauLanDau, doiMatKhau, ra, vao } from "@/lib/quan-tri/dang-nhap";

/**
 * VIỆC CỦA TRANG QUẢN TRỊ — chạy trên máy chủ.
 *
 * MỌI hàm sửa dữ liệu đều gọi `canhCong()` ở dòng đầu. Không dựa vào việc
 * trang đã chặn: server action là một điểm vào HTTP riêng, ai biết tên hàm là
 * gọi thẳng được, trang có chặn cũng không cứu.
 */

async function canhCong() {
  if (!(await daVao())) throw new Error("Chưa đăng nhập");
}

/** Sau khi sửa dữ liệu phải dựng lại trang công khai, nếu không web vẫn trả
    bản cũ đã lưu sẵn và nhân viên tưởng mình sửa hụt. Dựng cho cả ba ngôn ngữ. */
function lamMoiTrang(...duongDan: string[]) {
  for (const d of duongDan) {
    for (const tien of ["", "/en", "/de"]) {
      revalidatePath(`${tien}${d}`);
    }
  }
}

// ──────────────────────────── đăng nhập ────────────────────────────

export async function viecDatMatKhau(_truoc: unknown, form: FormData) {
  const mk = String(form.get("mat_khau") ?? "");
  const lai = String(form.get("nhac_lai") ?? "");
  if (mk !== lai) return { loi: "Hai ô mật khẩu không giống nhau." };
  const r = await datMatKhauLanDau(mk);
  if (!r.ok) return { loi: r.loi! };
  await vao(mk);
  redirect("/quan-tri");
}

export async function viecVao(_truoc: unknown, form: FormData) {
  const r = await vao(String(form.get("mat_khau") ?? ""));
  if (!r.ok) return { loi: r.loi! };
  redirect("/quan-tri");
}

export async function viecRa() {
  await ra();
  redirect("/quan-tri");
}

export async function viecDoiMatKhau(_truoc: unknown, form: FormData) {
  await canhCong();
  const r = await doiMatKhau(String(form.get("cu") ?? ""), String(form.get("moi") ?? ""));
  return r.ok ? { xong: "Đã đổi mật khẩu. Mọi máy đang đăng nhập bị thoát ra." } : { loi: r.loi! };
}

// ──────────────────────────── đơn hàng ────────────────────────────

export async function viecLuuDonHang(_truoc: unknown, form: FormData) {
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

  const slug = String(duLieu.slug ?? "").trim();
  if (!slug) return { loi: "Thiếu đường dẫn (slug)." };

  try {
    await giaoDich(async (q) => {
      const cu = (await q("select * from don_hang where id = $1", [id]))[0] ?? null;
      await q(
        `insert into don_hang (id, slug, nganh, nuoc, du_lieu, dich)
         values ($1,$2,$3,$4,$5,$6)
         on conflict (id) do update set
           slug = excluded.slug, nganh = excluded.nganh, nuoc = excluded.nuoc,
           du_lieu = excluded.du_lieu, dich = excluded.dich`,
        [id, slug, duLieu.industryId ?? null, duLieu.state ?? null, duLieu, dich],
      );
      await ghiNhatKy(q, cu ? "sua" : "them", "don_hang", id, cu, { id, slug });
    });
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    if (m.includes("don_hang_slug_key")) return { loi: `Đường dẫn "${slug}" đã có đơn khác dùng.` };
    return { loi: "Không lưu được: " + m };
  }

  lamMoiTrang("/", "/don-hang", `/don-hang/${slug}`);
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

export async function viecKhoiPhuc(nhatKyId: number) {
  await canhCong();
  const d = await giaoDich(async (q) => {
    const n = (await q("select * from nhat_ky where id = $1", [nhatKyId]))[0] as
      | { bang: string; ban_ghi: string; truoc: Record<string, unknown> }
      | undefined;
    if (!n?.truoc || n.bang !== "don_hang") throw new Error("Mục nhật ký này không khôi phục được.");
    const t = n.truoc;
    await q(
      `insert into don_hang (id, slug, nganh, nuoc, hien, noi_bat, thu_tu, du_lieu, dich)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (id) do update set
         slug=excluded.slug, nganh=excluded.nganh, nuoc=excluded.nuoc, hien=excluded.hien,
         noi_bat=excluded.noi_bat, thu_tu=excluded.thu_tu, du_lieu=excluded.du_lieu, dich=excluded.dich`,
      [t.id, t.slug, t.nganh, t.nuoc, t.hien, t.noi_bat, t.thu_tu, t.du_lieu, t.dich],
    );
    await ghiNhatKy(q, "them", "don_hang", String(t.id), null, { khoiPhucTu: nhatKyId });
    return t as { slug: string };
  });
  lamMoiTrang("/", "/don-hang", `/don-hang/${d.slug}`);
}

