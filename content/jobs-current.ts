import type { Locale } from "@/content/locales";

/**
 * ĐƠN HÀNG ĐANG CHẠY — các vị trí NIBELC đang tuyển.
 *
 * Nguồn: ba tin tuyển dụng chính thức của công ty (Drive → `kit/nguon-cong-ty/`,
 * bản trong `public/unternehmen/`). Mọi con số dưới đây đọc từ chính các tin đó,
 * không suy diễn thêm:
 *   - số suất, nơi làm việc, mức lương, giờ làm, diện visa, quyền lợi.
 *
 * KHÔNG đưa lên web, dù tin gốc có in:
 *   - giới hạn tuổi và giới tính ("Nam/Nữ tuyển từ 20–45"). Tin tuyển dụng ở
 *     Đức bị AGG cấm nêu tuổi hay giới tính, nên phần đó bị bỏ khỏi mọi bản
 *     ngôn ngữ; ảnh tin gốc (có in dòng đó) chỉ hiện ở bản tiếng Việt, đúng
 *     nơi nó được phát hành.
 *
 * Mức lương ở đây là của RIÊNG từng đơn hàng này, không phải bảng lương chung
 * (bảng lương chung vẫn khoá theo CẦN ĐIỀN 03).
 */

export interface JobOrder {
  id: string;
  /** Ngành trong registry, để nối với trang ngành */
  industry: string;
  /** Ảnh tin gốc — chỉ hiện ở bản tiếng Việt */
  poster: { src: string; w: number; h: number };
  slots: number;
  salary: { from: number; to: number; currency: "EUR"; per: "month" };
  hoursPerWeek: number;
  locations: string[];
  visa: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  tasks: Record<Locale, string[]>;
  requirements: Record<Locale, string[]>;
  benefits: Record<Locale, string[]>;
}

export const JOB_ORDERS: JobOrder[] = [
  {
    id: "gewaechshaus-mitarbeit",
    industry: "gartenbau-gaertner",
    poster: { src: "/unternehmen/02-stellenanzeige-gewaechshaus.jpg", w: 708, h: 1138 },
    slots: 40,
    salary: { from: 2000, to: 2400, currency: "EUR", per: "month" },
    hoursPerWeek: 40,
    locations: ["München", "Seevetal", "Münster"],
    visa: "16a · 18a · 19c (i. V. m. 15d)",
    title: {
      de: "Mitarbeit im Gemüseanbau (Gewächshaus)",
      en: "Greenhouse vegetable production worker",
      vi: "Công nhân trồng rau, củ, quả trong nhà kính",
    },
    summary: {
      de: "Anbau, Pflege und Ernte von Gemüse in modernen Gewächshausbetrieben.",
      en: "Growing, tending and harvesting vegetables in modern greenhouse operations.",
      vi: "Trồng, chăm sóc và thu hoạch rau củ quả trong nhà kính hiện đại.",
    },
    tasks: {
      de: [
        "Pflanzen pflegen, bewässern und den Kulturverlauf beobachten",
        "Gemüse nach Vorgabe ernten",
        "Sortieren und Verpacken der Ernte",
        "Arbeiten im modernen, gesicherten Gewächshaus",
      ],
      en: [
        "Tending and watering plants, monitoring growth",
        "Harvesting vegetables to specification",
        "Sorting and packing the harvest",
        "Working in a modern, safe greenhouse",
      ],
      vi: [
        "Chăm sóc, tưới nước và theo dõi sự phát triển của cây trồng",
        "Thu hoạch rau, củ, quả theo quy trình",
        "Phân loại, đóng gói nông sản",
        "Làm việc trong môi trường nhà kính hiện đại, an toàn",
      ],
    },
    requirements: {
      de: ["Gesundheitliche Eignung für die Tätigkeit", "Deutschkenntnisse A1–A2 von Vorteil"],
      en: ["Physically fit for the work", "German at A1–A2 is an advantage"],
      vi: ["Sức khoẻ tốt, phù hợp với công việc", "Có tiếng Đức A1–A2 là lợi thế"],
    },
    benefits: {
      de: [
        "Sozial-, Renten- und Krankenversicherung wie deutsche Beschäftigte",
        "Unterstützung bei Unterkunft bzw. Wohnkostenzuschuss",
      ],
      en: [
        "Social, pension and health insurance like German employees",
        "Help with accommodation or a housing allowance",
      ],
      vi: [
        "Được hưởng bảo hiểm xã hội, hưu trí, y tế như lao động Đức",
        "Được hỗ trợ chỗ ở hoặc phụ cấp nhà ở",
      ],
    },
  },
  {
    id: "gewaechshaus-leitung",
    industry: "gartenbau-gaertner",
    poster: { src: "/unternehmen/03-stellenanzeige-gewaechshaus-leitung.jpg", w: 708, h: 1138 },
    slots: 5,
    salary: { from: 2100, to: 2500, currency: "EUR", per: "month" },
    hoursPerWeek: 40,
    locations: ["München", "Seevetal", "Münster"],
    visa: "16a · 18a · 19c (i. V. m. 15d)",
    title: {
      de: "Gewächshaus-Verantwortliche/r",
      en: "Greenhouse supervisor",
      vi: "Quản lý nhà kính",
    },
    summary: {
      de: "Abläufe im Gewächshaus steuern, Team anleiten, Qualität der Kulturen sichern.",
      en: "Running greenhouse operations, guiding the team, securing crop quality.",
      vi: "Điều hành công việc trong nhà kính, hướng dẫn tổ, bảo đảm chất lượng cây trồng.",
    },
    tasks: {
      de: [
        "Tagesabläufe und Arbeitseinsatz planen",
        "Team anleiten und einarbeiten",
        "Kulturen und Qualität kontrollieren",
        "Technik und Klimaführung im Gewächshaus überwachen",
      ],
      en: [
        "Planning daily operations and staffing",
        "Guiding and training the team",
        "Checking crops and quality",
        "Monitoring greenhouse technology and climate control",
      ],
      vi: [
        "Lên kế hoạch công việc và phân công hằng ngày",
        "Hướng dẫn và kèm cặp tổ làm việc",
        "Kiểm soát cây trồng và chất lượng",
        "Theo dõi thiết bị và điều khiển khí hậu nhà kính",
      ],
    },
    requirements: {
      de: ["Erfahrung im Gartenbau oder in der Anleitung von Teams", "Deutschkenntnisse A1–A2 von Vorteil"],
      en: ["Experience in horticulture or team leadership", "German at A1–A2 is an advantage"],
      vi: ["Có kinh nghiệm làm vườn hoặc quản lý tổ, nhóm", "Có tiếng Đức A1–A2 là lợi thế"],
    },
    benefits: {
      de: [
        "Sozial-, Renten- und Krankenversicherung wie deutsche Beschäftigte",
        "Unterstützung bei Unterkunft bzw. Wohnkostenzuschuss",
      ],
      en: [
        "Social, pension and health insurance like German employees",
        "Help with accommodation or a housing allowance",
      ],
      vi: [
        "Được hưởng bảo hiểm xã hội, hưu trí, y tế như lao động Đức",
        "Được hỗ trợ chỗ ở hoặc phụ cấp nhà ở",
      ],
    },
  },
  {
    id: "gewaechshaus-instandhaltung",
    industry: "elektrotechnik-elektroniker",
    poster: { src: "/unternehmen/04-stellenanzeige-instandhaltung.jpg", w: 708, h: 1138 },
    slots: 5,
    salary: { from: 2000, to: 2400, currency: "EUR", per: "month" },
    hoursPerWeek: 40,
    locations: ["München", "Seevetal", "Münster"],
    visa: "16a · 18a · 19c (i. V. m. 15d)",
    title: {
      de: "Instandhaltung im Gewächshausbetrieb",
      en: "Maintenance technician, greenhouse farm",
      vi: "Thợ bảo trì trang trại nhà kính",
    },
    summary: {
      de: "Technik im Gewächshaus warten, Störungen beheben, Anlagen betriebsbereit halten.",
      en: "Maintaining greenhouse technology, fixing faults, keeping systems running.",
      vi: "Bảo trì thiết bị nhà kính, xử lý sự cố, giữ hệ thống vận hành ổn định.",
    },
    tasks: {
      de: [
        "Wartung von Bewässerungs-, Klima- und Fördertechnik",
        "Störungen suchen und beheben",
        "Kleinreparaturen an Gebäude und Anlagen",
        "Wartungsarbeiten dokumentieren",
      ],
      en: [
        "Servicing irrigation, climate and conveyor systems",
        "Finding and fixing faults",
        "Minor repairs to buildings and equipment",
        "Documenting maintenance work",
      ],
      vi: [
        "Bảo trì hệ thống tưới, khí hậu và băng chuyền",
        "Tìm và khắc phục sự cố",
        "Sửa chữa nhỏ nhà xưởng và thiết bị",
        "Ghi chép công việc bảo trì",
      ],
    },
    requirements: {
      de: ["Handwerkliche oder technische Vorerfahrung", "Deutschkenntnisse A1–A2 von Vorteil"],
      en: ["Practical or technical experience", "German at A1–A2 is an advantage"],
      vi: ["Có tay nghề kỹ thuật hoặc cơ khí", "Có tiếng Đức A1–A2 là lợi thế"],
    },
    benefits: {
      de: [
        "Sozial-, Renten- und Krankenversicherung wie deutsche Beschäftigte",
        "Unterstützung bei Unterkunft bzw. Wohnkostenzuschuss",
      ],
      en: [
        "Social, pension and health insurance like German employees",
        "Help with accommodation or a housing allowance",
      ],
      vi: [
        "Được hưởng bảo hiểm xã hội, hưu trí, y tế như lao động Đức",
        "Được hỗ trợ chỗ ở hoặc phụ cấp nhà ở",
      ],
    },
  },
];

/** Một đơn hàng theo mã; dùng cho trang chi tiết. */
export function jobById(id: string): JobOrder | undefined {
  return JOB_ORDERS.find((j) => j.id === id);
}

/** Các đơn hàng khác, để gợi ý ở cuối trang chi tiết. */
export function otherJobs(id: string): JobOrder[] {
  return JOB_ORDERS.filter((j) => j.id !== id);
}

export function totalSlots(): number {
  return JOB_ORDERS.reduce((n, j) => n + j.slots, 0);
}

/** Chữ của dải chạy và trang đơn hàng */
export const JOBS_COPY: Record<
  Locale,
  {
    tickerLabel: string;
    tickerCta: string;
    slots: string;
    eyebrow: string;
    title: string;
    lead: string;
    note: string;
    salaryLabel: string;
    hoursLabel: string;
    locationLabel: string;
    visaLabel: string;
    slotsLabel: string;
    tasksLabel: string;
    reqLabel: string;
    benefitsLabel: string;
    apply: string;
    industryLink: string;
    posterNote: string;
    perMonth: string;
  }
> = {
  de: {
    tickerLabel: "Aktuell im Einsatz",
    tickerCta: "Alle offenen Stellen",
    slots: "Plätze",
    eyebrow: "Aktuelle Stellenangebote",
    title: "Diese Stellen besetzen wir gerade",
    lead: "Laufende Aufträge unserer Partnerbetriebe in Deutschland — mit Anzahl der Plätze, Einsatzort und Konditionen aus der jeweiligen Ausschreibung.",
    note: "Angaben stammen aus der jeweiligen Ausschreibung und gelten für diesen Auftrag, nicht als allgemeine Gehaltstabelle. Die Einstellungsentscheidung trifft der Betrieb; über Visum und Anerkennung entscheiden die zuständigen Stellen.",
    salaryLabel: "Vergütung",
    hoursLabel: "Arbeitszeit",
    locationLabel: "Einsatzorte",
    visaLabel: "Aufenthaltstitel",
    slotsLabel: "Offene Plätze",
    tasksLabel: "Aufgaben",
    reqLabel: "Voraussetzungen",
    benefitsLabel: "Leistungen",
    apply: "Für diese Stelle bewerben",
    industryLink: "Zur Branche",
    posterNote: "",
    perMonth: "pro Monat",
  },
  en: {
    tickerLabel: "Currently hiring",
    tickerCta: "All open positions",
    slots: "places",
    eyebrow: "Current openings",
    title: "Positions we are filling right now",
    lead: "Live assignments at our partner companies in Germany — with number of places, location and terms from each posting.",
    note: "Details come from each posting and apply to that assignment only, not as a general salary table. The employer makes the hiring decision; visa and recognition are decided by the competent authorities.",
    salaryLabel: "Pay",
    hoursLabel: "Working time",
    locationLabel: "Locations",
    visaLabel: "Residence title",
    slotsLabel: "Open places",
    tasksLabel: "Tasks",
    reqLabel: "Requirements",
    benefitsLabel: "Benefits",
    apply: "Apply for this position",
    industryLink: "See the industry",
    posterNote: "",
    perMonth: "per month",
  },
  vi: {
    tickerLabel: "Đơn hàng đang chạy",
    tickerCta: "Xem tất cả đơn hàng",
    slots: "suất",
    eyebrow: "Đơn hàng đang tuyển",
    title: "Các đơn hàng đang chạy",
    lead: "Những đơn hàng NIBELC đang tuyển tại Đức — kèm số suất, nơi làm việc và điều kiện theo từng tin tuyển dụng.",
    note: "Thông tin lấy từ tin tuyển dụng của từng đơn và chỉ áp dụng cho đơn đó, không phải bảng lương chung. Doanh nghiệp là bên quyết định nhận người; visa và công nhận bằng do cơ quan có thẩm quyền quyết định.",
    salaryLabel: "Mức lương",
    hoursLabel: "Thời gian làm việc",
    locationLabel: "Nơi làm việc",
    visaLabel: "Diện visa",
    slotsLabel: "Số suất",
    tasksLabel: "Công việc thực tế",
    reqLabel: "Yêu cầu",
    benefitsLabel: "Quyền lợi",
    apply: "Ứng tuyển đơn này",
    industryLink: "Xem ngành nghề",
    posterNote: "Tin tuyển dụng gốc của đơn hàng này:",
    perMonth: "mỗi tháng",
  },
};
