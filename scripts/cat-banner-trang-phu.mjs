/**
 * CẮT NỀN BANNER TRANG PHỤ TỪ BỘ ẢNH GIAO DIỆN
 *
 * Sáu ảnh giao diện Sếp duyệt (1920×1080) là ảnh THAM CHIẾU, không được đặt
 * nguyên cái làm nền rồi phủ nút vô hình lên — luật ở cuối MASTER BUILD PROMPT.
 *
 * Nên ở đây chỉ lấy PHẦN ẢNH của mỗi banner: vùng bên phải, nơi chỉ có ảnh
 * chụp (skyline, người, bản đồ) và KHÔNG có chữ. Chữ trên web do React render,
 * nếu cắt cả phần chữ thì trang sẽ có hai lớp chữ chồng nhau.
 *
 *   node scripts/cat-banner-trang-phu.mjs
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const NGUON = "public/assets/pages";
const RA = "public/assets/banners";

/**
 * Vùng ảnh sạch của từng màn, đo trên ảnh gốc 1920×1080.
 *
 * Màn 06 (Về chúng tôi) KHÔNG có trong danh sách: cả dải hero của nó đã bị
 * tiêu đề và nhãn bản đồ "ĐỨC / VIỆT NAM" phủ kín, không còn mảng ảnh nào
 * vừa đủ rộng vừa sạch chữ. Trang đó dùng ảnh panorama của trang chủ.
 */
const VUNG = [
  { file: "02-don-hang.png", ten: "don-hang", left: 760, top: 66, width: 1160, height: 268 },
  { file: "03-du-hoc-nghe.png", ten: "du-hoc-nghe", left: 800, top: 66, width: 1120, height: 344 },
  { file: "04-lo-trinh.png", ten: "lo-trinh", left: 900, top: 66, width: 660, height: 224 },
  { file: "05-cam-nang.png", ten: "cam-nang", left: 850, top: 66, width: 1070, height: 286 },
  { file: "07-lien-he.png", ten: "lien-he", left: 980, top: 66, width: 940, height: 268 },
];

/** Kích thước nền banner dùng chung, tỉ lệ khớp dải PageHero */
const W = 1920;
const H = 560;

fs.mkdirSync(RA, { recursive: true });

for (const v of VUNG) {
  const nguon = path.join(NGUON, v.file);
  if (!fs.existsSync(nguon)) {
    console.log("✗ thiếu ảnh nguồn:", nguon);
    continue;
  }
  const dich = path.join(RA, `${v.ten}.jpg`);
  await sharp(nguon)
    .extract({ left: v.left, top: v.top, width: v.width, height: v.height })
    .resize(W, H, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .sharpen({ sigma: 0.5 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dich);

  const co = (fs.statSync(dich).size / 1024).toFixed(0);
  console.log(`✓ ${v.ten.padEnd(14)} ${v.width}×${v.height} → ${W}×${H}  ${co} KB`);
}
