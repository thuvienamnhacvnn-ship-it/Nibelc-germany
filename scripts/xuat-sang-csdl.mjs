#!/usr/bin/env node
/**
 * XUẤT DỮ LIỆU HIỆN CÓ RA MỘT TỆP JSON ĐỂ NẠP VÀO CSDL.
 *
 *   node scripts/xuat-sang-csdl.mjs          → ghi ra _xuat-csdl.json
 *
 * VÌ SAO TÁCH LÀM HAI BƯỚC (xuất ở đây, nạp trên máy chủ)
 * Dữ liệu gốc nằm trong file .ts, đọc được thì cần Node ≥ 23.6 tự bỏ kiểu.
 * Máy trạm có Node 24 nên đọc tốt; máy chủ chạy Node 22.22.1 KHÔNG kèm bộ bỏ
 * kiểu (đã dính lỗi ERR_NO_TYPESCRIPT làm chết deploy hôm 02/10). Nên máy
 * trạm xuất ra JSON thuần, máy chủ chỉ việc nạp — không cần đọc .ts.
 *
 * Tệp xuất ra KHÔNG commit (đã có trong .gitignore): nó chỉ là bản trung gian.
 */
import fs from "node:fs";
import { napTs } from "./nap-ts.mjs";

const { JOBS } = await napTs("data/jobs.ts");
const { CAM_NANG } = await napTs("data/articles.ts");
const en = JSON.parse(fs.readFileSync("data/i18n/jobs.en.json", "utf8"));
const de = JSON.parse(fs.readFileSync("data/i18n/jobs.de.json", "utf8"));
const baiEn = await napTs("data/i18n/articles.en.ts");
const baiDe = await napTs("data/i18n/articles.de.ts");

/** gom bản dịch của một bản ghi thành {en:…, de:…}, bỏ qua phần rỗng */
const gom = (id, nguonEn, nguonDe) => {
  const r = {};
  if (nguonEn?.[id]) r.en = nguonEn[id];
  if (nguonDe?.[id]) r.de = nguonDe[id];
  return r;
};

const donHang = JOBS.map((j, i) => ({
  id: j.id,
  slug: j.slug,
  nganh: j.industryId,
  nuoc: j.state,
  hien: true,
  noi_bat: !!j.featured,
  // Thứ tự giảm dần: đơn đầu danh sách hiện có số lớn nhất, nên thêm đơn mới
  // chỉ cần cho số lớn hơn là nó lên đầu — không phải đánh số lại cả kho.
  thu_tu: (JOBS.length - i) * 10,
  du_lieu: j,
  dich: gom(j.id, en, de),
}));

/** bản dịch bài viết có thể nằm trong một export tên bất kỳ — lấy object đầu tiên */
const lay = (m) => (m && typeof m === "object" ? Object.values(m).find((v) => v && typeof v === "object") : null);

const baiViet = CAM_NANG.map((b, i) => ({
  id: b.id,
  slug: b.id,
  loai: "cam-nang",
  nhom: b.nhom ?? null,
  hien: true,
  thu_tu: (CAM_NANG.length - i) * 10,
  du_lieu: b,
  dich: gom(b.id, lay(baiEn), lay(baiDe)),
}));

const ra = { donHang, baiViet, xuatLuc: new Date().toISOString() };
fs.writeFileSync("_xuat-csdl.json", JSON.stringify(ra, null, 1));

console.log(`đơn hàng : ${donHang.length} (có bản dịch: ${donHang.filter((d) => d.dich.en || d.dich.de).length})`);
console.log(`bài viết : ${baiViet.length} (có bản dịch: ${baiViet.filter((d) => d.dich.en || d.dich.de).length})`);
console.log(`ghi ra   : _xuat-csdl.json (${(fs.statSync("_xuat-csdl.json").size / 1024).toFixed(0)} KB)`);
