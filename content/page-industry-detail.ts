import type { Locale } from "@/content/locales";

/**
 * Chữ của trang 05 — screens/05-branche-elektrotechnik.png, dùng chung cho
 * mọi ngành đang mở. Phần riêng từng ngành nằm ở `INDUSTRY_DETAIL` bên dưới.
 *
 * Khác mẫu, có chủ đích:
 *  - Thẻ trích dẫn "Tien Nguyen, seit 2023 in Deutschland": người và năm là
 *    bịa → thay bằng câu thương hiệu, không gán cho người thật.
 *  - "Hohe Nachfrage", "Zukunftssicher und systemrelevant", "Anerkannter
 *    Ausbildungsberuf (IHK)": khẳng định chưa có nguồn (Elektroniker còn là
 *    nghề Handwerk/HWK, không phải IHK) → đổi sang câu mô tả dịch vụ.
 *  - "Deutschsprachtraining (bis B1/B2)", "Mindestens abgeschlossene
 *    Berufsausbildung", "Deutschkenntnisse (A2 oder höher)": khoá bởi CẦN ĐIỀN
 *    04 và 08 → bỏ trình độ cụ thể; điều kiện chính thức chỉ hiện khi duyệt.
 *  - 100+ / 95%: số chưa xác minh (CẦN ĐIỀN 05) → khoá.
 *  - Timeline mẫu vẽ 7 chấm cho 6 bước (chấm "5" lặp, không nhãn) → 6 chấm.
 */

export interface IndustryDetailCopy {
  nav: string[];
  contact: string;
  eyebrow: string;
  sub: string;
  trust: [string, string][];
  ctaEmployer: string;
  ctaCandidate: string;
  quote: string;
  quoteBy: string;
  quoteSub: string;
  facts: string[];
  tasksTitle: string;
  prepTitle: string;
  prepIntro: string;
  prep: string[];
  reqTitle: string;
  reqIntro: string;
  req: string[];
  expert: [string, string];
  stats: { value: string | null; label: [string, string] }[];
  galleryTitle: string;
  gallery: [string, string];
  wayTitle: string;
  way: [string, string][];
  boxEmployer: { title: string; text: string; cta: string };
  boxCandidate: { title: string; text: string; cta: string };
  footer: string;
  footerClaim: string;
}

export const INDUSTRY_DETAIL_PAGE: Record<Locale, IndustryDetailCopy> = {
  de: {
    nav: ["Für Unternehmen", "Für Fachkräfte", "Branchen", "Unser Service", "Über uns"],
    contact: "Kontakt aufnehmen",
    eyebrow: "NIBELC TalentBridge Deutschland",
    sub: "Fachkräfte aus Vietnam. Perspektiven für Deutschland.",
    trust: [
      ["Qualifizierte", "Fachkräfte"],
      ["Verlässliche", "Partnerschaft"],
      ["Nachhaltige", "Integration"],
    ],
    ctaEmployer: "Für Unternehmen",
    ctaCandidate: "Für Fachkräfte",
    quote: "„Menschen verbinden. Kompetenzen stärken.“",
    quoteBy: "NIBELC TalentBridge",
    quoteSub: "Vietnam – Deutschland",
    facts: [
      "",
      "Einsatz in ganz Deutschland",
      "Anerkannter Ausbildungsberuf in Deutschland",
      "Begleitung bis zur Integration",
    ],
    tasksTitle: "Tätigkeiten",
    prepTitle: "Vorbereitung",
    prepIntro:
      "Wir begleiten unsere Kandidaten in einem strukturierten Programm – von der sprachlichen und fachlichen Vorbereitung bis zur Integration.",
    prep: [
      "Deutschsprachtraining",
      "Fachliche Vorbereitung nach deutschen Standards",
      "Anerkennungs- und Visumverfahren",
      "Kulturelle und berufliche Orientierung",
      "Unterstützung bei Ankunft und Integration",
    ],
    reqTitle: "Anforderungen",
    reqIntro:
      "Sie bringen Motivation, technisches Verständnis und Teamgeist mit. Alles Weitere entwickeln wir gemeinsam.",
    req: [
      "Technisches Interesse und handwerkliches Geschick",
      "Lernbereitschaft und Zuverlässigkeit",
      "Teamfähigkeit und Verantwortungsbewusstsein",
    ],
    expert: ["Experten für die Fachkräftegewinnung", "aus Vietnam."],
    stats: [
      { value: null, label: ["Vermittelte", "Fachkräfte"] },
      { value: null, label: ["Erfolgreiche", "Integration"] },
      { value: "", label: ["Langfristige", "Partnerschaften"] },
    ],
    galleryTitle: "Bilder aus dem Arbeitsalltag",
    gallery: ["Teamarbeit auf Augenhöhe", "Präzision im Detail"],
    wayTitle: "Ihr Weg nach Deutschland",
    way: [
      ["Bewerbung", "& Auswahl"],
      ["Sprach-", "vorbereitung"],
      ["Fachliche", "Qualifizierung"],
      ["Anerkennung", "& Visum"],
      ["Anreise &", "Onboarding"],
      ["Langfristige", "Integration"],
    ],
    boxEmployer: { title: "Für Unternehmen", text: "Jetzt qualifizierte Fachkräfte gewinnen.", cta: "Beratung anfragen" },
    boxCandidate: { title: "Für Fachkräfte", text: "Ihre Zukunft in Deutschland beginnt hier.", cta: "Jetzt bewerben" },
    footer: "Menschen verbinden. Kompetenzen stärken. Gemeinsam Zukunft bauen.",
    footerClaim: "Fachkräfte. Für heute. Für morgen.",
  },
  en: {
    nav: ["For Employers", "For Candidates", "Industries", "Our Service", "About us"],
    contact: "Get in touch",
    eyebrow: "NIBELC TalentBridge Deutschland",
    sub: "Skilled workers from Vietnam. Prospects for Germany.",
    trust: [
      ["Qualified", "workers"],
      ["Reliable", "partnership"],
      ["Lasting", "integration"],
    ],
    ctaEmployer: "For employers",
    ctaCandidate: "For candidates",
    quote: "“Connecting people. Strengthening skills.”",
    quoteBy: "NIBELC TalentBridge",
    quoteSub: "Vietnam – Germany",
    facts: [
      "",
      "Placements across Germany",
      "Recognised training occupation in Germany",
      "Support through to integration",
    ],
    tasksTitle: "Tasks",
    prepTitle: "Preparation",
    prepIntro:
      "We guide our candidates through a structured programme – from language and technical preparation to integration.",
    prep: [
      "German language training",
      "Technical preparation to German standards",
      "Recognition and visa procedures",
      "Cultural and professional orientation",
      "Support on arrival and with integration",
    ],
    reqTitle: "Requirements",
    reqIntro: "You bring motivation, technical understanding and team spirit. We develop the rest together.",
    req: [
      "Technical interest and manual skill",
      "Willingness to learn and reliability",
      "Teamwork and a sense of responsibility",
    ],
    expert: ["Experts in recruiting skilled workers", "from Vietnam."],
    stats: [
      { value: null, label: ["Workers", "placed"] },
      { value: null, label: ["Successful", "integration"] },
      { value: "", label: ["Long-term", "partnerships"] },
    ],
    galleryTitle: "Everyday work",
    gallery: ["Teamwork as equals", "Precision in detail"],
    wayTitle: "Your path to Germany",
    way: [
      ["Application", "& selection"],
      ["Language", "preparation"],
      ["Technical", "qualification"],
      ["Recognition", "& visa"],
      ["Arrival &", "onboarding"],
      ["Long-term", "integration"],
    ],
    boxEmployer: { title: "For employers", text: "Find qualified skilled workers now.", cta: "Request advice" },
    boxCandidate: { title: "For candidates", text: "Your future in Germany starts here.", cta: "Apply now" },
    footer: "Connecting people. Strengthening skills. Building the future together.",
    footerClaim: "Skilled workers. For today. For tomorrow.",
  },
  vi: {
    nav: ["Doanh nghiệp", "Người lao động", "Ngành nghề", "Dịch vụ", "Về chúng tôi"],
    contact: "Liên hệ ngay",
    eyebrow: "NIBELC TalentBridge Deutschland",
    sub: "Nhân lực từ Việt Nam. Cơ hội tại Đức.",
    trust: [
      ["Nhân lực", "có tay nghề"],
      ["Hợp tác", "tin cậy"],
      ["Hội nhập", "bền vững"],
    ],
    ctaEmployer: "Cho doanh nghiệp",
    ctaCandidate: "Cho người lao động",
    quote: "“Kết nối con người. Nâng tầm tay nghề.”",
    quoteBy: "NIBELC TalentBridge",
    quoteSub: "Việt Nam – Đức",
    facts: [
      "",
      "Làm việc trên khắp nước Đức",
      "Nghề đào tạo được công nhận tại Đức",
      "Đồng hành đến khi hội nhập",
    ],
    tasksTitle: "Công việc",
    prepTitle: "Chuẩn bị",
    prepIntro:
      "Chúng tôi đồng hành cùng ứng viên theo một chương trình có lộ trình – từ tiếng Đức, chuyên môn đến khi hội nhập.",
    prep: [
      "Đào tạo tiếng Đức",
      "Chuẩn bị chuyên môn theo tiêu chuẩn Đức",
      "Thủ tục công nhận và visa",
      "Định hướng văn hoá và nghề nghiệp",
      "Hỗ trợ khi đến Đức và hội nhập",
    ],
    reqTitle: "Yêu cầu",
    reqIntro: "Bạn mang theo động lực, hiểu biết kỹ thuật và tinh thần đồng đội. Phần còn lại chúng ta cùng xây dựng.",
    req: [
      "Yêu thích kỹ thuật, khéo tay",
      "Ham học hỏi và đáng tin cậy",
      "Làm việc nhóm và có trách nhiệm",
    ],
    expert: ["Chuyên kết nối nhân lực", "từ Việt Nam."],
    stats: [
      { value: null, label: ["Lao động", "đã kết nối"] },
      { value: null, label: ["Hội nhập", "thành công"] },
      { value: "", label: ["Hợp tác", "lâu dài"] },
    ],
    galleryTitle: "Hình ảnh công việc",
    gallery: ["Làm việc nhóm ngang hàng", "Chính xác đến từng chi tiết"],
    wayTitle: "Lộ trình sang Đức",
    way: [
      ["Ứng tuyển", "& tuyển chọn"],
      ["Chuẩn bị", "tiếng Đức"],
      ["Đào tạo", "chuyên môn"],
      ["Công nhận", "& visa"],
      ["Nhập cảnh", "& nhận việc"],
      ["Hội nhập", "lâu dài"],
    ],
    boxEmployer: { title: "Doanh nghiệp", text: "Tìm nhân lực có tay nghề ngay hôm nay.", cta: "Yêu cầu tư vấn" },
    boxCandidate: { title: "Người lao động", text: "Tương lai của bạn tại Đức bắt đầu từ đây.", cta: "Ứng tuyển ngay" },
    footer: "Kết nối con người. Nâng tầm tay nghề. Cùng xây tương lai.",
    footerClaim: "Nhân lực. Cho hôm nay. Cho ngày mai.",
  },
};

type L3 = Record<Locale, string>;

/**
 * Phần riêng từng ngành trên trang 05. Tên nghề tiếng Đức (`berufDe`) và
 * `taetigkeiten` tiếng Đức nằm ở registry `industries.ts`; ở đây là tiêu đề
 * ngắn như mẫu, lĩnh vực, đoạn mô tả và bản dịch nhiệm vụ.
 */
export interface IndustryDetail {
  h1: L3;
  sector: L3;
  intro: L3;
  tasksEn: string[];
  tasksVi: string[];
  caption: L3;
  /** Tiêu điểm ảnh hero để người trong ảnh không bị khung chữ che */
  heroFocus: string;
}

export const INDUSTRY_DETAIL: Record<string, IndustryDetail> = {
  "gastronomie-koch": {
    h1: { de: "Koch / Köchin\nin Restaurant und Hotel", en: "Cook in restaurants\nand hotels", vi: "Đầu bếp\nnhà hàng và khách sạn" },
    sector: { de: "Restaurant, Hotel und Gemeinschaftsverpflegung", en: "Restaurants, hotels and catering", vi: "Nhà hàng, khách sạn và suất ăn" },
    intro: {
      de: "Köchinnen und Köche bereiten Speisen nach Rezeptur zu, planen die Abläufe in der Küche und sorgen dafür, dass Qualität und Hygiene jeden Tag stimmen.",
      en: "Cooks prepare dishes to recipe, plan the kitchen workflow and make sure quality and hygiene are right every day.",
      vi: "Đầu bếp chế biến món theo định lượng, sắp xếp nhịp làm việc trong bếp và giữ chất lượng, vệ sinh đúng chuẩn mỗi ngày.",
    },
    tasksEn: [
      "Mise en place and preparing for service",
      "Cooking to standardised recipes",
      "Following HACCP and hygiene rules",
      "Receiving goods and checking stock",
      "Working with kitchen management and service",
    ],
    tasksVi: [
      "Sơ chế và chuẩn bị trước giờ phục vụ",
      "Nấu theo công thức, định lượng chuẩn",
      "Tuân thủ HACCP và quy định vệ sinh",
      "Nhận hàng và kiểm tra kho",
      "Phối hợp với bếp trưởng và bộ phận phục vụ",
    ],
    caption: { de: "Frische Küche. Echte Perspektiven.", en: "Fresh cooking. Real prospects.", vi: "Bếp tươi mới. Cơ hội thật." },
    heroFocus: "20% 30%",
  },
  "baeckerei-baecker": {
    h1: { de: "Bäcker / Bäckerin\nim Handwerk", en: "Baker\nin the craft trade", vi: "Thợ làm bánh\ntại tiệm bánh Đức" },
    sector: { de: "Bäckerhandwerk und Backbetriebe", en: "Craft bakeries and bakery production", vi: "Tiệm bánh và xưởng bánh" },
    intro: {
      de: "Bäckerinnen und Bäcker stellen Brot, Brötchen und Feingebäck her – vom Teig bis zum fertigen Produkt, mit festen Abläufen und Sinn für Qualität.",
      en: "Bakers make bread, rolls and pastries – from dough to finished product, with fixed routines and an eye for quality.",
      vi: "Thợ làm bánh làm bánh mì, bánh ngọt từ khâu nhào bột đến thành phẩm, theo quy trình cố định và chú trọng chất lượng.",
    },
    tasksEn: [
      "Preparing doughs and pre-doughs",
      "Working up and shaping bread and rolls",
      "Controlling proofing and baking processes",
      "Quality control of baked goods",
      "Cleaning and meeting hygiene standards",
    ],
    tasksVi: [
      "Làm bột và bột ủ",
      "Chia, tạo hình bánh mì và bánh nhỏ",
      "Điều khiển quá trình ủ và nướng",
      "Kiểm tra chất lượng thành phẩm",
      "Vệ sinh và giữ chuẩn an toàn thực phẩm",
    ],
    caption: { de: "Handwerk mit Tradition. Echte Perspektiven.", en: "A traditional craft. Real prospects.", vi: "Nghề truyền thống. Cơ hội thật." },
    heroFocus: "55% 30%",
  },
  "fleischerei-fleischer": {
    h1: { de: "Fleischer / Fleischerin\nim Handwerk", en: "Butcher\nin the craft trade", vi: "Thợ chế biến thịt\ntại cơ sở của Đức" },
    sector: { de: "Fleischerhandwerk und Lebensmittelbetriebe", en: "Butcher shops and food production", vi: "Cửa hàng thịt và chế biến thực phẩm" },
    intro: {
      de: "Fleischerinnen und Fleischer zerlegen, verarbeiten und veredeln Fleisch nach Hygienevorgaben und sorgen für einwandfreie Ware.",
      en: "Butchers cut, process and refine meat in line with hygiene rules and make sure products are of sound quality.",
      vi: "Thợ chế biến thịt pha lóc, chế biến và làm thành phẩm theo quy định vệ sinh, bảo đảm hàng hoá đạt chuẩn.",
    },
    tasksEn: [
      "Cutting and trimming to specification",
      "Making meat and sausage products",
      "Packing and labelling products",
      "Temperature checks and records",
      "Cleaning and meeting HACCP rules",
    ],
    tasksVi: [
      "Pha lóc và cắt theo yêu cầu",
      "Làm sản phẩm thịt và xúc xích",
      "Đóng gói và dán nhãn sản phẩm",
      "Kiểm soát nhiệt độ và ghi chép",
      "Vệ sinh và tuân thủ HACCP",
    ],
    caption: { de: "Sorgfalt in jedem Schritt. Echte Perspektiven.", en: "Care in every step. Real prospects.", vi: "Cẩn thận từng bước. Cơ hội thật." },
    heroFocus: "45% 30%",
  },
  "elektrotechnik-elektroniker": {
    h1: {
      de: "Elektroniker für\nEnergie- und Gebäudetechnik",
      en: "Electronics technician for\nenergy and building systems",
      vi: "Thợ điện kỹ thuật\nnăng lượng và toà nhà",
    },
    sector: { de: "Energie, Gebäude und Infrastruktur", en: "Energy, buildings and infrastructure", vi: "Năng lượng, toà nhà và hạ tầng" },
    intro: {
      de: "Elektroniker für Energie- und Gebäudetechnik installieren und warten elektrotechnische Anlagen in Wohn-, Gewerbe- und Industriegebäuden. Sie sorgen dafür, dass Strom, Kommunikation und Gebäudetechnik zuverlässig funktionieren.",
      en: "Electronics technicians for energy and building systems install and maintain electrical systems in residential, commercial and industrial buildings, keeping power, communication and building services running reliably.",
      vi: "Thợ điện kỹ thuật năng lượng và toà nhà lắp đặt, bảo trì hệ thống điện trong nhà ở, toà nhà thương mại và công nghiệp, giữ cho điện, liên lạc và kỹ thuật toà nhà vận hành ổn định.",
    },
    tasksEn: [
      "Installing cables, distribution boards and devices",
      "Reading and applying technical drawings",
      "Measuring, testing and documenting systems",
      "Troubleshooting and repair",
      "Following the relevant safety rules",
    ],
    tasksVi: [
      "Lắp đặt dây dẫn, tủ phân phối và thiết bị",
      "Đọc và thi công theo bản vẽ kỹ thuật",
      "Đo, kiểm tra và ghi chép hệ thống",
      "Tìm lỗi và sửa chữa",
      "Tuân thủ quy tắc an toàn điện",
    ],
    caption: { de: "Moderne Gebäudetechnik. Echte Perspektiven.", en: "Modern building systems. Real prospects.", vi: "Kỹ thuật toà nhà hiện đại. Cơ hội thật." },
    heroFocus: "0% 22%",
  },
  "logistik-fachkraft-lagerlogistik": {
    h1: { de: "Fachkraft\nfür Lagerlogistik", en: "Warehouse logistics\nspecialist", vi: "Nhân viên kho vận\nvà logistics" },
    sector: { de: "Lager, Logistik und Versand", en: "Warehousing, logistics and shipping", vi: "Kho bãi, logistics và giao nhận" },
    intro: {
      de: "Fachkräfte für Lagerlogistik nehmen Waren an, lagern sie fachgerecht ein und stellen Sendungen zusammen – digital gesteuert und mit klaren Abläufen.",
      en: "Warehouse logistics specialists receive goods, store them properly and put together shipments – digitally managed with clear processes.",
      vi: "Nhân viên kho vận nhận hàng, sắp xếp lưu kho đúng quy cách và chuẩn bị đơn xuất – quản lý bằng hệ thống số, quy trình rõ ràng.",
    },
    tasksEn: [
      "Receiving and checking deliveries",
      "Picking orders from pick lists",
      "Packing, labelling and preparing shipments",
      "Stock management in the warehouse system",
      "Occupational safety in the warehouse",
    ],
    tasksVi: [
      "Nhận hàng và kiểm tra lô giao",
      "Soạn hàng theo phiếu",
      "Đóng gói, dán nhãn và chuẩn bị xuất",
      "Quản lý tồn kho trên phần mềm kho",
      "Tuân thủ an toàn lao động trong kho",
    ],
    caption: { de: "Logistik in Bewegung. Echte Perspektiven.", en: "Logistics in motion. Real prospects.", vi: "Logistics chuyển động. Cơ hội thật." },
    heroFocus: "25% 35%",
  },
  "gartenbau-gaertner": {
    h1: { de: "Gärtner / Gärtnerin\nim Gartenbau", en: "Gardener\nin horticulture", vi: "Thợ làm vườn\nvà chăm sóc cây xanh" },
    sector: { de: "Gartenbau, Grünflächen und Gewächshaus", en: "Horticulture, green spaces and greenhouses", vi: "Làm vườn, cây xanh và nhà kính" },
    intro: {
      de: "Gärtnerinnen und Gärtner pflegen Pflanzen, Grünflächen und Kulturen – draußen und im Gewächshaus, mit Gespür für Natur und Technik.",
      en: "Gardeners care for plants, green spaces and crops – outdoors and in greenhouses, with a feel for nature and technology.",
      vi: "Thợ làm vườn chăm sóc cây trồng, mảng xanh và vụ mùa – ngoài trời lẫn trong nhà kính, cần hiểu cây và biết dùng máy móc.",
    },
    tasksEn: [
      "Creating green spaces and plantings",
      "Planting, tending and watering crops",
      "Harvesting and sorting to quality standards",
      "Operating and maintaining equipment",
      "Working to plans and safety rules",
    ],
    tasksVi: [
      "Làm mảng xanh và trồng cây",
      "Trồng, chăm sóc và tưới cây",
      "Thu hoạch và phân loại theo chuẩn",
      "Vận hành và bảo dưỡng máy móc",
      "Làm theo bản vẽ và quy định an toàn",
    ],
    caption: { de: "Arbeit mit der Natur. Echte Perspektiven.", en: "Working with nature. Real prospects.", vi: "Làm việc cùng thiên nhiên. Cơ hội thật." },
    heroFocus: "55% 35%",
  },
  "produktion-maschinen-anlagen": {
    h1: { de: "Maschinen- und\nAnlagenführer", en: "Machine and\nplant operator", vi: "Vận hành máy\nvà dây chuyền" },
    sector: { de: "Industrie, Produktion und Fertigung", en: "Industry, production and manufacturing", vi: "Công nghiệp, sản xuất và chế tạo" },
    intro: {
      de: "Maschinen- und Anlagenführer richten Produktionsanlagen ein, überwachen den Betrieb und sichern die Qualität der Produkte im Schichtbetrieb.",
      en: "Machine and plant operators set up production lines, monitor operation and assure product quality in shift work.",
      vi: "Người vận hành máy và dây chuyền cài đặt máy, theo dõi vận hành và bảo đảm chất lượng sản phẩm theo ca.",
    },
    tasksEn: [
      "Operating and monitoring production lines",
      "Changing machine set-up for new products",
      "Checking process parameters and quality",
      "Detecting faults and basic maintenance",
      "Documenting in the shift log",
    ],
    tasksVi: [
      "Vận hành và theo dõi dây chuyền",
      "Chuyển đổi máy khi đổi sản phẩm",
      "Kiểm tra thông số và chất lượng",
      "Phát hiện lỗi và bảo trì cơ bản",
      "Ghi sổ giao ca",
    ],
    caption: { de: "Moderne Produktion. Echte Perspektiven.", en: "Modern production. Real prospects.", vi: "Sản xuất hiện đại. Cơ hội thật." },
    heroFocus: "75% 35%",
  },
};
