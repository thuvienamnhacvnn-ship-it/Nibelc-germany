/**
 * NẠP ĐƠN HÀNG TỪ KHO THẬT
 *
 * Đọc `E:\Works\itw\QUANG CAO` — 16 thư mục đơn hàng, mỗi thư mục có
 * `noi-dung.txt` (bản A/B/C/D), `anh/`, `to-don/`, `video/`.
 *
 * Sinh ra:
 *   - content/don-hang.json          dữ liệu 16 đơn, đã bóc tách
 *   - public/anh/don-hang/<ma>/...   ảnh đã chọn và nén lại cho web
 *
 * KHÔNG ĐĂNG (bỏ hẳn khi bóc tách):
 *   - phần "LƯU Ý NỘI BỘ" ở cuối file
 *   - bản C (trả lời bình luận) và bản D (kịch bản nhắn riêng) — tài liệu nội bộ
 *   - số điện thoại cá nhân trong bài, tên nhân viên
 *   - điều kiện tuổi / giới tính / chiều cao / cân nặng: luật AGG của Đức cấm
 *     nêu trong tin tuyển dụng, nên gạt khỏi mọi bản ngôn ngữ
 *   - phí, cọc, chứng minh tài chính: chủ đề tiền, không tự đăng
 *
 * Chạy:  node scripts/nap-don-hang.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const KHO = "E:/Works/itw/QUANG CAO";
const RA_ANH = "public/anh/don-hang";
const RA_JSON = "content/don-hang.json";

/** Câu chứa những chữ này thì bỏ — nội bộ hoặc luật Đức cấm nêu */
const CHAN = [
  /zalo|whatsapp|hotline|ms\.|mr\.|\+\d{2}\s?\d/i,
  /msdn|công ty cổ phần xây dựng/i,
  /\btuổi từ\b|\bnam cao\b|\bnữ cao\b|giới tính|\bnặng \d/i,
  /phí|cọc|sổ tiết kiệm|chứng minh tài chính|quyền sử dụng đất/i,
  /nhắn em|inbox|để lại số/i,
];
const biChan = (s) => CHAN.some((r) => r.test(s));

const NUOC = { DE: "Đức", AT: "Áo", GR: "Hy Lạp", G2: "Hy Lạp", AL: "Albania", LT: "Litva" };

function maVaNuoc(ten) {
  const ma = ten.split(" - ")[0].trim();
  const dau = ma.slice(0, 2).toUpperCase();
  return { ma, nuoc: NUOC[dau] ?? (ma.startsWith("G") ? "Hy Lạp" : "—") };
}

/** Bóc bản A — phần duy nhất được phép đăng */
function bocBanA(txt) {
  const a = txt.indexOf("=== BẢN A");
  const b = txt.indexOf("=== BẢN B");
  if (a < 0) return null;
  const than = txt.slice(a, b > a ? b : undefined).split("\n").slice(1);

  const kq = { soLuong: null, noiLamViec: null, viTri: [], quyenLoi: [], dieuKien: [], gioLam: null };
  let khoi = "";

  for (const raw of than) {
    const d = raw.trim();
    if (!d) continue;

    if (/^VỊ TRÍ\b|THU NHẬP/i.test(d)) {
      khoi = "vitri";
      const g = d.match(/\((\d+)\s*giờ\/tuần[^)]*\)/i);
      if (g) kq.gioLam = Number(g[1]);
      continue;
    }
    if (/^QUYỀN LỢI/i.test(d)) { khoi = "quyenloi"; continue; }
    if (/^ĐIỀU KIỆN/i.test(d)) { khoi = "dieukien"; continue; }
    if (/^CÔNG VIỆC|^MÔ TẢ/i.test(d)) { khoi = "congviec"; continue; }

    let m;
    if ((m = d.match(/^Số lượng[^:]*:\s*(.+)$/i))) { kq.soLuong = m[1].trim(); continue; }
    if ((m = d.match(/^Nơi làm việc\s*:\s*(.+)$/i))) { kq.noiLamViec = m[1].trim(); continue; }
    if (/^Cột 1:/i.test(d)) continue;

    if (biChan(d)) continue;

    const noi = d.replace(/^[•✅\-–*]\s*/, "").trim();
    if (!noi) continue;

    if (khoi === "vitri" && /^[•]/.test(d)) kq.viTri.push(noi);
    else if (khoi === "quyenloi") kq.quyenLoi.push(noi);
    else if (khoi === "dieukien") kq.dieuKien.push(noi);
    else if (khoi === "congviec") (kq.congViec ??= []).push(noi);
  }
  return kq;
}

/** Tách một dòng vị trí thành tên nghề + số người + mức thu nhập */
function bocViTri(dong) {
  const phan = dong.split("—").map((x) => x.trim());
  const ten = phan[0] ?? dong;
  const soNguoi = phan.find((x) => /^\d+\s*người$/i.test(x));
  const luong = phan.slice(soNguoi ? 2 : 1).join(" — ") || null;
  const so = soNguoi ? Number(soNguoi.match(/\d+/)[0]) : null;
  // khoảng euro lớn nhất tìm được, để sắp xếp và lọc theo lương
  const euro = [...dong.matchAll(/(\d{3,4})\s*(?:-|–|đến)\s*(\d{3,4})|(\d{4})\s*Euro/gi)]
    .flatMap((m) => [m[1], m[2], m[3]])
    .filter(Boolean)
    .map(Number);
  return {
    ten,
    soNguoi: so,
    thuNhap: luong,
    tu: euro.length ? Math.min(...euro) : null,
    den: euro.length ? Math.max(...euro) : null,
  };
}

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ------------------------------------------------------------------ */

const thuMuc = fs
  .readdirSync(KHO, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name);

const donHang = [];

for (const ten of thuMuc) {
  const goc = path.join(KHO, ten);
  const fileND = path.join(goc, "noi-dung.txt");
  if (!fs.existsSync(fileND)) {
    console.log(`bỏ qua (không có noi-dung.txt): ${ten}`);
    continue;
  }

  const { ma, nuoc } = maVaNuoc(ten);
  const tieuDe = ten.split(" - ").slice(1).join(" - ").trim() || ten;
  const id = slug(ma);
  const a = bocBanA(fs.readFileSync(fileND, "utf8"));
  if (!a) {
    console.log(`bỏ qua (không thấy BẢN A): ${ten}`);
    continue;
  }

  // ----- ảnh: lấy tối đa 8 tấm, nén lại cho web -----
  const thuMucAnh = path.join(goc, "anh");
  const anhGoc = fs.existsSync(thuMucAnh)
    ? fs.readdirSync(thuMucAnh).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()
    : [];
  const chon = anhGoc.slice(0, 8);
  const raThuMuc = path.join(RA_ANH, id);
  fs.mkdirSync(raThuMuc, { recursive: true });

  const anhWeb = [];
  for (let i = 0; i < chon.length; i++) {
    const dich = `${String(i + 1).padStart(2, "0")}.jpg`;
    await sharp(path.join(thuMucAnh, chon[i]))
      .rotate()
      .resize(1600, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(raThuMuc, dich));
    anhWeb.push(`/anh/don-hang/${id}/${dich}`);
  }

  // ----- tờ đơn: chỉ dùng ở bản tiếng Việt -----
  const thuMucTo = path.join(goc, "to-don");
  const toDon = [];
  if (fs.existsSync(thuMucTo)) {
    const ds = fs.readdirSync(thuMucTo).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
    for (let i = 0; i < ds.length; i++) {
      const dich = `to-don-${i + 1}.jpg`;
      await sharp(path.join(thuMucTo, ds[i]))
        .rotate()
        .resize(1400, 2000, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(path.join(raThuMuc, dich));
      toDon.push(`/anh/don-hang/${id}/${dich}`);
    }
  }

  const viTri = a.viTri.map(bocViTri);
  const tu = viTri.map((v) => v.tu).filter(Boolean);
  const den = viTri.map((v) => v.den).filter(Boolean);

  donHang.push({
    id,
    ma,
    nuoc,
    tieuDe,
    soLuong: a.soLuong,
    noiLamViec: a.noiLamViec,
    gioLam: a.gioLam,
    luong: tu.length ? { tu: Math.min(...tu), den: Math.max(...den) } : null,
    viTri,
    congViec: a.congViec ?? [],
    quyenLoi: a.quyenLoi,
    dieuKien: a.dieuKien,
    anh: anhWeb,
    toDon,
    soAnhGoc: anhGoc.length,
  });

  console.log(`${ma.padEnd(22)} ${nuoc.padEnd(8)} vị trí ${String(viTri.length).padStart(2)} · ảnh ${String(anhWeb.length).padStart(2)}/${anhGoc.length} · tờ đơn ${toDon.length}`);
}

fs.mkdirSync(path.dirname(RA_JSON), { recursive: true });
fs.writeFileSync(RA_JSON, JSON.stringify(donHang, null, 2), "utf8");
console.log(`\n→ ${donHang.length} đơn hàng ghi vào ${RA_JSON}`);
