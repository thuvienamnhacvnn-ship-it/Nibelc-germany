/**
 * Cắt lấy phần ẢNH CHỤP trong mỗi tin tuyển dụng để làm ảnh thẻ trên banner.
 *
 * Tin tuyển dụng là ảnh vuông có nhiều chữ. Đặt nguyên tấm vào thẻ thì chữ bị
 * cắt nham nhở và không đọc được. Mỗi tin dưới đây khai đúng khung ảnh chụp
 * của nó; chữ và số liệu đã có sẵn trong dữ liệu nên không mất thông tin gì.
 *
 * Chạy lại khi Sếp đổi tin:  node scripts/cat-anh-don-hang.mjs
 */
import sharp from "sharp";

const SRC = "public/don-hang";
const OUT = "public/don-hang/the";

/** [tên nguồn, tên đích, trái, trên, rộng, cao] */
const CROPS = [
  ["de-phu-bep-nha-hang", "de-phu-bep-nha-hang", 30, 575, 1190, 365],
  ["gr-che-bien-thuy-hai-san", "gr-che-bien-thuy-hai-san", 50, 440, 620, 400],
  ["al-khach-san-nha-hang-spa", "al-khach-san-nha-hang-spa", 0, 230, 580, 620],
  ["gr-kho-lap-rap-noi-that", "gr-kho-lap-rap-noi-that", 560, 100, 694, 640],
  ["gr-nha-may-gia-vi", "gr-nha-may-gia-vi", 860, 20, 394, 420],
  ["gr-lap-cap-quang", "gr-lap-cap-quang", 610, 60, 644, 620],
  ["lt-ba-nganh", "lt-may-noi-that", 35, 520, 390, 330],
  ["lt-ba-nganh", "lt-ve-sinh-cong-nghiep", 432, 520, 390, 330],
  ["lt-ba-nganh", "lt-loc-thit", 828, 520, 390, 330],
];

for (const [src, dst, left, top, width, height] of CROPS) {
  await sharp(`${SRC}/${src}.jpg`)
    .extract({ left, top, width, height })
    .jpeg({ quality: 86 })
    .toFile(`${OUT}/${dst}.jpg`);
  console.log(`${dst}.jpg  ${width}x${height}`);
}
