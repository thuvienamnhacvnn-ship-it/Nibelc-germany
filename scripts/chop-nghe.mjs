/**
 * CHỘP ẢNH NGÀNH NGHỀ VỪA TẢI TỪ CHATGPT
 *
 * Giống chop-anh-chatgpt.mjs nhưng cắt thẳng về đúng khổ banner trang phụ
 * (1920×560) và lưu vào public/assets/nghe.
 *
 *   node scripts/chop-banner.mjs <ten-file-khong-duoi>
 *
 * Chạy TRƯỚC khi bấm tải trong trình duyệt.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const TAI = "C:/Users/admin/Downloads";
const ten = process.argv[2];
if (!ten) {
  console.error("Thiếu tên file");
  process.exit(1);
}
const dich = path.join("public/assets/nghe", `${ten}.jpg`);

function chup() {
  const m = new Map();
  for (const t of fs.readdirSync(TAI)) {
    try {
      const s = fs.statSync(path.join(TAI, t));
      if (s.isFile()) m.set(t, s.size);
    } catch {
      /* Chrome đang đổi tên, bỏ qua */
    }
  }
  return m;
}

const truoc = chup();
const HAN = Date.now() + 90_000;
console.log("Đang canh Downloads…");

let nguon = null;
while (Date.now() < HAN) {
  const nay = chup();
  for (const [t, co] of nay) {
    if (co < 20_000) continue;
    if (truoc.has(t) && truoc.get(t) === co) continue;
    if (!/\.(png|jpe?g|webp|tmp|crdownload)$/i.test(t)) continue;
    const p = path.join(TAI, t);
    await new Promise((r) => setTimeout(r, 350));
    let s2;
    try {
      s2 = fs.statSync(p).size;
    } catch {
      continue;
    }
    if (s2 !== co) continue;
    nguon = p;
    break;
  }
  if (nguon) break;
  await new Promise((r) => setTimeout(r, 150));
}

if (!nguon) {
  console.error("Không thấy file mới trong Downloads");
  process.exit(2);
}

const buf = fs.readFileSync(nguon);
const goc = await sharp(buf).metadata();
fs.mkdirSync(path.dirname(dich), { recursive: true });

// Ảnh ChatGPT vốn 16:9, chỉ cần chuẩn hoá kích thước.
await sharp(buf)
  .resize(1600, 900, { fit: "cover", position: "centre", kernel: "lanczos3" })
  .sharpen({ sigma: 0.5 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(dich);

console.log(`✓ ${path.basename(nguon)}  ${goc.width}×${goc.height} → 1600×900`);
console.log(`  ${dich}  (${(fs.statSync(dich).size / 1024).toFixed(0)} KB)`);
