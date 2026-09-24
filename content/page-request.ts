import type { Locale } from "@/content/locales";

/**
 * Trang 08 — screens/08-personalbedarf-formular.png: biểu mẫu nhu cầu nhân sự
 * bốn bước.
 *
 * Khác mẫu, có chủ đích:
 *  - "Schnell, zuverlässig und nachhaltig" ở phần mở đầu là lời hứa tốc độ →
 *    bỏ chữ "schnell".
 *  - Người tư vấn "Linh Nguyen" cùng số +49 69 247 521 710 và email
 *    beratung@nibelc.de trong mẫu là bịa và lệch với ấn phẩm công ty →
 *    dùng dữ liệu pháp nhân thật, không gán cho người cụ thể.
 *  - "Wir prüfen Ihre Angaben und melden uns innerhalb von 1–2 Werktagen":
 *    cam kết thời gian chưa được duyệt → "so schnell wie möglich".
 *  - Danh sách ngành đọc từ registry, danh sách trình độ tiếng Đức để mở
 *    (CẦN ĐIỀN 04) nên chỉ có các lựa chọn trung lập.
 */

export interface RequestCopy {
  eyebrow: string;
  h1: [string, string];
  lead: string;
  trust: [string, string][];
  steps: string[];
  stepTitles: string[];
  intro: string;
  fields: Record<
    | "branche"
    | "beruf"
    | "anzahl"
    | "standort"
    | "start"
    | "sprachniveau"
    | "unternehmen"
    | "ansprechpartner"
    | "email"
    | "phone"
    | "notiz",
    string
  >;
  placeholders: Record<"branche" | "beruf" | "anzahl" | "standort" | "start" | "sprachniveau" | "notiz", string>;
  sprachOptions: string[];
  startOptions: string[];
  berufOther: string;
  required: string;
  next: string;
  back: string;
  submit: string;
  sending: string;
  summaryTitle: string;
  done: { title: string; text: string };
  error: string;
  advice: { title: string; text: string };
  safety: { title: string; text: string; link: string };
  nextSteps: { title: string; items: [string, string][] };
  claim: string;
}

export const REQUEST: Record<Locale, RequestCopy> = {
  de: {
    eyebrow: "Fachkräfte. Zukunft. Gemeinsam.",
    h1: ["Welchen Personalbedarf", "haben Sie?"],
    lead: "Mit NIBELC TalentBridge Deutschland finden Sie motivierte, qualifizierte Fachkräfte aus Vietnam – passgenau für Ihr Unternehmen. Zuverlässig und nachhaltig.",
    trust: [
      ["Qualifizierte Fachkräfte", "Motiviert. Praktisch erfahren."],
      ["Transparentes Verfahren", "Nach deutschen Standards."],
      ["Langfristige Partnerschaft", "Mehr als nur Personalvermittlung."],
    ],
    steps: ["Bedarf", "Unternehmen", "Kontaktdaten", "Prüfen & Senden"],
    stepTitles: ["1. Ihr Personalbedarf", "2. Ihr Unternehmen", "3. Ihre Kontaktdaten", "4. Prüfen und senden"],
    intro:
      "Bitte geben Sie uns die wichtigsten Informationen zu Ihrem Bedarf. Je genauer Ihre Angaben, desto passender können wir Ihnen geeignete Kandidatinnen und Kandidaten vorschlagen.",
    fields: {
      branche: "Branche",
      beruf: "Beruf / Fachrichtung",
      anzahl: "Anzahl benötigter Fachkräfte",
      standort: "Einsatzort / Standort",
      start: "Gewünschter Starttermin",
      sprachniveau: "Sprachliche Vorbereitung",
      unternehmen: "Unternehmen",
      ansprechpartner: "Ansprechpartner",
      email: "E-Mail",
      phone: "Telefon",
      notiz: "Anmerkungen",
    },
    placeholders: {
      branche: "Bitte Branche auswählen",
      beruf: "Bitte Beruf auswählen",
      anzahl: "z. B. 1, 5, 10 …",
      standort: "Ort oder Region",
      start: "Bitte auswählen",
      sprachniveau: "Bitte auswählen",
      notiz: "Schichtmodell, Unterkunft, Besonderheiten …",
    },
    sprachOptions: [
      "Vorbereitung durch NIBELC gewünscht",
      "Wir bringen eigene Sprachbegleitung mit",
      "Noch offen – bitte beraten",
    ],
    startOptions: ["So früh wie möglich", "In 3 bis 6 Monaten", "In 6 bis 12 Monaten", "Noch offen"],
    berufOther: "Anderer Beruf / noch offen",
    required: "Pflichtfelder",
    next: "Weiter",
    back: "Zurück",
    submit: "Anfrage senden",
    sending: "Wird gesendet …",
    summaryTitle: "Ihre Angaben",
    done: {
      title: "Ihre Anfrage ist eingegangen.",
      text: "Wir sehen uns Ihren Bedarf an und melden uns bei Ihnen. Bei Rückfragen erreichen Sie uns jederzeit unter den Kontaktdaten auf dieser Seite.",
    },
    error: "Das hat nicht geklappt. Bitte prüfen Sie die markierten Felder oder schreiben Sie uns direkt per E-Mail.",
    advice: {
      title: "Persönliche Beratung",
      text: "Wir beraten Sie gerne individuell zu Ihrem Personalbedarf.",
    },
    safety: {
      title: "Ihre Daten sind sicher",
      text: "Ihre Angaben werden vertraulich behandelt und ausschließlich zur Bearbeitung Ihrer Anfrage verwendet. Mehr erfahren Sie in unserer",
      link: "Datenschutzerklärung",
    },
    nextSteps: {
      title: "So geht es weiter",
      items: [
        ["Anfrage senden", "Sie übermitteln uns Ihren Personalbedarf."],
        ["Analyse & Rückmeldung", "Wir prüfen Ihre Angaben und melden uns so schnell wie möglich."],
        ["Individuelles Angebot", "Sie erhalten ein passendes Konzept und besprechen die nächsten Schritte mit unserem Team."],
      ],
    },
    claim: "Gemeinsam Fachkräfte für morgen gewinnen.",
  },
  en: {
    eyebrow: "Skilled workers. Future. Together.",
    h1: ["What staffing needs", "do you have?"],
    lead: "With NIBELC TalentBridge Deutschland you find motivated, qualified skilled workers from Vietnam – matched to your company. Reliable and long-term.",
    trust: [
      ["Qualified workers", "Motivated. Practically experienced."],
      ["Transparent procedure", "To German standards."],
      ["Long-term partnership", "More than placement."],
    ],
    steps: ["Needs", "Company", "Contact", "Review & send"],
    stepTitles: ["1. Your staffing needs", "2. Your company", "3. Your contact details", "4. Review and send"],
    intro:
      "Please give us the key facts about your need. The more precise your answers, the better we can propose suitable candidates.",
    fields: {
      branche: "Industry",
      beruf: "Occupation / field",
      anzahl: "Number of workers needed",
      standort: "Place of work",
      start: "Preferred start",
      sprachniveau: "Language preparation",
      unternehmen: "Company",
      ansprechpartner: "Contact person",
      email: "Email",
      phone: "Phone",
      notiz: "Notes",
    },
    placeholders: {
      branche: "Please select an industry",
      beruf: "Please select an occupation",
      anzahl: "e.g. 1, 5, 10 …",
      standort: "City or region",
      start: "Please select",
      sprachniveau: "Please select",
      notiz: "Shift model, accommodation, specifics …",
    },
    sprachOptions: [
      "Preparation by NIBELC preferred",
      "We provide our own language support",
      "Still open – please advise",
    ],
    startOptions: ["As soon as possible", "In 3 to 6 months", "In 6 to 12 months", "Still open"],
    berufOther: "Other occupation / still open",
    required: "Required fields",
    next: "Next",
    back: "Back",
    submit: "Send request",
    sending: "Sending …",
    summaryTitle: "Your details",
    done: {
      title: "Your request has arrived.",
      text: "We will look at your requirements and get back to you. You can reach us any time using the contact details on this page.",
    },
    error: "That did not work. Please check the marked fields or write to us by email.",
    advice: { title: "Personal advice", text: "We are happy to advise you individually on your staffing needs." },
    safety: {
      title: "Your data is safe",
      text: "Your details are treated confidentially and used solely to process your request. Read more in our",
      link: "privacy policy",
    },
    nextSteps: {
      title: "What happens next",
      items: [
        ["Send the request", "You tell us about your staffing needs."],
        ["Review & reply", "We look at your details and come back to you as soon as we can."],
        ["Tailored proposal", "You receive a fitting concept and discuss next steps with our team."],
      ],
    },
    claim: "Winning tomorrow's skilled workers, together.",
  },
  vi: {
    eyebrow: "Nhân lực. Tương lai. Cùng nhau.",
    h1: ["Doanh nghiệp bạn", "cần nhân sự gì?"],
    lead: "Cùng NIBELC TalentBridge Deutschland, bạn tìm được người lao động Việt Nam có tay nghề và động lực – đúng với nhu cầu doanh nghiệp. Tin cậy và lâu dài.",
    trust: [
      ["Nhân lực có tay nghề", "Có động lực, quen việc thực tế."],
      ["Quy trình minh bạch", "Theo chuẩn của Đức."],
      ["Hợp tác lâu dài", "Không chỉ là môi giới nhân sự."],
    ],
    steps: ["Nhu cầu", "Doanh nghiệp", "Liên hệ", "Kiểm tra & gửi"],
    stepTitles: ["1. Nhu cầu nhân sự", "2. Doanh nghiệp của bạn", "3. Thông tin liên hệ", "4. Kiểm tra và gửi"],
    intro:
      "Vui lòng cho chúng tôi biết những thông tin chính về nhu cầu. Càng rõ, chúng tôi càng giới thiệu được ứng viên sát yêu cầu.",
    fields: {
      branche: "Ngành nghề",
      beruf: "Nghề / chuyên môn",
      anzahl: "Số lượng cần tuyển",
      standort: "Nơi làm việc",
      start: "Thời điểm muốn bắt đầu",
      sprachniveau: "Chuẩn bị tiếng Đức",
      unternehmen: "Tên doanh nghiệp",
      ansprechpartner: "Người liên hệ",
      email: "Email",
      phone: "Điện thoại",
      notiz: "Ghi chú",
    },
    placeholders: {
      branche: "Chọn ngành nghề",
      beruf: "Chọn nghề",
      anzahl: "ví dụ 1, 5, 10 …",
      standort: "Thành phố hoặc vùng",
      start: "Chọn thời điểm",
      sprachniveau: "Chọn phương án",
      notiz: "Ca làm, chỗ ở, yêu cầu riêng …",
    },
    sprachOptions: [
      "Muốn NIBELC lo phần đào tạo tiếng",
      "Chúng tôi tự lo phần tiếng Đức",
      "Chưa rõ – cần tư vấn",
    ],
    startOptions: ["Càng sớm càng tốt", "Trong 3 đến 6 tháng", "Trong 6 đến 12 tháng", "Chưa chốt"],
    berufOther: "Nghề khác / chưa chốt",
    required: "Mục bắt buộc",
    next: "Tiếp tục",
    back: "Quay lại",
    submit: "Gửi yêu cầu",
    sending: "Đang gửi …",
    summaryTitle: "Thông tin bạn đã nhập",
    done: {
      title: "Yêu cầu đã được gửi.",
      text: "Chúng tôi sẽ xem nhu cầu của bạn và liên hệ lại. Bạn cũng có thể gọi hoặc gửi email theo thông tin trên trang này.",
    },
    error: "Chưa gửi được. Bạn kiểm tra lại các ô được đánh dấu hoặc gửi email trực tiếp cho chúng tôi.",
    advice: { title: "Tư vấn trực tiếp", text: "Chúng tôi sẵn sàng tư vấn riêng cho nhu cầu của bạn." },
    safety: {
      title: "Dữ liệu của bạn được bảo mật",
      text: "Thông tin được giữ kín và chỉ dùng để xử lý yêu cầu này. Đọc thêm trong",
      link: "chính sách bảo mật",
    },
    nextSteps: {
      title: "Các bước tiếp theo",
      items: [
        ["Gửi yêu cầu", "Bạn cho chúng tôi biết nhu cầu nhân sự."],
        ["Xem xét & phản hồi", "Chúng tôi xem thông tin và liên hệ lại sớm nhất có thể."],
        ["Phương án riêng", "Bạn nhận phương án phù hợp và bàn bước tiếp theo cùng đội ngũ của chúng tôi."],
      ],
    },
    claim: "Cùng nhau có được nhân lực cho ngày mai.",
  },
};
