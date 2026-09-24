/**
 * Thêm nhánh `de` vào name/roles/about/tasks của từng ngành.
 * Nội dung tiếng Đức viết cho doanh nghiệp và cơ quan Đức đọc, không phải
 * bản dịch của bản tiếng Việt.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/industries.ts";
let s = readFileSync(FILE, "utf8");

const DE = {
  "kitchen-gastronomy": {
    name: "Gastronomie & Küche",
    roles: ["Köche", "Küchenhilfen", "Servicekräfte"],
    about:
      "Arbeit in Restaurant- und Hotelküchen: Mise en place, Zubereitung nach standardisierten Rezepturen und konsequente Einhaltung der Hygienevorgaben. Der Takt ist hoch, die Schichten sind klar geregelt und jede Stunde wird vergütet.",
    tasks: [
      "Mise en place und Vorbereitung der Servicezeiten",
      "Zubereitung nach standardisierten Rezepturen",
      "Einhaltung der HACCP- und Hygienevorgaben",
      "Warenannahme und Kontrolle der Lagerhaltung",
      "Zusammenarbeit mit Küchenleitung und Service",
    ],
  },
  bakery: {
    name: "Bäckerei",
    roles: ["Bäcker", "Konditoren", "Fachverkäufer"],
    about:
      "Der Tag beginnt früh, oft gegen drei Uhr. Teige herstellen, aufarbeiten, Ofen führen und Brot und Brötchen ausbacken. Handwerk mit klaren Abläufen — gut ausgebildete Bäckerinnen und Bäcker werden bundesweit gesucht.",
    tasks: [
      "Herstellung von Teigen und Vorteigen",
      "Aufarbeiten und Formen von Brot und Brötchen",
      "Steuerung von Gär- und Backprozessen",
      "Qualitätskontrolle der Backwaren",
      "Reinigung und Einhaltung der Hygienestandards",
    ],
  },
  "meat-processing": {
    name: "Fleischerei & Lebensmittelverarbeitung",
    roles: ["Metzger", "Produktionshelfer", "Fachverkäufer"],
    about:
      "Arbeit im gekühlten, sauberen Verarbeitungsbetrieb mit vollständiger Schutzkleidung. Zerlegen, Verarbeiten und Verpacken unter strengen Hygienevorgaben — ein stabiles Berufsfeld mit hohem Personalbedarf.",
    tasks: [
      "Zerlegen und Zuschneiden nach Vorgabe",
      "Herstellung von Fleisch- und Wurstwaren",
      "Verpackung und Kennzeichnung der Produkte",
      "Temperaturkontrolle und Dokumentation",
      "Reinigung und Einhaltung der HACCP-Vorgaben",
    ],
  },
  electrical: {
    name: "Elektrotechnik & Gebäudetechnik",
    roles: ["Elektriker", "Mechatroniker", "Anlagenmonteure"],
    about:
      "Installation, Inbetriebnahme und Prüfung elektrotechnischer Anlagen in Wohn-, Gewerbe- und Industriegebäuden. Technischer Beruf: technische Zeichnungen lesen und die einschlägigen Sicherheitsregeln konsequent anwenden.",
    tasks: [
      "Installation von Leitungen, Verteilern und Endgeräten",
      "Lesen und Umsetzen technischer Zeichnungen",
      "Messen, Prüfen und Dokumentieren von Anlagen",
      "Fehlersuche und Instandsetzung",
      "Einhaltung der einschlägigen Sicherheitsregeln",
    ],
  },
  logistics: {
    name: "Logistik & Lagerwirtschaft",
    roles: ["Fachlageristen", "Staplerfahrer", "Logistikhelfer"],
    about:
      "Wareneingang, Kommissionierung, Etikettierung und Versandvorbereitung — mit Handscanner und Lagerverwaltungssystem. Klare Prozesse und Schichtbetrieb; der Einstieg gelingt schneller als in den technischen Berufen.",
    tasks: [
      "Wareneingang und Kontrolle der Lieferungen",
      "Kommissionierung nach Pickliste",
      "Verpackung, Etikettierung und Versandvorbereitung",
      "Bestandsführung im Lagerverwaltungssystem",
      "Einhaltung der Arbeitssicherheit im Lagerbereich",
    ],
  },
  horticulture: {
    name: "Gartenbau & Gewächshaus",
    roles: ["Gewächshausmitarbeiter", "Gärtner", "Instandhaltungstechniker"],
    about:
      "Anbau und Ernte von Gemüse in modernen Gewächshäusern sowie Betrieb der dazugehörigen Technik. Die Arbeit folgt der Vegetationsperiode, ist stark technisiert, und für viele Stellen ist keine Vorerfahrung nötig.",
    tasks: [
      "Pflanzen, Pflegen und Bewässern der Kulturen",
      "Ernten und Sortieren nach Qualitätsvorgaben",
      "Verpacken und Versandvorbereitung",
      "Bedienung und Kontrolle der Gewächshaustechnik",
      "Arbeiten nach Produktionsplan und Sicherheitsvorgaben",
    ],
  },
  "academic-professionals": {
    name: "Akademische Fachkräfte",
    roles: [],
    about: "",
    tasks: [],
  },
  production: {
    name: "Produktion & Anlagen",
    roles: ["Maschinenbediener", "Anlagenführer", "Produktionshelfer"],
    about:
      "Bedienen und Überwachen von Produktionsanlagen, Prüfen der Prozessparameter, Beheben von Störungen und Kontrolle der Produktqualität. Schichtbetrieb in sauberer, stark automatisierter Umgebung.",
    tasks: [
      "Bedienen und Überwachen von Produktionsanlagen",
      "Umrüsten der Maschinen bei Produktwechsel",
      "Prüfen von Prozessparametern und Produktqualität",
      "Störungserkennung und einfache Instandhaltung",
      "Dokumentation im Schichtprotokoll",
    ],
  },
};

const j = (v) => JSON.stringify(v);
let n = 0;

for (const [slug, d] of Object.entries(DE)) {
  // Tìm đúng khối của ngành này
  const start = s.indexOf(`slug: "${slug}",`);
  if (start === -1) {
    console.log("KHONG THAY " + slug);
    continue;
  }
  const end = s.indexOf("\n  },\n", start);
  let block = s.slice(start, end);
  if (block.includes("de:")) continue;

  block = block
    .replace(/name: \{ en:/, `name: { de: ${j(d.name)}, en:`)
    .replace(/roles: \{\s*\n?\s*en:/, `roles: {\n      de: ${j(d.roles)},\n      en:`)
    .replace(/roles: \{ en: \[\], vi: \[\] \}/, `roles: { de: [], en: [], vi: [] }`)
    .replace(/about: \{\s*\n?\s*en:/, `about: {\n      de: ${j(d.about)},\n      en:`)
    .replace(/about: \{ en: "", vi: "" \}/, `about: { de: "", en: "", vi: "" }`)
    .replace(/tasks: \{\s*\n?\s*en:/, `tasks: {\n      de: ${j(d.tasks)},\n      en:`)
    .replace(/tasks: \{ en: \[\], vi: \[\] \}/, `tasks: { de: [], en: [], vi: [] }`);

  s = s.slice(0, start) + block + s.slice(end);
  n++;
}

writeFileSync(FILE, s, "utf8");
console.log("Da them tieng Duc cho " + n + " nganh");
