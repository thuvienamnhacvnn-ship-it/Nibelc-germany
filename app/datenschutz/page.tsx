import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LEGAL } from "@/data/company";
import "../trang-sang.css";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen nach Art. 13 DSGVO zur Verarbeitung personenbezogener Daten auf dieser Website.",
  robots: { index: false },
};

const MUC: { h: string; p: string[]; ul?: string[] }[] = [
  {
    h: "1. Verantwortliche Stelle",
    p: [
      `${LEGAL.name}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}, ${LEGAL.country}. E-Mail: ${LEGAL.email}. Telefon: ${LEGAL.phone}.`,
    ],
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
];

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/lien-he.jpg"
        nhan="Rechtliches"
        tieuDe="Datenschutzerklärung"
        mo="Informationen nach Art. 13 DSGVO."
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* Máy tính: cùng mép trái với banner (khung .nb-wrap 1400/32, >1440 là 1600/40)
            thay vì một cột 820px căn giữa lệch khỏi chữ banner; dòng chữ vẫn giới hạn 820px. */}
        <section className="mx-auto max-w-[820px] px-8 py-14 lg:max-w-[1400px] lg:py-20 lg:[&>*]:max-w-[820px] min-[1441px]:max-w-[1600px] min-[1441px]:px-10">
          {MUC.map((m, i) => (
            <section key={m.h} className={i > 0 ? "mt-9" : ""}>
              <h2 className="nb-display text-[21px] text-white">{m.h}</h2>
              <span className="mt-3 mb-4 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />
              {m.p.map((p) => (
                <p key={p} className="mt-3.5 text-[15.5px] leading-[1.9] text-[var(--nb-text-dim)]">
                  {p}
                </p>
              ))}
              {m.ul && (
                <ul className="mt-4 space-y-2">
                  {m.ul.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] leading-[1.8] text-[var(--nb-text-dim)]">
                      <span
                        className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]"
                        aria-hidden="true"
                      />
                      {x}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </section>
      </div>
    </div>
  );
}
