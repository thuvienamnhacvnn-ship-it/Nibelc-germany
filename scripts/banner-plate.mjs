/**
 * Tách nền sân khấu từ hai ảnh mẫu của Sếp.
 *
 * Ảnh mẫu đã in sẵn cả giao diện (chữ, thẻ đơn hàng, thanh menu). Ta chỉ giữ
 * khung cảnh: trời đêm, máy bay, Cổng Brandenburg, nhà thờ, sàn vàng. Vùng nào
 * có chữ/thẻ thì lấy từ bản nhoè mạnh, ghép qua một mặt nạ đã làm mềm nên
 * không để lại viền chữ nhật. Giao diện thật dựng bằng code nằm đè lên đúng
 * các vùng đó.
 *
 * Chạy lại khi Sếp đổi ảnh mẫu:  node scripts/banner-plate.mjs
 */
import sharp from "sharp";

const SRC = "E:/Works/itw/Hub mini";

const DESKTOP = {
  src: `${SRC}/159608f1-ac7d-4fa7-b1c8-4f4bb16f1bf7.png`,
  out: "public/kit/banner/stage-desktop.jpg",
  w: 1672,
  h: 941,
  blur: 42,
  feather: 26,
  /** [x, y, rộng, cao] các vùng có giao diện in sẵn */
  rects: [
    [0, 0, 1672, 92], // thanh menu
    [84, 70, 588, 366], // chữ lớn + nút
    [614, 74, 524, 688], // thẻ 01 ở giữa
    [370, 282, 304, 438], // thẻ 02
    [172, 398, 248, 322], // thẻ 04
    [1094, 300, 312, 426], // thẻ 03
    [1350, 370, 256, 354], // thẻ 05
    [56, 490, 108, 108], // mũi tên trái
    [1546, 490, 108, 108], // mũi tên phải
    [446, 742, 1216, 84], // thanh tiến trình
    [50, 800, 1578, 141], // dải 5 ô dưới cùng
  ],
};

const MOBILE = {
  src: `${SRC}/ChatGPT Image Sep 27, 2026, 01_26_53 PM.png`,
  out: "public/kit/banner/stage-mobile.jpg",
  w: 941,
  h: 1672,
  blur: 44,
  feather: 24,
  rects: [
    [0, 0, 941, 104], // thanh trên
    [14, 86, 672, 326], // chữ lớn
    [18, 390, 908, 116], // ô tìm kiếm
    [0, 478, 941, 756], // ba thẻ đơn hàng
    [10, 1198, 924, 112], // thanh tiến trình
    [6, 1286, 930, 144], // hàng ngành nghề
    [6, 1406, 930, 172], // dải hành trình
    [0, 1550, 941, 122], // menu đáy
  ],
};

async function plate({ src, out, w, h, blur, feather, rects }) {
  const base = await sharp(src).resize(w, h, { fit: "cover" }).png().toBuffer();

  // Mặt nạ: trắng ở vùng cần xoá, làm mềm để không còn cạnh chữ nhật.
  // Nới mỗi vùng ra đúng bằng độ mềm của mặt nạ, nếu không thì mép vùng
  // chỉ được xoá một nửa và chữ sát mép vẫn đọc được.
  const grow = Math.round(feather * 1.4);
  const svg = `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#000"/>${rects
    .map(([x, y, rw, rh]) => `<rect x="${x - grow}" y="${y - grow}" width="${rw + 2 * grow}" height="${rh + 2 * grow}" rx="22" fill="#fff"/>`)
    .join("")}</svg>`;
  const mask = await sharp(Buffer.from(svg))
    .blur(feather)
    .greyscale()
    .raw()
    .toBuffer();

  // Bản nhoè của cả ảnh, gắn mặt nạ làm kênh alpha.
  const blurred = await sharp(base)
    .blur(blur)
    .modulate({ brightness: 0.84, saturation: 0.88 })
    .removeAlpha()
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0, p = 0; i < w * h; i++) {
    rgba[p++] = blurred[i * 3];
    rgba[p++] = blurred[i * 3 + 1];
    rgba[p++] = blurred[i * 3 + 2];
    rgba[p++] = mask[i];
  }

  await sharp(base)
    .composite([{ input: rgba, raw: { width: w, height: h, channels: 4 } }])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(out);
  console.log(`${out}  ${w}x${h}  (${rects.length} vùng, viền mềm ${feather}px)`);
}

await plate(DESKTOP);
await plate(MOBILE);
