/**
 * NẠP ẢNH BANNER ĐƠN HÀNG TỪ CHATGPT VÀO DỰ ÁN
 *
 * ChatGPT trả PNG 1672×941 (16:9). Trang chỉ cần 1600×900 JPEG nên nén lại cho
 * nhẹ. Tên file phải trùng id ngành trong data/industries.ts.
 *
 * Next nhớ ảnh đã tối ưu THEO TÊN FILE, nên ghi đè cùng tên xong phải xoá
 * `.next/cache/images` — không thì trang vẫn trả ảnh cũ mà chẳng báo gì.
 *
 *   node scripts/nap-anh-don-hang.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const NGUON = "E:/Works/itw/Nibelc DE/anh-don-hang";
const DICH = "public/assets/nghe";

const NGANH = new Set([
  "pflege", "gastronomie", "elektro", "mechanik", "logistik", "kosmetik",
  "bau", "automotive", "it", "handel", "landwirtschaft", "soziales",
]);

fs.mkdirSync(DICH, { recursive: true });

let xong = 0;
for (const f of fs.readdirSync(NGUON)) {
  const id = path.basename(f).replace(/\.[^.]+$/, "");
  if (!NGANH.has(id) || !/\.(png|jpe?g|webp)$/i.test(f)) continue;

  const ra = path.join(DICH, `${id}.jpg`);
  await sharp(path.join(NGUON, f))
    .resize(1600, 900, { fit: "cover", kernel: "lanczos3" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(ra);

  const kb = (fs.statSync(ra).size / 1024).toFixed(0);
  console.log(`✓ ${id}.jpg  ${kb} KB`);
  xong++;
}

console.log(`\nNạp ${xong}/${NGANH.size} ảnh.`);
const cache = ".next/cache/images";
if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true, force: true });
  console.log("Đã xoá .next/cache/images — khởi động lại dev để Next tối ưu lại.");
}
