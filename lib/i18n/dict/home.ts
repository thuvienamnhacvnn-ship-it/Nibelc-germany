import { tuDien } from "../dict";
import type { ChuTieuDe } from "@/components/home/CumTieuDe";

/**
 * TRANG CHỦ — app/page.tsx, components/home/*, hooks/useHeroJobRotation.ts,
 * components/ui/CtaCuoiTrang.tsx (khối CTA cuối các trang con).
 *
 * Tiêu đề hero tiếng Đức GIỮ "Arbeiten in Deutschland / mit Nibelc Germany GmbH"
 * (bản vi cũng để nguyên câu tiếng Đức này — xem cờ `dong1De`).
 */
export const home = tuDien<{
  hero: ChuTieuDe;
  /** true = dòng 1–2 là câu tiếng Đức cố ý giữ trong bản này → bọc lang="de" */
  dong1De: boolean;
  logoAria: string;
  tim: {
    goiY: string;
    aria: string;
    nut: string;
    dsGoiY: string;
    nhanNganh: string;
    soDon: (n: number) => string;
  };
  rail: {
    aria: string;
    truoc: string;
    sau: string;
    nganh: (ten: string) => string;
    /**
     * Nhãn NGẮN in trên phong bì (khoá = industry.id), như ảnh phong bì bản vi
     * chỉ in "Điều dưỡng" chứ không in cả "Điều dưỡng / Y tế". Bản vi để
     * trống: 8 phong bì dùng ảnh, 4 phong bì CSS dùng titleVi như cũ.
     */
    phongBi: Partial<Record<string, string>>;
  };
  the: {
    dangTuyen: string;
    soSuat: (n: number) => string;
    tiengDuc: (cap: string) => string;
    xemDon: string;
    ungTuyen: string;
    thoaThuan: string;
  };
  bang: {
    aria: string;
    donTai: (ten: string, noi: string) => string;
  };
  noiBat: {
    nhan: string;
    tieuDe: string;
    mo: string;
    tatCa: string;
  };
  chuongTrinh: { nhan: string; tieuDe: string; mo: string; nut: string }[];
  cta: {
    nhan: string;
    tieuDe: string;
    mo: string;
    dangKy: string;
    goi: (so: string) => string;
  };
}>({
  vi: {
    hero: {
      dong1a: "Arbeiten in",
      dong1b: "Deutschland",
      dong2: "mit Nibelc Germany GmbH",
      dong3: "ĐỐI TÁC UY TÍN",
      dong4: "LỰA CHỌN TỐT NHẤT CỦA BẠN",
      dong5: "CHO VIỆC LÀM VÀ HỌC NGHỀ TẠI ĐỨC, CHÂU ÂU",
    },
    dong1De: true,
    logoAria: "NIBELC GERMANY — trang chủ",
    tim: {
      goiY: "Tìm đơn hàng, ngành nghề…",
      aria: "Tìm kiếm đơn hàng, ngành nghề, địa điểm",
      nut: "Tìm",
      dsGoiY: "Gợi ý tìm kiếm",
      nhanNganh: "Nhóm ngành",
      soDon: (n) => `${n} đơn hàng`,
    },
    rail: {
      aria: "Danh mục ngành nghề",
      truoc: "Xem ngành phía trước",
      sau: "Xem ngành tiếp theo",
      nganh: (ten) => `Ngành ${ten}`,
      phongBi: {},
    },
    the: {
      dangTuyen: "ĐANG TUYỂN",
      soSuat: (n) => `${n} suất`,
      tiengDuc: (cap) => `Tiếng ${cap}`,
      xemDon: "Xem đơn hàng",
      ungTuyen: "Ứng tuyển",
      thoaThuan: "Theo thoả thuận",
    },
    bang: {
      aria: "Đơn hàng đang tuyển",
      donTai: (ten, noi) => `${ten} tại ${noi}`,
    },
    noiBat: {
      nhan: "Đang tuyển",
      tieuDe: "Đơn hàng nổi bật",
      mo: "Vị trí, thu nhập và số suất lấy đúng theo thông báo tuyển dụng của từng đơn.",
      tatCa: "Tất cả đơn hàng",
    },
    chuongTrinh: [
      {
        nhan: "Đi làm việc",
        tieuDe: "Hợp đồng lao động tại Đức và châu Âu",
        mo: "Có thu nhập ngay, chuẩn bị 4 – 8 tháng, yêu cầu tiếng A2 – B1 tuỳ đơn hàng.",
        nut: "Xem đơn hàng",
      },
      {
        nhan: "Du học nghề",
        tieuDe: "Ausbildung — học nghề có lương",
        mo: "Ba năm đào tạo kép, nhận trợ cấp hằng tháng, bằng nghề Đức được công nhận toàn EU.",
        nut: "Xem ngành đào tạo",
      },
    ],
    cta: {
      nhan: "Trung tâm tư vấn NIBELC",
      tieuDe: "Bắt đầu hành trình cùng NIBELC",
      mo: "Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp.",
      dangKy: "Đăng ký tư vấn",
      goi: (so) => `Gọi ${so}`,
    },
  },
  en: {
    hero: {
      dong1a: "Work in",
      dong1b: "Germany",
      dong2: "with Nibelc Germany GmbH",
      dong3: "YOUR TRUSTED PARTNER",
      dong4: "THE BEST CHOICE FOR WORK AND",
      dong5: "VOCATIONAL TRAINING IN GERMANY AND EUROPE",
    },
    dong1De: false,
    logoAria: "NIBELC GERMANY — homepage",
    tim: {
      goiY: "Search jobs, occupations…",
      aria: "Search jobs, occupations and locations",
      nut: "Search",
      dsGoiY: "Search suggestions",
      nhanNganh: "Sector",
      soDon: (n) => (n === 1 ? "1 vacancy" : `${n} vacancies`),
    },
    rail: {
      aria: "Occupational sectors",
      truoc: "Previous sectors",
      sau: "Next sectors",
      nganh: (ten) => `Sector: ${ten}`,
      phongBi: {
        pflege: "Nursing",
        gastronomie: "Hospitality",
        elektro: "Electrical",
        mechanik: "Metal & Welding",
        logistik: "Logistics",
        kosmetik: "Beauty",
        bau: "Construction",
        automotive: "Automotive",
        it: "IT",
        handel: "Retail",
        landwirtschaft: "Agriculture",
        soziales: "Social Care",
      },
    },
    the: {
      dangTuyen: "NOW HIRING",
      soSuat: (n) => (n === 1 ? "1 opening" : `${n} openings`),
      tiengDuc: (cap) => `German ${cap}`,
      xemDon: "View vacancy",
      ungTuyen: "Apply",
      thoaThuan: "Negotiable",
    },
    bang: {
      aria: "Current vacancies",
      donTai: (ten, noi) => `${ten} – ${noi}`,
    },
    noiBat: {
      nhan: "Now hiring",
      tieuDe: "Featured vacancies",
      mo: "Positions, pay and number of openings are taken directly from each employer's job notice.",
      tatCa: "All vacancies",
    },
    chuongTrinh: [
      {
        nhan: "Employment",
        tieuDe: "Employment contracts in Germany and Europe",
        mo: "Earn from day one. Preparation takes 4–8 months; German at A2–B1 is required, depending on the position.",
        nut: "View vacancies",
      },
      {
        nhan: "Vocational training",
        tieuDe: "Ausbildung — paid vocational training",
        mo: "Three years of dual training with a monthly allowance and a German qualification recognised throughout the EU.",
        nut: "View training programmes",
      },
    ],
    cta: {
      nhan: "NIBELC advice centre",
      tieuDe: "Start your journey with NIBELC",
      mo: "Leave your details and the NIBELC team will advise you on the right programme.",
      dangKy: "Book a consultation",
      goi: (so) => `Call ${so}`,
    },
  },
  de: {
    hero: {
      dong1a: "Arbeiten in",
      dong1b: "Deutschland",
      dong2: "mit Nibelc Germany GmbH",
      dong3: "IHR VERLÄSSLICHER PARTNER",
      dong4: "DIE BESTE WAHL FÜR ARBEIT UND",
      dong5: "AUSBILDUNG IN DEUTSCHLAND UND EUROPA",
    },
    dong1De: false,
    logoAria: "NIBELC GERMANY – Startseite",
    tim: {
      goiY: "Stellen, Berufe suchen…",
      aria: "Stellen, Berufe oder Orte suchen",
      nut: "Suchen",
      dsGoiY: "Suchvorschläge",
      nhanNganh: "Branche",
      soDon: (n) => (n === 1 ? "1 Stellenangebot" : `${n} Stellenangebote`),
    },
    rail: {
      aria: "Berufsfelder",
      truoc: "Vorherige Branchen",
      sau: "Weitere Branchen",
      nganh: (ten) => `Branche: ${ten}`,
      // U+00AD (gạch nối mềm): từ ghép dài chỉ ngắt ở đúng chỗ khi phong bì hẹp
      phongBi: {
        pflege: "Pflege",
        gastronomie: "Gastronomie",
        elektro: "Elektro",
        mechanik: "Metall & Schweißen",
        logistik: "Logistik",
        kosmetik: "Kosmetik",
        bau: "Bau",
        automotive: "Kfz-Technik",
        it: "IT",
        handel: "Handel",
        landwirtschaft: "Landwirt\u00ADschaft",
        soziales: "Soziales",
      },
    },
    the: {
      dangTuyen: "AKTUELL",
      soSuat: (n) => (n === 1 ? "1 Stelle" : `${n} Stellen`),
      tiengDuc: (cap) => `Deutsch ${cap}`,
      xemDon: "Stelle ansehen",
      ungTuyen: "Bewerben",
      thoaThuan: "Nach Vereinbarung",
    },
    bang: {
      aria: "Aktuelle Stellenangebote",
      donTai: (ten, noi) => `${ten} – ${noi}`,
    },
    noiBat: {
      nhan: "Aktuelle Stellen",
      tieuDe: "Ausgewählte Stellenangebote",
      mo: "Positionen, Vergütung und Anzahl der Stellen entsprechen genau der jeweiligen Stellenausschreibung.",
      tatCa: "Alle Stellenangebote",
    },
    chuongTrinh: [
      {
        nhan: "Arbeiten",
        tieuDe: "Arbeitsverträge in Deutschland und Europa",
        mo: "Einkommen ab dem ersten Arbeitstag. Die Vorbereitung dauert 4–8 Monate; je nach Stelle sind Deutschkenntnisse auf Niveau A2–B1 erforderlich.",
        nut: "Stellenangebote ansehen",
      },
      {
        nhan: "Ausbildung",
        tieuDe: "Ausbildung – bezahlte Berufsausbildung",
        mo: "Drei Jahre duale Ausbildung mit monatlicher Ausbildungsvergütung und einem deutschen Berufsabschluss, der in der gesamten EU anerkannt ist.",
        nut: "Ausbildungsberufe ansehen",
      },
    ],
    cta: {
      nhan: "NIBELC Beratungszentrum",
      tieuDe: "Starten Sie Ihren Weg mit NIBELC",
      mo: "Hinterlassen Sie Ihre Kontaktdaten – das NIBELC-Team berät Sie zum passenden Programm.",
      dangKy: "Beratung anfragen",
      goi: (so) => `Anrufen: ${so}`,
    },
  },
});
