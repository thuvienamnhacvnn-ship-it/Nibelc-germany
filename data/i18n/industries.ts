import type { Industry } from "@/types/industry";
import { INDUSTRIES } from "@/data/industries";
import type { Lang } from "@/lib/i18n/config";
import { timChoThieu } from "@/lib/i18n/du-lieu";

/**
 * Tên 12 nhóm ngành theo ngôn ngữ.
 * vi → titleVi, de → titleDe (đã có sẵn trong data/industries.ts),
 * en → bảng dưới đây (khoá theo id).
 */
const EN: Record<string, { title: string }> = {
  pflege: { title: "Nursing & Healthcare" },
  gastronomie: { title: "Hospitality & Catering" },
  elektro: { title: "Electrical Engineering" },
  mechanik: { title: "Metalwork & Welding" },
  logistik: { title: "Logistics" },
  kosmetik: { title: "Beauty & Cosmetics" },
  bau: { title: "Construction & Interior Finishing" },
  automotive: { title: "Automotive & Engineering" },
  it: { title: "IT" },
  handel: { title: "Retail & Sales" },
  landwirtschaft: { title: "Agriculture & Horticulture" },
  soziales: { title: "Social Care" },
};

export function tenNganh(n: Industry, lang: Lang): string {
  if (lang === "vi") return n.titleVi;
  if (lang === "de") return n.titleDe;
  const b = EN[n.id];
  if (!b) throw new Error(`industries.en: thiếu "${n.id}"`);
  return b.title;
}

export function choThieuNganh(): string[] {
  return [
    ...timChoThieu("industries.en", INDUSTRIES, EN, ["title"]),
    ...INDUSTRIES.filter((n) => !n.titleDe.trim()).map((n) => `industries.de: "${n.id}".titleDe trống`),
  ];
}
