/**
 * TẠO ẢNH ĐƠN HÀNG 16:9 BẰNG GEMINI
 *
 * Trước đây phải điều khiển ChatGPT qua trình duyệt: mỗi ảnh mất vài phút,
 * renderer treo sau ~6 ảnh và endpoint đọc hội thoại trả 429 liên tục. Gọi
 * thẳng API thì một lần chạy ra hết.
 *
 *   GEMINI_API_KEY=... node scripts/tao-anh-nghe.mjs [id-nganh ...]
 *
 * Không truyền tham số thì làm tất cả nhóm ngành chưa có ảnh.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Thiếu GEMINI_API_KEY");
  process.exit(1);
}

/** Thứ tự thử: model tốt trước, rơi xuống model nhẹ hơn khi hết hạn mức */
const MODEL = ["gemini-3-pro-image", "gemini-3.1-flash-image", "gemini-2.5-flash-image"];

const RA = "public/assets/nghe";

/** Khối phong cách dùng chung — giữ cho 12 ảnh nhìn cùng một bộ */
const STYLE = [
  "Photorealistic cinematic photograph, 16:9 wide landscape framing.",
  "Colour grade: deep navy blue shadows, warm champagne gold highlights, golden-hour light.",
  "Premium modern European corporate documentary style, believable and dignified, shallow depth of field.",
  "The person is a young Vietnamese worker in Germany, competent and focused, treated with respect.",
  "ABSOLUTELY NO TEXT of any kind: no letters, no words, no signage, no logos, no watermarks, no user interface.",
].join(" ");

const NGANH = [
  { id: "pflege", mo: "A young Vietnamese nurse in light blue scrubs with a stethoscope caring for an elderly German resident in a bright modern German care home, warm window light, genuine warm interaction." },
  { id: "gastronomie", mo: "A young Vietnamese chef in a white chef jacket plating a refined dish in a busy upscale German restaurant kitchen, brass and warm gold lighting, steam rising." },
  { id: "elektro", mo: "A young Vietnamese electrician in navy workwear wiring a large industrial control cabinet in a German factory, neat cable runs, precise focused work, warm task lighting." },
  { id: "mechanik", mo: "A young Vietnamese welder in protective gear MIG welding a steel structure in a German metal workshop, bright weld sparks, dark workshop with warm golden rim light." },
  { id: "logistik", mo: "A young Vietnamese warehouse worker in a high-visibility vest scanning parcels in a large modern German logistics centre, tall shelving, forklift softly blurred behind." },
  { id: "kosmetik", mo: "A young Vietnamese nail and beauty technician working carefully on a client's hands in an elegant minimal German salon, soft warm lighting, calm premium atmosphere." },
  { id: "bau", mo: "A young Vietnamese building-services technician standing and fitting copper heating pipes on a wall inside a bright German building under construction, face clearly visible, hard hat, pipe wrench in hand, warm daylight through large windows." },
  { id: "automotive", mo: "A young Vietnamese car mechanic working on a modern car on a lift in a clean well-lit German garage, diagnostic tablet nearby, warm workshop lighting." },
  { id: "it", mo: "Close three-quarter portrait of a young Vietnamese IT specialist standing beside a server rack in a modern German office, face clearly visible and lit, holding a laptop, blue status lights on the rack, warm window light behind." },
  { id: "handel", mo: "A young Vietnamese retail employee arranging fresh produce in a bright modern German supermarket, neat shelves, warm store lighting, friendly and organised." },
  { id: "landwirtschaft", mo: "A young Vietnamese greenhouse worker harvesting ripe strawberries in a large modern German glasshouse, rows of plants receding, warm sunlight through the glass roof." },
  { id: "soziales", mo: "A young Vietnamese social-care assistant helping an elderly German person in a bright living room of a German assisted-living home, warm afternoon light, gentle supportive moment." },
];

const can = process.argv.slice(2);
const lam = can.length ? NGANH.filter((n) => can.includes(n.id)) : NGANH;

fs.mkdirSync(RA, { recursive: true });

/** Gọi một model, trả buffer ảnh hoặc null */
async function goi(model, prompt) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
      }),
    }
  );
  if (!r.ok) return { loi: `HTTP ${r.status} ${(await r.text()).slice(0, 120)}` };
  const j = await r.json();
  for (const p of j.candidates?.[0]?.content?.parts ?? []) {
    if (p.inlineData?.data) return { buf: Buffer.from(p.inlineData.data, "base64") };
  }
  return { loi: "không có ảnh trong phản hồi" };
}

let xong = 0;
for (const n of lam) {
  const dich = path.join(RA, `${n.id}.jpg`);
  let ok = false;
  for (const m of MODEL) {
    const kq = await goi(m, `${STYLE} ${n.mo}`);
    if (kq.buf) {
      await sharp(kq.buf)
        .resize(1600, 900, { fit: "cover", position: "centre", kernel: "lanczos3" })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(dich);
      const co = (fs.statSync(dich).size / 1024).toFixed(0);
      console.log(`✓ ${n.id.padEnd(15)} ${m.padEnd(24)} ${co} KB`);
      ok = true;
      xong++;
      break;
    }
    console.log(`  ${n.id} · ${m}: ${kq.loi}`);
  }
  if (!ok) console.log(`✗ ${n.id}: không model nào tạo được`);
}

console.log(`\nXong ${xong}/${lam.length} ảnh → ${RA}`);
