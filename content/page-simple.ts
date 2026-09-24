import type { Locale } from "@/content/locales";

/**
 * Bốn trang phụ mà menu trỏ tới: Über uns, Leistungen, Wissen, Kontakt.
 *
 * Nguồn nội dung:
 *  - `kit/docs/01-NIBELC-LAM-GI.md` (định vị, hai luồng người đọc, giọng điệu)
 *  - `content/legal.ts` (pháp nhân, lấy từ ấn phẩm chính thức của công ty)
 *  - `content/journey.ts`, `content/page-process.ts` (các bước dịch vụ)
 *
 * Không có ở đây, vì chưa được duyệt:
 *  - số năm hoạt động, số ứng viên, tỉ lệ thành công (CẦN ĐIỀN 05)
 *  - mức lương (03), mức tiếng Đức cụ thể (04), phí dịch vụ (07),
 *    điều kiện ứng viên và thời gian (08)
 *  - giờ làm việc và số điện thoại trong ảnh mẫu 08 (khác với ấn phẩm công ty)
 */

export interface Block {
  title: string;
  text: string;
}

export interface SimplePage {
  title: string;
  lead: string;
  eyebrow: string;
}

export interface SimpleCopy {
  about: SimplePage & {
    intro: string[];
    principles: Block[];
    factsTitle: string;
    groupNote: string;
  };
  services: SimplePage & {
    stepsTitle: string;
    scope: { inTitle: string; in: string[]; outTitle: string; out: string[] };
    costTitle: string;
    costText: string;
  };
  knowledge: SimplePage & { faqTitle: string; faq: Block[]; moreTitle: string };
  contact: SimplePage & {
    formTitle: string;
    fields: { name: string; email: string; phone: string; company: string; message: string; role: string };
    roles: string[];
    submit: string;
    sending: string;
    done: string;
    error: string;
    required: string;
    privacy: string;
    dataTitle: string;
  };
}

export const SIMPLE: Record<Locale, SimpleCopy> = {
  de: {
    about: {
      eyebrow: "Über uns",
      title: "NIBELC Germany GmbH",
      lead: "Wir verbinden deutsche Unternehmen mit Fachkräften aus Vietnam und begleiten beide Seiten durch das gesamte Verfahren.",
      intro: [
        "NIBELC TalentBridge Deutschland ist das Fachkräfteprogramm der NIBELC Germany GmbH mit Sitz in Berlin. Wir klären den Personalbedarf eines Betriebs, wählen in Vietnam passende Kandidatinnen und Kandidaten aus, bereiten sie sprachlich und fachlich vor und koordinieren Anerkennung, Visum, Einreise und die ersten Monate im Betrieb.",
        "Dabei arbeiten wir mit dem Unternehmen, der Fachkraft und den zuständigen Stellen zusammen. Jede Seite weiß, wer welchen Schritt verantwortet.",
      ],
      principles: [
        {
          title: "Keine Versprechen über Behördenentscheidungen",
          text: "Anerkennung und Visum entscheiden die zuständigen Stellen. Wir bereiten Unterlagen vor und begleiten Fristen — Ergebnisse sagen wir nicht zu.",
        },
        {
          title: "Das Unternehmen entscheidet",
          text: "Wir stellen Profile vor und organisieren Gespräche. Die Einstellungsentscheidung trifft immer der Betrieb.",
        },
        {
          title: "Transparenz gegenüber Bewerbern",
          text: "Anforderungen, Aufgaben und Abläufe werden vorher erklärt — auf Vietnamesisch und auf Deutsch.",
        },
        {
          title: "Begleitung nach der Ankunft",
          text: "Onboarding, Sprache und Alltag hören nicht am Flughafen auf. Wir bleiben Ansprechpartner im ersten Jahr.",
        },
      ],
      factsTitle: "Unternehmensangaben",
      groupNote: "NIBELC Germany GmbH gehört zur NIBELC GROUP.",
    },
    services: {
      eyebrow: "Leistungen",
      title: "Was wir übernehmen",
      lead: "Von der Bedarfsanalyse bis zur Integration im Betrieb — ein Ansprechpartner für alle Schritte.",
      stepsTitle: "Die sechs Schritte",
      scope: {
        inTitle: "Im Leistungsumfang",
        in: [
          "Anforderungsprofil und Bedarfsklärung mit dem Betrieb",
          "Vorauswahl und Interviews in Vietnam",
          "Sprachliche und fachliche Vorbereitung der Kandidaten",
          "Vorbereitung der Unterlagen für Anerkennung und Visum",
          "Organisation von Anreise und Ankunft",
          "Begleitung von Onboarding und Integration im Betrieb",
        ],
        outTitle: "Nicht im Leistungsumfang",
        out: [
          "Entscheidungen von Behörden, Kammern und Anerkennungsstellen",
          "Die Einstellungsentscheidung des Unternehmens",
          "Arbeitsvertrag und Lohnzahlung (Sache des Betriebs)",
          "Rechts- und Steuerberatung",
        ],
      },
      costTitle: "Kosten",
      costText:
        "Die Aufteilung der Kosten zwischen Unternehmen und Fachkraft hängt vom Modell der Zusammenarbeit ab und wird im Beratungsgespräch schriftlich festgehalten.",
    },
    knowledge: {
      eyebrow: "Wissen",
      title: "Antworten auf die häufigsten Fragen",
      lead: "Kurz erklärt: wie Vermittlung, Anerkennung und Integration in der Praxis ablaufen.",
      faqTitle: "Häufige Fragen",
      faq: [
        {
          title: "Wie lange dauert das Verfahren?",
          text: "Die Dauer hängt von Beruf, Anerkennungsstelle und Auslastung der Auslandsvertretung ab. Wir nennen im Beratungsgespräch den Stand der jeweils laufenden Verfahren statt einer pauschalen Zahl.",
        },
        {
          title: "Welche Deutschkenntnisse sind nötig?",
          text: "Das richtet sich nach Beruf und Anerkennungsweg. Die Kandidaten werden in einem strukturierten Sprachprogramm vorbereitet; das erforderliche Niveau wird pro Stelle festgelegt.",
        },
        {
          title: "Wer prüft die Berufsabschlüsse?",
          text: "Die Anerkennung erfolgt durch die zuständigen deutschen Stellen (je nach Beruf Kammer oder Landesbehörde). Wir stellen Unterlagen zusammen und begleiten den Antrag.",
        },
        {
          title: "Wie läuft die Auswahl der Kandidaten?",
          text: "Wir erstellen mit dem Betrieb ein Anforderungsprofil, sichten Profile in Vietnam, führen Vorinterviews und stellen anschließend eine Auswahl vor. Die Gespräche mit dem Unternehmen finden online statt.",
        },
        {
          title: "In welchen Branchen vermitteln Sie?",
          text: "Aktuell in sieben Berufsfeldern vom Handwerk über Logistik bis zur Produktion. Die Übersicht mit Tätigkeiten und Anforderungen steht auf der Seite Branchen.",
        },
        {
          title: "Was passiert nach der Einreise?",
          text: "Wir begleiten Ankunft, Anmeldung und Onboarding im Betrieb und bleiben im ersten Jahr Ansprechpartner für Fachkraft und Unternehmen.",
        },
        {
          title: "Wie werden personenbezogene Daten behandelt?",
          text: "Bewerberdaten werden ausschließlich zur Bearbeitung der Vermittlung verwendet und nur mit dem betreffenden Unternehmen geteilt.",
        },
      ],
      moreTitle: "Weiterlesen",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Sprechen Sie uns an",
      lead: "Ob Personalbedarf oder Bewerbung — schreiben Sie uns, wir melden uns zurück.",
      formTitle: "Nachricht senden",
      fields: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon (optional)",
        company: "Unternehmen (optional)",
        message: "Ihre Nachricht",
        role: "Ich schreibe als",
      },
      roles: ["Unternehmen", "Fachkraft / Bewerber", "Sonstiges"],
      submit: "Nachricht senden",
      sending: "Wird gesendet …",
      done: "Danke — Ihre Nachricht ist eingegangen. Wir melden uns bei Ihnen.",
      error: "Das hat nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie direkt an die angegebene E-Mail-Adresse.",
      required: "Pflichtfeld",
      privacy: "Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.",
      dataTitle: "Direkt erreichbar",
    },
  },
  en: {
    about: {
      eyebrow: "About us",
      title: "NIBELC Germany GmbH",
      lead: "We connect German companies with skilled workers from Vietnam and support both sides through the whole procedure.",
      intro: [
        "NIBELC TalentBridge Deutschland is the skilled-worker programme of NIBELC Germany GmbH, based in Berlin. We clarify a company's staffing needs, select suitable candidates in Vietnam, prepare them in language and trade skills, and coordinate recognition, visa, arrival and the first months on the job.",
        "We work alongside the company, the candidate and the competent authorities, so everyone knows who is responsible for which step.",
      ],
      principles: [
        {
          title: "No promises about official decisions",
          text: "Recognition and visas are decided by the competent authorities. We prepare documents and track deadlines — we do not promise outcomes.",
        },
        {
          title: "The company decides",
          text: "We present profiles and arrange interviews. The hiring decision always rests with the employer.",
        },
        {
          title: "Transparency towards candidates",
          text: "Requirements, tasks and procedures are explained up front — in Vietnamese and in German.",
        },
        {
          title: "Support after arrival",
          text: "Onboarding, language and daily life do not end at the airport. We stay available during the first year.",
        },
      ],
      factsTitle: "Company details",
      groupNote: "NIBELC Germany GmbH is part of NIBELC GROUP.",
    },
    services: {
      eyebrow: "Services",
      title: "What we take care of",
      lead: "From analysing the need to integration at work — one contact person for every step.",
      stepsTitle: "The six steps",
      scope: {
        inTitle: "Included",
        in: [
          "Job profile and needs assessment with the company",
          "Pre-selection and interviews in Vietnam",
          "Language and technical preparation of candidates",
          "Preparing documents for recognition and visa",
          "Organising travel and arrival",
          "Support with onboarding and integration",
        ],
        outTitle: "Not included",
        out: [
          "Decisions by authorities, chambers and recognition bodies",
          "The employer's hiring decision",
          "Employment contract and payroll (the company's responsibility)",
          "Legal and tax advice",
        ],
      },
      costTitle: "Costs",
      costText:
        "How costs are shared between company and candidate depends on the model of cooperation and is set out in writing during the consultation.",
    },
    knowledge: {
      eyebrow: "Knowledge",
      title: "Answers to the most common questions",
      lead: "In short: how placement, recognition and integration work in practice.",
      faqTitle: "Frequently asked questions",
      faq: [
        {
          title: "How long does the procedure take?",
          text: "It depends on the occupation, the recognition body and the workload of the German mission abroad. In the consultation we describe the status of current cases instead of quoting a blanket figure.",
        },
        {
          title: "What level of German is required?",
          text: "That depends on the occupation and the recognition route. Candidates follow a structured language programme; the required level is agreed per position.",
        },
        {
          title: "Who assesses the qualifications?",
          text: "Recognition is granted by the competent German bodies (chamber or state authority, depending on the trade). We compile the documents and accompany the application.",
        },
        {
          title: "How are candidates selected?",
          text: "We draw up a job profile with the company, review profiles in Vietnam, run pre-interviews and then present a shortlist. Interviews with the employer take place online.",
        },
        {
          title: "Which industries do you cover?",
          text: "Currently seven fields, from crafts and logistics to production. The overview with tasks and requirements is on the Industries page.",
        },
        {
          title: "What happens after arrival?",
          text: "We support arrival, registration and onboarding, and remain available to both worker and company during the first year.",
        },
        {
          title: "How is personal data handled?",
          text: "Candidate data is used solely to process the placement and shared only with the company concerned.",
        },
      ],
      moreTitle: "Read on",
    },
    contact: {
      eyebrow: "Contact",
      title: "Get in touch",
      lead: "Staffing needs or an application — write to us and we will get back to you.",
      formTitle: "Send a message",
      fields: {
        name: "Name",
        email: "Email",
        phone: "Phone (optional)",
        company: "Company (optional)",
        message: "Your message",
        role: "I am writing as",
      },
      roles: ["Company", "Skilled worker / candidate", "Other"],
      submit: "Send message",
      sending: "Sending …",
      done: "Thank you — your message has arrived. We will get back to you.",
      error: "That did not work. Please try again or write to the email address shown.",
      required: "Required",
      privacy: "Your details are used solely to handle your enquiry.",
      dataTitle: "Direct contact",
    },
  },
  vi: {
    about: {
      eyebrow: "Về chúng tôi",
      title: "NIBELC Germany GmbH",
      lead: "Chúng tôi kết nối doanh nghiệp Đức với người lao động Việt Nam và đồng hành cả hai bên suốt quá trình.",
      intro: [
        "NIBELC TalentBridge Deutschland là chương trình nhân lực của NIBELC Germany GmbH, trụ sở tại Berlin. Chúng tôi làm rõ nhu cầu nhân sự của doanh nghiệp, tuyển chọn ứng viên phù hợp tại Việt Nam, chuẩn bị tiếng Đức và chuyên môn, rồi điều phối phần công nhận bằng cấp, visa, nhập cảnh và những tháng đầu tại nơi làm việc.",
        "Chúng tôi làm việc cùng doanh nghiệp, người lao động và các cơ quan có thẩm quyền, để mỗi bên đều biết ai chịu trách nhiệm bước nào.",
      ],
      principles: [
        {
          title: "Không hứa thay cơ quan nhà nước",
          text: "Công nhận bằng cấp và visa do cơ quan có thẩm quyền quyết định. Chúng tôi chuẩn bị hồ sơ và theo sát thời hạn, không hứa kết quả.",
        },
        {
          title: "Doanh nghiệp là người quyết định",
          text: "Chúng tôi giới thiệu hồ sơ và tổ chức phỏng vấn. Quyết định nhận người luôn thuộc về doanh nghiệp.",
        },
        {
          title: "Minh bạch với người lao động",
          text: "Yêu cầu, công việc và quy trình được nói rõ từ đầu — bằng tiếng Việt và tiếng Đức.",
        },
        {
          title: "Đồng hành sau khi sang Đức",
          text: "Nhận việc, học tiếng và ổn định cuộc sống không dừng ở sân bay. Chúng tôi là đầu mối trong năm đầu tiên.",
        },
      ],
      factsTitle: "Thông tin doanh nghiệp",
      groupNote: "NIBELC Germany GmbH thuộc NIBELC GROUP.",
    },
    services: {
      eyebrow: "Dịch vụ",
      title: "Chúng tôi lo những phần nào",
      lead: "Từ phân tích nhu cầu đến khi hội nhập tại nơi làm việc — một đầu mối cho mọi bước.",
      stepsTitle: "Sáu bước",
      scope: {
        inTitle: "Có trong dịch vụ",
        in: [
          "Làm rõ nhu cầu và mô tả vị trí cùng doanh nghiệp",
          "Sơ tuyển và phỏng vấn tại Việt Nam",
          "Chuẩn bị tiếng Đức và chuyên môn cho ứng viên",
          "Chuẩn bị hồ sơ công nhận bằng cấp và visa",
          "Tổ chức chuyến đi và đón tiếp",
          "Đồng hành khi nhận việc và hội nhập",
        ],
        outTitle: "Không thuộc dịch vụ",
        out: [
          "Quyết định của cơ quan nhà nước và tổ chức công nhận bằng",
          "Quyết định nhận người của doanh nghiệp",
          "Hợp đồng lao động và trả lương (thuộc doanh nghiệp)",
          "Tư vấn pháp lý và thuế",
        ],
      },
      costTitle: "Chi phí",
      costText:
        "Cách chia chi phí giữa doanh nghiệp và người lao động tuỳ mô hình hợp tác, và được ghi rõ bằng văn bản trong buổi tư vấn.",
    },
    knowledge: {
      eyebrow: "Kiến thức",
      title: "Giải đáp những câu hỏi thường gặp",
      lead: "Nói ngắn gọn: việc kết nối, công nhận bằng cấp và hội nhập diễn ra thế nào trên thực tế.",
      faqTitle: "Câu hỏi thường gặp",
      faq: [
        {
          title: "Quy trình mất bao lâu?",
          text: "Tuỳ nghề, tuỳ cơ quan công nhận bằng và tuỳ mức độ quá tải của cơ quan đại diện Đức. Trong buổi tư vấn, chúng tôi nói rõ tiến độ các hồ sơ đang chạy thay vì đưa ra một con số chung.",
        },
        {
          title: "Cần tiếng Đức đến mức nào?",
          text: "Tuỳ nghề và tuỳ hướng công nhận bằng. Ứng viên được học theo chương trình có lộ trình; mức yêu cầu được chốt theo từng vị trí.",
        },
        {
          title: "Ai thẩm định bằng nghề?",
          text: "Việc công nhận do cơ quan có thẩm quyền của Đức thực hiện (tuỳ nghề là phòng nghề hoặc cơ quan bang). Chúng tôi tập hợp hồ sơ và theo sát quá trình nộp.",
        },
        {
          title: "Ứng viên được chọn thế nào?",
          text: "Chúng tôi cùng doanh nghiệp dựng mô tả vị trí, sàng lọc hồ sơ tại Việt Nam, phỏng vấn sơ bộ rồi giới thiệu danh sách. Buổi phỏng vấn với doanh nghiệp diễn ra trực tuyến.",
        },
        {
          title: "Có những ngành nào?",
          text: "Hiện có bảy nhóm nghề, từ nghề thủ công, kho vận đến sản xuất. Danh sách kèm công việc và yêu cầu nằm ở trang Ngành nghề.",
        },
        {
          title: "Sang Đức rồi thì sao?",
          text: "Chúng tôi hỗ trợ lúc đến nơi, đăng ký cư trú và nhận việc, đồng thời là đầu mối cho cả người lao động lẫn doanh nghiệp trong năm đầu.",
        },
        {
          title: "Dữ liệu cá nhân được xử lý ra sao?",
          text: "Hồ sơ ứng viên chỉ dùng cho việc kết nối việc làm và chỉ chia sẻ với doanh nghiệp liên quan.",
        },
      ],
      moreTitle: "Đọc thêm",
    },
    contact: {
      eyebrow: "Liên hệ",
      title: "Hãy nhắn cho chúng tôi",
      lead: "Cần tuyển người hay muốn ứng tuyển — gửi tin nhắn, chúng tôi sẽ trả lời.",
      formTitle: "Gửi tin nhắn",
      fields: {
        name: "Họ tên",
        email: "Email",
        phone: "Điện thoại (không bắt buộc)",
        company: "Doanh nghiệp (không bắt buộc)",
        message: "Nội dung",
        role: "Tôi là",
      },
      roles: ["Doanh nghiệp", "Người lao động", "Khác"],
      submit: "Gửi tin nhắn",
      sending: "Đang gửi …",
      done: "Cảm ơn bạn — tin nhắn đã tới nơi. Chúng tôi sẽ liên hệ lại.",
      error: "Chưa gửi được. Bạn thử lại hoặc gửi thẳng tới địa chỉ email bên cạnh.",
      required: "Bắt buộc",
      privacy: "Thông tin của bạn chỉ dùng để xử lý yêu cầu này.",
      dataTitle: "Liên hệ trực tiếp",
    },
  },
};
