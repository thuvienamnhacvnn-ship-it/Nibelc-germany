import type { BaiBanDich } from "./articles";

/**
 * CẨM NANG — bản tiếng Đức (xưng "Sie"). Khoá theo id bài trong
 * data/articles.ts. Số khối, số đoạn, số gạch đầu dòng PHẢI khớp bản gốc
 * (choThieuBaiViet() kiểm).
 */
export const ARTICLES_DE: Record<string, BaiBanDich> = {
  "hoc-tieng-duc-bao-lau": {
    tieuDe: "Wie lange dauert es, Deutsch bis zur Ausreise zu lernen?",
    tomTat:
      "Von null bis B1 dauert es bei regelmäßigem Lernen meist 10 – 14 Monate. Dieser Beitrag zeigt, wie viele Stunden jedes Niveau erfordert und warum Lernen mit Unterbrechungen doppelt so lange dauert.",
    khoi: [
      {
        tieuDe: "Wie viele Stunden jedes Niveau erfordert",
        doan: [
          "Der Gemeinsame Europäische Referenzrahmen unterscheidet sechs Niveaustufen von A1 bis C2. Wer in Deutschland arbeitet oder eine Ausbildung macht, braucht in der Regel B1; einige Bereiche wie Pflege und IT verlangen B2.",
          "Jede Stufe erfordert meist rund 180 – 240 Unterrichtsstunden und etwa ebenso viel Selbststudium. Bei vier Unterrichtseinheiten pro Woche zu je drei Stunden dauert eine Stufe etwa 3 – 4 Monate.",
        ],
        gach: [
          "A1: Begrüßung, sich vorstellen, einfache Einkäufe",
          "A2: über den Alltag berichten, kurze Durchsagen verstehen",
          "B1: die meisten Situationen am Arbeitsplatz bewältigen, Ereignisse wiedergeben, die eigene Meinung äußern",
          "B2: komplexe Inhalte verstehen, sich fließend über Fachthemen austauschen",
        ],
      },
      {
        tieuDe: "Warum Lernen mit Unterbrechungen doppelt so lange dauert",
        doan: [
          "Im Deutschen ändern sich die Endungen nach Genus, Kasus und Numerus. Das bleibt nur bei ständiger Wiederholung hängen. Zwei Wochen Pause bedeuten, einen Teil der Grammatik fast von vorn lernen zu müssen.",
          "Wer zwölf Monate lang viermal pro Woche lernt, besteht in der Regel B1. Wer 20 Monate lang mit Unterbrechungen lernt, steht oft noch bei A2. Gleiche Stundenzahl, anderes Ergebnis.",
        ],
        luuY: "Betrachten Sie den Sprachkurs in der Vorbereitungszeit als Ihre Hauptaufgabe. Er ist die Investition, die darüber entscheidet, für welche Stellen Sie infrage kommen und wie viel Sie verdienen.",
      },
      {
        tieuDe: "Fachwortschatz früh lernen",
        doan: [
          "Das B1-Zertifikat bringt Ihre Bewerbung durch die Prüfung. Was Ihnen aber durch die erste Woche am Arbeitsplatz hilft, ist der Wortschatz Ihres Berufs: Namen von Werkzeugen, Arbeitsschritten und die Anweisungen Ihrer Vorgesetzten.",
          "Lassen Sie sich frühzeitig eine Liste mit Fachvokabular geben und lernen Sie sie parallel zum Hauptkurs – warten Sie nicht, bis Sie B1 bestanden haben.",
        ],
      },
    ],
  },
  "thang-dau-tien-o-duc": {
    tieuDe: "Was im ersten Monat in Deutschland zu erledigen ist",
    tomTat:
      "Anmeldung, Krankenversicherung, Bankkonto, Steuer-ID – vier Formalitäten, die früh erledigt werden müssen und in einer festen Reihenfolge voneinander abhängen.",
    khoi: [
      {
        tieuDe: "Die richtige Reihenfolge der vier Formalitäten",
        doan: [
          "Diese vier Formalitäten greifen ineinander: Wer die Reihenfolge nicht einhält, muss von vorn beginnen. Bewährt hat sich, zuerst den Wohnsitz anzumelden und danach alles Weitere zu erledigen.",
        ],
        gach: [
          "1. Anmeldung – Wohnsitzanmeldung beim Bürgeramt; erforderlich ist die Wohnungsgeberbestätigung Ihres Vermieters",
          "2. Krankenversicherung – wählen Sie eine gesetzliche Krankenkasse; sie vergibt die Versicherungsnummer, die Ihr Arbeitgeber für die Lohnabrechnung benötigt",
          "3. Bankkonto – dafür brauchen Sie die Meldebescheinigung und Ihren Reisepass",
          "4. Steuer-ID – wird Ihnen nach der Anmeldung automatisch per Post zugeschickt",
        ],
        luuY: "Ohne Anmeldung lässt sich kaum ein Bankkonto eröffnen, und ohne Bankkonto kann Ihr Arbeitgeber kein Gehalt zahlen. Erledigen Sie die Anmeldung in den ersten zwei Wochen.",
      },
      {
        tieuDe: "Unterlagen, die Sie immer dabeihaben sollten",
        gach: [
          "Reisepass mit Visum",
          "Ausgedruckter Arbeits- oder Ausbildungsvertrag",
          "Meldebescheinigung",
          "Krankenversicherungskarte",
          "Bankverbindung",
        ],
      },
      {
        tieuDe: "Post immer öffnen",
        doan: [
          "In Deutschland läuft alles Wichtige per Brief: Ausländerbehörde, Finanzamt, Versicherungen, Banken. Viele Schreiben enthalten eine Frist für Ihre Antwort.",
          "Sorgen Sie dafür, dass Ihr Name am Briefkasten steht, und öffnen Sie jeden Umschlag sofort. Wenn Sie den Inhalt nicht verstehen, fotografieren Sie ihn und fragen Sie Ihre Beraterin oder Ihren Berater bzw. Ihre Ansprechperson im Betrieb.",
        ],
      },
    ],
  },
  "doc-bang-luong-duc": {
    tieuDe: "Die deutsche Gehaltsabrechnung lesen: Warum Sie weniger erhalten, als im Vertrag steht",
    tomTat:
      "Im Vertrag steht das Bruttogehalt. Nach Lohnsteuer und vier Pflichtversicherungen liegt der ausgezahlte Betrag meist 20 – 40 % darunter. Dieser Beitrag erklärt jede Zeile.",
    khoi: [
      {
        tieuDe: "Brutto und Netto",
        doan: [
          "Brutto ist das Gehalt, das im Vertrag steht. Netto ist der Betrag, der auf Ihrem Konto ankommt. Die Differenz sind Steuern und Sozialversicherungsbeiträge, die vor der Auszahlung automatisch abgezogen werden.",
          "Dieses Geld ist nicht verloren. Renten-, Kranken-, Arbeitslosen- und Pflegeversicherung schützen Sie bei Krankheit, bei Arbeitslosigkeit und im Alter.",
        ],
      },
      {
        tieuDe: "Die vier Pflichtversicherungen",
        gach: [
          "Rentenversicherung – Altersvorsorge, etwa 9,3 % Arbeitnehmeranteil",
          "Krankenversicherung – etwa 8,5 %, je nach Krankenkasse",
          "Pflegeversicherung – etwa 1,8 %, für Kinderlose mit Zuschlag",
          "Arbeitslosenversicherung – etwa 1,3 %",
        ],
        doan: ["Ihr Arbeitgeber zahlt zusätzlich einen vergleichbaren Anteil; dieser erscheint nicht im Nettobetrag Ihrer Abrechnung."],
      },
      {
        tieuDe: "Die Steuerklasse verändert den Betrag erheblich",
        doan: [
          "Ledige werden in Steuerklasse I eingestuft. Verheiratete, deren Ehepartner weniger verdient, können in Steuerklasse III eingestuft werden und zahlen deutlich weniger Steuern. Fragen Sie danach gleich nach der Ankunft – wer es zu spät beantragt, erhält das Geld erst mit der Steuererklärung am Jahresende zurück.",
        ],
        luuY: "Geben Sie am Jahresende eine Steuererklärung ab. Viele Beschäftigte erhalten eine spürbare Erstattung für Fahrtkosten, Ausbildungskosten und Unterhalt für Angehörige.",
      },
    ],
  },
  "van-hoa-lam-viec-duc": {
    tieuDe: "Arbeitskultur in Deutschland: die fünf größten Überraschungen",
    tomTat:
      "Absolute Pünktlichkeit, direkte Kommunikation, Krankmeldung nach Vorschrift, Feierabend ist Feierabend – und Urlaub ist ein Anspruch, keine Bitte.",
    khoi: [
      {
        tieuDe: "Pünktlich heißt fünf Minuten früher",
        doan: [
          "In Deutschland gilt es bereits als Verspätung, genau zu Schichtbeginn einzutreffen: Zu dieser Uhrzeit müssen Sie arbeitsbereit sein, nicht erst durch das Tor gehen. Wiederholte Unpünktlichkeit ist ein rechtlich zulässiger Kündigungsgrund.",
        ],
      },
      {
        tieuDe: "Direkt ist nicht unhöflich",
        doan: [
          "In Deutschland gibt man Rückmeldungen direkt und konkret. Das kann schroff klingen, wenn man eine indirektere Ausdrucksweise gewohnt ist – es ist aber die übliche Arbeitsweise gegenüber allen und nicht gegen Sie persönlich gerichtet.",
          "Umgekehrt gilt: Wenn Sie eine Aufgabe nicht verstehen, sagen Sie es sofort. Stilles Nicken und anschließende Fehler werden weit strenger bewertet als eine Rückfrage.",
        ],
      },
      {
        tieuDe: "Krankmeldung – aber richtig",
        doan: [
          "Eine Erkrankung müssen Sie Ihrem Arbeitgeber vor Schichtbeginn und bereits am ersten Tag melden. Dauert sie länger als die festgelegte Anzahl an Tagen, benötigen Sie eine ärztliche Arbeitsunfähigkeitsbescheinigung.",
          "Wer sich ordnungsgemäß krankmeldet, erhält weiterhin Entgelt nach den gesetzlichen Vorschriften. Wer unentschuldigt fehlt, riskiert, dass dies als Arbeitsverweigerung gewertet wird.",
        ],
        luuY: "Klären Sie in der ersten Woche: Bei wem Sie sich krankmelden, unter welcher Telefonnummer, und ab welchem Tag eine ärztliche Bescheinigung nötig ist.",
      },
      {
        tieuDe: "Feierabend ist Feierabend – und Urlaub ist Ihr Recht",
        doan: [
          "Das deutsche Arbeitszeitrecht begrenzt die Arbeitszeit und schreibt Ruhezeiten zwischen zwei Schichten vor. Länger zu bleiben gilt nicht als Fleiß, sondern als ineffizientes Arbeiten oder als Regelverstoß.",
          "Die Urlaubstage in Ihrem Vertrag stehen Ihnen zu. Beantragen Sie sie rechtzeitig über das im Betrieb übliche Verfahren – um einen Gefallen bitten müssen Sie nicht.",
        ],
      },
    ],
  },
  "tranh-lua-dao": {
    tieuDe: "Acht Anzeichen für ein unseriöses Stellenangebot",
    tomTat:
      "Garantiertes Visum, Drängen auf eine schnelle Anzahlung, kein Einblick in den Vertrag vor der Unterschrift – bei solchen Anzeichen sollten Sie innehalten und prüfen.",
    khoi: [
      {
        tieuDe: "Acht Anzeichen, bei denen Sie innehalten sollten",
        gach: [
          "Eine Garantie, dass das Visum erteilt wird. Das kann niemand garantieren, denn die Entscheidung liegt bei den deutschen Auslandsvertretungen.",
          "Drängen auf eine Überweisung noch am selben Tag, mit dem Hinweis, die Plätze seien bald vergeben.",
          "Kein Einblick in den vollständigen Arbeitsvertrag vor der Unterschrift.",
          "Ein Verdienst weit über dem üblichen Niveau des Berufs, ohne nachvollziehbare Begründung.",
          "Keine klare Angabe des Arbeitgebers und des Arbeitsorts.",
          "Die Aufforderung, auf ein Privatkonto statt auf ein Firmenkonto zu zahlen.",
          "Keine Rechnung und keine Quittung für irgendeine Zahlung.",
          "Kontakt ausschließlich über Social-Media-Konten, ohne Büroadresse, die man aufsuchen kann.",
        ],
      },
      {
        tieuDe: "Drei Schritte, bevor Sie irgendetwas unterschreiben",
        gach: [
          "Verlangen Sie eine Übersetzung des Vertrags in Ihre Sprache und lesen Sie jede Klausel zu Gehalt, Arbeitszeit, Unterkunft und Laufzeit.",
          "Besuchen Sie das Büro des Unternehmens mindestens einmal persönlich. Eine echte Adresse, echte Menschen, echte Arbeitsplätze.",
          "Fragen Sie direkt: Welche Zahlungen werden bei Ablehnung des Visums erstattet, wie schnell, und in welcher Vertragsklausel steht das?",
        ],
        luuY: "Zusagen gelten nur, wenn sie im Vertrag stehen. Versprechen am Telefon oder per Nachricht sind keine rechtliche Grundlage.",
      },
    ],
  },
  "dinh-cu-va-gia-dinh": {
    tieuDe: "Von der Arbeitserlaubnis zur Niederlassung und zum Familiennachzug",
    tomTat:
      "Der Weg vom Arbeitsvisum zur unbefristeten Niederlassungserlaubnis und die Voraussetzungen, um Ehepartner und Kinder nach Deutschland nachzuholen.",
    khoi: [
      {
        tieuDe: "Die drei Stufen des Aufenthaltsrechts",
        gach: [
          "Visum – wird von der Botschaft erteilt und gilt für kurze Zeit zur Einreise.",
          "Aufenthaltserlaubnis – wird nach der Einreise von der Ausländerbehörde erteilt und ist an die Beschäftigung oder Ausbildung gebunden.",
          "Niederlassungserlaubnis – unbefristet; wird erteilt, wenn Sie ausreichend lange in Deutschland leben, ausreichend lange Rentenbeiträge gezahlt haben, die erforderlichen Sprachkenntnisse besitzen und Ihren Lebensunterhalt selbst sichern.",
        ],
      },
      {
        tieuDe: "Familiennachzug",
        doan: [
          "Der Nachzug von Ehepartnern und minderjährigen Kindern ist ein im deutschen Recht verankerter Anspruch, jedoch an Bedingungen geknüpft: ausreichender Wohnraum, ein Einkommen, das die ganze Familie ohne Sozialleistungen trägt, und in der Regel einfache Deutschkenntnisse der nachziehenden Person.",
          "Ihr Einkommen und Ihre Wohnsituation in den ersten Jahren bestimmen daher unmittelbar, wann Ihre Familie nachkommen kann.",
        ],
        luuY: "Jedes Beitragsjahr in der Rentenversicherung zählt. Auch deshalb lohnt es sich, nach Vertrag zu arbeiten und Schwarzarbeit zu vermeiden.",
      },
    ],
  },
  "gui-tien-ve-nha": {
    tieuDe: "Geld nach Hause schicken: So vermeiden Sie unnötige Verluste",
    tomTat:
      "Überweisungsgebühren und Wechselkurse kosten mehr, als viele denken. Dieser Beitrag zeigt, wie Sie die tatsächlichen Kosten vergleichen und was Sie vermeiden sollten.",
    khoi: [
      {
        tieuDe: "Die tatsächlichen Kosten bestehen aus zwei Teilen",
        doan: [
          "Die angezeigte Gebühr ist nur ein Teil. Der Rest steckt im Wechselkurs: Ein Anbieter verlangt vielleicht keine Gebühr, rechnet aber mit einem Kurs, der einige Prozent unter dem Marktkurs liegt.",
          "Richtig vergleichen Sie, indem Sie prüfen, wie viel Ihre Familie für denselben Eurobetrag tatsächlich erhält – nicht anhand der Gebührenzeile.",
        ],
      },
      {
        tieuDe: "Was Sie vermeiden sollten",
        gach: [
          "Bargeld über Bekannte nach Hause mitgeben, ganz ohne Belege.",
          "Dienste ohne Zulassung nutzen, die ungewöhnlich gute Wechselkurse versprechen.",
          "Im ersten Monat das gesamte Einkommen nach Hause schicken, ohne eine Rücklage zu behalten.",
        ],
        luuY: "Behalten Sie immer eine Rücklage von mindestens einem Monat Lebenshaltungskosten in Deutschland. Mietkaution, Arztkosten oder ein verspätetes Gehalt können jederzeit vorkommen.",
      },
    ],
  },
  "chuan-bi-hanh-ly": {
    tieuDe: "Was Sie nach Deutschland mitnehmen sollten – und was nicht",
    tomTat:
      "Für aufgegebenes Gepäck gilt eine Gewichtsgrenze. Die folgende Liste setzt auf Dinge, die in Deutschland schwer erhältlich oder teuer sind, und streicht alles, was nur Gewicht kostet.",
    khoi: [
      {
        tieuDe: "Mitnehmen",
        gach: [
          "Alle Originalunterlagen samt Übersetzungen, im Handgepäck",
          "Ihre regelmäßigen Medikamente mit einem ins Englische oder Deutsche übersetzten Rezept",
          "Brille, Sicherheitsschuhe oder vertrautes Werkzeug Ihres Berufs, sofern leicht",
          "Thermo-Unterwäsche – der deutsche Winter ist länger, als Sie denken",
          "Einige typische, platzsparende getrocknete Gewürze",
        ],
      },
      {
        tieuDe: "Nicht mitnehmen",
        gach: [
          "Frische Lebensmittel, Fleisch, Milchprodukte – die Einfuhrbestimmungen der EU verbieten sie, sie werden beschlagnahmt",
          "Sperrige Töpfe, Pfannen und Bettzeug – gebrauchte Haushaltswaren sind in Deutschland sehr günstig",
          "Eine dicke Winterjacke – besser vor Ort passend zum Klima kaufen",
          "Größere Bargeldbeträge ohne Anmeldung – oberhalb des gesetzlichen Schwellenwerts müssen Sie sie beim Zoll anmelden",
        ],
        luuY: "Fotografieren Sie alle wichtigen Unterlagen und speichern Sie sie in Ihrem eigenen E-Mail-Postfach. Geht das Gepäck verloren, haben Sie noch Kopien für den Ersatz.",
      },
    ],
  },
};
