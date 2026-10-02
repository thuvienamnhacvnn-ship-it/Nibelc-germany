import { tuDien } from "../dict";

/**
 * Trang /lo-trinh + components/journey/JourneyTimeline.tsx.
 * Dữ liệu 9 chặng nằm ở data/i18n/journey.ts — file này chỉ giữ chữ giao diện.
 */
export const loTrinh = tuDien({
  vi: {
    meta: {
      tieuDe: "Lộ trình từ Việt Nam đến Đức",
      moTa: "Chín chặng từ lúc tư vấn tới khi ổn định tại Đức: hồ sơ, tiếng Đức, phỏng vấn, hợp đồng, visa, xuất cảnh và onboarding.",
    },
    hero: {
      nhan: "Hành trình kiến tạo tương lai",
      tieuDe: "Lộ trình từ Việt Nam đến Đức",
      mo: "Đồng hành cùng bạn trên từng bước, an toàn, minh bạch và hiệu quả.",
      loiTat: { donHang: "Xem đơn hàng", duHocNghe: "Du học nghề", tuVan: "Đăng ký tư vấn" },
    },
    timeline: {
      viec: "Công việc cần làm",
      giay: "Giấy tờ cần chuẩn bị",
      hoTro: "NIBELC hỗ trợ",
      ketQua: "Kết quả của bước này",
      banDangO: "Bạn đang ở bước nào?",
    },
  },
  en: {
    meta: {
      tieuDe: "Your route from Vietnam to Germany",
      moTa: "Nine stages from the first consultation to settling in Germany: documents, German language, interview, contract, visa, departure and onboarding.",
    },
    hero: {
      nhan: "A journey that builds your future",
      tieuDe: "Your route from Vietnam to Germany",
      mo: "We support you at every step — safely, transparently and effectively.",
      loiTat: { donHang: "View vacancies", duHocNghe: "Vocational training", tuVan: "Request advice" },
    },
    timeline: {
      viec: "What to do",
      giay: "Documents to prepare",
      hoTro: "How NIBELC supports you",
      ketQua: "Outcome of this stage",
      banDangO: "Which stage are you at?",
    },
  },
  de: {
    meta: {
      tieuDe: "Ihr Weg von Vietnam nach Deutschland",
      moTa: "Neun Etappen von der ersten Beratung bis zum Ankommen in Deutschland: Unterlagen, Deutschkurs, Vorstellungsgespräch, Vertrag, Visum, Ausreise und Onboarding.",
    },
    hero: {
      nhan: "Ihr Weg in die Zukunft",
      tieuDe: "Ihr Weg von Vietnam nach Deutschland",
      mo: "Wir begleiten Sie bei jedem Schritt – sicher, transparent und zielgerichtet.",
      loiTat: { donHang: "Stellenangebote", duHocNghe: "Ausbildung", tuVan: "Beratung anfragen" },
    },
    timeline: {
      viec: "Was zu tun ist",
      giay: "Benötigte Unterlagen",
      hoTro: "Unterstützung durch NIBELC",
      ketQua: "Ergebnis dieser Etappe",
      banDangO: "Wo stehen Sie gerade?",
    },
  },
});
