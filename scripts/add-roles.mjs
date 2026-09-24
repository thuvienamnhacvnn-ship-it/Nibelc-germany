/**
 * Bổ sung `roles` (danh sách vị trí hiển thị trên thẻ ngành) và `icon`
 * vào registry, lấy đúng từ screens/04-branchen.png.
 *
 * Ngành 07 cố ý để roles rỗng: mockup có in "Ingenieure, IT-Spezialisten,
 * Wirtschaftsexperten" nhưng đó là mockup, chưa phải dữ liệu được duyệt cho
 * muc CAN DIEN 02. Chép vào là tự điền — bị cấm.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/industries.ts";
let s = readFileSync(FILE, "utf8");

const ROLES = {
  "gastronomie-koch": ["Köche", "Küchenhilfen", "Servicekräfte"],
  "baeckerei-baecker": ["Bäcker", "Konditoren", "Fachverkäufer"],
  "fleischerei-fleischer": ["Metzger", "Produktionshelfer", "Fachverkäufer"],
  "elektrotechnik-elektroniker": [
    "Elektriker",
    "Mechatroniker",
    "Anlagenmonteure",
  ],
  "logistik-fachkraft-lagerlogistik": [
    "Fachlageristen",
    "Staplerfahrer",
    "Logistikhelfer",
  ],
  "gartenbau-gaertner": ["Gärtner", "Landschaftsbauer", "Helfer"],
  "akademische-fachkraefte": [],
  "produktion-maschinen-anlagen": [
    "Maschinenbediener",
    "Anlagenführer",
    "Produktionshelfer",
  ],
};

const ICONS = {
  "gastronomie-koch": "utensils",
  "baeckerei-baecker": "bread",
  "fleischerei-fleischer": "meat",
  "elektrotechnik-elektroniker": "bolt",
  "logistik-fachkraft-lagerlogistik": "box",
  "gartenbau-gaertner": "leaf",
  "akademische-fachkraefte": "cap",
  "produktion-maschinen-anlagen": "gear",
};

// 1) thêm field vào interface
if (!s.includes("roles: string[]")) {
  s = s.replace(
    "  /** Tên nghề chính thức tiếng Đức */\n  berufDe: string;",
    "  /** Tên nghề chính thức tiếng Đức */\n  berufDe: string;\n" +
      "  /** Các vị trí cụ thể, hiện trên thẻ ngành (theo screens/04) */\n" +
      "  roles: string[];\n" +
      "  /** Khoá icon tròn trên thẻ ngành */\n" +
      "  icon: IndustryIcon;",
  );
}

// 2) thêm type icon
if (!s.includes("export type IndustryIcon")) {
  s = s.replace(
    'export type IndustryStatus = "active" | "blocked";',
    'export type IndustryStatus = "active" | "blocked";\n\n' +
      "export type IndustryIcon =\n" +
      '  | "utensils"\n  | "bread"\n  | "meat"\n  | "bolt"\n' +
      '  | "box"\n  | "leaf"\n  | "cap"\n  | "gear";',
  );
}

// 3) chèn roles + icon vào từng ngành, ngay sau dòng berufDe
let added = 0;
for (const [slug, roles] of Object.entries(ROLES)) {
  const icon = ICONS[slug];
  const rx = new RegExp(
    `(slug: "${slug}",[\\s\\S]*?berufDe: [^\\n]*\\n)`,
    "m",
  );
  const m = s.match(rx);
  if (!m) {
    console.log("KHONG THAY " + slug);
    continue;
  }
  if (m[1].includes("roles:")) continue;
  const rolesLine = `    roles: [${roles.map((r) => JSON.stringify(r)).join(", ")}],\n`;
  const iconLine = `    icon: ${JSON.stringify(icon)},\n`;
  s = s.replace(rx, m[1] + rolesLine + iconLine);
  added++;
}

writeFileSync(FILE, s, "utf8");
console.log("Da bo sung roles/icon cho " + added + " nganh");
