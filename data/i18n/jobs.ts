import { JOBS, type JobFull } from "@/data/jobs";
import type { EmploymentType, Job, ProgramType } from "@/types/job";
import { tuDien } from "@/lib/i18n/dict";
import type { Lang } from "@/lib/i18n/config";
import { AN_MUC_THIEU, batBuocDu, timChoThieu, type BanDichTheoNgonNgu } from "@/lib/i18n/du-lieu";
import en from "./jobs.en.json";
import de from "./jobs.de.json";

/**
 * BẢN DỊCH ĐƠN HÀNG (20 đơn = 16 đơn thật trong data/jobs-that.json + 4 đơn
 * MẪU trong data/jobs.ts).
 *
 * jobs.en.json / jobs.de.json khoá theo `id` của đơn:
 *   {
 *     "al-260703-oto": {
 *       "title": "Car cleaning and valeting staff in Tirana",
 *       "state": "Albania",
 *       "experience": "No experience required",
 *       "description": "...",
 *       "requirements": ["...", "...", "..."],   // ĐÚNG số phần tử như bản gốc
 *       "benefits": ["...", "..."],
 *       "positions": ["Car cleaning operative", "Team leader (English required)"]
 *     }
 *   }
 * `city` chỉ ghi khi tên khác bản gốc (vd en "Munich" cho "München").
 *
 * Luật nội dung (AGG): KHÔNG đưa tuổi, giới tính, chiều cao, cân nặng, tình
 * trạng hôn nhân vào bản dịch, kể cả khi bản gốc lỡ có.
 * Tiếng Đức dùng tên nghề chuẩn (Pflegefachkraft, Elektroniker/in ...), xưng "Sie".
 */

export interface JobBanDich {
  title: string;
  state: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  /** tên từng vị trí, cùng thứ tự với job.positions */
  positions: string[];
  city?: string;
  languageLevel?: string;
}

const BAN: BanDichTheoNgonNgu<JobBanDich> = {
  en: en as Record<string, JobBanDich>,
  de: de as Record<string, JobBanDich>,
};

const BAT_BUOC = ["title", "state", "experience", "description", "requirements", "benefits", "positions"] as const;

function kiem(lang: "en" | "de"): string[] {
  return timChoThieu<JobFull, JobBanDich>(`jobs.${lang}`, JOBS, BAN[lang], BAT_BUOC, {
    requirements: (j) => j.requirements,
    benefits: (j) => j.benefits,
    positions: (j) => j.positions,
  });
}

/** Danh sách chỗ thiếu của cả hai ngôn ngữ — dùng cho script kiểm */
export function choThieuDonHang(): string[] {
  return [...kiem("en"), ...kiem("de")];
}

let daKiem = false;
function kiemMotLan() {
  if (daKiem) return;
  daKiem = true;
  batBuocDu(choThieuDonHang());
}

function dich(j: JobFull, b: JobBanDich): JobFull {
  return {
    ...j,
    title: b.title,
    state: b.state,
    city: b.city ?? j.city,
    experience: b.experience,
    description: b.description,
    requirements: b.requirements,
    benefits: b.benefits,
    languageLevel: b.languageLevel ?? j.languageLevel,
    positions: j.positions.map((p, i) => ({ ...p, name: b.positions[i] ?? p.name })),
  };
}

/**
 * Đơn hàng theo ngôn ngữ. vi → bản gốc. en/de → bản dịch; thiếu thì NÉM LỖI
 * (hoặc, khi bật NB_I18N_AN_MUC_THIEU=1, bỏ đơn chưa dịch khỏi danh sách).
 */
export function getJobs(lang: Lang): JobFull[] {
  if (lang === "vi") return JOBS;
  kiemMotLan();
  const ban = BAN[lang];
  const ra: JobFull[] = [];
  for (const j of JOBS) {
    const b = ban[j.id];
    if (b) ra.push(dich(j, b));
    else if (!AN_MUC_THIEU) throw new Error(`jobs.${lang}: thiếu "${j.id}"`);
  }
  return ra;
}

export function getJobBySlug(slug: string, lang: Lang): JobFull | undefined {
  return getJobs(lang).find((j) => j.slug === slug);
}

/**
 * Nhãn cho các trường dạng MÃ của đơn hàng. Bản gốc lưu giá trị tiếng Việt
 * ("Toàn thời gian", "tháng") làm mã — hiển thị thì PHẢI qua bảng này.
 */
export const NHAN_DON_HANG = tuDien<{
  hinhThuc: Record<EmploymentType, string>;
  chuongTrinh: Record<ProgramType, string>;
  ky: Record<Job["salaryType"], string>;
}>({
  vi: {
    hinhThuc: { "Toàn thời gian": "Toàn thời gian", "Thời vụ": "Thời vụ", "Ca kíp": "Ca kíp" },
    chuongTrinh: { "Lao động": "Lao động", "Du học nghề": "Du học nghề" },
    ky: { tháng: "tháng", giờ: "giờ" },
  },
  en: {
    hinhThuc: { "Toàn thời gian": "Full-time", "Thời vụ": "Seasonal", "Ca kíp": "Shift work" },
    chuongTrinh: { "Lao động": "Employment", "Du học nghề": "Vocational training" },
    ky: { tháng: "month", giờ: "hour" },
  },
  de: {
    hinhThuc: { "Toàn thời gian": "Vollzeit", "Thời vụ": "Saisonarbeit", "Ca kíp": "Schichtarbeit" },
    chuongTrinh: { "Lao động": "Arbeit", "Du học nghề": "Ausbildung" },
    ky: { tháng: "Monat", giờ: "Stunde" },
  },
});
