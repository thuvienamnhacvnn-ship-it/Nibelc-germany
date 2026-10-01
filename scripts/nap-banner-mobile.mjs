/**
 * NẠP BANNER DỌC CHO ĐIỆN THOẠI
 *
 * Banner desktop là khổ 1920×560 (tỉ lệ 3,43). Trên màn 390px, `object-cover`
 * phóng tới mức chỉ còn khoảng 30% bề ngang ảnh gốc lọt vào khung — đo thật
 * trên trình duyệt. Nên mỗi trang có thêm một bản dọc riêng.
 *
 * ChatGPT trả 941×1672. Web chỉ cần 820×1458 là đủ nét cho màn 414px ở mật độ
 * 2x, nên nén xuống cho nhẹ.
 *
 *   node scripts/nap-banner-mobile.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const NGUON = "E:/Works/itw/Nibelc DE/banner-mobile";
const DICH = "public/assets/banners/mobile";

const TRANG = new Set(["don-hang", "du-hoc-nghe", "lo-trinh", "cam-nang", "ve-chung-toi", "lien-he"]);

fs.mkdirSync(DICH, { recursive: true });

let xong = 0;
for (const f of fs.readdirSync(NGUON)) {
  const id = path.basename(f).replace(/\.[^.]+$/, "");
  if (!TRANG.has(id) || !/\.(png|jpe?g|webp)$/i.test(f)) continue;

  const ra = path.join(DICH, `${id}.jpg`);
  await sharp(path.join(NGUON, f))
    .resize(820, 1458, { fit: "cover", kernel: "lanczos3" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(ra);

  console.log(`✓ ${id}.jpg  ${(fs.statSync(ra).size / 1024).toFixed(0)} KB`);
  xong++;
}

console.log(`\nNạp ${xong}/${TRANG.size} banner dọc.`);

// Next nhớ ảnh đã tối ưu THEO TÊN FILE — thay ảnh mà giữ nguyên tên thì nó
// vẫn trả bản cũ.
const cache = ".next/cache/images";
if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true, force: true });
  console.log("Đã xoá .next/cache/images.");
}
