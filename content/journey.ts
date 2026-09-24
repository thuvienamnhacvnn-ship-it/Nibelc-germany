/**
 * Nội dung dùng chung cho quy trình, lấy từ screens/05 và screens/02.
 *
 * Đây là mô tả DỊCH VỤ và CÁC BƯỚC THỦ TỤC — không phải lời hứa kết quả.
 * Cách diễn đạt cố ý tránh mọi khẳng định về việc visa sẽ được cấp hay bằng
 * cấp sẽ được công nhận.
 */

export interface Step {
  title: string;
  text: string;
}

/** "Vorbereitung" — NIBELC chuẩn bị gì cho ứng viên (screens/05, cột 2) */
export const VORBEREITUNG: Step[] = [
  {
    title: "Deutschsprachtraining",
    text: "Sprachkurse mit klaren Lernzielen und regelmäßiger Standortbestimmung.",
  },
  {
    title: "Fachliche Vorbereitung",
    text: "Einführung in Arbeitsweise, Werkzeuge und Standards deutscher Betriebe.",
  },
  {
    title: "Anerkennungs- und Visumverfahren",
    text: "Begleitung bei Unterlagen und Fristen der zuständigen Stellen.",
  },
  {
    title: "Kulturelle und berufliche Orientierung",
    text: "Vorbereitung auf Arbeitsalltag, Kommunikation und Erwartungen im Team.",
  },
  {
    title: "Unterstützung bei Ankunft",
    text: "Begleitung bei den ersten Schritten nach der Einreise.",
  },
];

/** "Ihr Weg nach Deutschland" — sáu chặng (screens/05, khối phải dưới) */
export const WEG_NACH_DEUTSCHLAND: Step[] = [
  { title: "Bewerbung & Auswahl", text: "Profil, Motivation und Eignung." },
  { title: "Sprachvorbereitung", text: "Strukturierter Sprachaufbau." },
  { title: "Fachliche Qualifizierung", text: "Vorbereitung auf den Beruf." },
  { title: "Anerkennung & Visum", text: "Verfahren mit den Behörden." },
  { title: "Anreise & Onboarding", text: "Ankunft und erste Wochen." },
  { title: "Langfristige Integration", text: "Begleitung im Betrieb." },
];

/** Sáu bước phía doanh nghiệp (screens/02) */
export const UNTERNEHMEN_SCHRITTE: Step[] = [
  {
    title: "Bedarf klären",
    text: "Anforderungsprofil und Rahmenbedingungen.",
  },
  { title: "Kandidaten finden", text: "Gezielte Vorauswahl in Vietnam." },
  { title: "Prüfen & Kennenlernen", text: "Interviews und fachliche Tests." },
  {
    title: "Visum & Anerkennung",
    text: "Wir begleiten die Verfahrensschritte.",
  },
  {
    title: "Anreise & Integration",
    text: "Onboarding und Begleitung vor Ort.",
  },
  {
    title: "Langfristige Betreuung",
    text: "Für eine nachhaltige Zusammenarbeit.",
  },
];

/** Dịch vụ cho doanh nghiệp (screens/02, khối "Unsere Services") */
export const SERVICES: Step[] = [
  {
    title: "Rekrutierung & Vorauswahl",
    text: "Passgenaue Kandidaten statt Streuverlust.",
  },
  {
    title: "Behördenmanagement",
    text: "Wir übernehmen die Abstimmung komplexer Verfahren.",
  },
  {
    title: "Ankunft & Integration",
    text: "Unterstützung bei Wohnung, Behörden und Onboarding.",
  },
  {
    title: "Langfristige Betreuung",
    text: "Damit aus Fachkräften echte Teammitglieder werden.",
  },
];

/**
 * "Rechtssicher. Transparent." (screens/02, khối bên phải).
 *
 * Mỗi dòng mô tả một việc NIBELC LÀM trong quy trình, không phải một lời
 * bảo đảm kết quả — khác nhau ở chỗ đó.
 */
export const COMPLIANCE_PUNKTE: string[] = [
  "Begleitung bei der Anerkennung von Abschlüssen",
  "Begleitung im Visum- und Aufenthaltsverfahren",
  "Einhaltung deutscher Arbeits- und Sozialstandards",
  "Faire und ethische Rekrutierung",
  "Langfristige Integration und Support",
];
