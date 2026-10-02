import { tuDien } from "../dict";

/**
 * Trang /du-hoc-nghe và /du-hoc-nghe/[nganh].
 * Dữ liệu 8 ngành nằm ở data/i18n/ausbildung.ts — file này chỉ giữ chữ giao diện.
 * Tiếng Đức xưng "Sie"; tiếng Anh gọi "vocational training (Ausbildung)".
 */
export const duHocNghe = tuDien({
  vi: {
    meta: {
      tieuDe: "Du học nghề Đức — Học nghề, có lương, xây dựng tương lai tại châu Âu",
      moTa: "Chương trình đào tạo kép tại Đức: học nghề ba năm, nhận trợ cấp hằng tháng, bằng nghề được công nhận toàn EU. Tám ngành đào tạo và bốn bước tham gia.",
    },
    hero: {
      nhan: "Ausbildung — đào tạo kép",
      tieuDe: "Du học nghề Đức",
      phuDe: "Học nghề – Có lương – Xây dựng tương lai tại châu Âu",
      mo: "Đào tạo kép là mô hình riêng của nước Đức: học tại trường nghề công lập và làm thật tại doanh nghiệp, có trợ cấp hằng tháng và bằng nghề được công nhận toàn EU.",
      khamPha: "Khám phá ngành nghề",
      kiemTra: "Kiểm tra điều kiện",
    },
    nganh: {
      tieuDe: "Khám phá ngành nghề du học nghề Đức",
      ghiChu:
        "Trợ cấp ghi dưới đây là khoảng tham khảo theo mặt bằng ngành, tính theo lương gộp mỗi tháng. Mức thật ghi trong hợp đồng học nghề của từng doanh nghiệp.",
      xemChiTiet: "Xem chi tiết",
    },
    buoc: {
      tieuDe: "Du học nghề Đức hoạt động như thế nào?",
      ds: [
        { so: "01", ten: "Học tiếng", mo: "Đạt trình độ tiếng Đức theo yêu cầu của ngành, thường là B1 hoặc B2." },
        { so: "02", ten: "Chuẩn bị hồ sơ", mo: "Dịch thuật, công nhận bằng cấp và hoàn thiện bộ hồ sơ theo mẫu Đức." },
        { so: "03", ten: "Ký hợp đồng Ausbildung", mo: "Phỏng vấn với doanh nghiệp đào tạo và nhận hợp đồng học nghề." },
        { so: "04", ten: "Sang Đức học và làm", mo: "Nhập học, bắt đầu đào tạo kép và nhận trợ cấp hằng tháng." },
      ],
    },
    viSao: {
      altAnh: "Học viên thực hành tại xưởng đào tạo",
      nhan: "Vì sao chọn đào tạo kép",
      tieuDe: "Ba năm học nghề, cả đời có nghề",
      // Thứ tự khớp với dãy icon trong app/du-hoc-nghe/page.tsx
      loiIch: [
        { ten: "Học lý thuyết + thực hành", mo: "70% thời gian làm thật tại doanh nghiệp, 30% học tại trường nghề công lập." },
        { ten: "Nhận lương hàng tháng", mo: "Doanh nghiệp trả trợ cấp trong suốt thời gian đào tạo, không đóng học phí." },
        { ten: "Bằng nghề Đức", mo: "Chứng chỉ do IHK hoặc HWK cấp, được công nhận trong toàn khối EU." },
        { ten: "Cơ hội sau tốt nghiệp", mo: "Ở lại làm việc đúng nghề, thu nhập cao hơn và thuận lợi cho cư trú lâu dài." },
      ],
      nut: "Đăng ký tư vấn du học nghề",
    },
    // ----- trang ngành /du-hoc-nghe/[nganh] -----
    chiTiet: {
      metaTieuDe: (ten: string, tenDuc: string) => `Du học nghề ${ten} (${tenDuc})`,
      truocTen: "Du học nghề",
      loiTat: { donHang: "Xem đơn hàng ngành này", tuVan: "Đăng ký tư vấn", nganhKhac: "Các ngành khác" },
      tenHeThong: "Tên nghề theo hệ thống Đức:",
      troCapTieuDe: "Trợ cấp tăng dần qua từng năm",
      namThu: (i: number) => `Năm ${i}`,
      moiThang: "mỗi tháng, lương gộp",
      sauTotNghiep: (khoang: string) => `Sau tốt nghiệp: ${khoang}`,
      ghiChuSau: "Khoảng tham khảo theo mặt bằng ngành, chưa tính phụ cấp ca và thưởng.",
      dangKy: "Đăng ký ngành này",
      hocGi: "Bạn sẽ học những gì",
      lamGi: "Ra nghề làm ở đâu",
      hopVoi: "Nghề này hợp với ai",
      trienVong: "Học xong rồi đi đâu tiếp",
      nganhKhac: "Ngành đào tạo khác",
      tu: (tien: string) => `từ ${tien}`,
    },
  },
  en: {
    meta: {
      tieuDe: "Vocational training (Ausbildung) in Germany — Learn a trade, earn while you train, build a future in Europe",
      moTa: "Dual vocational training in Germany: a three-year programme with a monthly training allowance and a qualification recognised throughout the EU. Eight training fields and four steps to take part.",
    },
    hero: {
      nhan: "Ausbildung — dual vocational training",
      tieuDe: "Vocational training in Germany",
      phuDe: "Learn a trade – Earn while you train – Build a future in Europe",
      mo: "Dual vocational training is a model unique to Germany: you study at a state vocational school and work in a real company, with a monthly allowance and a qualification recognised throughout the EU.",
      khamPha: "Explore training fields",
      kiemTra: "Check your eligibility",
    },
    nganh: {
      tieuDe: "Explore vocational training fields in Germany",
      ghiChu:
        "The allowances shown below are indicative ranges for each field, as gross monthly pay. The actual amount is set out in each company's training contract.",
      xemChiTiet: "View details",
    },
    buoc: {
      tieuDe: "How does vocational training in Germany work?",
      ds: [
        { so: "01", ten: "Learn German", mo: "Reach the German level your field requires, usually B1 or B2." },
        { so: "02", ten: "Prepare your documents", mo: "Translation, recognition of qualifications and a complete application file in the German format." },
        { so: "03", ten: "Sign the Ausbildung contract", mo: "Interview with the training company and receive your vocational training contract." },
        { so: "04", ten: "Train and work in Germany", mo: "Enrol, start your dual training and receive a monthly allowance." },
      ],
    },
    viSao: {
      altAnh: "Trainees practising in a training workshop",
      nhan: "Why dual training",
      tieuDe: "Three years of training, a trade for life",
      loiIch: [
        { ten: "Theory and practice", mo: "70% of the time working in a real company, 30% at a state vocational school." },
        { ten: "A monthly allowance", mo: "The company pays an allowance throughout your training; there are no tuition fees." },
        { ten: "A German qualification", mo: "Certificate issued by the IHK or HWK, recognised throughout the EU." },
        { ten: "Opportunities after qualifying", mo: "Stay on and work in your trade, with higher pay and a clearer path to long-term residence." },
      ],
      nut: "Request advice on vocational training",
    },
    chiTiet: {
      metaTieuDe: (ten: string, tenDuc: string) => `Vocational training in ${ten} (${tenDuc})`,
      truocTen: "Vocational training:",
      loiTat: { donHang: "Vacancies in this field", tuVan: "Request advice", nganhKhac: "Other fields" },
      tenHeThong: "Official German occupation title:",
      troCapTieuDe: "An allowance that rises every year",
      namThu: (i: number) => `Year ${i}`,
      moiThang: "per month, gross",
      sauTotNghiep: (khoang: string) => `After qualifying: ${khoang}`,
      ghiChuSau: "Indicative range for the field, excluding shift allowances and bonuses.",
      dangKy: "Apply for this field",
      hocGi: "What you will learn",
      lamGi: "Where you can work",
      hopVoi: "Who this trade suits",
      trienVong: "Where to go next",
      nganhKhac: "Other training fields",
      tu: (tien: string) => `from ${tien}`,
    },
  },
  de: {
    meta: {
      tieuDe: "Ausbildung in Deutschland – Beruf lernen, Vergütung erhalten, Zukunft in Europa aufbauen",
      moTa: "Duale Ausbildung in Deutschland: drei Jahre Ausbildung mit monatlicher Ausbildungsvergütung und einem EU-weit anerkannten Berufsabschluss. Acht Ausbildungsbereiche und vier Schritte zur Teilnahme.",
    },
    hero: {
      nhan: "Duale Ausbildung",
      tieuDe: "Ausbildung in Deutschland",
      phuDe: "Beruf lernen – Vergütung erhalten – Zukunft in Europa aufbauen",
      mo: "Die duale Ausbildung ist ein deutsches Modell: Unterricht an der staatlichen Berufsschule und Praxis im Ausbildungsbetrieb, mit monatlicher Vergütung und einem EU-weit anerkannten Abschluss.",
      khamPha: "Ausbildungsberufe entdecken",
      kiemTra: "Voraussetzungen prüfen",
    },
    nganh: {
      tieuDe: "Ausbildungsbereiche in Deutschland entdecken",
      ghiChu:
        "Die angegebenen Vergütungen sind Richtwerte für die jeweilige Branche, brutto pro Monat. Die tatsächliche Höhe steht im Ausbildungsvertrag des jeweiligen Betriebs.",
      xemChiTiet: "Details ansehen",
    },
    buoc: {
      tieuDe: "Wie funktioniert die Ausbildung in Deutschland?",
      ds: [
        { so: "01", ten: "Deutsch lernen", mo: "Sie erreichen das für den Beruf geforderte Sprachniveau, meist B1 oder B2." },
        { so: "02", ten: "Unterlagen vorbereiten", mo: "Übersetzungen, Anerkennung der Abschlüsse und vollständige Bewerbungsunterlagen nach deutschem Standard." },
        { so: "03", ten: "Ausbildungsvertrag unterschreiben", mo: "Vorstellungsgespräch mit dem Ausbildungsbetrieb und Abschluss des Ausbildungsvertrags." },
        { so: "04", ten: "Ausbildung in Deutschland beginnen", mo: "Mit dem Visum zur Berufsausbildung einreisen, die duale Ausbildung beginnen und monatlich Vergütung erhalten." },
      ],
    },
    viSao: {
      altAnh: "Auszubildende bei der Praxis in einer Lehrwerkstatt",
      nhan: "Warum duale Ausbildung",
      tieuDe: "Drei Jahre Ausbildung, ein Beruf fürs Leben",
      loiIch: [
        { ten: "Theorie und Praxis", mo: "70 % der Zeit im Ausbildungsbetrieb, 30 % an der staatlichen Berufsschule." },
        { ten: "Monatliche Vergütung", mo: "Der Betrieb zahlt während der gesamten Ausbildung eine Vergütung; Schulgeld fällt nicht an." },
        { ten: "Deutscher Berufsabschluss", mo: "Abschluss vor der IHK oder HWK, in der gesamten EU anerkannt." },
        { ten: "Perspektiven nach dem Abschluss", mo: "Weiterarbeit im erlernten Beruf, höheres Einkommen und gute Aussichten auf einen dauerhaften Aufenthalt." },
      ],
      nut: "Beratung zur Ausbildung anfragen",
    },
    chiTiet: {
      metaTieuDe: (ten: string, tenDuc: string) => `Ausbildung ${ten} (${tenDuc})`,
      truocTen: "Ausbildung:",
      loiTat: { donHang: "Stellen in diesem Bereich", tuVan: "Beratung anfragen", nganhKhac: "Weitere Bereiche" },
      tenHeThong: "Offizielle Berufsbezeichnung:",
      troCapTieuDe: "Ausbildungsvergütung steigt jedes Jahr",
      namThu: (i: number) => `${i}. Ausbildungsjahr`,
      moiThang: "brutto pro Monat",
      sauTotNghiep: (khoang: string) => `Nach dem Abschluss: ${khoang}`,
      ghiChuSau: "Richtwert für die Branche, ohne Schichtzulagen und Prämien.",
      dangKy: "Für diesen Beruf bewerben",
      hocGi: "Was Sie lernen",
      lamGi: "Wo Sie arbeiten können",
      hopVoi: "Für wen der Beruf passt",
      trienVong: "Wie es nach der Ausbildung weitergeht",
      nganhKhac: "Weitere Ausbildungsbereiche",
      tu: (tien: string) => `ab ${tien}`,
    },
  },
});
