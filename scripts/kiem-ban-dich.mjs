#!/usr/bin/env node
/**
 * KIỂM ĐỦ BẢN DỊCH DỮ LIỆU (data/i18n/) — không cần server.
 *
 *   node scripts/kiem-ban-dich.mjs          → in chỗ thiếu, thoát mã 1 nếu thiếu
 *   NB_I18N_AN_MUC_THIEU=1 ...              → chỉ cảnh báo, thoát 0 (deploy gấp;
 *                                             mục chưa dịch bị ẩn khỏi bản en/de)
 *
 * Nguồn: data/i18n/kiem.ts (sổ đăng ký mọi bộ bản dịch).
 */
import { napTs } from "./nap-ts.mjs";

const { kiemTatCaBanDich } = await napTs("data/i18n/kiem.ts");

let tong = 0;
for (const { bo, thieu } of kiemTatCaBanDich()) {
  tong += thieu.length;
  console.log(`${thieu.length ? "THIẾU" : "ĐỦ   "}  ${bo}${thieu.length ? ` — ${thieu.length} chỗ` : ""}`);
  for (const x of thieu.slice(0, 60)) console.log(`        ${x}`);
  if (thieu.length > 60) console.log(`        ... và ${thieu.length - 60} chỗ nữa`);
}

if (tong === 0) {
  console.log("Bản dịch dữ liệu: đủ.");
} else if (process.env.NB_I18N_AN_MUC_THIEU === "1") {
  console.warn(`\nCẢNH BÁO: thiếu ${tong} chỗ — NB_I18N_AN_MUC_THIEU=1 nên vẫn cho qua (mục thiếu bị ẩn ở en/de).`);
} else {
  console.error(`\nThiếu ${tong} chỗ bản dịch. Bổ sung vào data/i18n/ (xem _w-agent/i18n-huong-dan.md).`);
  process.exit(1);
}
