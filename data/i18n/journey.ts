import { CHANG, type Chang } from "@/data/journey";
import type { Lang } from "@/lib/i18n/config";
import { batBuocDu, timChoThieu, type BanDichTheoNgonNgu } from "@/lib/i18n/du-lieu";

/**
 * BẢN DỊCH 9 CHẶNG LỘ TRÌNH (CHANG trong data/journey.ts).
 * Mảng gốc không có `id` → khoá theo `so` ("01" … "09").
 * Mảng viec/giay/hoTro/ketQua phải ĐÚNG số phần tử như bản gốc.
 * Thuật ngữ Đức giữ nguyên trong bản en khi là tên thủ tục (Anmeldung, Bürgeramt,
 * Ausbildungsvertrag) — kèm giải thích tiếng Anh.
 */
export interface ChangBanDich {
  ten: string;
  thoiGian: string;
  mo: string;
  viec: string[];
  giay: string[];
  hoTro: string[];
  ketQua: string[];
}

const EN: Record<string, ChangBanDich> = {
  "01": {
    ten: "Consultation & profile assessment",
    thoiGian: "1–3 days",
    mo: "We discuss your goals, assess your documents and map out the route that suits you best.",
    viec: ["Discuss your goals: country, occupation, income", "Assess qualifications and experience", "Choose the route: employment or vocational training"],
    giay: ["National ID card", "Highest qualification", "Vocational certificates, if any"],
    hoTro: ["One-to-one advice from a consultant", "Free profile assessment", "Suggested occupations that suit you"],
    ketQua: ["A clear picture of your eligibility and opportunities", "A personalised route", "A shortlist of suitable vacancies or training occupations"],
  },
  "02": {
    ten: "Choose a programme / vacancy",
    thoiGian: "3–7 days",
    mo: "We match your skills against current vacancies and you decide which one to pursue.",
    viec: ["Review the vacancy or training occupation in detail", "Compare pay, working hours and location", "Settle on one or two options"],
    giay: ["CV", "Portrait photo on a white background"],
    hoTro: ["A clear explanation of what the job actually involves", "Points to consider flagged in advance", "Your place held while you prepare"],
    ketQua: ["Vacancy or training occupation confirmed", "An estimated departure timeline"],
  },
  "03": {
    ten: "Learn German",
    thoiGian: "3–16 months",
    mo: "Reach the level required by the vacancy or training occupation and pass the certificate exam.",
    viec: ["Follow the A1 → B1 or B2 pathway", "Learn the vocabulary of your occupation", "Practise listening and speaking for the interview"],
    giay: ["Exam registration", "German language certificate"],
    hoTro: ["Referral to recognised language centres", "Monthly progress tracking", "Revision before the exam"],
    ketQua: ["The required language certificate", "Able to communicate at work"],
  },
  "04": {
    ten: "Documents & recognition",
    thoiGian: "4–8 weeks",
    mo: "Certified translation, consular legalisation and recognition of your qualifications.",
    viec: ["Translate certificates and school records", "Consular legalisation", "Obtain a criminal record certificate", "Medical examination"],
    giay: ["Passport valid for more than 12 months", "Translated certificates and school records", "Criminal record certificate", "Medical certificate"],
    hoTro: ["Guidance on every document", "Document check before submission", "Tracking of the recognition process"],
    ketQua: ["A complete file meeting German standards", "Ready for the interview stage"],
  },
  "05": {
    ten: "Employer interview",
    thoiGian: "2–6 weeks",
    mo: "An online or in-person interview with the employer.",
    viec: ["Mock interviews", "Prepare a skills video if the vacancy requires one", "Interview with the company's representative"],
    giay: ["CV in German", "Language certificate", "Skills video, if any"],
    hoTro: ["Practice sessions with a consultant", "Interpreting during the interview", "Negotiating the terms"],
    ketQua: ["Interview passed", "Offer letter or contract received"],
  },
  "06": {
    ten: "Sign the contract",
    thoiGian: "1–2 weeks",
    mo: "Read carefully and sign the employment contract or vocational training contract.",
    viec: ["Read the full translation of the contract", "Ask about any unclear terms", "Sign the contract"],
    giay: ["Employment contract or Ausbildungsvertrag (training contract)", "Confirmation of accommodation in Germany"],
    hoTro: ["Translation of the contract", "Explanation of every clause", "A copy kept on file for you"],
    ketQua: ["A formal contract", "The basis for your visa application"],
  },
  "07": {
    ten: "Visa application",
    thoiGian: "6–12 weeks",
    mo: "Submit your application to the German mission and follow it through to a decision.",
    viec: ["Book an appointment to submit", "Submit the application and give fingerprints", "Track the processing"],
    giay: ["Visa application form", "Contract", "Health insurance", "Original passport"],
    hoTro: ["File review before submission", "Guidance for the appointment", "Follow-up and additional documents when the consulate requests them"],
    ketQua: ["Visa issued", "Visa details checked"],
  },
  "08": {
    ten: "Fly to Germany",
    thoiGian: "1–2 weeks",
    mo: "Booking your flight, packing and guidance on entry procedures.",
    viec: ["Book the flight", "Pack according to the guidance", "Know the EU entry procedures"],
    giay: ["Passport with visa", "Printed copy of the contract", "Accommodation address and the number of the person meeting you"],
    hoTro: ["Guidance on luggage and customs", "Airport pick-up arranged"],
    ketQua: ["Smooth entry", "Safe arrival at your accommodation"],
  },
  "09": {
    ten: "Onboarding in Germany",
    thoiGian: "Ongoing for the first 3 months",
    mo: "Residence registration, insurance, bank account and settling in at work.",
    viec: ["Anmeldung (address registration) at the Bürgeramt", "Register with a health insurer", "Open a bank account", "Settle into the job"],
    giay: ["Confirmation of accommodation", "Health insurance card", "Tax ID"],
    hoTro: ["Accompanying you to appointments", "Interpreting when needed", "Support during your first three months at work"],
    ketQua: ["Residence formalities completed", "Settled at work and in daily life"],
  },
};

const DE: Record<string, ChangBanDich> = {
  "01": {
    ten: "Beratung & Profilprüfung",
    thoiGian: "1–3 Tage",
    mo: "Wir besprechen Ihre Ziele, prüfen Ihre Unterlagen und erstellen den passenden Weg für Sie.",
    viec: ["Wünsche klären: Land, Beruf, Einkommen", "Abschlüsse und Berufserfahrung bewerten", "Richtung festlegen: Arbeit oder Ausbildung"],
    giay: ["Personalausweis", "Höchster Bildungsabschluss", "Berufszertifikate, falls vorhanden"],
    hoTro: ["Persönliche 1:1-Beratung", "Kostenlose Profilprüfung", "Vorschläge für passende Berufe"],
    ketQua: ["Klarheit über Voraussetzungen und Chancen", "Ein individueller Fahrplan", "Liste passender Stellen oder Ausbildungsberufe"],
  },
  "02": {
    ten: "Programm / Stelle wählen",
    thoiGian: "3–7 Tage",
    mo: "Ihre Qualifikation wird mit offenen Stellen abgeglichen, danach legen Sie sich auf eine Stelle fest.",
    viec: ["Details zur Stelle oder zum Ausbildungsberuf ansehen", "Einkommen, Arbeitszeit und Arbeitsort vergleichen", "Ein oder zwei Optionen festlegen"],
    giay: ["Lebenslauf", "Porträtfoto mit weißem Hintergrund"],
    hoTro: ["Klare Erläuterung der tatsächlichen Tätigkeit", "Hinweise auf kritische Punkte", "Reservierung des Platzes während der Vorbereitung"],
    ketQua: ["Stelle oder Ausbildungsberuf steht fest", "Voraussichtlicher Ausreisezeitraum bekannt"],
  },
  "03": {
    ten: "Deutsch lernen",
    thoiGian: "3–16 Monate",
    mo: "Sie lernen bis zum geforderten Sprachniveau und legen die Zertifikatsprüfung ab.",
    viec: ["Kursweg A1 → B1 oder B2", "Fachwortschatz des eigenen Berufs", "Hören und Sprechen für das Vorstellungsgespräch üben"],
    giay: ["Anmeldung zur Prüfung", "Deutsch-Sprachzertifikat"],
    hoTro: ["Vermittlung an anerkannte Sprachschulen", "Monatliche Lernstandskontrolle", "Prüfungsvorbereitung"],
    ketQua: ["Sprachzertifikat auf dem geforderten Niveau", "Verständigung im Berufsalltag"],
  },
  "04": {
    ten: "Unterlagen & Anerkennung",
    thoiGian: "4–8 Wochen",
    mo: "Beglaubigte Übersetzungen, Legalisation und Anerkennung Ihrer Abschlüsse.",
    viec: ["Zeugnisse und Schulunterlagen übersetzen lassen", "Legalisation durch die Auslandsvertretung", "Führungszeugnis beantragen", "Ärztliche Untersuchung"],
    giay: ["Reisepass mit mehr als 12 Monaten Gültigkeit", "Übersetzte Zeugnisse und Schulunterlagen", "Führungszeugnis", "Ärztliches Attest"],
    hoTro: ["Anleitung zu jedem Dokument", "Prüfung der Unterlagen vor der Einreichung", "Begleitung des Anerkennungsverfahrens"],
    ketQua: ["Vollständige Unterlagen nach deutschem Standard", "Bereit für das Vorstellungsgespräch"],
  },
  "05": {
    // ­ = gạch nối mềm: từ dài hơn ô của lưới 9 chặng, chỉ ngắt khi thiếu chỗ
    ten: "Vorstellungs­gespräch",
    thoiGian: "2–6 Wochen",
    mo: "Online- oder Präsenzgespräch mit dem Arbeitgeber bzw. dem Ausbildungsbetrieb.",
    viec: ["Probegespräche üben", "Video-Arbeitsprobe vorbereiten, falls gefordert", "Gespräch mit Vertretern des Unternehmens"],
    giay: ["Lebenslauf auf Deutsch", "Sprachzertifikat", "Video-Arbeitsprobe, falls vorhanden"],
    hoTro: ["Gesprächstraining mit unseren Fachberatern", "Dolmetschen während des Gesprächs", "Verhandlung der Konditionen"],
    ketQua: ["Gespräch erfolgreich", "Zusage oder Vertrag erhalten"],
  },
  "06": {
    ten: "Vertrag unterschreiben",
    thoiGian: "1–2 Wochen",
    mo: "Arbeitsvertrag oder Ausbildungsvertrag sorgfältig lesen und unterschreiben.",
    viec: ["Vollständige Übersetzung des Vertrags lesen", "Unklare Klauseln nachfragen", "Vertrag unterschreiben"],
    giay: ["Arbeitsvertrag oder Ausbildungsvertrag", "Nachweis über eine Unterkunft in Deutschland"],
    hoTro: ["Übersetzung des Vertrags", "Erläuterung jeder Klausel", "Aufbewahrung einer Kopie für Sie"],
    ketQua: ["Rechtsgültiger Vertrag", "Grundlage für den Visumantrag"],
  },
  "07": {
    ten: "Visumantrag",
    thoiGian: "6–12 Wochen",
    mo: "Antrag bei der deutschen Auslandsvertretung stellen und bis zur Entscheidung begleiten.",
    viec: ["Termin zur Antragstellung buchen", "Antrag einreichen und Fingerabdrücke abgeben", "Bearbeitungsstand verfolgen"],
    giay: ["Visumantragsformular", "Vertrag", "Krankenversicherungsnachweis", "Original-Reisepass"],
    hoTro: ["Prüfung des Antrags vor der Abgabe", "Vorbereitung auf den Termin", "Nachreichung von Unterlagen auf Anforderung der Botschaft"],
    ketQua: ["Visum erteilt", "Angaben im Visum geprüft"],
  },
  "08": {
    ten: "Flug nach Deutschland",
    thoiGian: "1–2 Wochen",
    mo: "Flugbuchung, Gepäck und Hinweise zu den Einreiseformalitäten.",
    viec: ["Flug buchen", "Gepäck nach Anleitung packen", "Einreisebestimmungen der EU kennen"],
    giay: ["Reisepass mit Visum", "Ausgedruckter Vertrag", "Adresse der Unterkunft und Telefonnummer der Abholperson"],
    hoTro: ["Hinweise zu Gepäck und Zoll", "Abholung am Flughafen"],
    ketQua: ["Reibungslose Einreise", "Sichere Ankunft in der Unterkunft"],
  },
  "09": {
    ten: "Onboarding in Deutschland",
    thoiGian: "Laufend in den ersten 3 Monaten",
    mo: "Anmeldung, Versicherung, Bankkonto und Eingewöhnung am Arbeitsplatz.",
    viec: ["Anmeldung beim Bürgeramt", "Anmeldung bei der Krankenkasse", "Bankkonto eröffnen", "Einarbeitung im Betrieb"],
    giay: ["Wohnungsgeberbestätigung", "Versichertenkarte", "Steuer-Identifikationsnummer"],
    hoTro: ["Begleitung zu Behördenterminen", "Dolmetschen bei Bedarf", "Betreuung in den ersten drei Monaten am Arbeitsplatz"],
    ketQua: ["Meldeformalitäten erledigt", "Gut angekommen in Beruf und Alltag"],
  },
};

const BAN: BanDichTheoNgonNgu<ChangBanDich> = { en: EN, de: DE };

const BAT_BUOC = ["ten", "thoiGian", "mo", "viec", "giay", "hoTro", "ketQua"] as const;

type ChangCoId = Chang & { id: string };
const GOC: ChangCoId[] = CHANG.map((c) => ({ ...c, id: c.so }));

/** Chỗ thiếu của cả en lẫn de — đăng ký trong data/i18n/kiem.ts */
export function choThieuLoTrinh(): string[] {
  return (["en", "de"] as const).flatMap((lang) =>
    timChoThieu<ChangCoId, ChangBanDich>(`journey.${lang}`, GOC, BAN[lang], BAT_BUOC, {
      viec: (c) => c.viec,
      giay: (c) => c.giay,
      hoTro: (c) => c.hoTro,
      ketQua: (c) => c.ketQua,
    })
  );
}

let daKiem = false;

/** 9 chặng theo ngôn ngữ. vi → bản gốc; en/de thiếu bản dịch → NÉM LỖI. */
export function getChang(lang: Lang): Chang[] {
  if (lang === "vi") return CHANG;
  if (!daKiem) {
    daKiem = true;
    batBuocDu(choThieuLoTrinh());
  }
  return CHANG.flatMap((c) => {
    const b = BAN[lang][c.so];
    if (!b) return []; // chỉ khi bật NB_I18N_AN_MUC_THIEU
    return [{ ...c, ...b }];
  });
}
