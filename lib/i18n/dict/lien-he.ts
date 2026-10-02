import { tuDien } from "../dict";

/**
 * TRANG /lien-he + PHIẾU TƯ VẤN 4 BƯỚC (components/contact/ConsultationWizard.tsx)
 *
 * Lựa chọn trong phiếu lưu theo MÃ (vd "a1", "som") chứ không lưu chữ hiển
 * thị — đổi ngôn ngữ giữa chừng vẫn đúng, và thư gửi đi ghi đúng nhãn.
 */

export const MA_TIENG = ["chua", "a1", "a2", "b1", "b2"] as const;
export const MA_HOC_VAN = ["thcs", "thpt", "trungCap", "daiHoc"] as const;
export const MA_CHUONG_TRINH = ["laoDong", "duHoc", "chua"] as const;
export const MA_THOI_GIAN = ["som", "6thang", "12thang", "chua"] as const;

type Nhan<M extends readonly string[]> = Record<M[number], string>;

export const lienHe = tuDien<{
  meta: { tieuDe: string; moTa: (diaChi: string) => string };
  nhan: string;
  tieuDe: string;
  mo: string;
  whatsapp: string;
  banDo: (diaChi: string) => string;
  phieu: {
    buoc: [string, string, string, string];
    chuBuoc: (so: string) => string;
    truong: {
      hoTen: string;
      ngaySinh: string;
      ngaySinhGoiY: string;
      dienThoai: string;
      email: string;
      noiO: string;
      hocVan: string;
      nganh: string;
      chuongTrinh: string;
      thoiGian: string;
      tieng: string;
      ghiChu: string;
    };
    chon: string;
    loi: {
      hoTen: string;
      dienThoai: string;
      dienThoaiSai: string;
      email: string;
      ngaySinh: string;
      nganh: string;
    };
    tieng: Nhan<typeof MA_TIENG>;
    hocVan: Nhan<typeof MA_HOC_VAN>;
    chuongTrinh: Nhan<typeof MA_CHUONG_TRINH>;
    thoiGian: Nhan<typeof MA_THOI_GIAN>;
    kiemTra: string;
    tomTat: {
      hoTen: string;
      ngaySinh: string;
      dienThoai: string;
      email: string;
      noiO: string;
      hocVan: string;
      tieng: string;
      nganh: string;
      chuongTrinh: string;
      thoiGian: string;
      ghiChu: string;
    };
    luuY: string;
    quayLai: string;
    tiepTuc: string;
    gui: string;
    tieuDeThu: (ten: string) => string;
    xong: {
      tieuDe: string;
      noiDung: (dienThoai: string, email: string) => string;
      dienLai: string;
    };
  };
}>({
  vi: {
    meta: {
      tieuDe: "Liên hệ — Bắt đầu hành trình của bạn tại Đức",
      moTa: (d) => `Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp. ${d}.`,
    },
    nhan: "Trung tâm tư vấn NIBELC",
    tieuDe: "Bắt đầu hành trình của bạn tại Đức",
    mo: "Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp.",
    whatsapp: "WhatsApp / tư vấn trực tuyến — liên hệ qua số trên",
    banDo: (d) => `Bản đồ ${d}`,
    phieu: {
      buoc: ["Thông tin", "Nhu cầu", "Hồ sơ", "Gửi tư vấn"],
      chuBuoc: (so) => `Bước ${so}`,
      truong: {
        hoTen: "Họ và tên",
        ngaySinh: "Ngày sinh",
        ngaySinhGoiY: "VD 1998",
        dienThoai: "Số điện thoại",
        email: "Email",
        noiO: "Nơi đang sinh sống",
        hocVan: "Trình độ học vấn",
        nganh: "Ngành nghề quan tâm",
        chuongTrinh: "Chương trình",
        thoiGian: "Thời gian mong muốn sang Đức",
        tieng: "Trình độ tiếng Đức",
        ghiChu: "Ghi chú thêm về hồ sơ, kinh nghiệm hoặc câu hỏi của bạn",
      },
      chon: "— Chọn —",
      loi: {
        hoTen: "Cần họ và tên",
        dienThoai: "Cần số điện thoại để gọi lại",
        dienThoaiSai: "Số điện thoại chưa đúng",
        email: "Email chưa đúng",
        ngaySinh: "Ghi năm sinh (VD 1998) hoặc dd/mm/yyyy",
        nganh: "Chọn một ngành nghề quan tâm",
      },
      tieng: { chua: "Chưa học", a1: "A1", a2: "A2", b1: "B1", b2: "B2 trở lên" },
      hocVan: {
        thcs: "Trung học cơ sở",
        thpt: "Trung học phổ thông",
        trungCap: "Trung cấp / Cao đẳng",
        daiHoc: "Đại học",
      },
      chuongTrinh: { laoDong: "Lao động", duHoc: "Du học nghề", chua: "Chưa quyết định" },
      thoiGian: {
        som: "Càng sớm càng tốt",
        "6thang": "Trong 6 tháng tới",
        "12thang": "Trong 12 tháng tới",
        chua: "Chưa xác định",
      },
      kiemTra: "Kiểm tra lại thông tin",
      tomTat: {
        hoTen: "Họ và tên",
        ngaySinh: "Ngày sinh",
        dienThoai: "Điện thoại",
        email: "Email",
        noiO: "Nơi sinh sống",
        hocVan: "Học vấn",
        tieng: "Tiếng Đức",
        nganh: "Ngành nghề",
        chuongTrinh: "Chương trình",
        thoiGian: "Thời gian",
        ghiChu: "Ghi chú",
      },
      luuY:
        "Bấm gửi sẽ mở trình email của bạn với nội dung trên. Không có dữ liệu nào được gửi đi trước khi bạn tự bấm gửi trong email.",
      quayLai: "Quay lại",
      tiepTuc: "Tiếp tục",
      gui: "Gửi thông tin tư vấn",
      tieuDeThu: (ten) => `Đăng ký tư vấn — ${ten}`,
      xong: {
        tieuDe: "Đã mở thư gửi chuyên viên",
        noiDung: (dt, em) =>
          `Trình email của bạn đã mở sẵn nội dung đăng ký. Bấm gửi trong đó là chuyên viên NIBELC nhận được. Nếu thư không tự mở, gọi ${dt} hoặc gửi tới ${em}.`,
        dienLai: "Điền phiếu khác",
      },
    },
  },
  en: {
    meta: {
      tieuDe: "Contact — Start your journey to Germany",
      moTa: (d) => `Leave your details and the NIBELC team will advise you on the right programme. ${d}.`,
    },
    nhan: "NIBELC advisory centre",
    tieuDe: "Start your journey to Germany",
    mo: "Leave your details and the NIBELC team will advise you on the right programme.",
    whatsapp: "WhatsApp / online consultation — via the number above",
    banDo: (d) => `Map: ${d}`,
    phieu: {
      buoc: ["Your details", "Your goals", "Your profile", "Send request"],
      chuBuoc: (so) => `Step ${so}`,
      truong: {
        hoTen: "Full name",
        ngaySinh: "Date of birth",
        ngaySinhGoiY: "e.g. 1998",
        dienThoai: "Phone number",
        email: "Email",
        noiO: "Current place of residence",
        hocVan: "Education",
        nganh: "Field of interest",
        chuongTrinh: "Programme",
        thoiGian: "When would you like to start in Germany?",
        tieng: "German language level",
        ghiChu: "Anything else about your background, experience or questions",
      },
      chon: "— Please select —",
      loi: {
        hoTen: "Please enter your full name",
        dienThoai: "Please enter a phone number so we can call you back",
        dienThoaiSai: "Please check the phone number",
        email: "Please check the email address",
        ngaySinh: "Enter your year of birth (e.g. 1998) or dd/mm/yyyy",
        nganh: "Please choose a field of interest",
      },
      tieng: { chua: "No German yet", a1: "A1", a2: "A2", b1: "B1", b2: "B2 or higher" },
      hocVan: {
        thcs: "Lower secondary school",
        thpt: "Upper secondary school",
        trungCap: "Vocational school / College",
        daiHoc: "University degree",
      },
      chuongTrinh: { laoDong: "Employment", duHoc: "Vocational training (Ausbildung)", chua: "Not decided yet" },
      thoiGian: {
        som: "As soon as possible",
        "6thang": "Within the next 6 months",
        "12thang": "Within the next 12 months",
        chua: "Not sure yet",
      },
      kiemTra: "Please review your details",
      tomTat: {
        hoTen: "Full name",
        ngaySinh: "Date of birth",
        dienThoai: "Phone",
        email: "Email",
        noiO: "Residence",
        hocVan: "Education",
        tieng: "German",
        nganh: "Field",
        chuongTrinh: "Programme",
        thoiGian: "Timing",
        ghiChu: "Notes",
      },
      luuY:
        "Clicking “Send consultation request” opens your email program with the details above. Nothing is sent until you press send in your email yourself.",
      quayLai: "Back",
      tiepTuc: "Continue",
      gui: "Send consultation request",
      tieuDeThu: (ten) => `Consultation request — ${ten}`,
      xong: {
        tieuDe: "Your email to our advisers is ready",
        noiDung: (dt, em) =>
          `Your email program has opened with your request filled in. Just press send and a NIBELC adviser will receive it. If it did not open, call ${dt} or write to ${em}.`,
        dienLai: "Fill in another form",
      },
    },
  },
  de: {
    meta: {
      tieuDe: "Kontakt – Starten Sie Ihren Weg nach Deutschland",
      moTa: (d) => `Hinterlassen Sie Ihre Kontaktdaten – das NIBELC-Team berät Sie zum passenden Programm. ${d}.`,
    },
    nhan: "NIBELC Beratungszentrum",
    tieuDe: "Starten Sie Ihren Weg nach Deutschland",
    mo: "Hinterlassen Sie Ihre Kontaktdaten – das NIBELC-Team berät Sie zum passenden Programm.",
    whatsapp: "WhatsApp / Online-Beratung – über die oben genannte Nummer",
    banDo: (d) => `Karte: ${d}`,
    phieu: {
      buoc: ["Ihre Daten", "Ihr Ziel", "Ihr Profil", "Anfrage senden"],
      chuBuoc: (so) => `Schritt ${so}`,
      truong: {
        hoTen: "Vor- und Nachname",
        ngaySinh: "Geburtsdatum",
        ngaySinhGoiY: "z. B. 1998",
        dienThoai: "Telefonnummer",
        email: "E-Mail",
        noiO: "Aktueller Wohnort",
        hocVan: "Schulbildung",
        nganh: "Gewünschtes Berufsfeld",
        chuongTrinh: "Programm",
        thoiGian: "Gewünschter Start in Deutschland",
        tieng: "Deutschkenntnisse",
        ghiChu: "Weitere Angaben zu Ihrem Werdegang, Ihrer Berufserfahrung oder Ihre Fragen",
      },
      chon: "– Bitte wählen –",
      loi: {
        hoTen: "Bitte geben Sie Ihren Namen an",
        dienThoai: "Bitte geben Sie eine Telefonnummer für den Rückruf an",
        dienThoaiSai: "Bitte prüfen Sie die Telefonnummer",
        email: "Bitte prüfen Sie die E-Mail-Adresse",
        ngaySinh: "Bitte Geburtsjahr (z. B. 1998) oder TT.MM.JJJJ angeben",
        nganh: "Bitte wählen Sie ein Berufsfeld",
      },
      tieng: { chua: "Keine Kenntnisse", a1: "A1", a2: "A2", b1: "B1", b2: "B2 oder höher" },
      hocVan: {
        thcs: "Mittlerer Schulabschluss (9. Klasse)",
        thpt: "Abitur (12. Klasse)",
        trungCap: "Berufsfachschule / College",
        daiHoc: "Hochschulabschluss",
      },
      chuongTrinh: { laoDong: "Arbeitsstelle", duHoc: "Ausbildung", chua: "Noch offen" },
      thoiGian: {
        som: "So bald wie möglich",
        "6thang": "In den nächsten 6 Monaten",
        "12thang": "In den nächsten 12 Monaten",
        chua: "Noch unklar",
      },
      kiemTra: "Bitte prüfen Sie Ihre Angaben",
      tomTat: {
        hoTen: "Name",
        ngaySinh: "Geburtsdatum",
        dienThoai: "Telefon",
        email: "E-Mail",
        noiO: "Wohnort",
        hocVan: "Schulbildung",
        tieng: "Deutsch",
        nganh: "Berufsfeld",
        chuongTrinh: "Programm",
        thoiGian: "Zeitpunkt",
        ghiChu: "Anmerkungen",
      },
      luuY:
        "Mit „Beratungsanfrage absenden“ öffnet sich Ihr E-Mail-Programm mit den obigen Angaben. Es werden keine Daten übertragen, bevor Sie die E-Mail selbst absenden.",
      quayLai: "Zurück",
      tiepTuc: "Weiter",
      gui: "Beratungsanfrage absenden",
      tieuDeThu: (ten) => `Beratungsanfrage – ${ten}`,
      xong: {
        tieuDe: "Ihre E-Mail an unser Beratungsteam ist vorbereitet",
        noiDung: (dt, em) =>
          `Ihr E-Mail-Programm wurde mit Ihrer Anfrage geöffnet. Senden Sie die E-Mail ab, damit unser Beratungsteam sie erhält. Falls sich nichts geöffnet hat, rufen Sie uns unter ${dt} an oder schreiben Sie an ${em}.`,
        dienLai: "Weiteres Formular ausfüllen",
      },
    },
  },
});
