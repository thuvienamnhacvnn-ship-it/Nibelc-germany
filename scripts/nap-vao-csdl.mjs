#!/usr/bin/env node
/**
 * NẠP DỮ LIỆU VÀO CSDL — chạy TRÊN MÁY CHỦ.
 *
 *   set -a; . /opt/nibelc/.env.production.local; set +a
 *   node scripts/nap-vao-csdl.mjs _xuat-csdl.json
 *
 * Node thuần, KHÔNG đọc file .ts — máy chủ chạy Node 22 không bỏ kiểu được.
 *
 * Chạy lại nhiều lần được: bản ghi đã có thì CẬP NHẬT theo id, chưa có thì
 * thêm mới. Cố tình KHÔNG xoá gì cả — nếu nhân viên đã sửa một đơn trong
 * trang quản trị rồi mình chạy lại script này, nó ghi đè bản sửa đó, nhưng
 * không làm mất đơn nào. Muốn nạp lại từ đầu thì xoá bảng bằng tay.
 */
import fs from "node:fs";
import pg from "pg";

const tep = process.argv[2] || "_xuat-csdl.json";
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Thiếu DATABASE_URL. Chạy: set -a; . /opt/nibelc/.env.production.local; set +a");
  process.exit(1);
}

const d = JSON.parse(fs.readFileSync(tep, "utf8"));
const pool = new pg.Pool({ connectionString: url });
const c = await pool.connect();

try {
  await c.query("begin");

  let themDon = 0, suaDon = 0;
  for (const x of d.donHang) {
    const r = await c.query(
      `insert into don_hang (id, slug, nganh, nuoc, hien, noi_bat, thu_tu, du_lieu, dich)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (id) do update set
         slug = excluded.slug, nganh = excluded.nganh, nuoc = excluded.nuoc,
         noi_bat = excluded.noi_bat, du_lieu = excluded.du_lieu, dich = excluded.dich
       returning (xmax = 0) as la_moi`,
      [x.id, x.slug, x.nganh, x.nuoc, x.hien, x.noi_bat, x.thu_tu, x.du_lieu, x.dich],
    );
    r.rows[0].la_moi ? themDon++ : suaDon++;
  }

  let themBai = 0, suaBai = 0;
  for (const x of d.baiViet) {
    const r = await c.query(
      `insert into bai_viet (id, slug, loai, nhom, hien, thu_tu, du_lieu, dich)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (id) do update set
         slug = excluded.slug, loai = excluded.loai, nhom = excluded.nhom,
         du_lieu = excluded.du_lieu, dich = excluded.dich
       returning (xmax = 0) as la_moi`,
      [x.id, x.slug, x.loai, x.nhom, x.hien, x.thu_tu, x.du_lieu, x.dich],
    );
    r.rows[0].la_moi ? themBai++ : suaBai++;
  }

  await c.query("insert into nhat_ky (viec, bang, ban_ghi, sau) values ($1,$2,$3,$4)", [
    "them",
    "nap-ban-dau",
    null,
    JSON.stringify({ donHang: d.donHang.length, baiViet: d.baiViet.length, xuatLuc: d.xuatLuc }),
  ]);

  await c.query("commit");
  console.log(`đơn hàng : thêm ${themDon}, cập nhật ${suaDon}`);
  console.log(`bài viết : thêm ${themBai}, cập nhật ${suaBai}`);
} catch (e) {
  await c.query("rollback");
  console.error("LỖI, đã huỷ toàn bộ:", e.message);
  process.exit(1);
} finally {
  c.release();
  await pool.end();
}
