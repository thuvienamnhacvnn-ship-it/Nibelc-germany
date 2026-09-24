import { assetsFor, type IndustryAssetSet } from "@/content/industry-assets";

/**
 * Registry tám nhóm ngành.
 *
 * Slug lấy đúng theo DESIGN LOCK (`/branchen/<slug>`), không đổi tên.
 * Ảnh KHÔNG khai ở đây — UI đọc qua `industry-assets.ts` để giữ một nguồn ảnh
 * duy nhất theo ASSET LOCK.
 *
 * Hai nhóm đọc, hai nội dung khác nhau:
 *   `de`  — cho doanh nghiệp Đức, nói về năng lực cung ứng
 *   `vi`  — cho người lao động Việt, nói về công việc thực tế
 * Không phải bản dịch của nhau.
 */

export type IndustryStatus = "active" | "blocked";

export interface Industry {
  slug: string;
  order: number;
  status: IndustryStatus;
  /** Mã [CẦN ĐIỀN] đang khoá ngành này */
  blockedBy?: "02";

  /** Tên nghề chính thức tại Đức — không dịch sang ngôn ngữ nào */
  berufDe: string;
  /** Khoá icon tròn trên thẻ ngành (screens/04) */
  icon: IndustryIcon;

  nameDe: string;
  nameVi: string;
  nameEn: string;
  /** Các vị trí cụ thể, in dưới tên ngành trên thẻ (screens/04) */
  rollenDe: string[];
  rollenEn: string[];
  rollenVi: string[];
  /** Một câu năng lực cung ứng, cho doanh nghiệp Đức */
  employerDe: string;
  /** Mô tả công việc thật, viết riêng cho người lao động */
  candidateVi: string;
  /** Nhiệm vụ nghề, tiếng Đức (screens/05 khối "Tätigkeiten") */
  taetigkeiten: string[];

  /** Alt text do content quản lý, KHÔNG sinh từ tên file */
  alt: { hero: string; portraitWork: string; portraitTeam: string; detail: string };
}

export type IndustryIcon =
  | "utensils"
  | "bread"
  | "meat"
  | "bolt"
  | "box"
  | "leaf"
  | "cap"
  | "gear";

export const INDUSTRIES: Industry[] = [
  {
    slug: "gastronomie-koch",
    order: 1,
    status: "active",
    berufDe: "Koch / Köchin",
    icon: "utensils",
    nameDe: "Gastronomie & Küche",
    nameVi: "Nhà hàng & Bếp",
    nameEn: "Kitchen & Gastronomy",
    rollenDe: ["Köche", "Küchenhilfen", "Servicekräfte"],
    rollenEn: ["Cooks","Kitchen assistants","Service staff"],
    rollenVi: ["Đầu bếp","Phụ bếp","Phục vụ"],
    employerDe:
      "Ausgebildete Köchinnen und Köche für Restaurant- und Hotelküchen, vorbereitet auf deutsche Küchenstandards und Hygienevorschriften.",
    candidateVi:
      "Bạn làm trong bếp nhà hàng hoặc bếp khách sạn tại Đức: sơ chế, nấu theo định lượng, giữ vệ sinh theo quy trình. Nhịp bếp Đức nhanh và có kỷ luật, nhưng ca làm rõ ràng và được tính đủ giờ.",
    taetigkeiten: [
      "Mise en place und Vorbereitung der Servicezeiten",
      "Zubereitung nach standardisierten Rezepturen",
      "Einhaltung der HACCP- und Hygienevorgaben",
      "Warenannahme und Kontrolle der Lagerhaltung",
      "Zusammenarbeit mit Küchenleitung und Service",
    ],
    alt: {
      hero: "Koch in einer deutschen Restaurantküche bei der Vorbereitung am Pass",
      portraitWork: "Nachwuchskraft beim Anrichten eines Tellers in der Küche",
      portraitTeam: "Küchenteam bespricht den Ablauf vor dem Abendservice",
      detail: "Nahaufnahme sicherer Schnitttechnik am Vorbereitungstisch",
    },
  },
  {
    slug: "baeckerei-baecker",
    order: 2,
    status: "active",
    berufDe: "Bäcker / Bäckerin",
    icon: "bread",
    nameDe: "Bäckerei",
    nameVi: "Làm bánh",
    nameEn: "Bakery",
    rollenDe: ["Bäcker", "Konditoren", "Fachverkäufer"],
    rollenEn: ["Bakers","Pastry chefs","Sales staff"],
    rollenVi: ["Thợ bánh mì","Thợ bánh ngọt","Nhân viên bán hàng"],
    employerDe:
      "Fachkräfte für die Backstube: Teigherstellung, Ofenführung und Produktionsabläufe im Früh- und Schichtdienst.",
    candidateVi:
      "Công việc bắt đầu từ sớm, thường 3–4 giờ sáng. Bạn nhào bột, tạo hình, canh lò và ra khay bánh mì kiểu Đức. Nghề đòi tay nghề và sự đều đặn, đổi lại thợ giỏi rất được trọng dụng ở Đức.",
    taetigkeiten: [
      "Herstellung von Teigen und Vorteigen",
      "Aufarbeiten und Formen von Brot und Brötchen",
      "Steuerung von Gär- und Backprozessen",
      "Qualitätskontrolle der Backwaren",
      "Reinigung und Einhaltung der Hygienestandards",
    ],
    alt: {
      hero: "Bäckerei-Backstube mit Industrieofen und frischen Backwaren",
      portraitWork: "Bäcker formt Teiglinge an der Aufarbeitungstheke",
      portraitTeam: "Bäckermeister und Nachwuchskraft prüfen die Backwaren",
      detail: "Nahaufnahme des Einschneidens eines Brotlaibs vor dem Backen",
    },
  },
  {
    slug: "fleischerei-fleischer",
    order: 3,
    status: "active",
    berufDe: "Fleischer / Fleischerin",
    icon: "meat",
    nameDe: "Fleischerei",
    nameVi: "Chế biến thịt",
    nameEn: "Butchery",
    rollenDe: ["Metzger", "Produktionshelfer", "Fachverkäufer"],
    rollenEn: ["Butchers","Production helpers","Sales staff"],
    rollenVi: ["Thợ chế biến thịt","Phụ sản xuất","Nhân viên bán hàng"],
    employerDe:
      "Fachkräfte für Zerlegung, Verarbeitung und Verpackung in lebensmittelverarbeitenden Betrieben mit hohen Hygieneanforderungen.",
    candidateVi:
      "Bạn làm trong xưởng chế biến sạch, nhiệt độ mát, mặc đồ bảo hộ đầy đủ. Công việc gồm pha lóc, chế biến và đóng gói theo quy trình vệ sinh nghiêm ngặt. Nghề ổn định, nhiều xưởng ở Đức đang thiếu người.",
    taetigkeiten: [
      "Zerlegen und Zuschneiden nach Vorgabe",
      "Herstellung von Fleisch- und Wurstwaren",
      "Verpackung und Kennzeichnung der Produkte",
      "Temperaturkontrolle und Dokumentation",
      "Reinigung und Einhaltung der HACCP-Vorgaben",
    ],
    alt: {
      hero: "Moderner Verarbeitungsbetrieb mit Edelstahlflächen und Schutzkleidung",
      portraitWork: "Fachkraft bei der Verpackung von Produkten im Kühlbereich",
      portraitTeam: "Meister und Mitarbeiter bei der gemeinsamen Qualitätsprüfung",
      detail: "Nahaufnahme der Qualitätskontrolle an der Verpackungslinie",
    },
  },
  {
    slug: "elektrotechnik-elektroniker",
    order: 4,
    status: "active",
    berufDe: "Elektroniker / Elektronikerin für Energie- und Gebäudetechnik",
    icon: "bolt",
    nameDe: "Elektrotechnik",
    nameVi: "Điện & kỹ thuật toà nhà",
    nameEn: "Electrical Engineering",
    rollenDe: ["Elektriker", "Mechatroniker", "Anlagenmonteure"],
    rollenEn: ["Electricians","Mechatronics technicians","Installers"],
    rollenVi: ["Thợ điện","Kỹ thuật viên cơ điện tử","Thợ lắp đặt"],
    employerDe:
      "Elektrofachkräfte für Installation, Inbetriebnahme und Prüfung in Gebäude- und Energietechnik.",
    candidateVi:
      "Bạn lắp đặt và đấu nối hệ thống điện trong toà nhà, đo kiểm và bàn giao. Đây là nghề kỹ thuật, cần đọc được bản vẽ và tuân thủ quy tắc an toàn điện của Đức. Thu nhập và cơ hội nâng bậc tốt hơn mặt bằng chung.",
    taetigkeiten: [
      "Installation von Leitungen, Verteilern und Endgeräten",
      "Lesen und Umsetzen technischer Zeichnungen",
      "Messen, Prüfen und Dokumentieren von Anlagen",
      "Fehlersuche und Instandsetzung",
      "Einhaltung der einschlägigen Sicherheitsregeln",
    ],
    alt: {
      hero: "Elektroniker arbeitet an einer Schaltanlage in einem modernen Gebäude",
      portraitWork: "Techniker prüft Messwerte an der Verteilung",
      portraitTeam: "Vorarbeiter und Techniker besprechen den Schaltplan",
      detail: "Nahaufnahme einer Messung an der freigeschalteten Anlage",
    },
  },
  {
    slug: "logistik-fachkraft-lagerlogistik",
    order: 5,
    status: "active",
    berufDe: "Fachkraft für Lagerlogistik",
    icon: "box",
    nameDe: "Logistik",
    nameVi: "Logistics & kho vận",
    nameEn: "Logistics",
    rollenDe: ["Fachlageristen", "Staplerfahrer", "Logistikhelfer"],
    rollenEn: ["Warehouse specialists","Forklift drivers","Logistics helpers"],
    rollenVi: ["Nhân viên kho","Lái xe nâng","Phụ kho"],
    employerDe:
      "Fachkräfte für Wareneingang, Kommissionierung und Versand in Lager- und Distributionszentren.",
    candidateVi:
      "Bạn nhận hàng, soạn hàng theo đơn, dán nhãn và chuẩn bị xuất kho, làm việc với máy quét mã vạch và hệ thống quản lý kho. Công việc theo ca, quy trình rõ ràng, dễ vào nghề hơn các ngành kỹ thuật.",
    taetigkeiten: [
      "Wareneingang und Kontrolle der Lieferungen",
      "Kommissionierung nach Pickliste",
      "Verpackung, Etikettierung und Versandvorbereitung",
      "Bestandsführung im Lagerverwaltungssystem",
      "Einhaltung der Arbeitssicherheit im Lagerbereich",
    ],
    alt: {
      hero: "Modernes Logistikzentrum mit Hochregallager und Kommissionierung",
      portraitWork: "Mitarbeiter scannt Ware am Kommissionierplatz",
      portraitTeam: "Teamleiter und Mitarbeiter gleichen die Pickliste ab",
      detail: "Nahaufnahme des Barcode-Scans an einem Versandkarton",
    },
  },
  {
    slug: "gartenbau-gaertner",
    order: 6,
    status: "active",
    berufDe: "Gärtner / Gärtnerin",
    icon: "leaf",
    nameDe: "Garten- und Landschaftsbau",
    nameVi: "Trồng trọt & cảnh quan",
    nameEn: "Gardening & Landscaping",
    rollenDe: ["Gärtner", "Landschaftsbauer", "Helfer"],
    rollenEn: ["Gardeners","Landscapers","Helpers"],
    rollenVi: ["Thợ làm vườn","Thợ cảnh quan","Phụ việc"],
    employerDe:
      "Fachkräfte für Anlage und Pflege von Grünflächen sowie für Anbau und Ernte im Gewächshaus.",
    candidateVi:
      "Bạn trồng và chăm cây ngoài trời hoặc trong nhà kính, thu hoạch và đóng gói theo tiêu chuẩn. Công việc theo mùa vụ, phần lớn vị trí không yêu cầu kinh nghiệm trước đó.",
    taetigkeiten: [
      "Anlegen von Grünflächen und Pflanzungen",
      "Pflanzen, Pflegen und Bewässern der Kulturen",
      "Ernten und Sortieren nach Qualitätsvorgaben",
      "Bedienung und Wartung von Geräten",
      "Arbeiten nach Ausführungsplan und Sicherheitsvorgaben",
    ],
    alt: {
      hero: "Landschaftsgärtner bei der Gestaltung einer städtischen Grünfläche",
      portraitWork: "Fachkraft setzt Pflanzen in einem angelegten Beet",
      portraitTeam: "Zwei Kollegen stimmen den Ausführungsplan ab",
      detail: "Nahaufnahme von Pflanzarbeiten mit passender Schutzausrüstung",
    },
  },
  {
    slug: "akademische-fachkraefte",
    order: 7,
    // Không publish cho tới khi [CẦN ĐIỀN 02] được duyệt.
    status: "blocked",
    blockedBy: "02",
    // Cố ý để trống: chưa chốt là IT, kỹ thuật, điều dưỡng hay kinh tế thì
    // mọi tên nghề và mô tả đều là bịa.
    berufDe: "",
    icon: "cap",
    nameDe: "Akademische Fachkräfte",
    nameVi: "Chuyên gia trình độ đại học",
    nameEn: "University Graduates",
    rollenDe: [],
    rollenEn: [],
    rollenVi: [],
    employerDe: "",
    candidateVi: "",
    taetigkeiten: [],
    alt: {
      hero: "Vorbereitung und Prüfung von Bewerbungsunterlagen akademischer Fachkräfte",
      portraitWork: "Bewerberin stellt Qualifikationsnachweise zusammen",
      portraitTeam: "Beratungsgespräch zur Anerkennung akademischer Abschlüsse",
      detail: "Nahaufnahme der Dokumentenprüfung am Arbeitsplatz",
    },
  },
  {
    slug: "produktion-maschinen-anlagen",
    order: 8,
    status: "active",
    berufDe: "Maschinen- und Anlagenführer / Maschinen- und Anlagenführerin",
    icon: "gear",
    nameDe: "Produktion & Anlagen",
    nameVi: "Sản xuất & vận hành máy",
    nameEn: "Production & Plants",
    rollenDe: ["Maschinenbediener", "Anlagenführer", "Produktionshelfer"],
    rollenEn: ["Machine operators","Plant operators","Production helpers"],
    rollenVi: ["Thợ đứng máy","Vận hành dây chuyền","Phụ sản xuất"],
    employerDe:
      "Fachkräfte für Bedienung, Überwachung und Umrüstung von Produktionsanlagen im Schichtbetrieb.",
    candidateVi:
      "Bạn vận hành và theo dõi dây chuyền sản xuất, kiểm tra thông số, xử lý khi máy dừng và kiểm soát chất lượng đầu ra. Làm theo ca, môi trường sạch và nhiều tự động hoá.",
    taetigkeiten: [
      "Bedienen und Überwachen von Produktionsanlagen",
      "Umrüsten der Maschinen bei Produktwechsel",
      "Prüfen von Prozessparametern und Produktqualität",
      "Störungserkennung und einfache Instandhaltung",
      "Dokumentation im Schichtprotokoll",
    ],
    alt: {
      hero: "Moderne Produktionslinie mit geschützten Maschinen und Kontrollmonitoren",
      portraitWork: "Anlagenführer prüft Parameter am Bedienterminal",
      portraitTeam: "Schichtleiter und Anlagenführer stimmen den Produktwechsel ab",
      detail: "Nahaufnahme der Qualitätskontrolle an der Produktionslinie",
    },
  },
];

export function activeIndustries(): Industry[] {
  return INDUSTRIES.filter((i) => i.status === "active").sort(
    (a, b) => a.order - b.order,
  );
}

export function allIndustries(): Industry[] {
  return [...INDUSTRIES].sort((a, b) => a.order - b.order);
}

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function isIndexable(i: Industry): boolean {
  return i.status === "active";
}

/** Bốn slot ảnh của ngành, lấy từ registry ảnh đã duyệt. */
export function industryAssets(i: Industry): IndustryAssetSet {
  const a = assetsFor(i.slug);
  if (!a) throw new Error(`Thiếu ảnh KIT cho ngành ${i.slug}`);
  return a;
}

/** Tên ngành theo ngôn ngữ giao diện */
export function industryName(i: Industry, locale: "de" | "en" | "vi"): string {
  return locale === "de" ? i.nameDe : locale === "en" ? i.nameEn : i.nameVi;
}

/** Danh sách vị trí theo ngôn ngữ giao diện */
export function industryRoles(i: Industry, locale: "de" | "en" | "vi"): string[] {
  return locale === "de" ? i.rollenDe : locale === "en" ? i.rollenEn : i.rollenVi;
}
