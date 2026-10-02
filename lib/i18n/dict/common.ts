import { tuDien } from "../dict";

/**
 * KHUNG CHUNG — metadata mặc định, Header, Footer, MenuDay, nút ngôn ngữ.
 * Nhãn menu nằm ở data/nav.ts (dữ liệu nhỏ, Bo<string> ngay trong mục).
 */
export const common = tuDien({
  vi: {
    meta: {
      tieuDe: "NIBELC GROUP GERMANY — Việc làm & Du học nghề tại Đức",
      moTa: "Nền tảng tuyển dụng và du học nghề tại Đức của NIBELC GROUP GERMANY: đơn hàng đang tuyển, chương trình Ausbildung, lộ trình hồ sơ và visa.",
    },
    toiNoiDung: "Tới nội dung",
    menuChinh: "Menu chính",
    logoAria: "NIBELC GROUP — về trang chủ",
    moTim: "Mở tìm kiếm",
    dongTim: "Đóng tìm kiếm",
    timGoiY: "Tìm kiếm đơn hàng, ngành nghề, địa điểm...",
    timAria: "Tìm kiếm",
    nutTim: "Tìm",
    tuVanNgay: "Tư vấn ngay",
    ngonNgu: "Ngôn ngữ",
    chonNgonNgu: "Chọn ngôn ngữ",
    /* MENU ĐẦY ĐỦ — tấm trượt mở từ nút ba chấm ở góc phải banner.
       Nhãn trang KHÔNG để ở đây mà lấy từ data/nav.ts, để một chỗ duy nhất
       giữ tên trang cho cả header, menu đáy lẫn menu này. */
    menuDayDu: {
      nhan: "Menu",
      dong: "Đóng menu",
      goiY: "Tìm đơn hàng, ngành nghề…",
      nhomViec: "Việc làm & học nghề",
      nhomHieu: "Tìm hiểu",
      nhomLienHe: "Liên hệ",
      theoNganh: "Chọn theo ngành nghề",
      soDon: (d: number, s: number) => `${d} đơn · ${s.toLocaleString("de-DE")} suất`,
      soNganh: (n: number) => `${n} ngành đào tạo`,
      moLoTrinh: "Từ hồ sơ tới ngày bay",
      soBai: (n: number) => `${n} bài`,
      dangKy: "Đăng ký tư vấn",
    },
    footer: {
      gioiThieu:
        "Kết nối lao động và học viên Việt Nam với doanh nghiệp tại Đức và châu Âu — từ tuyển chọn, đào tạo tới khi ổn định công việc.",
      chuaCoLink: (ten: string) => `${ten} — chưa có đường dẫn chính thức`,
      menuChanTrang: "Menu chân trang",
      dieuHuong: "Điều hướng",
      nhomNganhAria: "Nhóm ngành nghề",
      nhomNganh: "Nhóm ngành",
      xemTatCa: "Xem tất cả ngành →",
      lienHe: "Liên hệ",
      dangKyTuVan: "Đăng ký tư vấn",
      vanPhong: "Văn phòng Berlin",
      chiDuong: "Chỉ đường",
      banDo: (thanhPho: string) => `Bản đồ văn phòng ${thanhPho}`,
      impressum: "Thông tin pháp lý",
      datenschutz: "Chính sách bảo mật",
    },
  },
  en: {
    meta: {
      tieuDe: "NIBELC GROUP GERMANY — Jobs & Vocational Training in Germany",
      moTa: "NIBELC GROUP GERMANY's platform for jobs and vocational training in Germany: current vacancies, Ausbildung programmes, the application process and visa guidance.",
    },
    toiNoiDung: "Skip to content",
    menuChinh: "Main menu",
    logoAria: "NIBELC GROUP — back to the homepage",
    moTim: "Open search",
    dongTim: "Close search",
    timGoiY: "Search jobs, occupations, locations…",
    timAria: "Search",
    nutTim: "Search",
    tuVanNgay: "Get advice",
    ngonNgu: "Language",
    chonNgonNgu: "Choose language",
    /* MENU ĐẦY ĐỦ — tấm trượt mở từ nút ba chấm ở góc phải banner.
       Nhãn trang KHÔNG để ở đây mà lấy từ data/nav.ts, để một chỗ duy nhất
       giữ tên trang cho cả header, menu đáy lẫn menu này. */
    menuDayDu: {
      nhan: "Menu",
      dong: "Close menu",
      goiY: "Search jobs, occupations…",
      nhomViec: "Jobs & training",
      nhomHieu: "Learn more",
      nhomLienHe: "Contact",
      theoNganh: "Browse by occupation",
      soDon: (d: number, s: number) => `${d} jobs · ${s.toLocaleString("en-GB")} positions`,
      soNganh: (n: number) => `${n} training programmes`,
      moLoTrinh: "From application to departure",
      soBai: (n: number) => `${n} articles`,
      dangKy: "Request advice",
    },
    footer: {
      gioiThieu:
        "Connecting workers and trainees from Vietnam with employers in Germany and across Europe — from selection and training through to settling into the job.",
      chuaCoLink: (ten: string) => `${ten} — official link coming soon`,
      menuChanTrang: "Footer menu",
      dieuHuong: "Navigation",
      nhomNganhAria: "Occupational sectors",
      nhomNganh: "Sectors",
      xemTatCa: "View all sectors →",
      lienHe: "Contact",
      dangKyTuVan: "Book a consultation",
      vanPhong: "Berlin office",
      chiDuong: "Get directions",
      banDo: (thanhPho: string) => `Map of our ${thanhPho} office`,
      impressum: "Legal notice",
      datenschutz: "Privacy policy",
    },
  },
  de: {
    meta: {
      tieuDe: "NIBELC GROUP GERMANY – Arbeit & Ausbildung in Deutschland",
      moTa: "Die Plattform der NIBELC GROUP GERMANY für Arbeit und Ausbildung in Deutschland: aktuelle Stellenangebote, Ausbildungsprogramme, Bewerbungsablauf und Visum.",
    },
    toiNoiDung: "Zum Inhalt springen",
    menuChinh: "Hauptmenü",
    logoAria: "NIBELC GROUP – zur Startseite",
    moTim: "Suche öffnen",
    dongTim: "Suche schließen",
    timGoiY: "Stellen, Berufe oder Orte suchen …",
    timAria: "Suche",
    nutTim: "Suchen",
    tuVanNgay: "Beratung anfragen",
    ngonNgu: "Sprache",
    chonNgonNgu: "Sprache wählen",
    /* MENU ĐẦY ĐỦ — tấm trượt mở từ nút ba chấm ở góc phải banner.
       Nhãn trang KHÔNG để ở đây mà lấy từ data/nav.ts, để một chỗ duy nhất
       giữ tên trang cho cả header, menu đáy lẫn menu này. */
    menuDayDu: {
      nhan: "Menü",
      dong: "Menü schließen",
      goiY: "Stellen, Berufe suchen…",
      nhomViec: "Arbeit & Ausbildung",
      nhomHieu: "Mehr erfahren",
      nhomLienHe: "Kontakt",
      theoNganh: "Nach Berufsfeld",
      soDon: (d: number, s: number) => `${d} Stellen · ${s.toLocaleString("de-DE")} Plätze`,
      soNganh: (n: number) => `${n} Ausbildungsberufe`,
      moLoTrinh: "Vom Antrag bis zum Abflug",
      soBai: (n: number) => `${n} Beiträge`,
      dangKy: "Beratung anfordern",
    },
    footer: {
      gioiThieu:
        "Wir verbinden Fachkräfte und Auszubildende aus Vietnam mit Unternehmen in Deutschland und Europa – von der Auswahl über die Qualifizierung bis zum erfolgreichen Start im Job.",
      chuaCoLink: (ten: string) => `${ten} – offizieller Link folgt`,
      menuChanTrang: "Footer-Navigation",
      dieuHuong: "Navigation",
      nhomNganhAria: "Berufsfelder",
      nhomNganh: "Branchen",
      xemTatCa: "Alle Branchen ansehen →",
      lienHe: "Kontakt",
      dangKyTuVan: "Beratung anfragen",
      vanPhong: "Büro Berlin",
      chiDuong: "Route planen",
      banDo: (thanhPho: string) => `Karte: Büro ${thanhPho}`,
      impressum: "Impressum",
      datenschutz: "Datenschutz",
    },
  },
});
