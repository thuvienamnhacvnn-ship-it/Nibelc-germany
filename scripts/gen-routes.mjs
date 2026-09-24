/**
 * Sinh các route shell còn lại.
 *
 * Lý do có script này: `typedRoutes: true` làm build fail nếu một <Link href>
 * trỏ tới route chưa tồn tại. Các trang dưới đây là khung thật (có h1, có
 * metadata, có nội dung khung) chứ không phải trang giả — nội dung chi tiết
 * đổ vào ở Phase 2/3.
 *
 * Không trang nào chứa số liệu, mức lương hay khẳng định pháp lý.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

/** @type {{path:string, title:string, lang:'de'|'vi', lead:string, gate?:string}[]} */
const PAGES = [
  {
    path: "app/(public)/fuer-unternehmen",
    title: "Für Unternehmen",
    lang: "de",
    lead: "Fachkräftemangel lässt sich nicht mit einer einzelnen Stellenanzeige lösen. Wir bereiten Kandidatinnen und Kandidaten fachlich und sprachlich vor und begleiten die Verfahrensschritte bis zum Arbeitsstart.",
    gate: "07",
  },
  {
    path: "app/(public)/fuer-bewerber",
    title: "Für Bewerber aus Vietnam",
    lang: "de",
    lead: "Dieser Bereich richtet sich an Bewerberinnen und Bewerber aus Vietnam. Die ausführlichen Informationen stehen auf Vietnamesisch zur Verfügung.",
  },
  {
    path: "app/(public)/prozess",
    title: "Prozess",
    lang: "de",
    lead: "Arbeitgeber und Bewerber durchlaufen dieselben Checkpoints mit unterschiedlichen Aufgaben: Vorauswahl, fachliche Prüfung, Vorbereitung, Vertrag, Anerkennung und Visum, Einreise, Integration.",
    gate: "08",
  },
  {
    path: "app/(public)/integration",
    title: "Integration",
    lang: "de",
    lead: "Der Arbeitsstart entscheidet darüber, ob eine Vermittlung trägt. Sprachliche Vorbereitung, betriebliches Onboarding und Begleitung nach der Ankunft gehören deshalb zum Verfahren.",
  },
  {
    path: "app/(public)/wissen",
    title: "Wissen",
    lang: "de",
    lead: "Hintergründe zu Anerkennung, Aufenthalt und betrieblicher Integration. Alle Beiträge nennen Stand und Zuständigkeit und ersetzen keine individuelle Rechtsberatung.",
  },
  {
    path: "app/(public)/ueber-uns",
    title: "Über uns",
    lang: "de",
    lead: "NIBELC verbindet Betriebe in Deutschland mit Fachkräften aus Vietnam.",
    gate: "05",
  },
  {
    path: "app/(public)/kontakt",
    title: "Kontakt",
    lang: "de",
    lead: "Beschreiben Sie Ihren Personalbedarf oder vereinbaren Sie ein Beratungsgespräch.",
    gate: "01",
  },
  {
    path: "app/(public)/impressum",
    title: "Impressum",
    lang: "de",
    lead: "Angaben gemäß § 5 TMG.",
    gate: "01",
  },
  {
    path: "app/(public)/datenschutz",
    title: "Datenschutz",
    lang: "de",
    lead: "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.",
    gate: "01",
  },
  {
    path: "app/(public)/cookies",
    title: "Cookies",
    lang: "de",
    lead: "Diese Website verwendet nur technisch notwendige Cookies, solange keine weiteren Dienste freigegeben sind.",
  },
  {
    path: "app/(public)/barrierefreiheit",
    title: "Barrierefreiheit",
    lang: "de",
    lead: "Ziel ist die Einhaltung von WCAG 2.2 Stufe AA. Hinweise auf Barrieren nehmen wir entgegen.",
  },

  {
    path: "app/(public)/vi/nguoi-lao-dong",
    title: "Dành cho người lao động",
    lang: "vi",
    lead: "Đây là cổng thông tin dành cho người Việt muốn sang Đức làm việc. Mọi thông tin ở đây viết riêng cho bạn, không phải bản dịch của trang tiếng Đức.",
  },
  {
    path: "app/(public)/vi/lo-trinh",
    title: "Lộ trình đi làm tại Đức",
    lang: "vi",
    lead: "Từ lúc đăng ký nguyện vọng đến khi bắt đầu đi làm, bạn đi qua các chặng: kiểm tra hồ sơ nghề, học tiếng, phỏng vấn với doanh nghiệp, hoàn thiện hồ sơ, nhập cảnh và hoà nhập.",
    gate: "08",
  },
  {
    path: "app/(public)/vi/ho-so",
    title: "Hồ sơ cần chuẩn bị",
    lang: "vi",
    lead: "Danh sách giấy tờ phụ thuộc vào ngành nghề và tình trạng bằng cấp của bạn.",
    gate: "08",
  },
  {
    path: "app/(public)/vi/hoi-dap",
    title: "Hỏi đáp",
    lang: "vi",
    lead: "Những câu được hỏi nhiều nhất về điều kiện, thời gian và chi phí.",
    gate: "07",
  },
  {
    path: "app/(public)/vi/dang-ky",
    title: "Đăng ký quan tâm",
    lang: "vi",
    lead: "Điền thông tin để NIBELC liên hệ tư vấn. Việc đăng ký không phải là cam kết tuyển dụng và không thay thế thủ tục chính thức.",
  },
];

const tpl = ({ title, lang, lead, gate }) => {
  const viAttr = lang === "vi" ? ' lang="vi"' : "";
  const gateImport = gate
    ? 'import { Gated } from "@/components/Gated";\n'
    : "";
  const gateBlock = gate
    ? `\n        <div className="mt-10">\n          <Gated code="${gate}">\n            <div />\n          </Gated>\n        </div>\n`
    : "";

  return `import type { Metadata } from "next";
${gateImport}
export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
};

export default function Page() {
  return (
    <section${viAttr}>
      <div className="bg-[var(--color-navy-950)] text-white">
        <div className="container-page py-14 md:py-20">
          <h1 className="text-4xl md:text-5xl">${title}</h1>
        </div>
      </div>

      <div className="container-page py-12 md:py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-ink)]/85">
          ${lead}
        </p>
${gateBlock}      </div>
    </section>
  );
}
`;
};

let made = 0;
for (const page of PAGES) {
  const dir = join(root, page.path);
  const file = join(dir, "page.tsx");
  if (existsSync(file)) continue;
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, tpl(page), "utf8");
  made++;
  console.log("tao " + page.path + "/page.tsx");
}
console.log("\nTong route moi: " + made);
