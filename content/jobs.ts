/**
 * Tin tuyển dụng THẬT, lấy từ ba ấn phẩm chính thức của NIBELC
 * (chương trình nhà kính tại München / Seevetal / Münster).
 *
 * ⚠️ CẢNH BÁO PHÁP LÝ — đọc trước khi render bất cứ trường nào:
 *
 * Ấn phẩm gốc có ghi giới hạn GIỚI TÍNH ("Nam tuyển từ 20–45") và ĐỘ TUỔI
 * ("20–45"). Đăng tin tuyển dụng kèm hai giới hạn này tại Đức vi phạm
 * §§ 7, 11 AGG (Allgemeines Gleichbehandlungsgesetz) và có thể dẫn tới yêu
 * cầu bồi thường.
 *
 * Vì vậy hai trường đó được lưu lại để đối chiếu nội bộ nhưng KHÔNG có hàm
 * nào trả chúng ra giao diện công khai. Muốn đăng thì phải bỏ giới hạn, hoặc
 * chứng minh được đây là yêu cầu nghề nghiệp thiết yếu theo § 8 AGG.
 */

export interface JobPosting {
  id: string;
  /** Ngành trong registry mà tin này thuộc về */
  industrySlug: string;

  titleVi: string;
  titleDe: string;

  /** Số suất tuyển */
  openings: number;

  salary: { min: number; max: number; currency: "EUR"; per: "Monat" };

  /** Mức tiếng Đức yêu cầu, thang CEFR */
  german: string;
  /** Kinh nghiệm bắt buộc, null nếu không yêu cầu */
  experience: string | null;

  locations: string[];
  weeklyHours: number;
  overtimeNote: string;
  contractNote: string;
  visaTypes: string[];

  benefits: string[];
  /** Điều kiện hợp lệ, đã bỏ các yếu tố thuộc diện AGG */
  requirements: string[];

  /** Nội bộ — KHÔNG render ra trang công khai (xem cảnh báo đầu file) */
  internalOnly: { genderRestriction: string | null; ageRange: string };

  source: string;
}

const COMMON = {
  locations: ["München", "Seevetal", "Münster"],
  weeklyHours: 40,
  overtimeNote: "Mehrarbeit wird nach den gesetzlichen Vorgaben vergütet.",
  contractNote: "Vertragsdauer richtet sich nach dem erteilten Aufenthaltstitel.",
  visaTypes: ["16a", "18a", "19c", "15d (kombiniert)"],
  benefits: [
    "Gesetzliche Sozial-, Renten- und Krankenversicherung",
    "Gleiche Arbeitnehmerrechte wie deutsche Beschäftigte",
    "Unterstützung bei Unterkunft oder Wohnkostenzuschuss",
  ],
  requirements: [
    "Gesundheitliche Eignung, keine ansteckenden Erkrankungen",
    "Kein vorheriges Visumverbot und keine Ausweisung aus einem EU-Staat",
  ],
} as const;

export const JOBS: JobPosting[] = [
  {
    id: "gewaechshaus-gemuesebau",
    industrySlug: "gartenbau-gaertner",
    titleVi: "Công nhân trồng rau, củ, quả trong nhà kính",
    titleDe: "Mitarbeiter/in im Gewächshaus-Gemüsebau",
    openings: 40,
    salary: { min: 2000, max: 2400, currency: "EUR", per: "Monat" },
    german: "A1–A2 (von Vorteil)",
    experience: null,
    ...COMMON,
    locations: [...COMMON.locations],
    visaTypes: [...COMMON.visaTypes],
    benefits: [...COMMON.benefits],
    requirements: [...COMMON.requirements],
    internalOnly: { genderRestriction: null, ageRange: "20–45" },
    source: "NIBELC Aushang — CN trồng rau củ quả trong nhà kính",
  },
  {
    id: "gewaechshaus-leitung",
    industrySlug: "gartenbau-gaertner",
    titleVi: "Quản lý nhà kính",
    titleDe: "Gewächshausleitung",
    openings: 5,
    salary: { min: 2100, max: 2500, currency: "EUR", per: "Monat" },
    german: "B1",
    experience: null,
    ...COMMON,
    locations: [...COMMON.locations],
    visaTypes: [...COMMON.visaTypes],
    benefits: [...COMMON.benefits],
    requirements: [...COMMON.requirements],
    internalOnly: { genderRestriction: null, ageRange: "20–45" },
    source: "NIBELC Aushang — Vị trí quản lý nhà kính",
  },
  {
    id: "gewaechshaus-instandhaltung",
    industrySlug: "gartenbau-gaertner",
    titleVi: "Thợ bảo trì trang trại nhà kính",
    titleDe: "Instandhaltungstechniker/in Gewächshaus",
    openings: 5,
    salary: { min: 2000, max: 2400, currency: "EUR", per: "Monat" },
    german: "A2–B1",
    experience: "1–2 Jahre Erfahrung in der Instandhaltung",
    ...COMMON,
    locations: [...COMMON.locations],
    visaTypes: [...COMMON.visaTypes],
    benefits: [...COMMON.benefits],
    requirements: [...COMMON.requirements],
    internalOnly: {
      // Ấn phẩm gốc ghi "Nam tuyển từ 20–45". Giữ lại để đối chiếu, không đăng.
      genderRestriction: "Nam (theo ấn phẩm gốc — không được đăng tại Đức)",
      ageRange: "20–45",
    },
    source: "NIBELC Aushang — Thợ bảo trì",
  },
];

export function jobsByIndustry(slug: string): JobPosting[] {
  return JOBS.filter((j) => j.industrySlug === slug);
}

export function formatSalary(job: JobPosting): string {
  const f = new Intl.NumberFormat("de-DE");
  return `${f.format(job.salary.min)}–${f.format(job.salary.max)} € / ${job.salary.per}`;
}
