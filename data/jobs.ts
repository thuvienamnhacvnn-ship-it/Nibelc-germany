import type { EmploymentType, Job, ProgramType } from "@/types/job";
import thatSu from "./jobs-that.json";

/**
 * KHO ĐƠN HÀNG
 *
 * Nguồn chính là 16 đơn THẬT, sinh từ thông báo tuyển dụng gốc của công ty
 * bằng `scripts/xuat-cho-webapp.ts` (bên dự án nibel-de). Dữ liệu đó đã đi qua
 * bộ lọc AGG nên không còn giới tính, tuổi, chiều cao hay cân nặng.
 *
 * Bốn nhóm ngành chưa có đơn thật thì có bản MẪU, đánh dấu `isSample: true`
 * để không ai nhầm là đơn đang tuyển. Bản mẫu KHÔNG có tên doanh nghiệp —
 * giao diện tự hiển thị "Đối tác tại <thành phố>".
 */

export interface JobFull extends Job {
  gallery: string[];
  positions: { name: string; count: number | null; salaryFrom: number | null; salaryTo: number | null }[];
  hours: number | null;
  /** true = dữ liệu minh hoạ, chưa phải đơn đang tuyển */
  isSample?: boolean;
}

interface Tho {
  id: string;
  slug: string;
  industryId: string;
  title: string;
  city: string;
  state: string;
  salary: { min: number; max: number };
  salaryType: string;
  vacancies: number;
  employmentType: string;
  programType: string;
  languageLevel: string;
  experience: string;
  image: string | null;
  thumbnail: string | null;
  gallery: string[];
  positions: { name: string; count: number | null; salaryFrom: number | null; salaryTo: number | null }[];
  description: string;
  requirements: string[];
  benefits: string[];
  hours: number | null;
  featured: boolean;
  createdAt: string;
}

/** Ảnh thay thế khi một đơn chưa có ảnh nơi làm việc, lấy theo nhóm ngành */
const ANH_NGANH: Record<string, string> = {
  // Ảnh 16:9 tạo riêng cho từng nhóm ngành bằng Gemini
  // (scripts/tao-anh-nghe.mjs). Thẻ đơn hàng bay lên hero dùng chính bộ này,
  // nên cả 12 nhóm nhìn cùng một phong cách.
  pflege: "/assets/nghe/pflege.jpg",
  gastronomie: "/assets/nghe/gastronomie.jpg",
  elektro: "/assets/nghe/elektro.jpg",
  mechanik: "/assets/nghe/mechanik.jpg",
  logistik: "/assets/nghe/logistik.jpg",
  kosmetik: "/assets/nghe/kosmetik.jpg",
  bau: "/assets/nghe/bau.jpg",
  automotive: "/assets/nghe/automotive.jpg",
  it: "/assets/nghe/it.jpg",
  handel: "/assets/nghe/handel.jpg",
  landwirtschaft: "/assets/nghe/landwirtschaft.jpg",
  soziales: "/assets/nghe/soziales.jpg",
};

function anhCua(j: Tho, thu: "image" | "thumbnail"): string {
  return j[thu] ?? j.image ?? ANH_NGANH[j.industryId] ?? "/assets/jobs/logistik/01-hero-16x9.jpg";
}

const THAT: JobFull[] = (thatSu as Tho[]).map((j) => ({
  ...j,
  salaryType: j.salaryType as Job["salaryType"],
  employmentType: j.employmentType as EmploymentType,
  programType: j.programType as ProgramType,
  image: anhCua(j, "image"),
  thumbnail: anhCua(j, "thumbnail"),
  description:
    j.description ||
    `Công việc tại ${j.city}, ${j.state}. Chi tiết vị trí, thu nhập và điều kiện được ghi đúng theo thông báo tuyển dụng của đơn hàng.`,
}));

/**
 * ĐƠN MẪU cho bốn nhóm ngành chưa có đơn thật. Giữ để rail phong bì và
 * animation rút job hoạt động đủ 12 nhóm. Thay bằng đơn thật khi có.
 */
const MAU: JobFull[] = [
  {
    id: "mau-pflege-01",
    slug: "dieu-duong-vien-benh-vien-mau",
    industryId: "pflege",
    title: "Điều dưỡng viên bệnh viện",
    city: "Berlin",
    state: "Đức",
    salary: { min: 2800, max: 3500 },
    salaryType: "tháng",
    vacancies: 20,
    employmentType: "Ca kíp",
    programType: "Lao động",
    languageLevel: "B1 – B2",
    experience: "Có bằng điều dưỡng",
    image: ANH_NGANH.pflege!,
    thumbnail: ANH_NGANH.pflege!,
    gallery: [ANH_NGANH.pflege!],
    positions: [{ name: "Điều dưỡng viên", count: 20, salaryFrom: 2800, salaryTo: 3500 }],
    description:
      "Chăm sóc người bệnh tại bệnh viện và viện dưỡng lão, làm việc theo ca cùng đội ngũ điều dưỡng Đức.",
    requirements: ["Bằng điều dưỡng được công nhận", "Tiếng Đức B1 trở lên", "Sức khoẻ tốt, chịu được ca kíp"],
    benefits: ["Hỗ trợ công nhận bằng cấp", "Phụ cấp ca đêm và cuối tuần", "Cơ hội học chuyên sâu"],
    hours: 40,
    featured: false,
    createdAt: "2026-09-01",
    isSample: true,
  },
  {
    id: "mau-mechanik-01",
    slug: "tho-han-mig-mag-mau",
    industryId: "mechanik",
    title: "Thợ hàn MIG/MAG",
    city: "Stuttgart",
    state: "Đức",
    salary: { min: 2500, max: 3200 },
    salaryType: "tháng",
    vacancies: 15,
    employmentType: "Toàn thời gian",
    programType: "Lao động",
    languageLevel: "B1",
    experience: "Tối thiểu 2 năm",
    image: ANH_NGANH.mechanik!,
    thumbnail: "/assets/jobs/mechanik/02-portrait-work-3x4.jpg",
    gallery: [ANH_NGANH.mechanik!, "/assets/jobs/mechanik/04-detail-closeup.jpg"],
    positions: [{ name: "Thợ hàn MIG/MAG", count: 15, salaryFrom: 2500, salaryTo: 3200 }],
    description: "Hàn kết cấu kim loại trong nhà máy cơ khí, đọc bản vẽ kỹ thuật và kiểm tra mối hàn.",
    requirements: ["Chứng chỉ hàn", "Đọc được bản vẽ kỹ thuật", "Tiếng Đức B1"],
    benefits: ["Tăng ca có phụ cấp", "Hỗ trợ chỗ ở", "Đào tạo nâng bậc tại chỗ"],
    hours: 40,
    featured: false,
    createdAt: "2026-09-01",
    isSample: true,
  },
  {
    id: "mau-it-01",
    slug: "chuyen-vien-ho-tro-cntt-mau",
    industryId: "it",
    title: "Chuyên viên hỗ trợ CNTT",
    city: "München",
    state: "Đức",
    salary: { min: 3200, max: 4000 },
    salaryType: "tháng",
    vacancies: 6,
    employmentType: "Toàn thời gian",
    programType: "Lao động",
    languageLevel: "B2",
    experience: "Tối thiểu 1 năm",
    image: ANH_NGANH.it!,
    thumbnail: "/assets/jobs/it/02-portrait-work-3x4.jpg",
    gallery: [ANH_NGANH.it!],
    positions: [{ name: "IT Support", count: 6, salaryFrom: 3200, salaryTo: 4000 }],
    description: "Hỗ trợ người dùng, quản trị hệ thống nội bộ và xử lý sự cố hạ tầng.",
    requirements: ["Bằng cao đẳng hoặc đại học CNTT", "Tiếng Đức B2", "Kinh nghiệm hỗ trợ người dùng"],
    benefits: ["Môi trường văn phòng", "Làm việc linh hoạt", "Lộ trình lên quản trị hệ thống"],
    hours: 40,
    featured: false,
    createdAt: "2026-09-01",
    isSample: true,
  },
  {
    id: "mau-handel-01",
    slug: "nhan-vien-ban-hang-sieu-thi-mau",
    industryId: "handel",
    title: "Nhân viên bán hàng siêu thị",
    city: "Hamburg",
    state: "Đức",
    salary: { min: 2200, max: 2700 },
    salaryType: "tháng",
    vacancies: 12,
    employmentType: "Ca kíp",
    programType: "Lao động",
    languageLevel: "B1",
    experience: "Không yêu cầu",
    image: ANH_NGANH.handel!,
    thumbnail: "/assets/jobs/handel/03-portrait-team-3x4.jpg",
    gallery: [ANH_NGANH.handel!],
    positions: [{ name: "Nhân viên bán hàng", count: 12, salaryFrom: 2200, salaryTo: 2700 }],
    description: "Sắp xếp hàng hoá, tư vấn khách và thu ngân trong hệ thống siêu thị.",
    requirements: ["Tiếng Đức B1", "Nhanh nhẹn, giao tiếp tốt"],
    benefits: ["Ca làm cố định theo tuần", "Phụ cấp cuối tuần", "Cơ hội lên tổ trưởng ca"],
    hours: 38,
    featured: false,
    createdAt: "2026-09-01",
    isSample: true,
  },
];

export const JOBS: JobFull[] = [...THAT, ...MAU];

export function jobsByIndustry(industryId: string): JobFull[] {
  return JOBS.filter((j) => j.industryId === industryId);
}

export function jobBySlug(slug: string): JobFull | undefined {
  return JOBS.find((j) => j.slug === slug);
}

export function featuredJobOf(industryId: string): JobFull | undefined {
  const ds = jobsByIndustry(industryId);
  return ds.find((j) => j.featured) ?? ds[0];
}

/** Các thành phố đang có đơn, dùng cho bộ lọc */
export function allCities(): string[] {
  return [...new Set(JOBS.map((j) => j.city))].sort((a, b) => a.localeCompare(b, "vi"));
}

export function allStates(): string[] {
  return [...new Set(JOBS.map((j) => j.state))].sort((a, b) => a.localeCompare(b, "vi"));
}

export const TONG_SUAT = JOBS.reduce((s, j) => s + j.vacancies, 0);
