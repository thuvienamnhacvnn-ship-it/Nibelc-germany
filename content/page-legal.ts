import { LEGAL } from "@/content/legal";

/**
 * Trang Datenschutzerklärung — chỉ tiếng Đức, vì là nghĩa vụ theo DSGVO đối
 * với người ở Đức truy cập trang.
 *
 * Nội dung mô tả ĐÚNG những gì site này thật sự làm:
 *  - không cookie phân tích, không nhúng script bên thứ ba, không mạng xã hội
 *  - font tải từ máy chủ (next/font), không gọi Google Fonts lúc chạy
 *  - hai biểu mẫu lưu nội dung gửi đi để xử lý yêu cầu
 *
 * Người chịu trách nhiệm (Verantwortlicher) lấy từ `content/legal.ts`. Khi
 * CẦN ĐIỀN 01 được duyệt thì bổ sung Geschäftsführer và, nếu có, DSB.
 */

export interface LegalSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const DATENSCHUTZ: { title: string; lead: string; sections: LegalSection[] } = {
  title: "Datenschutzerklärung",
  lead: "Wie diese Website mit personenbezogenen Daten umgeht.",
  sections: [
    {
      title: "Verantwortlicher",
      paragraphs: [
        `${LEGAL.name}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}, ${LEGAL.country}. E-Mail: ${LEGAL.email}, Telefon: ${LEGAL.phone}.`,
      ],
    },
    {
      title: "Keine Cookies, keine Analyse, keine Werbenetzwerke",
      paragraphs: [
        "Diese Website setzt keine Cookies zu Analyse- oder Werbezwecken, bindet keine Tracking-Dienste ein und lädt keine Inhalte von sozialen Netzwerken. Schriften werden vom eigenen Server ausgeliefert, es wird dafür keine Verbindung zu Drittanbietern aufgebaut.",
      ],
    },
    {
      title: "Server-Logdateien",
      paragraphs: [
        "Beim Abruf der Seiten verarbeitet der Hosting-Server technisch notwendige Daten, um die Auslieferung zu ermöglichen und den Betrieb abzusichern:",
      ],
      bullets: [
        "IP-Adresse des anfragenden Geräts",
        "Datum und Uhrzeit des Abrufs",
        "aufgerufene Adresse und übertragene Datenmenge",
        "Browsertyp und Betriebssystem",
      ],
    },
    {
      title: "Kontaktformular und Personalbedarfs-Anfrage",
      paragraphs: [
        "Wenn Sie eines der beiden Formulare absenden, werden die von Ihnen eingetragenen Angaben gespeichert, um Ihre Anfrage zu bearbeiten. Pflichtangaben sind im Formular mit einem Stern gekennzeichnet; alle weiteren Felder sind freiwillig.",
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) beziehungsweise lit. f DSGVO (Bearbeitung Ihrer Anfrage). Die Angaben werden nicht für Werbung verwendet und nicht an Dritte verkauft.",
        "Im Vermittlungsverfahren werden Bewerberunterlagen ausschließlich an das jeweils betroffene Unternehmen und an die im Verfahren zuständigen Stellen weitergegeben.",
      ],
    },
    {
      title: "Speicherdauer",
      paragraphs: [
        "Anfragen werden gelöscht, sobald sie abschließend bearbeitet sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      ],
    },
    {
      title: "Ihre Rechte",
      paragraphs: [
        "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung, auf Datenübertragbarkeit sowie ein Widerspruchsrecht. Wenden Sie sich dafür an die oben genannte Adresse.",
        "Außerdem steht Ihnen ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, etwa bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.",
      ],
    },
  ],
};
