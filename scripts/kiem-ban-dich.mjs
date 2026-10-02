#!/usr/bin/env node
/**
 * KIỂM ĐỦ BẢN DỊCH DỮ LIỆU (data/i18n/) — không cần server.
 *
 *   node scripts/kiem-ban-dich.mjs          → in chỗ thiếu, thoát mã 1 nếu thiếu
 *   NB_I18N_AN_MUC_THIEU=1 ...              → chỉ cảnh báo, thoát 0 (deploy gấp;
 *                                             mục chưa dịch bị ẩn khỏi bản en/de)
 *
 * Nguồn: data/i18n/kiem.ts (sổ đăng ký mọi bộ bản dịch).
 *
 * CHẠY ĐƯỢC Ở ĐÂU: script này đọc thẳng file .ts nên cần Node tự bỏ kiểu
 * (≥ 23.6, hoặc bản 22 có kèm amaro). Máy chủ ovh-fra đang chạy Node 22.22.1
 * KHÔNG kèm bộ đó — gọi vào là ném ERR_NO_TYPESCRIPT / ERR_UNKNOWN_FILE_EXTENSION
 * và vì nó nằm ở "prebuild" nên cả lệnh build đổ theo, deploy chết đứng.
 *
 * Nên ở môi trường không chạy được thì BỎ QUA ÊM, in một dòng cảnh báo. Lưới
 * an toàn vẫn còn nguyên ở máy trạm (Node 24) — nơi người ta thật sự sửa bản
 * dịch — và chạy tay được bằng `npm run kiem:ban-dich`.
 */
import { napTs } from "./nap-ts.mjs";

let kiemTatCaBanDich;
try {
  ({ kiemTatCaBanDich } = await napTs("data/i18n/kiem.ts"));
} catch (e) {
  const ma = e?.code ?? "";
  if (ma === "ERR_NO_TYPESCRIPT" || ma === "ERR_UNKNOWN_FILE_EXTENSION") {
    console.warn(
      `BỎ QUA kiểm bản dịch: Node ${process.version} ở máy này không đọc được TypeScript (${ma}).
` +
        "          Kiểm ở máy trạm bằng: npm run kiem:ban-dich",
    );
    process.exit(0);
  }
  throw e;
}

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
