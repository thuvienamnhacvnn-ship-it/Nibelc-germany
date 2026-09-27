import { activeIndustries, industryName } from "@/content/industries";
import { ROUTES, industryPath, type Locale, type PageKey } from "@/content/locales";

/**
 * MENU CHÍNH — một cây duy nhất cho cả web.
 *
 * Trước đây mỗi trang có nav riêng vì bám theo từng ảnh mẫu (mẫu 01 ghi
 * "Für Arbeitgeber", mẫu 02 ghi "Für Unternehmen", mẫu 03 lại là
 * "Für Bewerber aus Vietnam"…), nên người xem đi giữa các trang thấy menu
 * đổi liên tục. Từ nay mọi header đọc menu ở đây; ảnh mẫu chỉ còn quyết định
 * vị trí, cỡ chữ và màu.
 *
 * Thứ tự xếp theo hành trình người đọc:
 *   Trang chủ → bạn là ai (doanh nghiệp / người lao động) → ngành nghề →
 *   quy trình → kiến thức → về chúng tôi.
 *
 * Liên hệ không nằm ở cấp 1: đã có nút gọi hành động bên phải header, mục
 * trong "Về chúng tôi" và trong chân trang — để cấp 1 không có hai mục cùng
 * dẫn tới một việc.
 */

export interface MenuLink {
  label: string;
  href: string;
  /** Dòng mô tả nhỏ trong menu xổ xuống */
  desc?: string;
}

export interface MenuItem extends MenuLink {
  /** Trang tương ứng, để header biết mục nào đang mở */
  page: PageKey;
  children?: MenuLink[];
}

interface MenuWords {
  home: string;
  employers: string;
  candidates: string;
  industries: string;
  process: string;
  knowledge: string;
  about: string;
  request: string;
  contact: string;
  sub: {
    employers: [string, string][];
    candidates: [string, string][];
    knowledge: [string, string][];
    about: [string, string][];
    allIndustries: string;
  };
}

const WORDS: Record<Locale, MenuWords> = {
  de: {
    home: "Startseite",
    employers: "Für Unternehmen",
    candidates: "Für Fachkräfte",
    industries: "Branchen",
    process: "Prozess",
    knowledge: "Wissen",
    about: "Über uns",
    request: "Anfrage starten",
    contact: "Kontakt",
    sub: {
      employers: [
        ["Leistungen im Überblick", "Was wir für Ihren Betrieb übernehmen"],
        ["Ablauf der Zusammenarbeit", "Sechs Schritte von Bedarf bis Integration"],
        ["Personalbedarf melden", "Anfrage in vier Schritten senden"],
      ],
      candidates: [
        ["Aktuelle Stellenangebote", "Welche Aufträge gerade laufen"],
        ["Ihr Weg nach Deutschland", "Jede Etappe erklärt"],
        ["Branchen und Berufe", "Wo aktuell eingestellt wird"],
        ["Wissen und Ratgeber", "Antworten auf häufige Fragen"],
      ],
      knowledge: [
        ["Häufige Fragen", "Anerkennung, Visum, Sprache"],
        ["Prozess im Detail", "Wer macht wann was"],
        ["Branchenüberblick", "Berufe und Tätigkeiten"],
      ],
      about: [
        ["NIBELC Germany GmbH", "Wer hinter TalentBridge steht"],
        ["Unsere Leistungen", "Umfang der Begleitung"],
        ["Kontakt", "Ansprechpartner und Anschrift"],
      ],
      allIndustries: "Alle Branchen ansehen",
    },
  },
  en: {
    home: "Home",
    employers: "For Employers",
    candidates: "For Candidates",
    industries: "Industries",
    process: "Process",
    knowledge: "Knowledge",
    about: "About us",
    request: "Start a request",
    contact: "Contact",
    sub: {
      employers: [
        ["Services at a glance", "What we handle for your company"],
        ["How we work together", "Six steps from need to integration"],
        ["Report staffing needs", "Send a request in four steps"],
      ],
      candidates: [
        ["Current openings", "Assignments running right now"],
        ["Your path to Germany", "Every stage explained"],
        ["Industries and jobs", "Where employers are hiring"],
        ["Knowledge and advice", "Answers to common questions"],
      ],
      knowledge: [
        ["Frequently asked questions", "Recognition, visa, language"],
        ["The process in detail", "Who does what, and when"],
        ["Industry overview", "Jobs and tasks"],
      ],
      about: [
        ["NIBELC Germany GmbH", "Who is behind TalentBridge"],
        ["Our services", "Scope of our support"],
        ["Contact", "People and address"],
      ],
      allIndustries: "See all industries",
    },
  },
  vi: {
    home: "Trang chủ",
    employers: "Doanh nghiệp",
    candidates: "Người lao động",
    industries: "Ngành nghề",
    process: "Lộ trình",
    knowledge: "Kiến thức",
    about: "Về chúng tôi",
    request: "Gửi yêu cầu",
    contact: "Liên hệ",
    sub: {
      employers: [
        ["Dịch vụ tổng quan", "Chúng tôi lo những phần nào"],
        ["Cách phối hợp", "Sáu bước từ nhu cầu đến hội nhập"],
        ["Báo nhu cầu nhân sự", "Gửi yêu cầu qua bốn bước"],
      ],
      candidates: [
        ["Đơn hàng đang chạy", "Những đơn đang tuyển người"],
        ["Lộ trình sang Đức", "Giải thích từng chặng"],
        ["Ngành nghề", "Nơi đang tuyển người"],
        ["Kiến thức và tư vấn", "Giải đáp câu hỏi thường gặp"],
      ],
      knowledge: [
        ["Câu hỏi thường gặp", "Công nhận bằng, visa, tiếng Đức"],
        ["Chi tiết quy trình", "Ai làm gì, khi nào"],
        ["Tổng quan ngành nghề", "Nghề và công việc"],
      ],
      about: [
        ["NIBELC Germany GmbH", "Ai đứng sau TalentBridge"],
        ["Dịch vụ của chúng tôi", "Phạm vi đồng hành"],
        ["Liên hệ", "Người phụ trách và địa chỉ"],
      ],
      allIndustries: "Xem tất cả ngành nghề",
    },
  },
};

function pair(rows: [string, string][], hrefs: string[]): MenuLink[] {
  return rows.map(([label, desc], i) => ({ label, desc, href: hrefs[i]! }));
}

/** Menu chính, đã gắn đường dẫn theo ngôn ngữ. */
export function mainMenu(locale: Locale): MenuItem[] {
  const w = WORDS[locale];
  const r = ROUTES;

  const industryLinks: MenuLink[] = activeIndustries().map((i) => ({
    label: industryName(i, locale),
    href: industryPath(locale, i.slug),
    desc: i.berufDe,
  }));

  return [
    { page: "home", label: w.home, href: r.home[locale] },
    {
      page: "employers",
      label: w.employers,
      href: r.employers[locale],
      children: pair(w.sub.employers, [r.services[locale], r.process[locale], r.request[locale]]),
    },
    {
      page: "candidates",
      label: w.candidates,
      href: r.candidates[locale],
      children: pair(w.sub.candidates, [r.jobs[locale], r.process[locale], r.industries[locale], r.knowledge[locale]]),
    },
    {
      page: "industries",
      label: w.industries,
      href: r.industries[locale],
      children: [...industryLinks, { label: w.sub.allIndustries, href: r.industries[locale] }],
    },
    { page: "process", label: w.process, href: r.process[locale] },
    {
      page: "knowledge",
      label: w.knowledge,
      href: r.knowledge[locale],
      children: pair(w.sub.knowledge, [`${r.knowledge[locale]}#faq`, r.process[locale], r.industries[locale]]),
    },
    {
      page: "about",
      label: w.about,
      href: r.about[locale],
      children: pair(w.sub.about, [r.about[locale], r.services[locale], r.contact[locale]]),
    },
  ];
}

/**
 * Menu chính kèm đánh dấu mục đang mở.
 * `page` là trang hiện tại; trang con (ví dụ trang chi tiết ngành) truyền
 * trang cha của nó.
 */
export function navFor(locale: Locale, page: PageKey) {
  return mainMenu(locale).map((m) => ({
    label: m.label,
    href: m.href,
    active: m.page === page,
  }));
}

/** Nhãn nút gọi hành động ở góc phải header. */
export function requestLabel(locale: Locale): string {
  return WORDS[locale].request;
}

/** Nhãn "Liên hệ" dùng ở chân trang và trong các nút phụ. */
export function contactLabel(locale: Locale): string {
  return WORDS[locale].contact;
}

/** Menu con của một mục nav, dò theo đường dẫn. */
export function submenuFor(locale: Locale, href: string): MenuLink[] | undefined {
  const base = href.split("#")[0];
  return mainMenu(locale).find((m) => m.href === base)?.children;
}
