/**
 * TÁCH SPRITE PHONG BÌ NGÀNH NGHỀ
 *
 * Sếp gửi 8 phong bì trong MỘT file PNG trong suốt. Muốn làm carousel, hover
 * và animation rút job card ra khỏi phong bì thì mỗi phong bì phải là một
 * phần tử riêng, nên script này dò cột alpha để tìm ranh giới rồi cắt ra 8
 * file.
 *
 * Không sửa, không vẽ lại, không đổi tỉ lệ — chỉ cắt.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const NGUON =
  "E:/Works/itw/Nibelc DE/NIBELC_Webapp_Desktop_UI/01-trang-chu/ChatGPT Image Sep 30, 2026, 12_53_30 PM.png";
const RA = "public/assets/industries";

/** Thứ tự 8 phong bì trên sprite, trái sang phải */
const SLUG = [
  "pflege",
  "gastronomie",
  "elektro",
  "mechanik",
  "logistik",
  "kosmetik",
  "bau",
  "automotive",
];

const anh = sharp(NGUON);
const { width: W, height: H } = await anh.metadata();
const { data } = await anh.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Cột nào có ít nhất một điểm đục thì coi là có nội dung
const dac = new Array(W).fill(false);
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    if (data[(y * W + x) * 4 + 3] > 16) {
      dac[x] = true;
      break;
    }
  }
}

// Gom thành các cụm liên tiếp, bỏ khe hẹp do bóng đổ
const cum = [];
let dau = -1;
let treo = 0;
const KHE = 6; // khe nhỏ hơn mức này thì vẫn tính là cùng một phong bì
for (let x = 0; x < W; x++) {
  if (dac[x]) {
    if (dau < 0) dau = x;
    treo = 0;
  } else if (dau >= 0) {
    treo++;
    if (treo > KHE) {
      cum.push([dau, x - treo]);
      dau = -1;
      treo = 0;
    }
  }
}
if (dau >= 0) cum.push([dau, W - 1]);

let dung = cum.filter(([a, b]) => b - a > W / 40);

/**
 * Hai phong bì cạnh nhau có thể chạm nhau nên dò ra một cụm. Cụm nào rộng
 * gần gấp đôi mức trung bình thì cắt đôi tại cột "mỏng" nhất — cột có tổng
 * alpha nhỏ nhất trong vùng giữa, tức là khe giữa hai phong bì.
 */
function tongAlpha(x) {
  let t = 0;
  for (let y = 0; y < H; y++) t += data[(y * W + x) * 4 + 3];
  return t;
}

const rongTb = dung.reduce((s, [a, b]) => s + (b - a + 1), 0) / dung.length;
const tach = [];
for (const [a, b] of dung) {
  const rong = b - a + 1;
  const phan = Math.round(rong / rongTb);
  if (phan < 2) {
    tach.push([a, b]);
    continue;
  }
  // chia thành `phan` phần, mỗi ranh giới tìm cột mỏng nhất quanh vị trí dự kiến
  const moc = [a];
  for (let k = 1; k < phan; k++) {
    const giua = a + Math.round((rong * k) / phan);
    const vung = Math.round(rongTb * 0.12);
    let tot = giua;
    let min = Infinity;
    for (let x = giua - vung; x <= giua + vung; x++) {
      const t = tongAlpha(x);
      if (t < min) {
        min = t;
        tot = x;
      }
    }
    moc.push(tot);
  }
  moc.push(b + 1);
  for (let k = 0; k < moc.length - 1; k++) tach.push([moc[k], moc[k + 1] - 1]);
}
dung = tach;

console.log(`Sprite ${W}×${H} → ${dung.length} phong bì`);
for (const [a, b] of dung) console.log(`  x ${a}–${b}  rộng ${b - a + 1}`);

if (dung.length !== SLUG.length) {
  console.error(`\n✗ Cần đúng ${SLUG.length} cụm, dò ra ${dung.length}. Dừng để không cắt sai.`);
  process.exit(1);
}

// Tìm hàng trên/dưới có nội dung để cắt sát, không để viền rỗng
let tren = H;
let duoi = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * 4 + 3] > 16) {
      if (y < tren) tren = y;
      if (y > duoi) duoi = y;
      break;
    }
  }
}

fs.mkdirSync(RA, { recursive: true });
for (let i = 0; i < dung.length; i++) {
  const [a, b] = dung[i];
  const dich = path.join(RA, `${SLUG[i]}-envelope.png`);
  await sharp(NGUON)
    .extract({ left: a, top: tren, width: b - a + 1, height: duoi - tren + 1 })
    .png({ compressionLevel: 9 })
    .toFile(dich);
  const m = await sharp(dich).metadata();
  console.log(`✓ ${SLUG[i].padEnd(13)} ${m.width}×${m.height}  ${dich}`);
}
