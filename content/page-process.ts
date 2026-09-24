import type { Locale } from "@/content/locales";

/**
 * Chữ của trang 06 — screens/06-prozess.png.
 *
 * Khác mẫu, có chủ đích:
 *  - "rechtssicher" (phụ đề) và "Planbare Besetzung" (hàng tin cậy): hứa kết quả
 *    pháp lý / tuyển được người → "verlässlich", "Planbare Schritte".
 *  - "Erprobte Prozesse": ngụ ý đã có thành tích (CẦN ĐIỀN 05) → "Klare Prozesse".
 *  - "Prozess als PDF herunterladen": chưa có file PDF → nút in / lưu PDF của
 *    trình duyệt, cùng vị trí.
 *  - Trạng thái Abgeschlossen / In Bearbeitung / Offen là trạng thái minh hoạ
 *    như mẫu, có nhãn "Beispielansicht".
 */

export type StepStatus = "done" | "active" | "open";

export interface ProcessLane {
  bullets: string[];
  role: string;
}

export interface ProcessStep {
  title: string;
  sub: [string, string];
  company: ProcessLane;
  candidate: ProcessLane;
}

export interface ProcessCopy {
  nav: string[];
  tagline: string;
  cta: string;
  eyebrow: string;
  h1: [string, string];
  sub: [string, string];
  trust: [string, string][];
  side: { title: string[]; sub: string[] };
  pdf: string;
  sample: string;
  lanes: { company: [string, string]; candidate: [string, string] };
  responsible: string;
  status: Record<StepStatus, string>;
  steps: ProcessStep[];
  closing: { title: [string, string]; text: string };
  values: [string, string][];
  closingCta: string;
  closingClaim: string;
}

/** Trạng thái minh hoạ theo mẫu: bước 1 xong, bước 2 đang làm, còn lại mở. */
export const SAMPLE_STATUS: StepStatus[] = ["done", "active", "open", "open", "open", "open"];

export const PROCESS: Record<Locale, ProcessCopy> = {
  de: {
    nav: ["Startseite", "Über uns", "Leistungen", "Prozess", "Branchen", "Wissen", "Kontakt"],
    tagline: "Fachkräfte. Zukunft. Gemeinsam.",
    cta: "Beratung anfragen",
    eyebrow: "Unser Prozess",
    h1: ["Von der Personalplanung", "bis zur Integration."],
    sub: [
      "Ein strukturierter, transparenter Prozess für internationale Fachkräfte",
      "und deutsche Unternehmen – effizient, verlässlich und partnerschaftlich.",
    ],
    trust: [
      ["Ein Ansprechpartner", "über den gesamten Prozess"],
      ["Transparente Abläufe", "und klare Verantwortlichkeiten"],
      ["Planbare Schritte", "für nachhaltige Zusammenarbeit"],
    ],
    side: { title: ["Menschen", "verbinden.", "Potenziale", "entfalten."], sub: ["Für eine", "starke", "Zukunft."] },
    pdf: "Prozess als PDF speichern",
    sample: "Beispielansicht",
    lanes: { company: ["Unternehmen", "Ihr Beitrag"], candidate: ["Bewerber", "Ihr Beitrag"] },
    responsible: "Verantwortlich",
    status: { done: "Abgeschlossen", active: "In Bearbeitung", open: "Offen" },
    steps: [
      {
        title: "Bedarf",
        sub: ["Anforderungsanalyse", "und Positionsprofil"],
        company: { bullets: ["Bedarf melden", "Anforderungsprofil freigeben", "Interne Ansprechpartner benennen"], role: "HR / Fachabteilung" },
        candidate: { bullets: ["Unterlagen einreichen", "Profil und Motivation teilen"], role: "Bewerber" },
      },
      {
        title: "Vorauswahl",
        sub: ["Kandidatenidentifikation", "und Interviews"],
        company: { bullets: ["Profile sichten", "Interviews führen", "Auswahlentscheidung"], role: "HR / Fachabteilung" },
        candidate: { bullets: ["Interviews absolvieren", "Rückfragen beantworten", "Dokumente bereitstellen"], role: "Bewerber" },
      },
      {
        title: "Vertrag",
        sub: ["Arbeitsvertrag und", "Vorbereitung"],
        company: { bullets: ["Arbeitsvertrag freigeben", "Rahmenbedingungen klären", "Starttermin festlegen"], role: "HR / Geschäftsführung" },
        candidate: { bullets: ["Vertrag prüfen und unterzeichnen", "Erforderliche Dokumente einreichen"], role: "Bewerber" },
      },
      {
        title: "Anerkennung & Visum",
        sub: ["Qualifikationsprüfung", "und Visumsprozess"],
        company: { bullets: ["Unterlagen unterstützen", "Behördenkommunikation begleiten"], role: "HR / Administration" },
        candidate: { bullets: ["Abschlüsse anerkennen lassen", "Visumsunterlagen einreichen", "Termine bei Behörden wahrnehmen"], role: "Bewerber" },
      },
      {
        title: "Einreise",
        sub: ["Reiseorganisation", "und Ankunft"],
        company: { bullets: ["Ankunft vorbereiten", "Unterkunft organisieren", "Abholung koordinieren"], role: "HR / Standortteam" },
        candidate: { bullets: ["Reise antreten", "Einreiseformalitäten erledigen", "Ankunft bestätigen"], role: "Bewerber" },
      },
      {
        title: "Integration",
        sub: ["Onboarding, Betreuung", "und langfristige Bindung"],
        company: { bullets: ["Onboarding umsetzen", "Mentor benennen", "Langfristige Integration sicherstellen"], role: "HR / Fachabteilung" },
        candidate: { bullets: ["Am Arbeitsplatz starten", "Sprache und Kultur weiterentwickeln", "Integrationsangebote nutzen"], role: "Bewerber" },
      },
    ],
    closing: {
      title: ["Gemeinsam", "Fachkräfte für morgen"],
      text: "NIBELC TalentBridge Deutschland verbindet internationale Talente mit deutschen Unternehmen – strukturiert, menschlich, nachhaltig.",
    },
    values: [
      ["Persönlich", "Individuelle Betreuung"],
      ["Professionell", "Klare Prozesse"],
      ["Verlässlich", "Transparente Kommunikation"],
      ["Nachhaltig", "Langfristige Perspektiven"],
    ],
    closingCta: "Jetzt Beratung anfragen",
    closingClaim: "Fachkräfte. Zukunft. Gemeinsam.",
  },
  en: {
    nav: ["Home", "About us", "Services", "Process", "Industries", "Knowledge", "Contact"],
    tagline: "Skilled workers. Future. Together.",
    cta: "Request advice",
    eyebrow: "Our process",
    h1: ["From workforce planning", "to integration."],
    sub: [
      "A structured, transparent process for international skilled workers",
      "and German companies – efficient, reliable and built on partnership.",
    ],
    trust: [
      ["One contact person", "throughout the process"],
      ["Transparent workflows", "and clear responsibilities"],
      ["Predictable steps", "for lasting cooperation"],
    ],
    side: { title: ["Connecting", "people.", "Unlocking", "potential."], sub: ["For a", "strong", "future."] },
    pdf: "Save process as PDF",
    sample: "Sample view",
    lanes: { company: ["Employer", "Your part"], candidate: ["Candidate", "Your part"] },
    responsible: "Responsible",
    status: { done: "Completed", active: "In progress", open: "Open" },
    steps: [
      {
        title: "Needs",
        sub: ["Requirements analysis", "and job profile"],
        company: { bullets: ["Report your needs", "Approve the job profile", "Name internal contacts"], role: "HR / Department" },
        candidate: { bullets: ["Submit documents", "Share profile and motivation"], role: "Candidate" },
      },
      {
        title: "Pre-selection",
        sub: ["Candidate search", "and interviews"],
        company: { bullets: ["Review profiles", "Hold interviews", "Make the selection"], role: "HR / Department" },
        candidate: { bullets: ["Attend interviews", "Answer questions", "Provide documents"], role: "Candidate" },
      },
      {
        title: "Contract",
        sub: ["Employment contract", "and preparation"],
        company: { bullets: ["Approve the contract", "Clarify conditions", "Set the start date"], role: "HR / Management" },
        candidate: { bullets: ["Review and sign the contract", "Submit required documents"], role: "Candidate" },
      },
      {
        title: "Recognition & visa",
        sub: ["Qualification check", "and visa procedure"],
        company: { bullets: ["Support the paperwork", "Accompany contact with authorities"], role: "HR / Administration" },
        candidate: { bullets: ["Apply for recognition", "Submit visa documents", "Attend appointments"], role: "Candidate" },
      },
      {
        title: "Arrival",
        sub: ["Travel organisation", "and arrival"],
        company: { bullets: ["Prepare the arrival", "Arrange accommodation", "Coordinate pick-up"], role: "HR / Site team" },
        candidate: { bullets: ["Travel to Germany", "Complete entry formalities", "Confirm arrival"], role: "Candidate" },
      },
      {
        title: "Integration",
        sub: ["Onboarding, support", "and long-term retention"],
        company: { bullets: ["Carry out onboarding", "Appoint a mentor", "Secure long-term integration"], role: "HR / Department" },
        candidate: { bullets: ["Start at the workplace", "Keep building language and culture", "Use integration offers"], role: "Candidate" },
      },
    ],
    closing: {
      title: ["Together", "skilled workers for tomorrow"],
      text: "NIBELC TalentBridge Deutschland connects international talent with German companies – structured, human, sustainable.",
    },
    values: [
      ["Personal", "Individual support"],
      ["Professional", "Clear processes"],
      ["Reliable", "Transparent communication"],
      ["Sustainable", "Long-term prospects"],
    ],
    closingCta: "Request advice now",
    closingClaim: "Skilled workers. Future. Together.",
  },
  vi: {
    nav: ["Trang chủ", "Về chúng tôi", "Dịch vụ", "Lộ trình", "Ngành nghề", "Kiến thức", "Liên hệ"],
    tagline: "Nhân lực. Tương lai. Cùng nhau.",
    cta: "Yêu cầu tư vấn",
    eyebrow: "Lộ trình của chúng tôi",
    h1: ["Từ kế hoạch nhân sự", "đến khi hội nhập."],
    sub: [
      "Một quy trình có cấu trúc, minh bạch cho người lao động quốc tế",
      "và doanh nghiệp Đức – hiệu quả, tin cậy và đồng hành.",
    ],
    trust: [
      ["Một người phụ trách", "suốt cả quy trình"],
      ["Quy trình minh bạch", "và trách nhiệm rõ ràng"],
      ["Các bước rõ ràng", "cho hợp tác lâu dài"],
    ],
    side: { title: ["Kết nối", "con người.", "Khơi dậy", "tiềm năng."], sub: ["Cho một", "tương lai", "vững mạnh."] },
    pdf: "Lưu lộ trình thành PDF",
    sample: "Minh hoạ",
    lanes: { company: ["Doanh nghiệp", "Phần việc của bạn"], candidate: ["Người lao động", "Phần việc của bạn"] },
    responsible: "Phụ trách",
    status: { done: "Hoàn tất", active: "Đang làm", open: "Chưa làm" },
    steps: [
      {
        title: "Nhu cầu",
        sub: ["Phân tích yêu cầu", "và mô tả vị trí"],
        company: { bullets: ["Báo nhu cầu tuyển", "Duyệt mô tả vị trí", "Cử người phụ trách nội bộ"], role: "Nhân sự / Bộ phận" },
        candidate: { bullets: ["Nộp hồ sơ", "Chia sẻ hồ sơ và động lực"], role: "Người lao động" },
      },
      {
        title: "Sơ tuyển",
        sub: ["Tìm ứng viên", "và phỏng vấn"],
        company: { bullets: ["Xem hồ sơ", "Phỏng vấn", "Quyết định chọn"], role: "Nhân sự / Bộ phận" },
        candidate: { bullets: ["Tham gia phỏng vấn", "Trả lời câu hỏi bổ sung", "Cung cấp giấy tờ"], role: "Người lao động" },
      },
      {
        title: "Hợp đồng",
        sub: ["Hợp đồng lao động", "và chuẩn bị"],
        company: { bullets: ["Duyệt hợp đồng", "Thống nhất điều kiện", "Chốt ngày bắt đầu"], role: "Nhân sự / Ban giám đốc" },
        candidate: { bullets: ["Đọc kỹ và ký hợp đồng", "Nộp giấy tờ cần thiết"], role: "Người lao động" },
      },
      {
        title: "Công nhận & visa",
        sub: ["Thẩm định bằng cấp", "và thủ tục visa"],
        company: { bullets: ["Hỗ trợ giấy tờ", "Đồng hành làm việc với cơ quan"], role: "Nhân sự / Hành chính" },
        candidate: { bullets: ["Nộp hồ sơ công nhận bằng", "Nộp hồ sơ visa", "Đến các buổi hẹn"], role: "Người lao động" },
      },
      {
        title: "Nhập cảnh",
        sub: ["Tổ chức chuyến đi", "và đón tiếp"],
        company: { bullets: ["Chuẩn bị đón", "Sắp xếp chỗ ở", "Bố trí đưa đón"], role: "Nhân sự / Chi nhánh" },
        candidate: { bullets: ["Lên đường sang Đức", "Làm thủ tục nhập cảnh", "Báo đã đến nơi"], role: "Người lao động" },
      },
      {
        title: "Hội nhập",
        sub: ["Nhận việc, hỗ trợ", "và gắn bó lâu dài"],
        company: { bullets: ["Tổ chức nhận việc", "Cử người kèm cặp", "Hỗ trợ gắn bó lâu dài"], role: "Nhân sự / Bộ phận" },
        candidate: { bullets: ["Bắt đầu công việc", "Tiếp tục học tiếng và văn hoá", "Tham gia chương trình hội nhập"], role: "Người lao động" },
      },
    ],
    closing: {
      title: ["Cùng nhau", "vì nhân lực ngày mai"],
      text: "NIBELC TalentBridge Deutschland kết nối nhân tài quốc tế với doanh nghiệp Đức – có lộ trình, có tình người, bền vững.",
    },
    values: [
      ["Tận tâm", "Hỗ trợ từng người"],
      ["Chuyên nghiệp", "Quy trình rõ ràng"],
      ["Tin cậy", "Trao đổi minh bạch"],
      ["Bền vững", "Hướng tới lâu dài"],
    ],
    closingCta: "Yêu cầu tư vấn ngay",
    closingClaim: "Nhân lực. Tương lai. Cùng nhau.",
  },
};
