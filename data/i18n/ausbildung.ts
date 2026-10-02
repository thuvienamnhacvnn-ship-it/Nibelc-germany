import { NGANH_HOC, type NganhHoc } from "@/data/ausbildung";
import type { Lang } from "@/lib/i18n/config";
import { batBuocDu, timChoThieu, type BanDichTheoNgonNgu } from "@/lib/i18n/du-lieu";

/**
 * BẢN DỊCH 8 NGÀNH DU HỌC NGHỀ (NGANH_HOC trong data/ausbildung.ts), khoá theo `id`.
 *
 * - Số liệu (troCap, sauNghe) KHÔNG dịch — lấy nguyên từ bản gốc, hiển thị qua
 *   lib/i18n/format.ts theo locale.
 * - `tenDuc` (tên nghề theo hệ thống Đức) chỉ ghi khi muốn khác bản gốc — ở đây
 *   ghi dạng kép giới tính (/in, /-frau) theo luật AGG.
 * - `tieng`: giữ dấu phẩy sau trình độ đầu ("B1, …") — trang chi tiết lấy phần
 *   trước dấu phẩy làm nhãn ngắn.
 * - Không nêu tuổi / giới tính, không nêu phí.
 */
export interface NganhHocBanDich {
  ten: string;
  nam: string;
  tieng: string;
  tomTat: string;
  hocGi: string[];
  lamGi: string[];
  hopVoi: string[];
  trienVong: string;
  tenDuc?: string;
}

const EN: Record<string, NganhHocBanDich> = {
  "dieu-duong": {
    ten: "Nursing",
    nam: "3 years",
    tieng: "B1, B2 in some federal states",
    tomTat:
      "The occupation with the greatest staff shortage in Germany. A German nursing qualification is recognised throughout the EU and is the shortest route to long-term residence.",
    hocGi: [
      "Caring for patients and older people",
      "Fundamentals of medicine, pharmacology and hygiene",
      "Communicating with patients and their relatives",
      "Keeping care records to German standards",
    ],
    lamGi: ["Hospitals and specialist clinics", "Residential care homes (Pflegeheim)", "Home care services (ambulante Pflege)"],
    hopVoi: ["Patient and comfortable with shift work", "Enjoy caring for others", "Good at learning languages"],
    trienVong:
      "After qualifying you can specialise further (anaesthesia, intensive care, nursing management) or go on to a degree in nursing.",
  },
  "nha-hang-khach-san": {
    ten: "Hospitality and catering",
    tenDuc: "Koch/Köchin · Hotelfachmann/-frau · Restaurantfachmann/-frau",
    nam: "3 years",
    tieng: "B1",
    tomTat:
      "The easiest field for Vietnamese applicants to enter: good kitchen skills are valued, the environment is international and many large hotels take on international trainees.",
    hocGi: [
      "European cuisine, cold and hot kitchen techniques",
      "Food hygiene and safety (HACCP)",
      "Table service, reception and reservations",
      "Costing and stock management",
    ],
    lamGi: ["3- to 5-star hotels", "Restaurants, eateries and chains", "Banqueting and events departments"],
    hopVoi: ["Quick and able to cope with peak-time pressure", "Enjoy cooking and dealing with people"],
    trienVong: "Progress to sous chef or head chef, or take the Meister qualification and open your own restaurant in Germany.",
  },
  "co-khi": {
    ten: "Mechanical engineering and mechatronics",
    tenDuc: "Industriemechaniker/in · Mechatroniker/in",
    nam: "3.5 years",
    tieng: "B1, B2 preferred",
    tomTat:
      "The backbone of German industry. High starting pay, stable contracts, and many large companies hire trainees directly once they qualify.",
    hocGi: [
      "Reading technical drawings and tolerances",
      "Machining: turning, milling, welding",
      "Installing and maintaining production machinery",
      "Pneumatic, hydraulic and PLC control systems",
    ],
    lamGi: ["Mechanical engineering, automotive and equipment plants", "Production line maintenance", "Machine installation companies"],
    hopVoi: ["Good with your hands, technically minded", "Strong in maths and physics"],
    trienVong: "Continue to Techniker or Meister level, or study engineering at a university of applied sciences.",
  },
  dien: {
    ten: "Electrical and automation technology",
    tenDuc: "Elektroniker/in für Betriebstechnik",
    nam: "3.5 years",
    tieng: "B1, B2 preferred",
    tomTat:
      "Well paid and always in demand: building installations, industrial plants and renewable energy all need qualified electricians.",
    hocGi: [
      "Electrical basics, measurement and electrical safety",
      "Building control cabinets and control systems",
      "PLC programming, sensors and drives",
      "Maintaining automated systems",
    ],
    lamGi: ["Manufacturing plants", "Electrical installation companies", "Solar, wind power and EV charging"],
    hopVoi: ["Careful and safety-conscious", "Interested in electronics and programming"],
    trienVong: "Become an electrical Meister and run your own business, or specialise in industrial automation.",
  },
  "xay-dung": {
    ten: "Construction and building services",
    tenDuc: "Anlagenmechaniker/in SHK · Bauberufe",
    nam: "3–3.5 years",
    tieng: "B1",
    tomTat:
      "Germany has a severe shortage of plumbing, heating and air-conditioning installers. The longer you work in the trade, the more your skills are worth.",
    hocGi: [
      "Water supply and drainage systems",
      "Heating, heat pumps, air conditioning and ventilation",
      "Pipe welding and installing sanitary fittings",
      "Reading construction drawings",
    ],
    lamGi: ["Building services installation companies", "Construction firms", "Maintenance services"],
    hopVoi: ["Physically fit, happy working on building sites", "Enjoy assembling and repairing things"],
    trienVong: "Meister in plumbing, heating and air conditioning (SHK) — one of the best-paid trade qualifications in Germany.",
  },
  logistics: {
    ten: "Warehousing and logistics",
    nam: "3 years",
    tieng: "B1",
    tomTat:
      "Germany is Europe's logistics hub. Warehousing is quick to learn and quick to start, with early chances of becoming a team leader.",
    hocGi: [
      "Goods-in, dispatch and stocktaking procedures",
      "Warehouse management software and barcodes",
      "Safe loading and unloading, forklift operation",
      "Shipping documents",
    ],
    lamGi: ["Distribution centres", "Factory warehouses", "Freight forwarding and courier companies"],
    hopVoi: ["Quick and well organised", "Like work with clear procedures"],
    trienVong: "Progress to shift leader or warehouse manager, or go on to the Logistikmeister qualification.",
  },
  "thuc-pham": {
    ten: "Food production and baking",
    tenDuc: "Fachkraft für Lebensmitteltechnik · Bäcker/in",
    nam: "3 years",
    tieng: "B1",
    tomTat:
      "A production sector that runs steadily all year round, independent of the seasons, with many factories taking on international trainees.",
    hocGi: [
      "Production and packaging processes",
      "Quality control and HACCP hygiene",
      "Operating food processing machinery",
      "German baking techniques",
    ],
    lamGi: ["Food factories", "Industrial and craft bakeries", "Meat and dairy processing plants"],
    hopVoi: ["Comfortable with early shifts", "Careful and hygiene-conscious"],
    trienVong: "Move up to production line supervisor, or take the master baker (Meister) qualification.",
  },
  cntt: {
    ten: "Information technology",
    tenDuc: "Fachinformatiker/in",
    nam: "3 years",
    tieng: "B2",
    tomTat:
      "Higher language requirements, but in return the best pay among the vocational training routes and an office-based working environment.",
    hocGi: [
      "Application development or system administration",
      "Databases and computer networks",
      "Information security",
      "User support",
    ],
    lamGi: ["Software companies", "Corporate IT departments", "IT infrastructure service providers"],
    hopVoi: ["Good German", "Logical thinking, quick to teach yourself"],
    trienVong: "Move on to software developer or system administrator roles, or study at a university of applied sciences.",
  },
};

const DE: Record<string, NganhHocBanDich> = {
  "dieu-duong": {
    ten: "Pflege",
    nam: "3 Jahre",
    tieng: "B1, in einigen Bundesländern B2",
    tomTat:
      "Der Beruf mit dem größten Fachkräftemangel in Deutschland. Der deutsche Pflegeabschluss ist in der gesamten EU anerkannt und der kürzeste Weg zu einem dauerhaften Aufenthalt.",
    hocGi: [
      "Pflege kranker und älterer Menschen",
      "Grundlagen der Medizin, Arzneimittellehre und Hygiene",
      "Kommunikation mit Patientinnen, Patienten und Angehörigen",
      "Pflegedokumentation nach deutschem Standard",
    ],
    lamGi: ["Krankenhäuser und Fachkliniken", "Pflegeheime", "Ambulante Pflegedienste"],
    hopVoi: ["Geduldig und bereit zur Schichtarbeit", "Freude an der Arbeit mit Menschen", "Lernen Sprachen gern und schnell"],
    trienVong:
      "Nach dem Abschluss sind Fachweiterbildungen möglich (Anästhesie, Intensivpflege, Pflegemanagement) oder ein Pflegestudium.",
  },
  "nha-hang-khach-san": {
    ten: "Gastronomie und Hotellerie",
    tenDuc: "Koch/Köchin · Hotelfachmann/-frau · Restaurantfachmann/-frau",
    nam: "3 Jahre",
    tieng: "B1",
    tomTat:
      "Der Bereich mit dem leichtesten Einstieg für Bewerberinnen und Bewerber aus Vietnam: Küchenhandwerk ist gefragt, das Umfeld ist international, und viele große Hotels bilden internationale Auszubildende aus.",
    hocGi: [
      "Europäische Küche, kalte und warme Küche",
      "Lebensmittelhygiene nach HACCP",
      "Service, Empfang und Reservierung",
      "Kalkulation und Lagerverwaltung",
    ],
    lamGi: ["Hotels mit 3 bis 5 Sternen", "Restaurants, Gaststätten und Systemgastronomie", "Bankett- und Veranstaltungsabteilungen"],
    hopVoi: ["Flink und belastbar in Stoßzeiten", "Freude am Kochen und am Umgang mit Gästen"],
    trienVong: "Aufstieg zum Sous-Chef oder Küchenchef oder Meisterprüfung und eigenes Restaurant in Deutschland.",
  },
  "co-khi": {
    ten: "Metall und Mechatronik",
    tenDuc: "Industriemechaniker/in · Mechatroniker/in",
    nam: "3,5 Jahre",
    tieng: "B1, B2 bevorzugt",
    tomTat:
      "Das Rückgrat der deutschen Industrie. Hohe Einstiegsgehälter, stabile Verträge, und viele Konzerne übernehmen direkt nach dem Abschluss.",
    hocGi: [
      "Technische Zeichnungen und Toleranzen lesen",
      "Spanende Fertigung: Drehen, Fräsen, Schweißen",
      "Montage und Instandhaltung von Produktionsanlagen",
      "Pneumatik, Hydraulik und SPS-Steuerungen",
    ],
    lamGi: ["Maschinenbau, Automobil- und Anlagenindustrie", "Instandhaltung von Fertigungslinien", "Montagebetriebe für Maschinen"],
    hopVoi: ["Handwerkliches Geschick, technisches Verständnis", "Gute Leistungen in Mathematik und Physik"],
    trienVong: "Weiterbildung zum Techniker oder Meister oder ein Studium an einer Hochschule für angewandte Wissenschaften.",
  },
  dien: {
    ten: "Elektro- und Automatisierungstechnik",
    tenDuc: "Elektroniker/in für Betriebstechnik",
    nam: "3,5 Jahre",
    tieng: "B1, B2 bevorzugt",
    tomTat:
      "Gut bezahlt und ständig gesucht: Gebäudetechnik, Industrieanlagen und erneuerbare Energien brauchen Elektrofachkräfte.",
    hocGi: [
      "Elektrotechnische Grundlagen, Messtechnik, elektrische Sicherheit",
      "Aufbau von Schaltschränken und Steuerungen",
      "SPS-Programmierung, Sensorik, Antriebstechnik",
      "Instandhaltung automatisierter Anlagen",
    ],
    lamGi: ["Produktionsbetriebe", "Elektroinstallationsbetriebe", "Photovoltaik, Windkraft und Ladeinfrastruktur"],
    hopVoi: ["Sorgfältige Arbeitsweise, Sicherheitsbewusstsein", "Interesse an Elektronik und Programmierung"],
    trienVong: "Als Elektromeister/in einen eigenen Betrieb gründen oder sich auf industrielle Automatisierung spezialisieren.",
  },
  "xay-dung": {
    ten: "Bau und Gebäudetechnik",
    tenDuc: "Anlagenmechaniker/in SHK · Bauberufe",
    nam: "3–3,5 Jahre",
    tieng: "B1",
    tomTat:
      "In Deutschland fehlen dringend Fachkräfte für Sanitär, Heizung und Klima. Je länger die Berufserfahrung, desto gefragter die Fachkraft.",
    hocGi: [
      "Trinkwasser- und Abwassersysteme",
      "Heizung, Wärmepumpen, Klima- und Lüftungstechnik",
      "Rohrschweißen, Montage von Sanitäranlagen",
      "Baupläne lesen",
    ],
    lamGi: ["SHK-Fachbetriebe der Gebäudetechnik", "Bauunternehmen", "Wartungs- und Kundendienste"],
    hopVoi: ["Körperlich belastbar, gern auf der Baustelle", "Freude am Montieren und Reparieren"],
    trienVong: "Meister/in im SHK-Handwerk – einer der Handwerksabschlüsse mit dem höchsten Einkommen in Deutschland.",
  },
  logistics: {
    ten: "Lager und Logistik",
    nam: "3 Jahre",
    tieng: "B1",
    tomTat:
      "Deutschland ist die Logistikdrehscheibe Europas. Lagerlogistik ist schnell erlernbar, der Einstieg gelingt zügig, und der Aufstieg zur Teamleitung ist früh möglich.",
    hocGi: [
      "Wareneingang, Warenausgang und Inventur",
      "Lagerverwaltungssoftware und Barcodes",
      "Sicheres Be- und Entladen, Gabelstaplerfahren",
      "Versand- und Frachtpapiere",
    ],
    lamGi: ["Distributionszentren", "Werkslager", "Speditionen und Paketdienste"],
    hopVoi: ["Flink und gut organisiert", "Freude an klar strukturierten Abläufen"],
    trienVong: "Aufstieg zur Schicht- oder Lagerleitung oder Weiterbildung zum Logistikmeister bzw. zur Logistikmeisterin.",
  },
  "thuc-pham": {
    ten: "Lebensmittel und Backhandwerk",
    tenDuc: "Fachkraft für Lebensmitteltechnik · Bäcker/in",
    nam: "3 Jahre",
    tieng: "B1",
    tomTat:
      "Eine Branche mit ganzjährig stabiler Produktion, unabhängig von der Saison; viele Betriebe bilden internationale Auszubildende aus.",
    hocGi: [
      "Produktions- und Verpackungsprozesse",
      "Qualitätskontrolle und Hygiene nach HACCP",
      "Bedienung von Verarbeitungsmaschinen",
      "Deutsche Backtechniken",
    ],
    lamGi: ["Lebensmittelbetriebe", "Industrie- und Handwerksbäckereien", "Fleisch- und Milchverarbeitung"],
    hopVoi: ["Bereitschaft zur Frühschicht", "Sorgfältig und hygienebewusst"],
    trienVong: "Aufstieg zur Linienführung in der Produktion oder Meisterprüfung im Bäckerhandwerk.",
  },
  cntt: {
    ten: "Informationstechnik",
    tenDuc: "Fachinformatiker/in",
    nam: "3 Jahre",
    tieng: "B2",
    tomTat:
      "Höhere Sprachanforderungen, dafür das beste Einkommen unter den Ausbildungsberufen und ein Arbeitsplatz im Büro.",
    hocGi: [
      "Anwendungsentwicklung oder Systemintegration",
      "Datenbanken und Rechnernetze",
      "IT-Sicherheit",
      "Anwenderbetreuung",
    ],
    lamGi: ["Softwareunternehmen", "IT-Abteilungen von Unternehmen", "IT-Infrastrukturdienstleister"],
    hopVoi: ["Gute Deutschkenntnisse", "Logisches Denken, eigenständiges Lernen"],
    trienVong: "Wechsel in die Softwareentwicklung oder Systemadministration oder ein Studium an einer Hochschule für angewandte Wissenschaften.",
  },
};

const BAN: BanDichTheoNgonNgu<NganhHocBanDich> = { en: EN, de: DE };

const BAT_BUOC = ["ten", "nam", "tieng", "tomTat", "hocGi", "lamGi", "hopVoi", "trienVong"] as const;

/** Chỗ thiếu của cả en lẫn de — đăng ký trong data/i18n/kiem.ts */
export function choThieuAusbildung(): string[] {
  return (["en", "de"] as const).flatMap((lang) =>
    timChoThieu<NganhHoc, NganhHocBanDich>(`ausbildung.${lang}`, NGANH_HOC, BAN[lang], BAT_BUOC, {
      hocGi: (n) => n.hocGi,
      lamGi: (n) => n.lamGi,
      hopVoi: (n) => n.hopVoi,
    })
  );
}

let daKiem = false;

/** 8 ngành theo ngôn ngữ. vi → bản gốc; en/de thiếu bản dịch → NÉM LỖI. */
export function getNganhHoc(lang: Lang): NganhHoc[] {
  if (lang === "vi") return NGANH_HOC;
  if (!daKiem) {
    daKiem = true;
    batBuocDu(choThieuAusbildung());
  }
  return NGANH_HOC.flatMap((n) => {
    const b = BAN[lang][n.id];
    if (!b) return []; // chỉ tới đây khi bật NB_I18N_AN_MUC_THIEU — ẩn, không hiện tiếng Việt
    return [
      {
        ...n,
        ten: b.ten,
        tenDuc: b.tenDuc ?? n.tenDuc,
        nam: b.nam,
        tieng: b.tieng,
        tomTat: b.tomTat,
        hocGi: b.hocGi,
        lamGi: b.lamGi,
        hopVoi: b.hopVoi,
        trienVong: b.trienVong,
      },
    ];
  });
}

export function nganhTheoIdLang(id: string, lang: Lang): NganhHoc | undefined {
  return getNganhHoc(lang).find((n) => n.id === id);
}
