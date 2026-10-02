import { tuDien } from "../dict";
import { LEGAL } from "@/data/company";

/**
 * PHÁP LÝ — /impressum và /datenschutz.
 *
 * Bản tiếng Đức là văn bản pháp lý gốc (§ 5 DDG — Digitale-Dienste-Gesetz,
 * thay § 5 TMG từ 14.05.2024; Art. 13 DSGVO). Bản tiếng Việt và tiếng Anh dịch
 * toàn bộ (trưởng nhóm chốt 02/10 theo lệnh Sếp "không lẫn ngôn ngữ"), thuật
 * ngữ pháp lý giữ tên gốc trong ngoặc, kèm ghi chú + link sang bản /de là bản
 * có giá trị pháp lý.
 *
 * KHÔNG bịa dữ kiện: Registergericht/HRB/Geschäftsführer/USt-IdNr. chưa có
 * → trang giữ cổng chặn impressumComplete() (data/company.ts).
 * Địa chỉ trong văn bản pháp lý giữ LEGAL.country ("Deutschland").
 */

type GhiChu = { mo: string; link: string };

export type TruongThieu = "handelsregister" | "hrb" | "geschaeftsfuehrer" | "ustIdNr";

type Impressum = {
  meta: { tieuDe: string; moTa: string };
  hero: { nhan: string; tieuDe: string; mo: string };
  /** Ghi chú "bản tiếng Đức có giá trị pháp lý" + chữ của link sang bản /de — null ở bản tiếng Đức */
  ghiChu: GhiChu | null;
  anbieter: string;
  kontakt: string;
  telefon: string;
  email: string;
  rechtsform: string;
  rechtsformWert: string;
  register: string;
  vertretung: string;
  ust: string;
  ergaenzt: { tieuDe: string; mo: string };
  thieu: Record<TruongThieu, string>;
  haftung: { tieuDe: string; mo: string };
  datenschutz: { tieuDe: string; truoc: string; link: string; sau: string };
};

const IMPRESSUM_DE: Impressum = {
  meta: { tieuDe: "Impressum", moTa: "Angaben gemäß § 5 DDG für NIBELC Germany GmbH, Berlin." },
  hero: { nhan: "Rechtliches", tieuDe: "Impressum", mo: "Angaben gemäß § 5 DDG." },
  ghiChu: null,
  anbieter: "Diensteanbieter",
  kontakt: "Kontakt",
  telefon: "Telefon",
  email: "E-Mail",
  rechtsform: "Rechtsform",
  rechtsformWert: LEGAL.rechtsform,
  register: "Registereintrag",
  vertretung: "Vertretungsberechtigt",
  ust: "Umsatzsteuer-Identifikationsnummer",
  ergaenzt: {
    tieuDe: "Registerangaben werden ergänzt",
    mo: "Folgende nach § 5 DDG erforderliche Angaben liegen der Redaktion dieser Website noch nicht in belegbarer Form vor und werden nachgetragen, sobald sie bestätigt sind:",
  },
  thieu: {
    handelsregister: "Registergericht",
    hrb: "Registernummer (HRB)",
    geschaeftsfuehrer: "Geschäftsführer / vertretungsberechtigte Person",
    ustIdNr: "Umsatzsteuer-Identifikationsnummer (sofern vorhanden)",
  },
  haftung: {
    tieuDe: "Haftung für Inhalte und Links",
    mo: "Die Inhalte dieser Website werden mit Sorgfalt erstellt. Angaben zu Stellen, Vergütungen und Ausbildungsbedingungen geben den Stand der jeweiligen Ausschreibung wieder und ersetzen keinen Arbeits- oder Ausbildungsvertrag. Für Inhalte externer Links sind deren Betreiber verantwortlich.",
  },
  datenschutz: {
    tieuDe: "Datenschutz",
    truoc: "Informationen zur Verarbeitung personenbezogener Daten finden Sie in der",
    link: "Datenschutzerklärung",
    sau: ".",
  },
};

export const impressum = tuDien<Impressum>({
  vi: {
    meta: {
      tieuDe: "Thông tin pháp lý",
      moTa: "Thông tin bắt buộc theo § 5 DDG (Luật Dịch vụ số của Đức) của NIBELC Germany GmbH, Berlin.",
    },
    hero: { nhan: "Pháp lý", tieuDe: "Thông tin pháp lý", mo: "Thông tin bắt buộc theo § 5 DDG (Luật Dịch vụ số của Đức)." },
    ghiChu: {
      mo: "Bản tiếng Việt chỉ nhằm mục đích tham khảo. Bản tiếng Đức là bản có giá trị pháp lý.",
      link: "Impressum (Deutsch)",
    },
    anbieter: "Đơn vị cung cấp dịch vụ",
    kontakt: "Liên hệ",
    telefon: "Điện thoại",
    email: "Email",
    rechtsform: "Loại hình doanh nghiệp",
    rechtsformWert: "Công ty trách nhiệm hữu hạn (GmbH)",
    register: "Đăng ký thương mại (Handelsregister)",
    vertretung: "Người đại diện theo pháp luật",
    ust: "Mã số thuế giá trị gia tăng (USt-IdNr.)",
    ergaenzt: {
      tieuDe: "Thông tin đăng ký đang được bổ sung",
      mo: "Những thông tin sau đây, bắt buộc theo § 5 DDG, ban biên tập trang web chưa có ở dạng có thể chứng minh và sẽ được bổ sung ngay khi được xác nhận:",
    },
    thieu: {
      handelsregister: "Toà án đăng ký thương mại (Registergericht)",
      hrb: "Số đăng ký thương mại (HRB)",
      geschaeftsfuehrer: "Giám đốc điều hành (Geschäftsführer) / người đại diện theo pháp luật",
      ustIdNr: "Mã số thuế giá trị gia tăng (USt-IdNr., nếu có)",
    },
    haftung: {
      tieuDe: "Trách nhiệm đối với nội dung và liên kết",
      mo: "Nội dung trang web này được biên soạn cẩn thận. Thông tin về vị trí tuyển dụng, mức lương và điều kiện học nghề phản ánh tình trạng của từng thông báo tuyển dụng tại thời điểm đăng và không thay thế hợp đồng lao động hay hợp đồng học nghề. Nội dung của các liên kết bên ngoài thuộc trách nhiệm của đơn vị vận hành trang đó.",
    },
    datenschutz: {
      tieuDe: "Bảo vệ dữ liệu",
      truoc: "Thông tin về việc xử lý dữ liệu cá nhân có trong",
      link: "Chính sách bảo mật",
      sau: ".",
    },
  },
  en: {
    meta: {
      tieuDe: "Legal notice",
      moTa: "Information pursuant to § 5 DDG (German Digital Services Act) for NIBELC Germany GmbH, Berlin.",
    },
    hero: { nhan: "Legal", tieuDe: "Legal notice", mo: "Information pursuant to § 5 DDG (German Digital Services Act)." },
    ghiChu: {
      mo: "This English translation is provided for information only. Only the German version of this legal notice is legally binding.",
      link: "Impressum (Deutsch)",
    },
    anbieter: "Service provider",
    kontakt: "Contact",
    telefon: "Phone",
    email: "Email",
    rechtsform: "Legal form",
    rechtsformWert: "Limited liability company (GmbH)",
    register: "Commercial register entry",
    vertretung: "Authorised representative",
    ust: "VAT identification number",
    ergaenzt: {
      tieuDe: "Register details to follow",
      mo: "The following details required under § 5 DDG are not yet available to the editors of this website in verifiable form and will be added as soon as they have been confirmed:",
    },
    thieu: {
      handelsregister: "Registry court",
      hrb: "Commercial register number (HRB)",
      geschaeftsfuehrer: "Managing director / authorised representative",
      ustIdNr: "VAT identification number (if applicable)",
    },
    haftung: {
      tieuDe: "Liability for content and links",
      mo: "The content of this website is prepared with care. Information on vacancies, pay and training conditions reflects the status of the respective advertisement and does not replace an employment or training contract. The operators of external websites are responsible for the content of those links.",
    },
    datenschutz: {
      tieuDe: "Data protection",
      truoc: "Information on the processing of personal data can be found in our",
      link: "privacy policy",
      sau: ".",
    },
  },
  de: IMPRESSUM_DE,
});

type MucDs = { h: string; p: string[]; ul?: string[] };
type Datenschutz = {
  meta: { tieuDe: string; moTa: string };
  hero: { nhan: string; tieuDe: string; mo: string };
  /** Ghi chú "bản tiếng Đức có giá trị pháp lý" + chữ của link sang bản /de — null ở bản tiếng Đức */
  ghiChu: GhiChu | null;
  muc: MucDs[];
};

const DIA_CHI = `${LEGAL.name}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}, ${LEGAL.country}`;

const DATENSCHUTZ_DE: Datenschutz = {
  meta: {
    tieuDe: "Datenschutzerklärung",
    moTa: "Informationen nach Art. 13 DSGVO zur Verarbeitung personenbezogener Daten auf dieser Website.",
  },
  hero: { nhan: "Rechtliches", tieuDe: "Datenschutzerklärung", mo: "Informationen nach Art. 13 DSGVO." },
  ghiChu: null,
  muc: [
    {
      h: "1. Verantwortliche Stelle",
      p: [`${DIA_CHI}. E-Mail: ${LEGAL.email}. Telefon: ${LEGAL.phone}.`],
    },
    {
      h: "2. Keine Cookies, keine Analyse-Dienste",
      p: [
        "Diese Website setzt keine Cookies zu Analyse-, Werbe- oder Profilbildungszwecken. Es sind keine Dienste von Drittanbietern zur Reichweitenmessung, kein Tracking-Pixel und keine Werbenetzwerke eingebunden.",
        "Aus diesem Grund erscheint auf dieser Website auch kein Einwilligungsbanner: es gibt nichts einzuwilligen.",
      ],
    },
    {
      h: "3. Server-Logdateien",
      p: [
        "Beim Abruf der Seiten verarbeitet der Hosting-Dienstleister technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt der Anfrage, aufgerufene Adresse, übertragene Datenmenge und Browserkennung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.",
      ],
    },
    {
      h: "4. Beratungsformular",
      p: [
        "Das Formular auf dieser Website überträgt Ihre Eingaben nicht automatisch an einen Server. Erst wenn Sie die Schaltfläche zum Senden betätigen, öffnet sich Ihr eigenes E-Mail-Programm mit einem vorbereiteten Text. Der Versand erfolgt durch Sie und über Ihren eigenen E-Mail-Anbieter.",
      ],
    },
    {
      h: "5. Kontaktaufnahme per E-Mail oder Telefon",
      p: [
        "Nehmen Sie Kontakt mit uns auf, verarbeiten wir die von Ihnen mitgeteilten Daten zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf einen Vertrag gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f DSGVO.",
        "Daten aus Bewerbungen werden für die Dauer des Auswahl- und Vermittlungsverfahrens gespeichert und anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      ],
    },
    {
      h: "6. Weitergabe an Dritte",
      p: [
        "Eine Weitergabe Ihrer Bewerbungsunterlagen an Arbeitgeber oder Ausbildungsbetriebe erfolgt nur nach Ihrer ausdrücklichen Zustimmung und nur an die konkret benannte Stelle. Eine Übermittlung zu Werbezwecken findet nicht statt.",
      ],
    },
    {
      h: "7. Kartendarstellung",
      p: [
        "Die Kartenansicht auf der Kontaktseite wird von OpenStreetMap eingebettet. Beim Laden der Karte wird Ihre IP-Adresse an die OpenStreetMap Foundation übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
      ],
    },
    {
      h: "8. Ihre Rechte",
      p: ["Ihnen stehen nach der DSGVO insbesondere folgende Rechte zu:"],
      ul: [
        "Auskunft über die zu Ihrer Person verarbeiteten Daten (Art. 15)",
        "Berichtigung unrichtiger Daten (Art. 16)",
        "Löschung (Art. 17) und Einschränkung der Verarbeitung (Art. 18)",
        "Datenübertragbarkeit (Art. 20)",
        "Widerspruch gegen die Verarbeitung (Art. 21)",
        "Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77)",
      ],
    },
  ],
};

export const datenschutz = tuDien<Datenschutz>({
  vi: {
    meta: {
      tieuDe: "Chính sách bảo mật",
      moTa: "Thông tin theo Điều 13 GDPR (DSGVO) về việc xử lý dữ liệu cá nhân trên trang web này.",
    },
    hero: { nhan: "Pháp lý", tieuDe: "Chính sách bảo mật", mo: "Thông tin theo Điều 13 GDPR (DSGVO)." },
    ghiChu: {
      mo: "Bản tiếng Việt chỉ nhằm mục đích tham khảo. Bản tiếng Đức là bản có giá trị pháp lý.",
      link: "Datenschutzerklärung (Deutsch)",
    },
    muc: [
      {
        h: "1. Đơn vị chịu trách nhiệm",
        p: [`${DIA_CHI}. Email: ${LEGAL.email}. Điện thoại: ${LEGAL.phone}.`],
      },
      {
        h: "2. Không cookie, không dịch vụ phân tích",
        p: [
          "Trang web này không dùng cookie cho mục đích phân tích, quảng cáo hay lập hồ sơ người dùng. Không nhúng dịch vụ đo lường lượt truy cập của bên thứ ba, không có điểm ảnh theo dõi (tracking pixel) và không có mạng quảng cáo.",
          "Vì vậy trang web này cũng không hiện hộp xin đồng ý: không có gì cần bạn đồng ý.",
        ],
      },
      {
        h: "3. Tệp nhật ký máy chủ",
        p: [
          "Khi bạn mở trang, đơn vị cung cấp dịch vụ lưu trữ xử lý các dữ liệu truy cập cần thiết về kỹ thuật như địa chỉ IP, thời điểm truy cập, địa chỉ được mở, dung lượng dữ liệu truyền đi và thông tin trình duyệt. Cơ sở pháp lý là Điều 6 khoản 1 điểm f GDPR. Các dữ liệu này không được ghép với nguồn dữ liệu nào khác.",
        ],
      },
      {
        h: "4. Phiếu đăng ký tư vấn",
        p: [
          "Phiếu trên trang web này không tự động gửi thông tin bạn nhập lên máy chủ. Chỉ khi bạn bấm nút gửi, chương trình email của chính bạn mới mở ra với nội dung soạn sẵn. Việc gửi do bạn thực hiện, qua nhà cung cấp email của chính bạn.",
        ],
      },
      {
        h: "5. Liên hệ qua email hoặc điện thoại",
        p: [
          "Khi bạn liên hệ với chúng tôi, chúng tôi xử lý dữ liệu bạn cung cấp để giải quyết yêu cầu của bạn. Cơ sở pháp lý là Điều 6 khoản 1 điểm b GDPR nếu yêu cầu hướng tới một hợp đồng, các trường hợp còn lại là Điều 6 khoản 1 điểm f GDPR.",
          "Dữ liệu từ hồ sơ ứng tuyển được lưu trong suốt quá trình tuyển chọn và giới thiệu việc làm, sau đó được xoá, trừ khi luật bắt buộc phải lưu giữ.",
        ],
      },
      {
        h: "6. Chuyển dữ liệu cho bên thứ ba",
        p: [
          "Hồ sơ ứng tuyển của bạn chỉ được chuyển cho doanh nghiệp tuyển dụng hoặc cơ sở đào tạo nghề khi bạn đồng ý rõ ràng, và chỉ cho đúng đơn vị đã nêu tên. Không chuyển dữ liệu cho mục đích quảng cáo.",
        ],
      },
      {
        h: "7. Hiển thị bản đồ",
        p: [
          "Bản đồ trên trang liên hệ được nhúng từ OpenStreetMap. Khi bản đồ được tải, địa chỉ IP của bạn được truyền tới OpenStreetMap Foundation. Cơ sở pháp lý là Điều 6 khoản 1 điểm f GDPR.",
        ],
      },
      {
        h: "8. Quyền của bạn",
        p: ["Theo GDPR, bạn có các quyền sau đây:"],
        ul: [
          "Được biết dữ liệu cá nhân nào của bạn đang được xử lý (Điều 15)",
          "Yêu cầu sửa dữ liệu sai (Điều 16)",
          "Yêu cầu xoá (Điều 17) và hạn chế xử lý dữ liệu (Điều 18)",
          "Yêu cầu chuyển dữ liệu (Điều 20)",
          "Phản đối việc xử lý dữ liệu (Điều 21)",
          "Khiếu nại tới cơ quan giám sát bảo vệ dữ liệu (Điều 77)",
        ],
      },
    ],
  },
  en: {
    meta: {
      tieuDe: "Privacy policy",
      moTa: "Information under Art. 13 GDPR on the processing of personal data on this website.",
    },
    hero: { nhan: "Legal", tieuDe: "Privacy policy", mo: "Information under Art. 13 GDPR." },
    ghiChu: {
      mo: "This English translation is provided for information only. Only the German version of this privacy policy is legally binding.",
      link: "Datenschutzerklärung (Deutsch)",
    },
    muc: [
      {
        h: "1. Controller",
        p: [`${DIA_CHI}. Email: ${LEGAL.email}. Phone: ${LEGAL.phone}.`],
      },
      {
        h: "2. No cookies, no analytics services",
        p: [
          "This website does not use cookies for analytics, advertising or profiling purposes. No third-party audience measurement services, tracking pixels or advertising networks are embedded.",
          "For this reason, no consent banner appears on this website: there is nothing to consent to.",
        ],
      },
      {
        h: "3. Server log files",
        p: [
          "When pages are accessed, the hosting provider processes technically necessary access data such as IP address, time of the request, requested address, volume of data transferred and browser identifier. The legal basis is Art. 6(1)(f) GDPR. These data are not combined with other data sources.",
        ],
      },
      {
        h: "4. Consultation form",
        p: [
          "The form on this website does not transmit your entries to a server automatically. Only when you press the send button does your own email program open with a prepared text. The message is sent by you, through your own email provider.",
        ],
      },
      {
        h: "5. Contacting us by email or phone",
        p: [
          "If you contact us, we process the data you provide in order to handle your enquiry. The legal basis is Art. 6(1)(b) GDPR where the enquiry relates to a contract, and otherwise Art. 6(1)(f) GDPR.",
          "Data from applications are stored for the duration of the selection and placement process and deleted afterwards, unless statutory retention obligations require otherwise.",
        ],
      },
      {
        h: "6. Disclosure to third parties",
        p: [
          "Your application documents are passed on to employers or training companies only with your express consent and only to the specifically named recipient. No data are transferred for advertising purposes.",
        ],
      },
      {
        h: "7. Map display",
        p: [
          "The map on the contact page is embedded from OpenStreetMap. When the map loads, your IP address is transmitted to the OpenStreetMap Foundation. The legal basis is Art. 6(1)(f) GDPR.",
        ],
      },
      {
        h: "8. Your rights",
        p: ["Under the GDPR you have, in particular, the following rights:"],
        ul: [
          "Access to the personal data processed about you (Art. 15)",
          "Rectification of inaccurate data (Art. 16)",
          "Erasure (Art. 17) and restriction of processing (Art. 18)",
          "Data portability (Art. 20)",
          "Objection to processing (Art. 21)",
          "Complaint to a data protection supervisory authority (Art. 77)",
        ],
      },
    ],
  },
  de: DATENSCHUTZ_DE,
});
