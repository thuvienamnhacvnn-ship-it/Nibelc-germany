import { ABROAD_ORDERS, COUNTRY_FLAG, COUNTRY_NAME, type CountryCode } from "@/content/jobs-abroad";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY, JOB_ORDERS } from "@/content/jobs-current";
import { STAGE } from "@/content/home-stage";
import type { Locale } from "@/content/locales";

/**
 * Danh sách thẻ cho sân khấu đơn hàng ở trang chủ.
 *
 * Gộp hai nguồn thành một kiểu duy nhất để banner không phải biết đơn nào từ
 * đâu ra: ba đơn nhà kính ở Đức (`jobs-current.ts`) và chín đơn châu Âu
 * (`jobs-abroad.ts`). Tổng cộng mười hai đơn — đúng số Sếp chốt.
 *
 * Ba ô số liệu trên thẻ lấy theo thứ tự ưu tiên những gì tin tuyển dụng có
 * ghi: số chỗ → thời hạn hợp đồng → giờ mỗi tuần → nơi làm việc → diện visa.
 * Tin không ghi thì ô đó không xuất hiện, không bịa.
 */

export interface StageFact {
  icon: string;
  value: string;
  label: string;
}

export interface StageCard {
  id: string;
  country: CountryCode;
  countryName: string;
  flag: string[];
  title: string;
  image: string;
  focus: string;
  salary: { from: number; to: number };
  facts: StageFact[];
}

const HOME_SLOT: ((slug: string) => string)[] = [
  (slug) => INDUSTRY_ASSETS[slug]?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero,
  (slug) => INDUSTRY_ASSETS[slug]?.portraitTeam ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.portraitTeam,
  (slug) => INDUSTRY_ASSETS[slug]?.detail ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.detail,
];

export function stageCards(locale: Locale): StageCard[] {
  const s = STAGE[locale];
  const c = JOBS_COPY[locale];
  const contractLabel = locale === "vi" ? "Hợp đồng" : locale === "en" ? "Contract" : "Vertrag";
  const visaLabel = c.visaLabel;

  const home: StageCard[] = JOB_ORDERS.map((j, i) => ({
    id: j.id,
    country: "de" as const,
    countryName: COUNTRY_NAME.de[locale],
    flag: COUNTRY_FLAG.de,
    title: j.title[locale],
    // Hai đơn nhà kính dùng chung một bộ ảnh KIT; lấy khác slot cho mỗi đơn
    // để trên băng chuyền không thấy đúng một người lặp lại hai lần.
    image: HOME_SLOT[i % HOME_SLOT.length]!(j.industry),
    focus: "50% 42%",
    salary: { from: j.salary.from, to: j.salary.to },
    facts: [
      { icon: "users", value: String(j.slots), label: s.facts[0] },
      { icon: "clock", value: `${j.hoursPerWeek}h`, label: s.facts[1] },
      { icon: "pin", value: String(j.locations.length), label: s.facts[2] },
    ],
  }));

  const abroad: StageCard[] = ABROAD_ORDERS.map((j) => {
    const facts: StageFact[] = [];
    if (j.slots) facts.push({ icon: "users", value: String(j.slots), label: s.facts[0] });
    facts.push({ icon: "doc", value: j.contract[locale], label: contractLabel });
    if (facts.length < 3 && j.hoursPerWeek) {
      facts.push({ icon: "clock", value: `${j.hoursPerWeek}h`, label: s.facts[1] });
    }
    if (facts.length < 3 && j.visa) {
      facts.push({ icon: "badge", value: j.visa, label: visaLabel });
    }
    return {
      id: j.id,
      country: j.country,
      countryName: COUNTRY_NAME[j.country][locale],
      flag: COUNTRY_FLAG[j.country],
      title: j.title[locale],
      image: j.image,
      focus: j.imageFocus,
      salary: j.salary,
      facts: facts.slice(0, 3),
    };
  });

  // Đơn ở Đức đứng trước, rồi tới các nước còn lại — đúng thứ tự bản mẫu.
  return [...abroad.filter((x) => x.country === "de"), ...home, ...abroad.filter((x) => x.country !== "de")];
}
