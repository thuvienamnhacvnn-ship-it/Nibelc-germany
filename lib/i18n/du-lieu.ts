import type { Lang } from "./config";

/**
 * BẢN DỊCH CHO DỮ LIỆU LỚN (đơn hàng, bài cẩm nang, ngành Ausbildung...)
 *
 * Dữ liệu gốc (tiếng Việt) giữ nguyên ở data/*.ts|json. Bản dịch nằm ở file
 * song song trong data/i18n/, KHOÁ THEO id:
 *
 *   data/i18n/jobs.en.json  → { "<id>": { "title": "...", "requirements": [...] } }
 *
 * apDungBanDich() trộn bản dịch vào bản gốc và NÉM LỖI nếu thiếu id, thiếu
 * trường hoặc mảng lệch số phần tử — KHÔNG BAO GIỜ âm thầm rơi về tiếng Việt.
 * Lỗi ném lúc nạp module nên `next build` (bước Collecting page data) và
 * `next dev` đều đỏ ngay ở trang dùng dữ liệu đó.
 */

export class ThieuBanDich extends Error {
  // Không dùng "parameter property" (constructor(public x)) — Node chạy
  // scripts/kiem-ban-dich.mjs ở chế độ chỉ-bỏ-kiểu, không hiểu cú pháp đó.
  readonly danhSach: string[];
  constructor(danhSach: string[]) {
    super(
      `Thiếu bản dịch (${danhSach.length}):\n  - ${danhSach.slice(0, 40).join("\n  - ")}${
        danhSach.length > 40 ? `\n  ... và ${danhSach.length - 40} mục nữa` : ""
      }\nBổ sung vào data/i18n/ — xem _w-agent/i18n-huong-dan.md`
    );
    this.name = "ThieuBanDich";
    this.danhSach = danhSach;
  }
}

type Rong = string | string[] | undefined | null;

function rong(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

/**
 * Liệt kê chỗ thiếu của MỘT bộ bản dịch.
 * @param ten        tên bộ, vd "jobs.en"
 * @param goc        bản gốc
 * @param ban        bản dịch khoá theo id
 * @param batBuoc    trường bắt buộc phải có
 * @param cungDoDai  trường mảng phải cùng số phần tử với bản gốc;
 *                   giá trị là hàm lấy mảng gốc tương ứng
 */
export function timChoThieu<T extends { id: string }, B extends object>(
  ten: string,
  goc: readonly T[],
  ban: Record<string, B>,
  batBuoc: readonly (keyof B & string)[],
  cungDoDai: Partial<Record<keyof B & string, (g: T) => readonly unknown[]>> = {}
): string[] {
  const thieu: string[] = [];
  const ids = new Set(goc.map((g) => g.id));
  for (const g of goc) {
    const b = ban[g.id] as Record<string, Rong> | undefined;
    if (!b) {
      thieu.push(`${ten}: chưa có id "${g.id}"`);
      continue;
    }
    for (const k of batBuoc) {
      const v = b[k];
      if (rong(v)) thieu.push(`${ten}: "${g.id}".${k} trống`);
      else if (Array.isArray(v) && v.some((x) => rong(x))) thieu.push(`${ten}: "${g.id}".${k} có phần tử trống`);
    }
    for (const [k, layGoc] of Object.entries(cungDoDai) as [string, (g: T) => readonly unknown[]][]) {
      const v = b[k];
      const n = layGoc(g).length;
      if (Array.isArray(v) && v.length !== n) thieu.push(`${ten}: "${g.id}".${k} có ${v.length} phần tử, bản gốc có ${n}`);
    }
  }
  for (const id of Object.keys(ban)) if (!ids.has(id)) thieu.push(`${ten}: id "${id}" không còn trong dữ liệu gốc (xoá đi)`);
  return thieu;
}

/**
 * Cho phép tạm thời ẩn mục chưa dịch thay vì làm sập build — CHỈ dùng khi cần
 * deploy gấp lúc vừa nhập đơn mới mà chưa kịp dịch. Mục thiếu bản dịch bị
 * BỎ khỏi bản en/de (không hiện tiếng Việt thay thế).
 *   NB_I18N_AN_MUC_THIEU=1 npm run build
 */
export const AN_MUC_THIEU = process.env.NB_I18N_AN_MUC_THIEU === "1";

/** Ném lỗi nếu có chỗ thiếu (trừ khi bật AN_MUC_THIEU — khi đó chỉ cảnh báo) */
export function batBuocDu(thieu: string[]): void {
  if (thieu.length === 0) return;
  if (AN_MUC_THIEU) {
    console.warn(new ThieuBanDich(thieu).message);
    return;
  }
  throw new ThieuBanDich(thieu);
}

/** Bộ dịch cho một tập dữ liệu: khoá ngôn ngữ en/de (vi là bản gốc) */
export type BanDichTheoNgonNgu<B> = Record<Exclude<Lang, "vi">, Record<string, B>>;
