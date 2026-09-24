import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import {
  INDUSTRY_ASSETS,
  type IndustryAssetSet,
} from "@/content/industry-assets";

/**
 * ASSET LOCK — test bắt buộc theo master prompt.
 *
 * Mục đích: làm fail build nếu mã production tham chiếu tới nguồn ảnh bị cách
 * ly (Drive, du-lieu-goc, thư mục incoming/raw/downloads) hoặc ảnh stock từ
 * internet. Đây là hàng rào tự động, không phụ thuộc vào việc ai đó nhớ luật.
 */

const ROOT = process.cwd();

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git")
      continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Bỏ comment trước khi quét.
 *
 * Luật cấm MÃ tham chiếu tới nguồn ảnh bị cách ly, không cấm nhắc tên chúng
 * trong chú thích — mà chính file registry phải giải thích luật đó. Quét cả
 * comment thì test tự bắt tài liệu của mình.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
}

/** Mã chạy trên production — không tính tests, scripts, docs, kit. */
function productionFiles(): string[] {
  return [
    ...walk(join(ROOT, "app")),
    ...walk(join(ROOT, "components")),
    ...walk(join(ROOT, "content")),
    ...walk(join(ROOT, "lib")),
  ].filter((f) => [".ts", ".tsx"].includes(extname(f)));
}

describe("ASSET LOCK — chỉ dùng ảnh trong KIT", () => {
  it("không mã production nào tham chiếu nguồn ảnh bị cách ly", () => {
    const forbidden = [
      /du-lieu-goc/i,
      // "drive" chỉ bị cấm khi nó là một ĐOẠN ĐƯỜNG DẪN. Không cấm chuỗi
      // "approved-drive" — đó là tên type do spec bắt buộc, dùng cho giai
      // đoạn sau khi Sếp đã duyệt từng ảnh.
      /["'`/]drive[/"'`]/i,
      /["'`/]incoming[/"'`]/i,
      /["'`/]raw[/"'`]/i,
      /["'`/]downloads[/"'`]/i,
      /public\/hero\//i,
    ];

    const offenders: string[] = [];
    for (const f of productionFiles()) {
      const text = stripComments(readFileSync(f, "utf8"));
      for (const rx of forbidden) {
        if (rx.test(text)) {
          offenders.push(`${f.replace(ROOT, "")} :: ${rx}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("không tham chiếu ảnh stock từ internet", () => {
    const remote =
      /(unsplash|pexels|pixabay|shutterstock|gettyimages|istockphoto|freepik)/i;
    const offenders = productionFiles().filter((f) =>
      remote.test(stripComments(readFileSync(f, "utf8"))),
    );
    expect(offenders).toEqual([]);
  });

  it("mọi ảnh trong registry đều là nguồn KIT và đã duyệt", () => {
    for (const [slug, set] of Object.entries(INDUSTRY_ASSETS)) {
      expect(set.source, slug).toBe("kit");
      expect(set.approved, slug).toBe(true);
    }
  });

  it("bốn slot của mỗi ngành trỏ đúng tên file KIT và có thật trên đĩa", () => {
    const expected: Record<keyof Omit<IndustryAssetSet, "source" | "approved">, RegExp> =
      {
        hero: /\/01-hero-16x9\.jpg$/,
        portraitWork: /\/02-portrait-work-3x4\.jpg$/,
        portraitTeam: /\/03-portrait-team-3x4\.jpg$/,
        detail: /\/04-detail-closeup\.jpg$/,
      };

    for (const [slug, set] of Object.entries(INDUSTRY_ASSETS)) {
      for (const [key, rx] of Object.entries(expected)) {
        const src = set[key as keyof typeof expected];
        expect(src, `${slug}.${key}`).toMatch(rx);
        expect(src.startsWith("/branchen/"), `${slug}.${key}`).toBe(true);
        expect(
          existsSync(join(ROOT, "public", src)),
          `thiếu file ${src}`,
        ).toBe(true);
      }
    }
  });

  it("có đủ tám ngành trong registry", () => {
    expect(Object.keys(INDUSTRY_ASSETS)).toHaveLength(8);
  });

  it("thư mục public không chứa ảnh ngoài KIT", () => {
    // public/hero từng chứa ảnh tự tạo ngoài KIT — phải sạch ở giai đoạn này.
    expect(existsSync(join(ROOT, "public", "hero"))).toBe(false);
  });
});
