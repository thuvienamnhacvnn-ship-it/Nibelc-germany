import type { Locale } from "@/content/locales";

/**
 * Chữ của trang 02 — screens/02-fuer-unternehmen.png.
 *
 * Khác mẫu, có chủ đích:
 *  - Lưới ngành đọc từ registry tám ngành, không chép tám nhãn minh hoạ của
 *    mẫu (Bau, Pflege, IT…) — NIBELC không cung ứng những ngành đó.
 *  - Nút "So funktioniert TalentBridge (2 Min.)": chưa có video, nên bỏ
 *    "(2 Min.)" và dẫn sang trang Prozess.
 *  - Lời chứng thực của khách hàng: chưa xác minh (CẦN ĐIỀN 05) — giữ khung,
 *    khoá nội dung.
 *  - Bảng điều khiển: là ảnh minh hoạ sản phẩm, số liệu là số mẫu, có nhãn
 *    "Beispielansicht" để không bị đọc thành số thật.
 */

interface Step {
  title: string;
  text: string;
  icon: string;
}

export interface EmployersCopy {
  nav: string[];
  contact: string;
  eyebrow: string;
  h1a: string;
  h1b: string;
  sub: string;
  cta: string;
  howTo: [string, string];
  quote: string;
  quoteBy: string;
  industriesLabel: string;
  allIndustries: string;
  stepsLabel: string;
  steps: Step[];
  complianceTitle: string;
  compliance: string[];
  servicesLabel: string;
  services: Step[];
  dashLabel: string;
  dash: {
    welcome: string;
    project: string;
    menu: string[];
    stats: [string, string][];
    progress: string;
    sample: string;
  };
  adviceTitle: string;
  adviceText: string;
  adviceCta: string;
}

const STEP_ICONS = ["doc", "users", "chat", "doc", "plane", "chart"];
const SERVICE_ICONS = ["users", "doc", "home", "handshake"];

export const EMPLOYERS: Record<Locale, EmployersCopy> = {
  de: {
    nav: ["Für Unternehmen", "Für Fachkräfte", "Unsere Leistungen", "Branchen", "Über uns", "Wissen"],
    contact: "Kontakt",
    eyebrow: "NIBELC TalentBridge Deutschland",
    h1a: "Fachkräfte gewinnen.",
    h1b: "Prozesse sicher steuern",
    sub: "Wir verbinden internationale Fachkräfte – insbesondere aus Vietnam – mit deutschen Unternehmen. Rechtssicher. Effizient. Nachhaltig.",
    cta: "Personalbedarf melden",
    howTo: ["So funktioniert", "TalentBridge"],
    quote: "Wir schaffen echte Perspektiven – für Menschen und Unternehmen.",
    quoteBy: "NIBELC TalentBridge Deutschland",
    industriesLabel: "Unsere Branchen",
    allIndustries: "Alle Branchen ansehen",
    stepsLabel: "In 6 Schritten zur passenden Fachkraft",
    steps: [
      ["Bedarf klären", "Anforderungsprofil und Rahmenbedingungen"],
      ["Kandidaten finden", "Gezielte Vorauswahl in Vietnam"],
      ["Prüfen & Kennenlernen", "Interviews und fachliche Tests"],
      ["Visum & Anerkennung", "Wir begleiten den gesamten Prozess"],
      ["Anreise & Integration", "Onboarding und Begleitung vor Ort"],
      ["Langfristige Betreuung", "Für eine nachhaltige Zusammenarbeit"],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: STEP_ICONS[i]! })),
    complianceTitle: "Rechtssicher. Transparent. Vertrauenswürdig.",
    compliance: [
      "Anerkennung von Abschlüssen (BQFG)",
      "Visum- und Aufenthaltsverfahren",
      "Einhaltung deutscher Arbeits- und Sozialstandards",
      "Faire und ethische Rekrutierung",
      "Langfristige Integration und Support",
    ],
    servicesLabel: "Unsere Services für Ihr Unternehmen",
    services: [
      ["Rekrutierung & Vorauswahl", "Passgenaue Kandidaten statt Streuverlust."],
      ["Behördenmanagement", "Wir übernehmen komplexe Prozesse."],
      ["Ankunft & Integration", "Unterstützung bei Wohnung, Behörden und Onboarding."],
      ["Langfristige Betreuung", "Damit aus Fachkräften echte Teammitglieder werden."],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: SERVICE_ICONS[i]! })),
    dashLabel: "Ihr Personalprojekt – jederzeit im Blick",
    dash: {
      welcome: "Willkommen, Muster GmbH",
      project: "Aktuelles Projekt",
      menu: ["Dashboard", "Kandidaten", "Visa & Dokumente", "Onboarding", "Aufgaben", "Berichte"],
      stats: [["12", "Kandidaten in Auswahl"], ["8", "Im Visumprozess"], ["3", "In Anreise"], ["5", "Bereits im Einsatz"]],
      progress: "Projektfortschritt",
      sample: "Beispielansicht",
    },
    adviceTitle: "Persönliche Beratung für Ihr Projekt",
    adviceText: "Gemeinsam besprechen wir Ihren Personalbedarf und entwickeln die passende Lösung.",
    adviceCta: "Jetzt Beratung anfragen",
  },
  en: {
    nav: ["For Employers", "For Candidates", "Our Services", "Industries", "About us", "Knowledge"],
    contact: "Contact",
    eyebrow: "NIBELC TalentBridge Deutschland",
    h1a: "Win skilled workers.",
    h1b: "Run processes safely",
    sub: "We connect international skilled workers – especially from Vietnam – with German employers. Legally sound. Efficient. Sustainable.",
    cta: "Report staffing needs",
    howTo: ["How TalentBridge", "works"],
    quote: "We create real prospects – for people and for companies.",
    quoteBy: "NIBELC TalentBridge Deutschland",
    industriesLabel: "Our industries",
    allIndustries: "View all industries",
    stepsLabel: "Six steps to the right worker",
    steps: [
      ["Define the need", "Role profile and conditions"],
      ["Find candidates", "Targeted pre-selection in Vietnam"],
      ["Assess & meet", "Interviews and skills tests"],
      ["Visa & recognition", "We support the whole procedure"],
      ["Arrival & integration", "Onboarding and on-site support"],
      ["Long-term support", "For lasting cooperation"],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: STEP_ICONS[i]! })),
    complianceTitle: "Lawful. Transparent. Trustworthy.",
    compliance: [
      "Recognition of qualifications (BQFG)",
      "Visa and residence procedures",
      "German labour and social standards",
      "Fair and ethical recruitment",
      "Long-term integration and support",
    ],
    servicesLabel: "Our services for your company",
    services: [
      ["Recruitment & pre-selection", "Well-matched candidates, no wasted effort."],
      ["Authority management", "We handle the complex procedures."],
      ["Arrival & integration", "Help with housing, authorities and onboarding."],
      ["Long-term support", "So new hires become real team members."],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: SERVICE_ICONS[i]! })),
    dashLabel: "Your staffing project – always in view",
    dash: {
      welcome: "Welcome, Sample Ltd",
      project: "Current project",
      menu: ["Dashboard", "Candidates", "Visa & documents", "Onboarding", "Tasks", "Reports"],
      stats: [["12", "Candidates in selection"], ["8", "In visa process"], ["3", "Travelling"], ["5", "Already working"]],
      progress: "Project progress",
      sample: "Sample view",
    },
    adviceTitle: "Personal advice for your project",
    adviceText: "Together we discuss your staffing needs and develop the right solution.",
    adviceCta: "Request a consultation",
  },
  vi: {
    nav: ["Doanh nghiệp", "Người lao động", "Dịch vụ", "Ngành nghề", "Về chúng tôi", "Kiến thức"],
    contact: "Liên hệ",
    eyebrow: "NIBELC TalentBridge Deutschland",
    h1a: "Tuyển đúng người.",
    h1b: "Quy trình chắc chắn",
    sub: "Chúng tôi kết nối lao động quốc tế – đặc biệt từ Việt Nam – với doanh nghiệp Đức. Đúng luật. Hiệu quả. Bền vững.",
    cta: "Gửi nhu cầu nhân sự",
    howTo: ["TalentBridge", "hoạt động thế nào"],
    quote: "Chúng tôi tạo triển vọng thật – cho con người và doanh nghiệp.",
    quoteBy: "NIBELC TalentBridge Deutschland",
    industriesLabel: "Ngành nghề",
    allIndustries: "Xem tất cả ngành",
    stepsLabel: "Sáu bước đến người phù hợp",
    steps: [
      ["Làm rõ nhu cầu", "Hồ sơ vị trí và điều kiện"],
      ["Tìm ứng viên", "Sơ tuyển có định hướng tại Việt Nam"],
      ["Kiểm tra & gặp gỡ", "Phỏng vấn và kiểm tra tay nghề"],
      ["Visa & công nhận", "Đồng hành suốt thủ tục"],
      ["Sang Đức & hội nhập", "Onboarding và hỗ trợ tại chỗ"],
      ["Đồng hành lâu dài", "Cho hợp tác bền vững"],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: STEP_ICONS[i]! })),
    complianceTitle: "Đúng luật. Minh bạch. Đáng tin cậy.",
    compliance: [
      "Công nhận bằng cấp (BQFG)",
      "Thủ tục visa và cư trú",
      "Tuân thủ chuẩn lao động và xã hội Đức",
      "Tuyển dụng công bằng, có đạo đức",
      "Hỗ trợ hội nhập lâu dài",
    ],
    servicesLabel: "Dịch vụ cho doanh nghiệp",
    services: [
      ["Tuyển & sơ tuyển", "Ứng viên phù hợp, không tuyển tràn lan."],
      ["Làm việc với cơ quan", "Chúng tôi lo thủ tục phức tạp."],
      ["Đón & hội nhập", "Hỗ trợ nhà ở, giấy tờ và onboarding."],
      ["Đồng hành lâu dài", "Để người mới thành thành viên thật."],
    ].map(([title, text], i) => ({ title: title!, text: text!, icon: SERVICE_ICONS[i]! })),
    dashLabel: "Dự án nhân sự – luôn trong tầm mắt",
    dash: {
      welcome: "Xin chào, Công ty Mẫu",
      project: "Dự án hiện tại",
      menu: ["Tổng quan", "Ứng viên", "Visa & giấy tờ", "Onboarding", "Việc cần làm", "Báo cáo"],
      stats: [["12", "Ứng viên đang chọn"], ["8", "Đang làm visa"], ["3", "Đang sang Đức"], ["5", "Đã đi làm"]],
      progress: "Tiến độ dự án",
      sample: "Giao diện mẫu",
    },
    adviceTitle: "Tư vấn riêng cho dự án của bạn",
    adviceText: "Cùng trao đổi nhu cầu nhân sự và xây dựng giải pháp phù hợp.",
    adviceCta: "Đặt lịch tư vấn",
  },
};
