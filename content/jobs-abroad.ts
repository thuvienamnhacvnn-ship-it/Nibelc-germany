import type { Locale } from "@/content/locales";

/**
 * ĐƠN HÀNG CHÂU ÂU — chín đơn Sếp gửi ngày 27/09/2026.
 *
 * Nguồn: tám tin tuyển dụng chính thức trong `E:\Works\itw\Hub mini`, bản sao
 * ở `public/don-hang/`. Mọi con số dưới đây đọc thẳng từ chính tấm tin đó:
 * mức lương, số chỗ, thời hạn hợp đồng, chỗ ở, vé máy bay, thưởng.
 *
 * KHÔNG suy diễn: tin nào không ghi số chỗ thì để trống, không ghi giờ làm thì
 * để trống. Tin Albania và tin Litva ghi lương theo từng vị trí nên có thêm
 * danh sách `roles`; tin Litva gộp ba nghề trong một tấm nên tách thành ba đơn.
 *
 * Hai tấm tin Hy Lạp về chế biến thuỷ hải sản là hai bản in của cùng một đơn
 * (bản sau ghi rõ "950 – 1.400 EUR tuỳ vị trí", bản trước ghi "1.100 – 1.400"
 * kèm "lương cơ bản từ 950"). Lấy khoảng rộng hơn của bản chi tiết hơn và giữ
 * cả hai ảnh.
 */

export type CountryCode = "de" | "gr" | "al" | "lt";

export const COUNTRY_NAME: Record<CountryCode, Record<Locale, string>> = {
  de: { de: "Deutschland", en: "Germany", vi: "Đức" },
  gr: { de: "Griechenland", en: "Greece", vi: "Hy Lạp" },
  al: { de: "Albanien", en: "Albania", vi: "Albania" },
  lt: { de: "Litauen", en: "Lithuania", vi: "Litva" },
};

/** Ba dải màu của cờ, vẽ bằng CSS — không phải kéo thêm file ảnh cờ. */
export const COUNTRY_FLAG: Record<CountryCode, string[]> = {
  de: ["#111111", "#dd0000", "#ffce00"],
  gr: ["#0d5eaf", "#ffffff", "#0d5eaf"],
  al: ["#e41e20", "#b91719", "#e41e20"],
  lt: ["#fdb913", "#006a44", "#c1272d"],
};

export interface AbroadRole {
  label: Record<Locale, string>;
  from: number;
  to: number;
}

export interface AbroadOrder {
  id: string;
  country: CountryCode;
  /** Ngành trong registry — chỉ đặt khi khớp thật, để nối sang trang ngành */
  industry?: string;
  /** Ảnh tin gốc, hiện ở trang đơn hàng */
  poster?: string;
  /** Ảnh đã cắt lấy riêng phần chụp, dùng cho thẻ trên banner */
  image: string;
  imageFocus: string;
  /** Ảnh tin bản khác của cùng đơn hàng */
  imageAlt?: string;
  salary: { from: number; to: number };
  salaryNote: Record<Locale, string>;
  slots?: number;
  hoursPerWeek?: number;
  /** Diện cư trú, chỉ đơn nào tin có ghi */
  visa?: string;
  contract: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  benefits: Record<Locale, string[]>;
  requirements?: Record<Locale, string[]>;
  /** Lương theo từng vị trí, khi tin ghi rõ từng vị trí một */
  roles?: AbroadRole[];
  /** Điều khoản người lao động phải tự trả — tin có ghi thì phải nói rõ */
  costNote?: Record<Locale, string>;
}

const INCL_OT: Record<Locale, string> = {
  de: "Angabe inklusive Überstunden, Grundlohn ab 950 EUR",
  en: "Figure includes overtime; base pay from EUR 950",
  vi: "Thu nhập đã gồm làm thêm, lương cơ bản từ 950 EUR",
};

const GR_BENEFITS: Record<Locale, string[]> = {
  de: [
    "Unterkunft vom Arbeitgeber gestellt",
    "Flug für die Hinreise vom Arbeitgeber",
    "Nach zwölf vollen Monaten zwei zusätzliche Monatslöhne",
  ],
  en: [
    "Accommodation provided by the employer",
    "One-way flight paid by the employer",
    "Two extra monthly wages after twelve full months",
  ],
  vi: [
    "Chỗ ở miễn phí do chủ sử dụng cung cấp",
    "Vé máy bay một chiều do chủ sử dụng lo",
    "Làm đủ 12 tháng được thưởng thêm 2 tháng lương",
  ],
};

const GR_CONTRACT: Record<Locale, string> = {
  de: "2 Jahre, verlängerbar bis 5 Jahre",
  en: "2 years, extendable to 5 years",
  vi: "2 năm, gia hạn đến 5 năm",
};

export const ABROAD_ORDERS: AbroadOrder[] = [
  {
    id: "de-phu-bep-nha-hang",
    country: "de",
    industry: "gastronomie-koch",
    image: "/don-hang/the/de-phu-bep-nha-hang.jpg",
    poster: "/don-hang/de-phu-bep-nha-hang.jpg",
    imageFocus: "50% 45%",
    salary: { from: 2800, to: 2900 },
    salaryNote: {
      de: "Angabe vor Steuern",
      en: "Figure before tax",
      vi: "Thu nhập trước thuế",
    },
    slots: 15,
    visa: "18B",
    contract: {
      de: "1 Jahr, langfristig verlängerbar",
      en: "1 year, extendable long term",
      vi: "1 năm, gia hạn dài hạn",
    },
    title: {
      de: "Küchenhilfe in der Gastronomie",
      en: "Restaurant kitchen assistant",
      vi: "Phụ bếp nhà hàng",
    },
    summary: {
      de: "Mitarbeit in der Restaurantküche eines deutschen Betriebs.",
      en: "Working in the kitchen of a restaurant in Germany.",
      vi: "Làm việc trong bếp nhà hàng tại Đức.",
    },
    benefits: {
      de: ["Drei Monate Einarbeitung mit 1.300 EUR netto", "Verpflegung an Arbeitstagen"],
      en: ["Three months of training at EUR 1,300 net", "Meals on working days"],
      vi: ["3 tháng học việc, 1.300 EUR sau thuế", "Bữa ăn hỗ trợ trong ngày đi làm"],
    },
    requirements: {
      de: ["Deutschkenntnisse mindestens A1"],
      en: ["German at A1 or above"],
      vi: ["Tiếng Đức tối thiểu A1"],
    },
  },
  {
    id: "gr-che-bien-thuy-hai-san",
    country: "gr",
    image: "/don-hang/the/gr-che-bien-thuy-hai-san.jpg",
    poster: "/don-hang/gr-che-bien-thuy-hai-san.jpg",
    imageFocus: "50% 45%",
    imageAlt: "/don-hang/gr-che-bien-thuy-hai-san-2.jpg",
    salary: { from: 950, to: 1400 },
    salaryNote: {
      de: "Je nach Position, inklusive Überstunden",
      en: "Depending on the position, overtime included",
      vi: "Tuỳ từng vị trí, thu nhập đã gồm làm thêm",
    },
    contract: GR_CONTRACT,
    title: {
      de: "Fisch- und Meeresfrüchteverarbeitung",
      en: "Seafood processing worker",
      vi: "Công nhân chế biến thuỷ hải sản",
    },
    summary: {
      de: "Verarbeiten, Sortieren und Verpacken von Fisch und Meeresfrüchten.",
      en: "Processing, sorting and packing fish and seafood.",
      vi: "Sơ chế, phân loại và đóng gói thuỷ hải sản.",
    },
    benefits: {
      de: [...GR_BENEFITS.de, "Insgesamt 14 Monatslöhne im Jahr"],
      en: [...GR_BENEFITS.en, "Fourteen monthly wages a year in total"],
      vi: [...GR_BENEFITS.vi, "Tổng thực lĩnh 14 tháng lương một năm"],
    },
  },
  {
    id: "al-khach-san-nha-hang-spa",
    country: "al",
    industry: "gastronomie-koch",
    image: "/don-hang/the/al-khach-san-nha-hang-spa.jpg",
    poster: "/don-hang/al-khach-san-nha-hang-spa.jpg",
    imageFocus: "50% 45%",
    salary: { from: 900, to: 1700 },
    salaryNote: {
      de: "Je nach Position",
      en: "Depending on the position",
      vi: "Thu nhập theo từng vị trí",
    },
    contract: { de: "2 Jahre", en: "2 years", vi: "2 năm" },
    title: {
      de: "Hotel, Restaurant und Spa",
      en: "Hotel, restaurant and spa",
      vi: "Khách sạn · Nhà hàng · Spa",
    },
    summary: {
      de: "Mehrere Positionen in Hotellerie, Gastronomie und Spa in Albanien.",
      en: "Several positions across hotel, restaurant and spa work in Albania.",
      vi: "Nhiều vị trí trong khách sạn, nhà hàng và spa tại Albania.",
    },
    roles: [
      { label: { de: "Spa-Leitung", en: "Spa manager", vi: "Quản lý spa" }, from: 1600, to: 1700 },
      { label: { de: "Küchenchef/in", en: "Head chef", vi: "Bếp trưởng" }, from: 1400, to: 1500 },
      { label: { de: "Spa-Mitarbeit", en: "Spa staff", vi: "Nhân viên spa" }, from: 1200, to: 1300 },
      { label: { de: "Küchenhilfe", en: "Kitchen assistant", vi: "Phụ bếp" }, from: 1100, to: 1200 },
    ],
    benefits: {
      de: ["Unterkunft vom Arbeitgeber", "Eine Mahlzeit pro Schicht", "E-Visum in etwa zwei Wochen"],
      en: ["Accommodation from the employer", "One meal per shift", "E-visa in about two weeks"],
      vi: ["Chủ bao chỗ ở", "1 bữa ăn trong ca", "E-visa khoảng 2 tuần"],
    },
  },
  {
    id: "gr-kho-lap-rap-noi-that",
    country: "gr",
    industry: "logistik-fachkraft-lagerlogistik",
    image: "/don-hang/the/gr-kho-lap-rap-noi-that.jpg",
    poster: "/don-hang/gr-kho-lap-rap-noi-that.jpg",
    imageFocus: "50% 45%",
    salary: { from: 1100, to: 1400 },
    salaryNote: INCL_OT,
    contract: GR_CONTRACT,
    title: {
      de: "Lager und Möbelmontage",
      en: "Warehouse and furniture assembly",
      vi: "Công nhân kho và lắp ráp nội thất",
    },
    summary: {
      de: "Arbeiten im Lager und Montage von Möbeln.",
      en: "Warehouse work and assembling furniture.",
      vi: "Làm việc trong kho và lắp ráp đồ nội thất.",
    },
    benefits: {
      de: [
        "Unterkunft vom Arbeitgeber gestellt",
        "Flug für die Hinreise vom Arbeitgeber",
        "Zuschuss zu Fahrtkosten und einem Teil der Verpflegung",
      ],
      en: [
        "Accommodation provided by the employer",
        "One-way flight paid by the employer",
        "Support for travel costs and part of the meals",
      ],
      vi: [
        "Chỗ ở miễn phí do chủ sử dụng cung cấp",
        "Vé máy bay một chiều do chủ lo",
        "Hỗ trợ đi lại và một phần tiền ăn",
      ],
    },
  },
  {
    id: "gr-nha-may-gia-vi",
    country: "gr",
    image: "/don-hang/the/gr-nha-may-gia-vi.jpg",
    poster: "/don-hang/gr-nha-may-gia-vi.jpg",
    imageFocus: "50% 45%",
    salary: { from: 1100, to: 1200 },
    salaryNote: {
      de: "Inklusive Überstunden, Grundlohn 950 EUR",
      en: "Overtime included; base pay EUR 950",
      vi: "Thu nhập đã gồm làm thêm, lương cơ bản 950 EUR",
    },
    slots: 5,
    contract: GR_CONTRACT,
    title: {
      de: "Mitarbeit in der Gewürzproduktion",
      en: "Spice factory worker",
      vi: "Công nhân nhà máy sản xuất gia vị",
    },
    summary: {
      de: "Verarbeiten und Abfüllen von Gewürzen in einem Produktionsbetrieb.",
      en: "Processing and packing spices in a production plant.",
      vi: "Chế biến và đóng gói gia vị trong nhà máy.",
    },
    benefits: GR_BENEFITS,
  },
  {
    id: "gr-lap-cap-quang",
    country: "gr",
    industry: "elektrotechnik-elektroniker",
    image: "/don-hang/the/gr-lap-cap-quang.jpg",
    poster: "/don-hang/gr-lap-cap-quang.jpg",
    imageFocus: "50% 45%",
    salary: { from: 1100, to: 1400 },
    salaryNote: INCL_OT,
    contract: GR_CONTRACT,
    title: {
      de: "Glasfasermontage",
      en: "Fibre-optic installer",
      vi: "Công nhân lắp cáp quang",
    },
    summary: {
      de: "Verlegen und Anschließen von Glasfaserleitungen.",
      en: "Laying and connecting fibre-optic lines.",
      vi: "Lắp đặt và đấu nối cáp quang.",
    },
    benefits: GR_BENEFITS,
  },
  {
    id: "lt-may-noi-that",
    country: "lt",
    image: "/don-hang/the/lt-may-noi-that.jpg",
    poster: "/don-hang/lt-ba-nganh.jpg",
    imageFocus: "50% 50%",
    salary: { from: 1200, to: 1500 },
    salaryNote: { de: "Grundlohn", en: "Base pay", vi: "Lương cơ bản" },
    hoursPerWeek: 48,
    contract: {
      de: "2 Jahre, verlängerbar",
      en: "2 years, extendable",
      vi: "2 năm, có gia hạn",
    },
    title: { de: "Näherei für Möbelbezüge", en: "Furniture upholstery sewing", vi: "May nội thất" },
    summary: {
      de: "Nähen von Bezügen und Polsterteilen für Möbel.",
      en: "Sewing covers and upholstery parts for furniture.",
      vi: "May bọc và các chi tiết nội thất.",
    },
    benefits: {
      de: ["Rückflug vom Arbeitgeber bezahlt", "48 Stunden pro Woche, vier Wochen im Monat"],
      en: ["Return flight paid by the employer", "48 hours a week, four weeks a month"],
      vi: ["Chủ trả vé máy bay chiều về", "48 giờ/tuần, 4 tuần/tháng"],
    },
    costNote: {
      de: "Wohnung und Nebenkosten rund 100 EUR im Monat, selbst zu tragen.",
      en: "Housing and bills around EUR 100 a month, paid by the worker.",
      vi: "Nhà ở và hoá đơn khoảng 100 EUR/tháng, người lao động tự trả.",
    },
  },
  {
    id: "lt-ve-sinh-cong-nghiep",
    country: "lt",
    image: "/don-hang/the/lt-ve-sinh-cong-nghiep.jpg",
    poster: "/don-hang/lt-ba-nganh.jpg",
    imageFocus: "50% 50%",
    salary: { from: 1153, to: 1153 },
    salaryNote: { de: "Grundlohn", en: "Base pay", vi: "Lương cơ bản" },
    hoursPerWeek: 48,
    contract: {
      de: "2 Jahre, verlängerbar",
      en: "2 years, extendable",
      vi: "2 năm, có gia hạn",
    },
    title: { de: "Industriereinigung", en: "Industrial cleaning", vi: "Vệ sinh công nghiệp" },
    summary: {
      de: "Reinigung von Gebäuden und Produktionsflächen.",
      en: "Cleaning buildings and production areas.",
      vi: "Vệ sinh toà nhà và khu sản xuất.",
    },
    benefits: {
      de: ["Rückflug vom Arbeitgeber bezahlt", "48 Stunden pro Woche, vier Wochen im Monat"],
      en: ["Return flight paid by the employer", "48 hours a week, four weeks a month"],
      vi: ["Chủ trả vé máy bay chiều về", "48 giờ/tuần, 4 tuần/tháng"],
    },
    costNote: {
      de: "Wohnung und Nebenkosten rund 100 EUR im Monat, selbst zu tragen.",
      en: "Housing and bills around EUR 100 a month, paid by the worker.",
      vi: "Nhà ở và hoá đơn khoảng 100 EUR/tháng, người lao động tự trả.",
    },
  },
  {
    id: "lt-loc-thit",
    country: "lt",
    industry: "fleischerei-fleischer",
    image: "/don-hang/the/lt-loc-thit.jpg",
    poster: "/don-hang/lt-ba-nganh.jpg",
    imageFocus: "50% 50%",
    salary: { from: 1300, to: 1400 },
    salaryNote: { de: "Grundlohn", en: "Base pay", vi: "Lương cơ bản" },
    hoursPerWeek: 48,
    contract: {
      de: "2 Jahre, verlängerbar",
      en: "2 years, extendable",
      vi: "2 năm, có gia hạn",
    },
    title: { de: "Fleischzerlegung", en: "Meat cutting", vi: "Lọc thịt" },
    summary: {
      de: "Zerlegen und Zuschneiden von Fleisch im Betrieb.",
      en: "Cutting and trimming meat in a processing plant.",
      vi: "Lọc và pha lóc thịt trong nhà máy.",
    },
    benefits: {
      de: ["Rückflug vom Arbeitgeber bezahlt", "48 Stunden pro Woche, vier Wochen im Monat"],
      en: ["Return flight paid by the employer", "48 hours a week, four weeks a month"],
      vi: ["Chủ trả vé máy bay chiều về", "48 giờ/tuần, 4 tuần/tháng"],
    },
    costNote: {
      de: "Wohnung und Nebenkosten rund 100 EUR im Monat, selbst zu tragen.",
      en: "Housing and bills around EUR 100 a month, paid by the worker.",
      vi: "Nhà ở và hoá đơn khoảng 100 EUR/tháng, người lao động tự trả.",
    },
  },
];
