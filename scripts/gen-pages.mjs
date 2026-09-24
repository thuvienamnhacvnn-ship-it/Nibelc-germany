/**
 * Sinh bốn trang còn lại: process, about, contact, privacy.
 * Nội dung ba ngôn ngữ nằm ngay trong trang vì đây là văn bản riêng của từng
 * trang, không dùng lại ở đâu khác.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const PAGES = {
  process: {
    key: "process",
    body: {
      vi: {
        h1: "Lộ trình sang Đức",
        lead: "Từ lúc bạn đăng ký đến ngày đi làm, hồ sơ đi qua sáu chặng. Mỗi chặng có việc của bạn và việc của NIBELC.",
      },
      de: {
        h1: "Ihr Weg nach Deutschland",
        lead: "Von der Bewerbung bis zum ersten Arbeitstag durchläuft Ihr Vorgang sechs Etappen. In jeder Etappe gibt es Ihre Aufgaben und unsere.",
      },
      en: {
        h1: "Your path to Germany",
        lead: "From your application to your first day at work, the process runs through six stages. Each stage has your tasks and ours.",
      },
    },
    steps: true,
  },
  about: {
    key: "about",
    body: {
      vi: {
        h1: "Về NIBELC",
        lead: "NIBELC Germany GmbH có trụ sở tại Berlin, kết nối người lao động với doanh nghiệp Đức và đồng hành suốt quá trình chuẩn bị, làm thủ tục và hoà nhập.",
      },
      de: {
        h1: "Über NIBELC",
        lead: "Die NIBELC Germany GmbH mit Sitz in Berlin bringt Arbeitskräfte und deutsche Betriebe zusammen und begleitet Vorbereitung, Verfahren und Integration.",
      },
      en: {
        h1: "About NIBELC",
        lead: "NIBELC Germany GmbH, based in Berlin, connects workers with German employers and supports preparation, procedures and integration.",
      },
    },
  },
  contact: {
    key: "contact",
    body: {
      vi: {
        h1: "Liên hệ",
        lead: "Gửi thông tin để NIBELC liên hệ tư vấn. Việc đăng ký không phải cam kết tuyển dụng và không thay thế thủ tục chính thức.",
      },
      de: {
        h1: "Kontakt",
        lead: "Hinterlassen Sie Ihre Daten — wir melden uns. Eine Anfrage ist keine Zusage und ersetzt kein offizielles Verfahren.",
      },
      en: {
        h1: "Contact",
        lead: "Leave your details and we will get back to you. An enquiry is not a job offer and does not replace any official procedure.",
      },
    },
    contact: true,
  },
  privacy: {
    key: "privacy",
    body: {
      vi: {
        h1: "Bảo mật dữ liệu",
        lead: "NIBELC xử lý dữ liệu cá nhân theo GDPR. Nội dung chi tiết đang được hoàn thiện cùng bộ phận pháp lý.",
      },
      de: {
        h1: "Datenschutz",
        lead: "NIBELC verarbeitet personenbezogene Daten nach der DSGVO. Die ausführliche Fassung wird derzeit rechtlich geprüft.",
      },
      en: {
        h1: "Privacy",
        lead: "NIBELC processes personal data in line with the GDPR. The full text is currently under legal review.",
      },
    },
  },
};

const tpl = (p) => {
  const bodyJson = JSON.stringify(p.body, null, 2)
    .split("\n")
    .map((l, i) => (i === 0 ? l : "  " + l))
    .join("\n");

  const stepsImport = p.steps
    ? `\nimport { WEG_NACH_DEUTSCHLAND } from "@/content/journey";`
    : "";
  const legalImport = p.contact
    ? `\nimport { LEGAL } from "@/content/legal";`
    : "";

  const stepsBlock = p.steps
    ? `
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WEG_NACH_DEUTSCHLAND.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] text-base font-bold text-white">
                {i + 1}
              </span>
              <h2 className="mt-4 text-lg">{step.title}</h2>
              <p className="mt-1 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
`
    : "";

  const contactBlock = p.contact
    ? `
        <div className="card mt-10 max-w-xl p-7">
          <p className="text-lg font-semibold text-[var(--color-ink)]">
            {LEGAL.name}
          </p>
          <address className="mt-2 not-italic">
            {LEGAL.street}
            <br />
            {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
          </address>
          <p className="mt-4">
            <a
              href={\`mailto:\${LEGAL.email}\`}
              className="text-[var(--color-brand-600)] hover:underline"
            >
              {LEGAL.email}
            </a>
            <br />
            <a href={\`tel:\${LEGAL.phone.replace(/\\s/g, "")}\`}>{LEGAL.phone}</a>
          </p>
        </div>
`
    : "";

  return `import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, isLocale, type Locale } from "@/content/locales";${stepsImport}${legalImport}

const BODY: Record<Locale, { h1: string; lead: string }> = ${bodyJson};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: BODY[locale].h1,
    description: BODY[locale].lead,
    alternates: {
      canonical: \`/\${locale}/${p.key}\`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, \`/\${l}/${p.key}\`]),
      ),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const body = BODY[locale];

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-brand-50)] to-white"
        aria-hidden="true"
      />
      <div className="container-page py-14 md:py-20">
        <h1 className="text-4xl md:text-5xl">{body.h1}</h1>
        <p className="mt-5 max-w-2xl text-lg">{body.lead}</p>
${stepsBlock}${contactBlock}      </div>
    </section>
  );
}
`;
};

for (const p of Object.values(PAGES)) {
  const dir = join(root, "app", "[locale]", p.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), tpl(p), "utf8");
  console.log("tao app/[locale]/" + p.key + "/page.tsx");
}
