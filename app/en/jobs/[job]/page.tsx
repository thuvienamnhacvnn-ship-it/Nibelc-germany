import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { allJobIds, jobById } from "@/content/jobs-all";
import { LOCALES, jobPath, type Locale } from "@/content/locales";

const LOCALE: Locale = "en";
export const dynamicParams = false;

export function generateStaticParams() {
  return allJobIds().map((job) => ({ job }));
}

export async function generateMetadata({ params }: { params: Promise<{ job: string }> }): Promise<Metadata> {
  const { job } = await params;
  const j = jobById(LOCALE, job);
  if (!j) return {};
  return {
    title: j.title,
    description: j.summary,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, jobPath(l, job)])) },
  };
}

export default async function Page({ params }: { params: Promise<{ job: string }> }) {
  const { job } = await params;
  const j = jobById(LOCALE, job);
  if (!j) notFound();
  return (
    <div lang={LOCALE}>
      <JobDetailView locale={LOCALE} job={j} />
    </div>
  );
}
