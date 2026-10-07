import { CAM_NANG, type Bai, type Khoi } from "@/data/articles";
import type { Lang } from "@/lib/i18n/config";
import { AN_MUC_THIEU, batBuocDu, timChoThieu, type BanDichTheoNgonNgu } from "@/lib/i18n/du-lieu";
import { ARTICLES_EN } from "./articles.en";
import { ARTICLES_DE } from "./articles.de";
import { chuyenMucTheoChu, type ChuyenMuc } from "@/lib/i18n/dict/cam-nang";

/**
 * BẢN DỊCH CẨM NANG (data/articles.ts giữ nguyên bản tiếng Việt).
 *
 * articles.en.ts / articles.de.ts: Record<id bài, BaiBanDich>. Mỗi bài dịch
 * tiêu đề, tóm tắt và TOÀN BỘ khối nội dung. Cấu trúc khối phải khớp bản gốc
 * từng chiếc: cùng số khối, cùng số đoạn, cùng số gạch, có/không có lưu ý.
 * `nhom` và `phut` không dịch — nhom là MÃ, hiển thị qua lib/i18n/dict/cam-nang.ts.
 */
export interface BaiBanDich {
  tieuDe: string;
  tomTat: string;
  khoi: Khoi[];
}

const BAN: BanDichTheoNgonNgu<BaiBanDich> = { en: ARTICLES_EN, de: ARTICLES_DE };

function kiemKhoi(ten: string, goc: Bai, b: BaiBanDich): string[] {
  const ra: string[] = [];
  if (!Array.isArray(b.khoi)) return ra;
  goc.khoi.forEach((k, i) => {
    const d = b.khoi[i];
    if (!d) return;
    const o = `${ten}: "${goc.id}".khoi[${i}]`;
    if (!d.tieuDe?.trim()) ra.push(`${o}.tieuDe trống`);
    for (const f of ["doan", "gach"] as const) {
      const n = k[f]?.length ?? 0;
      const m = d[f]?.length ?? 0;
      if (n !== m) ra.push(`${o}.${f} có ${m} phần tử, bản gốc có ${n}`);
      if (d[f]?.some((x) => !x.trim())) ra.push(`${o}.${f} có phần tử trống`);
    }
    if (!!k.luuY !== !!d.luuY?.trim()) ra.push(`${o}.luuY ${k.luuY ? "thiếu" : "thừa"}`);
  });
  return ra;
}

function kiem(lang: "en" | "de"): string[] {
  const ten = `articles.${lang}`;
  const ban = BAN[lang];
  const ra = timChoThieu<Bai, BaiBanDich>(ten, CAM_NANG, ban, ["tieuDe", "tomTat", "khoi"], {
    khoi: (b) => b.khoi,
  });
  for (const g of CAM_NANG) {
    const b = ban[g.id];
    if (b) ra.push(...kiemKhoi(ten, g, b));
  }
  return ra;
}

/** Danh sách chỗ thiếu của cả hai ngôn ngữ — đăng ký trong data/i18n/kiem.ts */
export function choThieuBaiViet(): string[] {
  return [...kiem("en"), ...kiem("de")];
}

let daKiem = false;
function kiemMotLan() {
  if (daKiem) return;
  daKiem = true;
  batBuocDu(choThieuBaiViet());
}

/** Bài cẩm nang theo ngôn ngữ. vi → bản gốc; en/de thiếu bản dịch → NÉM LỖI (hoặc ẩn khi bật NB_I18N_AN_MUC_THIEU). */
export function getArticles(lang: Lang): Bai[] {
  if (lang === "vi") return CAM_NANG;
  kiemMotLan();
  const ban = BAN[lang];
  const ra: Bai[] = [];
  for (const g of CAM_NANG) {
    const b = ban[g.id];
    if (b) ra.push({ ...g, tieuDe: b.tieuDe, tomTat: b.tomTat, khoi: b.khoi });
    else if (!AN_MUC_THIEU) throw new Error(`articles.${lang}: thiếu "${g.id}"`);
  }
  return ra;
}

export function getArticle(id: string, lang: Lang): Bai | undefined {
  return getArticles(lang).find((b) => b.id === id);
}

/**
 * Bài nào thuộc chuyên mục nào — suy từ nội dung bản GỐC tiếng Việt (không
 * gán tay từng bài), nên cùng một bài thuộc cùng chuyên mục ở mọi ngôn ngữ.
 */
export function chuyenMucCuaBai(id: string): ChuyenMuc[] {
  const b = CAM_NANG.find((x) => x.id === id);
  if (!b) return ["cuoc-song"];
  return chuyenMucTheoChu(`${b.tieuDe} ${b.tomTat}`);
}
