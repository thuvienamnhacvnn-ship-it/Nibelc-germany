import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetailView } from "@/components/industry/IndustryDetailView";
import { activeIndustries, industryBySlug, isIndexable } from "@/content/industries";
import { LOCALES, industryPath, type Locale } from "@/content/locales";
import { INDUSTRY_DETAIL, INDUSTRY_DETAIL_PAGE } from "@/content/page-industry-detail";

const LOCALE: Locale = "vi";

// Chỉ ngành đang mở được dựng; ngành bị khoá (07) trả 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return activeIndustries().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = industryBySlug(slug);
  const d = INDUSTRY_DETAIL[slug];
  if (!i || !d) return {};
  return {
    title: d.h1[LOCALE],
    description: `${d.h1[LOCALE]} – ${INDUSTRY_DETAIL_PAGE[LOCALE].sub}`,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, industryPath(l, slug)])) },
    robots: isIndexable(i) ? undefined : { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = industryBySlug(slug);
  if (!i || !isIndexable(i) || !INDUSTRY_DETAIL[slug]) notFound();
  return (
    <div lang="vi">
      <IndustryDetailView locale={LOCALE} industry={i} />
    </div>
  );
}
