#!/usr/bin/env node
/**
 * KIỂM LẪN NGÔN NGỮ — tải từng trang từ server đang chạy, lấy chữ HIỂN THỊ
 * (bỏ script/style/svg), báo mọi đoạn lạc ngôn ngữ.
 *
 *   node scripts/kiem-ngon-ngu.mjs http://localhost:3496
 *   node scripts/kiem-ngon-ngu.mjs http://localhost:3496 --chi /lien-he,/
 *   node scripts/kiem-ngon-ngu.mjs http://localhost:3496 --ngon-ngu en,de
 *
 * Bản /en và /de: báo mọi đoạn có ký tự riêng tiếng Việt (ă â đ ê ô ơ ư và
 *   nguyên âm mang dấu thanh) — đây là LỖI, thoát mã 1.
 * Bản tiếng Việt: báo đoạn trông như câu tiếng Anh/Đức lạc vào (ít quan
 *   trọng hơn — chỉ cảnh báo, không làm thoát mã 1).
 *
 * Soát cả: <title>, meta description/og, alt, title, aria-label, placeholder,
 * chữ trong <option>, JSON-LD. Phần tử mang lang="xx" khác ngôn ngữ trang
 * (vd tên ngôn ngữ trong nút chọn ngôn ngữ) được bỏ qua — đó là cách đánh
 * dấu hợp lệ một cụm chữ ngoại ngữ.
 *
 * Danh sách trang lấy từ lib/i18n/routes.ts (trang tĩnh + slug động).
 */
import { napTs } from "./nap-ts.mjs";

const args = process.argv.slice(2);
const goc = (args.find((a) => /^https?:\/\//.test(a)) || "http://localhost:3496").replace(/\/$/, "");
const lay = (ten) => {
  const i = args.indexOf(ten);
  return i >= 0 && args[i + 1] ? args[i + 1].split(",").map((x) => x.trim()).filter(Boolean) : null;
};
const chi = lay("--chi");
const ngonNgu = lay("--ngon-ngu") || ["vi", "en", "de"];

const { tatCaTrang } = await napTs("lib/i18n/routes.ts");
const trang = chi || tatCaTrang();

// ---------- nhận diện ----------
// Ký tự chỉ (hoặc gần như chỉ) tiếng Việt dùng: ă â đ ê ô ơ ư + khối Latin
// Extended Additional (ạ ả ấ ầ ẩ ẫ ậ ắ ... ỹ) + ĩ ũ ỳ.
const RE_VIET = /[ăâđêôơưĂÂĐÊÔƠƯĩũỳĨŨỲẠ-ỹ]/;
const RE_VIET_G = /[ăâđêôơưĂÂĐÊÔƠƯĩũỳĨŨỲẠ-ỹ]/g;
// Từ chức năng rất hay gặp trong câu tiếng Anh / Đức
const TU_EN = new Set("the and for with your our you are this that from have will can of to in on is be by at".split(" "));
const TU_DE = new Set("und der die das für mit sie ihr ihre ihren wir ist sind nicht ein eine einen zum zur bei von auf im den dem des".split(" "));

function lacNgoai(txt) {
  if (RE_VIET.test(txt)) return null;
  const tu = txt.toLowerCase().match(/\p{L}+/gu) || [];
  if (tu.length < 4) return null;
  const en = tu.filter((w) => TU_EN.has(w)).length;
  const de = tu.filter((w) => TU_DE.has(w)).length;
  if (en >= 2) return "EN";
  if (de >= 2) return "DE";
  return null;
}

// ---------- tách chữ hiển thị ----------
const VOID = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
const BO_HAN = new Set(["script", "style", "noscript", "template", "svg"]);

function giaiMa(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function thuocTinh(chuoi) {
  const ra = {};
  for (const m of chuoi.matchAll(/([a-zA-Z_:][-\w:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    ra[m[1].toLowerCase()] = giaiMa(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return ra;
}

/** → [{ nguon, txt }] ; nguon = "chữ <p>", "alt", "meta description"... */
function layChu(html, langTrang) {
  const ra = [];
  const ngan = []; // ngăn xếp { ten, bo }
  const dangBo = () => ngan.some((x) => x.bo);
  const re =
    /<!--[\s\S]*?-->|<(script|style|noscript|template|svg)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) {
      // JSON-LD: soát chuỗi bên trong (trừ URL)
      if (m[1].toLowerCase() === "script" && /application\/ld\+json/i.test(m[2] || "") && !dangBo()) {
        try {
          const duyet = (v) => {
            if (typeof v === "string") {
              if (!/^https?:|^\//.test(v)) ra.push({ nguon: "JSON-LD", txt: v });
            } else if (v && typeof v === "object") Object.values(v).forEach(duyet);
          };
          duyet(JSON.parse(m[3]));
        } catch {}
      }
      continue;
    }
    if (m[4]) {
      const ten = m[4].toLowerCase();
      const i = ngan.map((x) => x.ten).lastIndexOf(ten);
      if (i >= 0) ngan.length = i;
      continue;
    }
    if (m[5]) {
      const ten = m[5].toLowerCase();
      const tt = thuocTinh(m[6] || "");
      const tuDong = VOID.has(ten) || /\/\s*$/.test(m[6] || "");
      const boPhanTu = tt.lang !== undefined && tt.lang.split("-")[0] !== langTrang && ten !== "html";
      if (!dangBo() && !boPhanTu) {
        for (const k of ["alt", "title", "aria-label", "placeholder"]) {
          if (tt[k] && tt[k].trim()) ra.push({ nguon: `${k} <${ten}>`, txt: tt[k] });
        }
        if (ten === "meta" && tt.content && (/description/i.test(tt.name || "") || /^og:(title|description)|^twitter:(title|description)/i.test(tt.property || tt.name || ""))) {
          ra.push({ nguon: `meta ${tt.name || tt.property}`, txt: tt.content });
        }
        if (ten === "input" && /^(submit|button)$/i.test(tt.type || "") && tt.value) ra.push({ nguon: "input value", txt: tt.value });
      }
      if (!tuDong) ngan.push({ ten, bo: boPhanTu });
      continue;
    }
    if (m[7] && !dangBo()) {
      const txt = giaiMa(m[7]).replace(/\s+/g, " ").trim();
      if (txt) ra.push({ nguon: `chữ <${ngan.at(-1)?.ten ?? "?"}>`, txt });
    }
  }
  return ra;
}

// ---------- chạy ----------
const tienTo = { vi: "", en: "/en", de: "/de" };
const url = (path, l) => `${goc}${l === "vi" ? path : path === "/" ? tienTo[l] : tienTo[l] + path}`;

let loi = 0;
let canhBao = 0;
let trangLoi = 0;
const tom = [];

for (const l of ngonNgu) {
  for (const path of trang) {
    const u = url(path, l);
    let html;
    try {
      const r = await fetch(u, { signal: AbortSignal.timeout(180_000), redirect: "manual" });
      if (r.status !== 200) {
        console.log(`LỖI   ${u} — HTTP ${r.status}`);
        loi++;
        trangLoi++;
        continue;
      }
      html = await r.text();
    } catch (e) {
      console.log(`LỖI   ${u} — không tải được (${e.message})`);
      loi++;
      trangLoi++;
      continue;
    }

    const langHtml = /<html[^>]*\blang="([^"]+)"/i.exec(html)?.[1];
    const doan = layChu(html, l);
    const sai = [];
    if (langHtml !== l) sai.push({ nguon: "<html lang>", txt: `lang="${langHtml}" (phải là "${l}")`, nang: true });

    const daThay = new Set();
    for (const d of doan) {
      const khoa = `${d.nguon}|${d.txt}`;
      if (daThay.has(khoa)) continue;
      daThay.add(khoa);
      if (l !== "vi") {
        if (RE_VIET.test(d.txt)) sai.push({ ...d, nang: true, kyTu: [...new Set(d.txt.match(RE_VIET_G))].join("") });
      } else {
        const ngoai = lacNgoai(d.txt);
        if (ngoai) sai.push({ ...d, nang: false, ngoai });
      }
    }

    const nang = sai.filter((x) => x.nang).length;
    const nhe = sai.length - nang;
    loi += nang;
    canhBao += nhe;
    if (nang) trangLoi++;
    tom.push({ u, nang, nhe });

    if (!sai.length) {
      console.log(`SẠCH  ${u}`);
      continue;
    }
    console.log(`${nang ? "LỖI  " : "LƯU Ý"} ${u} — ${nang ? `${nang} đoạn lẫn tiếng Việt` : ""}${nang && nhe ? ", " : ""}${nhe ? `${nhe} đoạn nghi tiếng ${[...new Set(sai.map((x) => x.ngoai))].join("/")}` : ""}`);
    for (const x of sai.slice(0, 80)) {
      const cat = x.txt.length > 160 ? `${x.txt.slice(0, 157)}...` : x.txt;
      console.log(`        [${x.nguon}${x.ngoai ? ` · ${x.ngoai}` : ""}] ${cat}`);
    }
    if (sai.length > 80) console.log(`        ... và ${sai.length - 80} đoạn nữa`);
  }
}

console.log(
  `\nTổng: ${tom.length} trang · ${loi} đoạn LỖI (lẫn tiếng Việt ở en/de, sai lang, HTTP) trên ${trangLoi} trang · ${canhBao} đoạn LƯU Ý ở bản vi`
);
process.exit(loi ? 1 : 0);
