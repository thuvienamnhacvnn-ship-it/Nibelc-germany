import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Nơi nhận của hai biểu mẫu (liên hệ và nhu cầu nhân sự).
 *
 * Chưa có hộp thư SMTP nào được cấp, nên form KHÔNG hứa gửi email. Mỗi lần
 * gửi được ghi thành một dòng JSON trong thư mục dữ liệu ngoài repo
 * (`NIBELC_DATA_DIR`, mặc định `.data/`), để người phụ trách đọc lại.
 * Khi có SMTP thì chỉ cần thêm một bước gửi mail ở `saveAnfrage`.
 */

export type AnfrageKind = "kontakt" | "personalbedarf";

export interface AnfrageRecord {
  kind: AnfrageKind;
  locale: string;
  receivedAt: string;
  data: Record<string, string>;
}

export function dataDir(): string {
  return process.env.NIBELC_DATA_DIR ?? join(process.cwd(), ".data");
}

/** Cắt bớt để một trường hỏng không làm phình file. */
function clean(v: unknown, max = 4000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function normalise(body: Record<string, unknown>, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = clean(body[k]);
    if (v) out[k] = v;
  }
  return out;
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export async function saveAnfrage(rec: AnfrageRecord): Promise<void> {
  const dir = dataDir();
  await mkdir(dir, { recursive: true });
  await appendFile(join(dir, `${rec.kind}.jsonl`), `${JSON.stringify(rec)}\n`, "utf8");
}
