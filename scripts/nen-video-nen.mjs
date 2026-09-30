/**
 * NÉN VIDEO NỀN CHO TRANG CHỦ
 *
 * Bản gốc Sếp gửi là 4K 10 giây, 31 MB — không thể để nguyên làm nền web.
 * Script nén xuống hai bản:
 *   desktop  1920×1080  H.264 + WebM
 *   mobile    720×1280  H.264 + WebM
 *
 * Bỏ hẳn tiếng (video nền luôn chạy câm) và tạo ảnh poster để khung hình đầu
 * hiện ngay trong lúc video còn đang tải.
 *
 *   node scripts/nen-video-nen.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FFMPEG =
  "C:/Users/admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe";

const NGUON = "E:/Works/itw/Nibelc DE/NIBELC_Webapp_Desktop_UI/01-trang-chu";
const RA = "public/assets/home/video";

const VIEC = [
  { nguon: "4k desktop.mp4", ten: "hero-desktop", w: 1920, h: 1080, crf: 20, bv: "7000k" },
  { nguon: "4k mobile.mp4", ten: "hero-mobile", w: 720, h: 1280, crf: 23, bv: "3200k" },
];

fs.mkdirSync(RA, { recursive: true });

function chay(args) {
  execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
}

for (const v of VIEC) {
  const src = path.join(NGUON, v.nguon);
  if (!fs.existsSync(src)) {
    console.log("✗ thiếu:", src);
    continue;
  }
  const loc = `scale=${v.w}:${v.h}:force_original_aspect_ratio=increase,crop=${v.w}:${v.h}`;

  // H.264 — chạy được ở mọi trình duyệt
  const mp4 = path.join(RA, `${v.ten}.mp4`);
  chay([
    "-i", src,
    "-an", // video nền không cần tiếng
    "-vf", loc,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-crf", String(v.crf),
    "-maxrate", v.bv,
    "-bufsize", "12M",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", // bắt đầu phát trước khi tải xong
    mp4,
  ]);

  // WebM — nhẹ hơn cho trình duyệt hỗ trợ
  const webm = path.join(RA, `${v.ten}.webm`);
  chay([
    "-i", src,
    "-an",
    "-vf", loc,
    "-c:v", "libvpx-vp9",
    "-crf", String(v.crf + 4),
    "-b:v", "0",
    "-row-mt", "1",
    "-deadline", "good",
    "-cpu-used", "2",
    webm,
  ]);

  // Ảnh poster: khung hình đầu, hiện ngay trong lúc video tải
  const poster = path.join(RA, `${v.ten}-poster.jpg`);
  chay(["-i", src, "-vf", `${loc},scale=${Math.round(v.w / 2)}:-2`, "-frames:v", "1", "-q:v", "4", poster]);

  const co = (f) => (fs.statSync(f).size / 1024 / 1024).toFixed(2);
  console.log(`✓ ${v.ten}  mp4 ${co(mp4)} MB · webm ${co(webm)} MB · poster ${(fs.statSync(poster).size / 1024).toFixed(0)} KB`);
}
