import type { Locale } from "@/content/locales";

/**
 * Chữ của trang 03 — screens/03-fuer-bewerber-vietnam.png.
 * Bản tiếng Việt giữ đúng chữ trong mẫu, trừ:
 *  - "không chi phí ẩn": chưa có chính sách phí được duyệt (CẦN ĐIỀN 07) nên
 *    chưa được khẳng định → "thông tin rõ ràng".
 *  - "Xem video": chưa có video → "Xem lộ trình", dẫn sang trang lộ trình.
 *  - 500+ / 50+ / 95%: số chưa xác minh (CẦN ĐIỀN 05) → khoá.
 *    Ô "8 lĩnh vực" đọc từ registry nên giữ.
 *  - Nav và dòng chữ nhỏ trên tiêu đề dịch theo ngôn ngữ trang (mẫu để tiếng
 *    Đức ngay cả trên trang tiếng Việt).
 */

export interface CandidatesCopy {
  nav: string[];
  login: string;
  eyebrow: string;
  h1a: string;
  h1accent: string;
  h1rest: string;
  sub: string;
  cta: string;
  secondary: [string, string];
  trust: [string, string][];
  topics: { title: string; text: string; icon: string }[];
  stats: { icon: string; value: string | null; label: string }[];
  quote: string;
  quoteBy: string;
}

const TOPIC_ICONS = ["briefcase", "doc", "folder", "chat", "users", "badge", "plane", "home"];

function topics(rows: [string, string][]) {
  return rows.map(([title, text], i) => ({ title, text, icon: TOPIC_ICONS[i]! }));
}

export const CANDIDATES: Record<Locale, CandidatesCopy> = {
  vi: {
    nav: ["Người lao động từ Việt Nam", "Về chúng tôi", "Lộ trình nghề nghiệp", "Kiến thức & tư vấn", "Liên hệ"],
    login: "Đăng nhập",
    eyebrow: "Tương lai của bạn. Nhịp cầu cho nhân tài.",
    h1a: "Hiểu đúng lộ trình.",
    h1accent: "Chủ động",
    h1rest: " sang Đức làm việc.",
    // Ngắt dòng như mẫu; chỉ có hiệu lực ở desktop (whitespace-pre-line).
    sub: "NIBELC TalentBridge Deutschland kết nối nhân tài Việt Nam\nvới cơ hội nghề nghiệp bền vững tại Đức – minh bạch, chuyên nghiệp\nvà đồng hành trong suốt hành trình của bạn.",
    cta: "Kiểm tra ngành phù hợp",
    secondary: ["Xem lộ trình", "Hành trình của ứng viên"],
    trust: [
      ["Cơ hội việc làm thực tế", "tại Đức"],
      ["Tư vấn minh bạch,", "thông tin rõ ràng"],
      ["Đồng hành từ Việt Nam", "đến khi ổn định tại Đức"],
    ],
    topics: topics([
      ["Nghề phù hợp", "Khám phá các ngành đang tuyển dụng tại Đức"],
      ["Điều kiện", "Tìm hiểu các yêu cầu cần thiết"],
      ["Hồ sơ", "Chuẩn bị hồ sơ đúng tiêu chuẩn"],
      ["Tiếng Đức", "Lộ trình học và chứng chỉ cần thiết"],
      ["Phỏng vấn", "Mẹo phỏng vấn với nhà tuyển dụng Đức"],
      ["Công nhận bằng cấp", "Quy trình thẩm định và công nhận"],
      ["Visa", "Các bước xin visa lao động"],
      ["Chuẩn bị sang Đức", "Những điều cần biết trước khi khởi hành"],
    ]),
    stats: [
      { icon: "users", value: null, label: "Ứng viên Việt Nam đã được kết nối việc làm" },
      { icon: "building", value: null, label: "Đối tác tuyển dụng tại Đức" },
      { icon: "handshake", value: "8", label: "Lĩnh vực nghề nghiệp trọng điểm" },
      { icon: "star", value: null, label: "Ứng viên hài lòng với quá trình hỗ trợ" },
    ],
    quote: "Cùng bạn xây dựng một tương lai vững chắc tại Đức.",
    quoteBy: "NIBELC TalentBridge Deutschland",
  },
  de: {
    nav: ["Für Bewerber aus Vietnam", "Über uns", "Karrierewege", "Wissen & Ratgeber", "Kontakt"],
    login: "Anmelden",
    eyebrow: "Deine Zukunft. Brücken für Talente.",
    h1a: "Den Weg verstehen.",
    h1accent: "Selbstbestimmt",
    h1rest: " starten.",
    sub: "NIBELC TalentBridge Deutschland verbindet Talente aus Vietnam mit nachhaltigen beruflichen Chancen in Deutschland – transparent, professionell und mit Begleitung auf dem ganzen Weg.",
    cta: "Passende Branche prüfen",
    secondary: ["Ablauf ansehen", "Der Weg der Bewerber"],
    trust: [
      ["Echte Stellen", "in Deutschland"],
      ["Transparente Beratung,", "klare Informationen"],
      ["Begleitung von Vietnam", "bis zum sicheren Start"],
    ],
    topics: topics([
      ["Passender Beruf", "Branchen entdecken, die in Deutschland einstellen"],
      ["Voraussetzungen", "Welche Anforderungen gelten"],
      ["Unterlagen", "Unterlagen normgerecht vorbereiten"],
      ["Deutsch", "Lernweg und nötige Zertifikate"],
      ["Vorstellungsgespräch", "Tipps für Gespräche mit deutschen Arbeitgebern"],
      ["Anerkennung", "Prüfung und Anerkennung von Abschlüssen"],
      ["Visum", "Die Schritte zum Arbeitsvisum"],
      ["Vorbereitung", "Was vor der Abreise wichtig ist"],
    ]),
    stats: [
      { icon: "users", value: null, label: "Vermittelte Bewerber aus Vietnam" },
      { icon: "building", value: null, label: "Partnerbetriebe in Deutschland" },
      { icon: "handshake", value: "8", label: "Berufsfelder im Fokus" },
      { icon: "star", value: null, label: "Zufriedene Bewerber" },
    ],
    quote: "Gemeinsam eine sichere Zukunft in Deutschland aufbauen.",
    quoteBy: "NIBELC TalentBridge Deutschland",
  },
  en: {
    nav: ["Candidates from Vietnam", "About us", "Career paths", "Knowledge & advice", "Contact"],
    login: "Sign in",
    eyebrow: "Your future. Bridges for talent.",
    h1a: "Understand the path.",
    h1accent: "Take charge",
    h1rest: " of your future.",
    sub: "NIBELC TalentBridge Deutschland connects talent from Vietnam with lasting career opportunities in Germany – transparent, professional and with support all the way.",
    cta: "Find your industry",
    secondary: ["View the path", "The candidate journey"],
    trust: [
      ["Real job openings", "in Germany"],
      ["Transparent advice,", "clear information"],
      ["Support from Vietnam", "until you settle in"],
    ],
    topics: topics([
      ["The right job", "Explore industries hiring in Germany"],
      ["Requirements", "What you need to meet"],
      ["Documents", "Prepare your papers correctly"],
      ["German", "Learning path and certificates"],
      ["Interview", "Tips for German employer interviews"],
      ["Recognition", "How qualifications are assessed"],
      ["Visa", "Steps to a work visa"],
      ["Getting ready", "What to know before you leave"],
    ]),
    stats: [
      { icon: "users", value: null, label: "Candidates from Vietnam placed" },
      { icon: "building", value: null, label: "Partner employers in Germany" },
      { icon: "handshake", value: "8", label: "Key career fields" },
      { icon: "star", value: null, label: "Satisfied candidates" },
    ],
    quote: "Building a secure future in Germany – together.",
    quoteBy: "NIBELC TalentBridge Deutschland",
  },
};
